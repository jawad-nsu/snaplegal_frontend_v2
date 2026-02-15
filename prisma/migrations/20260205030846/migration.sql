/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `sub_categories` will be added. If there are existing duplicate values, this will fail.

  Note: IF NOT EXISTS used because these indexes were already added in earlier migrations
  (20260105040000 for categories, 20260105050000 for sub_categories).
*/
-- CreateIndex (idempotent: skip if already exists from earlier migration)
CREATE UNIQUE INDEX IF NOT EXISTS "categories_serialNumber_key" ON "categories"("serialNumber");

-- CreateIndex (idempotent: skip if already exists from earlier migration)
CREATE UNIQUE INDEX IF NOT EXISTS "sub_categories_serialNumber_key" ON "sub_categories"("serialNumber");
