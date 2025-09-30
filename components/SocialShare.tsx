'use client'

import { useState, useEffect } from 'react'
import { calculateCountdown, generateShareText, getTwitterShareUrl, getFacebookShareUrl } from '@/lib/utils'

interface SocialShareProps {
  shutdownStartDate: string;
}

export function SocialShare({ shutdownStartDate }: SocialShareProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [days, setDays] = useState(0);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const time = calculateCountdown(shutdownStartDate);
    setDays(time.days);
  }, [shutdownStartDate]);

  const shareText = generateShareText(days);
  const twitterUrl = getTwitterShareUrl(shareText, currentUrl);
  const facebookUrl = getFacebookShareUrl(currentUrl);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <span className="text-govt-gray font-medium">Share the countdown:</span>
      <div className="flex gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Share on Facebook
        </a>
      </div>
    </div>
  );
}