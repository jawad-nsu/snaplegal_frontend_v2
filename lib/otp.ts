import otpGenerator from 'otp-generator'
import { prisma } from './prisma'

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })
}

/**
 * Store OTP in database with expiration (10 minutes)
 */
export async function storeOTP(
  identifier: string,
  token: string,
  expiresInMinutes: number = 10
): Promise<void> {
  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + expiresInMinutes)

  // Delete any existing OTP for this identifier
  await prisma.verificationToken.deleteMany({
    where: { identifier },
  })

  // Store new OTP
  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  })
}

/**
 * Verify OTP from database
 */
export async function verifyOTP(
  identifier: string,
  token: string
): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  })

  if (!verificationToken) {
    return false
  }

  // Check if expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier,
          token,
        },
      },
    })
    return false
  }

  // Delete used token (single-use)
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  })

  return true
}

/**
 * Check if OTP exists and is valid (without consuming it)
 */
export async function checkOTP(
  identifier: string,
  token: string
): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  })

  if (!verificationToken) {
    return false
  }

  // Check if expired
  if (verificationToken.expires < new Date()) {
    return false
  }

  return true
}

/**
 * Clean up expired OTPs
 */
export async function cleanupExpiredOTPs(): Promise<void> {
  await prisma.verificationToken.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  })
}

