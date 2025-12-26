// Script to create PNG favicon from SVG using sharp
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// SVG content for 96x96 PNG
const svgContent96 = `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    // Get public directory (two levels up from server/)
    const publicDir = path.join(__dirname, '..', 'public')
    
    console.log('🔄 Creating PNG favicons from SVG...')
    
    // Create 96x96 PNG (primary favicon for Google Search)
    const png96 = await sharp(Buffer.from(svgContent96))
      .resize(96, 96, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer()
    
    fs.writeFileSync(path.join(publicDir, 'favicon.png'), png96)
    console.log('✅ Created favicon.png (96x96)')
    
    // Create 64x64 PNG
    const png64 = await sharp(Buffer.from(svgContent64))
      .resize(64, 64, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer()
    
    fs.writeFileSync(path.join(publicDir, 'favicon-64.png'), png64)
    console.log('✅ Created favicon-64.png (64x64)')
    
    console.log('\n✅ PNG favicons created successfully!')
    console.log('📌 Files are in public/ folder and will be served from root (/)')
    console.log('📌 Google Search will now be able to index the favicon properly!')
  } catch (error) {
    console.error('❌ Error creating PNG favicons:', error.message)
    process.exit(1)
  }
}

createPNGFavicon()

