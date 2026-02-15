'use client'

import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Heart,
  Zap,
  Users,
  MapPin,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const benefits = [
  {
    title: 'Growth & learning',
    description: 'Work on real problems and grow with a team that cares about your development.',
    icon: Zap,
  },
  {
    title: 'Inclusive culture',
    description: 'A collaborative environment where every voice matters.',
    icon: Users,
  },
  {
    title: 'Meaningful work',
    description: 'Help make legal and government services accessible across Bangladesh.',
    icon: Heart,
  },
]

export default function CareersPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]/30">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Careers at SnapLegal
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Join us in making legal and government-related services simple, transparent, and accessible for everyone in Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Why join us */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Why join SnapLegal
          </h2>
          <p className="text-gray-600 text-center mb-10">
            We’re building a team that values transparency, trust, and impact.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-4 bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
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

      {/* Open roles / We're hiring */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
              <Briefcase className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              We’re always looking for talent
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              We don’t have a formal list of open roles right now, but we’re always interested in hearing from people who want to help us simplify legal and government services. If that’s you, get in touch.
            </p>
          </div>
        </div>
      </section>

      {/* Get in touch */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Get in touch
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Send us your resume and a short note about what you’d like to do at SnapLegal.
          </p>

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
              <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <a href="mailto:hello@snaplegal.com.bd?subject=Career%20inquiry" className="text-gray-600 hover:text-[var(--color-primary)]">
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
            Ready to apply?
          </h2>
          <p className="text-gray-600 mb-6">
            Email us with your resume and we’ll get back to you.
          </p>
          <Button
            onClick={() => (window.location.href = 'mailto:hello@snaplegal.com.bd?subject=Career%20inquiry')}
            className="bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2"
          >
            Send an email
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
