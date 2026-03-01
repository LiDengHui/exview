# exview 优化计划（2026 Q1）

> 面向仓库 `/Users/yanqi/work/exview` 当前状态制定。目标：在不破坏现有可用性的前提下，提升首屏性能、工程稳定性、Schema 能力完整度与发布效率。

---

## 0. 当前基线（已验证）

- `pnpm -r build` ✅ 通过
- `pnpm -r test` ✅ 通过（apps/web: 7 files / 8 tests）
- 关键风险信号：
  - `apps/web` 构建存在大包告警：`index-*.js ~897.90kB (gzip ~290.97kB)`
  - `index-*.css ~349.87kB`
  - 说明当前主包聚合较重，首屏与缓存命中可继续优化

---

## 1. 优化目标与优先级

### P0（1-2 周，优先上线）
1. **前端包体优化与分包策略**
2. **SchemaForm 第二阶段能力落地**（visibleMode / field status / rule registry 完整化）
3. **CI 质量门禁补齐**（lint/typecheck/e2e 分层）

### P1（2-4 周）
4. **数据层抽象与真实 API 适配**（mock fallback 保留）
5. **性能与可观测性增强**（埋点 + 慢字段诊断）
6. **发布流程自动化（beta/rc/stable）**

### P2（持续）
7. **legacy 冻结与迁移收口**
8. **文档产品化（对外使用手册 + 迁移指引）**

---

## 2. 详细执行计划

## P0-1 包体与加载性能优化

### 目标
- 把 `apps/web` 主 chunk 从 ~898kB 降至 < 500kB（首阶段）
- 首屏路由仅加载首页必要模块

### 动作
1. 路由页面全部确保懒加载（动态 import）
2. `vite.config.ts` 增加 `manualChunks`：
   - `vue-core`（vue/vue-router/pinia）
   - `element-plus`（可按组件簇拆）
   - `schema-runtime`（schema-form/table/shared）
3. 检查 Element Plus 引入策略（auto import + 样式按需）
4. 对低频视图（Schema playground/advanced）做二次分包

### 验收指标
- `pnpm --filter @exview/web build` 无 >700kB 主包
- 目标：`index` chunk 下降 30%+

---

## P0-2 SchemaForm 能力补全（对齐现有文档）

> 结合 `docs/FORM_NEXT_PLAN.md` + 当前实现继续推进。

### Step A
- `visibleMode: 'show' | 'if'` 落地
- 明确隐藏字段值保留策略（保留/清空可配置）

### Step B
- 字段状态暴露：`fieldLoadingMap`、`fieldErrorMap`
- 与调试面板联动，支持定位慢 loader、失败字段

### Step C
- `registerSchemaRule` 扩展
- 支持规则分层（全局规则 / schema 局部规则 / 运行时注入）

### 验收指标
- 单测补齐：visibleMode、error/loading map、rule priority
- e2e 覆盖：复杂条件联动 + persist 恢复 + 异步 options 失败回退

---

## P0-3 CI 质量门禁

### 动作
1. 根脚本补齐：`typecheck`（`vue-tsc`/`tsc`）
2. GitHub Actions 分层：
   - PR 快速链路：lint + test
   - 主分支链路：build + e2e
3. e2e 失败上传 artifact（当前已有基础，可标准化输出）

### 验收指标
- PR 必过 lint/test/typecheck
- main 分支构建失败能回溯到测试报告和截图/trace

---

## P1-4 数据层与 API Adapter

### 动作
1. 抽象 `services/adapter` 层：统一 DTO → UI Model 映射
2. `mock/users.ts` 迁移为 `adapter + mock fallback`
3. 错误码与重试策略收敛（含超时/取消）

### 验收指标
- `VITE_USE_MOCK=false` 真实接口可切换
- mock/real 在视图层零改动

---

## P1-5 性能可观测性

### 动作
1. 新增轻量 perf hooks（字段渲染时长、optionsLoader 时长）
2. debug panel 增加“耗时排行/失败统计”
3. 关键流程打点（表单提交、校验失败、首屏 ready）

### 验收指标
- 可导出一次会话的性能摘要
- 可定位 top 5 慢字段

---

## P1-6 发布自动化

### 动作
1. 基于现有 `scripts/bump-version.mjs` + `release-beta.sh` 增加：
   - dry-run 模式
   - 自动变更摘要（CHANGELOG 草稿）
2. 发布前检查增加：
   - workspace clean 校验
   - npm token / tag 校验

### 验收指标
- beta 发布从“人工串行命令”收敛为“一键脚本 + 明确回滚步骤”

---

## P2-7 legacy 收口

### 动作
1. 在 CI 中明确仅构建 `apps/web` + `packages/*`
2. `src/` 标记为 frozen（仅参考不可新增业务）
3. 迁移完成模块从映射表移除并记录替代路径

---

## 3. 建议里程碑（可直接排期）

### Milestone M1（本周）
- 完成 P0-1 + P0-3（性能分包 + CI 门禁）

### Milestone M2（下周）
- 完成 P0-2（SchemaForm Step A/B/C 至少 A+B）

### Milestone M3（第 3-4 周）
- 完成 P1-4 + P1-5（适配层 + 可观测）

### Milestone M4（第 5 周）
- 完成 P1-6 + P2-7（发布自动化 + legacy 收口）

---

## 4. 风险与对策

1. **Element Plus 分包收益不稳定**
   - 对策：以 bundle analyzer 数据驱动，避免盲目拆分
2. **Schema 新能力引入行为变化**
   - 对策：全部能力 behind flags + 兼容默认值
3. **e2e 变慢导致 CI 时间增长**
   - 对策：PR 跑 smoke，nightly 跑 full suite

---

## 5. 立即可执行任务（今天）

1. 在 `apps/web/vite.config.ts` 增加 manualChunks 并复测构建体积
2. 为 `visibleMode` 补类型定义与最小实现
3. 在 CI 增加 `typecheck` job（先非阻塞，1-2 天后转阻塞）

---

如需，我可以按该计划直接开一个 `opt/perf-schema-ci` 分支，分 3~5 个小 commit 推进（每个 commit 都可单独回滚）。
