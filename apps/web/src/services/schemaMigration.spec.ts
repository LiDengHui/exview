import { describe, expect, it } from 'vitest'
import { CURRENT_SCHEMA_VERSION, migrateFormSchema } from '@exview/schema-shared'

describe('schema migration', () => {
  it('migrates legacy schema to current version and removes legacy toolbar field', () => {
    const legacy = {
      schemaVersion: 1,
      fields: [
        { label: '姓名', name: 'name', widget: 'input' }
      ],
      toolbar: 'submit,reset'
    } as any

    const migrated = migrateFormSchema(legacy)

    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    expect((migrated as any).toolbar).toBeUndefined()
    expect(migrated.fields).toHaveLength(1)
  })
})
