import type { Component } from 'vue'

export interface FieldCapability {
  supportsOptions?: boolean
  supportsItemSchema?: boolean
}

export interface FieldRegistryConfig {
  component: string | Component
  defaultProps?: Record<string, unknown>
  defaultRuleNames?: string[]
  capability?: FieldCapability
}

const fieldRegistry = new Map<string, FieldRegistryConfig>()

export function registerSchemaField(name: string, config: FieldRegistryConfig) {
  fieldRegistry.set(name, config)
}

export function registerSchemaFields(configs: Record<string, FieldRegistryConfig>) {
  Object.entries(configs).forEach(([name, config]) => {
    registerSchemaField(name, config)
  })
}

export function getSchemaFieldConfig(name?: string) {
  if (!name) return undefined
  return fieldRegistry.get(name)
}

export function getSchemaFieldRegistry() {
  return new Map(fieldRegistry)
}
