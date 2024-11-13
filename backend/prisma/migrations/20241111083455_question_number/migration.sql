/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_QuestionToQuestionBank" DROP CONSTRAINT "_QuestionToQuestionBank_A_fkey";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ADD COLUMN     "questionNumber" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("questionNumber");
DROP SEQUENCE "Question_id_seq";

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionBank" ADD CONSTRAINT "_QuestionToQuestionBank_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("questionNumber") ON DELETE CASCADE ON UPDATE CASCADE;
