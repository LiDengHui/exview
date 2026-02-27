<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { SchemaForm, SchemaToolbar } from '@exview/schema-form'
import type { FormSchema, ToolbarAction } from '@exview/schema-shared'

const formRef = ref<{
  getValues: () => Record<string, unknown>
  getOutputValues: () => Promise<Record<string, unknown>>
  submitForm: () => Promise<Record<string, unknown> | null>
  resetForm: () => Promise<void>
  isDirty: { value: boolean }
  isTouched: { value: boolean }
  isValid: () => Promise<boolean>
  validateField: (field: string) => Promise<boolean>
} | null>(null)

const stateInfo = ref('dirty=false, touched=false')

const toolbarItems: ToolbarAction[] = [
  { text: '提交', signal: 'submit', type: 'primary' },
  { text: '重置', signal: 'reset', type: 'default' }
]

const schema: FormSchema = {
  debug: true,
  persistKey: 'schema-advanced-demo',
  fields: [
    {
      label: '用户名(异步校验)',
      name: 'username',
      widget: 'input',
      rule: 'required',
      validatorDebounceMs: 300,
      validator: async (value) => {
        await new Promise((r) => setTimeout(r, 300))
        if (!value) return '请输入用户名'
        if (String(value).toLowerCase() === 'admin') return 'admin 已被占用'
        return true
      },
      option: { placeholder: '输入 admin 会报占用' }
    },
    {
      label: '价格(出参*100)',
      name: 'price',
      widget: 'input-number',
      defaultValue: 10,
      transform: {
        output: (v) => Number(v || 0) * 100
      }
    },
    {
      label: '远程城市选项(缓存)',
      name: 'city',
      widget: 'select',
      debounceMs: 300,
      deps: ['username'],
      option: {
        optionsCacheKey: 'city-options',
        optionsCacheParams: (model) => ({ u: model.username }),
        optionsLoader: async () => {
          await new Promise((r) => setTimeout(r, 400))
          return [
            { label: '上海', value: 'sh' },
            { label: '北京', value: 'bj' }
          ]
        }
      }
    },
    {
      label: '技能组(嵌套 group-array)',
      name: 'skills',
      widget: 'group-array',
      row: true,
      defaultValue: [{ skill: 'Vue', level: 4 }],
      itemSchema: [
        { label: '技能名', name: 'skill', widget: 'input', span: 12 },
        { label: '等级', name: 'level', widget: 'input-number', span: 12 }
      ]
    },
    {
      label: '配置对象(嵌套 group-object)',
      name: 'config',
      widget: 'group-object',
      row: true,
      defaultValue: { env: 'prod', retry: 3 },
      itemSchema: [
        { label: '环境', name: 'env', widget: 'input', span: 12 },
        { label: '重试次数', name: 'retry', widget: 'input-number', span: 12 }
      ]
    }
  ],
  onValuesChange: () => {
    if (!formRef.value) return
    stateInfo.value = `dirty=${formRef.value.isDirty.value}, touched=${formRef.value.isTouched.value}`
  }
}

async function showOutput() {
  if (!formRef.value) return
  const out = await formRef.value.getOutputValues()
  ElMessage.info(JSON.stringify(out))
}

async function checkUsername() {
  if (!formRef.value) return
  const ok = await formRef.value.validateField('username')
  ElMessage[ok ? 'success' : 'warning'](ok ? 'username 校验通过' : 'username 校验失败')
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
  <el-card>
    <template #header>
      <strong>高级能力用例（校验/缓存/嵌套/slot/API/持久化）</strong>
    </template>

    <SchemaForm ref="formRef" :schema="schema">
      <template #label-price>
        <span>价格(自定义Label Slot)</span>
      </template>
      <template #extra-username>
        <small>用户名支持异步唯一性校验</small>
      </template>
      <template #footer>
        <el-space>
          <SchemaToolbar :items="toolbarItems" @action="onToolbarAction" />
          <el-button @click="showOutput">查看 output 值</el-button>
          <el-button @click="checkUsername">校验用户名字段</el-button>
          <span>{{ stateInfo }}</span>
        </el-space>
      </template>
    </SchemaForm>
  </el-card>
</template>
