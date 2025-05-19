<!-- src/App.vue -->
<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>抽獎助手</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

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
import { ref } from 'vue'
import CookieConsent from '@/components/CookieConsent.vue'
import WelcomeDialog from '@/components/WelcomeDialog.vue'

const drawer = ref(false)

const menuItems = [
  { title: '首頁', icon: 'mdi-home', to: '/' },
  { title: '輸入獎號', icon: 'mdi-ticket', to: '/input' },
  { title: '開獎結果', icon: 'mdi-star', to: '/results' },
  { title: '歷史記錄', icon: 'mdi-history', to: '/history' }
]

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