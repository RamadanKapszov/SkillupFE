export interface Course {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  teacherId: number;
  teacherName?: string;
  lessonsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
