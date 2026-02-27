<script setup lang="ts">
import { computed } from 'vue'
import type { FormFieldSchema } from '@exview/schema-shared'
import SchemaForm from './SchemaForm.vue'

const props = withDefaults(defineProps<{
  modelValue?: unknown[]
  placeholder?: string
  itemSchema?: FormFieldSchema[]
}>(), {
  modelValue: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown[]]
}>()

const list = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))

function updateAt(index: number, value: unknown) {
  const next = [...list.value]
  next[index] = value
  emit('update:modelValue', next)
}

function onInputUpdate(index: number, v: unknown) {
  updateAt(index, String(v ?? ''))
}

function addItem() {
  const nextDefault = props.itemSchema?.length ? {} : ''
  emit('update:modelValue', [...list.value, nextDefault])
}

function removeItem(index: number) {
  const next = [...list.value]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function moveItem(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= list.value.length) return
  const next = [...list.value]
  const [current] = next.splice(index, 1)
  next.splice(target, 0, current)
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="group-array">
    <div v-for="(item, index) in list" :key="index" class="array-row">
      <template v-if="itemSchema?.length">
        <SchemaForm
          class="nested-form"
          :schema="{
            fields: itemSchema || [],
            onValuesChange: (values) => updateAt(index, values)
          }"
          :model="(item as Record<string, unknown>)"
          @submit="() => void 0"
          @reset="() => void 0"
        />
      </template>
      <template v-else>
        <el-input
          :model-value="String(item ?? '')"
          :placeholder="placeholder || `请输入第 ${index + 1} 项`"
          @update:model-value="onInputUpdate(index, $event)"
        />
      </template>
      <el-button link :disabled="index === 0" @click="moveItem(index, -1)">上移</el-button>
      <el-button link :disabled="index === list.length - 1" @click="moveItem(index, 1)">下移</el-button>
      <el-button type="danger" link @click="removeItem(index)">删除</el-button>
    </div>
    <el-button type="primary" link @click="addItem">+ 添加</el-button>
  </div>
</template>

<style scoped>
.group-array {
  width: 100%;
}
.array-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
}
.nested-form {
  flex: 1;
}
</style>
