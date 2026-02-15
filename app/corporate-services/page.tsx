'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Scale,
  FileCheck,
  Users,
  Shield,
  Clock,
  HeadphonesIcon,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const benefits = [
  {
    title: 'Dedicated account support',
    description: 'A single point of contact for your company’s legal and compliance needs.',
    icon: HeadphonesIcon,
  },
  {
    title: 'Bulk & recurring services',
    description: 'Company registrations, compliance, contracts, and more at scale with transparent pricing.',
    icon: Building2,
  },
  {
    title: 'Verified legal partners',
    description: 'Access our network of vetted consultants for corporate legal and business affairs.',
    icon: Scale,
  },
  {
    title: 'Faster delivery',
    description: 'Priority handling and predictable timelines for corporate orders.',
    icon: Clock,
  },
  {
    title: 'Compliance & documentation',
    description: 'Organized records and support for audits, filings, and renewals.',
    icon: FileCheck,
  },
  {
    title: 'Trusted by businesses',
    description: 'Secure processes and confidentiality for your corporate data.',
    icon: Shield,
  },
]

const useCases = [
  { name: 'Company registration & compliance', icon: Building2 },
  { name: 'Contracts & agreements', icon: FileCheck },
  { name: 'VAT, tax & regulatory filings', icon: FileCheck },
  { name: 'Employment & HR documentation', icon: Users },
  { name: 'IP & trademark', icon: Scale },
]

export default function CorporateServicesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Corporate Services
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Legal, compliance, and business services for companies. One platform, dedicated support, and verified partners—so you can focus on running your business.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Why choose SnapLegal for your business
        </h2>
        <p className="text-gray-600 text-center mb-10 sm:mb-14 max-w-xl mx-auto">
          We help companies handle legal and government-related services efficiently and reliably.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-4 bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <benefit.icon className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we cover */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Services we offer for corporates
          </h2>
          <p className="text-gray-600 text-center mb-10">
            From registration to ongoing compliance—all in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-neutral)] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl border border-gray-100 shadow-md p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Get in touch with our team
          </h2>
          <p className="text-gray-600 mb-6">
            Tell us about your company’s needs and we’ll tailor a solution for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/contact-sales')}
              className="bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              asChild
              className="font-semibold px-8 py-3 rounded-lg border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            >
              <Link href="/all-services" className="inline-flex items-center gap-2">
                Browse all services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
