import { connectMongo } from "../db/mongo.js";
import { setupProductCollections } from "../db/schema.js";

const { client, db } = await connectMongo();

try {
  await setupProductCollections(db);
  console.info(
    `MongoDB indexes and validators are ready for ${db.databaseName}.`,
  );
} finally {
  await client.close();
}
