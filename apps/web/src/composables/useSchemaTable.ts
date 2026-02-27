import { computed, ref } from 'vue'
import type { TableSchema } from '../schema/types'

export function useSchemaTable<T extends Record<string, unknown>>(schema: TableSchema<T>) {
  const rows = ref<T[]>([])
  const loading = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(schema.pageSize ?? 10)

  const visibleRows = computed(() => {
    if (!schema.localPage) return rows.value
    const start = (pageNum.value - 1) * pageSize.value
    return rows.value.slice(start, start + pageSize.value)
  })

  const refresh = async () => {
    loading.value = true
    try {
      rows.value = typeof schema.data === 'function' ? await schema.data() : schema.data
    } finally {
      loading.value = false
    }
  }

  return {
    rows,
    visibleRows,
    loading,
    pageNum,
    pageSize,
    total: computed(() => rows.value.length),
    refresh
  }
}
