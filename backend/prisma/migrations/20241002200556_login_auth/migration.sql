/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `LecturerSignUp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LecturerSignUp_email_key" ON "LecturerSignUp"("email");
