/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "brandCustomDomain" TEXT,
ADD COLUMN     "brandLogo" TEXT,
ADD COLUMN     "brandPrimaryColor" TEXT,
ADD COLUMN     "brandSecondaryColor" TEXT;

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "RolePermission";

-- DropEnum
DROP TYPE "Role";
