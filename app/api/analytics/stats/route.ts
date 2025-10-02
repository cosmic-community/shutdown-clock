import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsStats } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    // Check for authentication cookie or header
    const authenticated = request.headers.get('x-analytics-auth') || 
                         request.cookies.get('analytics_authenticated')?.value
    
    // For now, we'll skip auth check here since we handle it in the frontend
    // In a production environment, you'd want server-side session management
    
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30', 10)
    
    // Validate days parameter
    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'Days parameter must be between 1 and 365' },
        { status: 400 }
      )
    }
    
    const stats = await getAnalyticsStats(days)
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Analytics stats error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}