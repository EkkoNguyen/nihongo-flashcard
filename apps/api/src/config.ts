import { z } from "zod";
import { fileURLToPath } from "node:url";

const envFilePath = fileURLToPath(new URL("../../../.env", import.meta.url));

try {
  process.loadEnvFile(envFilePath);
} catch (error) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== "ENOENT"
  ) {
    throw error;
  }
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value.startsWith("mongodb://") ||
        value.startsWith("mongodb+srv://"),
      "MONGODB_URI must use mongodb:// or mongodb+srv://",
    ),
  MONGODB_DATABASE: z.string().default("kotoba_loop_dev"),
});

export const parseConfig = (environment: NodeJS.ProcessEnv) =>
  envSchema.parse(environment);

export const config = parseConfig(process.env);
