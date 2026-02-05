/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `sub_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categories_serialNumber_key" ON "categories"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_serialNumber_key" ON "sub_categories"("serialNumber");
