export interface StudentCourse {
  contentIslandId: string;
  name_course: string;
  ciName: string | null;
  ciShortDescription: string | null;
  ciDescription: string | null;
  ciImage: string | null;
}

export interface CourseDetail {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  lastUpdate: string | null;
  studentsCount: number;
  lessons: Array<{ id: string; name: string }>;
}
