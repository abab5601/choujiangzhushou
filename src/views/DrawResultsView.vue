<!-- src/views/DrawResultsView.vue -->
<template>
  <div class="draw-results-view">
    <v-card>
      <v-card-title class="d-flex align-center">
        開獎結果
        <v-spacer />
        <v-tooltip text="查看所有歷史開獎記錄">
          <template v-slot:activator="{ props }">
            <v-btn
              color="info"
              prepend-icon="mdi-history"
              @click="showWinningHistoryDialog = true"
              class="me-2"
              v-bind="props"
            >
              歷史開獎
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="從未中獎的號碼中隨機抽取指定數量">
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              prepend-icon="mdi-dice-multiple"
              @click="showDrawDialog = true"
              class="me-2"
              v-bind="props"
            >
              隨機抽獎
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="手動輸入中獎號碼進行兌獎">
          <template v-slot:activator="{ props }">
            <v-btn
              color="success"
              prepend-icon="mdi-ticket-confirmation"
              @click="showWinningNumberDialog = true"
              v-bind="props"
            >
              輸入中獎號碼
            </v-btn>
          </template>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="searchQuery"
              label="搜索彩票"
              prepend-inner-icon="mdi-magnify"
              clearable
              hint="輸入號碼進行搜索"
              persistent-hint
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
              hint="選擇要顯示的彩票狀態"
              persistent-hint
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
            <v-tooltip :text="item.isWinner ? '取消中獎' : '標記中獎'">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  :color="item.isWinner ? 'error' : 'success'"
                  @click="toggleWinnerStatus(item.id)"
                  class="me-2"
                  v-bind="props"
                >
                  <v-icon>
                    {{ item.isWinner ? 'mdi-close' : 'mdi-check' }}
                  </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="刪除此號碼">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  color="error"
                  @click="confirmDelete(item)"
                  v-bind="props"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Random Draw Dialog -->
    <v-dialog v-model="showDrawDialog" max-width="500px">
      <v-card>
        <v-card-title>隨機抽獎</v-card-title>
        <v-card-text>
          <p class="text-subtitle-2 mb-4">從未中獎的號碼中隨機抽取指定數量的中獎號碼</p>
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
              hint="請輸入要抽取的中獎數量"
              persistent-hint
              class="mb-4"
            />
            <div class="d-flex align-center">
              <v-select
                v-model="selectedAnimation"
                :items="animationOptions"
                label="抽獎動畫"
                hint="選擇抽獎過程的動畫效果"
                persistent-hint
                class="flex-grow-1 me-2"
              />
              <v-btn
                v-if="showRememberButton"
                color="primary"
                variant="outlined"
                size="small"
                class="mt-3"
                @click="saveAnimationPreference"
              >
                <v-icon start>mdi-content-save</v-icon>
                記住選擇
              </v-btn>
            </div>
            <v-btn
              type="submit"
              color="primary"
              block
              :disabled="!numberOfWinners || numberOfWinners <= 0"
              class="mt-4"
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
          <p class="text-subtitle-2 mb-4">輸入官方公布的中獎號碼，系統將自動比對並標記中獎彩票</p>
          <v-form @submit.prevent="checkWinningNumbers">
            <v-textarea
              v-model="winningNumbers"
              label="中獎號碼"
              placeholder="請輸入中獎號碼，每行一個號碼或用逗號分隔"
              :rules="[v => !!v || '請輸入中獎號碼']"
              rows="5"
              auto-grow
              hint="可以用逗號或換行來分隔多個號碼"
              persistent-hint
            />
            <v-btn
              type="submit"
              color="success"
              block
              :disabled="!winningNumbers"
              class="mt-4"
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
      location="bottom"
      class="custom-snackbar"
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

    <!-- 動畫對話框 -->
    <v-dialog v-model="showAnimationDialog" persistent max-width="600">
      <v-card>
        <v-card-text class="text-center pa-6">
          <div class="animation-container">
            <component
              :is="currentAnimationComponent"
              v-if="currentAnimationComponent"
              ref="animationRef"
              :winning-numbers="selectedNumbers"
              :available-numbers="availableNumbers"
              :is-animating="isAnimating"
            />
            <div v-if="!isAnimating" class="text-h5 mb-4">
              抽獎完成！
            </div>
          </div>
        </v-card-text>
        <v-card-actions v-if="isAnimating">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="cancelAnimation"
          >
            取消抽獎
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef, watch } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import confetti from 'canvas-confetti'
import { updateMetaInfo } from '@/utils/seo'
import SlotMachineAnimation from '@/components/animations/SlotMachineAnimation.vue'
import CardAnimation from '@/components/animations/CardAnimation.vue'
import BoxAnimation from '@/components/animations/BoxAnimation.vue'
import { trackInteraction, trackError } from '../utils/analytics'

const store = useLotteryStore()

// 添加調試日誌
console.log('Store instance:', store)
console.log('Store methods:', Object.keys(store))
console.log('Store actions:', Object.keys(store.$state))

