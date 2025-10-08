# Convertonix - Professional AI File Converter 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org/)

> **Professional file converter with AI-powered features - Solid as a rock, fast as lightning**

Convert any file format instantly with AI assistance. Generate documents with AI chat, then convert them to any format. Privacy-first - all processing happens in your browser.

🌐 **Visit:** [convertonix.com](https://convertonix.com)

## Features

### 🎯 File Conversions
- **PDF**: Convert to/from Word, Excel, Images, Text
- **Images**: JPG, PNG, WebP, HEIC, GIF, BMP, SVG
- **Documents**: Word (DOCX), Excel (XLSX), PowerPoint
- **Videos**: MP4, WebM, AVI, MOV (coming soon)
- **Audio**: MP3, WAV, OGG, M4A (coming soon)

### 🤖 AI-Powered Features
- **Smart OCR**: Extract text from images and PDFs with high accuracy
- **AI Enhancement**: Automatically improve image quality with AI upscaling
- **Document Summarization**: Get AI-generated summaries of documents
- **Smart Compression**: AI-optimized file compression for best quality/size ratio
- **Auto Format Detection**: Automatically detect and suggest best format

### 🔒 Privacy-First
- All conversions happen **in your browser**
- No files uploaded to servers
- Your data never leaves your device
- Open-source and transparent

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **TensorFlow.js** - AI/ML in the browser
- **Tesseract.js** - OCR engine
- **pdf.js** - PDF processing
- **Sharp** (via WASM) - Image processing

### Backend (Optional - for advanced features)
- **Node.js + Express** - REST API
- **Sharp** - Server-side image processing
- **pdf-lib** - PDF manipulation
- **Hugging Face Inference** - Advanced AI models

### AI Libraries
- **Tesseract.js** - OCR (Optical Character Recognition)
- **TensorFlow.js** - Machine Learning
- **Hugging Face** - NLP models for summarization

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/file-converter-suite.git
cd file-converter-suite
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies (optional)
cd server
npm install
cd ..
```

3. **Configure environment variables**
```bash
# Copy example env file
cp server/.env.example server/.env

# Edit .env and add your API keys (optional)
# HUGGINGFACE_API_KEY for advanced AI features
```

4. **Run the application**

**Option 1: Frontend only (Privacy-first mode)**
```bash
npm run dev
```
Open http://localhost:3000

**Option 2: Full stack (with backend AI features)**
```bash
npm run dev:full
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. **Upload a file** - Drag & drop or click to browse
2. **Choose target format** - Select from available conversion options
3. **Enable AI features** (optional)
   - ✅ Smart OCR - Extract text
   - ✅ AI Enhancement - Improve quality
   - ✅ Summarization - Get AI summary
   - ✅ Smart Compression - Optimize size
4. **Convert** - Processing happens instantly in your browser
5. **Download** - Get your converted file

## Pricing Model

### Free Tier
- 2 conversions per day
- All formats supported
- Basic AI features
- Privacy-first processing

### Premium ($4.99/month)
- ✅ Unlimited conversions
- ✅ All formats
- ✅ Advanced AI features
- ✅ Priority processing
- ✅ Batch conversions
- ✅ No watermarks

### Pay as You Go ($0.99/conversion)
- One-time purchase
- No subscription
- All features included

## Architecture

### Client-Side Processing
Most conversions happen entirely in the browser using:
- **Canvas API** - Image manipulation
- **Web Workers** - Background processing
- **WASM** - High-performance computation
- **IndexedDB** - Temporary storage

### Server-Side (Optional)
For advanced features only:
- Heavy PDF processing
- Batch conversions
- AI model inference (large models)

## API Documentation

### Conversion Endpoints

#### POST /api/convert/image
Convert image formats
```bash
curl -X POST http://localhost:5000/api/convert/image \
  -F "file=@input.jpg" \
  -F "targetFormat=png" \
  -F "quality=90" \
  -F "enhance=true"
```

#### POST /api/ai/summarize
Summarize text using AI
```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your long text here...", "maxLength": 150}'
```

## Development

### Build for production
```bash
npm run build
```

### Run production build
```bash
npm run preview
```

### Project Structure
```
file-converter-suite/
├── src/
│   ├── components/       # React components
│   ├── utils/           # Conversion utilities
│   │   ├── converter.js      # Main converter
│   │   ├── imageConverter.js # Image conversions
│   │   ├── pdfConverter.js   # PDF conversions
│   │   ├── aiOcr.js          # OCR engine
│   │   ├── aiEnhance.js      # AI enhancement
│   │   └── aiSummarize.js    # Summarization
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── server/              # Backend (optional)
│   ├── routes/          # API routes
│   └── index.js         # Server entry
├── public/              # Static assets
└── package.json
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Please read our contributing guidelines.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for commercial purposes.

## Roadmap

- [ ] Video format conversions
- [ ] Audio format conversions
- [ ] Batch conversion support
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] Advanced PDF editing
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Desktop app (Electron)

## Support

- 📧 Email: support@fileconverter.ai
- 💬 Discord: [Join our community]
- 🐛 Issues: [GitHub Issues]

## Market Analysis

### Opportunity
- **Search Volume**: 5M+ monthly searches for "pdf to word" alone
- **Competition**: CloudConvert, Zamzar, Adobe Acrobat
- **Differentiator**: Privacy-first + AI-powered + Free tier

### Why This Works
✅ Everyone needs file conversion regularly
✅ Privacy concerns with existing solutions
✅ AI features add unique value
✅ Freemium model proven to work
✅ SEO-friendly (high search volume)

### Revenue Potential
- Free users → Premium conversion: 2-5%
- Premium churn: ~3% monthly
- LTV: $50-100 per premium user

## Credits

Built with ❤️ using:
- React + Vite
- TensorFlow.js
- Tesseract.js
- pdf.js
- Sharp
- Hugging Face

---

**🔒 Privacy-First | 🤖 AI-Powered | ⚡ Lightning Fast**

