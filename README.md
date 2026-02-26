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
