/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[questionNumber]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_QuestionToQuestionBank" DROP CONSTRAINT "_QuestionToQuestionBank_A_fkey";

-- AlterTable
CREATE SEQUENCE question_id_seq;
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "id" SET DEFAULT nextval('question_id_seq'),
ALTER COLUMN "questionNumber" DROP DEFAULT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE question_id_seq OWNED BY "Question"."id";
DROP SEQUENCE "Question_questionNumber_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Question_questionNumber_key" ON "Question"("questionNumber");

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionBank" ADD CONSTRAINT "_QuestionToQuestionBank_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
