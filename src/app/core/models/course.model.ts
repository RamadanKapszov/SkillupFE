import { Lesson } from './lesson.model';
export interface Course {
  id: number;
  title: string;
  description?: string;
  shortDescription?: string;
  level?: string;
  duration?: string;
  language?: string;
  prerequisites?: string;
  whatYouWillLearn?: string;
  whoIsFor?: string;
  tags?: string;
  rating?: number;
  studentsCount?: number;

  categoryId?: number;
  categoryName?: string;
  teacherId?: number;
  teacherUsername?: string;
  createdAt?: string;
  imageUrl?: string;

  // Extras
  averageRating?: number;
  isEnrolled?: boolean;
  lessons?: any[];
}
