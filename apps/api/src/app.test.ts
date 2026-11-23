import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "./app.js";

describe("health route", () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
  });

  it("returns service status and a timestamp", async () => {
    app = await createApp({ logger: false });
    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ok",
      service: "kotoba-loop-api",
    });
    expect(Date.parse(response.json().timestamp)).not.toBeNaN();
  });

  it("allows credentialed CORS only from the configured web origin", async () => {
    app = await createApp({ logger: false });

    const trusted = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "http://localhost:5173" },
    });
    const untrusted = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "https://untrusted.example" },
    });

    expect(trusted.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(trusted.headers["access-control-allow-credentials"]).toBe("true");
    expect(untrusted.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("does not expose unexpected server error details", async () => {
    app = await createApp({ logger: false });
    app.get("/test-error", async () => {
      throw new Error("private implementation detail");
    });

    const response = await app.inject({ method: "GET", url: "/test-error" });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    });
  });
});
