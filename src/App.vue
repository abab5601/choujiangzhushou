<!-- src/App.vue -->
<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>抽獎助手</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tabs>
        <v-tab :to="{ name: 'home' }">首頁</v-tab>
        <v-tab :to="{ name: 'input' }">添加獎號</v-tab>
        <v-tab :to="{ name: 'results' }">自動對獎</v-tab>
        <v-tab :to="{ name: 'management' }">抽獎管理</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style>
.v-container {
  max-width: 1200px;
}
</style> 