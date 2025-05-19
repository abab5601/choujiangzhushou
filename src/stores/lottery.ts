import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Ticket {
  id: string
  number: string
  timestamp: number
  isWinner: boolean
}

export interface WinningHistoryEntry {
  timestamp: number
  numbers: string
}

export interface ImportResult {
  success: boolean
  error?: string
}

export const useLotteryStore = defineStore('lottery', () => {
  const tickets = ref<Ticket[]>([])
  const winners = ref<Ticket[]>([])
  const winningHistory = ref<WinningHistoryEntry[]>([])

  // 在 store 創建時立即加載數據
  try {
    const savedTickets = localStorage.getItem('lottery-tickets')
    const savedHistory = localStorage.getItem('lottery-winning-history')
    
    if (savedTickets) {
      tickets.value = JSON.parse(savedTickets)
      winners.value = tickets.value.filter(t => t.isWinner)
    }

    if (savedHistory) {
      winningHistory.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('初始化加載數據失敗:', error)
  }

  // 監聽 tickets 變化，自動更新 winners
  watch(tickets, (newTickets) => {
    winners.value = newTickets.filter(t => t.isWinner)
    saveToStorage()  // 當數據變化時自動保存
  }, { deep: true })

  // 監聽 winningHistory 變化，自動保存
  watch(winningHistory, () => {
    saveToStorage()
  }, { deep: true })

  function loadFromStorage() {
    const savedTickets = localStorage.getItem('lottery-tickets')
    const savedHistory = localStorage.getItem('lottery-winning-history')
    
    if (savedTickets) {
      try {
        tickets.value = JSON.parse(savedTickets)
        winners.value = tickets.value.filter(t => t.isWinner)
      } catch (error) {
        console.error('加載本地數據失敗:', error)
      }
    }

    if (savedHistory) {
      try {
        winningHistory.value = JSON.parse(savedHistory)
      } catch (error) {
        console.error('加載開獎歷史失敗:', error)
      }
    }

    // 添加 storage 事件監聽器，用於多標籤頁同步
    window.addEventListener('storage', (e) => {
      if (e.key === 'lottery-tickets') {
        try {
          const newTickets = JSON.parse(e.newValue || '[]')
          tickets.value = newTickets
          winners.value = tickets.value.filter(t => t.isWinner)
        } catch (error) {
          console.error('同步數據失敗:', error)
        }
      } else if (e.key === 'lottery-winning-history') {
        try {
          winningHistory.value = JSON.parse(e.newValue || '[]')
        } catch (error) {
          console.error('同步開獎歷史失敗:', error)
        }
      }
    })
  }

  function saveToStorage() {
    try {
      localStorage.setItem('lottery-tickets', JSON.stringify(tickets.value))
      localStorage.setItem('lottery-winning-history', JSON.stringify(winningHistory.value))
    } catch (error) {
      console.error('保存數據失敗:', error)
    }
  }

  function addTicket(number: string) {
    const ticket: Ticket = {
      id: Date.now().toString(),
      number: number,
      timestamp: Date.now(),
      isWinner: false
    }
    tickets.value.push(ticket)
    saveToStorage()
  }

  function addBatchTickets(numbers: string[]) {
    numbers.forEach(number => addTicket(number))
  }

  function addRangeTickets(start: string, end: string) {
    const prefix = start.match(/^[A-Z]+/)?.[0] || ''
    const startNum = parseInt(start.replace(/^[A-Z]+/, ''))
    const endNum = parseInt(end.replace(/^[A-Z]+/, ''))

    if (isNaN(startNum) || isNaN(endNum)) return

    const numbers: string[] = []
    for (let i = startNum; i <= endNum; i++) {
      const number = `${prefix}${i.toString().padStart(3, '0')}`
      numbers.push(number)
    }

    // 按順序一次性添加所有號碼
    numbers.forEach(number => {
      const ticket: Ticket = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        number: number,
        timestamp: Date.now(),
        isWinner: false
      }
      tickets.value.push(ticket)
    })
    
    saveToStorage()
  }

  function markAsWinner(id: string) {
    const ticket = tickets.value.find(t => t.id === id)
    if (ticket) {
      ticket.isWinner = true
      winners.value = tickets.value.filter(t => t.isWinner)
      saveToStorage()
    }
  }

  function removeWinner(id: string) {
    const ticket = tickets.value.find(t => t.id === id)
    if (ticket) {
      ticket.isWinner = false
      winners.value = tickets.value.filter(t => t.isWinner)
      saveToStorage()
    }
  }

  function removeTicket(id: string) {
    const index = tickets.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tickets.value.splice(index, 1)
      winners.value = tickets.value.filter(t => t.isWinner)
      saveToStorage()
    }
  }

  function addWinningHistory(entry: WinningHistoryEntry) {
    winningHistory.value.push(entry)
    saveToStorage()
  }

  function exportTickets() {
    return JSON.stringify({
      tickets: tickets.value,
      winningHistory: winningHistory.value,
      exportDate: new Date().toISOString()
    }, null, 2)
  }

  function importTickets(jsonString: string): ImportResult {
    try {
      const data = JSON.parse(jsonString)
      
      if (!data || typeof data !== 'object') {
        return { success: false, error: '無效的數據格式' }
      }

      if (Array.isArray(data.tickets)) {
        tickets.value = data.tickets
        winners.value = tickets.value.filter(t => t.isWinner)
      } else if (Array.isArray(data)) {
        tickets.value = data
        winners.value = tickets.value.filter(t => t.isWinner)
      } else {
        return { success: false, error: '找不到有效的票據數據' }
      }

      if (Array.isArray(data.winningHistory)) {
        winningHistory.value = data.winningHistory
      }

      saveToStorage()
      return { success: true }
    } catch (error) {
      console.error('導入數據時出錯:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '導入數據時出錯'
      }
    }
  }

  function clearAllData() {
    tickets.value = []
    winners.value = []
    winningHistory.value = []
    saveToStorage()
  }

  function updateTicketStatus(id: string, isWinner: boolean) {
    console.log('updateTicketStatus called with:', { id, isWinner })
    console.log('Current tickets:', tickets.value)
    
    const ticket = tickets.value.find(t => t.id === id)
    console.log('Found ticket:', ticket)
    
    if (ticket) {
      ticket.isWinner = isWinner
      winners.value = tickets.value.filter(t => t.isWinner)
      saveToStorage()
      
      if (isWinner) {
        console.log('Adding to winning history:', ticket)
        addWinningHistory({
          timestamp: Date.now(),
          numbers: ticket.number
        })
      }
      
      console.log('Ticket status updated successfully')
    } else {
      console.warn('Ticket not found:', id)
    }
  }

  return {
    tickets,
    winners,
    winningHistory,
    loadFromStorage,
    saveToStorage,
    addTicket,
    addBatchTickets,
    addRangeTickets,
    markAsWinner,
    removeWinner,
    removeTicket,
    addWinningHistory,
    exportTickets,
    importTickets,
    clearAllData,
    updateTicketStatus
  }
}) 