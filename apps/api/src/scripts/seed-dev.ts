import { connectMongo } from "../db/mongo.js";
import { config } from "../config.js";
import type { Document } from "mongodb";

type StringIdDocument = Document & { _id: string };

if (
  config.NODE_ENV === "production" ||
  !config.MONGODB_DATABASE.endsWith("_dev")
) {
  throw new Error(
    "The development seed script requires a non-production database ending in _dev.",
  );
}

const { client, db } = await connectMongo();
const now = new Date();
const deckId = "seed-public-n5-basics";
const ownerId = "seed-author-kotoba-loop";

try {
  await db.collection<StringIdDocument>("decks").updateOne(
    { _id: deckId },
    {
      $setOnInsert: {
        ownerId,
        title: "Từ vựng N5 cơ bản",
        description: "Bộ mẫu để thử luồng khám phá và ôn tập.",
        visibility: "public",
        jlptLevel: "N5",
        tags: ["JLPT", "từ vựng", "mẫu"],
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  const examples = [
    { japanese: "水", reading: "みず", meaning: "nước" },
    { japanese: "学校", reading: "がっこう", meaning: "trường học" },
    { japanese: "友達", reading: "ともだち", meaning: "bạn bè" },
  ];

  for (const [position, content] of examples.entries()) {
    await db.collection<StringIdDocument>("cards").updateOne(
      { _id: `${deckId}-${position + 1}` },
      {
        $setOnInsert: {
          ownerId,
          deckId,
          cardType: "vocabulary",
          position,
          content: { ...content, kanji: content.japanese },
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    );
  }

  console.info(`Seeded one public example deck with ${examples.length} cards.`);
} finally {
  await client.close();
}
