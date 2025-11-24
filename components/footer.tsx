import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Categories Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/all-services#ac-services" className="text-gray-600 hover:text-pink-600 text-sm">
                  AC Repair Services
                </Link>
              </li>
              <li>
                <Link href="/all-services#appliance" className="text-gray-600 hover:text-pink-600 text-sm">
                  Appliance Repair
                </Link>
              </li>
              <li>
                <Link href="/all-services#cleaning" className="text-gray-600 hover:text-pink-600 text-sm">
                  Cleaning Solution
                </Link>
              </li>
              <li>
                <Link href="/all-services#shifting" className="text-gray-600 hover:text-pink-600 text-sm">
                  Shifting
                </Link>
              </li>
              <li>
                <Link href="/all-services#plumbing" className="text-gray-600 hover:text-pink-600 text-sm">
                  Plumbing & Sanitary
                </Link>
              </li>
              <li>
                <Link href="/all-services#electrical" className="text-gray-600 hover:text-pink-600 text-sm">
                  Electrical Services
                </Link>
              </li>
              <li>
                <Link href="/all-services#painting" className="text-gray-600 hover:text-pink-600 text-sm">
                  Painting
                </Link>
              </li>
              <li>
                <Link href="/all-services#pest-control" className="text-gray-600 hover:text-pink-600 text-sm">
                  Pest Control
                </Link>
              </li>
              <li>
                <Link href="/all-services#car-care" className="text-gray-600 hover:text-pink-600 text-sm">
                  Car Care
                </Link>
              </li>
              <li>
                <Link href="/all-services#beauty" className="text-gray-600 hover:text-pink-600 text-sm">
                  Beauty & Wellness
                </Link>
              </li>
              <li>
                <Link href="/all-services#health" className="text-gray-600 hover:text-pink-600 text-sm">
                  Health & Care
                </Link>
              </li>
              <li>
                <Link href="/all-services" className="text-gray-600 hover:text-pink-600 text-sm">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* For Customers Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Customers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-pink-600 text-sm">
                  How Sheba Works
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-600 hover:text-pink-600 text-sm">
                  Customer Success Stories
                </Link>
              </li>
              <li>
                <Link href="/quality-guide" className="text-gray-600 hover:text-pink-600 text-sm">
                  Quality Guide
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-600 hover:text-pink-600 text-sm">
                  Sheba Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-pink-600 text-sm">
                  Sheba Answers
                </Link>
              </li>
              <li>
                <Link href="/all-services" className="text-gray-600 hover:text-pink-600 text-sm">
                  Browse Services
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/become-provider" className="text-gray-600 hover:text-pink-600 text-sm">
                  Become a Service Provider
                </Link>
              </li>
              <li>
                <Link href="/partner-agency" className="text-gray-600 hover:text-pink-600 text-sm">
                  Partner as Agency
                </Link>
              </li>
              <li>
                <Link href="/provider-benefits" className="text-gray-600 hover:text-pink-600 text-sm">
                  Provider Benefits Program
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-pink-600 text-sm">
                  Community Hub
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-600 hover:text-pink-600 text-sm">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-600 hover:text-pink-600 text-sm">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Solutions Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Business Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sheba-pro" className="text-gray-600 hover:text-pink-600 text-sm">
                  Sheba Pro
                </Link>
              </li>
              <li>
                <Link href="/project-management" className="text-gray-600 hover:text-pink-600 text-sm">
                  Project Management Service
                </Link>
              </li>
              <li>
                <Link href="/facility-management" className="text-gray-600 hover:text-pink-600 text-sm">
                  Facility Management
                </Link>
              </li>
              <li>
                <Link href="/corporate-services" className="text-gray-600 hover:text-pink-600 text-sm">
                  Corporate Services
                </Link>
              </li>
              <li>
                <Link href="/bulk-booking" className="text-gray-600 hover:text-pink-600 text-sm">
                  Bulk Booking
                </Link>
              </li>
              <li>
                <Link href="/sheba-pay" className="text-gray-600 hover:text-pink-600 text-sm">
                  Sheba Pay
                </Link>
              </li>
              <li>
                <Link href="/contact-sales" className="text-gray-600 hover:text-pink-600 text-sm">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-600 text-sm">
                  About Sheba
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-pink-600 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="text-gray-600 hover:text-pink-600 text-sm">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/social-impact" className="text-gray-600 hover:text-pink-600 text-sm">
                  Social Impact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-pink-600 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-pink-600 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-pink-600 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-gray-600 hover:text-pink-600 text-sm">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/affiliates" className="text-gray-600 hover:text-pink-600 text-sm">
                  Affiliates
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-pink-600 text-sm">
                  Press & News
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-gray-600 hover:text-pink-600 text-sm">
                  Investor Relations
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-pink-600 text-white font-bold text-xl px-3 py-1 rounded">sheba</div>
              </div>
              <span className="text-gray-600 text-sm">© Sheba Platform Limited. 2025</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <Link href="https://tiktok.com" className="text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </Link>
              <Link href="https://instagram.com" className="text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.204.013-3.663.072-4.948.196-4.354 2.617-6.78 6.979-6.98 1.281-.057 1.689-.069 4.948-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </Link>
              <Link href="https://linkedin.com" className="text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="https://facebook.com" className="text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.372-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link href="https://pinterest.com" className="text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </Link>
              <Link href="https://twitter.com" className="text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>

            {/* Language and Settings */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-gray-600 hover:text-pink-600 text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                English
              </button>
              <button className="text-gray-600 hover:text-pink-600 text-sm font-medium">BDT ৳</button>
              <button className="text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

