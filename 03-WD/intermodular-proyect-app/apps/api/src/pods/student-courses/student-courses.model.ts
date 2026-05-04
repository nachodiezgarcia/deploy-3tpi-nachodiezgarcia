import { ObjectId } from 'mongodb';
import { db } from '#core/db';
import type { UserDoc } from '#core/db';

const users = () => db.collection<UserDoc>('User');

export const findUserWithTrainings = (userId: string) =>
  users().findOne({ _id: new ObjectId(userId) });

export const countStudentsByCourse = (contentIslandId: string) =>
  users().countDocuments({
    'activeTrainings.contentIslandId': contentIslandId,
  });
