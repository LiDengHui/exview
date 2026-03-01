<script setup lang="ts">
import { computed } from 'vue'

interface FieldPerfItem {
  resolverMs?: number
  optionsMs?: number
  validatorMs?: number
}

const props = withDefaults(defineProps<{
  perfMap?: Record<string, FieldPerfItem>
  topN?: number
  title?: string
}>(), {
  topN: 3,
  title: '慢字段 Top'
})

const rows = computed(() => {
  return Object.entries(props.perfMap || {})
    .map(([field, perf]) => {
      const resolverMs = Number(perf?.resolverMs || 0)
      const optionsMs = Number(perf?.optionsMs || 0)
      const validatorMs = Number(perf?.validatorMs || 0)
      return {
        field,
        resolverMs,
        optionsMs,
        validatorMs,
        totalMs: resolverMs + optionsMs + validatorMs
      }
    })
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, Math.max(1, Number(props.topN || 3)))
})
</script>

<template>
  <div class="perf-top" data-testid="perf-top-fields">
    <strong>{{ title }}</strong>
    <div v-if="rows.length === 0" class="perf-empty">暂无性能数据</div>
    <ul v-else class="perf-list">
      <li v-for="item in rows" :key="item.field" class="perf-item">
        <span class="field">{{ item.field }}</span>
        <span class="cost">total={{ item.totalMs }}ms</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.perf-top { font-size: 12px; color: #606266; }
.perf-empty { margin-top: 4px; color: #909399; }
.perf-list { margin: 6px 0 0; padding-left: 16px; }
.perf-item { display: flex; gap: 8px; }
.field { min-width: 88px; }
.cost { color: #409eff; }
</style>
