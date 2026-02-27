import { describe, expect, it } from 'vitest'
import { getSchemaFieldConfig } from '@exview/schema-form'

describe('field registry', () => {
  it('provides default props and capability for built-in fields', () => {
    const select = getSchemaFieldConfig('select')
    expect(select).toBeTruthy()
    expect(select?.defaultProps).toMatchObject({ clearable: true, filterable: true })
    expect(select?.capability?.supportsOptions).toBe(true)

    const groupArray = getSchemaFieldConfig('group-array')
    expect(groupArray?.capability?.supportsItemSchema).toBe(true)
  })
})
