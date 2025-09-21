'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle component for switching between light and dark themes
 * Uses next-themes for theme management with smooth transitions
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <button className="w-10 h-10 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <span className="sr-only">Loading theme toggle</span>
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {/* Sun icon for light mode */}
      <Sun 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-yellow-500 transition-all duration-300 ${
          theme === 'light' 
            ? 'rotate-0 scale-100 opacity-100' 
            : 'rotate-90 scale-0 opacity-0'
        }`}
      />
      
      {/* Moon icon for dark mode */}
      <Moon 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : 'rotate-90 scale-0 opacity-0'
        }`}
      />

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
}