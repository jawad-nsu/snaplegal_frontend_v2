'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-white/90">
              Please read these terms carefully before using SnapLegal services.
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
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing or using the SnapLegal website and services (the &quot;Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. SnapLegal (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates from Bangladesh and provides a platform connecting users with verified consultants for legal, business, immigration, property, vehicle, and related services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of the Platform</h2>
            <p className="leading-relaxed mb-3">
              You may use the Platform only for lawful purposes and in accordance with these terms. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate information when creating an account or placing orders</li>
              <li>Use services only for yourself or for entities you are authorised to represent</li>
              <li>Not misuse the Platform, including by circumventing security, scraping data, or interfering with other users</li>
              <li>Comply with applicable laws in Bangladesh and your jurisdiction</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Accounts and Registration</h2>
            <p className="leading-relaxed">
              You may need to register an account to book services. You are responsible for keeping your login details secure and for all activity under your account. You must notify us promptly of any unauthorised use.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Orders, Payment, and Refunds</h2>
            <p className="leading-relaxed mb-3">
              When you place an order, you agree to pay the stated price and any applicable fees. Payment may be collected via bKash or other methods we support. Refund and cancellation policies are described at checkout and may vary by service. We do not guarantee refunds except as required by law or as stated in our policies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Service Providers</h2>
            <p className="leading-relaxed">
              We connect you with third-party consultants and service providers. SnapLegal facilitates the connection and payment; the actual delivery of legal or other professional work may be performed by these providers. We strive to verify providers but do not guarantee outcomes of any particular matter. For legal advice, you should rely on your direct relationship with the consultant.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              The Platform, including its design, text, logos, and software, is owned by SnapLegal or its licensors. You may not copy, modify, or use our branding or content for commercial purposes without our written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimers</h2>
            <p className="leading-relaxed">
              The Platform and services are provided &quot;as is.&quot; We do not warrant that the Platform will be error-free or uninterrupted. We are not a law firm and do not provide legal advice. Outcomes of legal or government-related matters depend on many factors beyond our control.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the fullest extent permitted by law, SnapLegal and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or any service arranged through it. Our total liability shall not exceed the amount you paid for the relevant service in the twelve months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to Terms</h2>
            <p className="leading-relaxed">
              We may update these Terms of Service from time to time. We will post the updated terms on this page and update the &quot;Last updated&quot; date. Continued use of the Platform after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law and Contact</h2>
            <p className="leading-relaxed mb-3">
              These terms are governed by the laws of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
            </p>
            <p className="leading-relaxed">
              For questions about these terms, contact us at{' '}
              <a href="mailto:hello@snaplegal.com.bd" className="text-[var(--color-primary)] hover:underline">
                hello@snaplegal.com.bd
              </a>
              {' '}or call +88 0130 444 99 88.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
