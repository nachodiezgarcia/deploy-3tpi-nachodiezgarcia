import { ObjectId } from 'mongodb';
import { db } from '#core/db';
import type { SignUpUserDoc, UserDoc } from '#core/db';

const users = () => db.collection<UserDoc>('User');
const signUpUsers = () => db.collection<SignUpUserDoc>('sign-up-users');

export const findUserByEmail = (email: string) => users().findOne({ email });

export const findUserById = (id: string) =>
  users().findOne({ _id: new ObjectId(id) });

export const createUser = (data: Omit<UserDoc, '_id'>) =>
  users().insertOne(data as UserDoc);

export const findSignUpUserByEmail = (email: string) =>
  signUpUsers().findOne({ email });

export const createSignUpUser = (data: Omit<SignUpUserDoc, '_id'>) =>
  signUpUsers().insertOne(data as SignUpUserDoc);

export const deleteSignUpUser = (email: string) =>
  signUpUsers().deleteOne({ email });
