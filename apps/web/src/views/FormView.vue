<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { userMockApi } from '../mock/users'

const form = reactive({ name: '', age: 18, phone: '', email: '' })

async function submit() {
  if (!form.name || !form.phone || !form.email) {
    ElMessage.warning('请完整填写信息')
    return
  }
  await userMockApi.add({ ...form })
  ElMessage.success('提交成功（mock）')
}

function reset() {
  form.name = ''
  form.age = 18
  form.phone = ''
  form.email = ''
}
</script>

<template>
  <el-card>
    <h3>表单迁移版</h3>
    <el-form :model="form" label-width="100px">
      <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="年龄"><el-input-number v-model="form.age" :min="1" :max="100" /></el-form-item>
      <el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item>
      <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
