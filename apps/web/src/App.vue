<template>
  <el-container class="layout">
    <el-header class="header">Exview Modernized</el-header>
    <el-container>
      <el-aside width="220px" class="aside">
        <el-menu router default-active="/">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/form">表单</el-menu-item>
          <el-menu-item index="/table">表格</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout { min-height: 100vh; }
.header { color: #fff; background: #409eff; line-height: 60px; font-weight: 700; }
.aside { border-right: 1px solid #eee; }
</style>
