import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ExamPaper } from './exam-paper.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  answer: string;

  @ManyToOne(() => ExamPaper, examPaper => examPaper.questions, { onDelete: 'CASCADE' })
  examPaper: ExamPaper;
  options: any;
}
