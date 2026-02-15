'use client'

import { useRouter } from 'next/navigation'
import {
  Search,
  ClipboardList,
  CreditCard,
  CheckCircle2,
  Scale,
  Building2,
  FileBadge,
  LandPlot,
  Car,
  Receipt,
  Shield,
  Clock,
  HeadphonesIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const steps = [
  {
    number: 1,
    title: 'Browse & find your service',
    description:
      'Explore legal, business, immigration, property, vehicle, and tax services. Use search or categories to find exactly what you need.',
    icon: Search,
  },
  {
    number: 2,
    title: 'Book or add to cart',
    description:
      'Choose your service, see transparent pricing and delivery time, and book now or add multiple services to your cart.',
    icon: ClipboardList,
  },
  {
    number: 3,
    title: 'Pay securely',
    description:
      'Check out with bKash or other payment options. Your payment is secure and you only pay for what you order.',
    icon: CreditCard,
  },
  {
    number: 4,
    title: 'Get your service',
    description:
      'Our verified partners deliver your service or consultation. Track your order and get support whenever you need it.',
    icon: CheckCircle2,
  },
]

const categories = [
  { name: 'Legal Services', icon: Scale },
  { name: 'Business Affairs', icon: Building2 },
  { name: 'Immigration', icon: FileBadge },
  { name: 'Land / Properties', icon: LandPlot },
  { name: 'Vehicle Licenses', icon: Car },
  { name: 'VAT / Tax', icon: Receipt },
]

const benefits = [
  {
    title: 'Transparent pricing',
    description: 'See starting prices and delivery times before you book.',
    icon: Receipt,
  },
  {
    title: 'Verified partners',
    description: 'Services delivered by vetted consultants and professionals.',
    icon: Shield,
  },
  {
    title: 'Quick delivery',
    description: 'Many services available within hours or same day.',
    icon: Clock,
  },
  {
    title: 'Support when you need it',
    description: 'Get help with bookings, orders, and follow-ups.',
    icon: HeadphonesIcon,
  },
]

export default function HowItWorksPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How SnapLegal Works
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Your personal consultant in a snap. One platform for legal, business, and government-related services—order any service, anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Four simple steps
        </h2>
        <p className="text-gray-600 text-center mb-10 sm:mb-14 max-w-xl mx-auto">
          From finding your service to getting it done—here’s how it works.
        </p>

        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-neutral)]">
                  <step.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What we cover */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            What we cover
          </h2>
          <p className="text-gray-600 text-center mb-10">
            SnapLegal brings multiple service categories under one roof.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-neutral)] flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose SnapLegal */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Why choose SnapLegal
          </h2>
          <p className="text-gray-600 text-center mb-10">
            We make legal and government-related services simple and reliable.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
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
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl border border-gray-100 shadow-md p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our services and book in minutes.
          </p>
          <Button
            onClick={() => router.push('/all-services')}
            className="bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg"
          >
            Explore all services
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
