<!-- src/App.vue -->
<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>彩票助手</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tabs>
        <v-tab :to="{ name: 'home' }">首頁</v-tab>
        <v-tab :to="{ name: 'input' }">輸入號碼</v-tab>
        <v-tab :to="{ name: 'results' }">開獎結果</v-tab>
        <v-tab :to="{ name: 'history' }">歷史記錄</v-tab>
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