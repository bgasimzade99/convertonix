import React from 'react'
import { Link } from 'react-router-dom'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'
import Footer from '../components/Footer'

function Privacy() {
  return (
    <div className="privacy-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">Privacy Policy</span>
          </h1>
          <p className="hero-subtitle">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content-section">
        <div className="container legal-container">
          <div className="legal-content">
            
            <div className="legal-section">
              <h2 className="legal-heading">1. Introduction</h2>
              <p className="legal-text">
                At Convertonix ("we", "us", "our", or "Service"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered file conversion service. Please read this Privacy Policy carefully.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">2. File Storage and Processing</h2>
              <p className="legal-text">
                Convertonix is designed with privacy in mind. Files uploaded for conversion are processed using our AI-powered conversion technology. Files are not stored permanently on our servers and are automatically deleted after processing is complete, typically within minutes. We do not retain copies of your converted files, and we do not access or view the contents of your files except as necessary to perform the conversion service you request.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">3. Information We Collect</h2>
              <p className="legal-text">We collect minimal information necessary to provide and improve our service:</p>
              
              <h3 className="legal-subheading">3.1. Information You Provide</h3>
              <ul className="legal-list">
                <li>Account information: If you create an account, we collect your email address and subscription status</li>
                <li>Communication data: When you contact us, we collect the information you provide in your messages</li>
              </ul>

              <h3 className="legal-subheading">3.2. Automatically Collected Information</h3>
              <ul className="legal-list">
                <li>Usage data: Basic information about how you use the Service (e.g., conversion types, errors, features accessed)</li>
                <li>Technical information: Browser type and version, device information, IP address (anonymized), operating system</li>
                <li>Log data: Standard server logs including access times, pages viewed, and error logs</li>
              </ul>

              <p className="legal-text">
                <strong>We do not collect or store:</strong> The contents of files you convert, personal information extracted from within your files, or any sensitive data beyond what is necessary to operate the Service.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">4. How We Use Your Information</h2>
              <p className="legal-text">We use the information we collect to:</p>
              <ul className="legal-list">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process your file conversion requests</li>
                <li>Manage your account and subscription</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you service-related communications (e.g., account updates, security alerts)</li>
                <li>Analyze usage patterns to improve our Service and user experience</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">5. Payment Information</h2>
              <p className="legal-text">
                Convertonix does not store or process payment card information directly. All payments are processed by Paddle Market Ltd. ("Paddle"), which acts as our merchant of record. Payment data, including credit card numbers, billing addresses, and other payment information, is handled securely by Paddle in accordance with their privacy policy and PCI-DSS compliance standards. We only receive non-sensitive information from Paddle about your subscription status and purchase history (e.g., subscription plan, payment status, transaction dates).
              </p>
              <p className="legal-text">
                For more information about how Paddle handles your payment information, please review <a href="https://paddle.com/privacy" target="_blank" rel="noopener noreferrer" className="legal-link">Paddle's Privacy Policy</a>.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">6. Data Sharing and Disclosure</h2>
              <p className="legal-text">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="legal-list">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who perform services on our behalf (e.g., hosting, analytics, payment processing through Paddle), subject to confidentiality agreements</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, regulation, legal process, or government request</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
              </ul>
              <p className="legal-text">
                We may share anonymized, aggregated usage statistics for service improvement purposes, but this data cannot be used to identify individual users.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">7. Data Security</h2>
              <p className="legal-text">
                We implement appropriate technical and organizational measures to protect your information, including encryption in transit (HTTPS/TLS) and secure data storage practices. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security. You use the Service at your own risk, and you are responsible for taking reasonable precautions to protect your account credentials.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">8. Your Rights</h2>
              <p className="legal-text">Depending on your location, you may have certain rights regarding your personal data, including:</p>
              <ul className="legal-list">
                <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data for certain purposes</li>
                <li><strong>Right to Restrict Processing:</strong> Request restriction of processing your personal data</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing where consent is the legal basis</li>
              </ul>
              <p className="legal-text">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">9. Cookies and Tracking Technologies</h2>
              <p className="legal-text">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data that are stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">10. Children's Privacy</h2>
              <p className="legal-text">
                Our Service is not intended for individuals under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">11. International Data Transfers</h2>
              <p className="legal-text">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our Service, you consent to the transfer of your information to these countries.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">12. Changes to This Privacy Policy</h2>
              <p className="legal-text">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Material changes will be communicated to you via email or through a notice on our Service. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">13. Contact Us</h2>
              <p className="legal-text">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <p className="legal-contact">
                <strong>Email:</strong> <a href="mailto:bgdevofficial@gmail.com" className="legal-link">bgdevofficial@gmail.com</a>
              </p>
            </div>

            <div className="legal-links">
              <Link to="/terms" className="legal-link-btn">Terms of Service</Link>
              <Link to="/refund" className="legal-link-btn">Refund Policy</Link>
            </div>

          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Privacy
