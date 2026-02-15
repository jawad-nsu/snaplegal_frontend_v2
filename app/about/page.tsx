'use client'

import { useRouter } from 'next/navigation'
import {
  Scale,
  Building2,
  Shield,
  Clock,
  Target,
  Users,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const values = [
  {
    title: 'Transparency',
    description: 'Clear pricing and delivery times so you know what to expect.',
    icon: Scale,
  },
  {
    title: 'Trust',
    description: 'Verified consultants and professionals you can rely on.',
    icon: Shield,
  },
  {
    title: 'Speed',
    description: 'Many services delivered same day or within hours.',
    icon: Clock,
  },
  {
    title: 'Simplicity',
    description: 'One platform for legal, business, and government-related services.',
    icon: Building2,
  },
]

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              About SnapLegal
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Your personal consultant in a snap. We make legal and government-related services simple, transparent, and accessible across Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Who we are
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            SnapLegal is a one-stop platform for legal, business, immigration, property, vehicle, and tax services in Bangladesh. We connect individuals and businesses with verified consultants and professionals—so you can get the right service at a fair price, without the hassle.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Whether you need a legal document, business registration, visa support, or help with land or vehicle paperwork, SnapLegal brings multiple service categories under one roof with transparent pricing and quick delivery.
          </p>
        </div>
      </section>

      {/* Our values */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            What we stand for
          </h2>
          <p className="text-gray-600 text-center mb-10">
            We’re built on transparency, trust, and simplicity.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((item) => (
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

      {/* Mission */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
              <Target className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To make legal and government-related services accessible, affordable, and stress-free for everyone—so you can focus on what matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Contact / Location */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Get in touch
            </h2>
            <p className="text-gray-600">
              We’re here to help. Reach out anytime.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Office</p>
                <a
                  href="https://www.google.com/maps/place/SnapLegal/@23.7805327,90.4117023,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[var(--color-primary)] text-sm"
                >
                  22/B, Navana Tower, 45 Gulshan Avenue, Gulshan-1 Circle, Dhaka-1212
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <a href="tel:+8801304449988" className="text-gray-600 hover:text-[var(--color-primary)]">
                +88 0130 444 99 88
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <a href="mailto:hello@snaplegal.com.bd" className="text-gray-600 hover:text-[var(--color-primary)]">
                hello@snaplegal.com.bd
              </a>
            </div>
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
            Explore our services and book in minutes.
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
