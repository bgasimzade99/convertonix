import React from 'react'
import { Link } from 'react-router-dom'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'
import Footer from '../components/Footer'

function Refund() {
  return (
    <div className="privacy-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">Refund Policy</span>
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
              <h2 className="legal-heading">1. Overview</h2>
              <p className="legal-text">
                At Convertonix, we want you to be satisfied with our service. This Refund Policy explains our refund procedures and eligibility criteria for Convertonix subscriptions and purchases. All refunds are processed by Paddle Market Ltd. ("Paddle"), which acts as our merchant of record.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">2. Payment Processing</h2>
              <p className="legal-text">
                All payments for Convertonix subscriptions and services are processed by Paddle Market Ltd. ("Paddle"), which acts as our merchant of record. Paddle handles all payment transactions, refund processing, and customer billing inquiries. By making a purchase, you agree to Paddle's terms and conditions and refund policy.
              </p>
              <p className="legal-text">
                For more information about Paddle's refund policy, please visit <a href="https://paddle.com/support/refund-policy" target="_blank" rel="noopener noreferrer" className="legal-link">Paddle's Refund Policy</a>.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">3. Refund Eligibility</h2>
              <p className="legal-text">
                <strong>We have a mandatory refund policy with a minimum guarantee of 14 days from the date of purchase.</strong> Refund eligibility is determined by Paddle in accordance with their refund policy, which meets or exceeds our 14-day minimum guarantee. Generally, refunds may be available under the following circumstances:
              </p>
              
              <h3 className="legal-subheading">3.1. Subscription Refunds</h3>
              <ul className="legal-list">
                <li><strong>Minimum 14-day guarantee:</strong> All subscription purchases are eligible for a full refund if requested within at least 14 days from the date of purchase or renewal</li>
                <li>Refund requests must be made within the applicable timeframe (minimum 14 days, as determined by Paddle's policy)</li>
                <li>Eligibility may vary depending on the type of subscription (monthly, yearly, or promotional plans)</li>
                <li>Refunds are generally provided on a pro-rated basis for unused portions of the subscription period</li>
              </ul>

              <h3 className="legal-subheading">3.2. One-Time Purchases</h3>
              <ul className="legal-list">
                <li><strong>Minimum 14-day guarantee:</strong> All one-time purchases are eligible for a full refund if requested within at least 14 days from the date of purchase</li>
                <li>One-time purchases may be eligible for refunds if requested within the timeframe specified by Paddle's policy (minimum 14 days)</li>
                <li>Eligibility depends on the nature of the purchase and Paddle's refund criteria</li>
              </ul>

              <h3 className="legal-subheading">3.3. Non-Refundable Items</h3>
              <ul className="legal-list">
                <li>Services that have been fully consumed or used may not be eligible for refunds</li>
                <li>Promotional or discounted purchases may have different refund terms</li>
                <li>Refunds are generally not available for purchases made more than a specified period ago (as determined by Paddle)</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">4. How to Request a Refund</h2>
              <p className="legal-text">To request a refund, you can take one of the following approaches:</p>
              
              <h3 className="legal-subheading">Option 1: Contact Paddle Directly</h3>
              <ul className="legal-list">
                <li>Visit Paddle's customer support portal or help center</li>
                <li>Use the email or contact information provided in your purchase receipt</li>
                <li>Include your purchase reference number and reason for the refund request</li>
              </ul>

              <h3 className="legal-subheading">Option 2: Contact Convertonix Support</h3>
              <ul className="legal-list">
                <li>Contact us at <a href="mailto:bgdevofficial@gmail.com" className="legal-link">bgdevofficial@gmail.com</a> with your refund request</li>
                <li>Include your purchase reference number, email address used for purchase, and reason for the refund</li>
                <li>We will assist you with your refund request and coordinate with Paddle on your behalf</li>
              </ul>

              <p className="legal-text">
                <strong>Important:</strong> All refund requests are ultimately processed by Paddle, and their refund policy and terms apply. Convertonix can facilitate refund requests but cannot override Paddle's refund policy.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">5. Refund Processing Time</h2>
              <p className="legal-text">
                Once a refund is approved by Paddle, processing times vary depending on several factors:
              </p>
              <ul className="legal-list">
                <li><strong>Payment Method:</strong> Refunds to credit/debit cards typically take 5-10 business days</li>
                <li><strong>Financial Institution:</strong> Your bank or payment provider may require additional processing time</li>
                <li><strong>Payment Processor:</strong> Processing times may vary based on Paddle's processing schedule</li>
              </ul>
              <p className="legal-text">
                Refunds will be credited to the original payment method used for the purchase. If the original payment method is no longer available, please contact Paddle or our support team for assistance.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">6. Cancellation vs. Refund</h2>
              <p className="legal-text">
                <strong>Cancellation:</strong> You can cancel your subscription at any time through your account settings or by contacting us. Cancellation will prevent future charges but does not automatically entitle you to a refund for the current billing period.
              </p>
              <p className="legal-text">
                <strong>Refund:</strong> A refund is a return of payment for a purchase you have already made. Refund eligibility is determined by Paddle's refund policy and the circumstances of your request.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">7. Disputed Charges</h2>
              <p className="legal-text">
                If you believe you have been charged incorrectly or have a dispute about a charge, please contact us immediately at <a href="mailto:bgdevofficial@gmail.com" className="legal-link">bgdevofficial@gmail.com</a> or contact Paddle directly. We will work with you and Paddle to resolve the issue promptly.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">8. Changes to This Refund Policy</h2>
              <p className="legal-text">
                We may update this Refund Policy from time to time. Changes will be effective immediately upon posting to this page, and we will update the "Last updated" date accordingly. Material changes will be communicated to you via email or through a notice on our Service. Your continued use of the Service after changes are posted constitutes your acceptance of the updated policy.
              </p>
            </div>

            <div className="legal-section">
              <h2 className="legal-heading">9. Contact Us</h2>
              <p className="legal-text">
                If you have questions about refunds, need assistance with a refund request, or have concerns about a charge, please contact us:
              </p>
              <p className="legal-contact">
                <strong>Email:</strong> <a href="mailto:bgdevofficial@gmail.com" className="legal-link">bgdevofficial@gmail.com</a>
              </p>
              <p className="legal-text">
                For direct inquiries about payment processing or Paddle's refund policy, please contact Paddle's customer support directly.
              </p>
            </div>

            <div className="legal-links">
              <Link to="/terms" className="legal-link-btn">Terms of Service</Link>
              <Link to="/privacy" className="legal-link-btn">Privacy Policy</Link>
            </div>

          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Refund
