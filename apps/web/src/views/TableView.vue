<script setup lang="ts">
const rows = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'Editor' }
]
</script>

<template>
  <el-card>
    <h3>表格示例</h3>
    <el-table :data="rows" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="role" label="Role" />
    </el-table>
  </el-card>
</template>
