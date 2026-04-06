const fs = require('fs');
const path = require('path');

console.log('[v0] Starting cache cleanup...');

const cacheDir = path.join(__dirname, '../.next/cache');
const webpackCacheDir = path.join(__dirname, '../.next/cache/webpack');

try {
  // Remove webpack cache
  if (fs.existsSync(webpackCacheDir)) {
    fs.rmSync(webpackCacheDir, { recursive: true, force: true });
    console.log('[v0] Removed .next/cache/webpack');
  }

  // Remove entire cache dir
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('[v0] Removed .next/cache');
  }

  console.log('[v0] Cache cleanup completed successfully');
  process.exit(0);
} catch (error) {
  console.error('[v0] Error during cache cleanup:', error);
  process.exit(1);
}
