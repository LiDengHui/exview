<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: unknown[]
  placeholder?: string
}>(), {
  modelValue: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown[]]
}>()

const list = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))

function updateAt(index: number, value: string) {
  const next = [...list.value]
  next[index] = value
  emit('update:modelValue', next)
}

function addItem() {
  emit('update:modelValue', [...list.value, ''])
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
      <el-input
        :model-value="String(item ?? '')"
        :placeholder="placeholder || `请输入第 ${index + 1} 项`"
        @update:model-value="(v) => updateAt(index, String(v ?? ''))"
      />
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
  align-items: center;
  margin-bottom: 8px;
}
</style>
