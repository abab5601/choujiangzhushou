<!-- src/views/AboutView.vue -->
<template>
  <div class="about-view">
    <v-card>
      <v-card-title>關於抽獎助手</v-card-title>
      <v-card-text>
        <p class="mb-4">
          抽獎助手是一個簡單易用的工具，幫助您管理和進行抽獎活動。無論是小型活動還是大規模抽獎，都能輕鬆應對。
        </p>

        <h3 class="text-h6 mb-2">主要功能</h3>
        <v-list>
          <v-list-item>
            <v-list-item-title>隨機抽獎</v-list-item-title>
            <v-list-item-subtitle>支持設置抽獎數量，多種動畫效果</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>手動輸入中獎號碼</v-list-item-title>
            <v-list-item-subtitle>批量輸入，自動比對，即時反饋</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>歷史記錄</v-list-item-title>
            <v-list-item-subtitle>查看歷史開獎記錄，按時間排序</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>數據管理</v-list-item-title>
            <v-list-item-subtitle>本地存儲，支持導入/導出功能</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <h3 class="text-h6 mb-2 mt-4">技術棧</h3>
        <v-list>
          <v-list-item>
            <v-list-item-title>Vue 3</v-list-item-title>
            <v-list-item-subtitle>使用最新的組合式 API</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>TypeScript</v-list-item-title>
            <v-list-item-subtitle>提供完整的類型支持</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Vuetify</v-list-item-title>
            <v-list-item-subtitle>美觀的 Material Design 界面</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Pinia</v-list-item-title>
            <v-list-item-subtitle>高效的狀態管理</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <h3 class="text-h6 mb-2 mt-4">版本信息</h3>
        <p>當前版本：1.0.0</p>
        <p>
          <a
            href="https://github.com/yourusername/choujiangzhushou"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none"
          >
            在 GitHub 上查看源碼
          </a>
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { updateMetaInfo } from '@/utils/seo'

// SEO 優化
onMounted(() => {
  updateMetaInfo({
    title: '關於抽獎助手',
    description: '了解抽獎助手的功能特點、技術實現和版本信息',
    keywords: '抽獎助手,功能介紹,技術棧,版本信息',
    ogTitle: '關於抽獎助手',
    ogDescription: '了解抽獎助手的所有特性和技術細節',
    twitterTitle: '關於抽獎助手',
    twitterDescription: '了解抽獎助手的所有特性和技術細節'
  })
})
</script>

<style scoped>
.about-view {
  padding: 16px 0;
}
</style> 