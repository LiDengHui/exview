# SchemaForm 性能可观测说明

## 目标

提供字段级性能观测，快速定位慢字段（resolver / optionsLoader / validator）。

## 数据来源

`useSchemaForm` 暴露 `fieldPerfMap`，每个字段包含：

- `resolverMs` / `resolverCount`
- `optionsMs` / `optionsCount`
- `validatorMs` / `validatorCount`

## Debug 面板

`SchemaForm` 的 debug snapshot 已包含：

- `perf`：全量字段性能统计
- `topSlowFields`：按总耗时排序的 Top5

## 非 debug 页用法

可在业务页面直接通过 ref 读取 `fieldPerfMap`，并用 `FieldPerfTop` 展示：

```vue
<FieldPerfTop :perf-map="formRef?.fieldPerfMap || {}" :top-n="3" title="慢字段Top3" />
```

组件路径：

- `apps/web/src/components/perf/FieldPerfTop.vue`

## 建议

- 开发联调阶段默认开启（便于发现慢规则/慢加载）
- 生产环境可按需显示，避免噪音
