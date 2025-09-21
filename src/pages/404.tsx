import Link from 'next/link';
import { AlertCircle, Home, Search } from 'lucide-react';

/**
 * Custom 404 page with helpful navigation options
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-bold text-gradient opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="w-24 h-24 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The meme you&apos;re looking for seems to have vanished into the void. 
            Don&apos;t worry, even the best memes sometimes get lost!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link href="/" className="btn-primary flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          
          <Link href="/trending" className="btn-secondary flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Browse Trending</span>
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Error code: 404 • Page not found</p>
        </div>
      </div>
    </div>
  );
}