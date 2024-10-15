/*
  Warnings:

  - You are about to drop the column `objectives` on the `addAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `courseName` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `courseUnitCode` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `courseUnits` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `facultyName` on the `courses` table. All the data in the column will be lost.
  - Added the required column `description` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addAssessment" DROP COLUMN "objectives";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "courseName",
DROP COLUMN "courseUnitCode",
DROP COLUMN "courseUnits",
DROP COLUMN "facultyName",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "manualAssessment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "courseUnit" TEXT NOT NULL,
    "courseUnitCode" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questions" JSONB NOT NULL,
    "options" JSONB NOT NULL,
    "objectives" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,

    CONSTRAINT "manualAssessment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "manualAssessment" ADD CONSTRAINT "manualAssessment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
