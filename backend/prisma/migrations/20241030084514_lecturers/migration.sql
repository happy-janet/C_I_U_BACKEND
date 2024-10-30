/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ManualAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `QuestionManual` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `QuestionManual` table. All the data in the column will be lost.
  - Added the required column `content` to the `QuestionManual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ManualAssessment" DROP COLUMN "updatedAt",
ALTER COLUMN "duration" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuestionManual" DROP COLUMN "correctAnswer",
DROP COLUMN "questions",
ADD COLUMN     "answer" TEXT,
ADD COLUMN     "content" TEXT NOT NULL;
