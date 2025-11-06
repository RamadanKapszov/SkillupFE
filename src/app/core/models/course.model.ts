import { Lesson } from './lesson.model';

export interface Course {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  teacherId: number;
  teacherUsername?: string;
  lessonsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  lessons?: Lesson[];
}
