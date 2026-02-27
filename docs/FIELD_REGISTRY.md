# Field Registry (Day 3)

SchemaForm now supports field registry metadata so component defaults and capabilities are centralized.

## API
- `registerSchemaField(name, config)`
- `registerSchemaFields(record)`
- `getSchemaFieldConfig(name)`
- `getSchemaFieldRegistry()`

## Config
```ts
{
  component: 'el-input' | VueComponent,
  defaultProps?: Record<string, unknown>,
  defaultRuleNames?: string[],
  capability?: {
    supportsOptions?: boolean,
    supportsItemSchema?: boolean
  }
}
```

## Behavior
- `useSchemaForm` merges `defaultProps` with field `option`.
- When field has no `rule`, it will fallback to `defaultRuleNames`.
- `resolveSchemaFormComponent` resolves from the same registry.
