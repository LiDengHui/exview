<script setup lang="ts">
import { ref } from 'vue'
import { SchemaForm, SchemaToolbar } from '@exview/schema-form'
import type { FormSchema, ToolbarAction } from '@exview/schema-shared'

const emit = defineEmits<{ submit: [model: { name: string; age: number; phone: string; email: string }] }>()

const random = Math.floor(Math.random() * 10)

const formRef = ref<{
  submitForm: () => Promise<Record<string, unknown> | null>
  resetForm: () => Promise<void>
} | null>(null)

const toolbarItems: ToolbarAction[] = [
  { text: '提交', signal: 'submit', type: 'primary' },
  { text: '重置', signal: 'reset', type: 'default' }
]

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
  ]
}

function handleSubmit(model: Record<string, unknown>) {
  emit('submit', model as { name: string; age: number; phone: string; email: string })
}

async function onToolbarAction(item: ToolbarAction) {
  if (!formRef.value) return
  if (item.signal === 'submit') {
    await formRef.value.submitForm()
    return
  }
  if (item.signal === 'reset') {
    await formRef.value.resetForm()
  }
}
</script>

<template>
  <SchemaForm ref="formRef" :schema="schema" @submit="handleSubmit">
    <template #footer>
      <SchemaToolbar :items="toolbarItems" @action="onToolbarAction" />
    </template>
  </SchemaForm>
</template>
