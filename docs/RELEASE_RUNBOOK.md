# Release Runbook（可直接执行）

## 0) 发布前

```bash
pnpm install
pnpm test
pnpm build
```

## 1) Dry-run 预演

```bash
bash scripts/release-all.sh --version 0.1.2-beta.0 --tag beta --dry-run
```

检查：
- 命令链路是否正确
- `tmp/RELEASE_NOTES_DRAFT.md` 是否生成

## 2) 正式发布

```bash
bash scripts/release-all.sh --version 0.1.2-beta.0 --tag beta --yes
```

## 3) 推送

```bash
git push
git push --tags
```

## 4) 验证

```bash
npm dist-tag ls @exview/schema-shared
npm dist-tag ls @exview/schema-form
npm dist-tag ls @exview/schema-table
```

## 5) 异常处理

若发现发布异常，按 `docs/RELEASE_ROLLBACK.md` 回滚。
