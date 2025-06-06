import '../styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';
import UpdateNotification from '../components/UpdateNotification';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Service Worker registration and update handling
    if (
      process.env.NODE_ENV === 'production' &&
      'serviceWorker' in navigator
    ) {
      let refreshing = false;

      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available - UpdateNotification component will handle the UI
                  console.log('New service worker available');
                }
              });
            }
          });

          // Handle controller change (when new SW takes control)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          });

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'RELOAD_APP') {
              if (!refreshing) {
                refreshing = true;
                window.location.reload();
              }
            }
          });

          console.log('Service Worker registered successfully');
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      registerSW();

      // Force update check on app focus (when user returns to app)
      const handleFocus = () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
        }
      };

      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, []);

  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>Liftoff - Build. Boost. Blast...or BOOM!</title>
        <meta name="description" content="A collaborative dice game where players work together to assemble rockets and reach for the stars. Will you launch to victory or explode in spectacular failure?" />
        <meta name="keywords" content="dice game, rocket, multiplayer, collaborative, space, board game" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Liftoff - Build. Boost. Blast...or BOOM!" />
        <meta property="og:description" content="A collaborative dice game where players work together to assemble rockets and reach for the stars." />
        <meta property="og:image" content="/rocket_big.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Liftoff - Build. Boost. Blast...or BOOM!" />
        <meta name="twitter:description" content="A collaborative dice game where players work together to assemble rockets and reach for the stars." />
        <meta property="twitter:image" content="/rocket_big.png" />

        {/* PWA & Mobile */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Cache busting for critical resources */}
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta name="pragma" content="no-cache" />
        <meta name="expires" content="0" />

        {/* External Resources */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <Component {...pageProps} />
      <UpdateNotification />
    </>
  );
}

export default MyApp;