import { NextRequest, NextResponse } from 'next/server'
import { submitCitizenReport } from '@/lib/cosmic'
import { CitizenReportFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const formData: CitizenReportFormData = {
      name: body.name,
      location: body.location,
      survivalTactics: body.survivalTactics,
    }

    // Validate required fields
    if (!formData.name?.trim() || !formData.location?.trim() || !formData.survivalTactics?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Submit the report
    const report = await submitCitizenReport(formData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully',
      report: {
        id: report.id,
        title: report.title,
        status: 'submitted for review'
      }
    })
    
  } catch (error) {
    console.error('API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit report'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}