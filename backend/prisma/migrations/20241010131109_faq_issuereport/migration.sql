/*
  Warnings:

  - Added the required column `regno` to the `IssueReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IssueReport" ADD COLUMN     "regno" TEXT NOT NULL;
