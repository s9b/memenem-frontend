import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import {
  GenerateMemeRequest,
  GenerateMemeResponse,
  TemplatesResponse,
  TrendingMemesResponse,
  UpvoteRequest,
  UpvoteResponse,
  ViralityScoreResponse,
  ErrorResponse,
  API_ENDPOINTS,
  HumorStyle
} from '@/types';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds timeout for meme generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      // Rate limit exceeded
      throw new Error('Rate limit exceeded. Please try again in a few seconds.');
    }
    
    if (error.response && error.response.status >= 500) {
      // Server error
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      throw new Error('Request timeout. The meme generation is taking longer than expected.');
    }
    
    if (!error.response) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Return the original error for other cases
    return Promise.reject(error);
  }
);

// API service class
export class MemeAPIService {
  /**
   * Generate a new meme based on topic and style
   */
  static async generateMeme(request: GenerateMemeRequest): Promise<GenerateMemeResponse> {
    try {
      const response = await api.post<GenerateMemeResponse>(API_ENDPOINTS.GENERATE, request);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to generate meme');
      }
      
      return response.data;
    } catch (error) {
      console.error('Generate meme error:', error);
      
      // Handle specific backend error messages
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        const detail = error.response.data.detail;
        
        if (detail.includes('rate limit') || detail.includes('quota')) {
          throw new Error('AI service temporarily unavailable. Please try again in a few seconds.');
        }
        
        if (detail.includes('no suitable templates')) {
          throw new Error('No suitable meme templates found for this topic. Try a different topic!');
        }
        
        throw new Error(detail);
      }
      
      throw error;
    }
  }

  /**
   * Get trending meme templates
   */
  static async getTemplates(limit: number = 50, source?: string): Promise<TemplatesResponse> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (source) {
        params.append('source', source);
      }
      
      const response = await api.get<TemplatesResponse>(`${API_ENDPOINTS.TEMPLATES}?${params}`);
      
      if (!response.data.success) {
        throw new Error('Failed to fetch templates');
      }
      
      return response.data;
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  }

  /**
   * Get trending memes
   */
  static async getTrendingMemes(limit: number = 20, sortBy: string = 'virality_score'): Promise<TrendingMemesResponse> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('sort_by', sortBy);
      
      const response = await api.get<TrendingMemesResponse>(`${API_ENDPOINTS.TRENDING}?${params}`);
      
      if (!response.data.success) {
        throw new Error('Failed to fetch trending memes');
      }
      
      return response.data;
    } catch (error) {
      console.error('Get trending memes error:', error);
      throw error;
    }
  }

  /**
   * Upvote a meme
   */
  static async upvoteMeme(request: UpvoteRequest): Promise<UpvoteResponse> {
    try {
      const response = await api.post<UpvoteResponse>(API_ENDPOINTS.UPVOTE, request);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to upvote meme');
      }
      
      return response.data;
    } catch (error) {
      console.error('Upvote meme error:', error);
      throw error;
    }
  }

  /**
   * Get virality score for a meme
   */
  static async getViralityScore(memeId: string): Promise<ViralityScoreResponse> {
    try {
      const response = await api.post<ViralityScoreResponse>(`${API_ENDPOINTS.SCORE}?meme_id=${memeId}`);
      
      if (!response.data.success) {
        throw new Error('Failed to get virality score');
      }
      
      return response.data;
    } catch (error) {
      console.error('Get virality score error:', error);
      throw error;
    }
  }

  /**
   * Check API health
   */
  static async checkHealth(): Promise<any> {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Get API status
   */
  static async getStatus(): Promise<any> {
    try {
      const response = await api.get(API_ENDPOINTS.STATUS);
      return response.data;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }
}

// Utility functions for error handling
export const handleAPIError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (axios.isAxiosError(error)) {
    const response = error.response?.data as ErrorResponse | undefined;
    
    if (response?.error) {
      return response.error;
    }
    
    if (response?.detail) {
      return response.detail;
    }
    
    return `API Error: ${error.response?.status || 'Unknown'}`;
  }
  
  return 'An unexpected error occurred';
};

// Check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await MemeAPIService.checkHealth();
    return true;
  } catch {
    return false;
  }
};