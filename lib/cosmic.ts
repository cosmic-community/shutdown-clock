import { createBucketClient } from '@cosmicjs/sdk'
import { SiteSettings, CitizenReport, CitizenReportFormData, CosmicResponse } from '@/types'

// Create Cosmic client for server-side operations (with write access)
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Create Cosmic client for client-side operations (read-only)
export const cosmicRead = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await cosmicRead.objects.findOne({
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
    console.error('Error fetching site settings:', error);
    throw new Error('Failed to fetch site settings');
  }
}

// Fetch approved citizen reports
export async function getApprovedCitizenReports(): Promise<CitizenReport[]> {
  try {
    const response = await cosmicRead.objects
      .find({ 
        type: 'citizen-reports',
        'metadata.approved': true 
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
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
    console.error('Error fetching citizen reports:', error);
    throw new Error('Failed to fetch citizen reports');
  }
}

// Submit new citizen report (server-side function)
export async function submitCitizenReport(formData: CitizenReportFormData): Promise<CitizenReport> {
  // Validate input data
  if (!formData.name?.trim() || !formData.location?.trim() || !formData.survivalTactics?.trim()) {
    throw new Error('All fields are required');
  }

  if (formData.survivalTactics.length > 200) {
    throw new Error('Survival tactics must be 200 characters or less');
  }

  // Sanitize input data
  const sanitizedData = {
    name: formData.name.trim(),
    location: formData.location.trim(),
    survivalTactics: formData.survivalTactics.trim()
  };

  try {
    console.log('Submitting citizen report:', sanitizedData);
    
    const response = await cosmic.objects.insertOne({
      type: 'citizen-reports',
      title: `${sanitizedData.name}'s Survival Strategy`,
      status: 'draft', // Set as draft initially
      metadata: {
        name: sanitizedData.name,
        location: sanitizedData.location,
        survival_tactics: sanitizedData.survivalTactics,
        approved: false // Requires manual approval
      }
    });
    
    console.log('Successfully created citizen report:', response.object?.id);
    return response.object as CitizenReport;
    
  } catch (error) {
    console.error('Error creating citizen report:', error);
    
    // Provide more specific error messages
    if (hasStatus(error)) {
      if (error.status === 401) {
        throw new Error('Authentication failed. Please check your API keys.');
      } else if (error.status === 403) {
        throw new Error('Permission denied. Write access required.');
      } else if (error.status === 422) {
        throw new Error('Invalid data provided. Please check your input.');
      }
    }
    
    throw new Error('Failed to submit report. Please try again later.');
  }
}