'use client'

import Link from 'next/link'
import {
  HelpCircle,
  BookOpen,
  CreditCard,
  User,
  MessageCircle,
  FileQuestion,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const helpSections = [
  {
    title: 'Getting started',
    description: 'New to SnapLegal? Learn how to find and book the right service.',
    icon: BookOpen,
    links: [
      { label: 'How SnapLegal Works', href: '/how-it-works' },
      { label: 'Browse all services', href: '/all-services' },
      { label: 'Corporate services', href: '/corporate-services' },
    ],
  },
  {
    title: 'Booking & orders',
    description: 'Manage your bookings, track delivery, and understand timelines.',
    icon: FileQuestion,
    links: [
      { label: 'FAQ – booking & delivery', href: '/faq' },
      { label: 'Contact Sales', href: '/contact-sales' },
    ],
  },
  {
    title: 'Payments',
    description: 'Payment methods, refunds, and billing questions.',
    icon: CreditCard,
    links: [
      { label: 'FAQ – payments', href: '/faq' },
      { label: 'Contact us for billing', href: '/contact-sales' },
    ],
  },
  {
    title: 'Account & security',
    description: 'Sign in, sign up, and keep your account secure.',
    icon: User,
    links: [
      { label: 'Sign in', href: '/signin' },
      { label: 'Create account', href: '/signup' },
      { label: 'FAQ – account', href: '/faq' },
    ],
  },
]

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20">
                <HelpCircle className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Help Center
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Find answers, guides, and support for using SnapLegal. We’re here to help you get things done.
            </p>
          </div>
        </div>
      </section>

      {/* Help topics */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            What do you need help with?
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Choose a topic below or reach out to our team.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {helpSections.map((section) => (
              <div
                key={section.title}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-[var(--color-primary)] hover:underline text-sm font-medium inline-flex items-center gap-1"
                          >
                            {link.label}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links: FAQ + Contact */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Quick links
            </h2>
            <p className="text-gray-600">
              Common questions and direct contact options.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[var(--color-primary)] hover:opacity-90 text-white">
              <Link href="/faq" className="inline-flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                SnapLegal FAQ
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10">
              <Link href="/contact-sales" className="inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Get in touch
            </h2>
            <p className="text-gray-600">
              Prefer to talk? Reach us by phone, email, or visit our office.
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

      <Footer />
    </div>
  )
}
