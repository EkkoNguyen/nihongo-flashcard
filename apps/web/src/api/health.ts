import { isApiHealth, type ApiHealth } from "@nihongo/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const getApiHealth = async (): Promise<ApiHealth> => {
  const response = await fetch(`${apiBaseUrl}/health`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  const payload: unknown = await response.json();
  if (!isApiHealth(payload))
    throw new Error("API returned an invalid health response");
  return payload;
};
