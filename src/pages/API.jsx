import React, { useState } from 'react'
import { 
  Code, 
  Key, 
  Zap, 
  Shield, 
  BookOpen, 
  Copy, 
  CheckCircle,
  ArrowRight,
  Terminal,
  Globe,
  Database,
  Settings
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'

function API() {
  const [copiedCode, setCopiedCode] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/v1/convert",
      description: "Convert a file to another format",
      parameters: {
        file: "File to convert (multipart/form-data)",
        target_format: "Target format (string)",
        options: "Conversion options (object, optional)"
      }
    },
    {
      method: "GET",
      endpoint: "/api/v1/formats",
      description: "Get list of supported formats",
      parameters: {
        category: "Format category (string, optional)"
      }
    },
    {
      method: "POST",
      endpoint: "/api/v1/batch",
      description: "Convert multiple files at once",
      parameters: {
        files: "Array of files (multipart/form-data)",
        target_format: "Target format (string)",
        options: "Batch conversion options (object, optional)"
      }
    }
  ]

  const codeExamples = {
    curl: `curl -X POST "https://api.convertonix.com/v1/convert" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@document.pdf" \\
  -F "target_format=docx" \\
  -F "options={\\"quality\\": \\"high\\"}"`,

    javascript: `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('target_format', 'docx');
formData.append('options', JSON.stringify({ quality: 'high' }));

const response = await fetch('https://api.convertonix.com/v1/convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const result = await response.json();
console.log(result);`,

    python: `import requests

url = "https://api.convertonix.com/v1/convert"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

files = {"file": open("document.pdf", "rb")}
data = {
    "target_format": "docx",
    "options": '{"quality": "high"}'
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()
print(result)`
  }

  const pricingTiers = [
    {
      name: "Free Tier",
      requests: "100/month",
      price: "$0",
      features: [
        "Basic file conversions",
        "Standard formats",
        "Community support"
      ]
    },
    {
      name: "Developer",
      requests: "10,000/month",
      price: "$29",
      features: [
        "All file formats",
        "Batch processing",
        "Priority support",
        "Webhooks"
      ]
    },
    {
      name: "Business",
      requests: "100,000/month",
      price: "$99",
      features: [
        "Everything in Developer",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ]
    }
  ]

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  return (
    <div className="api-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="api-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">API Documentation</span>
            <br />
            Integrate Convertonix into Your App
          </h1>
          <p className="hero-subtitle">
            Powerful REST API for file conversion. Convert files programmatically 
            with our simple, secure, and scalable API.
          </p>
          
          <div className="api-badges">
            <div className="badge">
              <Shield size={20} />
              <span>Secure</span>
            </div>
            <div className="badge">
              <Zap size={20} />
              <span>Fast</span>
            </div>
            <div className="badge">
              <Globe size={20} />
              <span>Global</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="quick-start">
        <div className="container">
          <h2 className="section-title">Quick Start</h2>
          <div className="quick-start-content">
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Get API Key</h3>
                  <p>Sign up and get your free API key</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Make Request</h3>
                  <p>Send files to our conversion endpoint</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Get Results</h3>
                  <p>Receive converted files instantly</p>
                </div>
              </div>
            </div>
            
            <div className="api-key-section">
              <h3>Your API Key</h3>
              <div className="api-key-input">
                <input type="text" placeholder="Enter your API key" />
                <button className="btn-primary">Get API Key</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="api-endpoints">
        <div className="container">
          <h2 className="section-title">API Endpoints</h2>
          <div className="endpoints-list">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="endpoint-card">
                <div className="endpoint-header">
                  <span className={`method ${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                  <code className="endpoint-url">{endpoint.endpoint}</code>
                </div>
                <p className="endpoint-description">{endpoint.description}</p>
                <div className="endpoint-parameters">
                  <h4>Parameters:</h4>
                  <ul>
                    {Object.entries(endpoint.parameters).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="code-examples">
        <div className="container">
          <h2 className="section-title">Code Examples</h2>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Terminal size={20} />
              cURL
            </button>
            <button 
              className={`tab ${activeTab === 'javascript' ? 'active' : ''}`}
              onClick={() => setActiveTab('javascript')}
            >
              <Code size={20} />
              JavaScript
            </button>
            <button 
              className={`tab ${activeTab === 'python' ? 'active' : ''}`}
              onClick={() => setActiveTab('python')}
            >
              <Code size={20} />
              Python
            </button>
          </div>
          
          <div className="code-block">
            <div className="code-header">
              <span className="code-language">{activeTab}</span>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(codeExamples[activeTab], activeTab)}
              >
                {copiedCode === activeTab ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copiedCode === activeTab ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="code-content">
              <code>{codeExamples[activeTab]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="api-pricing">
        <div className="container">
          <h2 className="section-title">API Pricing</h2>
          <div className="pricing-grid">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`pricing-card ${tier.name === 'Developer' ? 'featured' : ''}`}>
                {tier.name === 'Developer' && (
                  <div className="popular-badge">Most Popular</div>
                )}
                <h3>{tier.name}</h3>
                <div className="price">
                  <span className="price-amount">{tier.price}</span>
                  <span className="price-period">/month</span>
                </div>
                <div className="requests">{tier.requests}</div>
                <ul className="features">
                  {tier.features.map((feature, idx) => (
                    <li key={idx}>
                      <CheckCircle size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${tier.name === 'Developer' ? 'btn-primary' : 'btn-outline'}`}>
                  {tier.name === 'Free Tier' ? 'Get Started' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Format */}
      <section className="response-format">
        <div className="container">
          <h2 className="section-title">Response Format</h2>
          <div className="response-example">
            <h3>Success Response</h3>
            <pre className="json-response">
{`{
  "success": true,
  "data": {
    "converted_file": "data:application/pdf;base64,JVBERi0xLjQK...",
    "filename": "converted_document.pdf",
    "size": 1024000,
    "format": "pdf"
  },
  "meta": {
    "processing_time": 1.2,
    "timestamp": "2025-01-27T10:30:00Z"
  }
}`}
            </pre>
          </div>
          
          <div className="response-example">
            <h3>Error Response</h3>
            <pre className="json-response">
{`{
  "success": false,
  "error": {
    "code": "INVALID_FORMAT",
    "message": "Unsupported target format",
    "details": "The requested format 'xyz' is not supported"
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="sdks">
        <div className="container">
          <h2 className="section-title">SDKs & Libraries</h2>
          <div className="sdks-grid">
            <div className="sdk-card">
              <Code size={32} />
              <h3>JavaScript SDK</h3>
              <p>Official JavaScript SDK for Node.js and browsers</p>
              <button className="btn-outline">View on GitHub</button>
            </div>
            <div className="sdk-card">
              <Code size={32} />
              <h3>Python SDK</h3>
              <p>Python library for easy integration</p>
              <button className="btn-outline">View on PyPI</button>
            </div>
            <div className="sdk-card">
              <Code size={32} />
              <h3>PHP SDK</h3>
              <p>PHP library for server-side integration</p>
              <button className="btn-outline">View on Packagist</button>
            </div>
          </div>
        </div>
      </section>
      
      <BackToTop />
    </div>
  )
}

export default API
