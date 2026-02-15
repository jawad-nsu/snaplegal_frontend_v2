'use client'

import Link from 'next/link'
import {
  Building2,
  Shield,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const benefits = [
  {
    title: 'White-label options',
    description: 'Offer SnapLegal services under your brand or alongside your existing offerings.',
    icon: Building2,
  },
  {
    title: 'Bulk & corporate clients',
    description: 'Serve businesses and institutions with volume orders and dedicated support.',
    icon: Users,
  },
  {
    title: 'Revenue share',
    description: 'Earn through referrals and ongoing partnerships with transparent terms.',
    icon: TrendingUp,
  },
  {
    title: 'Dedicated support',
    description: 'Partner success team to help you onboard and grow the relationship.',
    icon: Shield,
  },
]

export default function PartnerAgencyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Partner as Agency
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Law firms, consultancies, and agencies—partner with SnapLegal to offer our services to your clients. Scale with our catalog, support, and delivery, white-label or co-branded.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why partner with us?
            </h2>
          </div>
          <p className="text-gray-600 mb-10 text-sm sm:text-base">
            Law firms, consultancies, and agencies can partner with SnapLegal to offer our services to their clients. Scale your practice with our catalog, support, and delivery—whether white-label or co-branded.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SnapLegal */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Why partner with SnapLegal?
          </h2>
          <p className="text-gray-600 mb-8">
            We work with agencies and firms to extend their service offerings with reliable, transparent legal and compliance delivery.
          </p>
          <ul className="space-y-4 text-left max-w-xl mx-auto">
            {[
              'Verified platform trusted by individuals and businesses',
              'Clear pricing and delivery timelines for every service',
              'Secure payments and order tracking',
              'Dedicated partner success support',
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl border border-gray-100 shadow-md p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Ready to partner?
          </h2>
          <p className="text-gray-600 mb-6">
            Get in touch with our team to discuss an agency partnership.
          </p>
          <Link href="/contact-sales">
            <Button
              variant="outline"
              className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 font-semibold px-8 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto"
            >
              Contact for partnership
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
