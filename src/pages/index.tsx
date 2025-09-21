'use client';

import { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  AlertCircle,
  Wand2,
  TrendingUp,
  Users,
  Lightbulb
} from 'lucide-react';

import { HumorStyle, HUMOR_STYLE_INFO, Meme, MemeTemplate, MemeVariation, GenerateMemeRequest } from '@/types';
import { MemeAPIService, handleAPIError } from '@/lib/api';
import MemeCard from '@/components/ui/MemeCard';
import MemeTemplateGrid from '@/components/ui/MemeTemplateGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Home page component with meme generation form and results
 * Features topic input, humor style selection, and generated meme display
 */
export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<HumorStyle>('sarcastic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeme, setGeneratedMeme] = useState<Meme | null>(null);
  const [memeTemplates, setMemeTemplates] = useState<MemeTemplate[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<{ templateId: string, variation: MemeVariation } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generationMode, setGenerationMode] = useState<'single' | 'variations'>('variations');

  // Handle meme generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic for your meme');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);
    setMemeTemplates([]);
    setSelectedVariation(null);
    setGeneratedMeme(null);

    try {
      const request: GenerateMemeRequest = {
        topic: topic.trim(),
        style: selectedStyle
      };

      if (generationMode === 'variations') {
        const response = await MemeAPIService.generateMemeVariations(request);
        setMemeTemplates(response.templates);
        setSuccess(true);
      } else {
        const response = await MemeAPIService.generateMeme(request);
        setGeneratedMeme(response.meme);
        setSuccess(true);
      }
      
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle variation selection
  const handleVariationSelect = (templateId: string, variation: MemeVariation) => {
    setSelectedVariation({ templateId, variation });
    
    // Find the template to get additional info
    const template = memeTemplates.find(t => t.template_id === templateId);
    if (template) {
      // Convert to Meme format for compatibility with existing MemeCard
      const meme: Meme = {
        meme_id: `${templateId}_${variation.variation_id}`,
        template_id: templateId,
        template_name: template.template_name,
        caption: variation.caption || Object.values(variation.captions || {}).join(' / '),
        style: selectedStyle,
        image_url: template.image_url,
        virality_score: variation.virality_score,
        upvotes: 0,
        timestamp: new Date().toISOString()
      };
      setGeneratedMeme(meme);
    }
  };

  // Handle upvote from MemeCard
  const handleMemeUpvote = (memeId: string, newCount: number) => {
    if (generatedMeme && generatedMeme.meme_id === memeId) {
      setGeneratedMeme({ ...generatedMeme, upvotes: newCount });
    }
  };

  // Topic suggestions for inspiration
  const topicSuggestions = [
    'Monday morning meetings',
    'Working from home',
    'Social media addicts',
    'Online shopping',
    'Procrastination',
    'Coffee addiction',
    'Weekend plans',
    'Technology fails'
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient">
            Create Viral Memes
          </h1>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce-gentle">
            🚀
          </div>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Turn any topic into viral memes with AI-powered caption generation and trending templates
        </p>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>Viral Templates</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>Social Ready</span>
          </div>
        </div>
      </div>

      {/* Generation Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleGenerate} className="card p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
              Generate Your Meme
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a topic and choose your humor style
            </p>
          </div>

          {/* Topic Input */}
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-sm font-medium text-light-text dark:text-dark-text">
              Meme Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your meme topic (e.g., 'Monday morning meetings')"
              className="input-field"
              maxLength={200}
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {topic.length}/200 characters
            </p>
          </div>

          {/* Topic Suggestions */}
          {!topic && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-light-text dark:text-dark-text flex items-center">
                <Lightbulb className="w-4 h-4 mr-1" />
                Need inspiration? Try these:
              </p>
              <div className="flex flex-wrap gap-2">
                {topicSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setTopic(suggestion)}
                    className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    disabled={isGenerating}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Humor Style Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-light-text dark:text-dark-text">
              Humor Style <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HUMOR_STYLE_INFO.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-102 ${
                    selectedStyle === style.value
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                      : 'border-light-border dark:border-dark-border hover:border-primary/50'
                  }`}
                  disabled={isGenerating}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{style.emoji}</span>
                    <div>
                      <div className="font-medium text-light-text dark:text-dark-text">
                        {style.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {style.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generation Mode Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-light-text dark:text-dark-text">
              Generation Mode
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setGenerationMode('variations')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  generationMode === 'variations'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                disabled={isGenerating}
              >
                🎭 Multiple Variations
              </button>
              <button
                type="button"
                onClick={() => setGenerationMode('single')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  generationMode === 'single'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                disabled={isGenerating}
              >
                ⚡ Single Meme
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {generationMode === 'variations' 
                ? 'Generate 4-5 caption variations across multiple templates'
                : 'Generate one meme with the best template'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-state">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isGenerating || !topic.trim()}
            className="w-full btn-primary py-4 text-lg font-semibold relative overflow-hidden group"
          >
            {isGenerating ? (
              <LoadingSpinner size="sm" message="Creating viral magic..." />
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Wand2 className="w-5 h-5" />
                <span>Generate Viral Meme</span>
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Multi-Variation Templates Display */}
      {memeTemplates.length > 0 && (
        <div className="max-w-6xl mx-auto animate-slide-up">
          <MemeTemplateGrid
            templates={memeTemplates}
            onVariationSelect={handleVariationSelect}
          />
        </div>
      )}

      {/* Selected Variation Display */}
      {selectedVariation && generatedMeme && (
        <div className="max-w-2xl mx-auto animate-slide-up mt-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
              Your Selected Meme is Ready! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Selected from {memeTemplates.find(t => t.template_id === selectedVariation.templateId)?.template_name}
            </p>
          </div>
          
          <MemeCard
            meme={generatedMeme}
            onUpvote={handleMemeUpvote}
            showFullDetails={true}
          />
        </div>
      )}

      {/* Single Generated Meme Display */}
      {generatedMeme && generationMode === 'single' && !selectedVariation && (
        <div className="max-w-2xl mx-auto animate-slide-up">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
              Your Viral Meme is Ready! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share it with the world and watch it go viral
            </p>
          </div>
          
          <MemeCard
            meme={generatedMeme}
            onUpvote={handleMemeUpvote}
            showFullDetails={true}
          />

          {/* Success Message */}
          {success && (
            <div className="success-state mt-4 text-center">
              <p className="font-medium">
                🎊 Meme generated successfully! Don&apos;t forget to share and upvote!
              </p>
            </div>
          )}
        </div>
      )}

      {/* How It Works Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Creating viral memes has never been easier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
              1. Enter Topic
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Describe what you want your meme to be about
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Wand2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
              2. Choose Style
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select your preferred humor style and tone
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
              3. Go Viral
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI creates your meme and predicts its viral potential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}