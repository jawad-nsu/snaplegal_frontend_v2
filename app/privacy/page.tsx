'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/90">
              How SnapLegal collects, uses, and protects your personal information.
            </p>
            <p className="text-sm text-white/80 mt-2">
              Last updated: February 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-8 text-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              SnapLegal (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services in Bangladesh. By using SnapLegal, you consent to the practices described in this policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="leading-relaxed mb-3">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account and profile data:</strong> name, email address, phone number, and password when you register or sign in</li>
              <li><strong>Order and transaction data:</strong> service selections, payment details (e.g. bKash), delivery address, and documents you upload for your orders</li>
              <li><strong>Usage data:</strong> how you use our website (e.g. pages visited, device type, IP address, browser)</li>
              <li><strong>Communications:</strong> messages you send to us via email, WhatsApp, or contact forms</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, process, and deliver the services you request</li>
              <li>Manage your account and authenticate you</li>
              <li>Process payments and send order confirmations and updates</li>
              <li>Communicate with you about your orders and our services</li>
              <li>Improve our website, services, and user experience</li>
              <li>Comply with legal obligations and protect our rights</li>
              <li>Send marketing communications only if you have opted in (you may opt out at any time)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Sharing of Information</h2>
            <p className="leading-relaxed">
              We may share your information with: (a) service providers and consultants who help us deliver your orders (e.g. legal consultants, couriers); (b) payment processors (e.g. bKash) to complete transactions; (c) legal or regulatory authorities when required by law; and (d) other parties with your consent. We do not sell your personal information to third parties for their marketing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
            <p className="leading-relaxed">
              We use reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse. No method of transmission over the internet is completely secure; we cannot guarantee absolute security but we strive to protect your data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data subject to applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="leading-relaxed mb-3">
              Depending on applicable law, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct or update inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="leading-relaxed mt-3">
              To exercise these rights, contact us at{' '}
              <a href="mailto:hello@snaplegal.com.bd" className="text-[var(--color-primary)] hover:underline">
                hello@snaplegal.com.bd
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We may use cookies and similar technologies to remember your preferences, analyse site traffic, and improve our services. You can control cookies through your browser settings. Disabling some cookies may affect how the website works.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Third-Party Links</h2>
            <p className="leading-relaxed">
              Our website may contain links to third-party sites (e.g. payment gateways, social media). We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Children</h2>
            <p className="leading-relaxed">
              Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can delete it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the &quot;Last updated&quot; date. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
            <p className="leading-relaxed">
              For privacy-related questions or to exercise your rights, contact SnapLegal at{' '}
              <a href="mailto:hello@snaplegal.com.bd" className="text-[var(--color-primary)] hover:underline">
                hello@snaplegal.com.bd
              </a>
              , call +88 0130 444 99 88, or write to us at 22/B, Navana Tower, 45 Gulshan Avenue, Gulshan-1 Circle, Dhaka-1212, Bangladesh.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
