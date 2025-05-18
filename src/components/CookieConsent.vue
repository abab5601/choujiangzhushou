<!-- src/components/CookieConsent.vue -->
<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="400"
  >
    <v-card class="consent-card">
      <v-card-text class="pt-4">
        <p class="text-body-1 mb-2">
          我需要知道流量，請幫我點擊接受全部，請放心是安全的。
        </p>
        <p class="text-body-1 mb-4">
          我們使用 Cookie 來改善您的體驗並分析網站流量。您可以選擇接受或拒絕這些 Cookie。
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          variant="elevated"
          class="consent-btn"
          @click="acceptAll"
        >
          接受全部
        </v-btn>
        <v-btn
          color="grey"
          variant="elevated"
          class="consent-btn"
          @click="customizeSettings"
        >
          自定義設置
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          class="consent-btn"
          @click="rejectAll"
        >
          拒絕全部
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 自定義設置對話框 -->
  <v-dialog
    v-model="showCustomDialog"
    max-width="400"
  >
    <v-card>
      <v-card-title>Cookie 設置</v-card-title>
      <v-card-text>
        <v-checkbox
          v-model="settings.analytics"
          label="分析 Cookie"
          hide-details
          class="mb-2"
        ></v-checkbox>
        <v-checkbox
          v-model="settings.ads"
          label="廣告 Cookie"
          hide-details
          class="mb-2"
        ></v-checkbox>
        <v-checkbox
          v-model="settings.personalization"
          label="個人化設置"
          hide-details
          class="mb-2"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          @click="saveCustomSettings"
        >
          保存設置
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showDialog = ref(false)
const showCustomDialog = ref(false)
const settings = ref({
  analytics: true,
  ads: true,
  personalization: true
})

// 檢查是否已經有保存的同意設置
onMounted(() => {
  const savedConsent = localStorage.getItem('cookieConsent')
  if (!savedConsent) {
    showDialog.value = true
  } else {
    const consent = JSON.parse(savedConsent)
    // 如果之前拒絕了，就再次顯示對話框
    if (consent.analytics_storage === 'denied' && 
        consent.ad_storage === 'denied' && 
        consent.ad_personalization === 'denied') {
      showDialog.value = true
    } else {
      updateConsent(
        consent.analytics_storage === 'granted',
        consent.ad_storage === 'granted',
        consent.ad_personalization === 'granted'
      )
    }
  }
})

// 更新 Google Analytics 的同意設置
function updateConsent(analytics: boolean, ads: boolean, personalization: boolean) {
  // @ts-ignore
  gtag('consent', 'update', {
    'analytics_storage': analytics ? 'granted' : 'denied',
    'ad_storage': ads ? 'granted' : 'denied',
    'ad_user_data': ads ? 'granted' : 'denied',
    'ad_personalization': personalization ? 'granted' : 'denied'
  })

  // 如果全部拒絕，則不保存到 localStorage，這樣下次訪問時會再次詢問
  if (!analytics && !ads && !personalization) {
    localStorage.removeItem('cookieConsent')
  } else {
    // 保存設置到 localStorage
    localStorage.setItem('cookieConsent', JSON.stringify({
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: ads ? 'granted' : 'denied',
      ad_user_data: ads ? 'granted' : 'denied',
      ad_personalization: personalization ? 'granted' : 'denied'
    }))
  }
}

// 接受所有 Cookie
function acceptAll() {
  updateConsent(true, true, true)
  showDialog.value = false
}

// 拒絕所有 Cookie
function rejectAll() {
  updateConsent(false, false, false)
  showDialog.value = false
}

// 打開自定義設置
function customizeSettings() {
  showDialog.value = false
  showCustomDialog.value = true
}

// 保存自定義設置
function saveCustomSettings() {
  updateConsent(
    settings.value.analytics,
    settings.value.ads,
    settings.value.personalization
  )
  showCustomDialog.value = false
}

// 導出方法以供外部調用
defineExpose({
  showDialog
})
</script>

<style scoped>
.consent-card {
  background-color: rgba(51, 51, 51, 0.9) !important;
  color: white !important;
}

.consent-btn {
  flex: 1;
  margin: 0 4px !important;
}

:deep(.v-card-text) {
  color: white !important;
}
</style> 