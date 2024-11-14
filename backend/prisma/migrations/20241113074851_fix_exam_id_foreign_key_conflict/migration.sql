/*
  Warnings:

  - A unique constraint covering the columns `[userId,examId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Score_userId_examId_key" ON "Score"("userId", "examId");

-- RenameForeignKey
ALTER TABLE "Score" RENAME CONSTRAINT "Score_examId_fkey" TO "Score_examId_fkey_1";

-- RenameForeignKey
ALTER TABLE "Score" RENAME CONSTRAINT "Score_examId_manual_fkey" TO "Score_examId_fkey_2";
