/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `sub_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "homepage_sections" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "categoryId" TEXT,
    "serviceIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (IF NOT EXISTS: constraints may already exist from a prior migration)
CREATE UNIQUE INDEX IF NOT EXISTS "categories_serialNumber_key" ON "categories"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "sub_categories_serialNumber_key" ON "sub_categories"("serialNumber");

-- AddForeignKey
ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
