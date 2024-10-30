-- AlterTable
ALTER TABLE "ManualAssessment" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';
