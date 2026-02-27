<script setup lang="ts">
import { computed } from 'vue'
import type { FormFieldSchema } from '@exview/schema-shared'
import SchemaForm from './SchemaForm.vue'

const props = withDefaults(defineProps<{
  modelValue?: Record<string, unknown>
  itemSchema?: FormFieldSchema[]
}>(), {
  modelValue: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

const entries = computed(() => Object.entries(props.modelValue || {}))

function emitEntries(nextEntries: Array<[string, unknown]>) {
  emit('update:modelValue', Object.fromEntries(nextEntries))
}

function updateKey(oldKey: string, newKey: string) {
  const nextEntries = entries.value.map(([k, v]) => [k, v] as [string, unknown])
  const idx = nextEntries.findIndex(([k]) => k === oldKey)
  if (idx < 0) return
  nextEntries[idx] = [newKey || oldKey, nextEntries[idx][1]]
  emitEntries(nextEntries)
}

function updateValue(key: string, value: string) {
  const nextEntries = entries.value.map(([k, v]) => [k, v] as [string, unknown])
  const idx = nextEntries.findIndex(([k]) => k === key)
  if (idx < 0) return
  nextEntries[idx] = [key, value]
  emitEntries(nextEntries)
}

function addEntry() {
  const nextEntries = entries.value.map(([k, v]) => [k, v] as [string, unknown])
  const existingKeys = new Set(nextEntries.map(([k]) => k))
  let key = 'key'
  let i = 1
  while (existingKeys.has(key)) {
    key = `key${i++}`
  }
  nextEntries.push([key, ''])
  emitEntries(nextEntries)
}

function removeEntry(key: string) {
  const nextEntries = entries.value.filter(([k]) => k !== key)
  emitEntries(nextEntries)
}

function moveEntry(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= entries.value.length) return
  const nextEntries = entries.value.map(([k, v]) => [k, v] as [string, unknown])
  const [item] = nextEntries.splice(index, 1)
  nextEntries.splice(target, 0, item)
  emitEntries(nextEntries)
}
</script>

<template>
  <div class="group-object">
    <template v-if="itemSchema?.length">
      <SchemaForm
        :schema="{ fields: itemSchema, onValuesChange: (values) => emit('update:modelValue', values) }"
        :model="modelValue"
        @submit="() => void 0"
        @reset="() => void 0"
      />
    </template>

    <template v-else>
      <div v-for="([key, value], index) in entries" :key="`${key}-${index}`" class="object-row">
        <el-input :model-value="key" placeholder="key" @update:model-value="(v) => updateKey(key, String(v ?? ''))" />
        <el-input :model-value="String(value ?? '')" placeholder="value" @update:model-value="(v) => updateValue(key, String(v ?? ''))" />
        <el-button link :disabled="index === 0" @click="moveEntry(index, -1)">上移</el-button>
        <el-button link :disabled="index === entries.length - 1" @click="moveEntry(index, 1)">下移</el-button>
        <el-button type="danger" link @click="removeEntry(key)">删除</el-button>
      </div>
      <el-button type="primary" link @click="addEntry">+ 添加字段</el-button>
    </template>
  </div>
</template>

<style scoped>
.group-object {
  width: 100%;
}
.object-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
</style>
