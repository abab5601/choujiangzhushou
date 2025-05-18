<!-- src/views/HistoryView.vue -->
<template>
  <div class="history-view">
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>導出數據</v-card-title>
          <v-card-text>
            <p class="mb-4">將彩票數據導出為JSON格式以備份或分享</p>
            <v-btn
              color="primary"
              block
              prepend-icon="mdi-download"
              @click="exportData"
            >
              導出彩票
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>導入數據</v-card-title>
          <v-card-text>
            <p class="mb-4">從JSON文件導入彩票數據</p>
            <v-file-input
              v-model="importFile"
              accept=".json"
              label="選擇JSON文件"
              @update:model-value="handleFileChange"
              hide-details
              :error="!!fileError"
              :error-messages="fileError"
              :multiple="false"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title>彩票歷史記錄</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="sortedTickets"
          :search="searchQuery"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="搜索"
                single-line
                hide-details
                clearable
                class="mx-4"
              />
            </v-toolbar>
          </template>

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
              color="error"
              @click="removeTicket(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="5000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLotteryStore } from '@/stores/lottery'

const store = useLotteryStore()
const searchQuery = ref('')
const importFile = ref<File | null>(null)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const fileError = ref('')

const headers = [
  { title: '彩票號碼', key: 'number', sortable: true },
  { title: '添加日期', key: 'timestamp', sortable: true },
  { title: '狀態', key: 'isWinner', sortable: true },
  { title: '操作', key: 'actions', sortable: false },
]

const sortedTickets = computed(() => 
  [...store.tickets].sort((a, b) => b.timestamp - a.timestamp)
)

function exportData() {
  const data = store.exportTickets()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `彩票數據_${new Date().toLocaleDateString('zh-TW').replace(/\//g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showNotification('數據導出成功', 'success')
}

async function handleFileChange(file: File | File[] | null) {
  fileError.value = ''
  if (!file || Array.isArray(file)) return

  try {
    console.log('開始讀取文件:', file.name)
    const reader = new FileReader()
    
    const text = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('無法讀取文件內容'))
        }
      }
      reader.onerror = () => reject(reader.error || new Error('文件讀取失敗'))
      reader.readAsText(file)
    })

    console.log('文件內容:', text.substring(0, 100) + '...')
    
    const result = store.importTickets(text)
    console.log('導入結果:', result)
    
    if (result.success) {
      showNotification('數據導入成功', 'success')
    } else {
      fileError.value = result.error || '數據格式無效'
      showNotification(fileError.value, 'error')
    }
  } catch (error) {
    console.error('文件讀取錯誤:', error)
    const errorMessage = error instanceof Error ? error.message : '讀取文件時出錯'
    fileError.value = errorMessage
    showNotification(errorMessage, 'error')
  } finally {
    importFile.value = null
  }
}

function removeTicket(id: string) {
  store.removeTicket(id)
  showNotification('彩票已刪除', 'info')
}

function showNotification(text: string, color: 'success' | 'error' | 'info') {
  snackbarText.value = text
  snackbarColor.value = color
  showSnackbar.value = true
}
</script>

<style scoped>
.history-view {
  padding: 16px 0;
}
</style> 