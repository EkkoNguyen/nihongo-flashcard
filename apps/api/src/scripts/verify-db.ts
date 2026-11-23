import { randomUUID } from "node:crypto";
import { config } from "../config.js";
import { connectMongo } from "../db/mongo.js";
import { setupProductCollections } from "../db/schema.js";

const expectedCollections = [
  "decks",
  "cards",
  "reviewStates",
  "reviewLogs",
  "studySessions",
  "deckCopies",
];

if (
  config.NODE_ENV === "production" ||
  !/(?:_dev|_test)$/.test(config.MONGODB_DATABASE)
) {
  throw new Error(
    "Database verification requires a non-production database ending in _dev or _test.",
  );
}

const { client, db } = await connectMongo();

try {
  await setupProductCollections(db);
  await setupProductCollections(db);

  const existingCollections = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map(
      ({ name }) => name,
    ),
  );
  const missingCollections = expectedCollections.filter(
    (name) => !existingCollections.has(name),
  );
  if (missingCollections.length > 0) {
    throw new Error(`Missing collections: ${missingCollections.join(", ")}`);
  }

  const deckIndexes = await db.collection("decks").listIndexes().toArray();
  if (!deckIndexes.some(({ name }) => name === "decks_owner_updated")) {
    throw new Error("Expected deck owner index was not created.");
  }

  const invalidId = `phase0-invalid-${randomUUID()}`;
  let rejectedInvalidDocument = false;
  try {
    await db.collection<{ _id: string }>("decks").insertOne({ _id: invalidId });
  } catch (error) {
    rejectedInvalidDocument =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 121;
  }
  if (!rejectedInvalidDocument) {
    await db.collection<{ _id: string }>("decks").deleteOne({ _id: invalidId });
    throw new Error(
      "MongoDB did not reject a document that violates its schema.",
    );
  }

  console.info(
    `MongoDB setup is idempotent; ${expectedCollections.length} collections and validators are ready in ${db.databaseName}.`,
  );
} finally {
  await client.close();
}
