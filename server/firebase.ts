import crypto from "node:crypto";

let cachedToken: { value: string; expiresAt: number } | null = null;

type FirebaseAccount = { client_email: string; private_key: string; token_uri: string; databaseURL?: string };

function account(): FirebaseAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  return JSON.parse(raw) as FirebaseAccount;
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const serviceAccount = account();
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({ iss: serviceAccount.client_email, scope: "https://www.googleapis.com/auth/firebase.database", aud: serviceAccount.token_uri, iat: now, exp: now + 300 }));
  const unsigned = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${base64Url(signer.sign(serviceAccount.private_key))}`;
  const response = await fetch(serviceAccount.token_uri, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }) });
  if (!response.ok) throw new Error(`Firebase token request failed: ${response.status}`);
  const payload = await response.json() as { access_token: string; expires_in?: number };
  cachedToken = { value: payload.access_token, expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000 };
  return payload.access_token;
}

export async function firebaseRequest<T>(path: string, method: "GET" | "PUT" | "POST" = "GET", body?: unknown): Promise<T> {
  const serviceAccount = account();
  const databaseUrl = serviceAccount.databaseURL ?? process.env.FIREBASE_DATABASE_URL;
  if (!databaseUrl) throw new Error("Firebase databaseURL is missing");
  const token = await getAccessToken();
  const response = await fetch(`${databaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}.json?access_token=${encodeURIComponent(token)}`, { method, headers: { "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!response.ok) throw new Error(`Firebase database request failed: ${response.status}`);
  return await response.json() as T;
}
