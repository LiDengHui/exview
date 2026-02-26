# Exview 改造执行记录

## 2026-02-26

### [21:31] Step 1 - 启动与现状确认
- 动作：确认仓库改造前状态（分支、提交、工作区）
- 结果：`master` 与远端一致；工作区干净；当前仅见历史提交 `bf95fa3`（2017）
- 产出：创建 `docs/REFACTOR_PLAN.md` 与本日志文件
- 下一步：执行“本地可运行性验证”（安装依赖、尝试启动/构建）


### [21:32] Step 2 - 本地可运行性验证（依赖安装）
- 动作：在 Node v22 环境执行 `npm install --legacy-peer-deps`
- 结果：安装失败，阻塞点为 `chromedriver@2.33.2` 下载地址失效（taobao 镜像返回无效压缩包）
- 发现：项目依赖链明显老旧（Vue2 + webpack3 + phantomjs + node-sass4 + karma1），与当前 Node 版本存在兼容风险
- 结论：直接在现环境启动旧工程成功率低，需要先做“工程底座升级/替换测试工具链”策略
- 下一步：输出 v1 改造执行方案（先保证可安装可启动，再迁移功能模块）

### [21:33] Step 3 - 输出 v1 执行策略
- 动作：补充可立即执行的改造策略（先工程可运行化，再业务迁移）
- 结果：新增 Batch A/B/C 分层方案
- 下一步：等待你补充‘之前确认的改造要求’，收到后开始 Batch A 的第一项落地改造

### [21:36] Step 4 - 接收并固化改造要求
- 动作：确认目标为 Vue3 + Vite + pnpm workspace，补充测试，替换为现代组件库
- 结果：执行路线明确，优先做 Batch A（工程底座升级）
- 下一步：落地 monorepo/workspace 结构与新应用骨架

### [21:39] Step 5 - 落地 pnpm workspace + Vue3/Vite 骨架
- 动作：创建 `pnpm-workspace.yaml`、根 `package.json`，新增 `apps/web`（Vue3 + Vite + TS）
- 结果：新工程可独立作为现代化入口；组件库选型为 Element Plus
- 下一步：安装依赖并验证 `dev/build/test`


### [21:41] Step 6 - 安装/启动/构建/测试验证
- 动作：执行 `pnpm install`、`pnpm dev`、`pnpm -r build`、`pnpm -r test`
- 结果：全部通过（构建存在大包体告警，不影响产物生成）
- 处理：新增 `apps/web/postcss.config.cjs` 规避旧根目录 postcss 配置干扰
- 下一步：整理迁移说明，并进入 Batch B（业务模块逐步迁移）

### [21:40] Step 7 - 业务模块首批迁移（Form/Table/Menu/Toolbar）
- 动作：把旧 `src/view` 的主要页面迁移到 `apps/web/src/views`，并使用 Element Plus 重写交互
- 结果：新增 `MenuView` / `ToolbarView`，`FormView` 与 `TableView` 对齐旧功能意图（使用 mock API）
- 验证：`pnpm -r build`、`pnpm -r test` 通过
- 下一步：继续拆分通用组件层（旧 `src/components/*`）并逐步替换

### [21:40] Step 8 - 测试体验优化
- 动作：增加 `vitest.setup.ts`，在测试环境注册 Element Plus
- 结果：测试通过且消除组件未注册警告
- 下一步：进入 Batch C，补充分包/性能优化与迁移清单

### [21:42] Step 9 - Batch C: 构建分包与性能优化
- 动作：路由改为懒加载；Vite 增加 `manualChunks`（vue / element-plus）
- 结果：降低首屏主包体积，构建产物拆分更合理
- 下一步：补充关键逻辑测试，完善迁移差异清单

### [21:42] Step 10 - Batch C: 增加关键测试
- 动作：新增 `apps/web/src/mock/users.spec.ts`，覆盖新增/删除核心流程
- 结果：业务 mock 层关键操作可回归验证
- 下一步：执行完整构建+测试回归并更新计划

### [21:47] Step 11 - 输出组件迁移映射与后续行动清单
- 动作：新增 `docs/COMPONENT_MIGRATION_MAP.md` 与 `docs/NEXT_ACTIONS.md`
- 结果：旧组件到新实现的映射关系明确，后续执行路径可追踪
- 下一步：继续推进通用组件抽离与 service 层替换

### [21:47] Step 12 - 交付文档更新
- 动作：更新 README 进度状态与文档索引
- 结果：可直接作为阶段性交付说明
- 下一步：持续小步迁移并保持 build/test 绿灯
