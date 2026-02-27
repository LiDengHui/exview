import type { FormSchema, TableSchema } from './types'
import type { UserItem } from '../mock/users'

export const userFormSchema: FormSchema = {
  fields: [
    { label: '姓名', rule: 'required', name: 'name', widget: 'input', option: { placeholder: '姓名', value: '' } },
    { label: '年龄', rule: 'requiredNum', name: 'age', widget: 'input-number', option: { min: 0, max: 100, value: 18 } },
    { label: '电话', rule: 'required,phone', name: 'phone', widget: 'input', option: { placeholder: '电话', value: '' } },
    { label: '邮箱', rule: 'required,email', name: 'email', widget: 'input', option: { placeholder: '邮箱', value: '' } }
  ],
  toolbar: 'submit,reset'
}

export const userTableSchema: TableSchema<UserItem> = {
  rowKey: 'id',
  localPage: true,
  pageSize: 10,
  columns: [
    { key: 'name', title: 'Name' },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'phone', title: 'Phone' },
    { key: 'email', title: 'Email' }
  ],
  data: []
}
