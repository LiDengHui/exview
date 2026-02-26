<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{ submit: [model: {name:string;age:number;phone:string;email:string}] }>()
const form = reactive({ name: '', age: 18, phone: '', email: '' })

function onSubmit() {
  emit('submit', { ...form })
}

function reset() {
  form.name = ''
  form.age = 18
  form.phone = ''
  form.email = ''
}
</script>

<template>
  <el-form :model="form" label-width="100px">
    <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
    <el-form-item label="年龄"><el-input-number v-model="form.age" :min="1" :max="100" /></el-form-item>
    <el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item>
    <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
