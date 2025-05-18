<!-- src/components/ConsentBanner.vue -->
<template>
  <v-snackbar
    v-model="show"
    :timeout="-1"
    location="bottom"
    class="consent-banner"
  >
    <div class="d-flex flex-column">
      <div class="text-body-1 mb-2">
        我們使用 Cookie 來改善您的體驗並分析網站流量。您可以選擇接受或拒絕這些 Cookie。
      </div>
      <div class="d-flex flex-wrap gap-2">
        <v-btn
          color="primary"
          @click="acceptAll"
        >
          接受全部
        </v-btn>
        <v-btn
          color="secondary"
          variant="outlined"
          @click="showSettings = true"
        >
          自定義設置
        </v-btn>
        <v-btn
          color="error"
          variant="text"
          @click="rejectAll"
        >
          拒絕全部
        </v-btn>
      </div>
    </div>

    <!-- 設置對話框 -->
    <v-dialog
      v-model="showSettings"
      max-width="500"
    >
      <v-card>
        <v-card-title>Cookie 設置</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>分析 Cookie</v-list-item-title>
              <v-list-item-subtitle>
                幫助我們了解網站的使用情況，以改善用戶體驗
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-switch
                  v-model="settings.analytics_storage"
                  :true-value="'granted'"
                  :false-value="'denied'"
                  hide-details
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>廣告 Cookie</v-list-item-title>
              <v-list-item-subtitle>
                用於提供個人化廣告體驗
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-switch
                  v-model="settings.ad_storage"
                  :true-value="'granted'"
                  :false-value="'denied'"
                  hide-details
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>個人化設置</v-list-item-title>
              <v-list-item-subtitle>
                允許根據您的興趣提供個人化內容
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-switch
                  v-model="settings.ad_personalization"
                  :true-value="'granted'"
                  :false-value="'denied'"
                  hide-details
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="saveSettings"
          >
            保存設置
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { analytics } from '@/utils/analytics'

const show = ref(true)
const showSettings = ref(false)

const settings = reactive({
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
} as {
  analytics_storage: 'granted' | 'denied'
  ad_storage: 'granted' | 'denied'
  ad_user_data: 'granted' | 'denied'
  ad_personalization: 'granted' | 'denied'
})

// 接受所有 Cookie
const acceptAll = () => {
  Object.keys(settings).forEach(key => {
    settings[key as keyof typeof settings] = 'granted'
  })
  saveSettings()
}

// 拒絕所有 Cookie
const rejectAll = () => {
  Object.keys(settings).forEach(key => {
    settings[key as keyof typeof settings] = 'denied'
  })
  saveSettings()
}

// 保存設置
const saveSettings = () => {
  analytics.updateConsent(settings)
  show.value = false
  showSettings.value = false
  
  // 保存用戶選擇到 localStorage
  localStorage.setItem('cookieConsent', JSON.stringify(settings))
}

// 檢查是否已有保存的設置
const savedSettings = localStorage.getItem('cookieConsent')
if (savedSettings) {
  const parsed = JSON.parse(savedSettings)
  Object.assign(settings, parsed)
  show.value = false
}
</script>

<style scoped>
.consent-banner {
  max-width: 600px;
  margin: 0 auto;
}

.gap-2 {
  gap: 8px;
}
</style> 