import { describe, expect, it } from "vitest";
import { parseConfig } from "./config.js";

describe("environment configuration", () => {
  it("provides safe local defaults", () => {
    expect(parseConfig({})).toMatchObject({
      NODE_ENV: "development",
      API_HOST: "0.0.0.0",
      API_PORT: 3000,
      WEB_ORIGIN: "http://localhost:5173",
      MONGODB_DATABASE: "kotoba_loop_dev",
    });
  });

  it("rejects invalid ports and non-MongoDB connection URLs", () => {
    expect(() => parseConfig({ API_PORT: "not-a-port" })).toThrow();
    expect(() =>
      parseConfig({ MONGODB_URI: "https://example.invalid/database" }),
    ).toThrow(/MONGODB_URI/);
  });
});
