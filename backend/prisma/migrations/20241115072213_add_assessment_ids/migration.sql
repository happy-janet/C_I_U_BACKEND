/*
  Warnings:

  - You are about to drop the column `examId` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addAssessmentId,userId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[manualAssessmentId,userId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_examId_assessment_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_examId_manualAssessment_fkey";

-- DropIndex
DROP INDEX "Score_examId_userId_key";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "examId",
ADD COLUMN     "addAssessmentId" INTEGER,
ADD COLUMN     "manualAssessmentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Score_addAssessmentId_userId_key" ON "Score"("addAssessmentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_manualAssessmentId_userId_key" ON "Score"("manualAssessmentId", "userId");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_addAssessmentId_assessment_fkey" FOREIGN KEY ("addAssessmentId") REFERENCES "addAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_manualAssessmentId_manual_fkey" FOREIGN KEY ("manualAssessmentId") REFERENCES "ManualAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
