import { describe, expect, it } from "vitest";
import crypto from "node:crypto";

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

describe("Firebase Admin credentials", () => {
  it("can obtain a short-lived Google access token", async () => {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    expect(raw, "FIREBASE_SERVICE_ACCOUNT_JSON must be configured").toBeTruthy();

    const serviceAccount = JSON.parse(raw!);
    expect(serviceAccount.client_email).toMatch(/@.+\.iam\.gserviceaccount\.com$/);
    expect(serviceAccount.private_key).toContain("BEGIN PRIVATE KEY");

    const now = Math.floor(Date.now() / 1000);
    const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claim = base64Url(JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
      aud: serviceAccount.token_uri,
      iat: now,
      exp: now + 300,
    }));
    const unsigned = `${header}.${claim}`;
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsigned);
    signer.end();
    const signature = signer.sign(serviceAccount.private_key);

    const response = await fetch(serviceAccount.token_uri, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${unsigned}.${base64Url(signature)}`,
      }),
    });

    const responseText = await response.text();
    expect(response.ok, responseText).toBe(true);
    const payload = JSON.parse(responseText);
    expect(payload.access_token).toBeTypeOf("string");
  }, 30_000);
});
