export interface LessonDetail {
  id: string;
  name: string;
  description: string;
  video: string | null;
  time: number;
  view: string;
  lastUpdate: string | null;
}
