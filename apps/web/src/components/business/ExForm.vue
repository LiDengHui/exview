<script setup lang="ts">
import { SchemaForm } from '@exview/schema-form'
import type { FormSchema } from '@exview/schema-shared'

const emit = defineEmits<{ submit: [model: { name: string; age: number; phone: string; email: string }] }>()

const random = Math.floor(Math.random() * 10)

const schema: FormSchema = {
  fields: [
    {
      label: '姓名',
      rule: 'required',
      name: 'name',
      widget: 'input',
      option: { placeholder: '姓名', value: `lidenghui${random}` }
    },
    {
      label: '年龄',
      rule: 'requiredNum',
      widget: 'input-number',
      name: 'age',
      option: { max: 100, min: 0, placeholder: 'age', value: 32 }
    },
    {
      label: '电话',
      rule: 'required,phone',
      widget: 'input',
      name: 'phone',
      option: { placeholder: '电话', value: `1320165668${random}` }
    },
    {
      label: '邮箱',
      rule: 'required,email',
      widget: 'input',
      name: 'email',
      option: { placeholder: '邮箱', value: `337948903${random}@qq.com` }
    }
  ],
  toolbar: 'submit,reset'
}

function handleSubmit(model: Record<string, unknown>) {
  emit('submit', model as { name: string; age: number; phone: string; email: string })
}
</script>

<template>
  <SchemaForm :schema="schema" @submit="handleSubmit" />
</template>
