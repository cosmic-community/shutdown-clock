'use client'

import { useEffect, useRef } from 'react'

interface AnalyticsTrackerProps {
  sessionId: string
}

export function AnalyticsTracker({ sessionId }: AnalyticsTrackerProps) {
  const sessionStartTime = useRef<number>(Date.now())
  const lastActivityTime = useRef<number>(Date.now())
  const hasTrackedPageView = useRef<boolean>(false)
  const hasTrackedSession = useRef<boolean>(false)

  // Track analytics event
  const trackEvent = async (eventType: string, additionalData: Record<string, any> = {}) => {
    try {
      const currentTime = Date.now()
      const sessionDuration = Math.round((currentTime - sessionStartTime.current) / 1000) // seconds

      const eventData = {
        event_type: eventType,
        session_id: sessionId,
        page_url: window.location.pathname,
        screen_resolution: `${screen.width}x${screen.height}`,
        session_duration: sessionDuration,
        additional_data: {
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          color_depth: screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          ...additionalData
        }
      }

      // Use fetch with no-op error handling to avoid impacting user experience
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }).catch(() => {
        // Silently handle errors to avoid impacting user experience
      })

    } catch (error) {
      // Silently handle errors to avoid impacting user experience
      console.debug('Analytics tracking error:', error)
    }
  }

  // Update last activity time
  const updateActivity = () => {
    lastActivityTime.current = Date.now()
  }

  useEffect(() => {
    // Track session start (only once per session)
    if (!hasTrackedSession.current) {
      trackEvent('session_start')
      hasTrackedSession.current = true
    }

    // Track page view (only once per page load)
    if (!hasTrackedPageView.current) {
      trackEvent('page_view')
      hasTrackedPageView.current = true
    }

    // Set up activity tracking
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // Set up periodic session duration tracking
    const sessionInterval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityTime.current
      
      // Only track if user was active in the last 5 minutes
      if (timeSinceActivity < 5 * 60 * 1000) {
        trackEvent('page_view', { 
          is_heartbeat: true,
          time_since_activity: Math.round(timeSinceActivity / 1000)
        })
      }
    }, 30000) // Every 30 seconds

    // Track session end on page unload
    const handleBeforeUnload = () => {
      const finalDuration = Math.round((Date.now() - sessionStartTime.current) / 1000)
      navigator.sendBeacon('/api/analytics/track', JSON.stringify({
        event_type: 'session_end',
        session_id: sessionId,
        page_url: window.location.pathname,
        session_duration: finalDuration,
        additional_data: { final_session: true }
      }))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      clearInterval(sessionInterval)
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity)
      })
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [sessionId])

  // Track form submissions
  useEffect(() => {
    const handleFormSubmit = () => {
      trackEvent('form_submission', {
        form_type: 'citizen_report'
      })
    }

    // Listen for form submission events
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      form.addEventListener('submit', handleFormSubmit)
    })

    return () => {
      forms.forEach(form => {
        form.removeEventListener('submit', handleFormSubmit)
      })
    }
  }, [sessionId])

  // Track social share clicks
  useEffect(() => {
    const handleSocialShare = (event: Event) => {
      const target = event.target as HTMLElement
      const socialPlatform = target.getAttribute('data-platform') || 'unknown'
      
      trackEvent('social_share', {
        platform: socialPlatform,
        url: window.location.href
      })
    }

    // Listen for social share clicks
    const socialButtons = document.querySelectorAll('[data-platform]')
    socialButtons.forEach(button => {
      button.addEventListener('click', handleSocialShare)
    })

    return () => {
      socialButtons.forEach(button => {
        button.removeEventListener('click', handleSocialShare)
      })
    }
  }, [sessionId])

  // Track external link clicks
  useEffect(() => {
    const handleExternalLink = (event: Event) => {
      const target = event.target as HTMLAnchorElement
      if (target.tagName === 'A' && target.href && target.target === '_blank') {
        trackEvent('external_link_click', {
          link_url: target.href,
          link_text: target.textContent?.substring(0, 100) || ''
        })
      }
    }

    document.addEventListener('click', handleExternalLink)

    return () => {
      document.removeEventListener('click', handleExternalLink)
    }
  }, [sessionId])

  // This component renders nothing - it's just for tracking
  return null
}