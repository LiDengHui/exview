import type { FormRules } from 'element-plus'
import type { Component } from 'vue'

export type SchemaWidget =
  | 'input'
  | 'textarea'
  | 'input-number'
  | 'select'
  | 'switch'
  | 'radio-group'
  | 'checkbox-group'
  | 'date-picker'
  | (string & {})

export interface OptionItem {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export type DynamicProps = Record<string, unknown> | ((model: Record<string, unknown>) => Record<string, unknown>)

export interface FormFieldSchema {
  label: string
  name: string
  widget?: SchemaWidget
  component?: string | Component
  rule?: string | Array<Record<string, unknown>>
  defaultValue?: unknown
  option?: DynamicProps & {
    value?: unknown
    options?: OptionItem[]
    optionsLoader?: (model: Record<string, unknown>) => Promise<OptionItem[]>
  }
  visible?: boolean | ((model: Record<string, unknown>) => boolean)
  disabled?: boolean | ((model: Record<string, unknown>) => boolean)
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
