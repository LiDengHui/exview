<script setup lang="ts">
import { ref, watch } from 'vue'
import { SchemaTable } from '@exview/schema-table'
import type { TableSchema } from '@exview/schema-shared'
import type { UserItem } from '../../mock/users'

const props = defineProps<{ rows: UserItem[] }>()
const emit = defineEmits<{ remove: [id: number] }>()

const tableRef = ref<{ refresh: () => Promise<void> } | null>(null)

const schema: TableSchema<Record<string, unknown>> = {
  localPage: true,
  pageSize: 10,
  rowKey: 'id',
  columns: [
    { key: 'name', title: 'Name' },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'phone', title: 'Phone' },
    { key: 'email', title: 'Email' }
  ],
  data: () => Promise.resolve(props.rows as unknown as Record<string, unknown>[])
}

watch(
  () => props.rows,
  () => {
    tableRef.value?.refresh()
  },
  { deep: true }
)
</script>

<template>
  <SchemaTable ref="tableRef" :schema="schema" @remove="(id) => emit('remove', id)" />
</template>
