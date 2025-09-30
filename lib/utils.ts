import { CountdownTime } from '@/types'

export function calculateCountdown(startDate: string): CountdownTime {
  // Create shutdown start time at 12:01 AM EST on the specified date
  const shutdownDate = new Date(startDate);
  shutdownDate.setHours(0, 1, 0, 0); // Set to 12:01 AM (00:01)
  
  // Convert to EST/EDT (UTC-5/UTC-4)
  // Note: This is a simplified approach. For production, consider using a library like date-fns-tz
  const offsetHours = 5; // EST offset from UTC
  const shutdownStart = shutdownDate.getTime() - (offsetHours * 60 * 60 * 1000);
  
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

export function getFacebookShareUrl(url: string): string {
  const encodedUrl = encodeURIComponent(url);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
}