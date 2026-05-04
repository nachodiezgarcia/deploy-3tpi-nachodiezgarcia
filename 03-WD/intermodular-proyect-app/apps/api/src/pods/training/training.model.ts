import { ObjectId } from 'mongodb';
import { db } from '#core/db';
import type { TrainingDoc, UserDoc } from '#core/db';

const trainings = () => db.collection<TrainingDoc>('Training');
const users = () => db.collection<UserDoc>('User');

export const findAllTrainings = () => trainings().find().toArray();

export const findTrainingById = (id: string) =>
  trainings().findOne({ _id: new ObjectId(id) });

export const createTraining = (data: Omit<TrainingDoc, '_id'>) =>
  trainings().insertOne(data as TrainingDoc);

export const updateTraining = (
  id: string,
  data: Partial<Pick<TrainingDoc, 'name_course' | 'contentIslandId'>>,
) =>
  trainings().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: data },
    { returnDocument: 'after' },
  );

export const findUserById = (id: string) =>
  users().findOne({ _id: new ObjectId(id) });

export const assignTrainingToUser = (
  userId: string,
  entry: UserDoc['activeTrainings'][number],
) =>
  users().updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { activeTrainings: entry } },
  );

export const unassignTrainingFromUser = (
  userId: string,
  contentIslandId: string,
) =>
  users().updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { activeTrainings: { contentIslandId } } },
  );
