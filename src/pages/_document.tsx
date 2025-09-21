import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component for Next.js
 * Configures the HTML structure and meta tags
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#40CFFF" />
        <meta name="msapplication-TileColor" content="#40CFFF" />
        
        {/* Prevent zooming on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* Load critical fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Fallback for font loading */}
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </Head>
      <body>
        {/* Prevent FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}