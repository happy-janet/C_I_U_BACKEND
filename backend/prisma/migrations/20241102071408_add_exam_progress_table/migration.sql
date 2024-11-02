-- CreateTable
CREATE TABLE "ExamProgress" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "currentQuestion" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamProgress_pkey" PRIMARY KEY ("id")
);
