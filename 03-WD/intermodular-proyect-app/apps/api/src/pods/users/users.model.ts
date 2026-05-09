import { ObjectId } from 'mongodb';
import { db } from '#core/db';
import type { UserDoc } from '#core/db';

const users = () => db.collection<UserDoc>('User');

export const findAllUsers = () =>
  users()
    .find({}, { projection: { password: 0 } })
    .toArray();

export const findUserById = (id: string) =>
  users().findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

export const createUser = (data: Omit<UserDoc, '_id'>) =>
  users().insertOne(data as UserDoc);

export const updateUserById = (id: string, data: { name: string }) =>
  users().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: data },
    { returnDocument: 'after', projection: { password: 0 } },
  );
