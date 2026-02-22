'use client'

import Image from 'next/image'

interface LogoSpinnerProps {
  /** Full-page layout (min-h-screen, centered). Default true. */
  fullPage?: boolean
  /** Optional message below the logo. */
  message?: string
  /** Size of the logo: 'sm' | 'md' | 'lg'. Default 'md'. */
  size?: 'sm' | 'md' | 'lg'
  /** Optional className for the wrapper. */
  className?: string
}

const sizeMap = {
  sm: { logoW: 120, logoH: 40, ringSize: 140 },
  md: { logoW: 180, logoH: 60, ringSize: 220 },
  lg: { logoW: 240, logoH: 80, ringSize: 280 },
}

export function LogoSpinner({
  fullPage = true,
  message,
  size = 'md',
  className = '',
}: LogoSpinnerProps) {
  const { logoW, logoH, ringSize } = sizeMap[size]

  const content = (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>
        {/* Rotating ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-logo-spinner-ring"
          style={{ width: ringSize, height: ringSize }}
          aria-hidden
        />
        {/* Logo with pulse */}
        <div
          className="relative z-10 flex items-center justify-center animate-logo-spinner-pulse"
          style={{ width: logoW, height: logoH }}
        >
          <Image
            src="/logo_without_tm.png"
            alt="SnapLegal"
            width={logoW}
            height={logoH}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      </div>
      {message && (
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base animate-pulse">{message}</p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {content}
      </div>
    )
  }

  return content
}
