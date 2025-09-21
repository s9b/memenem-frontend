'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  Download, 
  Share2, 
  Twitter, 
  Instagram, 
  Linkedin,
  Copy,
  CheckCircle2,
  TrendingUp,
  Clock,
  Tag,
  Sparkles
} from 'lucide-react';

import { Meme } from '@/types';
import { 
  formatTimestamp, 
  formatViralityScore, 
  formatUpvoteCount,
  downloadMemeWithCaption,
  generateShareURL,
  copyToClipboard,
  generateMemeFilename,
  triggerConfetti
} from '@/lib/utils';
import { MemeAPIService, handleAPIError } from '@/lib/api';
import { InlineLoader } from './LoadingSpinner';

interface MemeCardProps {
  meme: Meme;
  onUpvote?: (memeId: string, newCount: number) => void;
  showFullDetails?: boolean;
  className?: string;
}

/**
 * MemeCard component for displaying memes with interactive features
 * Includes upvoting, sharing, downloading, and virality information
 */
export default function MemeCard({ 
  meme, 
  onUpvote,
  showFullDetails = true,
  className = ''
}: MemeCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(meme.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Format virality score for display
  const viralityInfo = formatViralityScore(meme.virality_score);

  // Handle upvote action
  const handleUpvote = async () => {
    if (isUpvoting || hasUpvoted) return;

    setIsUpvoting(true);
    try {
      const response = await MemeAPIService.upvoteMeme({ meme_id: meme.meme_id });
      const newCount = response.new_upvote_count;
      
      setLocalUpvotes(newCount);
      setHasUpvoted(true);
      onUpvote?.(meme.meme_id, newCount);
      
      // Trigger confetti effect
      await triggerConfetti();
    } catch (error) {
      console.error('Failed to upvote meme:', error);
      // You could show a toast notification here
    } finally {
      setIsUpvoting(false);
    }
  };

  // Handle meme download
  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const filename = generateMemeFilename(meme.template_name, meme.style);
      await downloadMemeWithCaption(meme.image_url, meme.caption, filename);
    } catch (error) {
      console.error('Failed to download meme:', error);
      // You could show a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle social sharing
  const handleShare = async (platform: 'twitter' | 'instagram' | 'linkedin' | 'copy') => {
    const fullUrl = `${window.location.origin}${meme.image_url}`;
    const shareText = `Check out this viral meme: "${meme.caption}"`;

    if (platform === 'copy') {
      const success = await copyToClipboard(`${shareText}\n\n${fullUrl}`);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
      return;
    }

    if (platform === 'instagram') {
      // For Instagram, copy to clipboard since they don't support direct sharing
      const success = await copyToClipboard(`${shareText}\n\n${fullUrl}`);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        // Open Instagram in new tab
        window.open('https://www.instagram.com/', '_blank');
      }
      return;
    }

    const shareUrl = generateShareURL(platform, fullUrl, shareText);
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  // State for image loading
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className={`meme-card card card-hover p-4 ${className}`}>
      {/* Meme Image */}
      <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        {meme.image_url && !imageError ? (
          <>
            {/* Loading placeholder */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <InlineLoader />
                <span className="ml-2 text-gray-500">Loading meme...</span>
              </div>
            )}
            
            {/* Use regular img tag for external backend URLs */}
            <img
              src={meme.image_url}
              alt={meme.caption}
              className="w-full h-auto object-cover rounded-lg shadow-lg max-w-full"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
          </>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Meme image not available</p>
              {imageError && (
                <p className="text-xs mt-1">Failed to load image</p>
              )}
            </div>
          </div>
        )}
        
        {/* Virality Score Badge */}
        <div className="absolute top-2 right-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium`}>
            <TrendingUp className="w-3 h-3" />
            <span className={viralityInfo.color}>{viralityInfo.formatted}</span>
            <span>{viralityInfo.emoji}</span>
          </div>
        </div>

        {/* Style Tag */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
            <Tag className="w-3 h-3" />
            <span className="capitalize">{meme.style.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Meme Caption */}
      <div className="mb-4">
        <p className="text-light-text dark:text-dark-text font-medium text-lg leading-relaxed">
          &ldquo;{meme.caption}&rdquo;
        </p>
      </div>

      {/* Meme Details */}
      {showFullDetails && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>{meme.template_name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTimestamp(meme.timestamp)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {/* Upvote Button */}
        <button
          onClick={handleUpvote}
          disabled={isUpvoting || hasUpvoted}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${
            hasUpvoted 
              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
          }`}
        >
          {isUpvoting ? (
            <InlineLoader />
          ) : (
            <>
              <Heart className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
              <span className="font-medium">{formatUpvoteCount(localUpvotes)}</span>
            </>
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
            title="Download meme"
          >
            {isDownloading ? (
              <InlineLoader />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              title="Share meme"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg py-2 z-10 min-w-[150px]">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-blue-500" />
                  <span>Twitter</span>
                </button>
                
                <button
                  onClick={() => handleShare('instagram')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </button>
                
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span>LinkedIn</span>
                </button>
                
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {copySuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}