import type { FormFieldSchema } from './types'

export function resolveDynamic<T>(value: T | ((model: Record<string, unknown>) => T), model: Record<string, unknown>): T {
  if (typeof value === 'function') {
    return (value as (model: Record<string, unknown>) => T)(model)
  }
  return value
}

export function resolveFieldProps(field: FormFieldSchema, model: Record<string, unknown>) {
  const option = field.option
  if (!option) return {}
  if (typeof option === 'function') return option(model)
  return { ...option }
}

export function resolveFieldVisible(field: FormFieldSchema, model: Record<string, unknown>) {
  if (field.visible === undefined) return true
  return typeof field.visible === 'function' ? field.visible(model) : field.visible
}

export function resolveFieldDisabled(field: FormFieldSchema, model: Record<string, unknown>) {
  if (field.disabled === undefined) return false
  return typeof field.disabled === 'function' ? field.disabled(model) : field.disabled
}
