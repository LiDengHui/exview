import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormFieldSchema, FormSchema, OptionItem, ToolbarAction } from '@exview/schema-shared'

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

async function resolveMaybeAsync<T>(value: T | Promise<T>): Promise<T> {
  return await value
}

export function useSchemaForm(schema: FormSchema, initialModel: Record<string, unknown> = {}) {
  const formRef = ref<FormInstance>()
  const loadingOptions = reactive<Record<string, boolean>>({})
  const asyncOptions = reactive<Record<string, OptionItem[]>>({})
  const resolvedFieldProps = reactive<Record<string, Record<string, unknown>>>({})
  const resolvedFieldVisible = reactive<Record<string, boolean>>({})
  const resolvedFieldDisabled = reactive<Record<string, boolean>>({})
  const resolveTokenMap = reactive<Record<string, number>>({})

  const model = reactive<Record<string, unknown>>({ ...initialModel })

  schema.fields.forEach((field) => {
    if (model[field.name] !== undefined) return
    const fallback = field.widget === 'checkbox-group' ? [] : ''
    model[field.name] = field.defaultValue ?? (typeof field.option === 'object' ? field.option?.value : undefined) ?? fallback
  })

  const rules = computed(() => normalizeRules(schema))
  const toolbar = computed(() => resolveToolbar(schema.toolbar))

  async function resolveFieldState(field: FormFieldSchema) {
    const token = (resolveTokenMap[field.name] ?? 0) + 1
    resolveTokenMap[field.name] = token

    const currentModel = model as Record<string, unknown>

    const visibleResult = typeof field.visible === 'function' ? await resolveMaybeAsync(field.visible(currentModel)) : field.visible
    if (resolveTokenMap[field.name] !== token) return
    resolvedFieldVisible[field.name] = visibleResult ?? true

    const disabledResult = typeof field.disabled === 'function' ? await resolveMaybeAsync(field.disabled(currentModel)) : field.disabled
    if (resolveTokenMap[field.name] !== token) return
    resolvedFieldDisabled[field.name] = disabledResult ?? false

    let optionProps: Record<string, unknown> = {}
    if (field.option) {
      optionProps = typeof field.option === 'function'
        ? await resolveMaybeAsync(field.option(currentModel))
        : { ...field.option }
    }
    if (resolveTokenMap[field.name] !== token) return

    resolvedFieldProps[field.name] = optionProps

    const directOptions = optionProps.options as OptionItem[] | undefined
    if (Array.isArray(directOptions)) {
      asyncOptions[field.name] = directOptions
    }

    const optionsLoader = optionProps.optionsLoader as ((m: Record<string, unknown>) => Promise<OptionItem[]>) | undefined
    if (optionsLoader) {
      loadingOptions[field.name] = true
      try {
        const options = await optionsLoader(currentModel)
        if (resolveTokenMap[field.name] !== token) return
        asyncOptions[field.name] = options
      } finally {
        loadingOptions[field.name] = false
      }
    }
  }

  async function refreshFieldStates() {
    await Promise.all(schema.fields.map((field) => resolveFieldState(field)))
  }

  async function preloadOptions() {
    await refreshFieldStates()
  }

  watch(model, () => {
    void refreshFieldStates()
  }, { deep: true, immediate: true })

  function getFieldOptions(field: FormFieldSchema) {
    return asyncOptions[field.name] || []
  }

  function resolveFieldProps(field: FormFieldSchema, _model?: Record<string, unknown>) {
    return resolvedFieldProps[field.name] || {}
  }

  function resolveFieldVisible(field: FormFieldSchema, _model?: Record<string, unknown>) {
    return resolvedFieldVisible[field.name] ?? true
  }

  function resolveFieldDisabled(field: FormFieldSchema, _model?: Record<string, unknown>) {
    return resolvedFieldDisabled[field.name] ?? false
  }

  const reset = () => {
    schema.fields.forEach((field) => {
      const fallback = field.widget === 'checkbox-group' ? [] : ''
      model[field.name] = field.defaultValue ?? (typeof field.option === 'object' ? field.option?.value : undefined) ?? fallback
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
