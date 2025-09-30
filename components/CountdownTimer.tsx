'use client'

import { useState, useEffect } from 'react'
import { calculateCountdown, formatCountdownUnit } from '@/lib/utils'
import { CountdownTime } from '@/types'

interface CountdownTimerProps {
  startDate: string;
}

export function CountdownTimer({ startDate }: CountdownTimerProps) {
  const [time, setTime] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const newTime = calculateCountdown(startDate);
      setTime(newTime);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      <div className="text-center">
        <div className="countdown-digit">
          {formatCountdownUnit(time.days)}
        </div>
        <div className="countdown-label mt-2">
          Days
        </div>
      </div>
      
      <div className="text-center">
        <div className="countdown-digit">
          {formatCountdownUnit(time.hours)}
        </div>
        <div className="countdown-label mt-2">
          Hours
        </div>
      </div>
      
      <div className="text-center">
        <div className="countdown-digit">
          {formatCountdownUnit(time.minutes)}
        </div>
        <div className="countdown-label mt-2">
          Minutes
        </div>
      </div>
      
      <div className="text-center">
        <div className="countdown-digit animate-pulse-slow">
          {formatCountdownUnit(time.seconds)}
        </div>
        <div className="countdown-label mt-2">
          Seconds
        </div>
      </div>
    </div>
  );
}