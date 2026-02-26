<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import ExTable from '../components/business/ExTable.vue'
import type { UserItem } from '../mock/users'
import { userService } from '../services/userService'

const rows = ref<UserItem[]>([])

async function refresh() {
  rows.value = await userService.list()
}

async function removeRow(id: number) {
  await ElMessageBox.confirm('确认删除该用户？', '提示')
  await userService.remove(id)
  await refresh()
}

onMounted(refresh)
</script>

<template>
  <el-card>
    <h3>表格迁移版</h3>
    <ExTable :rows="rows" @remove="removeRow" />
  </el-card>
</template>
