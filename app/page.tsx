import { getSiteSettings, getApprovedCitizenReports } from '@/lib/cosmic'
import { Banner } from '@/components/Banner'
import { CountdownTimer } from '@/components/CountdownTimer'
import { CitizenReportsForm } from '@/components/CitizenReportsForm'
import { CitizenReportsList } from '@/components/CitizenReportsList'
import { SocialShare } from '@/components/SocialShare'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [settings, reports] = await Promise.all([
    getSiteSettings(),
    getApprovedCitizenReports(),
  ]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner text={bannerText} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Main Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-govt-gray mb-8 text-shadow">
            {mainHeadline}
          </h1>
          
          <CountdownTimer startDate={shutdownStartDate} />
          
          <p className="text-lg md:text-xl font-semibold text-govt-gray mt-8 text-shadow">
            {subtitle}
          </p>
        </div>

        {/* Social Share */}
        <div className="flex justify-center mb-16">
          <SocialShare shutdownStartDate={shutdownStartDate} />
        </div>

        {/* Citizen Reports Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-govt-gray mb-6 text-center">
            {formTitle}
          </h2>
          
          <CitizenReportsForm />
          
          <p className="text-sm text-gray-600 text-center mt-4 italic">
            {formDisclaimer}
          </p>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-govt-gray mb-6">
            Citizen Reports
          </h3>
          <CitizenReportsList reports={reports} />
        </div>
      </div>

      <Footer text={settings.metadata?.footer_text} />
    </div>
  );
}