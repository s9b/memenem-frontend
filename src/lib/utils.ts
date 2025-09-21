import { SocialPlatform } from '@/types';

/**
 * Format timestamp to human-readable format
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // For older dates, show the actual date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Format virality score with appropriate styling
 */
export const formatViralityScore = (score: number): { 
  formatted: string; 
  color: string; 
  emoji: string; 
} => {
  const roundedScore = Math.round(score);
  
  if (roundedScore >= 90) {
    return {
      formatted: `${roundedScore}`,
      color: 'text-red-500',
      emoji: '🔥'
    };
  } else if (roundedScore >= 75) {
    return {
      formatted: `${roundedScore}`,
      color: 'text-orange-500',
      emoji: '📈'
    };
  } else if (roundedScore >= 50) {
    return {
      formatted: `${roundedScore}`,
      color: 'text-yellow-500',
      emoji: '👍'
    };
  } else {
    return {
      formatted: `${roundedScore}`,
      color: 'text-gray-500',
      emoji: '💡'
    };
  }
};

/**
 * Format upvote count with abbreviated notation
 */
export const formatUpvoteCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return count.toString();
  }
};

/**
 * Generate social media share URLs
 */
export const generateShareURL = (
  platform: SocialPlatform,
  memeUrl: string,
  caption: string,
  hashtags: string[] = ['meme', 'funny', 'viral']
): string => {
  const encodedUrl = encodeURIComponent(memeUrl);
  const encodedCaption = encodeURIComponent(caption);
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
  
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodedUrl}&hashtags=${hashtags.join(',')}`;
    
    case 'instagram':
      // Instagram doesn't have a direct sharing URL, so we'll copy to clipboard instead
      return `https://www.instagram.com/`;
    
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedCaption}`;
    
    default:
      return memeUrl;
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download image from URL
 */
export const downloadImage = async (imageUrl: string, filename?: string): Promise<void> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `meme-${Date.now()}.jpg`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw new Error('Failed to download image');
  }
};

/**
 * Convert image to canvas and download with caption overlay (if needed)
 */
export const downloadMemeWithCaption = async (
  imageUrl: string, 
  caption: string, 
  filename?: string
): Promise<void> => {
  try {
    // For now, just download the image directly
    // In a more advanced implementation, we could overlay the caption
    await downloadImage(imageUrl, filename);
  } catch (error) {
    console.error('Failed to download meme:', error);
    throw new Error('Failed to download meme');
  }
};

/**
 * Validate image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Generate a random meme filename
 */
export const generateMemeFilename = (templateName: string, style: string): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const cleanTemplateName = templateName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const cleanStyle = style.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  
  return `meme-${cleanTemplateName}-${cleanStyle}-${timestamp}.jpg`;
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Clamp a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Check if the device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Sleep function for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get contrasting text color based on background
 */
export const getContrastingColor = (backgroundColor: string): 'white' | 'black' => {
  // Simple implementation - in a real app, you might want a more sophisticated algorithm
  const darkColors = ['#0F111A', '#1A1D29', '#2D3748'];
  return darkColors.includes(backgroundColor) ? 'white' : 'black';
};

/**
 * Animate element with confetti effect
 */
export const triggerConfetti = async (): Promise<void> => {
  try {
    // Dynamic import to avoid SSR issues
    const confetti = (await import('canvas-confetti')).default;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#40CFFF', '#FF6B9D', '#FFD93D', '#6BCF7F']
    });
  } catch (error) {
    console.log('Confetti not available:', error);
  }
};