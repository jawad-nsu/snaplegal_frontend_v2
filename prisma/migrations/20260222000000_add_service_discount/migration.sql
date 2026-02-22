-- AlterTable
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "discountType" TEXT;

ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "discountValue" TEXT;
