# Favicon Setup for Google Search

## Current Status

✅ HTML updated with PNG priority and relative paths
✅ robots.txt allows favicon access
❌ PNG files need to be created

## Quick Setup (3 Steps)

### Step 1: Convert SVG to PNG

Use one of these free online tools:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/
- https://svgtopng.com/

### Step 2: Convert with Correct Sizes

Convert `public/favicon.svg` to PNG with these sizes:
- **96x96 px** → Save as `public/favicon.png` (PRIMARY for Google Search)
- **64x64 px** → Save as `public/favicon-64.png`

### Step 3: Verify

After conversion, verify files exist:
- `public/favicon.png` (96x96)
- `public/favicon-64.png` (64x64)

## Google Search Requirements ✅

- ✅ Format: PNG (not SVG)
- ✅ Size: 48x48+ (we use 64x64 and 96x96)
- ✅ Location: Root (`/favicon.png`)
- ✅ HTML Link: Relative path (`/favicon.png`)
- ✅ robots.txt: Not blocked

## After Setup

1. Build the project: `npm run build`
2. Verify in browser: Visit `https://convertonix.com/favicon.png`
3. Google Search Console: Request re-indexing of homepage
4. Wait 3 days - 3 weeks for Google to update favicon in search results

## Notes

- PNG is required for Google Search visibility
- SVG files are kept as fallback for modern browsers
- Relative paths (`/favicon.png`) are preferred over absolute URLs
- Favicon must be square (1:1 aspect ratio)

