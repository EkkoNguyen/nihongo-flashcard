import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.js";

describe("app shell", () => {
  it("renders the first-run learning dashboard", () => {
    const html = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>,
    );
    expect(html).toContain("Kotoba Loop");
    expect(html).toContain("Tạo bộ thẻ đầu tiên");
    expect(html).toContain("Bộ thẻ của tôi");
  });
});
