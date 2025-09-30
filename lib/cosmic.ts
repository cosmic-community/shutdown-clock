import { createBucketClient } from '@cosmicjs/sdk'
import { SiteSettings, CitizenReport, CitizenReportFormData, CosmicResponse } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'site-settings',
      slug: 'shutdown-clock-settings'
    }).depth(1);
    
    const settings = response.object as SiteSettings;
    
    if (!settings || !settings.metadata) {
      return null;
    }
    
    return settings;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch site settings');
  }
}

// Fetch approved citizen reports
export async function getApprovedCitizenReports(): Promise<CitizenReport[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'citizen-reports',
        'metadata.approved': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return (response.objects as CitizenReport[]).sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return dateB - dateA; // Newest first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch citizen reports');
  }
}

// Submit new citizen report
export async function submitCitizenReport(formData: CitizenReportFormData): Promise<CitizenReport> {
  if (!formData.name.trim() || !formData.location.trim() || !formData.survivalTactics.trim()) {
    throw new Error('All fields are required');
  }

  if (formData.survivalTactics.length > 200) {
    throw new Error('Survival tactics must be 200 characters or less');
  }

  try {
    const response = await cosmic.objects.insertOne({
      type: 'citizen-reports',
      title: `${formData.name}'s Survival Strategy`,
      metadata: {
        name: formData.name,
        location: formData.location,
        survival_tactics: formData.survivalTactics,
        approved: false // Requires manual approval
      }
    });
    
    return response.object as CitizenReport;
  } catch (error) {
    console.error('Error creating citizen report:', error);
    throw new Error('Failed to submit report');
  }
}