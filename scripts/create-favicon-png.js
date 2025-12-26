// Script to create PNG favicon from SVG
// This requires Node.js with sharp or canvas library
// Run: node scripts/create-favicon-png.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// SVG content for 96x96 PNG
const svgContent = `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="48" cy="48" r="45" fill="url(#faviconGradient)"/>
  
  <!-- Stylized "C" with conversion arrow -->
  <path d="M 48 30 Q 36 30 36 48 Q 36 66 48 66" 
        stroke="white" 
        stroke-width="7.5" 
        stroke-linecap="round" 
        fill="none"/>
  
  <!-- Arrow representing conversion/transformation -->
  <path d="M 60 42 L 72 48 L 60 54" 
        stroke="white" 
        stroke-width="6" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"/>
  
  <!-- Small sparkle -->
  <circle cx="66" cy="33" r="4.5" fill="white" opacity="0.9"/>
</svg>`

// SVG content for 64x64 PNG
const svgContent64 = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="32" cy="32" r="30" fill="url(#faviconGradient)"/>
  
  <!-- Stylized "C" with conversion arrow -->
  <path d="M 32 20 Q 24 20 24 32 Q 24 44 32 44" 
        stroke="white" 
        stroke-width="5" 
        stroke-linecap="round" 
        fill="none"/>
  
  <!-- Arrow representing conversion/transformation -->
  <path d="M 40 28 L 48 32 L 40 36" 
        stroke="white" 
        stroke-width="4" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"/>
  
  <!-- Small sparkle -->
  <circle cx="44" cy="22" r="3" fill="white" opacity="0.9"/>
</svg>`

async function createPNGFavicon() {
  try {
    // Try to use sharp if available
    let sharp
    try {
      sharp = (await import('sharp')).default
    } catch (e) {
      console.log('⚠️ Sharp not available. Creating SVG files for manual conversion.')
      console.log('📝 Instructions:')
      console.log('1. Go to https://cloudconvert.com/svg-to-png or similar tool')
      console.log('2. Convert the SVG files to PNG: 96x96 and 64x64')
      console.log('3. Save as favicon.png (96x96) and favicon-64.png (64x64) in public/ folder')
      
      // Write SVG files for manual conversion
      const publicDir = path.join(__dirname, '..', 'public')
      fs.writeFileSync(path.join(publicDir, 'favicon-96-temp.svg'), svgContent)
      fs.writeFileSync(path.join(publicDir, 'favicon-64-temp.svg'), svgContent64)
      console.log('\n✅ Created favicon-96-temp.svg and favicon-64-temp.svg in public/')
      console.log('   Convert these to PNG and rename to favicon.png and favicon-64.png')
      return
    }

    // Convert SVG to PNG using sharp
    const publicDir = path.join(__dirname, '..', 'public')
    
    // Create 96x96 PNG
    const png96 = await sharp(Buffer.from(svgContent))
      .resize(96, 96)
      .png()
      .toBuffer()
    
    fs.writeFileSync(path.join(publicDir, 'favicon.png'), png96)
    console.log('✅ Created favicon.png (96x96)')
    
    // Create 64x64 PNG
    const png64 = await sharp(Buffer.from(svgContent64))
      .resize(64, 64)
      .png()
      .toBuffer()
    
    fs.writeFileSync(path.join(publicDir, 'favicon-64.png'), png64)
    console.log('✅ Created favicon-64.png (64x64)')
    
    console.log('\n✅ PNG favicons created successfully!')
    console.log('📌 Files are in public/ folder and will be served from root (/)')
  } catch (error) {
    console.error('❌ Error creating PNG favicons:', error.message)
    console.log('\n📝 Manual conversion instructions:')
    console.log('1. Visit https://cloudconvert.com/svg-to-png')
    console.log('2. Upload public/favicon.svg')
    console.log('3. Set size to 96x96 for favicon.png and 64x64 for favicon-64.png')
    console.log('4. Download and place in public/ folder')
  }
}

createPNGFavicon()

