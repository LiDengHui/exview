import type { FormRules } from 'element-plus'
import type { Component, VNodeChild } from 'vue'

export type SchemaWidget =
  | 'input'
  | 'textarea'
  | 'input-number'
  | 'select'
  | 'switch'
  | 'radio-group'
  | 'checkbox-group'
  | 'date-picker'
  | 'group-array'
  | 'group-object'
  | (string & {})

export interface OptionItem {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export type MaybePromise<T> = T | Promise<T>

export type DynamicProps =
  | Record<string, unknown>
  | ((model: Record<string, unknown>) => MaybePromise<Record<string, unknown>>)

export interface FormFieldTransform {
  input?: (value: unknown, values: Record<string, unknown>) => MaybePromise<unknown>
  output?: (value: unknown, values: Record<string, unknown>) => MaybePromise<unknown>
}

export type FieldCondition =
  | ((values: Record<string, unknown>) => MaybePromise<boolean>)
  | {
      field: string
      equals?: unknown
      notEquals?: unknown
      in?: unknown[]
      truthy?: boolean
    }

export interface ResponsiveSpan {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export interface FormFieldSchema {
  label: string
  name: string
  widget?: SchemaWidget
  component?: string | Component
  span?: number | ResponsiveSpan
  row?: boolean
  group?: string
  rule?: string | Array<Record<string, unknown>>
  defaultValue?: unknown
  transform?: FormFieldTransform
  validator?: (value: unknown, values: Record<string, unknown>) => MaybePromise<true | string>
  validatorDebounceMs?: number
  itemSchema?: FormFieldSchema[]
  minItems?: number
  maxItems?: number
  minFields?: number
  maxFields?: number
  itemDefault?: unknown
  help?: string
  extra?: string
  visibleWhen?: FieldCondition
  disabledWhen?: FieldCondition
  requiredWhen?: FieldCondition
  option?: DynamicProps & {
    value?: unknown
    options?: OptionItem[]
    optionsLoader?: (model: Record<string, unknown>) => Promise<OptionItem[]>
    optionsCacheKey?: string | ((model: Record<string, unknown>) => string)
    optionsCacheParams?: unknown | ((model: Record<string, unknown>) => unknown)
  }
  visible?: boolean | ((model: Record<string, unknown>) => MaybePromise<boolean>)
  visibleMode?: 'show' | 'if'
  disabled?: boolean | ((model: Record<string, unknown>) => MaybePromise<boolean>)
  deps?: string[]
  debounceMs?: number
}

export interface ToolbarAction {
  text: string
  signal: string
  type?: '' | 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  validate?: boolean
  confirm?: string
  disabled?: boolean
}

export interface FormSchema {
  schemaVersion?: number
  fields: FormFieldSchema[]
  initialValues?: Record<string, unknown>
  persistKey?: string
  persistStorage?: 'local' | 'session'
  debug?: boolean
  collapsedGroups?: string[]
  onValuesChange?: (values: Record<string, unknown>, changedField?: string) => void
  onFieldChange?: (field: string, value: unknown, values: Record<string, unknown>) => void
  validate?: (model: Record<string, unknown>, signal: string) => Promise<Record<string, unknown>> | Record<string, unknown>
  ruleMap?: Record<string, Record<string, unknown>>
}

export interface TableColumnSchema<T extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof T | string
  title: string
  width?: number
  formatter?: (row: T, value: unknown, index: number) => unknown
}

export interface TableSchema<T extends Record<string, unknown>> {
  columns: TableColumnSchema<T>[]
  data: T[] | (() => Promise<T[]>)
  rowKey?: string
  localPage?: boolean
  pageSize?: number
}

export type FormRuleMap = FormRules
