import type { FormRules } from 'element-plus'

export type SchemaWidget = 'input' | 'input-number' | 'select'

export interface OptionItem {
  label: string
  value: string | number
}

export interface FormFieldSchema {
  label: string
  name: string
  widget: SchemaWidget
  rule?: string | Array<Record<string, unknown>>
  option?: Record<string, unknown> & {
    value?: unknown
    options?: OptionItem[]
  }
}

export interface ToolbarAction {
  text: string
  signal: string
  type?: '' | 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  validate?: boolean
}

export interface FormSchema {
  fields: FormFieldSchema[]
  toolbar?: string | ToolbarAction[]
  validate?: (model: Record<string, unknown>, signal: string) => Promise<Record<string, unknown>> | Record<string, unknown>
}

export interface TableColumnSchema {
  key: string
  title: string
  width?: number
}

export interface TableSchema<T extends Record<string, unknown>> {
  columns: TableColumnSchema[]
  data: T[] | (() => Promise<T[]>)
  rowKey?: string
  localPage?: boolean
  pageSize?: number
}

export type FormRuleMap = FormRules
