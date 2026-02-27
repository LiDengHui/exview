import { computed, reactive, ref, watchEffect } from 'vue'
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

  function applyAsync<T>(
    fieldName: string,
    token: number,
    task: T | Promise<T>,
    apply: (value: T) => void,
    onFinally?: () => void
  ) {
    Promise.resolve(task)
      .then((value) => {
        if (resolveTokenMap[fieldName] !== token) return
        apply(value)
      })
      .catch(() => {
        // keep previous value on async error
      })
      .finally(() => {
        if (resolveTokenMap[fieldName] !== token) return
        onFinally?.()
      })
  }

  function installFieldEffect(field: FormFieldSchema) {
    watchEffect(() => {
      const token = (resolveTokenMap[field.name] ?? 0) + 1
      resolveTokenMap[field.name] = token

      const currentModel = model as Record<string, unknown>

      if (field.visible === undefined) {
        resolvedFieldVisible[field.name] = true
      } else if (typeof field.visible === 'function') {
        applyAsync(field.name, token, field.visible(currentModel), (v) => {
          resolvedFieldVisible[field.name] = v ?? true
        })
      } else {
        resolvedFieldVisible[field.name] = field.visible
      }

      if (field.disabled === undefined) {
        resolvedFieldDisabled[field.name] = false
      } else if (typeof field.disabled === 'function') {
        applyAsync(field.name, token, field.disabled(currentModel), (v) => {
          resolvedFieldDisabled[field.name] = v ?? false
        })
      } else {
        resolvedFieldDisabled[field.name] = field.disabled
      }

      if (!field.option) {
        resolvedFieldProps[field.name] = {}
        return
      }

      if (typeof field.option === 'function') {
        applyAsync(field.name, token, field.option(currentModel), (props) => {
          resolvedFieldProps[field.name] = props || {}

          const directOptions = props?.options as OptionItem[] | undefined
          if (Array.isArray(directOptions)) {
            asyncOptions[field.name] = directOptions
          }

          const optionsLoader = props?.optionsLoader as ((m: Record<string, unknown>) => Promise<OptionItem[]>) | undefined
          if (optionsLoader) {
            loadingOptions[field.name] = true
            applyAsync(
              field.name,
              token,
              optionsLoader(currentModel),
              (options) => {
                asyncOptions[field.name] = options || []
              },
              () => {
                loadingOptions[field.name] = false
              }
            )
          }
        })
      } else {
        const props = { ...field.option }
        resolvedFieldProps[field.name] = props

        const directOptions = props.options as OptionItem[] | undefined
        if (Array.isArray(directOptions)) {
          asyncOptions[field.name] = directOptions
        }

        const optionsLoader = props.optionsLoader as ((m: Record<string, unknown>) => Promise<OptionItem[]>) | undefined
        if (optionsLoader) {
          loadingOptions[field.name] = true
          applyAsync(
            field.name,
            token,
            optionsLoader(currentModel),
            (options) => {
              asyncOptions[field.name] = options || []
            },
            () => {
              loadingOptions[field.name] = false
            }
          )
        }
      }
    })
  }

  schema.fields.forEach(installFieldEffect)

  async function preloadOptions() {
    // watchEffect already handles initial + reactive recompute
  }

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
