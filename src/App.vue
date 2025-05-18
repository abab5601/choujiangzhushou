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

    <ConsentBanner />

    <v-footer app class="text-center d-flex flex-column">
      <div>
        <span class="text-caption">
          © {{ new Date().getFullYear() }} 抽獎助手
        </span>
        <span class="mx-1">|</span>
        <a
          href="https://github.com/yourusername/choujiangzhushou"
          target="_blank"
          rel="noopener noreferrer"
          class="text-caption text-decoration-none"
        >
          GitHub
        </a>
        <span class="mx-1">|</span>
        <span class="text-caption">
          Made with <v-icon icon="mdi-heart" color="error" size="small"></v-icon> by abab5601 & AI cursor
        </span>
      </div>
      <div class="text-caption mt-1">
        Version 1.0.0
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import ConsentBanner from '@/components/ConsentBanner.vue'
</script>

<style>
.v-container {
  max-width: 1200px;
}

.v-footer {
  background-color: rgb(var(--v-theme-surface)) !important;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style> 