'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function ContactSalesPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    mobile: '',
    company: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          email: formData.email,
          mobile: formData.mobile,
          profession: formData.company || undefined,
          initialDiscussion: formData.message || undefined,
          leadSource: 'Website',
          leadOwner: 'Sales',
          stage: 'New',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong')
        setStatus('error')
        return
      }
      setStatus('success')
      setFormData({ clientName: '', email: '', mobile: '', company: '', message: '' })
    } catch {
      setErrorMessage('Failed to send. Please try again or contact us directly.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Contact Sales
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Get in touch with our team for bulk orders, corporate services, or custom legal and compliance solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact options + Form */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Quick contact */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Reach us directly</h2>
            <p className="text-gray-600 text-sm">
              Prefer to talk? Use one of the options below.
            </p>
            <div className="space-y-4">
              <a
                href="mailto:hello@snaplegal.com.bd?subject=Sales%20inquiry"
                className="flex items-center gap-3 text-gray-700 hover:text-[var(--color-primary)] transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                </span>
                <span className="text-sm font-medium">hello@snaplegal.com.bd</span>
              </a>
              <a
                href="tel:+8801304449988"
                className="flex items-center gap-3 text-gray-700 hover:text-[var(--color-primary)] transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                </span>
                <span className="text-sm font-medium">+88 0130 444 99 88</span>
              </a>
              <a
                href="https://wa.me/8801304449988?text=Hello%2C%20I'm%20interested%20in%20sales%20or%20corporate%20services%20from%20SnapLegal."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-[var(--color-primary)] transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" />
                </span>
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </div>
            <div className="pt-4">
              <p className="text-gray-500 text-xs">
                22/B, Navana Tower, 45 Gulshan Avenue, Gulshan-1 Circle, Dhaka-1212
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <p className="text-gray-600 text-sm mb-6">
                Tell us about your needs and we’ll get back to you within 1–2 business days.
              </p>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 text-sm">
                  Thank you! We’ve received your message and will be in touch soon.
                </div>
              )}
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none text-gray-900"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none text-gray-900"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData((p) => ({ ...p, mobile: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none text-gray-900"
                    placeholder="+88 01XXX XXXXXX"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company (optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none text-gray-900"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none text-gray-900 resize-none"
                    placeholder="What services or volume are you interested in?"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? 'Sending…' : 'Send message'}
                  {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Looking for a single service? Browse our catalog or book directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Link href="/all-services">View all services</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="font-semibold px-8 py-3 rounded-lg border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            >
              <Link href="/corporate-services">Corporate services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
