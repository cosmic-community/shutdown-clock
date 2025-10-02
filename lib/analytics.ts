import { cosmic } from '@/lib/cosmic'

export interface AnalyticsEvent {
  event_type: 'page_view' | 'session_start' | 'form_submission' | 'social_share' | 'external_link_click'
  session_id: string
  user_agent?: string
  ip_address?: string
  referrer?: string
  page_url: string
  screen_resolution?: string
  country?: string
  city?: string
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  browser?: string
  operating_system?: string
  session_duration?: number
  additional_data?: Record<string, any>
}

export interface AnalyticsStats {
  totalPageViews: number
  uniqueVisitors: number
  totalSessions: number
  averageSessionDuration: number
  topCountries: Array<{ country: string; count: number }>
  topPages: Array<{ page: string; count: number }>
  deviceBreakdown: Array<{ device: string; count: number }>
  browserBreakdown: Array<{ browser: string; count: number }>
  dailyStats: Array<{ date: string; views: number; visitors: number }>
}

// Generate a session ID for tracking
export function generateSessionId(): string {
  return 'ses_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Detect device type from user agent
export function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet'
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    return 'mobile'
  }
  
  if (/desktop|windows|macintosh|linux/i.test(ua)) {
    return 'desktop'
  }
  
  return 'unknown'
}

// Extract browser name from user agent
export function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari'
  if (ua.includes('edge')) return 'Edge'
  if (ua.includes('opera')) return 'Opera'
  if (ua.includes('msie') || ua.includes('trident')) return 'Internet Explorer'
  
  return 'Other'
}

// Extract OS from user agent
export function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('macintosh') || ua.includes('mac os x')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS'
  
  return 'Other'
}

// Server-side function to track analytics events
export async function trackEvent(eventData: AnalyticsEvent): Promise<void> {
  try {
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    await cosmic.objects.insertOne({
      type: 'analytics-events',
      title: `${eventData.event_type} - ${timestamp}`,
      status: 'published',
      metadata: {
        event_type: eventData.event_type,
        session_id: eventData.session_id,
        user_agent: eventData.user_agent || '',
        ip_address: eventData.ip_address || '',
        referrer: eventData.referrer || '',
        page_url: eventData.page_url,
        screen_resolution: eventData.screen_resolution || '',
        country: eventData.country || '',
        city: eventData.city || '',
        device_type: eventData.device_type || 'unknown',
        browser: eventData.browser || '',
        operating_system: eventData.operating_system || '',
        session_duration: eventData.session_duration || 0,
        additional_data: JSON.stringify(eventData.additional_data || {})
      }
    })
  } catch (error) {
    console.error('Failed to track analytics event:', error)
    // Don't throw error to avoid breaking user experience
  }
}

// Get analytics data for dashboard (server-side)
export async function getAnalyticsStats(days: number = 30): Promise<AnalyticsStats | null> {
  try {
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Fetch analytics events from the specified time period
    const response = await cosmic.objects
      .find({ 
        type: 'analytics-events',
        created_at: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        }
      })
      .props(['id', 'metadata', 'created_at'])
      .limit(10000)
    
    const events = response.objects
    
    if (!events || events.length === 0) {
      return {
        totalPageViews: 0,
        uniqueVisitors: 0,
        totalSessions: 0,
        averageSessionDuration: 0,
        topCountries: [],
        topPages: [],
        deviceBreakdown: [],
        browserBreakdown: [],
        dailyStats: []
      }
    }
    
    // Calculate statistics
    const pageViews = events.filter((e: any) => e.metadata?.event_type === 'page_view')
    const sessions = new Set(events.map((e: any) => e.metadata?.session_id).filter(Boolean))
    const uniqueVisitors = sessions.size
    
    // Session durations
    const sessionDurations = events
      .filter((e: any) => e.metadata?.session_duration && e.metadata.session_duration > 0)
      .map((e: any) => Number(e.metadata.session_duration))
    
    const averageSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a: number, b: number) => a + b, 0) / sessionDurations.length 
      : 0
    
    // Top countries
    const countryCount = new Map<string, number>()
    events.forEach((e: any) => {
      const country = e.metadata?.country
      if (country) {
        countryCount.set(country, (countryCount.get(country) || 0) + 1)
      }
    })
    const topCountries = Array.from(countryCount.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    // Top pages
    const pageCount = new Map<string, number>()
    pageViews.forEach((e: any) => {
      const page = e.metadata?.page_url
      if (page) {
        pageCount.set(page, (pageCount.get(page) || 0) + 1)
      }
    })
    const topPages = Array.from(pageCount.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    // Device breakdown
    const deviceCount = new Map<string, number>()
    events.forEach((e: any) => {
      const device = e.metadata?.device_type || 'unknown'
      deviceCount.set(device, (deviceCount.get(device) || 0) + 1)
    })
    const deviceBreakdown = Array.from(deviceCount.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)
    
    // Browser breakdown
    const browserCount = new Map<string, number>()
    events.forEach((e: any) => {
      const browser = e.metadata?.browser
      if (browser) {
        browserCount.set(browser, (browserCount.get(browser) || 0) + 1)
      }
    })
    const browserBreakdown = Array.from(browserCount.entries())
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    // Daily stats
    const dailyCount = new Map<string, { views: number; visitors: Set<string> }>()
    events.forEach((e: any) => {
      const date = e.created_at?.split('T')[0] // Extract YYYY-MM-DD
      if (date) {
        if (!dailyCount.has(date)) {
          dailyCount.set(date, { views: 0, visitors: new Set() })
        }
        const dayData = dailyCount.get(date)!
        
        if (e.metadata?.event_type === 'page_view') {
          dayData.views++
        }
        if (e.metadata?.session_id) {
          dayData.visitors.add(e.metadata.session_id)
        }
      }
    })
    
    const dailyStats = Array.from(dailyCount.entries())
      .map(([date, data]) => ({ 
        date, 
        views: data.views, 
        visitors: data.visitors.size 
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return {
      totalPageViews: pageViews.length,
      uniqueVisitors,
      totalSessions: sessions.size,
      averageSessionDuration,
      topCountries,
      topPages,
      deviceBreakdown,
      browserBreakdown,
      dailyStats
    }
    
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error)
    return null
  }
}