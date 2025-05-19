// Declare gtag for TypeScript
declare const gtag: (...args: any[]) => void

interface AnalyticsEvent {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: any
}

/**
 * Safely track an analytics event
 * @param eventName The name of the event to track
 * @param params Additional parameters for the event
 */
export function trackEvent(eventName: string, params: AnalyticsEvent = {}) {
  try {
    if (typeof gtag !== 'function') {
      console.warn('Google Analytics not loaded')
      return
    }

    gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
  }
}

/**
 * Track page views
 * @param path The path of the page
 * @param title The title of the page
 */
export function trackPageView(path: string, title: string) {
  try {
    if (typeof gtag !== 'function') {
      console.warn('Google Analytics not loaded')
      return
    }

    gtag('config', 'G-5CCCNZXFE4', {
      page_path: path,
      page_title: title
    })
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

/**
 * Track user interactions
 * @param action The action performed
 * @param category The category of the action
 * @param label Optional label for the action
 */
export function trackInteraction(action: string, category: string, label?: string) {
  trackEvent(action, {
    event_category: category,
    event_label: label
  })
}

/**
 * Track errors
 * @param error The error object or message
 * @param context Additional context about where the error occurred
 */
export function trackError(error: Error | string, context: string) {
  const errorMessage = error instanceof Error ? error.message : error
  trackEvent('error', {
    event_category: 'Error',
    event_label: context,
    error_message: errorMessage
  })
} 