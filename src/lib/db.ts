import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://bloodlink_user:YOUR_ACTUAL_PASSWORD@cluster0.hvcy6rd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const defaultUriWithPassword = "mongodb+srv://bloodlink_user:Hridoy007@cluster0.hvcy6rd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // CONSIDER USING ENVIRONMENT VARIABLES FOR SECURITY
if (uri.includes('YOUR_ACTUAL_PASSWORD') || defaultUriWithPassword.includes('Hridoy007')) { // Modified warning to include the new hardcoded password
  console.warn('Warning: Replace "YOUR_ACTUAL_PASSWORD" in the MongoDB connection string with your actual database password or use an environment variable.');
}

let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI || defaultUriWithPassword);
    await client.connect();
    const db = client.db(); // Replace with your database name if needed
    cachedDb = db;
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to the database.');
  }
}