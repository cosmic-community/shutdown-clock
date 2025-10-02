import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, detectDeviceType, detectBrowser, detectOS } from '@/lib/analytics'
import type { AnalyticsEvent } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract client information
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIP || request.ip || ''
    
    // Build analytics event data
    const eventData: AnalyticsEvent = {
      event_type: body.event_type,
      session_id: body.session_id,
      user_agent: userAgent,
      ip_address: ipAddress,
      referrer: referrer,
      page_url: body.page_url,
      screen_resolution: body.screen_resolution,
      country: body.country || '',
      city: body.city || '',
      device_type: detectDeviceType(userAgent) as any,
      browser: detectBrowser(userAgent),
      operating_system: detectOS(userAgent),
      session_duration: body.session_duration || 0,
      additional_data: body.additional_data || {}
    }
    
    // Track the event
    await trackEvent(eventData)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Analytics tracking error:', error)
    
    // Return success even if tracking fails to avoid impacting user experience
    return NextResponse.json({ success: true })
  }
}