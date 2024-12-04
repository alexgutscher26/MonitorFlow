-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WARNING', 'CRITICAL', 'RECOVERY');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "SLANotification" (
    "id" TEXT NOT NULL,
    "slaDefinitionId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "deliveredAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SLANotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SLANotification_slaDefinitionId_idx" ON "SLANotification"("slaDefinitionId");
CREATE INDEX "SLANotification_createdAt_idx" ON "SLANotification"("createdAt");

-- AddForeignKey
ALTER TABLE "SLANotification" ADD CONSTRAINT "SLANotification_slaDefinitionId_fkey" FOREIGN KEY ("slaDefinitionId") REFERENCES "SLADefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
