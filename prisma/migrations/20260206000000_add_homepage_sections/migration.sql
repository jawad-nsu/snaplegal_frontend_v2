-- CreateTable (IF NOT EXISTS: table may already exist)
CREATE TABLE IF NOT EXISTS "homepage_sections" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "categoryId" TEXT,
    "serviceIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey (only if not already present)
DO $$ BEGIN
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
