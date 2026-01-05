-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "rating" TEXT DEFAULT '0',
    "description" TEXT,
    "deliveryTime" TEXT,
    "startingPrice" TEXT,
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT,
    "status" TEXT DEFAULT 'active',
    "shortDescription" TEXT,
    "detailedDescription" TEXT,
    "providerAuthority" TEXT,
    "requiredDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whatsIncluded" TEXT,
    "whatsNotIncluded" TEXT,
    "timeline" TEXT,
    "additionalNotes" TEXT,
    "processFlow" TEXT,
    "videoUrl" TEXT,
    "faqs" JSONB,
    "consultantQualifications" TEXT,
    "packages" JSONB,
    "coreFiling" TEXT,
    "coreStamps" TEXT,
    "coreCourtFee" TEXT,
    "clientFiling" TEXT,
    "clientStamps" TEXT,
    "clientCourtFee" TEXT,
    "clientConsultantFee" TEXT,
    "lastModifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_lastModifiedById_fkey" FOREIGN KEY ("lastModifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

