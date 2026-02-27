# Schema Version & Migration Plan (Day 2)

## Goal
Introduce `schemaVersion` and migration pipeline so old schema keeps working after future upgrades.

## Scope
1. Add `schemaVersion?: number` to `FormSchema`.
2. Add migration utilities in `@exview/schema-shared`:
   - `migrateFormSchema(schema)`
   - internal migration steps (v1 -> v2 ...)
3. `SchemaForm` entry applies migration before rendering.
4. Add demo in web for migration visibility.
5. Keep backward compatibility for existing schema.

## Verification
- `pnpm -r build`
- `pnpm --filter @exview/web test`
