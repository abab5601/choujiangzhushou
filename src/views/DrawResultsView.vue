<!-- src/views/DrawResultsView.vue -->
<template>
  <div class="draw-results-view">
    <v-card>
      <v-card-title class="d-flex align-center">
        開獎結果
        <v-spacer />
        <v-btn
          color="info"
          prepend-icon="mdi-history"
          @click="showWinningHistoryDialog = true"
          class="me-2"
        >
          歷史開獎
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-dice-multiple"
          @click="showDrawDialog = true"
          class="me-2"
        >
          隨機抽獎
        </v-btn>
        <v-btn
          color="success"
          prepend-icon="mdi-ticket-confirmation"
          @click="showWinningNumberDialog = true"
        >
          輸入中獎號碼
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="searchQuery"
              label="搜索彩票"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="filterStatus"
              :items="[
                { title: '全部彩票', value: 'all' },
                { title: '已中獎', value: 'winners' },
                { title: '未中獎', value: 'non-winners' }
              ]"
              label="篩選狀態"
            />
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="filteredTickets"
          :search="searchQuery"
          class="elevation-1"
        >
          <template v-slot:item.timestamp="{ item }">
            {{ new Date(item.timestamp).toLocaleString('zh-TW') }}
          </template>

          <template v-slot:item.isWinner="{ item }">
            <v-chip
              :color="item.isWinner ? 'success' : 'default'"
              :text="item.isWinner ? '已中獎' : '未中獎'"
            />
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              :color="item.isWinner ? 'error' : 'success'"
              @click="toggleWinnerStatus(item.id)"
              class="me-2"
            >
              <v-icon>
                {{ item.isWinner ? 'mdi-close' : 'mdi-check' }}
              </v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Random Draw Dialog -->
    <v-dialog v-model="showDrawDialog" max-width="500px">
      <v-card>
        <v-card-title>隨機抽獎</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="executeRandomDraw">
            <v-text-field
              v-model.number="numberOfWinners"
              type="number"
              label="中獎數量"
              min="1"
              :max="store.tickets.length"
              :rules="[
                v => !!v || '請輸入中獎數量',
                v => v > 0 || '必須大於0',
                v => v <= store.tickets.length || '不能超過總票數'
              ]"
            />
            <v-btn
              type="submit"
              color="primary"
              block
              :disabled="!numberOfWinners || numberOfWinners <= 0"
            >
              開始抽獎
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Winning Number Dialog -->
    <v-dialog v-model="showWinningNumberDialog" max-width="500px">
      <v-card>
        <v-card-title>輸入中獎號碼</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="checkWinningNumbers">
            <v-textarea
              v-model="winningNumbers"
              label="中獎號碼"
              placeholder="請輸入中獎號碼，每行一個號碼或用逗號分隔"
              :rules="[v => !!v || '請輸入中獎號碼']"
              rows="5"
              auto-grow
            />
            <v-btn
              type="submit"
              color="success"
              block
              :disabled="!winningNumbers"
            >
              確認中獎號碼
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Winning History Dialog -->
    <v-dialog v-model="showWinningHistoryDialog" max-width="600px">
      <v-card>
        <v-card-title>歷史開獎記錄</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="[
              { title: '開獎時間', key: 'timestamp', sortable: true },
              { title: '中獎號碼', key: 'numbers' }
            ]"
            :items="sortedWinningHistory"
            class="elevation-1"
          >
            <template v-slot:item.timestamp="{ item }">
              {{ new Date(item.timestamp).toLocaleString('zh-TW') }}
            </template>
            <template v-slot:item.numbers="{ item }">
              <div style="white-space: pre-line">
                {{ item.numbers.split(', ').join('\n') }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Result Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>

    <!-- Lottery Results Dialog -->
    <v-dialog v-model="showResultsDialog" max-width="600px">
      <v-card>
        <v-card-title>兌獎結果</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-subheader>已找到的中獎號碼</v-list-subheader>
            <template v-if="lotteryResults.matched.length > 0">
              <v-list-item v-for="ticket in lotteryResults.matched" :key="ticket.number">
                <template v-slot:prepend>
                  <v-icon :color="ticket.isNew ? 'success' : 'info'">
                    {{ ticket.isNew ? 'mdi-star' : 'mdi-check' }}
                  </v-icon>
                </template>
                <v-list-item-title>{{ ticket.number }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ ticket.isNew ? '新中獎' : '之前已中獎' }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-title>無中獎號碼</v-list-item-title>
            </v-list-item>

            <v-divider class="my-2"></v-divider>
            
            <v-list-subheader>未找到的號碼</v-list-subheader>
            <template v-if="lotteryResults.notFound.length > 0">
              <v-list-item v-for="number in lotteryResults.notFound" :key="number">
                <template v-slot:prepend>
                  <v-icon color="error">mdi-close</v-icon>
                </template>
                <v-list-item-title>{{ number }}</v-list-item-title>
                <v-list-item-subtitle>號碼不存在</v-list-item-subtitle>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-title>所有號碼都已找到</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="showResultsDialog = false"
          >
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title>確認刪除</v-card-title>
        <v-card-text>
          確定要刪除號碼 {{ ticketToDelete?.number }} 嗎？此操作無法撤銷。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="showDeleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            @click="deleteTicket"
          >
            確認刪除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLotteryStore, type WinningHistoryEntry } from '@/stores/lottery'

