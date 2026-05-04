export interface Training {
  id: string;
  name_course: string;
  contentIslandId: string;
  creationDate: string;
  ciName: string | null;
  ciShortDescription: string | null;
  ciDescription: string | null;
  ciImage: string | null;
}

export interface TrainingDetail {
  id: string;
  name_course: string;
  contentIslandId: string;
  creationDate: string;
  ci: {
    id: string;
    name: string;
    description: string;
    lessons?: Array<{ id: string; name: string }>;
  } | null;
}

export interface CreateTrainingInput {
  name_course: string;
  contentIslandId: string;
}

export interface UpdateTrainingInput {
  name_course?: string;
  contentIslandId?: string;
}
