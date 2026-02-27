import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormFieldSchema, FormSchema, OptionItem, ToolbarAction } from '@exview/schema-shared'
import { resolveFieldDisabled, resolveFieldProps, resolveFieldVisible } from '@exview/schema-shared'

const defaultToolbarMap: Record<string, ToolbarAction> = {
  submit: { text: '提交', signal: 'submit', type: 'primary', validate: true },
  reset: { text: '重置', signal: 'reset', type: 'default' }
}

const namedRuleMap: Record<string, Record<string, unknown>> = {
  required: { required: true, message: '该字段为必填项', trigger: 'blur' },
  requiredNum: { required: true, type: 'number', message: '请输入数字', trigger: 'change' },
  email: { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  phone: {
    pattern: /^1\d{10}$/,
    message: '手机号格式不正确',
    trigger: 'blur'
  }
}

function normalizeRules(schema: FormSchema): FormRules {
  const rules: FormRules = {}
  schema.fields.forEach((field) => {
    if (!field.rule) return

    if (typeof field.rule === 'string') {
      const names = field.rule.split(',').map((name) => name.trim()).filter(Boolean)
      rules[field.name] = names.map((name) => namedRuleMap[name]).filter(Boolean)
      return
    }

    rules[field.name] = field.rule
  })
  return rules
}

function resolveToolbar(toolbar?: FormSchema['toolbar']): ToolbarAction[] {
  if (!toolbar) return [defaultToolbarMap.submit, defaultToolbarMap.reset]
  if (Array.isArray(toolbar)) return toolbar

  return toolbar
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean)
    .map((key) => defaultToolbarMap[key])
    .filter(Boolean)
}

export function useSchemaForm(schema: FormSchema, initialModel: Record<string, unknown> = {}) {
  const formRef = ref<FormInstance>()
  const loadingOptions = reactive<Record<string, boolean>>({})
  const asyncOptions = reactive<Record<string, OptionItem[]>>({})
  const model = reactive<Record<string, unknown>>({ ...initialModel })

  schema.fields.forEach((field) => {
    if (model[field.name] !== undefined) return
    model[field.name] = field.defaultValue ?? (typeof field.option === 'object' ? field.option?.value : undefined) ?? ''
  })

  const rules = computed(() => normalizeRules(schema))
  const toolbar = computed(() => resolveToolbar(schema.toolbar))

  async function loadFieldOptions(field: FormFieldSchema) {
    if (typeof field.option !== 'object' || !field.option?.optionsLoader) return
    loadingOptions[field.name] = true
    try {
      asyncOptions[field.name] = await field.option.optionsLoader(model)
    } finally {
      loadingOptions[field.name] = false
    }
  }

  async function preloadOptions() {
    await Promise.all(schema.fields.map((field) => loadFieldOptions(field)))
  }

  function getFieldOptions(field: FormFieldSchema) {
    if (asyncOptions[field.name]) return asyncOptions[field.name]
    const props = resolveFieldProps(field, model)
    return (props.options as OptionItem[] | undefined) || []
  }

  const reset = () => {
    schema.fields.forEach((field) => {
      model[field.name] = field.defaultValue ?? (typeof field.option === 'object' ? field.option?.value : undefined) ?? ''
    })
    formRef.value?.clearValidate()
  }

  const submit = async () => {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) {
      throw new Error('表单校验失败')
    }

    let payload = { ...model }
    if (schema.validate) {
      payload = await schema.validate(payload, 'submit')
    }
    return payload
  }

  return {
    formRef,
    model,
    rules,
    toolbar,
    loadingOptions,
    preloadOptions,
    getFieldOptions,
    resolveFieldProps,
    resolveFieldVisible,
    resolveFieldDisabled,
    reset,
    submit
  }
}
