'use client'

import { calculateCountdown, formatCountdownUnit } from '@/lib/utils'
import { CountdownTime } from '@/types'
import { useState, useEffect } from 'react'

interface SocialShareProps {
  shutdownStartDate: string;
}

export function SocialShare({ shutdownStartDate }: SocialShareProps) {
  const [time, setTime] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const newTime = calculateCountdown(shutdownStartDate);
      setTime(newTime);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute for social sharing

    return () => clearInterval(interval);
  }, [shutdownStartDate]);

  const shareText = `The government has been shut down for ${formatCountdownUnit(time.days)} days, ${formatCountdownUnit(time.hours)} hours, and ${formatCountdownUnit(time.minutes)} minutes! 🏛️⏰`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = [
    {
      platform: 'twitter',
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      icon: '🐦',
      bgColor: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      platform: 'facebook',
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      icon: '📘',
      bgColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      platform: 'linkedin',
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`,
      icon: '💼',
      bgColor: 'bg-blue-800 hover:bg-blue-900'
    },
    {
      platform: 'reddit',
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      icon: '🤖',
      bgColor: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-govt-gray mb-4">
        Share the Shutdown Status
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-platform={link.platform}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${link.bgColor}`}
            aria-label={`Share on ${link.name}`}
          >
            <span>{link.icon}</span>
            <span className="hidden sm:inline">{link.name}</span>
          </a>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Help spread awareness about the government shutdown!
      </p>
    </div>
  );
}