-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('New', 'Qualified', 'Proposal', 'Closed');

-- CreateEnum
CREATE TYPE "ClosedReason" AS ENUM ('Won', 'Lost', 'Lost_Unqualified');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('Website', 'Referral', 'Social_Media', 'Advertisement', 'Cold_Call', 'Other');

-- CreateEnum
CREATE TYPE "LeadSubSource" AS ENUM ('Facebook_Ads', 'Google_Ads', 'LinkedIn', 'Instagram', 'Word_of_Mouth', 'Email_Campaign', 'Other');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "whatsapp" TEXT,
    "mobile" TEXT,
    "facebook" TEXT,
    "email" TEXT,
    "profession" TEXT,
    "street" TEXT,
    "city" TEXT,
    "thana" TEXT,
    "district" TEXT,
    "country" TEXT DEFAULT 'Bangladesh',
    "postalCode" TEXT,
    "desiredService" TEXT,
    "initialDiscussion" TEXT,
    "stage" "LeadStage" NOT NULL DEFAULT 'New',
    "closedReason" "ClosedReason",
    "closedReasonText" TEXT,
    "leadSource" "LeadSource" NOT NULL,
    "leadSubSource" "LeadSubSource",
    "leadOwner" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);
