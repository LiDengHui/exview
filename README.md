# exview (modernized)

该项目已从旧版 Vue2 + webpack 结构改造成 **Vue3 + Vite + pnpm workspace**。

## 技术栈

- Vue 3
- Vite 7
- pnpm workspace
- Element Plus（现代组件库）
- Pinia + Vue Router
- Vitest + Vue Test Utils

## 目录结构

- `apps/web`: 主前端应用（Vue3 + Vite）
- `docs/REFACTOR_PLAN.md`: 改造计划
- `docs/REFACTOR_LOG.md`: 执行日志（逐步记录）
- `src/` 等旧目录：当前保留为历史参考（后续按模块继续迁移）

## 启动与构建

```bash
pnpm install
pnpm dev
pnpm -r build
pnpm -r test
```

## 迁移说明

1. 工程底座已切换到 workspace + Vite，可在 Node 22 环境安装与运行。
2. 旧依赖（phantomjs/chromedriver/node-sass/webpack3）不再作为主构建链。
3. 已提供示例页面（首页、表单、表格）作为迁移承载点。
4. 后续将按业务需求把旧 `src/view`、`src/components` 模块分批迁移到 `apps/web/src`。


## 迁移映射与后续

- 组件/页面迁移映射：`docs/COMPONENT_MIGRATION_MAP.md`
- 下一阶段清单：`docs/NEXT_ACTIONS.md`

## 当前进度

- Batch A（工程基础改造）：已完成
- Batch B（核心模块迁移）：已完成首批（Form/Table/Menu/Toolbar）
- Batch C（细节修复与收尾）：进行中


## Legacy 清理

- 旧版 Vue2/webpack 目录与配置已移除（`build/`, `config/`, `src/`, `test/` 等）。
- 当前仅保留现代化工程结构（`apps/web`）与迁移文档（`docs/*`）。


## 环境变量

复制 `apps/web/.env.example` 为 `apps/web/.env` 后可切换 mock/real API：

- `VITE_USE_MOCK=true`：使用本地 mock
- `VITE_USE_MOCK=false`：走真实后端（需配置 `VITE_API_BASE_URL`）
