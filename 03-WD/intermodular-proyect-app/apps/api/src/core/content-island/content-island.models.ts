import type { Media } from '@content-island/api-client';

export interface CourseCI {
  id: string;
  language: string;
  lastUpdate: string;
  name: string;
  image: Media;
  description: string;
  shortDescription: string;
  lessons: LessonRefCI[];
}

export interface LessonRefCI {
  id: string;
  name: string;
}

export interface LessonCI {
  id: string;
  language: string;
  lastUpdate: string;
  name: string;
  video: Media;
  description: string;
  time: number;
  view: string;
}
