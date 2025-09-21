import { Loader2, Sparkles, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'meme' | 'sparkle';
  message?: string;
  className?: string;
}

/**
 * LoadingSpinner component with multiple variants and sizes
 * Includes special animations for meme generation and other loading states
 */
export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  message,
  className = ''
}: LoadingSpinnerProps) {
  
  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Render different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'meme':
        return (
          <div className="relative">
            <Zap className={`${sizeClasses[size]} text-primary animate-spin`} />
            <Sparkles className={`absolute top-0 left-0 ${sizeClasses[size]} text-yellow-400 animate-pulse`} />
          </div>
        );
      
      case 'sparkle':
        return (
          <div className="relative">
            <Sparkles className={`${sizeClasses[size]} text-primary animate-spin`} />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className={`${sizeClasses[size]} text-primary opacity-20`} />
            </div>
          </div>
        );
      
      default:
        return <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Spinner with glow effect */}
      <div className="relative">
        {renderSpinner()}
        
        {/* Glow effect for meme variant */}
        {variant === 'meme' && (
          <div className="absolute inset-0 animate-pulse">
            <div className={`${sizeClasses[size]} bg-primary opacity-20 rounded-full blur-lg`} />
          </div>
        )}
      </div>

      {/* Loading message */}
      {message && (
        <div className="text-center">
          <p className={`${textSizeClasses[size]} text-light-text dark:text-dark-text font-medium`}>
            {message}
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * FullPageLoader component for page-level loading states
 */
export function FullPageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-light-bg dark:bg-dark-bg flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" variant="meme" message={message} />
      </div>
    </div>
  );
}

/**
 * InlineLoader component for smaller loading states
 */
export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" />
      {message && (
        <span className="text-sm text-light-text dark:text-dark-text">{message}</span>
      )}
    </div>
  );
}

/**
 * CardLoader component for loading states within cards
 */
export function CardLoader({ message = 'Loading content...' }: { message?: string }) {
  return (
    <div className="card p-8">
      <LoadingSpinner size="md" variant="sparkle" message={message} />
    </div>
  );
}