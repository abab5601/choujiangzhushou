<!-- src/App.vue -->
<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>抽獎助手</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
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
        Version 1.0.0
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const drawer = ref(false)
    const menuItems = [
      { title: '抽獎', path: '/', icon: 'mdi-gift' },
      { title: '歷史記錄', path: '/history', icon: 'mdi-history' },
      { title: '關於', path: '/about', icon: 'mdi-information' }
    ]

    return {
      drawer,
      menuItems
    }
  }
})
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