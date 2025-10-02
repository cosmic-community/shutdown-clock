import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { Banner } from '@/components/Banner'
import { Footer } from '@/components/Footer'
import { getSiteSettings } from '@/lib/cosmic'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const settings = await getSiteSettings()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Banner text="ANALYTICS DASHBOARD" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-govt-gray mb-4">
            Site Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Internal analytics tracking for the shutdown clock website
          </p>
        </div>

        <AnalyticsDashboard />
        
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block bg-govt-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            ← Back to Shutdown Clock
          </a>
        </div>
      </div>

      <Footer text={settings?.metadata?.footer_text} />
    </div>
  )
}