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
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

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
        Version 1.1.1
      </div>
    </v-footer>

    <!-- Cookie 同意聲明對話框 -->
    <CookieConsent />
    <welcome-dialog @close="handleWelcomeClose" />
  </v-app>
</template>

<script setup lang="ts">
import CookieConsent from '@/components/CookieConsent.vue'
import WelcomeDialog from '@/components/WelcomeDialog.vue'

function handleWelcomeClose() {
  // 可以在這裡添加額外的處理邏輯
  console.log('Welcome dialog closed')
}
</script>

<style>
.v-container {
  max-width: 1200px;
}

.v-footer {
  background-color: rgb(var(--v-theme-surface)) !important;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 