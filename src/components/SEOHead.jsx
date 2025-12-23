import { Helmet } from 'react-helmet-async'

export function SEOHead({ 
  title = "AI-Powered File Converter - Convert 100+ Formats Instantly | Convertonix", 
  description = "AI-Powered Professional File Converter - Convert 100+ formats instantly. PDF to Word, images, videos & documents. 100% free, secure, privacy-first. Works in browser - no download required. The smartest way to convert files online.",
  keywords = "file converter, AI conversion, document converter, image converter, video converter, PDF converter, privacy-first",
  image = "/og-image.svg",
  url = "",
  type = "website"
}) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="BGDev" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Convertonix" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#4f46e5" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <link rel="apple-touch-icon" href="/logo.svg" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Convertonix",
          "description": description,
          "url": url,
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free tier with 3 conversions per day"
          },
          "creator": {
            "@type": "Organization",
            "name": "BGDev",
            "url": "https://bgdevofficial.com"
          },
          "featureList": [
            "AI-powered file conversion",
            "Document conversion",
            "Image processing",
            "Video conversion",
            "Privacy-first processing",
            "Batch conversion",
            "Real-time conversion"
          ]
        })}
      </script>
    </Helmet>
  )
}

export default SEOHead
