/*
  Warnings:

  - You are about to drop the column `checkInterval` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isUp` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `lastCheckAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `lastResponseTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `lastStatusCode` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringEnabled` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `timeout` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `PingHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PingHistory" DROP CONSTRAINT "PingHistory_eventId_fkey";

-- DropIndex
DROP INDEX "Event_url_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "checkInterval",
DROP COLUMN "isUp",
DROP COLUMN "lastCheckAt",
DROP COLUMN "lastResponseTime",
DROP COLUMN "lastStatusCode",
DROP COLUMN "monitoringEnabled",
DROP COLUMN "timeout",
DROP COLUMN "url",
ADD COLUMN     "slaDefinitionId" TEXT;

-- DropTable
DROP TABLE "PingHistory";

-- CreateTable
CREATE TABLE "SLADefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "target" DOUBLE PRECISION NOT NULL,
    "timeWindow" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SLADefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLAMeasurement" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "uptimePercent" DOUBLE PRECISION NOT NULL,
    "downtimeMinutes" DOUBLE PRECISION NOT NULL,
    "slaDefinitionId" TEXT NOT NULL,
    "eventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SLAMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SLADefinition_categoryId_name_key" ON "SLADefinition"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SLAMeasurement_eventId_key" ON "SLAMeasurement"("eventId");

-- CreateIndex
CREATE INDEX "SLAMeasurement_startTime_endTime_idx" ON "SLAMeasurement"("startTime", "endTime");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_slaDefinitionId_fkey" FOREIGN KEY ("slaDefinitionId") REFERENCES "SLADefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLADefinition" ADD CONSTRAINT "SLADefinition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLADefinition" ADD CONSTRAINT "SLADefinition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLAMeasurement" ADD CONSTRAINT "SLAMeasurement_slaDefinitionId_fkey" FOREIGN KEY ("slaDefinitionId") REFERENCES "SLADefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLAMeasurement" ADD CONSTRAINT "SLAMeasurement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
