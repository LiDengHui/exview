import { fileURLToPath, URL } from 'node:url'

export function resolveWorkspaceAlias(importMetaUrl: string) {
  return {
    '@exview/schema-shared': fileURLToPath(new URL('../../packages/schema-shared/src/index.ts', importMetaUrl)),
    '@exview/schema-form': fileURLToPath(new URL('../../packages/schema-form/src/index.ts', importMetaUrl)),
    '@exview/schema-table': fileURLToPath(new URL('../../packages/schema-table/src/index.ts', importMetaUrl))
  }
}
