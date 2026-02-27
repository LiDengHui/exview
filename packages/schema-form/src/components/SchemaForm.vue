<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import { useSchemaForm } from '../useSchemaForm'
import { resolveSchemaFormComponent } from '../componentRegistry'
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

onMounted(preloadOptions)

function isSelectField(field: FormSchema['fields'][number]) {
  return field.widget === 'select' || field.component === 'select'
}

function isRadioGroupField(field: FormSchema['fields'][number]) {
  return field.widget === 'radio-group' || field.component === 'radio-group'
}

function isCheckboxGroupField(field: FormSchema['fields'][number]) {
  return field.widget === 'checkbox-group' || field.component === 'checkbox-group'
}

function isTextareaField(field: FormSchema['fields'][number]) {
  return field.widget === 'textarea' || field.component === 'textarea'
}

function resolveSpan(field: FormSchema['fields'][number]) {
  if (field.row) return 24
  const span = Number(field.span ?? 12)
  if (Number.isNaN(span)) return 12
  return Math.min(24, Math.max(1, span))
}

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
  <el-form ref="formRef" :model="model" :rules="rules" label-width="100px" @submit.prevent>
    <el-row :gutter="12">
      <el-col
        v-for="field in schema.fields"
        :key="field.name"
        :span="resolveSpan(field)"
        v-show="resolveFieldVisible(field, model)"
      >
        <el-form-item :label="field.label" :prop="field.name">
          <component
            :is="resolveSchemaFormComponent(field)"
            v-model="model[field.name]"
            :disabled="resolveFieldDisabled(field, model)"
            v-bind="resolveFieldProps(field, model)"
            :placeholder="(resolveFieldProps(field, model).placeholder as string) || `请输入${field.label}`"
            :type="isTextareaField(field) ? 'textarea' : undefined"
            :loading="isSelectField(field) ? loadingOptions[field.name] : undefined"
          >
            <template v-if="isSelectField(field)">
              <el-option
                v-for="item in getFieldOptions(field)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </template>

            <template v-else-if="isRadioGroupField(field)">
              <el-radio
                v-for="item in getFieldOptions(field)"
                :key="item.value"
                :label="item.value"
                :disabled="item.disabled"
              >
                {{ item.label }}
              </el-radio>
            </template>

            <template v-else-if="isCheckboxGroupField(field)">
              <el-checkbox
                v-for="item in getFieldOptions(field)"
                :key="item.value"
                :label="item.value"
                :disabled="item.disabled"
              >
                {{ item.label }}
              </el-checkbox>
            </template>
          </component>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button
        v-for="item in toolbar"
        :key="item.signal"
        :type="item.type as any"
        native-type="button"
        @click="onAction(item.signal, item.validate)"
      >
        {{ item.text }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
