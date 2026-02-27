import { computed, reactive, ref, watch, watchEffect } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormFieldSchema, FormSchema, OptionItem } from '@exview/schema-shared'
import { getSchemaRule } from './ruleRegistry'
import { getSchemaFieldConfig } from './fieldRegistry'

function normalizeRules(schema: FormSchema): FormRules {
  const rules: FormRules = {}
  schema.fields.forEach((field) => {
    const bucket: Record<string, unknown>[] = []

    if (field.rule) {
      if (typeof field.rule === 'string') {
        const names = field.rule.split(',').map((name) => name.trim()).filter(Boolean)
        bucket.push(...names.map((name) => getSchemaRule(name)).filter(Boolean) as Record<string, unknown>[])
      } else {
        bucket.push(...field.rule)
      }
    } else {
      const fieldName = typeof field.component === 'string' ? field.component : field.widget
      const defaultRuleNames = getSchemaFieldConfig(fieldName)?.defaultRuleNames || []
      bucket.push(...defaultRuleNames.map((name) => getSchemaRule(name)).filter(Boolean) as Record<string, unknown>[])
    }

    if (bucket.length > 0) {
      rules[field.name] = bucket
    }
  })
  return rules
}

function stableSerialize(value: unknown): string {
  if (value === null || value === undefined) return String(value)
  if (typeof value !== 'object') return String(value)
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record).sort().map((k) => `${k}:${stableSerialize(record[k])}`).join(',')}}`
}

function getPersistStorage(schema: FormSchema): Storage | null {
  if (!schema.persistKey) return null
  if (typeof window === 'undefined') return null
  return schema.persistStorage === 'session' ? window.sessionStorage : window.localStorage
}

function sanitizeFieldProps(props: Record<string, unknown>) {
  const next = { ...props }
  delete next.value
  delete next.modelValue
  return next
}

export function useSchemaForm(schema: FormSchema, initialModel: Record<string, unknown> = {}) {
  const formRef = ref<FormInstance>()
  const loadingOptions = reactive<Record<string, boolean>>({})
  const fieldErrorMap = reactive<Record<string, string | null>>({})
  const asyncOptions = reactive<Record<string, OptionItem[]>>({})
  const resolvedFieldProps = reactive<Record<string, Record<string, unknown>>>({})
  const resolvedFieldVisible = reactive<Record<string, boolean>>({})
  const resolvedFieldDisabled = reactive<Record<string, boolean>>({})
  const fieldDebugMap = reactive<Record<string, string>>({})
  const resolveTokenMap = reactive<Record<string, number>>({})
  const optionsDebounceTimerMap = new Map<string, ReturnType<typeof setTimeout>>()
  const optionsCacheMap = new Map<string, OptionItem[]>()
  const validatorDebounceTimerMap = new Map<string, ReturnType<typeof setTimeout>>()
  const validatorTokenMap = reactive<Record<string, number>>({})

  const mergedInitialValues = {
    ...(schema.initialValues || {}),
    ...initialModel
  }

  const persistedStorage = getPersistStorage(schema)
  const persistedValues = (() => {
    if (!persistedStorage || !schema.persistKey) return {}
    try {
      return JSON.parse(persistedStorage.getItem(schema.persistKey) || '{}') as Record<string, unknown>
    } catch {
      return {}
    }
  })()

  const model = reactive<Record<string, unknown>>({})
  const touchedMap = reactive<Record<string, boolean>>({})
  const dirtyMap = reactive<Record<string, boolean>>({})

  schema.fields.forEach((field) => {
    const fallback = field.widget === 'checkbox-group' ? [] : ''
    model[field.name] = field.defaultValue ?? (typeof field.option === 'object' ? field.option?.value : undefined) ?? fallback
    touchedMap[field.name] = false
    dirtyMap[field.name] = false
    fieldErrorMap[field.name] = null
    fieldDebugMap[field.name] = ''
  })

  Object.assign(model, mergedInitialValues, persistedValues)

  let initialSnapshot = JSON.parse(JSON.stringify(model)) as Record<string, unknown>
  let previousSnapshot = JSON.parse(JSON.stringify(model)) as Record<string, unknown>

  const rules = computed(() => {
    const base = normalizeRules(schema)

    schema.fields.forEach((field) => {
      if (!field.validator) return
      const current = (base[field.name] as Record<string, unknown>[] | undefined) || []
      current.push({
        trigger: 'change',
        asyncValidator: async (_rule: unknown, value: unknown) => {
          const delay = Math.max(0, Number(field.validatorDebounceMs ?? 0))
          const oldTimer = validatorDebounceTimerMap.get(field.name)
          if (oldTimer) clearTimeout(oldTimer)

          const token = (validatorTokenMap[field.name] ?? 0) + 1
          validatorTokenMap[field.name] = token

          const result = await new Promise<true | string>((resolve) => {
            const run = async () => {
              const resp = await field.validator!(value, model as Record<string, unknown>)
              if (validatorTokenMap[field.name] !== token) return resolve(true)
              resolve(resp)
            }
            if (delay > 0) {
              const timer = setTimeout(() => {
                validatorDebounceTimerMap.delete(field.name)
                void run()
              }, delay)
              validatorDebounceTimerMap.set(field.name, timer)
            } else {
              void run()
            }
          })

          if (result !== true) {
            throw new Error(result || `${field.label} 校验失败`)
          }
        }
      })
      base[field.name] = current
    })

    return base
  })

  async function applyInputTransform(field: FormFieldSchema, value: unknown, values: Record<string, unknown>) {
    if (!field.transform?.input) return value
    return await field.transform.input(value, values)
  }

  async function applyOutputTransform(field: FormFieldSchema, value: unknown, values: Record<string, unknown>) {
    if (!field.transform?.output) return value
    return await field.transform.output(value, values)
  }

  function emitChanges(nextValues: Record<string, unknown>) {
    const changedFields = Object.keys(nextValues).filter((key) => previousSnapshot[key] !== nextValues[key])
    if (changedFields.length === 0) return

    const firstChanged = changedFields[0]
    schema.onValuesChange?.({ ...nextValues }, firstChanged)
    changedFields.forEach((field) => {
      schema.onFieldChange?.(field, nextValues[field], { ...nextValues })
    })

    previousSnapshot = { ...nextValues }
  }

  watch(
    model,
    () => {
      const current = model as Record<string, unknown>
      Object.keys(current).forEach((key) => {
        if (initialSnapshot[key] !== current[key]) {
          dirtyMap[key] = true
          touchedMap[key] = true
        }
      })

      emitChanges(current)

      if (persistedStorage && schema.persistKey) {
        persistedStorage.setItem(schema.persistKey, JSON.stringify(current))
      }
    },
    { deep: true }
  )

  function applyAsync<T>(
    fieldName: string,
    token: number,
    task: T | Promise<T>,
    apply: (value: T) => void,
    onFinally?: () => void
  ) {
    const start = performance.now()
    Promise.resolve(task)
      .then((value) => {
        if (resolveTokenMap[fieldName] !== token) return
        fieldErrorMap[fieldName] = null
        apply(value)
      })
      .catch((error) => {
        if (resolveTokenMap[fieldName] !== token) return
        fieldErrorMap[fieldName] = error instanceof Error ? error.message : '字段异步计算失败'
      })
      .finally(() => {
        if (resolveTokenMap[fieldName] !== token) return
        const duration = Math.round(performance.now() - start)
        fieldDebugMap[fieldName] = `deps=${(schema.fields.find((f) => f.name === fieldName)?.deps || []).join(',') || 'auto'}; cost=${duration}ms`
        onFinally?.()
      })
  }

  function scheduleOptionsLoad(
    field: FormFieldSchema,
    token: number,
    loader: (m: Record<string, unknown>) => Promise<OptionItem[]>,
    currentModel: Record<string, unknown>,
    optionProps?: Record<string, unknown>
  ) {
    const cacheKeyRaw = optionProps?.optionsCacheKey
    const cacheKey =
      typeof cacheKeyRaw === 'function'
        ? cacheKeyRaw(currentModel)
        : cacheKeyRaw

    const cacheParamsRaw = optionProps?.optionsCacheParams
    const cacheParams =
      typeof cacheParamsRaw === 'function'
        ? cacheParamsRaw(currentModel)
        : cacheParamsRaw

    if (cacheKey) {
      const mergedKey = `${cacheKey}:${stableSerialize(cacheParams)}`
      if (optionsCacheMap.has(mergedKey)) {
        asyncOptions[field.name] = optionsCacheMap.get(mergedKey) || []
        loadingOptions[field.name] = false
        return
      }

      const delay = Math.max(0, Number(field.debounceMs ?? 0))
      const oldTimer = optionsDebounceTimerMap.get(field.name)
      if (oldTimer) clearTimeout(oldTimer)
      loadingOptions[field.name] = true

      const run = () => {
        applyAsync(
          field.name,
          token,
          loader(currentModel),
          (options) => {
            const safeOptions = options || []
            asyncOptions[field.name] = safeOptions
            optionsCacheMap.set(mergedKey, safeOptions)
          },
          () => {
            loadingOptions[field.name] = false
          }
        )
      }

      if (delay <= 0) {
        run()
        return
      }

      const timer = setTimeout(() => {
        optionsDebounceTimerMap.delete(field.name)
        run()
      }, delay)
      optionsDebounceTimerMap.set(field.name, timer)
      return
    }

    const delay = Math.max(0, Number(field.debounceMs ?? 0))
    const oldTimer = optionsDebounceTimerMap.get(field.name)
    if (oldTimer) clearTimeout(oldTimer)

    loadingOptions[field.name] = true
    const run = () => {
      applyAsync(
        field.name,
        token,
        loader(currentModel),
        (options) => {
          asyncOptions[field.name] = options || []
        },
        () => {
          loadingOptions[field.name] = false
        }
      )
    }

    if (delay <= 0) {
      run()
      return
    }

    const timer = setTimeout(() => {
      optionsDebounceTimerMap.delete(field.name)
      run()
    }, delay)
    optionsDebounceTimerMap.set(field.name, timer)
  }

  function runFieldResolver(field: FormFieldSchema) {
    const token = (resolveTokenMap[field.name] ?? 0) + 1
    resolveTokenMap[field.name] = token

    const currentModel = model as Record<string, unknown>
    const fieldName = typeof field.component === 'string' ? field.component : field.widget
    const defaultFieldProps = getSchemaFieldConfig(fieldName)?.defaultProps || {}

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
        const safeProps = { ...defaultFieldProps, ...(props || {}) }
        const uiProps = sanitizeFieldProps(safeProps)
        resolvedFieldProps[field.name] = uiProps

        const directOptions = safeProps.options as OptionItem[] | undefined
        if (Array.isArray(directOptions)) {
          asyncOptions[field.name] = directOptions
        }

        const optionsLoader = safeProps.optionsLoader as ((m: Record<string, unknown>) => Promise<OptionItem[]>) | undefined
        if (optionsLoader) {
          scheduleOptionsLoad(field, token, optionsLoader, currentModel, safeProps)
        }
      })
      return
    }

    const props = { ...defaultFieldProps, ...field.option }
    resolvedFieldProps[field.name] = sanitizeFieldProps(props)

    const directOptions = props.options as OptionItem[] | undefined
    if (Array.isArray(directOptions)) {
      asyncOptions[field.name] = directOptions
    }

    const optionsLoader = props.optionsLoader as ((m: Record<string, unknown>) => Promise<OptionItem[]>) | undefined
    if (optionsLoader) {
      scheduleOptionsLoad(field, token, optionsLoader, currentModel, props)
    }
  }

  function installFieldEffect(field: FormFieldSchema) {
    if (field.deps?.length) {
      watch(
        () => field.deps!.map((key) => model[key]),
        () => runFieldResolver(field),
        { immediate: true }
      )
      return
    }

    watchEffect(() => {
      runFieldResolver(field)
    })
  }

  schema.fields.forEach(installFieldEffect)

  void setValues(mergedInitialValues).then(() => {
    initialSnapshot = JSON.parse(JSON.stringify(model)) as Record<string, unknown>
    previousSnapshot = JSON.parse(JSON.stringify(model)) as Record<string, unknown>
  })

  async function preloadOptions() {
    // watchers handle initial + reactive recompute
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

  async function setValues(values: Record<string, unknown>) {
    const nextValues = { ...model, ...values }
    for (const field of schema.fields) {
      if (!(field.name in values)) continue
      const transformed = await applyInputTransform(field, values[field.name], nextValues)
      model[field.name] = transformed
      nextValues[field.name] = transformed
    }
  }

  function getValues() {
    return { ...model }
  }

  const isDirty = computed(() => Object.values(dirtyMap).some(Boolean))
  const isTouched = computed(() => Object.values(touchedMap).some(Boolean))

  async function validateField(field: string) {
    if (!formRef.value) return false
    try {
      await formRef.value.validateField(field)
      return true
    } catch {
      return false
    }
  }

  async function isValid() {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  async function getOutputValues() {
    const output = { ...model }
    for (const field of schema.fields) {
      output[field.name] = await applyOutputTransform(field, output[field.name], output)
    }
    return output
  }

  const resetFields = async () => {
    await setValues(initialSnapshot)
    Object.keys(dirtyMap).forEach((k) => {
      dirtyMap[k] = false
      touchedMap[k] = false
    })
    formRef.value?.clearValidate()
  }

  const reset = resetFields

  const submit = async () => {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) {
      throw new Error('表单校验失败')
    }

    let payload = await getOutputValues()
    if (schema.validate) {
      payload = await schema.validate(payload, 'submit')
    }
    return payload
  }

  return {
    formRef,
    model,
    rules,
    loadingOptions,
    fieldLoadingMap: loadingOptions,
    fieldErrorMap,
    fieldDebugMap,
    touchedMap,
    dirtyMap,
    isDirty,
    isTouched,
    isValid,
    preloadOptions,
    getFieldOptions,
    resolveFieldProps,
    resolveFieldVisible,
    resolveFieldDisabled,
    setValues,
    getValues,
    getOutputValues,
    validateField,
    resetFields,
    reset,
    submit
  }
}
