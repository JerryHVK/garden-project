/*
  Warnings:

  - You are about to drop the column `outQuantity` on the `Vegetable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "inQuantity" DROP NOT NULL,
ALTER COLUMN "totalPrice" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vegetable" DROP COLUMN "outQuantity",
ADD COLUMN     "saleQuantity" INTEGER,
ALTER COLUMN "inQuantity" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;
