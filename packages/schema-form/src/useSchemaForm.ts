import { computed, reactive, ref, watch, watchEffect } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormFieldSchema, FormSchema, OptionItem, ToolbarAction } from '@exview/schema-shared'
import { getSchemaRule } from './ruleRegistry'

const defaultToolbarMap: Record<string, ToolbarAction> = {
  submit: { text: '提交', signal: 'submit', type: 'primary', validate: true },
  reset: { text: '重置', signal: 'reset', type: 'default' }
}

function normalizeRules(schema: FormSchema): FormRules {
  const rules: FormRules = {}
  schema.fields.forEach((field) => {
    if (!field.rule) return

    if (typeof field.rule === 'string') {
      const names = field.rule.split(',').map((name) => name.trim()).filter(Boolean)
      rules[field.name] = names.map((name) => getSchemaRule(name)).filter(Boolean)
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

function stableSerialize(value: unknown): string {
  if (value === null || value === undefined) return String(value)
  if (typeof value !== 'object') return String(value)
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record).sort().map((k) => `${k}:${stableSerialize(record[k])}`).join(',')}}`
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

  const mergedInitialValues = {
    ...(schema.initialValues || {}),
    ...initialModel
  }

  const model = reactive<Record<string, unknown>>({ ...mergedInitialValues })

  schema.fields.forEach((field) => {
    if (model[field.name] === undefined) {
      const fallback = field.widget === 'checkbox-group' ? [] : ''
      model[field.name] = field.defaultValue ?? (typeof field.option === 'object' ? field.option?.value : undefined) ?? fallback
    }
    fieldErrorMap[field.name] = null
    fieldDebugMap[field.name] = ''
  })

  const initialSnapshot = JSON.parse(JSON.stringify(model)) as Record<string, unknown>
  let previousSnapshot = JSON.parse(JSON.stringify(model)) as Record<string, unknown>

  const rules = computed(() => normalizeRules(schema))
  const toolbar = computed(() => resolveToolbar(schema.toolbar))

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
      emitChanges(model as Record<string, unknown>)
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
        const safeProps = props || {}
        resolvedFieldProps[field.name] = safeProps

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

    const props = { ...field.option }
    resolvedFieldProps[field.name] = props

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

  function setValues(values: Record<string, unknown>) {
    Object.keys(values).forEach((key) => {
      model[key] = values[key]
    })
  }

  function getValues() {
    return { ...model }
  }

  const resetFields = () => {
    Object.keys(initialSnapshot).forEach((key) => {
      model[key] = initialSnapshot[key]
    })
    formRef.value?.clearValidate()
  }

  const reset = resetFields

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
    fieldLoadingMap: loadingOptions,
    fieldErrorMap,
    fieldDebugMap,
    preloadOptions,
    getFieldOptions,
    resolveFieldProps,
    resolveFieldVisible,
    resolveFieldDisabled,
    setValues,
    getValues,
    resetFields,
    reset,
    submit
  }
}
