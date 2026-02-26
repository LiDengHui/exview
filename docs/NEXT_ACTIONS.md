# 下一阶段执行清单

1. 抽离 `ExForm`/`ExTable` 通用业务组件
2. 将 `mock/users.ts` 替换为真实 service adapter（保留 mock fallback）
3. 增加路由级 E2E（Playwright）
4. 进一步压缩 element-plus chunk（按需引入或 unplugin 方案）
5. 冻结 legacy 目录并在 CI 中仅构建 `apps/web`
