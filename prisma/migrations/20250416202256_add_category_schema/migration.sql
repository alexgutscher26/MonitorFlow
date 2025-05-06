/*
  Warnings:

  - You are about to drop the column `archivedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `ApiKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Webhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookDelivery` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED');

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventHistory" DROP CONSTRAINT "EventHistory_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_userId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookDelivery" DROP CONSTRAINT "WebhookDelivery_eventId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookDelivery" DROP CONSTRAINT "WebhookDelivery_webhookId_fkey";

-- DropIndex
DROP INDEX "Event_status_idx";

-- DropIndex
DROP INDEX "Event_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "archivedAt",
DROP COLUMN "metadata",
DROP COLUMN "processedAt",
DROP COLUMN "status",
DROP COLUMN "version",
ADD COLUMN     "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "ApiKey";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "EventHistory";

-- DropTable
DROP TABLE "Webhook";

-- DropTable
DROP TABLE "WebhookDelivery";

-- DropEnum
DROP TYPE "ApiKeyType";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "WebhookStatus";

-- CreateTable
CREATE TABLE "CategorySchema" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategorySchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategorySchema_categoryId_key" ON "CategorySchema"("categoryId");

-- AddForeignKey
ALTER TABLE "CategorySchema" ADD CONSTRAINT "CategorySchema_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
