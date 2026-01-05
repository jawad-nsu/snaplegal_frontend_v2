-- AlterTable
ALTER TABLE "categories" ADD COLUMN "serialNumber" INTEGER,
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "lastModifiedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "categories_serialNumber_key" ON "categories"("serialNumber") WHERE "serialNumber" IS NOT NULL;

