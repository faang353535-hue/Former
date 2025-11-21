/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Forms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_formId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Forms_id_userId_key" ON "Forms"("id", "userId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 