import { MongoClient, type Db } from "mongodb";
import { config } from "../config.js";

export type MongoConnection = {
  client: MongoClient;
  db: Db;
};

export const connectMongo = async (
  uri = config.MONGODB_URI,
  databaseName = config.MONGODB_DATABASE,
): Promise<MongoConnection> => {
  if (!uri) throw new Error("MONGODB_URI is required for database operations.");

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5_000 });
  try {
    await client.connect();
    await client.db(databaseName).command({ ping: 1 });
  } catch (error) {
    await client.close();
    throw error;
  }

  return { client, db: client.db(databaseName) };
};
