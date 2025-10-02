import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessCode } = await request.json()
    
    // Simple access code verification
    // In production, you might want to use a more secure method
    const validAccessCode = process.env.ANALYTICS_ACCESS_CODE || 'admin123'
    
    if (accessCode !== validAccessCode) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 401 }
      )
    }
    
    // Return success
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Analytics access verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}