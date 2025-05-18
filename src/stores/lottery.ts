import { defineStore } from 'pinia'

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

export const useLotteryStore = defineStore('lottery', {
  state: () => ({
    tickets: [] as Ticket[],
    winners: [] as Ticket[],
    winningHistory: [] as WinningHistoryEntry[]
  }),

  actions: {
    loadFromStorage() {
      const savedTickets = localStorage.getItem('lottery-tickets')
      const savedHistory = localStorage.getItem('lottery-winning-history')
      
      if (savedTickets) {
        try {
          this.tickets = JSON.parse(savedTickets)
          this.winners = this.tickets.filter(t => t.isWinner)
        } catch (error) {
          console.error('加載本地數據失敗:', error)
        }
      }

      if (savedHistory) {
        try {
          this.winningHistory = JSON.parse(savedHistory)
        } catch (error) {
          console.error('加載開獎歷史失敗:', error)
        }
      }
    },

    saveToStorage() {
      try {
        localStorage.setItem('lottery-tickets', JSON.stringify(this.tickets))
        localStorage.setItem('lottery-winning-history', JSON.stringify(this.winningHistory))
      } catch (error) {
        console.error('保存數據失敗:', error)
      }
    },

    addTicket(number: string) {
      const ticket: Ticket = {
        id: Date.now().toString(),
        number: number,
        timestamp: Date.now(),
        isWinner: false
      }
      this.tickets.push(ticket)
      this.saveToStorage()
    },

    addBatchTickets(numbers: string[]) {
      numbers.forEach(number => this.addTicket(number))
    },

    addRangeTickets(start: string, end: string) {
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
        this.tickets.push(ticket)
      })
      
      this.saveToStorage()
    },

    markAsWinner(id: string) {
      const ticket = this.tickets.find(t => t.id === id)
      if (ticket) {
        ticket.isWinner = true
        this.winners = this.tickets.filter(t => t.isWinner)
        this.saveToStorage()
      }
    },

    removeWinner(id: string) {
      const ticket = this.tickets.find(t => t.id === id)
      if (ticket) {
        ticket.isWinner = false
        this.winners = this.tickets.filter(t => t.isWinner)
        this.saveToStorage()
      }
    },

    removeTicket(id: string) {
      const index = this.tickets.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tickets.splice(index, 1)
        this.winners = this.tickets.filter(t => t.isWinner)
        this.saveToStorage()
      }
    },

    addWinningHistory(entry: WinningHistoryEntry) {
      this.winningHistory.push(entry)
      this.saveToStorage()
    },

    exportTickets() {
      return JSON.stringify({
        tickets: this.tickets,
        winningHistory: this.winningHistory,
        exportDate: new Date().toISOString()
      }, null, 2)
    },

    importTickets(jsonString: string): ImportResult {
      try {
        const data = JSON.parse(jsonString)
        
        if (!data || typeof data !== 'object') {
          return { success: false, error: '無效的數據格式' }
        }

        if (Array.isArray(data.tickets)) {
          this.tickets = data.tickets
          this.winners = this.tickets.filter(t => t.isWinner)
        } else if (Array.isArray(data)) {
          this.tickets = data
          this.winners = this.tickets.filter(t => t.isWinner)
        } else {
          return { success: false, error: '找不到有效的票據數據' }
        }

        if (Array.isArray(data.winningHistory)) {
          this.winningHistory = data.winningHistory
        }

        this.saveToStorage()
        return { success: true }
      } catch (error) {
        console.error('導入數據時出錯:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : '導入數據時出錯'
        }
      }
    }
  }
}) 