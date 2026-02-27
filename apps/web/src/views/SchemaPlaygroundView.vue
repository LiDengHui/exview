<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { SchemaForm, SchemaToolbar } from '@exview/schema-form'
import type { FormSchema, ToolbarAction } from '@exview/schema-shared'

const schemaText = ref(`{
  "schemaVersion": 1,
  "fields": [
    {
      "label": "姓名",
      "name": "name",
      "widget": "input",
      "rule": "required",
      "option": { "placeholder": "请输入姓名", "value": "" }
    },
    {
      "label": "年龄",
      "name": "age",
      "widget": "input-number",
      "rule": "requiredNum",
      "option": { "min": 0, "max": 100, "value": 18 }
    },
    {
      "label": "邮箱",
      "name": "email",
      "widget": "input",
      "rule": "required,email",
      "option": { "placeholder": "请输入邮箱", "value": "" }
    },
    {
      "label": "角色",
      "name": "role",
      "widget": "select",
      "option": {
        "value": "user",
        "options": [
          { "label": "管理员", "value": "admin" },
          { "label": "普通用户", "value": "user" }
        ]
      }
    }
  ],
  "toolbar": "submit,reset"
}`)

const parseError = ref('')
const resultText = ref('{}')

const formRef = ref<{
  submitForm: () => Promise<Record<string, unknown> | null>
  resetForm: () => Promise<void>
} | null>(null)

const toolbarItems: ToolbarAction[] = [
  { text: '提交', signal: 'submit', type: 'primary' },
  { text: '重置', signal: 'reset', type: 'default' }
]

const schema = computed<FormSchema | null>(() => {
  try {
    parseError.value = ''
    return JSON.parse(schemaText.value) as FormSchema
  } catch (error) {
    parseError.value = (error as Error).message
    return null
  }
})

function onSubmit(model: Record<string, unknown>) {
  resultText.value = JSON.stringify(model, null, 2)
  ElMessage.success('表单提交成功')
}

function onReset(model: Record<string, unknown>) {
  resultText.value = JSON.stringify(model, null, 2)
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
  <el-row :gutter="16" class="playground">
    <el-col :span="12">
      <el-card>
        <template #header>
          <strong>Schema JSON</strong>
        </template>
        <el-input
          v-model="schemaText"
          type="textarea"
          :rows="24"
          placeholder="在这里编辑 form schema JSON"
        />
        <el-alert
          v-if="parseError"
          title="JSON 解析失败"
          :description="parseError"
          type="error"
          show-icon
          class="mt"
        />
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card>
        <template #header>
          <strong>Form 预览</strong>
        </template>
        <SchemaForm
          v-if="schema"
          ref="formRef"
          :schema="schema"
          @submit="onSubmit"
          @reset="onReset"
        >
          <template #footer>
            <SchemaToolbar :items="toolbarItems" @action="onToolbarAction" />
          </template>
        </SchemaForm>
        <el-empty v-else description="请修复左侧 JSON" />
      </el-card>

      <el-card class="mt">
        <template #header>
          <strong>提交结果</strong>
        </template>
        <pre class="result">{{ resultText }}</pre>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.playground {
  width: 100%;
}

.mt {
  margin-top: 12px;
}

.result {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
