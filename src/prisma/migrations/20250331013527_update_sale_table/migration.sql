/*
  Warnings:

  - You are about to drop the column `inQuantity` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "inQuantity",
ADD COLUMN     "quantity" INTEGER;
