<template>
  <div class="home-view">
    <v-alert
      type="info"
      class="mb-4"
      closable
    >
      提醒：所有紀錄都存儲在手機中，不會上傳服務器，請記得定期匯出備份以免資料遺失。
    </v-alert>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>彩票統計</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-2">{{ tickets.length }}</div>
            <div class="text-subtitle-1">總彩票數量</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>中獎統計</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-2">{{ winners.length }}</div>
            <div class="text-subtitle-1">中獎彩票數量</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title>最近添加的彩票</v-card-title>
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
              添加新彩票
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              block
              color="secondary"
              :to="{ name: 'results' }"
            >
              查看開獎結果
            </v-btn>
          </v-col>
          <v-col cols="12" class="mt-4">
            <v-btn
              block
              color="error"
              @click="showClearConfirm = true"
            >
              清除所有數據
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showClearConfirm" max-width="400">
      <v-card>
        <v-card-title>確認清除</v-card-title>
        <v-card-text>
          確定要清除所有彩票數據嗎？此操作無法恢復。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="default"
            variant="text"
            @click="showClearConfirm = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            @click="clearAllData"
          >
            確認清除
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
import { computed, ref } from 'vue'
import { useLotteryStore } from '@/stores/lottery'

const store = useLotteryStore()
const tickets = computed(() => store.tickets)
const winners = computed(() => store.winners)
const recentTickets = computed(() => 
  [...tickets.value]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
)

const showClearConfirm = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

function clearAllData() {
  store.clearAllData()
  showClearConfirm.value = false
  snackbarText.value = '所有數據已清除'
  snackbarColor.value = 'success'
  showSnackbar.value = true
}
</script>

<style scoped>
.home-view {
  padding: 16px 0;
}
</style> 