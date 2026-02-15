'use client'

import { useRouter } from 'next/navigation'
import {
  UserCheck,
  Shield,
  TrendingUp,
  FileCheck,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const benefits = [
  {
    title: 'Reach more clients',
    description: 'Get discovered by customers looking for legal, business, and compliance services.',
    icon: Users,
  },
  {
    title: 'Verified profile',
    description: 'Build trust with a verified SnapLegal provider badge and transparent reviews.',
    icon: Shield,
  },
  {
    title: 'Simple workflow',
    description: 'Manage orders, payments, and delivery through one platform.',
    icon: FileCheck,
  },
  {
    title: 'Grow your practice',
    description: 'Scale your consultancy with steady demand and clear pricing.',
    icon: TrendingUp,
  },
]

export default function BecomeProviderPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Become a Service Provider
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Join SnapLegal as a verified consultant. List your services, reach more clients, and manage orders in one place—whether you&apos;re a lawyer, CA, or compliance professional.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why join as a provider?
            </h2>
          </div>
          <p className="text-gray-600 mb-10 text-sm sm:text-base">
            Are you a lawyer, CA, or consultant? List your services on SnapLegal and serve customers who need legal, business, immigration, property, vehicle, or tax-related help. Get verified, set your pricing, and manage orders in one place.
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
            Why work with SnapLegal?
          </h2>
          <p className="text-gray-600 mb-8">
            We connect verified professionals with customers who need reliable, transparent legal and compliance services.
          </p>
          <ul className="space-y-4 text-left max-w-xl mx-auto">
            {[
              'Verified platform trusted by individuals and businesses',
              'Clear pricing and delivery timelines for every service',
              'Secure payments and order tracking',
              'Dedicated support for providers',
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
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Apply now and start serving customers through SnapLegal.
          </p>
          <Button
            onClick={() => router.push('/vendor')}
            className="bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto"
          >
            Apply as provider
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
