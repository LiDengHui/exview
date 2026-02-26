<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { userMockApi, type UserItem } from '../mock/users'

const rows = ref<UserItem[]>([])

async function refresh() {
  rows.value = await userMockApi.list()
}

async function removeRow(id: number) {
  await ElMessageBox.confirm('确认删除该用户？', '提示')
  await userMockApi.remove(id)
  await refresh()
}

onMounted(refresh)
</script>

<template>
  <el-card>
    <h3>表格迁移版</h3>
    <el-table :data="rows" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="age" label="Age" width="100" />
      <el-table-column prop="phone" label="Phone" />
      <el-table-column prop="email" label="Email" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="danger" link @click="removeRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
