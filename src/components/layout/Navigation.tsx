'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  TrendingUp, 
  Bookmark, 
  Menu, 
  X, 
  Zap,
  Sparkles
} from 'lucide-react';

import ThemeToggle from '../ui/ThemeToggle';

/**
 * Navigation component with responsive design and mobile menu
 * Includes theme toggle and active route highlighting
 */
export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  // Navigation items
  const navItems = [
    {
      href: '/',
      label: 'Generate',
      icon: Zap,
      description: 'Create viral memes'
    },
    {
      href: '/trending',
      label: 'Trending',
      icon: TrendingUp,
      description: 'Hot memes right now'
    },
    {
      href: '/collections',
      label: 'Collections',
      icon: Bookmark,
      description: 'Your saved memes'
    }
  ];

  // Check if route is active
  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  if (!mounted) {
    return (
      <nav className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16" />
      </nav>
    );
  }

  return (
    <nav className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border sticky top-0 z-50 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-200 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">MemeNem</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Viral Generator</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActiveRoute(item.href)
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-light-text dark:text-dark-text hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-light-border dark:border-dark-border">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActiveRoute(item.href)
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}