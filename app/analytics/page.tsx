'use client'

import { useState, useEffect } from 'react'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { Banner } from '@/components/Banner'
import { Footer } from '@/components/Footer'

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [siteSettings, setSiteSettings] = useState<any>(null)

  useEffect(() => {
    // Check if already authenticated (session storage)
    const authenticated = sessionStorage.getItem('analytics_authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }

    // Fetch site settings for footer
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings')
        if (response.ok) {
          const data = await response.json()
          setSiteSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analytics/verify-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        sessionStorage.setItem('analytics_authenticated', 'true')
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid access code')
      }
    } catch (err) {
      setError('Failed to verify access code')
    } finally {
      setLoading(false)
    }
  }

  const handleAccessDenied = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('analytics_authenticated')
    setError('Access denied. Please enter the correct access code.')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner text="RESTRICTED ACCESS" />
        
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <header className="text-center mb-8">
              <h1 className="text-2xl font-bold text-govt-gray mb-4">
                Analytics Access
              </h1>
              <p className="text-gray-600">
                This page requires an access code to view analytics data.
              </p>
            </header>

            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Access Code
                </label>
                <input
                  type="password"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-govt-blue"
                  placeholder="Enter access code"
                  disabled={loading}
                  aria-required="true"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !accessCode.trim()}
                className="w-full bg-govt-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Verifying...' : 'Access Analytics'}
              </button>
            </form>

            <nav className="mt-6 text-center">
              <a 
                href="/"
                className="text-govt-blue hover:text-blue-700 text-sm"
              >
                ← Back to Shutdown Clock
              </a>
            </nav>
          </div>
        </div>

        <Footer text={siteSettings?.metadata?.footer_text} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner text="ANALYTICS DASHBOARD" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-govt-gray mb-4">
            Site Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Internal analytics tracking for the shutdown clock website
          </p>
        </header>

        <AnalyticsDashboard onAccessDenied={handleAccessDenied} />
        
        <nav className="mt-8 text-center space-x-4">
          <a 
            href="/"
            className="inline-block bg-govt-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            ← Back to Shutdown Clock
          </a>
          
          <button
            onClick={() => {
              setIsAuthenticated(false)
              sessionStorage.removeItem('analytics_authenticated')
            }}
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            Sign Out
          </button>
        </nav>
      </div>

      <Footer text={siteSettings?.metadata?.footer_text} />
    </div>
  )
}