import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/cosmic'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Site settings not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(settings)
    
  } catch (error) {
    console.error('Site settings error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}