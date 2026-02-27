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
pnpm release:beta:check
```

## 4) 发布
```bash
cd packages/schema-shared && npm publish --tag beta --access public
cd ../schema-form && npm publish --tag beta --access public
cd ../schema-table && npm publish --tag beta --access public
```

> rc / stable 时把 `--tag beta` 换成对应 tag。

## 5) 打 tag
```bash
git add .
git commit -m "release: 0.1.1-beta.0"
git tag v0.1.1-beta.0
git push && git push --tags
```
