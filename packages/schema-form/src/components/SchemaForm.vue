<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, onMounted } from 'vue'
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
  fieldErrorMap,
  fieldDebugMap,
  setValues,
  getValues,
  resetFields,
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

function md5(str: string) {
  let h1 = 0x67452301
  let h2 = 0xefcdab89
  let h3 = 0x98badcfe
  let h4 = 0x10325476
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    h1 = (h1 ^ c) + ((h1 << 5) - h1)
    h2 = (h2 ^ c) + ((h2 << 7) - h2)
    h3 = (h3 ^ c) + ((h3 << 9) - h3)
    h4 = (h4 ^ c) + ((h4 << 13) - h4)
  }
  const toHex = (n: number) => ((n >>> 0).toString(16).padStart(8, '0'))
  return `${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}`
}

function fieldSignature(field: FormSchema['fields'][number], index: number) {
  const serialized = JSON.stringify(field, (_k, v) => {
    if (typeof v === 'function') return `__fn__:${v.toString()}`
    return v
  })
  return md5(`${index}:${serialized}`)
}

const renderedFields = computed(() => {
  return props.schema.fields.map((field, index) => ({
    ...field,
    __id: fieldSignature(field, index)
  }))
})

function getFieldState(field: FormSchema['fields'][number]) {
  const fieldProps = resolveFieldProps(field, model)
  const visible = resolveFieldVisible(field, model)
  const mode = field.visibleMode ?? 'show'
  return {
    fieldProps,
    visible,
    mode,
    shouldRender: mode === 'if' ? visible : true,
    disabled: resolveFieldDisabled(field, model),
    placeholder: (fieldProps.placeholder as string) || `请输入${field.label}`
  }
}

const fieldStateMap = computed(() => {
  const map: Record<string, ReturnType<typeof getFieldState>> = {}
  for (const field of renderedFields.value) {
    map[field.__id] = getFieldState(field)
  }
  return map
})

defineExpose({
  setValues,
  getValues,
  resetFields,
  submit
})

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
      <template v-for="field in renderedFields" :key="field.__id">
        <el-col
          v-if="fieldStateMap[field.__id]?.shouldRender"
          :span="resolveSpan(field)"
          v-show="fieldStateMap[field.__id]?.visible"
        >
          <el-form-item :label="field.label" :prop="field.name">
          <component
            :is="resolveSchemaFormComponent(field)"
            v-model="model[field.name]"
            :disabled="fieldStateMap[field.__id]?.disabled"
            v-bind="fieldStateMap[field.__id]?.fieldProps"
            :placeholder="fieldStateMap[field.__id]?.placeholder"
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
          <div v-if="schema.debug" class="schema-debug">
            <small>trace: {{ fieldDebugMap[field.name] || 'pending' }}</small>
            <small v-if="fieldErrorMap[field.name]" class="schema-debug-error">error: {{ fieldErrorMap[field.name] }}</small>
          </div>
        </el-form-item>
      </el-col>
      </template>
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

<style scoped>
.schema-debug {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  color: #909399;
}

.schema-debug-error {
  color: #f56c6c;
}
</style>
