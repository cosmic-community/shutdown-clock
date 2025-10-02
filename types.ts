// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Site Settings object type
export interface SiteSettings extends CosmicObject {
  type: 'site-settings';
  metadata: {
    shutdown_start_date: string;
    main_headline?: string;
    subtitle?: string;
    banner_text?: string;
    form_title?: string;
    form_disclaimer?: string;
    footer_text?: string;
  };
}

// Citizen Reports object type
export interface CitizenReport extends CosmicObject {
  type: 'citizen-reports';
  metadata: {
    name: string;
    location: string;
    survival_tactics: string;
    approved: boolean;
  };
}

// Analytics Events object type
export interface AnalyticsEvent extends CosmicObject {
  type: 'analytics-events';
  metadata: {
    event_type: 'page_view' | 'session_start' | 'form_submission' | 'social_share' | 'external_link_click';
    session_id: string;
    user_agent?: string;
    ip_address?: string;
    referrer?: string;
    page_url: string;
    screen_resolution?: string;
    country?: string;
    city?: string;
    device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown';
    browser?: string;
    operating_system?: string;
    session_duration?: number;
    additional_data?: string; // JSON string
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Form data types
export interface CitizenReportFormData {
  name: string;
  location: string;
  survivalTactics: string;
}

// Countdown timer interface
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}