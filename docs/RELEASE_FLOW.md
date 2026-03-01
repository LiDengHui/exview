# Release Flow (beta / rc / stable)

## 1) 选择版本号
例如：`0.1.1-beta.0`、`0.1.1-rc.0`、`0.1.1`

## 2) 同步三个包版本
```bash
node scripts/bump-version.mjs 0.1.1-beta.0
pnpm install
```

## 3) 预检查
```bash
# 快速检查（不执行命令）
pnpm release:beta:check:dry

# 正式预检查（会执行安装/测试/构建/pack）
pnpm release:beta:check
```

预检查新增：
- workspace clean 校验（有未提交改动会直接失败）
- npm 登录态检查（`npm whoami`）
- 自动生成发布草稿：`tmp/RELEASE_NOTES_DRAFT.md`

## 4) 发布
```bash
# 参数化发布（推荐）
bash scripts/release-publish.sh --tag beta

# dry-run 预演（不真正发布）
bash scripts/release-publish.sh --tag beta --dry-run

# 无交互发布（CI/自动化）
bash scripts/release-publish.sh --tag rc --yes
```

> 可选 tag：`beta` / `rc` / `latest`。

## 5) 打 tag
```bash
git add .
git commit -m "release: 0.1.1-beta.0"
git tag v0.1.1-beta.0
git push && git push --tags
```


## Rollback

- 回滚指南：`docs/RELEASE_ROLLBACK.md`
