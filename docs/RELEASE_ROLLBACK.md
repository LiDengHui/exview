# Release Rollback Guide

## 场景

当 beta/rc/stable 发布后发现问题，需要快速止损时使用。

## 1) 先止血（推荐）

通过 npm dist-tag 回切稳定版本：

```bash
# 示例：把 latest 指回 0.1.0
npm dist-tag add @exview/schema-shared@0.1.0 latest
npm dist-tag add @exview/schema-form@0.1.0 latest
npm dist-tag add @exview/schema-table@0.1.0 latest
```

> 若是 beta/rc 渠道，同理改对应 tag。

## 2) 验证 tag

```bash
npm dist-tag ls @exview/schema-shared
npm dist-tag ls @exview/schema-form
npm dist-tag ls @exview/schema-table
```

## 3) 通知与记录

- 在 `CHANGELOG.md` 或 release notes 标注“回滚说明”
- 记录触发原因、影响范围、恢复版本

## 4) 代码层回滚（可选）

如果需要将仓库代码回到上一个稳定点：

```bash
git log --oneline
git revert <bad-commit>
# 或在分支上 reset/release hotfix（按团队流程）
```

## 5) 再发布前检查

- 重新跑 `pnpm release:beta:check`
- 更新 `tmp/RELEASE_NOTES_DRAFT.md`
- 确认修复 commit 再次发布
