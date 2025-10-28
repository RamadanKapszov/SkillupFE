export interface UserCourseProgress {
  courseId: number;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  points: number;
  badges: string[];
}
