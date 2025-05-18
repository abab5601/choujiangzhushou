<template>
  <div class="home-view">
    <v-alert
      v-if="showAlert"
      type="info"
      class="mb-4"
      closable
      @click:close="handleAlertClose"
    >
      提醒：所有紀錄都存儲在本地，請記得定期匯出備份以免資料遺失。
    </v-alert>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>獎號統計</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-2">{{ tickets.length }}</div>
            <div class="text-subtitle-1">總獎號數量</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>中獎統計</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-2">{{ winners.length }}</div>
            <div class="text-subtitle-1">中獎號碼數量</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title>最近添加的獎號</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="ticket in recentTickets"
            :key="ticket.id"
            :title="ticket.number"
            :subtitle="new Date(ticket.timestamp).toLocaleString('zh-TW')"
          >
            <template v-slot:append>
              <v-chip
                :color="ticket.isWinner ? 'success' : 'default'"
                :text="ticket.isWinner ? '已中獎' : '未中獎'"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>快速操作</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              block
              color="primary"
              :to="{ name: 'input' }"
            >
              添加獎號
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              block
              color="info"
              :to="{ name: 'results' }"
            >
              自動對獎
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 確認對話框 -->
    <v-dialog v-model="showDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          關閉提醒
        </v-card-title>
        <v-card-text>
          <v-checkbox
            v-model="neverShowAgain"
            label="不再顯示此提醒"
            hide-details
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="cancelClose"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="confirmClose"
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import { updateMetaInfo } from '@/utils/seo'

const store = useLotteryStore()
const tickets = computed(() => store.tickets)
const winners = computed(() => store.winners)
const recentTickets = computed(() => 
  [...tickets.value]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
)

const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 提醒相關
const showAlert = ref(!localStorage.getItem('hideBackupAlert'))
const showDialog = ref(false)
const neverShowAgain = ref(false)

const handleAlertClose = () => {
  showDialog.value = true
}

const cancelClose = () => {
  neverShowAgain.value = false
  showDialog.value = false
}

const confirmClose = () => {
  if (neverShowAgain.value) {
    localStorage.setItem('hideBackupAlert', 'true')
  }
  showAlert.value = false
  showDialog.value = false
}

// SEO 優化
onMounted(() => {
  updateMetaInfo({
    title: '首頁',
    description: '抽獎助手幫您輕鬆管理抽獎活動，提供線上抽獎、自動對獎等功能',
    keywords: '抽獎助手,線上抽獎,獎號管理,自動對獎,抽獎工具',
    ogTitle: '抽獎助手首頁',
    ogDescription: '專業的抽獎和對獎工具，輕鬆管理您的抽獎活動',
    twitterTitle: '抽獎助手首頁',
    twitterDescription: '專業的抽獎和對獎工具，輕鬆管理您的抽獎活動'
  })
})
</script>

<style scoped>
.home-view {
  padding: 16px 0;
}

:deep(.v-stepper) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.v-snackbar) {
  z-index: 24999 !important;
}
</style> 