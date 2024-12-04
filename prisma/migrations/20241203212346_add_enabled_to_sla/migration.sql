/*
  Warnings:

  - You are about to drop the column `categoryId` on the `SLADefinition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `SLADefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SLADefinition" DROP CONSTRAINT "SLADefinition_categoryId_fkey";

-- DropIndex
DROP INDEX "SLADefinition_categoryId_name_key";

-- AlterTable
ALTER TABLE "SLADefinition" DROP COLUMN "categoryId",
ADD COLUMN     "category" JSONB,
ADD COLUMN     "criticalThreshold" DOUBLE PRECISION,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "warningThreshold" DOUBLE PRECISION,
ADD COLUMN     "webhookNotifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "webhookUrl" TEXT;

-- CreateTable
CREATE TABLE "_EventCategoryToSLADefinition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventCategoryToSLADefinition_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventCategoryToSLADefinition_B_index" ON "_EventCategoryToSLADefinition"("B");

-- CreateIndex
CREATE UNIQUE INDEX "SLADefinition_userId_name_key" ON "SLADefinition"("userId", "name");

-- AddForeignKey
ALTER TABLE "_EventCategoryToSLADefinition" ADD CONSTRAINT "_EventCategoryToSLADefinition_A_fkey" FOREIGN KEY ("A") REFERENCES "EventCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventCategoryToSLADefinition" ADD CONSTRAINT "_EventCategoryToSLADefinition_B_fkey" FOREIGN KEY ("B") REFERENCES "SLADefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
