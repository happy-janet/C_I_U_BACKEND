-- CreateTable
CREATE TABLE "LecturerSignUp" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "LecturerSignUp_pkey" PRIMARY KEY ("id")
);
