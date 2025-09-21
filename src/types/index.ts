// Humor styles enum matching backend
export const HUMOR_STYLES = [
  'sarcastic',
  'gen_z_slang',
  'wholesome',
  'dark_humor',
  'corporate_irony'
] as const;

export type HumorStyle = typeof HUMOR_STYLES[number];

// Template interface
export interface Template {
  template_id: string;
  name: string;
  url: string;
  tags: string[];
  popularity: number;
  source: string;
  created_at: string;
  box_count?: number;
  width?: number;
  height?: number;
}

// Meme interface
export interface Meme {
  meme_id: string;
  template_id: string;
  template_name: string;
  caption: string;
  style: HumorStyle;
  image_url: string;
  virality_score: number;
  upvotes: number;
  timestamp: string;
}

// API Request types
export interface GenerateMemeRequest {
  topic: string;
  style: HumorStyle;
  template_id?: string;
}

export interface UpvoteRequest {
  meme_id: string;
}

// API Response types
export interface GenerateMemeResponse {
  success: boolean;
  meme: Meme;
  message?: string;
}

export interface TemplatesResponse {
  success: boolean;
  templates: Template[];
  count: number;
}

export interface TrendingMemesResponse {
  success: boolean;
  memes: Meme[];
  count: number;
}

export interface UpvoteResponse {
  success: boolean;
  new_upvote_count: number;
  message?: string;
}

export interface ViralityScoreResponse {
  success: boolean;
  meme_id: string;
  virality_score: number;
  factors: Record<string, any>;
}

export interface ErrorResponse {
  success: false;
  error: string;
  detail?: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  type?: 'error' | 'warning' | 'info';
}

// Theme types
export type Theme = 'light' | 'dark';

// Social platform types for sharing
export type SocialPlatform = 'twitter' | 'instagram' | 'linkedin';

// Humor style display information
export interface HumorStyleInfo {
  value: HumorStyle;
  label: string;
  description: string;
  emoji: string;
}

export const HUMOR_STYLE_INFO: HumorStyleInfo[] = [
  {
    value: 'sarcastic',
    label: 'Sarcastic',
    description: 'Witty, cynical humor',
    emoji: '😏'
  },
  {
    value: 'gen_z_slang',
    label: 'Gen Z Slang',
    description: 'Modern internet terminology',
    emoji: '💀'
  },
  {
    value: 'wholesome',
    label: 'Wholesome',
    description: 'Positive, uplifting content',
    emoji: '😊'
  },
  {
    value: 'dark_humor',
    label: 'Dark Humor',
    description: 'Edgy but tasteful humor',
    emoji: '🖤'
  },
  {
    value: 'corporate_irony',
    label: 'Corporate Irony',
    description: 'Business buzzword satire',
    emoji: '💼'
  }
];

// API endpoints configuration
export const API_ENDPOINTS = {
  TEMPLATES: '/api/v1/templates',
  GENERATE: '/api/v1/generate',
  TRENDING: '/api/v1/trending',
  UPVOTE: '/api/v1/upvote',
  SCORE: '/api/v1/score',
  HEALTH: '/health',
  STATUS: '/api/v1/status'
} as const;