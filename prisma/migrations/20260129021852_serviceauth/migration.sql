/*
  Note:
  - Unique constraints on `categories.serialNumber` and `sub_categories.serialNumber`
    already exist in the target database, so index creation is omitted here
    to avoid `relation "..._serialNumber_key" already exists` errors.
*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "infoSource" TEXT,
ALTER COLUMN "status" SET NOT NULL;

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT,
    "orderId" TEXT,
    "reviewType" TEXT NOT NULL DEFAULT 'service',
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "reviewerName" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
