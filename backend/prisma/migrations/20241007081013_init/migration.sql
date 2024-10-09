/*
  Warnings:

  - Added the required column `courseId` to the `addAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addAssessment" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "addAssessment" ADD CONSTRAINT "addAssessment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