// Load data when component is mounted
onMounted(() => {
  store.loadFromStorage()
  
  // SEO 優化
  updateMetaInfo({
    title: '開獎結果',
    description: '查看彩票中獎情況，支持手動輸入中獎號碼和隨機抽獎功能',
    keywords: '彩票開獎,中獎查詢,隨機抽獎,開獎歷史,彩票管理',
    ogTitle: '開獎結果 - 中獎查詢',
    ogDescription: '快速查看彩票中獎情況，支持多種開獎方式',
    twitterTitle: '開獎結果 - 中獎查詢',
    twitterDescription: '快速查看彩票中獎情況，支持多種開獎方式'
  })
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
const showAnimationDialog = ref(false)
const isAnimating = ref(false)
const lotteryResults = ref({
  matched: [] as { number: string; isNew: boolean }[],
  notFound: [] as string[]
})

// Add new refs for delete confirmation
const showDeleteDialog = ref(false)
const ticketToDelete = ref<{ id: string; number: string } | null>(null)

// 動畫選項
const selectedAnimation = ref(localStorage.getItem('preferredAnimation') || 'box')  // 從 localStorage 讀取保存的選擇

// 添加記住選擇的狀態
const showRememberButton = ref(false)
const lastSavedAnimation = ref(localStorage.getItem('preferredAnimation') || 'box')

// 監聽動畫選擇的變化
watch(() => selectedAnimation.value, (newValue) => {
  if (newValue !== lastSavedAnimation.value) {
    showRememberButton.value = true
  } else {
    showRememberButton.value = false
  }
})

// 保存動畫選擇
function saveAnimationPreference() {
  localStorage.setItem('preferredAnimation', selectedAnimation.value)
  lastSavedAnimation.value = selectedAnimation.value
  showRememberButton.value = false
  showNotification('已記住您的動畫選擇', 'success')
}

const animationOptions = [
  { title: '抽獎箱效果', value: 'box' },
  { title: '老虎機效果', value: 'slot' },
  { title: '翻牌效果', value: 'card' },
  { title: '無動畫', value: 'none' }
]

// 動畫相關
const animationRef = ref()
const selectedNumbers = ref<string[]>([])
const availableNumbers = computed(() => store.tickets.filter(t => !t.isWinner).map(t => t.number))
const currentAnimationComponent = shallowRef<any>(null)

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

// 彩帶效果函數
function showWinningAnimation() {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    zIndex: 10000  // 設置非常高的 z-index
  }

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      zIndex: 10000  // 確保每次調用都設置 z-index
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })

  fire(0.2, {
    spread: 60,
  })

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

async function toggleWinnerStatus(id: string) {
  try {
    const ticket = store.tickets.find(t => t.id === id)
    if (ticket) {
      const newStatus = !ticket.isWinner
      if (newStatus) {
        store.markAsWinner(id)
      } else {
        store.removeWinner(id)
      }
      if (newStatus) {
        showWinningAnimation()
      }
    }
  } catch (error) {
    console.error('更新中獎狀態時出錯:', error)
    snackbarText.value = '更新中獎狀態時出錯'
    snackbarColor.value = 'error'
    showSnackbar.value = true
  }
}

// 修改動畫函數
async function playDrawAnimation(numbers: string[]): Promise<boolean> {
  selectedNumbers.value = numbers
  
  // 如果選擇無動畫，直接顯示結果
  if (selectedAnimation.value === 'none') {
    lotteryResults.value = {
      matched: numbers.map(number => ({ number, isNew: true })),
      notFound: []
    }
    showResultsDialog.value = true
    return true
  }

  showAnimationDialog.value = true
  isAnimating.value = true

  // 設置當前動畫組件
  switch (selectedAnimation.value) {
    case 'slot':
      currentAnimationComponent.value = SlotMachineAnimation
      break
    case 'card':
      currentAnimationComponent.value = CardAnimation
      break
    case 'box':
      currentAnimationComponent.value = BoxAnimation
      break
  }

  try {
    // 等待組件掛載
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 執行動畫
    if (isAnimating.value) { // 檢查是否已被取消
      await animationRef.value?.animate(3000, 50)
    }
    
    if (isAnimating.value) { // 如果動畫沒有被取消
      isAnimating.value = false
      showWinningAnimation() // 顯示中獎彩帶效果
      
      // 更新抽獎結果
      lotteryResults.value = {
        matched: numbers.map(number => ({ number, isNew: true })),
        notFound: []
      }

      // 等待一小段時間後自動關閉動畫對話框並顯示結果
      await new Promise(resolve => setTimeout(resolve, 1000))
      showAnimationDialog.value = false
      showResultsDialog.value = true
      return true
    }

    return false

  } catch (error) {
    console.error('動畫播放出錯:', error)
    showNotification('動畫播放出錯', 'error')
    isAnimating.value = false
    showAnimationDialog.value = false
    return false
  }
}

