import type { Component } from 'vue'
import type { FormFieldSchema } from '@exview/schema-shared'
import GroupArrayField from './components/GroupArrayField.vue'
import GroupObjectField from './components/GroupObjectField.vue'
import { getSchemaFieldConfig, registerSchemaField, registerSchemaFields } from './fieldRegistry'

type RegistryValue = string | Component

registerSchemaFields({
  input: {
    component: 'el-input',
    defaultProps: { clearable: true }
  },
  textarea: {
    component: 'el-input',
    defaultProps: { type: 'textarea', rows: 3 },
    capability: { supportsOptions: false }
  },
  'input-number': {
    component: 'el-input-number'
  },
  select: {
    component: 'el-select',
    defaultProps: { clearable: true, filterable: true },
    capability: { supportsOptions: true }
  },
  switch: {
    component: 'el-switch'
  },
  'radio-group': {
    component: 'el-radio-group',
    capability: { supportsOptions: true }
  },
  'checkbox-group': {
    component: 'el-checkbox-group',
    capability: { supportsOptions: true }
  },
  'date-picker': {
    component: 'el-date-picker'
  },
  'group-array': {
    component: GroupArrayField,
    capability: { supportsItemSchema: true }
  },
  'group-object': {
    component: GroupObjectField,
    capability: { supportsItemSchema: true }
  }
})

export function registerSchemaFormComponent(name: string, component: RegistryValue) {
  const prev = getSchemaFieldConfig(name)
  registerSchemaField(name, {
    component,
    defaultProps: prev?.defaultProps,
    defaultRuleNames: prev?.defaultRuleNames,
    capability: prev?.capability
  })
}

export function registerSchemaFormComponents(components: Record<string, RegistryValue>) {
  Object.entries(components).forEach(([name, component]) => {
    registerSchemaFormComponent(name, component)
  })
}

export function resolveSchemaFormComponent(field: FormFieldSchema): RegistryValue {
  if (field.component) {
    if (typeof field.component === 'string') {
      return getSchemaFieldConfig(field.component)?.component ?? field.component
    }
    return field.component
  }

  const key = field.widget ?? 'input'
  return getSchemaFieldConfig(key)?.component ?? key
}
