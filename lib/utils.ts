import { CountdownTime } from '@/types'

export function calculateCountdown(startDate: string): CountdownTime {
  // Create the shutdown start time at 12:01 AM EST on the specified date
  // We'll use a more reliable approach by creating the date in EST explicitly
  const year = parseInt(startDate.substring(0, 4));
  const month = parseInt(startDate.substring(5, 7)) - 1; // JavaScript months are 0-indexed
  const day = parseInt(startDate.substring(8, 10));
  
  // Create date at 12:01 AM EST/EDT
  // We'll create it as if it's in the local timezone first, then adjust
  const shutdownDate = new Date(year, month, day, 0, 1, 0, 0);
  
  // Convert to EST by creating a date that represents the EST time
  // EST is UTC-5, so we need to create the equivalent UTC timestamp
  const estOffset = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
  const shutdownStartUTC = shutdownDate.getTime() + estOffset;
  
  const now = new Date().getTime();
  const difference = now - shutdownStartUTC;

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