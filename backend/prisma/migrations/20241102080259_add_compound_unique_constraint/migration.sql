/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ExamProgress` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ExamProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,examId]` on the table `ExamProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ExamProgress" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "ExamProgress_studentId_examId_key" ON "ExamProgress"("studentId", "examId");
