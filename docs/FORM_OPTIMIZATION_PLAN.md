# Form 优化执行计划（SchemaForm）

## 目标
提升 schema-form 在复杂联动场景下的性能、可控性与可维护性，并保留分步提交痕迹。

## Step 1 - 字段依赖显式声明（deps）
- 在 schema 类型中新增 `deps?: string[]`
- 当存在 `deps` 时，仅监听这些 model 字段触发对应 field 的异步解析
- 不设置 `deps` 时继续使用 `watchEffect` 自动依赖收集（向后兼容）

## Step 2 - optionsLoader 防抖（debounceMs）
- 在 schema 类型中新增 `debounceMs?: number`
- 对 `optionsLoader` 执行做字段级防抖
- 结合 token 防乱序覆盖，避免输入时请求风暴

## Step 3 - 渲染层 props 缓存复用
- 在 `SchemaForm.vue` 中将每个字段的 props 计算一次缓存后复用
- 避免模板里对同字段重复执行 `resolveFieldProps`

## 验证
- `pnpm --filter @exview/web test`
- `pnpm --filter @exview/web build`

## 交付方式
每个 Step 独立 commit，保证可追踪、可回滚。
