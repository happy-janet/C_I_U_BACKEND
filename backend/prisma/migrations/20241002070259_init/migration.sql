/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "StudentLogin" (
    "id" SERIAL NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "StudentLogin_pkey" PRIMARY KEY ("id")
);
