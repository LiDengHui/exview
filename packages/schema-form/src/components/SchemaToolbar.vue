<script setup lang="ts">
import { reactive } from 'vue'
import type { ToolbarAction } from '@exview/schema-shared'

const props = defineProps<{
  items: ToolbarAction[]
}>()

const emit = defineEmits<{
  action: [item: ToolbarAction]
}>()

const loadingMap = reactive<Record<string, boolean>>({})

async function onClick(item: ToolbarAction) {
  if (loadingMap[item.signal]) return
  try {
    loadingMap[item.signal] = true
    emit('action', item)
  } finally {
    loadingMap[item.signal] = false
  }
}
</script>

<template>
  <el-space wrap>
    <template v-for="item in props.items" :key="item.signal">
      <el-popconfirm
        v-if="item.confirm"
        :title="item.confirm"
        @confirm="onClick(item)"
      >
        <template #reference>
          <el-button
            :type="item.type as any"
            native-type="button"
            :disabled="item.disabled"
            :loading="loadingMap[item.signal]"
          >
            {{ item.text }}
          </el-button>
        </template>
      </el-popconfirm>

      <el-button
        v-else
        :type="item.type as any"
        native-type="button"
        :disabled="item.disabled"
        :loading="loadingMap[item.signal]"
        @click="onClick(item)"
      >
        {{ item.text }}
      </el-button>
    </template>
  </el-space>
</template>
