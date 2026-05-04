import { createInterface } from 'node:readline/promises';
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

const url = process.env['MONGODB_URL'];
if (!url) throw new Error('Missing MONGODB_URL — copy .env.example to .env');

const client = new MongoClient(url);
const rl = createInterface({ input: process.stdin, output: process.stdout });

try {
  await client.connect();
  console.log('Connected to MongoDB\n');

  const name = (await rl.question('Name:     ')).trim();
  const email = (await rl.question('Email:    ')).trim();
  const password = (await rl.question('Password: ')).trim();

  if (!name || !email || !password) {
    console.error('All fields are required');
    process.exit(1);
  }

  const db = client.db();
  const users = db.collection('User');

  const existing = await users.findOne({ email });
  if (existing) {
    console.error(`User '${email}' already exists`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await users.insertOne({
    _id: new ObjectId(),
    name,
    email,
    password: hashedPassword,
    isActive: true,
    rol: 'admin',
    activeTrainings: [],
  });

  console.log(`\nAdmin '${email}' created successfully`);
} finally {
  rl.close();
  await client.close();
}
