'use client'

import { useState, useEffect } from 'react'
import type { AnalyticsStats } from '@/lib/analytics'

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timePeriod, setTimePeriod] = useState(30)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/analytics/stats?days=${timePeriod}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [timePeriod])

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Analytics Error</h3>
          <p className="text-gray-600">{error || 'Unable to load analytics data'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-bold text-govt-gray">Analytics Dashboard</h2>
        <div className="mt-2 sm:mt-0">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-govt-blue"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.totalPageViews.toLocaleString()}</div>
          <div className="text-sm text-blue-800">Page Views</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.uniqueVisitors.toLocaleString()}</div>
          <div className="text-sm text-green-800">Unique Visitors</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.totalSessions.toLocaleString()}</div>
          <div className="text-sm text-purple-800">Sessions</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {formatDuration(Math.round(stats.averageSessionDuration))}
          </div>
          <div className="text-sm text-orange-800">Avg. Duration</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div>
          <h3 className="text-lg font-semibold text-govt-gray mb-4">Top Countries</h3>
          {stats.topCountries.length === 0 ? (
            <p className="text-gray-600">No country data available</p>
          ) : (
            <div className="space-y-2">
              {stats.topCountries.map((country, index) => (
                <div key={country.country} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {index + 1}. {country.country || 'Unknown'}
                  </span>
                  <span className="text-sm font-semibold text-govt-gray">
                    {country.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-govt-gray mb-4">Devices</h3>
          <div className="space-y-2">
            {stats.deviceBreakdown.map((device) => (
              <div key={device.device} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 capitalize">
                  {device.device}
                </span>
                <span className="text-sm font-semibold text-govt-gray">
                  {device.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div>
          <h3 className="text-lg font-semibold text-govt-gray mb-4">Top Pages</h3>
          {stats.topPages.length === 0 ? (
            <p className="text-gray-600">No page data available</p>
          ) : (
            <div className="space-y-2">
              {stats.topPages.map((page, index) => (
                <div key={page.page} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate">
                    {index + 1}. {page.page}
                  </span>
                  <span className="text-sm font-semibold text-govt-gray">
                    {page.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browsers */}
        <div>
          <h3 className="text-lg font-semibold text-govt-gray mb-4">Browsers</h3>
          {stats.browserBreakdown.length === 0 ? (
            <p className="text-gray-600">No browser data available</p>
          ) : (
            <div className="space-y-2">
              {stats.browserBreakdown.map((browser, index) => (
                <div key={browser.browser} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {index + 1}. {browser.browser}
                  </span>
                  <span className="text-sm font-semibold text-govt-gray">
                    {browser.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Chart (Simple Bar Chart) */}
      {stats.dailyStats.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-govt-gray mb-4">Daily Activity</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-end gap-1 h-32 overflow-x-auto">
              {stats.dailyStats.slice(-14).map((day) => {
                const maxViews = Math.max(...stats.dailyStats.map(d => d.views))
                const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0
                
                return (
                  <div key={day.date} className="flex-shrink-0 flex flex-col items-center">
                    <div 
                      className="bg-govt-blue w-4 rounded-t transition-all"
                      style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0px' }}
                      title={`${day.date}: ${day.views} views, ${day.visitors} visitors`}
                    ></div>
                    <div className="text-xs text-gray-600 mt-1 rotate-45 whitespace-nowrap">
                      {day.date.split('-').slice(1).join('/')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        Analytics data is stored securely in your Cosmic CMS and is not shared with third parties.
      </div>
    </div>
  )
}