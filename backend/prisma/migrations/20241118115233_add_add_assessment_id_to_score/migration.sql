-- CreateTable
CREATE TABLE "LecturerSignUp" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "token" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "password" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "LecturerSignUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSignUp" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "AdminSignUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),
    "registrationNo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueReport" (
    "id" SERIAL NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "IssueReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "addAssessmentId" INTEGER,
    "manualAssessmentId" INTEGER,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "facultyName" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseUnits" TEXT[],
    "courseUnitCode" TEXT[],

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addAssessment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "courseUnit" TEXT NOT NULL,
    "courseUnitCode" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "addAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "options" JSONB NOT NULL,
    "assessmentId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualAssessment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "courseUnit" TEXT NOT NULL,
    "courseUnitCode" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ManualAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionManual" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "options" JSONB NOT NULL,
    "assessmentId" INTEGER NOT NULL,

    CONSTRAINT "QuestionManual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamProgress" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "currentQuestion" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionBank" (
    "id" SERIAL NOT NULL,
    "courseUnit" TEXT NOT NULL,
    "courseUnitCode" TEXT NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_QuestionToQuestionBank" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LecturerSignUp_email_key" ON "LecturerSignUp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LecturerSignUp_resetToken_key" ON "LecturerSignUp"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSignUp_email_key" ON "AdminSignUp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSignUp_resetToken_key" ON "AdminSignUp"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_registrationNo_key" ON "users"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "users"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Score_addAssessmentId_userId_key" ON "Score"("addAssessmentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_manualAssessmentId_userId_key" ON "Score"("manualAssessmentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamProgress_studentId_examId_key" ON "ExamProgress"("studentId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserCourses_AB_unique" ON "_UserCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_UserCourses_B_index" ON "_UserCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToQuestionBank_AB_unique" ON "_QuestionToQuestionBank"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToQuestionBank_B_index" ON "_QuestionToQuestionBank"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueReport" ADD CONSTRAINT "IssueReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "ManualAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_addAssessmentId_assessment_fkey" FOREIGN KEY ("addAssessmentId") REFERENCES "addAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_manualAssessmentId_manual_fkey" FOREIGN KEY ("manualAssessmentId") REFERENCES "ManualAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addAssessment" ADD CONSTRAINT "addAssessment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "addAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualAssessment" ADD CONSTRAINT "ManualAssessment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionManual" ADD CONSTRAINT "QuestionManual_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "ManualAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionBank" ADD CONSTRAINT "QuestionBank_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "addAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCourses" ADD CONSTRAINT "_UserCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCourses" ADD CONSTRAINT "_UserCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionBank" ADD CONSTRAINT "_QuestionToQuestionBank_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionBank" ADD CONSTRAINT "_QuestionToQuestionBank_B_fkey" FOREIGN KEY ("B") REFERENCES "QuestionBank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
