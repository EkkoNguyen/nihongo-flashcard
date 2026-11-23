import { describe, expect, it } from "vitest";
import { isApiHealth } from "./index.js";

describe("isApiHealth", () => {
  it("accepts a valid API health response", () => {
    expect(
      isApiHealth({
        status: "ok",
        service: "kotoba-loop-api",
        timestamp: "2026-11-23T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("rejects incomplete or invalid responses", () => {
    expect(isApiHealth({ status: "ok" })).toBe(false);
    expect(
      isApiHealth({
        status: "down",
        service: "kotoba-loop-api",
        timestamp: "not-a-date",
      }),
    ).toBe(false);
  });
});
