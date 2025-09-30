import type { Metadata } from 'next'
import './globals.css'
import { CosmicBadge } from '@/components/CosmicBadge'

export const metadata: Metadata = {
  title: 'Shutdown Clock - Government Shutdown Timer',
  description: 'A live countdown timer tracking how long the government has been shut down, with citizen survival tactics and social sharing.',
  keywords: 'government shutdown, countdown timer, politics, civic engagement',
  authors: [{ name: 'Shutdown Clock' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="antialiased">
        <main>
          {children}
        </main>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}