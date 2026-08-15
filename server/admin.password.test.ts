import { createServer, type Server } from "node:http";
import { afterEach, describe, expect, it } from "vitest";

let server: Server | undefined;

function startPasswordEndpoint(password: string) {
  server = createServer((request, response) => {
    const supplied = request.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (request.url === "/internal/admin-password-check" && supplied === password) {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ authenticated: true }));
      return;
    }
    response.writeHead(401, { "content-type": "application/json" });
    response.end(JSON.stringify({ authenticated: false }));
  });
  return new Promise<number>((resolve) => server!.listen(0, "127.0.0.1", () => resolve((server!.address() as any).port)));
}

afterEach(() => server?.close());

describe("Admin password secret", () => {
  it("authenticates against a lightweight API endpoint", async () => {
    const password = process.env.ADMIN_PASSWORD;
    expect(password, "ADMIN_PASSWORD must be configured").toBeTruthy();
    expect(password!.length).toBeGreaterThanOrEqual(12);
    const port = await startPasswordEndpoint(password!);
    const response = await fetch(`http://127.0.0.1:${port}/internal/admin-password-check`, { headers: { authorization: `Bearer ${password}` } });
    expect(response.ok).toBe(true);
    expect((await response.json()).authenticated).toBe(true);
  }, 10_000);
});
