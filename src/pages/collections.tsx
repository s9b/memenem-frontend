'use client';

import { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Plus,
  Search,
  Grid3X3,
  List,
  Heart,
  Download,
  Trash2,
  AlertCircle,
  BookmarkPlus
} from 'lucide-react';

import { Meme } from '@/types';
import MemeCard from '@/components/ui/MemeCard';
import { CardLoader } from '@/components/ui/LoadingSpinner';

/**
 * Collections page component for managing saved memes
 * Features local storage for persistence and collection management
 */
export default function CollectionsPage() {
  const [savedMemes, setSavedMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMemes, setSelectedMemes] = useState<string[]>([]);

  // Load saved memes from localStorage
  useEffect(() => {
    const loadSavedMemes = () => {
      try {
        const saved = localStorage.getItem('memenem-saved-memes');
        if (saved) {
          const parsedMemes = JSON.parse(saved) as Meme[];
          setSavedMemes(parsedMemes);
        }
      } catch (error) {
        console.error('Failed to load saved memes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedMemes();
  }, []);

  // Save memes to localStorage
  const saveMemes = (memes: Meme[]) => {
    try {
      localStorage.setItem('memenem-saved-memes', JSON.stringify(memes));
    } catch (error) {
      console.error('Failed to save memes:', error);
    }
  };

  // Filter memes based on search query
  const filteredMemes = savedMemes.filter(meme =>
    meme.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meme.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meme.style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle saving a meme to collection
  const handleSaveMeme = (meme: Meme) => {
    const isAlreadySaved = savedMemes.some(saved => saved.meme_id === meme.meme_id);
    
    if (!isAlreadySaved) {
      const updatedMemes = [...savedMemes, meme];
      setSavedMemes(updatedMemes);
      saveMemes(updatedMemes);
    }
  };

  // Handle removing a meme from collection
  const handleRemoveMeme = (memeId: string) => {
    const updatedMemes = savedMemes.filter(meme => meme.meme_id !== memeId);
    setSavedMemes(updatedMemes);
    saveMemes(updatedMemes);
    setSelectedMemes(selectedMemes.filter(id => id !== memeId));
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedMemes = savedMemes.filter(meme => !selectedMemes.includes(meme.meme_id));
    setSavedMemes(updatedMemes);
    saveMemes(updatedMemes);
    setSelectedMemes([]);
  };

  // Handle meme selection for bulk operations
  const handleMemeSelect = (memeId: string) => {
    setSelectedMemes(prev =>
      prev.includes(memeId)
        ? prev.filter(id => id !== memeId)
        : [...prev, memeId]
    );
  };

  // Handle select all toggle
  const handleSelectAll = () => {
    setSelectedMemes(
      selectedMemes.length === filteredMemes.length
        ? []
        : filteredMemes.map(meme => meme.meme_id)
    );
  };

  // Handle upvote from MemeCard
  const handleMemeUpvote = (memeId: string, newCount: number) => {
    const updatedMemes = savedMemes.map(meme =>
      meme.meme_id === memeId
        ? { ...meme, upvotes: newCount }
        : meme
    );
    setSavedMemes(updatedMemes);
    saveMemes(updatedMemes);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Bookmark className="w-8 h-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            My Collections
          </h1>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your saved memes collection • All stored locally in your browser
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search and View Controls */}
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search your memes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMemes.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedMemes.length} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="btn-secondary !py-2 !px-3 text-sm flex items-center space-x-2 !text-red-600 !border-red-200 dark:!border-red-800 hover:!bg-red-50 dark:hover:!bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardLoader key={index} />
          ))}
        </div>
      ) : filteredMemes.length === 0 ? (
        <div className="text-center py-12">
          {savedMemes.length === 0 ? (
            <>
              <BookmarkPlus className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                No Saved Memes Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Start building your collection! Generate memes and save your favorites for easy access later.
              </p>
              <a href="/" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Your First Meme</span>
              </a>
            </>
          ) : (
            <>
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                No Matching Memes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                No memes found matching &quot;{searchQuery}&quot;. Try different keywords.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="btn-secondary"
              >
                Clear Search
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Selection Controls */}
          {filteredMemes.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <button
                onClick={handleSelectAll}
                className="hover:text-primary transition-colors"
              >
                {selectedMemes.length === filteredMemes.length ? 'Deselect All' : 'Select All'}
              </button>
              <span>
                {filteredMemes.length} {filteredMemes.length === 1 ? 'meme' : 'memes'}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            </div>
          )}

          {/* Memes Display */}
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredMemes.map((meme, index) => (
              <div
                key={meme.meme_id}
                className={`relative animate-slide-up ${
                  selectedMemes.includes(meme.meme_id) ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg rounded-xl' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedMemes.includes(meme.meme_id)}
                    onChange={() => handleMemeSelect(meme.meme_id)}
                    className="w-5 h-5 text-primary bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 rounded focus:ring-primary focus:ring-2"
                  />
                </div>

                {/* Remove Button */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleRemoveMeme(meme.meme_id)}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove from collection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <MemeCard
                  meme={meme}
                  onUpvote={handleMemeUpvote}
                  showFullDetails={true}
                  className="!mt-0"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Collection Info */}
      {savedMemes.length > 0 && (
        <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-6 border border-primary/20">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Bookmark className="w-5 h-5 text-primary" />
              <span className="font-semibold text-light-text dark:text-dark-text">
                Collection Stats
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{savedMemes.length}</div>
                <div className="text-gray-600 dark:text-gray-400">Saved Memes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {Math.round(savedMemes.reduce((acc, meme) => acc + meme.virality_score, 0) / savedMemes.length) || 0}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Avg. Virality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {savedMemes.reduce((acc, meme) => acc + meme.upvotes, 0)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Upvotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {new Set(savedMemes.map(meme => meme.style)).size}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Humor Styles</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local Storage Notice */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-center space-x-2">
          <AlertCircle className="w-3 h-3" />
          <span>
            Your memes are saved locally in your browser. Clear your browser data to remove them.
          </span>
        </div>
      </div>
    </div>
  );
}