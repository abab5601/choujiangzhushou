<template>
  <div class="ticket-input-view">
    <v-card>
      <v-tabs v-model="activeInputTab">
        <v-tab value="single">單張輸入</v-tab>
        <v-tab value="batch">批量輸入</v-tab>
        <v-tab value="range">範圍輸入</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeInputTab">
          <!-- Single Ticket Input -->
          <v-window-item value="single">
            <v-form @submit.prevent="handleSingleTicket">
              <v-text-field
                v-model="singleTicket"
                label="彩票號碼"
                placeholder="例如：A123X"
                :rules="[v => !!v || '請輸入彩票號碼']"
                clearable
              />
              <v-btn
                type="submit"
                color="primary"
                block
                :disabled="!singleTicket"
              >
                添加彩票
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Batch Input -->
          <v-window-item value="batch">
            <v-form @submit.prevent="handleBatchTickets">
              <v-textarea
                v-model="batchTickets"
                label="輸入多個彩票號碼"
                placeholder="每行輸入一個號碼，或用逗號分隔"
                :rules="[v => !!v || '請輸入彩票號碼']"
                rows="5"
                clearable
              />
              <div class="text-caption mb-2">
                當前輸入：{{ batchTicketCount }} 張彩票
              </div>
              <v-btn
                type="submit"
                color="primary"
                block
                :disabled="!batchTickets"
              >
                批量添加
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Range Input -->
          <v-window-item value="range">
            <v-form @submit.prevent="handleRangeTickets">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="rangeStart"
                    label="起始號碼"
                    placeholder="例如：A001"
                    :rules="[v => !!v || '請輸入起始號碼']"
                    clearable
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="rangeEnd"
                    label="結束號碼"
                    placeholder="例如：A100"
                    :rules="[v => !!v || '請輸入結束號碼']"
                    clearable
                  />
                </v-col>
              </v-row>
              <div class="text-caption mb-2">
                當前範圍：{{ rangeTicketCount }} 張彩票
              </div>
              <v-btn
                type="submit"
                color="primary"
                block
                :disabled="!rangeStart || !rangeEnd"
              >
                生成彩票
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- Recently Added Tickets -->
    <v-card class="mt-4">
      <v-card-title>最近添加的彩票</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="ticket in recentlyAdded"
            :key="ticket.id"
            :title="ticket.number"
            :subtitle="new Date(ticket.timestamp).toLocaleString('zh-TW')"
          >
            <template v-slot:append>
              <v-tooltip text="刪除此號碼">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="removeTicket(ticket.id)"
                    v-bind="props"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import { updateMetaInfo } from '@/utils/seo'

const store = useLotteryStore()

// SEO 優化
onMounted(() => {
  updateMetaInfo({
    title: '彩票輸入',
    description: '提供單張輸入、批量輸入和範圍輸入三種方式，方便快速添加彩票號碼',
    keywords: '彩票輸入,批量輸入,範圍輸入,彩票號碼,彩票管理',
    ogTitle: '彩票輸入 - 多種輸入方式',
    ogDescription: '提供多種便捷的彩票號碼輸入方式，支持單張、批量和範圍輸入',
    twitterTitle: '彩票輸入 - 多種輸入方式',
    twitterDescription: '提供多種便捷的彩票號碼輸入方式，支持單張、批量和範圍輸入'
  })
})

const activeInputTab = ref('single')
const singleTicket = ref('')
const batchTickets = ref('')
const rangeStart = ref('')
const rangeEnd = ref('')

const recentlyAdded = computed(() => 
  [...store.tickets]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
)

const batchTicketCount = computed(() => {
  if (!batchTickets.value) return 0
  return batchTickets.value
    .split(/[,\n]/)
    .map(t => t.trim())
    .filter(t => t)
    .length
})

const rangeTicketCount = computed(() => {
  if (!rangeStart.value || !rangeEnd.value) return 0
  
  const startNum = parseInt(rangeStart.value.replace(/^[A-Z]+/, ''))
  const endNum = parseInt(rangeEnd.value.replace(/^[A-Z]+/, ''))
  
  if (isNaN(startNum) || isNaN(endNum)) return 0
  return Math.max(0, endNum - startNum + 1)
})

function handleSingleTicket() {
  if (singleTicket.value) {
    store.addTicket(singleTicket.value.trim())
    singleTicket.value = ''
  }
}

function handleBatchTickets() {
  if (batchTickets.value) {
    const tickets = batchTickets.value
      .split(/[,\n]/)
      .map(t => t.trim())
      .filter(t => t)
    store.addBatchTickets(tickets)
    batchTickets.value = ''
  }
}

function handleRangeTickets() {
  if (rangeStart.value && rangeEnd.value) {
    store.addRangeTickets(rangeStart.value.trim(), rangeEnd.value.trim())
    rangeStart.value = ''
    rangeEnd.value = ''
  }
}

function removeTicket(id: string) {
  store.removeTicket(id)
}
</script>

<style scoped>
.ticket-input-view {
  padding: 16px 0;
}
</style> 