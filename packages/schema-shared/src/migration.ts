import type { FormSchema } from './types'

const CURRENT_SCHEMA_VERSION = 2

function normalizeToolbarLegacy(schema: Record<string, unknown>) {
  if (!('toolbar' in schema)) return schema
  const next = { ...schema }
  delete next.toolbar
  return next
}

function migrateV1ToV2(schema: FormSchema): FormSchema {
  const normalized = normalizeToolbarLegacy(schema as unknown as Record<string, unknown>)
  return {
    ...(normalized as unknown as FormSchema),
    schemaVersion: 2
  }
}

export function migrateFormSchema(input: FormSchema): FormSchema {
  const schema = { ...input }
  const fromVersion = schema.schemaVersion ?? 1

  if (fromVersion >= CURRENT_SCHEMA_VERSION) {
    return { ...schema, schemaVersion: fromVersion }
  }

  let migrated = { ...schema }

  if (fromVersion < 2) {
    migrated = migrateV1ToV2(migrated)
  }

  return { ...migrated, schemaVersion: CURRENT_SCHEMA_VERSION }
}

export { CURRENT_SCHEMA_VERSION }
