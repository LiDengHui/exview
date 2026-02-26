<script setup lang="ts">
const navs = [
  {
    label: '内容管理',
    children: ['文章管理', '评论管理', '举报管理']
  },
  {
    label: '用户管理',
    children: ['新增用户', '活跃用户']
  },
  {
    label: '统计分析',
    children: ['新增和启动', '活跃分析', '时段分析', '用户留存', '流失用户']
  }
]
</script>

<template>
  <el-card>
    <h3>菜单迁移版</h3>
    <el-collapse>
      <el-collapse-item v-for="group in navs" :key="group.label" :title="group.label" :name="group.label">
        <el-tag v-for="item in group.children" :key="item" style="margin: 4px">{{ item }}</el-tag>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
