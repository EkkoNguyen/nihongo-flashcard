export type ApiHealth = {
  status: "ok";
  service: "kotoba-loop-api";
  timestamp: string;
};

export const apiHealthSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "service", "timestamp"],
  properties: {
    status: { const: "ok" },
    service: { const: "kotoba-loop-api" },
    timestamp: { type: "string", format: "date-time" },
  },
} as const;

export const isApiHealth = (value: unknown): value is ApiHealth => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.status === "ok" &&
    candidate.service === "kotoba-loop-api" &&
    typeof candidate.timestamp === "string" &&
    !Number.isNaN(Date.parse(candidate.timestamp))
  );
};
