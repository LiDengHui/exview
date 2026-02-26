<script setup lang="ts">
import type { UserItem } from '../../mock/users'

defineProps<{ rows: UserItem[] }>()
const emit = defineEmits<{ remove: [id: number] }>()
</script>

<template>
  <el-table :data="rows" style="width: 100%">
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="age" label="Age" width="100" />
    <el-table-column prop="phone" label="Phone" />
    <el-table-column prop="email" label="Email" />
    <el-table-column label="操作" width="120">
      <template #default="scope">
        <el-button type="danger" link @click="emit('remove', scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
