# SchemaForm 规则注册与优先级

## 目标

让表单规则支持三层来源并可覆盖：

1. **Global 规则**（默认内置/全局注册）
2. **Runtime 规则**（运行时注册，适合页面级增强）
3. **Local 规则**（schema 内 `ruleMap`，单表单定制）

## API

来自 `@exview/schema-form`：

- `registerSchemaRule(name, rule, scope?)`
  - `scope`: `'global' | 'runtime'`，默认 `global`
- `getSchemaRule(name, localRuleMap?)`
- `getSchemaRuleMap()`
- `getRuntimeSchemaRuleMap()`
- `clearRuntimeSchemaRules()`

## 优先级

同名规则命中顺序：

`local(ruleMap) > runtime > global`

即：
- 某个页面/某张表单可用 `ruleMap` 覆盖全局行为
- 运行时规则可在不改全局规则的情况下做临时增强

## 用法示例

### 1) 注册运行时规则

```ts
import { registerSchemaRule } from '@exview/schema-form'

registerSchemaRule(
  'strongRequired',
  { required: true, message: '该字段必须填写(运行时规则)', trigger: 'blur' },
  'runtime'
)
```

### 2) 在 schema 中使用

```ts
const schema: FormSchema = {
  fields: [
    { label: '用户名', name: 'username', widget: 'input', rule: 'strongRequired' }
  ]
}
```

### 3) 局部覆盖（最高优先级）

```ts
const schema: FormSchema = {
  ruleMap: {
    strongRequired: { required: true, message: '本表单专用提示', trigger: 'change' }
  },
  fields: [
    { label: '用户名', name: 'username', widget: 'input', rule: 'strongRequired' }
  ]
}
```

## 建议

- 业务通用规则放 global
- 页面实验/临时策略放 runtime
- 单表单差异化提示放 local(ruleMap)