const store = useLotteryStore()

// Load data when component is mounted
onMounted(() => {
  store.loadFromStorage()
})

const searchQuery = ref('')
const filterStatus = ref('all')
const showDrawDialog = ref(false)
const showWinningNumberDialog = ref(false)
const showWinningHistoryDialog = ref(false)
const numberOfWinners = ref(1)
const winningNumbers = ref('')
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const showResultsDialog = ref(false)
const lotteryResults = ref({
  matched: [] as { number: string; isNew: boolean }[],
  notFound: [] as string[]
})

// Add new refs for delete confirmation
const showDeleteDialog = ref(false)
const ticketToDelete = ref<{ id: string; number: string } | null>(null)

const headers = [
  { title: '彩票號碼', key: 'number' },
  { title: '添加日期', key: 'timestamp' },
  { title: '狀態', key: 'isWinner' },
  { title: '操作', key: 'actions', sortable: false },
]

const filteredTickets = computed(() => {
  let tickets = store.tickets || []
  
  if (filterStatus.value === 'winners') {
    tickets = tickets.filter(t => t.isWinner)
  } else if (filterStatus.value === 'non-winners') {
    tickets = tickets.filter(t => !t.isWinner)
  }
  
  return tickets
})

const sortedWinningHistory = computed(() => {
  const history = store.winningHistory || []
  return [...history].sort((a, b) => b.timestamp - a.timestamp)
})

function toggleWinnerStatus(id: string) {
  const ticket = store.tickets.find(t => t.id === id)
  if (ticket) {
    if (ticket.isWinner) {
      store.removeWinner(id)
      showNotification('已取消中獎狀態', 'info')
    } else {
      store.markAsWinner(id)
      showNotification('已標記為中獎', 'success')
    }
  }
}

function executeRandomDraw() {
  const availableTickets = store.tickets.filter(t => !t.isWinner)
  const count = Math.min(numberOfWinners.value, availableTickets.length)
  
  // Fisher-Yates shuffle
  for (let i = availableTickets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableTickets[i], availableTickets[j]] = [availableTickets[j], availableTickets[i]]
  }
  
  // Select winners
  const selectedWinners = availableTickets.slice(0, count)
  selectedWinners.forEach(ticket => {
    store.markAsWinner(ticket.id)
  })

  // 記錄本次抽獎
  if (selectedWinners.length > 0) {
    const entry: WinningHistoryEntry = {
      timestamp: Date.now(),
      numbers: selectedWinners.map(t => t.number).join(', ')
    }
    store.addWinningHistory(entry)
  }
  
  showDrawDialog.value = false
  numberOfWinners.value = 1
  showNotification(`已選出 ${count} 個中獎號碼`, 'success')
}

function checkWinningNumbers() {
  if (!winningNumbers.value.trim()) return

  const numbers = winningNumbers.value
    .split(/[,\n]/)
    .map(n => n.trim())
    .filter(n => n)

  lotteryResults.value = {
    matched: [],
    notFound: []
  }

  numbers.forEach(number => {
    const ticket = store.tickets.find(t => t.number === number)
    if (ticket) {
      const isNew = !ticket.isWinner
      if (isNew) {
        store.markAsWinner(ticket.id)
      }
      lotteryResults.value.matched.push({ number, isNew })
    } else {
      lotteryResults.value.notFound.push(number)
    }
  })

  // 記錄本次開獎
  if (lotteryResults.value.matched.length > 0) {
    const entry: WinningHistoryEntry = {
      timestamp: Date.now(),
      numbers: numbers.join(', ')
    }
    store.addWinningHistory(entry)
  }

  showWinningNumberDialog.value = false
  winningNumbers.value = ''
  showResultsDialog.value = true

  // 更新通知消息
  const newWinners = lotteryResults.value.matched.filter(t => t.isNew)
  if (newWinners.length > 0) {
    showNotification(
      `找到 ${newWinners.length} 個新中獎號碼`,
      'success'
    )
  } else {
    showNotification('沒有新的中獎號碼', 'info')
  }
}

function showNotification(text: string, color: 'success' | 'error' | 'info' | 'warning') {
  snackbarText.value = text
  snackbarColor.value = color
  showSnackbar.value = true
}

// Add new function for delete confirmation
function confirmDelete(ticket: { id: string; number: string }) {
  ticketToDelete.value = ticket
  showDeleteDialog.value = true
}

function deleteTicket() {
  if (ticketToDelete.value) {
    store.removeTicket(ticketToDelete.value.id)
    showNotification(`已刪除號碼：${ticketToDelete.value.number}`, 'info')
    showDeleteDialog.value = false
    ticketToDelete.value = null
  }
}
</script>

<style scoped>
.draw-results-view {
  padding: 16px 0;
}
</style> 