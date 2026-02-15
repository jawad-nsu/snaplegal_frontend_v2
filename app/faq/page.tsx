'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    question: 'What is SnapLegal?',
    answer:
      'SnapLegal is a one-stop platform for legal and related services in Bangladesh. We connect you with verified consultants for legal services, business affairs, immigration, property, vehicle licenses, VAT/tax, and more—all with transparent pricing and quick delivery.',
  },
  {
    question: 'How do I book a service?',
    answer:
      'Browse our services by category or search, choose the service you need, see the starting price and delivery time, then click "Book Now" or add to cart. Complete payment securely (e.g. bKash) and our team or verified partners will deliver your service.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept bKash and other popular payment options in Bangladesh. Payment is processed securely at checkout. You only pay for what you order, with transparent pricing shown before you book.',
  },
  {
    question: 'How long does a service take?',
    answer:
      'Delivery times vary by service and are shown on each service page (e.g. same day, 2–4 hours, or a few days). You can track your order and get support via WhatsApp or our contact details if you have questions.',
  },
  {
    question: 'Where is SnapLegal located?',
    answer:
      'Our office is at 22/B, Navana Tower, 45 Gulshan Avenue, Gulshan-1 Circle, Dhaka-1212. You can reach us by phone at +88 0130 444 99 88 or email at hello@snaplegal.com.bd.',
  },
  {
    question: 'Can I become a service provider?',
    answer:
      'Yes. If you are a consultant or professional in legal, business, or related fields, you can apply to become a provider or partner as an agency. Visit "Become a Service Provider" or "Partner as Agency" in the footer for more information.',
  },
  {
    question: 'What if I need help with my order?',
    answer:
      'Contact us via WhatsApp (+88 0130 444 99 88), email (hello@snaplegal.com.bd), or the Help Center. We’re here to assist with booking, payment, delivery, or any other questions.',
  },
]

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left font-medium text-gray-900 hover:text-[var(--color-primary)] transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <p className="pb-5 text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-xl">
            Quick answers about SnapLegal, booking, payments, and support.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="px-6">
              <FaqItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Button asChild className="bg-[var(--color-primary)] hover:opacity-90 text-white">
            <Link href="/contact-sales">Contact us</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
