/*
  Warnings:

  - The `courseUnit` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "courseUnit",
ADD COLUMN     "courseUnit" TEXT[],
ALTER COLUMN "courseName" SET NOT NULL,
ALTER COLUMN "courseName" SET DATA TYPE TEXT;
