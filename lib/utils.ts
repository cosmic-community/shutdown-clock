import { CountdownTime } from '@/types'

export function calculateCountdown(startDate: string): CountdownTime {
  // Create the shutdown start time at 12:00 AM (midnight) EST on the specified date
  // Parse the date components from YYYY-MM-DD format
  const year = parseInt(startDate.substring(0, 4));
  const month = parseInt(startDate.substring(5, 7)) - 1; // JavaScript months are 0-indexed
  const day = parseInt(startDate.substring(8, 10));
  
  // Create a date object for 12:00 AM (midnight) on the shutdown date
  // Changed from 12:01 AM to 12:00 AM
  const shutdownDate = new Date(year, month, day, 0, 0, 0, 0);
  
  // For more accurate EST handling, we'll create the date assuming local time
  // and then calculate the difference from the current time
  // This approach works better across different time zones and DST changes
  const shutdownStart = shutdownDate.getTime();
  const now = new Date().getTime();
  const difference = now - shutdownStart;

  // If the shutdown hasn't started yet, return zero
  if (difference < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function formatCountdownUnit(value: number): string {
  return value.toString().padStart(2, '0');
}

export function generateShareText(time: CountdownTime): string {
  const { days, hours, minutes, seconds } = time;
  
  // If all values are zero, it means the shutdown hasn't started yet
  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    return `The government shutdown hasn't started yet. Check out the live counter:`;
  } else if (days === 0 && hours === 0 && minutes === 0) {
    return `The government has been shut down for ${seconds} seconds! Check out the live counter:`;
  } else if (days === 0 && hours === 0) {
    return `The government has been shut down for ${minutes} minutes and ${seconds} seconds! Check out the live counter:`;
  } else if (days === 0) {
    return `The government has been shut down for ${hours} hours, ${minutes} minutes, and ${seconds} seconds! Check out the live counter:`;
  } else {
    return `The government has been shut down for ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds! Check out the live counter:`;
  }
}

export function getTwitterShareUrl(text: string, url: string): string {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
}

export function getFacebookShareUrl(url: string, quote?: string): string {
  const encodedUrl = encodeURIComponent(url);
  if (quote) {
    const encodedQuote = encodeURIComponent(quote);
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}`;
  }
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
}