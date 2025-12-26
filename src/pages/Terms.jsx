import React from 'react'
import { Link } from 'react-router-dom'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'
import Footer from '../components/Footer'

function Terms() {
  return (
    <div className="privacy-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">Terms of Service</span>
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
              <h2 className="legal-heading">1. Agreement to Terms</h2>
              <p className="legal-text">
                By accessing or using Convertonix ("Service", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">2. Description of Service</h2>
              <p className="legal-text">
                Convertonix is an AI-powered file conversion Software as a Service (SaaS) platform that enables users to convert files between various formats. The Service uses artificial intelligence and machine learning technologies to provide fast, accurate file conversions. Convertonix processes files through our conversion technology and does not permanently store user files.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">3. User Responsibilities</h2>
              <p className="legal-text">By using Convertonix, you agree and acknowledge that:</p>
              <ul className="legal-list">
                <li>You are solely responsible for any files you upload or process through the Service</li>
                <li>You will use the Service only for lawful purposes and in accordance with these Terms</li>
                <li>You will not use the Service to process, convert, or handle any illegal, copyrighted, harmful, or inappropriate content</li>
                <li>You own or have the necessary rights, licenses, and permissions to any files you convert through the Service</li>
                <li>You will not use the Service in any way that could damage, disable, overburden, or impair our servers or networks</li>
                <li>You will not attempt to gain unauthorized access to any portion of the Service</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">4. File Storage and Privacy</h2>
              <p className="legal-text">
                Convertonix is designed with privacy in mind. Files uploaded for conversion are processed using our AI-powered conversion technology and are not stored permanently on our servers. Files are automatically deleted after processing is complete. However, we cannot guarantee absolute security of files during processing, and you use the Service at your own risk. We recommend that you do not upload sensitive or confidential information unless you understand and accept these risks.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">5. Payment Processing</h2>
              <p className="legal-text">
                Payments for Convertonix subscriptions and services are processed by Paddle Market Ltd. ("Paddle"), which acts as our merchant of record. By making a purchase, you agree to Paddle's terms and conditions and privacy policy. Convertonix does not store or process payment card information directly. All payment data, including credit card information, is handled securely by Paddle in accordance with PCI-DSS compliance standards. We only receive information about your subscription status and purchase history from Paddle.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">6. Subscription and Cancellation</h2>
              <p className="legal-text">
                If you purchase a subscription, it will automatically renew at the end of each billing cycle unless you cancel before the renewal date. You can cancel your subscription at any time through your account settings or by contacting us. Cancellation will take effect at the end of the current billing period. No refunds will be provided for the current billing period upon cancellation.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">7. Service Disclaimer</h2>
              <p className="legal-text">
                Convertonix is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the Service will be uninterrupted, error-free, secure, or completely accurate. We are not liable for any loss or damage resulting from your use of the Service, including but not limited to data loss, file corruption, or conversion errors.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">8. Limitation of Liability</h2>
              <p className="legal-text">
                To the maximum extent permitted by applicable law, Convertonix, its operators, affiliates, and service providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="legal-list">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any errors or omissions in any content or for any loss or damage incurred as a result of your use of any content posted, transmitted, or otherwise made available through the Service</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">9. Intellectual Property</h2>
              <p className="legal-text">
                The Service and its original content, features, and functionality are owned by Convertonix and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not modify, reproduce, distribute, create derivative works of, publicly display, or otherwise exploit the Service or its content without our prior written permission.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">10. Termination</h2>
              <p className="legal-text">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">11. Changes to Terms</h2>
              <p className="legal-text">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">12. Governing Law</h2>
              <p className="legal-text">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Convertonix operates, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">13. Contact Information</h2>
              <p className="legal-text">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <p className="legal-contact">
                <strong>Email:</strong> <a href="mailto:bgdevofficial@gmail.com" className="legal-link">bgdevofficial@gmail.com</a>
              </p>
            </div>

            <div className="legal-links">
              <Link to="/privacy" className="legal-link-btn">Privacy Policy</Link>
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

export default Terms
