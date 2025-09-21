'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Users, Copy, Check } from 'lucide-react';
import { MemeTemplate, MemeVariation } from '@/types';
import { formatViralityScore } from '@/lib/utils';

interface MemeTemplateGridProps {
  templates: MemeTemplate[];
  onVariationSelect?: (templateId: string, variation: MemeVariation) => void;
  className?: string;
}

interface MemeVariationCarouselProps {
  template: MemeTemplate;
  onVariationSelect?: (templateId: string, variation: MemeVariation) => void;
}

/**
 * Carousel component for displaying caption variations of a single template
 */
function MemeVariationCarousel({ template, onVariationSelect }: MemeVariationCarouselProps) {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    setCurrentVariation((prev) => (prev + 1) % template.variations.length);
  };

  const handlePrev = () => {
    setCurrentVariation((prev) => (prev - 1 + template.variations.length) % template.variations.length);
  };

  const handleSelect = () => {
    if (onVariationSelect) {
      onVariationSelect(template.template_id, template.variations[currentVariation]);
    }
  };

  const handleCopyCaption = async () => {
    const variation = template.variations[currentVariation];
    let textToCopy = '';
    
    if (variation.caption) {
      textToCopy = variation.caption;
    } else if (variation.captions) {
      textToCopy = Object.values(variation.captions).join('\n');
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy caption:', error);
    }
  };

  const currentVar = template.variations[currentVariation];
  const viralityInfo = formatViralityScore(currentVar.virality_score);

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Template Header */}
      <div className="relative">
        <img
          src={template.image_url}
          alt={template.template_name}
          className="w-full h-48 object-cover"
        />
        
        {/* Template Info Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
            <h3 className="text-white font-medium text-sm">{template.template_name}</h3>
          </div>
          
          <div className="bg-primary/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-medium">
              {template.average_virality_score.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Panel Count & Characters */}
        {(template.panel_count > 1 || template.characters.length > 0) && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            {template.panel_count > 1 && (
              <div className="bg-blue-600/80 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-xs">{template.panel_count} panels</span>
              </div>
            )}
            
            {template.characters.length > 0 && (
              <div className="bg-purple-600/80 backdrop-blur-sm rounded px-2 py-1 flex items-center space-x-1">
                <Users className="w-3 h-3 text-white" />
                <span className="text-white text-xs">{template.characters[0]}</span>
                {template.characters.length > 1 && (
                  <span className="text-white text-xs">+{template.characters.length - 1}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variation Content */}
      <div className="p-4">
        {/* Caption Display */}
        <div className="mb-4 min-h-[80px] bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          {currentVar.caption ? (
            <p className="text-light-text dark:text-dark-text font-medium leading-relaxed">
              "{currentVar.caption}"
            </p>
          ) : currentVar.captions ? (
            <div className="space-y-2">
              {Object.entries(currentVar.captions).map(([panel, caption], index) => (
                <div key={panel} className="flex items-start space-x-2">
                  <span className="text-primary font-bold text-sm min-w-[60px]">
                    {panel.replace('_', ' ').replace('panel', 'Panel')}:
                  </span>
                  <p className="text-light-text dark:text-dark-text font-medium text-sm">
                    "{caption}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No caption available</p>
          )}
        </div>

        {/* Variation Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={template.variations.length <= 1}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {currentVariation + 1} / {template.variations.length}
            </span>
            
            <button
              onClick={handleNext}
              disabled={template.variations.length <= 1}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Virality Score */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${viralityInfo.color}`}>
            <TrendingUp className="w-3 h-3" />
            <span>{viralityInfo.formatted}</span>
            <span>{viralityInfo.emoji}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyCaption}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium flex-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Caption</span>
              </>
            )}
          </button>
          
          {onVariationSelect && (
            <button
              onClick={handleSelect}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Grid component for displaying multiple meme templates with their variations
 */
export default function MemeTemplateGrid({ templates, onVariationSelect, className = '' }: MemeTemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No meme templates available.</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Grid Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
          Choose Your Meme 🎭
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {templates.length} templates with {templates.reduce((sum, t) => sum + t.variations.length, 0)} caption variations
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <MemeVariationCarousel
            key={template.template_id}
            template={template}
            onVariationSelect={onVariationSelect}
          />
        ))}
      </div>
    </div>
  );
}