import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('your_database_name'); // Replace with your database name
    const collection = db.collection('donors');

    const result = await collection.insertOne(req.body);

    res.status(201).json({ message: 'Donor registered successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error saving donor data:', error);
    res.status(500).json({ message: 'Error saving donor data', error: error.message });
  }
}

import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('your_database_name'); // Replace with your database name
    const collection = db.collection('donors');

    const result = await collection.insertOne(req.body);

    res.status(201).json({ message: 'Donor registered successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error saving donor data:', error);
    res.status(500).json({ message: 'Error saving donor data', error: error.message });
  }
}