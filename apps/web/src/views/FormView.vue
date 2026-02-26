<script setup lang="ts">
import { ElMessage } from 'element-plus'
import ExForm from '../components/business/ExForm.vue'
import { userMockApi } from '../mock/users'

async function submit(model: { name: string; age: number; phone: string; email: string }) {
  if (!model.name || !model.phone || !model.email) {
    ElMessage.warning('请完整填写信息')
    return
  }
  await userMockApi.add(model)
  ElMessage.success('提交成功（mock）')
}
</script>

<template>
  <el-card>
    <h3>表单迁移版</h3>
    <ExForm @submit="submit" />
  </el-card>
</template>
