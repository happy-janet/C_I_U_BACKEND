/*
  Warnings:

  - Added the required column `objectives` to the `addAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addAssessment" ADD COLUMN     "objectives" JSONB NOT NULL;