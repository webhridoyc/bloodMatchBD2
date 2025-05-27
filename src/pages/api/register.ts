import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

// Replace with your actual MongoDB connection string
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: any | null = null; // You might want to use a more specific type here

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!); // Use non-null assertion as we check above
  await client.connect();

  const db = client.db(); // Defaults to the database specified in the URI

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, bloodGroup, location, contact } = req.body;

  if (!name || !bloodGroup || !location || !contact) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const { db } = await connectToDatabase();
    const donorsCollection = db.collection('donors');

    const result = await donorsCollection.insertOne({
      name,
      bloodGroup,
      location,
      contact,
      createdAt: new Date(), // Optional: Add a timestamp
    });

    res.status(201).json({ message: 'Donor registered!', id: result.insertedId });
  } catch (error) {
    console.error('Error saving donor:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}