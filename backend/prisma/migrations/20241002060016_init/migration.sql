/*
  Warnings:

  - Added the required column `password` to the `LecturerSignUp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LecturerSignUp" ADD COLUMN     "password" TEXT NOT NULL;
