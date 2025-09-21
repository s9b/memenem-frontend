import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

/**
 * Custom App component for Next.js
 * Configures theme provider and global layout
 */
export default function App({ Component, pageProps }: AppProps) {
  // Check for backend connectivity on app load
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/v1/status');
        if (response.ok) {
          console.log('✅ Backend connected');
        } else {
          console.warn('⚠️ Backend not responding properly');
        }
      } catch (error) {
        console.warn('⚠️ Backend connection failed:', error);
      }
    };

    checkBackend();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}