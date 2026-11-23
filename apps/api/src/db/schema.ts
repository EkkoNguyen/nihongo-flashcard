import type { Collection, Db, Document, IndexDescription } from "mongodb";

type CollectionDefinition = {
  name: string;
  validator: Document;
  indexes: IndexDescription[];
};

const collectionDefinitions: CollectionDefinition[] = [
  {
    name: "decks",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["ownerId", "title", "visibility", "createdAt", "updatedAt"],
        properties: {
          ownerId: { bsonType: "string" },
          title: { bsonType: "string", minLength: 1, maxLength: 120 },
          visibility: { enum: ["private", "public"] },
          tags: { bsonType: "array", items: { bsonType: "string" } },
          jlptLevel: { bsonType: ["string", "null"], pattern: "^N[1-5]$" },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" },
        },
      },
    },
    indexes: [
      { key: { ownerId: 1, updatedAt: -1 }, name: "decks_owner_updated" },
      {
        key: { visibility: 1, jlptLevel: 1, updatedAt: -1 },
        name: "decks_public_discovery",
      },
    ],
  },
  {
    name: "cards",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "ownerId",
          "deckId",
          "cardType",
          "position",
          "content",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          ownerId: { bsonType: "string" },
          deckId: { bsonType: "string" },
          cardType: { enum: ["vocabulary", "kanji", "grammar"] },
          position: { bsonType: "int", minimum: 0 },
          content: { bsonType: "object" },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" },
        },
      },
    },
    indexes: [
      { key: { deckId: 1, position: 1 }, name: "cards_deck_position" },
      { key: { ownerId: 1, deckId: 1, _id: 1 }, name: "cards_owner_deck" },
    ],
  },
  {
    name: "reviewStates",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "userId",
          "deckId",
          "cardId",
          "direction",
          "dueAt",
          "updatedAt",
        ],
        properties: {
          userId: { bsonType: "string" },
          deckId: { bsonType: "string" },
          cardId: { bsonType: "string" },
          direction: { bsonType: "string", minLength: 1 },
          dueAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" },
        },
      },
    },
    indexes: [
      {
        key: { userId: 1, cardId: 1, direction: 1 },
        unique: true,
        name: "review_state_user_card_direction_unique",
      },
      {
        key: { userId: 1, deckId: 1, dueAt: 1 },
        name: "review_state_due_queue",
      },
    ],
  },
  {
    name: "reviewLogs",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "userId",
          "deckId",
          "cardId",
          "direction",
          "rating",
          "reviewedAt",
        ],
        properties: {
          userId: { bsonType: "string" },
          deckId: { bsonType: "string" },
          cardId: { bsonType: "string" },
          direction: { bsonType: "string" },
          rating: { enum: ["again", "hard", "good", "easy"] },
          reviewedAt: { bsonType: "date" },
        },
      },
    },
    indexes: [
      { key: { userId: 1, reviewedAt: -1 }, name: "review_logs_user_time" },
      {
        key: { userId: 1, deckId: 1, reviewedAt: -1 },
        name: "review_logs_deck_time",
      },
    ],
  },
  {
    name: "studySessions",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "deckId", "mode", "status", "createdAt"],
        properties: {
          userId: { bsonType: "string" },
          deckId: { bsonType: "string" },
          mode: { bsonType: "string" },
          status: { enum: ["active", "completed", "abandoned"] },
          createdAt: { bsonType: "date" },
        },
      },
    },
    indexes: [
      {
        key: { userId: 1, status: 1, createdAt: -1 },
        name: "study_sessions_user_status",
      },
    ],
  },
  {
    name: "deckCopies",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "sourceDeckId", "destinationDeckId", "copiedAt"],
        properties: {
          userId: { bsonType: "string" },
          sourceDeckId: { bsonType: "string" },
          destinationDeckId: { bsonType: "string" },
          copiedAt: { bsonType: "date" },
        },
      },
    },
    indexes: [
      { key: { userId: 1, sourceDeckId: 1 }, name: "deck_copies_user_source" },
    ],
  },
];

const collectionExists = async (db: Db, name: string): Promise<boolean> => {
  const collections = await db
    .listCollections({ name }, { nameOnly: true })
    .toArray();
  return collections.length > 0;
};

export const getProductCollections = (db: Db): Record<string, Collection> =>
  Object.fromEntries(
    collectionDefinitions.map(({ name }) => [name, db.collection(name)]),
  );

export const setupProductCollections = async (db: Db): Promise<void> => {
  for (const definition of collectionDefinitions) {
    if (await collectionExists(db, definition.name)) {
      await db.command({
        collMod: definition.name,
        validator: definition.validator,
        validationLevel: "moderate",
        validationAction: "error",
      });
    } else {
      await db.createCollection(definition.name, {
        validator: definition.validator,
        validationLevel: "moderate",
        validationAction: "error",
      });
    }
    await db.collection(definition.name).createIndexes(definition.indexes);
  }
};
