/*
  Warnings:

  - You are about to drop the column `password` on the `LecturerSignUp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LecturerSignUp" DROP COLUMN "password",
ADD COLUMN     "token" TEXT,
ADD COLUMN     "tokenExpiry" TIMESTAMP(3);
