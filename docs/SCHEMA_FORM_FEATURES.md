# SchemaForm 新增能力说明

## 1) 字段级异步校验
- `validator(value, values)` 返回 `true | string`
- `validatorDebounceMs` 支持防抖
- 内置过期请求忽略（token）

## 2) 嵌套 schema
- `group-array` 支持 `itemSchema`
- `group-object` 支持 `itemSchema`
- 用于构建嵌套对象/数组结构

## 3) Slot / Render 扩展
- `label-${field.name}`
- `extra-${field.name}`
- `suffix-${field.name}`
- `footer`

## 4) 表单状态 API
通过 `SchemaForm` ref 暴露：
- `isDirty`
- `isTouched`
- `isValid()`
- `validateField(field)`
- `setValues/getValues/getOutputValues/resetFields/submit`

## 5) 持久化能力
- `persistKey`
- `persistStorage: 'local' | 'session'`

## 6) 布局增强
- `span` 支持响应式对象：`{ xs, sm, md, lg, xl }`
- `row: true` 独占整行

## 7) 用例
- 基础：`/schema-examples`
- 动态：`/schema-dynamic`
- 高级：`/schema-advanced`
