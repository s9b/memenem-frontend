'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Filter, 
  RefreshCw,
  AlertCircle,
  Flame,
  Clock,
  Heart
} from 'lucide-react';

import { Meme } from '@/types';
import { MemeAPIService, handleAPIError } from '@/lib/api';
import MemeCard from '@/components/ui/MemeCard';
import LoadingSpinner, { CardLoader } from '@/components/ui/LoadingSpinner';

/**
 * Trending page component displaying popular memes
 * Features filtering, sorting, and real-time updates
 */
export default function TrendingPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'virality_score' | 'upvotes' | 'timestamp'>('virality_score');
  const [limit, setLimit] = useState(20);

  // Sort options for the dropdown
  const sortOptions = [
    { value: 'virality_score', label: 'Virality Score', icon: Flame },
    { value: 'upvotes', label: 'Most Upvoted', icon: Heart },
    { value: 'timestamp', label: 'Most Recent', icon: Clock }
  ];

  // Fetch trending memes
  const fetchTrendingMemes = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);

    try {
      const response = await MemeAPIService.getTrendingMemes(limit, sortBy);
      setMemes(response.memes);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTrendingMemes(false);
  };

  // Handle meme upvote
  const handleMemeUpvote = (memeId: string, newCount: number) => {
    setMemes(prevMemes =>
      prevMemes.map(meme =>
        meme.meme_id === memeId
          ? { ...meme, upvotes: newCount }
          : meme
      )
    );
  };

  // Load more memes
  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 20);
  };

  // Initial load and when sort/limit changes
  useEffect(() => {
    fetchTrendingMemes();
  }, [sortBy, limit]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !isRefreshing) {
        handleRefresh();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isLoading, isRefreshing]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Trending Memes
          </h1>
          <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover the hottest memes that are going viral right now
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Sort Dropdown */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-light-text dark:text-dark-text">Sort by:</span>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-field !py-2 !px-3 text-sm min-w-[150px]"
            disabled={isLoading}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="btn-secondary !py-2 !px-4 text-sm flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Content */}
      {error ? (
        <div className="text-center">
          <div className="error-state max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Failed to Load Trending Memes</h3>
            </div>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => fetchTrendingMemes()}
              className="btn-primary !py-2 !px-4"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardLoader key={index} />
          ))}
        </div>
      ) : memes.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
            No Trending Memes Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Be the first to create viral content! Head over to the generator and start making memes.
          </p>
        </div>
      ) : (
        <>
          {/* Memes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memes.map((meme, index) => (
              <div key={meme.meme_id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <MemeCard
                  meme={meme}
                  onUpvote={handleMemeUpvote}
                  showFullDetails={true}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {memes.length >= limit && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="btn-secondary !py-3 !px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  `Load More Memes`
                )}
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Showing {memes.length} trending memes • 
              Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label?.toLowerCase()} • 
              Updated {isRefreshing ? 'now' : 'recently'}
            </p>
          </div>
        </>
      )}

      {/* Trending Indicators */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-6 border border-primary/20">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-light-text dark:text-dark-text">
              What Makes a Meme Trending?
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>High virality score</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Community upvotes</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Recent activity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}