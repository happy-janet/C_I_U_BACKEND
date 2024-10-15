/*
  Warnings:

  - You are about to drop the `manualAssessment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "manualAssessment" DROP CONSTRAINT "manualAssessment_courseId_fkey";

-- DropTable
DROP TABLE "manualAssessment";

-- CreateTable
CREATE TABLE "ManualAssessment" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionManual" (
    "id" SERIAL NOT NULL,
    "questions" JSONB NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "assessmentId" INTEGER NOT NULL,

    CONSTRAINT "QuestionManual_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManualAssessment" ADD CONSTRAINT "ManualAssessment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionManual" ADD CONSTRAINT "QuestionManual_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "ManualAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
