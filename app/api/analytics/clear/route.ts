import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    // Check for authentication - same as verify-access
    const { accessCode } = await request.json()
    
    const validAccessCode = process.env.ANALYTICS_ACCESS_CODE || 'admin123'
    
    if (accessCode !== validAccessCode) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 401 }
      )
    }
    
    // Fetch all analytics events
    console.log('Fetching all analytics events to delete...')
    const response = await cosmic.objects
      .find({ type: 'analytics-events' })
      .props(['id'])
      .limit(10000) // Get up to 10,000 events
    
    const events = response.objects
    
    if (!events || events.length === 0) {
      return NextResponse.json({ 
        message: 'No analytics events found to delete',
        deletedCount: 0 
      })
    }
    
    console.log(`Found ${events.length} analytics events to delete`)
    
    // Delete all events in batches
    let deletedCount = 0
    const batchSize = 50 // Delete 50 at a time to avoid overwhelming the API
    
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize)
      
      // Delete each event in the batch - properly type the event parameter
      const deletePromises = batch.map((event: { id: string }) => 
        cosmic.objects.deleteOne(event.id).catch((error: unknown) => {
          console.error(`Failed to delete event ${event.id}:`, error)
          return null
        })
      )
      
      const results = await Promise.all(deletePromises)
      const successfulDeletes = results.filter(result => result !== null).length
      deletedCount += successfulDeletes
      
      console.log(`Deleted batch ${Math.floor(i/batchSize) + 1}: ${successfulDeletes}/${batch.length} events`)
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < events.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    console.log(`Successfully deleted ${deletedCount} analytics events`)
    
    return NextResponse.json({ 
      message: `Successfully cleared ${deletedCount} analytics events`,
      deletedCount 
    })
    
  } catch (error) {
    console.error('Failed to clear analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to clear analytics data' },
      { status: 500 }
    )
  }
}