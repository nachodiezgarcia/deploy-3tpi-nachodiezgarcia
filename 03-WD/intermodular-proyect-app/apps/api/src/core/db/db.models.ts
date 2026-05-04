import type { ObjectId } from 'mongodb';

export interface UserDoc {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  rol: 'student' | 'admin';
  activeTrainings: Array<{
    contentIslandId: string;
    name_course: string;
  }>;
}

export interface SignUpUserDoc {
  _id: ObjectId;
  email: string;
  name: string;
  rol: 'student' | 'admin';
  coursesToAssign: Array<{ contentIslandId: string; name_course: string }>;
  verificationCode: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface TrainingDoc {
  _id: ObjectId;
  name_course: string;
  contentIslandId: string;
  creationDate: Date;
}
