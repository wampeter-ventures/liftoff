/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize for static export if needed
  trailingSlash: true,
  
  // Ensure proper handling of game assets
  images: {
    unoptimized: true,
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