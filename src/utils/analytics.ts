// src/utils/analytics.ts

// 定義事件類型
export enum AnalyticsEvent {
  // 抽獎相關
  DRAW_START = 'draw_start',
  DRAW_COMPLETE = 'draw_complete',
  ANIMATION_SELECTED = 'animation_selected',
  ANIMATION_PREFERENCE_SAVED = 'animation_preference_saved',
  
  // 中獎相關
  WINNER_MARKED = 'winner_marked',
  WINNER_UNMARKED = 'winner_unmarked',
  WINNING_NUMBERS_CHECKED = 'winning_numbers_checked',
  
  // 票務相關
  TICKET_DELETED = 'ticket_deleted',
  TICKET_FILTERED = 'ticket_filtered',
  TICKET_SEARCHED = 'ticket_searched',
  
  // 歷史記錄
  HISTORY_VIEWED = 'history_viewed'
}

// 定義事件屬性類型
interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

// 定義 window 的擴展類型
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

class Analytics {
  private static instance: Analytics
  private isInitialized = false

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  // 初始化 Google Analytics
  init(analyticsId: string): void {
    if (this.isInitialized) {
      console.warn('Analytics already initialized')
      return
    }

    this.isInitialized = true

    // 添加 Google Analytics 腳本
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`
    document.head.appendChild(script)

    // 初始化 gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', analyticsId)
  }

  // 追蹤事件
  trackEvent(event: AnalyticsEvent, properties?: EventProperties): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized')
      return
    }

    // 使用 Google Analytics 追蹤事件
    window.gtag('event', event, properties)
  }

  // 追蹤頁面訪問
  trackPageView(pageName: string): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized')
      return
    }

    // 使用 Google Analytics 追蹤頁面訪問
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    })
  }
}

// 導出單例實例
export const analytics = Analytics.getInstance() 