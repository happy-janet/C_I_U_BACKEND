/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `timeSubmitted` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examId,userId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_examId_fkey_1";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_examId_fkey_2";

-- DropIndex
DROP INDEX "Score_userId_examId_key";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "createdAt",
DROP COLUMN "timeSubmitted",
ALTER COLUMN "examId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Score_examId_userId_key" ON "Score"("examId", "userId");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_examId_assessment_fkey" FOREIGN KEY ("examId") REFERENCES "addAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_examId_manualAssessment_fkey" FOREIGN KEY ("examId") REFERENCES "ManualAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
