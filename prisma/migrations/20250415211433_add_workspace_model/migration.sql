/*
  Warnings:

  - You are about to drop the column `apiKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discordId` on the `User` table. All the data in the column will be lost.
  - The `plan` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `externalId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_userId_fkey";

-- DropIndex
DROP INDEX "User_apiKey_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "apiKey",
DROP COLUMN "discordId",
ALTER COLUMN "externalId" SET NOT NULL,
ALTER COLUMN "quotaLimit" SET DEFAULT 1000,
DROP COLUMN "plan",
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'FREE';

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
