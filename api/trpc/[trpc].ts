import crypto from "node:crypto";
import { firebaseRequest } from "../../server/firebase-runtime.js";

const ADMIN_COOKIE = "nbe_admin_session";
const MAX_AGE = 8 * 60 * 60;

type VercelRequest = { method?: string; url?: string; headers: Record<string, string | undefined>; body?: unknown };
type VercelResponse = { statusCode?: number; setHeader(name: string, value: string): void; end(body?: string): void };

type Input = Record<string, any>;

function inputFrom(request: VercelRequest): Input {
  if (request.method === "GET") {
    const raw = new URL(request.url ?? "/", "http://localhost").searchParams.get("input");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed?.[0]?.json ?? parsed?.json ?? {};
  }
  const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  return (body as any)?.[0]?.json ?? (body as any)?.json ?? body ?? {};
}

function write(response: VercelResponse, status: number, value: unknown, cookie?: string) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json");
  if (cookie) response.setHeader("set-cookie", cookie);
  response.end(JSON.stringify({ 0: { result: { data: { json: value } } } }));
}

function error(response: VercelResponse, status: number, message: string) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify({ 0: { error: { json: { message, code: status === 401 ? "UNAUTHORIZED" : "INTERNAL_SERVER_ERROR" } } } }));
}

function sessionValue() {
  const expires = Date.now() + MAX_AGE * 1000;
  const secret = process.env.JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  const signature = crypto.createHmac("sha256", secret).update(String(expires)).digest("base64url");
  return `${expires}.${signature}`;
}

function validSession(request: VercelRequest) {
  const cookies = request.headers.cookie ?? "";
  const match = cookies.match(/(?:^|;\s*)nbe_admin_session=([^;]+)/);
  if (!match) return false;
  const [expires, signature] = decodeURIComponent(match[1]).split(".");
  const secret = process.env.JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  const expected = crypto.createHmac("sha256", secret).update(expires).digest("base64url");
  return Boolean(expires && signature && Number(expires) > Date.now() && signature === expected);
}

function sessionCookie(value: string, maxAge = MAX_AGE) {
  return `${ADMIN_COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax; Secure`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const route = new URL(request.url ?? "/", "http://localhost").pathname.split("/").filter(Boolean).pop() ?? "";
  const action = route.includes(".") ? route.slice(route.lastIndexOf(".") + 1) : route;
  try {
    const input = inputFrom(request);
    if (action === "login") {
      const configured = process.env.ADMIN_PASSWORD ?? "";
      if (!configured || input.password !== configured) return error(response, 401, "ADMIN_INVALID_PASSWORD");
      return write(response, 200, { success: true }, sessionCookie(sessionValue()));
    }
    if (action === "logout") return write(response, 200, { success: true }, sessionCookie("", 0));
    if (action === "me") return write(response, 200, { authenticated: validSession(request) });
    if (!validSession(request)) return error(response, 401, "ADMIN_UNAUTHORIZED");
    if (action === "requests") return write(response, 200, (await firebaseRequest<Record<string, unknown> | null>("watchRequests")) ?? {});
    if (action === "visitors") {
      const data = (await firebaseRequest<Record<string, any> | null>("activeVisitors")) ?? {};
      const cutoff = Date.now() - 2 * 60 * 1000;
      return write(response, 200, Object.fromEntries(Object.entries(data).filter(([, item]) => item?.lastSeenAt && new Date(item.lastSeenAt).getTime() >= cutoff)));
    }
    if (action === "heartbeat") {
      await firebaseRequest(`activeVisitors/${encodeURIComponent(input.visitorId)}`, "PUT", { path: input.path ?? "/", language: input.language ?? "ar", lastSeenAt: new Date().toISOString() });
      return write(response, 200, { success: true });
    }
    return error(response, 404, "NOT_FOUND");
  } catch (cause) {
    console.error("Vercel tRPC handler error", cause);
    return error(response, 500, "SERVER_ERROR");
  }
}
