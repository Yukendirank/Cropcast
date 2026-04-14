#!/bin/bash
# Remove corrupted .next cache files
echo "Cleaning corrupted .next cache..."
rm -rf /vercel/share/v0-project/.next/cache/webpack || true
rm -rf /vercel/share/v0-project/.next/cache || true
echo "Cache cleaned successfully"
echo "Next.js will rebuild on the next start"
