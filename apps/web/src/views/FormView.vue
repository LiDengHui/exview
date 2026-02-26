<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({ name: '', email: '' })
</script>

<template>
  <el-card>
    <h3>表单示例</h3>
    <el-form :model="form" label-width="100px">
      <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      <el-form-item><el-button type="primary">提交</el-button></el-form-item>
    </el-form>
  </el-card>
</template>
