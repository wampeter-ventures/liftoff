# Cache Busting for Liftoff PWA

This document explains how cache busting works in the Liftoff Progressive Web App to ensure users always get fresh content when the app is updated.

## How It Works

### 1. Automatic Cache Version Generation
- Each time you run `npm run build`, the `prebuild` script automatically generates a new service worker with a unique cache version
- Cache versions are timestamp-based (e.g., `v1749233313968`) ensuring uniqueness
- The service worker is generated from `scripts/generate-sw.js`

### 2. Service Worker Cache Management
- **Install**: New service worker caches core files with the new cache version
- **Activate**: Automatically deletes old cache versions to free up storage
- **Fetch**: Serves cached content but fetches fresh HTML pages on each request

### 3. Update Flow for Users
1. When a user opens the PWA after an update:
   - The new service worker is detected
   - An update notification appears (via `UpdateNotification` component)
   - User can choose to update immediately or later
   - After update, the app refreshes with fresh content

### 4. Key Files

- **`pages/_app.js`**: Service worker registration and update handling
- **`public/service-worker.js`**: Auto-generated service worker (DO NOT EDIT MANUALLY)
- **`scripts/generate-sw.js`**: Service worker generation script
- **`components/UpdateNotification.js`**: User-friendly update notification

### 5. Build Process

```bash
# Development (uses existing service worker)
npm run dev

# Production build (generates fresh service worker)
npm run build  # This runs "prebuild" first which generates new SW

# Manual service worker generation
npm run generate-sw
```

### 6. Cache Strategy

- **HTML Pages**: Network-first (always fetch fresh, fallback to cache if offline)
- **Static Assets**: Cache-first with background updates
- **API Routes**: Not cached (always from network)

## Testing Cache Busting

1. Build and deploy the app: `npm run build`
2. Install as PWA via "Add to Home Screen"
3. Make changes to your code
4. Build and deploy again: `npm run build`
5. Open the installed PWA - you should see an update notification

## Notes

- Cache busting only works in production builds (`NODE_ENV === 'production'`)
- The service worker file is auto-generated - never edit it manually
- Old caches are automatically cleaned up to prevent storage bloat
- Users get a friendly notification when updates are available 