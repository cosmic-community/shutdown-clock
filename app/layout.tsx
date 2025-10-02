import type { Metadata } from 'next'
import './globals.css'
import { CosmicBadge } from '@/components/CosmicBadge'

export const metadata: Metadata = {
  metadataBase: new URL('https://shutdownusa.com'),
  title: 'Shutdown Clock - Government Shutdown Timer',
  description: 'A live countdown timer tracking how long the government has been shut down, with citizen survival tactics and social sharing. Track government accountability in real-time.',
  keywords: 'government shutdown, countdown timer, politics, civic engagement, shutdown tracker, government accountability, political awareness',
  authors: [{ name: 'Shutdown Clock' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Shutdown Clock - Government Shutdown Timer',
    description: 'A live countdown timer tracking how long the government has been shut down. Track government accountability and share your shutdown survival tactics.',
    url: 'https://shutdownusa.com',
    siteName: 'Shutdown Clock',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shutdown Clock - Government Shutdown Timer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shutdown Clock - Government Shutdown Timer',
    description: 'A live countdown timer tracking how long the government has been shut down.',
    images: ['/og-image.png'],
    creator: '@shutdownclock',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shutdown Clock',
    description: 'A live countdown timer tracking government shutdowns and civic engagement',
    url: 'https://shutdownusa.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://shutdownusa.com/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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