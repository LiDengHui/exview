<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { SchemaForm } from '@exview/schema-form'
import type { FormSchema } from '@exview/schema-shared'

const useTextarea = ref(false)
const useSelect = ref(false)
const showAdvanced = ref(true)

const resultText = ref('{}')

const dynamicField = computed(() => {
  if (useSelect.value) {
    return {
      label: '动态字段',
      name: 'dynamicValue',
      widget: 'select' as const,
      span: 12,
      option: {
        options: [
          { label: '选项 A', value: 'A' },
          { label: '选项 B', value: 'B' }
        ],
        value: 'A'
      }
    }
  }

  return {
    label: '动态字段',
    name: 'dynamicValue',
    widget: (useTextarea.value ? 'textarea' : 'input') as 'textarea' | 'input',
    span: 12,
    option: {
      placeholder: useTextarea.value ? '这是 textarea 模式' : '这是 input 模式',
      value: ''
    }
  }
})

const schema = computed<FormSchema>(() => ({
  debug: true,
  fields: [
    {
      label: '用户名',
      name: 'username',
      widget: 'input',
      rule: 'required',
      span: 12,
      option: { placeholder: '请输入用户名，输入 admin 看内部联动', value: '' }
    },
    {
      label: '内部模式',
      name: 'innerMode',
      widget: 'select',
      span: 12,
      option: {
        value: 'input',
        options: [
          { label: '输入框模式', value: 'input' },
          { label: '下拉框模式', value: 'select' }
        ]
      }
    },
    {
      label: '内部动态字段(input)',
      name: 'innerDynamicValue',
      widget: 'input',
      span: 12,
      deps: ['innerMode'],
      visible: (model) => model.innerMode === 'input',
      option: { placeholder: '由内部字段 innerMode 控制显示' }
    },
    {
      label: '内部动态字段(select)',
      name: 'innerDynamicValue',
      widget: 'select',
      span: 12,
      deps: ['innerMode'],
      visible: (model) => model.innerMode === 'select',
      option: {
        options: [
          { label: '内部选项 1', value: 'inner-1' },
          { label: '内部选项 2', value: 'inner-2' }
        ]
      }
    },
    {
      label: '管理员备注(内部触发)',
      name: 'adminNote',
      widget: 'textarea',
      row: true,
      deps: ['username'],
      visible: (model) => String(model.username || '').toLowerCase() === 'admin',
      option: { placeholder: '当用户名=admin 时出现' }
    },
    dynamicField.value,
    {
      label: '高级配置（切换显示）',
      name: 'advancedConfig',
      widget: 'group-object',
      row: true,
      visible: () => showAdvanced.value,
      defaultValue: { retry: '3', timeout: '5000' }
    }
  ],
  toolbar: 'submit,reset'
}))

function onSubmit(values: Record<string, unknown>) {
  resultText.value = JSON.stringify(values, null, 2)
  ElMessage.success('提交成功')
}

function onReset(values: Record<string, unknown>) {
  resultText.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <el-row :gutter="16">
    <el-col :span="14">
      <el-card>
        <template #header>
          <strong>组件动态变化用例</strong>
        </template>

        <el-space wrap>
          <el-switch v-model="useTextarea" active-text="Input -> Textarea" />
          <el-switch v-model="useSelect" active-text="切换为 Select" />
          <el-switch v-model="showAdvanced" active-text="显示高级配置" />
        </el-space>

        <el-divider />

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
