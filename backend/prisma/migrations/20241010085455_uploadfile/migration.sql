/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `addAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `addAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `addAssessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addAssessment" DROP COLUMN "correctAnswer",
DROP COLUMN "options",
DROP COLUMN "questions";

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "options" JSONB NOT NULL,
    "assessmentId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "addAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
