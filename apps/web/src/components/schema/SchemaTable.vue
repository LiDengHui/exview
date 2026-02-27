<script setup lang="ts" generic="T extends Record<string, unknown>">
import { onMounted } from 'vue'
import { useSchemaTable } from '../../composables/useSchemaTable'
import type { TableSchema } from '../../schema/types'

const props = defineProps<{
  schema: TableSchema<T>
}>()

const emit = defineEmits<{
  remove: [id: number]
}>()

const { visibleRows, loading, pageNum, pageSize, total, resolveCellValue, refresh } = useSchemaTable(props.schema)

onMounted(refresh)

defineExpose({ refresh })
</script>

<template>
  <div>
    <el-table :data="visibleRows" :row-key="schema.rowKey || 'id'" style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="60" label="#" />
      <el-table-column
        v-for="(column, index) in schema.columns"
        :key="String(column.key)"
        :prop="String(column.key)"
        :label="column.title"
        :width="column.width"
      >
        <template #default="scope">
          {{ resolveCellValue(scope.row, column.key, scope.$index ?? index) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="danger" link @click="emit('remove', Number(scope.row.id))">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager" v-if="schema.localPage">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
      />
    </div>
  </div>
</template>

<style scoped>
.pager {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
