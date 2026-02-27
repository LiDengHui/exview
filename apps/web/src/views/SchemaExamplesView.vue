<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { SchemaForm } from '@exview/schema-form'
import type { FormSchema } from '@exview/schema-shared'

const resultText = ref('{}')

const schema: FormSchema = {
  fields: [
    {
      label: '姓名',
      name: 'name',
      widget: 'input',
      rule: 'required',
      span: 12,
      option: { placeholder: '姓名', value: '' }
    },
    {
      label: '年龄',
      name: 'age',
      widget: 'input-number',
      rule: 'requiredNum',
      span: 12,
      option: { min: 0, max: 120, value: 18 }
    },
    {
      label: '角色',
      name: 'role',
      widget: 'select',
      span: 12,
      option: {
        value: 'user',
        options: [
          { label: '管理员', value: 'admin' },
          { label: '普通用户', value: 'user' }
        ]
      }
    },
    {
      label: '启用通知',
      name: 'enabled',
      widget: 'switch',
      span: 12,
      defaultValue: true
    },
    {
      label: '技能标签（group-array）',
      name: 'tags',
      widget: 'group-array',
      row: true,
      defaultValue: ['Vue3', 'Schema']
    },
    {
      label: '扩展信息（group-object）',
      name: 'meta',
      widget: 'group-object',
      row: true,
      defaultValue: { level: 'senior', city: 'shanghai' }
    }
  ]
}

function onSubmit(model: Record<string, unknown>) {
  resultText.value = JSON.stringify(model, null, 2)
  ElMessage.success('提交成功')
}

function onReset(model: Record<string, unknown>) {
  resultText.value = JSON.stringify(model, null, 2)
}
</script>

<template>
  <el-row :gutter="16">
    <el-col :span="14">
      <el-card>
        <template #header>
          <strong>SchemaForm 使用用例（span/row/group-array/group-object）</strong>
        </template>
        <SchemaForm :schema="schema" @submit="onSubmit" @reset="onReset" />
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card>
        <template #header>
          <strong>提交结果</strong>
        </template>
        <pre>{{ resultText }}</pre>
      </el-card>
    </el-col>
  </el-row>
</template>
