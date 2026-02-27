<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useSchemaForm } from '../../composables/useSchemaForm'
import type { FormSchema } from '../../schema/types'

const props = defineProps<{
  schema: FormSchema
  model?: Record<string, unknown>
}>()

const emit = defineEmits<{
  submit: [model: Record<string, unknown>]
  reset: [model: Record<string, unknown>]
}>()

const { formRef, model, rules, toolbar, submit, reset } = useSchemaForm(props.schema, props.model)

const componentMap = {
  input: 'el-input',
  'input-number': 'el-input-number',
  select: 'el-select'
} as const

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
    } catch (error) {
      ElMessage.warning('表单验证失败')
    }
    return
  }

  emit(signal as 'submit', { ...model })
}
</script>

<template>
  <el-form ref="formRef" :model="model" :rules="rules" label-width="100px">
    <el-form-item
      v-for="field in schema.fields"
      :key="field.name"
      :label="field.label"
      :prop="field.name"
    >
      <component
        :is="componentMap[field.widget]"
        v-model="model[field.name]"
        v-bind="field.option"
        :placeholder="(field.option?.placeholder as string) || `请输入${field.label}`"
      >
        <template v-if="field.widget === 'select'">
          <el-option
            v-for="item in field.option?.options || []"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </template>
      </component>
    </el-form-item>

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
