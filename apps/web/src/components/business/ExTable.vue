<script setup lang="ts">
import { ref, watch } from 'vue'
import SchemaTable from '../schema/SchemaTable.vue'
import type { TableSchema } from '../../schema/types'
import type { UserItem } from '../../mock/users'

const props = defineProps<{ rows: UserItem[] }>()
const emit = defineEmits<{ remove: [id: number] }>()

const tableRef = ref<{ refresh: () => Promise<void> } | null>(null)

const schema: TableSchema<UserItem> = {
  localPage: true,
  pageSize: 10,
  rowKey: 'id',
  columns: [
    { key: 'name', title: 'Name' },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'phone', title: 'Phone' },
    { key: 'email', title: 'Email' }
  ],
  data: () => Promise.resolve(props.rows)
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
