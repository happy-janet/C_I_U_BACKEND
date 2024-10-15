/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "IssueReport" (
    "id" SERIAL NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrationNo" TEXT NOT NULL,

    CONSTRAINT "IssueReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IssueReport" ADD CONSTRAINT "IssueReport_registrationNo_fkey" FOREIGN KEY ("registrationNo") REFERENCES "users"("registrationNo") ON DELETE RESTRICT ON UPDATE CASCADE;
