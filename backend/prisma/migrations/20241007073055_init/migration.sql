-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "facultyName" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseUnit" JSONB NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addAssessment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "courseUnit" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questions" JSONB NOT NULL,

    CONSTRAINT "addAssessment_pkey" PRIMARY KEY ("id")
);
