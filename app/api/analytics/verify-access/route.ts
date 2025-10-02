import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessCode } = await request.json()
    
    // Get the access code from environment variables
    const validAccessCode = process.env.ANALYTICS_ACCESS_CODE
    
    // If no access code is set in environment, use a default
    const requiredCode = validAccessCode || 'admin123'
    
    if (accessCode === requiredCode) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 401 }
      )
    }
    
  } catch (error) {
    console.error('Access verification error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}