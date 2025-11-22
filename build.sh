#!/bin/bash

# Simple build script for Netlify
# This static site doesn't need building, but we prepare the publish directory

echo "Preparing static site for deployment..."

# Create _site directory
mkdir -p _site

# Copy HTML, CSS, JS, and assets
cp -r index.html _site/ 2>/dev/null || true
cp -r css _site/ 2>/dev/null || true
cp -r js _site/ 2>/dev/null || true
cp -r images _site/ 2>/dev/null || true
cp -r font-awesome _site/ 2>/dev/null || true
cp -r fonts _site/ 2>/dev/null || true

echo "Build complete! Static site ready in _site/"
ls -la _site/
