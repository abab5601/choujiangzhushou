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
  HISTORY_VIEWED = 'history_viewed',

  // 隱私相關
  CONSENT_UPDATED = 'consent_updated'
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

// 定義同意設置類型
interface ConsentSettings {
  analytics_storage: 'granted' | 'denied'
  ad_storage: 'granted' | 'denied'
  ad_user_data: 'granted' | 'denied'
  ad_personalization: 'granted' | 'denied'
}

class Analytics {
  private static instance: Analytics
  private isInitialized = false
  private defaultConsentSettings: ConsentSettings = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  }

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

    // 設置默認同意模式
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }

    // 配置同意模式
    window.gtag('consent', 'default', this.defaultConsentSettings)

    // 添加 Google Analytics 腳本
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`
    document.head.appendChild(script)

    // 初始化 gtag
    window.gtag('js', new Date())
    window.gtag('config', analyticsId, {
      'cookie_flags': 'max-age=7200;secure;samesite=none'
    })
  }

  // 更新用戶同意設置
  updateConsent(settings: Partial<ConsentSettings>): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized')
      return
    }

    window.gtag('consent', 'update', settings)
    
    // 追蹤同意更新事件
    this.trackEvent(AnalyticsEvent.CONSENT_UPDATED, settings)
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