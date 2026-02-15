'use client'

import Link from 'next/link'
import {
  MessageCircle,
  Users,
  BookOpen,
  Calendar,
  ArrowRight,
  Share2,
  Lightbulb,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

const communityFeatures = [
  {
    title: 'Discussions & Q&A',
    description:
      'Connect with fellow consultants and professionals. Ask questions, share experiences, and get advice on legal, business, and government-related services.',
    icon: MessageCircle,
  },
  {
    title: 'Resources & Guides',
    description:
      'Access guides, templates, and best practices to deliver better services and grow your practice with SnapLegal.',
    icon: BookOpen,
  },
  {
    title: 'Events & Webinars',
    description:
      'Join workshops and sessions on compliance, new regulations, and industry updates—stay ahead in your field.',
    icon: Calendar,
  },
  {
    title: 'Networking',
    description:
      'Build your network with verified providers, agencies, and SnapLegal partners across Bangladesh.',
    icon: Users,
  },
]

const quickLinks = [
  { label: 'Become a Service Provider', href: '/become-provider', icon: Lightbulb },
  { label: 'Partner as Agency', href: '/partner-agency', icon: Share2 },
]

export default function CommunityHubPage() {
  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Community Hub
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              A place for consultants and professionals to connect, learn, and grow. Share knowledge, access resources, and stay updated with the SnapLegal community.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          What you can do here
        </h2>
        <p className="text-gray-600 text-center mb-10 sm:mb-14 max-w-xl mx-auto">
          Whether you are a provider, agency partner, or exploring—the Community Hub is for you.
        </p>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {communityFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Get started
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
          Join as a provider or partner to access the full community and grow with SnapLegal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
          <p className="text-gray-600 mb-6">
            Have questions or want to get in touch with the team? We’re here to help.
          </p>
          <Link href="/contact-sales">
            <Button className="bg-[var(--color-primary)] hover:opacity-90 text-white">
              Contact Sales
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
