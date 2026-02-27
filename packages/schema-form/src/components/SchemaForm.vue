<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import { useSchemaForm } from '../useSchemaForm'
import type { FormSchema } from '@exview/schema-shared'

const props = defineProps<{
  schema: FormSchema
  model?: Record<string, unknown>
}>()

const emit = defineEmits<{
  submit: [model: Record<string, unknown>]
  reset: [model: Record<string, unknown>]
}>()

const {
  formRef,
  model,
  rules,
  toolbar,
  loadingOptions,
  preloadOptions,
  getFieldOptions,
  resolveFieldProps,
  resolveFieldVisible,
  resolveFieldDisabled,
  submit,
  reset
} = useSchemaForm(props.schema, props.model)

const componentMap = {
  input: 'el-input',
  'input-number': 'el-input-number',
  select: 'el-select'
} as const

onMounted(preloadOptions)

async function onAction(signal: string, validate?: boolean) {
  if (signal === 'reset') {
    reset()
    emit('reset', { ...model })
    return
  }

  if (validate) {
    try {
      const payload = await submit()
      emit(signal as 'submit', payload)
    } catch {
      ElMessage.warning('表单验证失败')
    }
    return
  }

  emit(signal as 'submit', { ...model })
}
</script>

<template>
  <el-form ref="formRef" :model="model" :rules="rules" label-width="100px">
    <template v-for="field in schema.fields" :key="field.name">
      <el-form-item
        v-if="resolveFieldVisible(field, model)"
        :label="field.label"
        :prop="field.name"
      >
        <component
          :is="componentMap[field.widget]"
          v-model="model[field.name]"
          :disabled="resolveFieldDisabled(field, model)"
          v-bind="resolveFieldProps(field, model)"
          :placeholder="(resolveFieldProps(field, model).placeholder as string) || `请输入${field.label}`"
          :loading="field.widget === 'select' ? loadingOptions[field.name] : undefined"
        >
          <template v-if="field.widget === 'select'">
            <el-option
              v-for="item in getFieldOptions(field)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </template>
        </component>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button
        v-for="item in toolbar"
        :key="item.signal"
        :type="item.type as any"
        @click="onAction(item.signal, item.validate)"
      >
        {{ item.text }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
