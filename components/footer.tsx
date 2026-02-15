import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Categories Column */}
          <div>
            <h3 className="bg-[var(--color-primary)] text-white font-bold text-xl px-3 py-1 rounded">SNAPLEGAL</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.google.com/maps/place/SnapLegal/@23.7805327,90.4117023,17z/data=!3m1!4b1!4m6!3m5!1s0x3755c723c29b9d63:0xb47650183455f358!8m2!3d23.7805279!4d90.4163104!16s%2Fg%2F11ylqymddq?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D" target='blank' className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  22/B, Navana Tower, 45 Gulshan Avenue, Gulshan-1 Circle, Dhaka-1212
                </Link>
              </li>
              <li>
                <Link href="tel:+8801304449988" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  +88 0130 444 99 88
                </Link>
              </li>
              <li> 
                <Link href="mailto:hello@snaplegal.com.bd" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  hello@snaplegal.com.bd
                </Link>
              </li>
            </ul>
          </div>

          {/* For Customers Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Customers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/all-services" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  All Services
                </Link>
              </li>
              {/* <li>
                <Link href="/success-stories" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Customer Success Stories
                </Link>
              </li> */}
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  How SnapLegal Works
                </Link>
              </li>
              {/* <li>
                <Link href="/guides" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  SnapLegal Guides
                </Link>
              </li> */}
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  SnapLegal FAQ
                </Link>
              </li>
              <li>
                <Link href="/corporate-services" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Corporate Services
                </Link>
              </li>
              {/* <li>
                <Link href="/bulk-booking" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Bulk Booking
                </Link>
              </li> */}
              {/* <li>
                <Link href="/SnapLegal-pay" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  SnapLegal Pay
                </Link>
              </li> */}
              <li>
                <Link href="/contact-sales" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Consultants</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/become-provider" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Become a Service Provider
                </Link>
              </li>
              <li>
                <Link href="/partner-agency" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Partner as Agency
                </Link>
              </li>
              {/* <li>
                <Link href="/provider-benefits" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Provider Benefits Program
                </Link>
              </li> */}
              <li>
                <Link href="/community" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Community Hub
                </Link>
              </li>
              {/* <li>
                <Link href="/forum" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Forum
                </Link>
              </li> */}
              {/* <li>
                <Link href="/events" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Events
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  About SnapLegal
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Help Center
                </Link>
              </li>
              {/* <li>
                <Link href="/trust-safety" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Trust & Safety
                </Link>
              </li> */}
              {/* <li>
                <Link href="/social-impact" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Social Impact
                </Link>
              </li> */}
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Careers
                </Link>
              </li>
              {/* <li>
                <Link href="/partnerships" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Partnerships
                </Link>
              </li> */}
              {/* <li>
                <Link href="/affiliates" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Affiliates
                </Link>
              </li> */}
              {/* <li>
                <Link href="/press" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Press & News
                </Link>
              </li> */}
              {/* <li>
                <Link href="/investors" className="text-gray-600 hover:text-[var(--color-primary)] text-sm">
                  Investor Relations
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-50 px-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">© SnapLegal 2025 | All Rights Reserved</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {/* <Link href="https://tiktok.com" className="text-gray-600 hover:text-[var(--color-primary)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </Link> */}
              <Link href="https://www.facebook.com/snaplegal.bd" className="text-gray-600 hover:text-blue-600" target='blank'>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.372-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link href="https://instagram.com" className="text-gray-600 hover:text-pink-600" target='blank'>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.204.013-3.663.072-4.948.196-4.354 2.617-6.78 6.979-6.98 1.281-.057 1.689-.069 4.948-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </Link>
              <Link href="https://linkedin.com" className="text-gray-600 hover:text-blue-800" target='blank'>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>

              <Link
                  href="https://wa.me/8801304449988?text=Hello%2C%20I%27m%20reaching%20from%20snaplegal.com.bd%20website"
                  className="text-gray-600 hover:text-green-600"
                  target="blank"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.46 0 .17 5.29.17 11.87c0 2.09.55 4.14 1.6 5.95L0 24l6.37-1.66c1.72.94 3.67 1.43 5.67 1.43h.01c6.58 0 11.87-5.29 11.87-11.87a11.8 11.8 0 0 0-3.4-8.42zM12.05 21.48c-1.74 0-3.45-.47-4.94-1.36l-.35-.21-3.78.98 1.01-3.68-.23-.38a9.85 9.85 0 0 1-1.49-5.22C2.27 6.55 6.51 2.3 12.04 2.3c2.63 0 5.1 1.02 6.96 2.88a9.75 9.75 0 0 1 2.88 6.96c-.01 5.53-4.26 9.77-9.83 9.77zm5.48-7.35c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.69.15-.2.3-.79.97-.96 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.69-1.65-.95-2.27-.25-.6-.5-.52-.69-.53-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.18 5.08 4.46.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.41-.07-.1-.27-.17-.57-.32z"/>
                  </svg>
                </Link>

              {/* <Link href="https://pinterest.com" className="text-gray-600 hover:text-[var(--color-primary)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </Link> */}
              {/* <Link href="https://twitter.com" className="text-gray-600 hover:text-[var(--color-primary)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link> */}
            </div>

            {/* Language and Settings */}
            {/* <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-primary)] text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                English
              </button>
              <button className="text-gray-600 hover:text-[var(--color-primary)] text-sm font-medium">BDT ৳</button>
              <button className="text-gray-600 hover:text-[var(--color-primary)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </button>
              <span className="text-gray-600 text-sm">GMT+6</span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

