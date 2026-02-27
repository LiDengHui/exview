<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted } from 'vue'
import { useSchemaForm } from '../useSchemaForm'
import { resolveSchemaFormComponent } from '../componentRegistry'
import { migrateFormSchema } from '@exview/schema-shared'
import type { FormSchema } from '@exview/schema-shared'

const props = defineProps<{
  schema: FormSchema
  model?: Record<string, unknown>
}>()

const runtimeSchema = computed(() => migrateFormSchema(props.schema))

const emit = defineEmits<{
  submit: [model: Record<string, unknown>]
  reset: [model: Record<string, unknown>]
}>()

const {
  formRef,
  model,
  rules,
  loadingOptions,
  preloadOptions,
  getFieldOptions,
  resolveFieldProps,
  resolveFieldVisible,
  resolveFieldDisabled,
  fieldErrorMap,
  fieldDebugMap,
  isDirty,
  isTouched,
  isValid,
  validateField,
  setValues,
  getValues,
  getOutputValues,
  resetFields,
  submit,
  reset
} = useSchemaForm(runtimeSchema.value, props.model)

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
  if (typeof field.span === 'object' && field.span) {
    const md = Number(field.span.md ?? field.span.sm ?? field.span.xs ?? 12)
    if (Number.isNaN(md)) return 12
    return Math.min(24, Math.max(1, md))
  }
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
  return runtimeSchema.value.fields.map((field, index) => ({
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

const debugSnapshot = computed(() => ({
  model: getValues(),
  linkMap: renderedFields.value.map((field) => ({
    field: field.name,
    deps: field.deps || 'auto',
    visibleWhen: field.visibleWhen ? 'on' : 'off',
    disabledWhen: field.disabledWhen ? 'on' : 'off',
    requiredWhen: field.requiredWhen ? 'on' : 'off',
    trace: fieldDebugMap[field.name] || ''
  })),
  errors: fieldErrorMap
}))

defineExpose({
  setValues,
  getValues,
  getOutputValues,
  resetFields,
  resetForm,
  submit,
  submitForm,
  validateField,
  isValid,
  isDirty,
  isTouched
})

async function submitForm() {
  try {
    const payload = await submit()
    emit('submit', payload)
    return payload
  } catch {
    ElMessage.warning('表单验证失败')
    await nextTick()
    const firstInvalid = document.querySelector(
      '.el-form-item.is-error input, .el-form-item.is-error textarea, .el-form-item.is-error .el-select__wrapper'
    ) as HTMLElement | null
    firstInvalid?.focus?.()
    return null
  }
}

async function resetForm() {
  await reset()
  emit('reset', { ...model })
}
</script>

<template>
  <el-form ref="formRef" :model="model" :rules="rules" label-width="100px" @submit.prevent>
    <el-row :gutter="12">
      <template v-for="field in renderedFields" :key="field.__id">
        <el-col
          v-if="fieldStateMap[field.__id]?.shouldRender"
          :span="resolveSpan(field)"
          :xs="typeof field.span === 'object' ? field.span.xs : undefined"
          :sm="typeof field.span === 'object' ? field.span.sm : undefined"
          :md="typeof field.span === 'object' ? field.span.md : undefined"
          :lg="typeof field.span === 'object' ? field.span.lg : undefined"
          :xl="typeof field.span === 'object' ? field.span.xl : undefined"
          v-show="fieldStateMap[field.__id]?.visible"
        >
          <el-form-item :prop="field.name">
          <template #label>
            <slot :name="`label-${field.name}`" :field="field" :model="model">
              {{ field.label }}
            </slot>
          </template>
          <component
            :is="resolveSchemaFormComponent(field)"
            v-model="model[field.name]"
            :disabled="fieldStateMap[field.__id]?.disabled"
            :item-schema="field.itemSchema"
            v-bind="fieldStateMap[field.__id]?.fieldProps"
            :placeholder="fieldStateMap[field.__id]?.placeholder"
            :type="isTextareaField(field) ? 'textarea' : undefined"
            :loading="isSelectField(field) ? loadingOptions[field.name] : undefined"
          >
            <template #suffix>
              <slot :name="`suffix-${field.name}`" :field="field" :model="model" />
            </template>
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
          <div v-if="field.help || field.extra || $slots[`extra-${field.name}`]" class="schema-extra">
            <slot :name="`extra-${field.name}`" :field="field" :model="model">
              <small v-if="field.help" class="schema-help">{{ field.help }}</small>
              <small v-if="field.extra">{{ field.extra }}</small>
            </slot>
          </div>
          <div v-if="runtimeSchema.debug" class="schema-debug">
            <small>trace: {{ fieldDebugMap[field.name] || 'pending' }}</small>
            <small v-if="fieldErrorMap[field.name]" class="schema-debug-error">error: {{ fieldErrorMap[field.name] }}</small>
          </div>
        </el-form-item>
      </el-col>
      </template>
    </el-row>

    <slot name="footer" :model="model" :submit="submitForm" :reset="resetForm" />

    <el-collapse v-if="runtimeSchema.debug" class="schema-debug-panel">
      <el-collapse-item title="Schema Debug Panel" name="schema-debug">
        <pre class="schema-debug-json">{{ JSON.stringify(debugSnapshot, null, 2) }}</pre>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<style scoped>
.schema-extra,
.schema-debug {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  color: #909399;
}

.schema-help {
  color: #606266;
}

.schema-debug-error {
  color: #f56c6c;
}

.schema-debug-panel {
  margin-top: 12px;
}

.schema-debug-json {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 6px;
}
</style>
