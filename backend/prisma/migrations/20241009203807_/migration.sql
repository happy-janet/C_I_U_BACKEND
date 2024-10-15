/*
  Warnings:

  - You are about to drop the column `registrationNo` on the `IssueReport` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `IssueReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IssueReport" DROP CONSTRAINT "IssueReport_registrationNo_fkey";

-- AlterTable
ALTER TABLE "IssueReport" DROP COLUMN "registrationNo",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IssueReport" ADD CONSTRAINT "IssueReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
