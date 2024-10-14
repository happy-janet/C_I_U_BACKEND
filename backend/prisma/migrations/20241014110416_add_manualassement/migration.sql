/*
  Warnings:

  - You are about to drop the `addAssessment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "addAssessment" DROP CONSTRAINT "addAssessment_courseId_fkey";

-- DropTable
DROP TABLE "addAssessment";

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
