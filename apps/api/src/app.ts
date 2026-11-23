import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { apiHealthSchema } from "@nihongo/shared";
import { config } from "./config.js";

export type AppOptions = {
  logger?: boolean;
  webOrigin?: string;
};

export const createApp = async (
  options: AppOptions = {},
): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: options.logger ?? config.NODE_ENV !== "test",
    bodyLimit: 1_048_576,
  });

  const allowedWebOrigin = options.webOrigin ?? config.WEB_ORIGIN;
  await app.register(cors, {
    origin: (origin, callback) => {
      callback(null, origin === allowedWebOrigin ? origin : false);
    },
    credentials: true,
  });

  app.get(
    "/health",
    {
      schema: { response: { 200: apiHealthSchema } },
    },
    async () => ({
      status: "ok" as const,
      service: "kotoba-loop-api" as const,
      timestamp: new Date().toISOString(),
    }),
  );

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "Request failed");
    const candidateStatus =
      typeof error === "object" && error !== null && "statusCode" in error
        ? error.statusCode
        : undefined;
    const statusCode =
      typeof candidateStatus === "number" && candidateStatus < 500
        ? candidateStatus
        : 500;
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return reply.status(statusCode).send({
      error: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST",
      message: statusCode === 500 ? "An unexpected error occurred." : message,
    });
  });

  return app;
};
