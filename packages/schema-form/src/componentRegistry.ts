import type { Component } from 'vue'
import type { FormFieldSchema } from '@exview/schema-shared'

type RegistryValue = string | Component

const registry = new Map<string, RegistryValue>([
  ['input', 'el-input'],
  ['input-number', 'el-input-number'],
  ['select', 'el-select']
])

export function registerSchemaFormComponent(name: string, component: RegistryValue) {
  registry.set(name, component)
}

export function registerSchemaFormComponents(components: Record<string, RegistryValue>) {
  Object.entries(components).forEach(([name, component]) => {
    registerSchemaFormComponent(name, component)
  })
}

export function resolveSchemaFormComponent(field: FormFieldSchema): RegistryValue {
  if (field.component) {
    if (typeof field.component === 'string') {
      return registry.get(field.component) ?? field.component
    }
    return field.component
  }

  const key = field.widget ?? 'input'
  return registry.get(key) ?? key
}
