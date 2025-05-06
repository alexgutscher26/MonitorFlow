/*
  Warnings:

  - You are about to drop the `CategorySchema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategorySchema" DROP CONSTRAINT "CategorySchema_categoryId_fkey";

-- DropTable
DROP TABLE "CategorySchema";
