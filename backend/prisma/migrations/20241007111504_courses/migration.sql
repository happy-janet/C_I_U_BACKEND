/*
  Warnings:

  - You are about to drop the column `courseUnit` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "courseUnit",
ADD COLUMN     "courseUnits" TEXT[];
