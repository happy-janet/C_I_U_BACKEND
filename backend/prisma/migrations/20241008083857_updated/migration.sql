/*
  Warnings:

  - Added the required column `correctAnswer` to the `addAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseUnitCode` to the `addAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `addAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseUnitCode` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addAssessment" ADD COLUMN     "correctAnswer" TEXT NOT NULL,
ADD COLUMN     "courseUnitCode" TEXT NOT NULL,
ADD COLUMN     "options" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "courseUnitCode" TEXT NOT NULL;
