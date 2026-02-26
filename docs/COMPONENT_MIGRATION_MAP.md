# 旧组件迁移映射（Vue2/iView -> Vue3/Element Plus）

## 页面层（src/view）

- `src/view/form/form.vue` -> `apps/web/src/views/FormView.vue`
  - 旧：`exv-form` + schema fields
  - 新：`el-form` + `el-input` / `el-input-number`

- `src/view/table/table.vue` -> `apps/web/src/views/TableView.vue`
  - 旧：`exv-table` + columns + store.delete
  - 新：`el-table` + 操作列删除 + mock API

- `src/view/menu/menu.vue` -> `apps/web/src/views/MenuView.vue`
  - 旧：`exv-menu` + slot
  - 新：`el-collapse` + `el-tag`

- `src/view/toolbar/toolbar.vue` -> `apps/web/src/views/ToolbarView.vue`
  - 旧：`exv-toolbar` + signal
  - 新：`el-button` 组合 + signal 状态

## 组件层（src/components）

> 当前策略：优先迁移“页面能力”，再按复用度沉淀组件。

- `Form/Form.vue`、`Form/FormItem.vue`
  - 迁移状态：已被页面内 `el-form` 组合替代
  - 后续：如多页面重复，抽离为 `apps/web/src/components/business/ExForm.vue`

- `Table/Table.vue`
  - 迁移状态：已被 `el-table` 替代
  - 后续：抽离 `ExTable.vue` 支持统一列配置

- `Menu/*`
  - 迁移状态：已由 `el-menu`/`el-collapse` 替代
  - 后续：抽象菜单数据模型与渲染器

- `Toolbar/Toolbar.vue`
  - 迁移状态：已在页面内完成行为迁移
  - 后续：抽象操作按钮组组件

- `widgets/Input.vue`
  - 迁移状态：由 `el-input` 替代

## API/数据层

- 旧 `src/api/*`：历史实现保留
- 新 `apps/web/src/mock/users.ts`：当前迁移阶段使用 mock
- 后续：补充 `apps/web/src/services`，再逐步替换 mock

## 测试层

- 组件视图测试：
  - `apps/web/src/components/AppHeader.spec.ts`
  - `apps/web/src/components/FormView.spec.ts`
- 数据层测试：
  - `apps/web/src/mock/users.spec.ts`
