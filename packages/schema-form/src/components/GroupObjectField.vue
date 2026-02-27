<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: Record<string, unknown>
}>(), {
  modelValue: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

const entries = computed(() => Object.entries(props.modelValue || {}))

function updateKey(oldKey: string, newKey: string) {
  const next = { ...(props.modelValue || {}) }
  const value = next[oldKey]
  delete next[oldKey]
  if (newKey) next[newKey] = value
  emit('update:modelValue', next)
}

function updateValue(key: string, value: string) {
  const next = { ...(props.modelValue || {}) }
  next[key] = value
  emit('update:modelValue', next)
}

function addEntry() {
  const next = { ...(props.modelValue || {}) }
  let key = 'key'
  let i = 1
  while (key in next) {
    key = `key${i++}`
  }
  next[key] = ''
  emit('update:modelValue', next)
}

function removeEntry(key: string) {
  const next = { ...(props.modelValue || {}) }
  delete next[key]
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="group-object">
    <div v-for="([key, value], index) in entries" :key="`${key}-${index}`" class="object-row">
      <el-input :model-value="key" placeholder="key" @update:model-value="(v) => updateKey(key, String(v ?? ''))" />
      <el-input :model-value="String(value ?? '')" placeholder="value" @update:model-value="(v) => updateValue(key, String(v ?? ''))" />
      <el-button type="danger" link @click="removeEntry(key)">删除</el-button>
    </div>
    <el-button type="primary" link @click="addEntry">+ 添加字段</el-button>
  </div>
</template>

<style scoped>
.group-object {
  width: 100%;
}
.object-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
</style>
