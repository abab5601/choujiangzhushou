<!-- src/components/WelcomeDialog.vue -->
<template>
  <v-dialog
    v-model="showDialog"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        歡迎使用抽獎助手
        <v-spacer></v-spacer>
        <v-btn
          icon
          variant="text"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <div class="text-body-1 mb-4">
          這是一個幫助您管理和進行抽獎的工具，主要功能包括：
        </div>

        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-ticket-outline</v-icon>
            </template>
            <v-list-item-title>獎號管理</v-list-item-title>
            <v-list-item-subtitle>
              支持單張、批量和範圍輸入獎號
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="success">mdi-dice-multiple</v-icon>
            </template>
            <v-list-item-title>隨機抽獎</v-list-item-title>
            <v-list-item-subtitle>
              從未中獎的號碼中隨機抽取指定數量
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="info">mdi-ticket-confirmation</v-icon>
            </template>
            <v-list-item-title>手動兌獎</v-list-item-title>
            <v-list-item-subtitle>
              輸入官方中獎號碼進行自動比對
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="warning">mdi-history</v-icon>
            </template>
            <v-list-item-title>歷史記錄</v-list-item-title>
            <v-list-item-subtitle>
              查看所有歷史開獎記錄和中獎情況
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="error">mdi-cloud-sync</v-icon>
            </template>
            <v-list-item-title>數據備份</v-list-item-title>
            <v-list-item-subtitle>
              支持導入導出數據，確保獎號安全
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-checkbox
          v-model="neverShowAgain"
          label="不再顯示此提示"
          class="mt-4"
          hide-details
        ></v-checkbox>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="closeDialog"
        >
          開始使用
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showDialog = ref(false)
const neverShowAgain = ref(false)

const emit = defineEmits(['close'])

onMounted(() => {
  // 檢查是否首次訪問
  const hasShownWelcome = localStorage.getItem('hasShownWelcome')
  if (!hasShownWelcome) {
    showDialog.value = true
  }
})

function closeDialog() {
  showDialog.value = false
  // 如果選擇不再顯示，保存到 localStorage
  if (neverShowAgain.value) {
    localStorage.setItem('hasShownWelcome', 'true')
  }
  emit('close')
}
</script> 