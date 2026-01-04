import { UserType } from '@prisma/client'

/**
 * Get redirect path based on user type
 */
export function getRedirectPath(userType: UserType): string {
  return userType === 'PARTNER' ? '/vendor' : '/'
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format (supports international format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces and validate
  const cleaned = phone.replace(/\s/g, '')
  // Allow + prefix and 10-15 digits
  const phoneRegex = /^\+?[0-9]{10,15}$/
  return phoneRegex.test(cleaned)
}

/**
 * Format phone number for storage (remove spaces, ensure + prefix)
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

/**
 * Mask email for display (e.g., us***@example.com)
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  const maskedLocal = localPart.slice(0, 2) + '*'.repeat(Math.min(localPart.length - 2, 5))
  return `${maskedLocal}@${domain}`
}

/**
 * Mask phone for display (e.g., +880 1*** ****32)
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.length <= 4) return phone
  
  const visible = cleaned.slice(-4)
  const masked = cleaned.slice(0, -4).replace(/\d/g, '*')
  return `${masked}${visible}`
}

