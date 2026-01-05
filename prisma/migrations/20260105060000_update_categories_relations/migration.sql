-- AlterTable: Update categories to use lastModifiedById instead of lastModifiedBy
ALTER TABLE "categories" 
    DROP COLUMN IF EXISTS "lastModifiedBy",
    ADD COLUMN IF NOT EXISTS "lastModifiedById" TEXT;

-- AddForeignKey for categories lastModifiedBy
ALTER TABLE "categories" 
    DROP CONSTRAINT IF EXISTS "categories_lastModifiedById_fkey",
    ADD CONSTRAINT "categories_lastModifiedById_fkey" FOREIGN KEY ("lastModifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

