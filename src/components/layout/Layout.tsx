import { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

/**
 * Main layout component that wraps all pages
 * Includes navigation, SEO meta tags, and responsive container
 */
export default function Layout({ 
  children, 
  title = 'MemeNem - Viral Meme Generator',
  description = 'Create viral memes with AI-powered caption generation and trending templates'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#40CFFF" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>

      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © 2024 MemeNem. All rights reserved.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Powered by AI • Built with Next.js
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  API
                </a>
                <a 
                  href="https://github.com/your-repo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}