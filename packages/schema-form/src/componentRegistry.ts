import type { Component } from 'vue'
import type { FormFieldSchema } from '@exview/schema-shared'
import GroupArrayField from './components/GroupArrayField.vue'
import GroupObjectField from './components/GroupObjectField.vue'

type RegistryValue = string | Component

const registry = new Map<string, RegistryValue>([
  ['input', 'el-input'],
  ['textarea', 'el-input'],
  ['input-number', 'el-input-number'],
  ['select', 'el-select'],
  ['switch', 'el-switch'],
  ['radio-group', 'el-radio-group'],
  ['checkbox-group', 'el-checkbox-group'],
  ['date-picker', 'el-date-picker'],
  ['group-array', GroupArrayField],
  ['group-object', GroupObjectField]
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
