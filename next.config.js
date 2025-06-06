/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize for static export if needed
  trailingSlash: true,
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  
  // Ensure proper handling of game assets
  images: {
    unoptimized: true,
  },
  
  // Rewrites to support PostHog ingestion and assets
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  
  // Custom webpack config for game-specific needs
  webpack: (config, { dev, isServer }) => {
    // Optimize for browser-based game
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