// 修改原有的抽獎函數
async function executeRandomDraw(e: Event) {
  e.preventDefault()
  if (!numberOfWinners.value || numberOfWinners.value <= 0) return

  const nonWinningTickets = store.tickets.filter(t => !t.isWinner)
  if (nonWinningTickets.length === 0) {
    showNotification('沒有可抽取的號碼', 'warning')
    trackInteraction('draw_failed', 'Lottery', 'No available tickets')
    return
  }

  if (numberOfWinners.value > nonWinningTickets.length) {
    showNotification(`只剩下 ${nonWinningTickets.length} 個可抽取的號碼`, 'warning')
    trackInteraction('draw_failed', 'Lottery', 'Not enough tickets')
    return
  }

  // Track draw start
  trackInteraction('draw_start', 'Lottery', `Drawing ${numberOfWinners.value} tickets`)

  // 隨機選擇中獎號碼
  const selectedTickets = []
  const tempTickets = [...nonWinningTickets]
  for (let i = 0; i < numberOfWinners.value; i++) {
    const index = Math.floor(Math.random() * tempTickets.length)
    selectedTickets.push(tempTickets[index])
    tempTickets.splice(index, 1)
  }

  // 執行動畫
  const animationCompleted = await playDrawAnimation(selectedTickets.map(t => t.number))

  // 只有在動畫完成時才標記中獎
  if (animationCompleted) {
    trackInteraction('draw_complete', 'Lottery', `Drew ${selectedTickets.length} tickets`)
    // 標記中獎
    for (const ticket of selectedTickets) {
      store.markAsWinner(ticket.id)
    }

    // 添加到開獎歷史
    store.addWinningHistory({
      timestamp: Date.now(),
      numbers: selectedTickets.map(t => t.number).join(', ')
    })

    showDrawDialog.value = false
    showNotification(`已抽出 ${selectedTickets.length} 個中獎號碼`, 'success')
  }
}

async function checkWinningNumbers(e: Event) {
  e.preventDefault()
  if (!winningNumbers.value) return

  try {
    const numbers = winningNumbers.value
      .split(/[,\n]/)
      .map(n => n.trim())
      .filter(n => n)

    trackInteraction('check_numbers_start', 'Lottery', `Checking ${numbers.length} numbers`)

    console.log('Processing numbers:', numbers)
    console.log('Current tickets:', store.tickets)

    let winCount = 0
    lotteryResults.value = {
      matched: [],
      notFound: []
    }

    // 檢查每個號碼
    for (const number of numbers) {
      const ticket = store.tickets.find(t => t.number === number)
      if (ticket) {
        const isNew = !ticket.isWinner
        if (isNew) {
          store.markAsWinner(ticket.id)
          winCount++
        }
        lotteryResults.value.matched.push({ number, isNew })
      } else {
        lotteryResults.value.notFound.push(number)
      }
    }

    showWinningNumberDialog.value = false
    winningNumbers.value = ''  // 清空輸入
    
    if (winCount > 0) {
      trackInteraction('check_numbers_complete', 'Lottery', `Found ${winCount} winning tickets`)
      console.log(`Found ${winCount} winning tickets`)
      snackbarText.value = `找到 ${winCount} 個中獎號碼`
      snackbarColor.value = 'success'
      showSnackbar.value = true
      showResultsDialog.value = true  // 顯示結果對話框
      // 觸發彩帶效果
      showWinningAnimation()
    } else {
      trackInteraction('check_numbers_complete', 'Lottery', 'No winning tickets found')
      console.log('No winning tickets found')
      snackbarText.value = '沒有找到中獎號碼'
      snackbarColor.value = 'info'
      showSnackbar.value = true
      showResultsDialog.value = true  // 仍然顯示結果對話框
    }
  } catch (error) {
    trackError(error as Error, 'check_winning_numbers')
    console.error('處理中獎號碼時出錯:', error)
    console.error('Error details:', {
      error,
      store: store,
      storeActions: Object.keys(store),
      tickets: store.tickets
    })
    snackbarText.value = '處理中獎號碼時出錯'
    snackbarColor.value = 'error'
    showSnackbar.value = true
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

// 添加對篩選和搜索的追蹤
watch(() => filterStatus.value, () => {
  // 追蹤篩選狀態
})

watch(() => searchQuery.value, (newQuery) => {
  if (newQuery.trim()) {
    // 追蹤搜索
  }
})

// 添加對查看歷史記錄的追蹤
watch(() => showWinningHistoryDialog.value, (isShown) => {
  if (isShown) {
    // 追蹤查看歷史記錄
  }
})

const cancelAnimation = () => {
  isAnimating.value = false
  showAnimationDialog.value = false
  showNotification('已取消抽獎', 'info')
}
</script>

<style scoped>
.draw-results-view {
  padding: 16px 0;
}

/* 確保通知顯示在最上層 */
:deep(.v-snackbar) {
  z-index: 24999 !important;
}

/* 確保彩帶效果容器在最上層 */
:deep(.confetti-container) {
  z-index: 10000 !important;
  position: fixed !important;
  pointer-events: none !important;
}

.animation-container {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.v-btn.mt-3 {
  margin-bottom: 16px; /* 調整按鈕垂直對齊 */
}
</style> 