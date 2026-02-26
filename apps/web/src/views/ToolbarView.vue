<script setup lang="ts">
import { ref } from 'vue'

const signal = ref('')

function emitSignal(name: string) {
  signal.value = name === 'reset' ? '' : name
}

async function delaySubmit() {
  signal.value = 'loading...'
  await new Promise((r) => setTimeout(r, 1500))
  signal.value = 'delaySubmit'
}
</script>

<template>
  <el-card>
    <h3>工具栏迁移版</h3>
    <el-space>
      <el-button type="primary" @click="emitSignal('submit')">提交</el-button>
      <el-button @click="delaySubmit">延迟提交</el-button>
      <el-button @click="emitSignal('reset')">取消</el-button>
    </el-space>
    <div style="margin-top: 12px">SIGNAL: {{ signal }}</div>
  </el-card>
</template>
