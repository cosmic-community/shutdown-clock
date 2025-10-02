import { getSiteSettings, getApprovedCitizenReports } from '@/lib/cosmic'
import { generateSessionId } from '@/lib/analytics'
import { Banner } from '@/components/Banner'
import { CountdownTimer } from '@/components/CountdownTimer'
import { CitizenReportsForm } from '@/components/CitizenReportsForm'
import { CitizenReportsList } from '@/components/CitizenReportsList'
import { SocialShare } from '@/components/SocialShare'
import { Footer } from '@/components/Footer'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  
  const shutdownStartDate = settings?.metadata?.shutdown_start_date || '2024-01-01'
  const startDate = new Date(shutdownStartDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    title: `Shutdown Clock - ${diffDays} Days of Government Shutdown`,
    description: `The government has been shut down for ${diffDays} days. Track the shutdown duration, share your survival tactics, and stay informed about government accountability.`,
    openGraph: {
      title: `Government Shutdown: Day ${diffDays}`,
      description: `The government has been shut down for ${diffDays} days. Track real-time updates and join the conversation.`,
    },
  }
}

export default async function HomePage() {
  const [settings, reports] = await Promise.all([
    getSiteSettings(),
    getApprovedCitizenReports(),
  ]);

  // Generate session ID for analytics
  const sessionId = generateSessionId()

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-govt-gray mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-600">
            Site settings could not be loaded. Please check your Cosmic CMS configuration.
          </p>
        </div>
      </div>
    );
  }

  const shutdownStartDate = settings.metadata?.shutdown_start_date || '2024-01-01';
  const mainHeadline = settings.metadata?.main_headline || 'The Government Has Been Shut Down For:';
  const subtitle = settings.metadata?.subtitle || 'This information is provided for public awareness.';
  const bannerText = settings.metadata?.banner_text || 'OFFICIAL NOTICE';
  const formTitle = settings.metadata?.form_title || 'Report Your Shutdown Survival Tactics';
  const formDisclaimer = settings.metadata?.form_disclaimer || 'This is not an actual government service. But your input may provide comic relief.';

  // Calculate shutdown duration for structured data
  const startDate = new Date(shutdownStartDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Structured data for the page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Shutdown Clock - Government Shutdown Timer',
    description: `Live countdown timer showing the government has been shut down for ${diffDays} days`,
    datePublished: shutdownStartDate,
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'Event',
      name: 'Government Shutdown',
      startDate: shutdownStartDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      location: {
        '@type': 'VirtualLocation',
        url: 'https://shutdownusa.com',
      },
      description: `Government shutdown tracking and citizen engagement platform. Current duration: ${diffDays} days.`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Analytics Tracking */}
        <AnalyticsTracker sessionId={sessionId} />
        
        <Banner text={bannerText} />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Main Header - Semantic HTML */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-govt-gray mb-8 text-shadow">
              {mainHeadline}
            </h1>
            
            <CountdownTimer startDate={shutdownStartDate} />
            
            <p className="text-lg md:text-xl font-semibold text-govt-gray mt-8 text-shadow">
              {subtitle}
            </p>
          </header>

          {/* Contact Representatives Section */}
          <section className="bg-govt-blue text-white rounded-lg shadow-lg p-6 mb-8" aria-label="Take Action">
            <h2 className="text-2xl font-bold mb-4 text-center">Take Action</h2>
            <p className="text-lg mb-6 text-center">
              Want to make your voice heard? Contact your representatives!
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.house.gov/representatives/find-your-representative"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-govt-blue px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
                aria-label="Find your representative on House.gov"
              >
                Find Your Representative →
              </a>
            </div>
          </section>

          {/* Social Share */}
          <section className="flex justify-center mb-16" aria-label="Share on social media">
            <SocialShare shutdownStartDate={shutdownStartDate} />
          </section>

          {/* Citizen Reports Section */}
          <section className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8" aria-labelledby="form-title">
            <h2 id="form-title" className="text-2xl md:text-3xl font-bold text-govt-gray mb-6 text-center">
              {formTitle}
            </h2>
            
            <CitizenReportsForm />
            
            <p className="text-sm text-gray-600 text-center mt-4 italic">
              {formDisclaimer}
            </p>
          </section>

          {/* Reports List */}
          <section className="bg-white rounded-lg shadow-lg p-6 md:p-8" aria-labelledby="reports-title">
            <h3 id="reports-title" className="text-xl md:text-2xl font-bold text-govt-gray mb-6">
              Citizen Reports
            </h3>
            <CitizenReportsList reports={reports} />
          </section>
        </div>

        <Footer text={settings.metadata?.footer_text} />
      </div>
    </>
  );
}