import crypto from "node:crypto";
import { parse } from "cookie";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { firebaseRequest } from "./firebase";

const ADMIN_COOKIE = "nbe_admin_session";
const requestStatusSchema = z.enum(["pending", "accepted", "rejected"]);
const watchRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  nationalId: z.string().regex(/^\d{14}$/),
  nationalIdExpiry: z.string().date(),
  birthDate: z.string().date(),
  email: z.string().email().max(320),
  consent: z.literal(true),
  watchId: z.string().max(10).optional(),
});

function signAdminSession(expiresAt: number) {
  const secret = process.env.JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  const payload = String(expiresAt);
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}
function isAdminSessionValid(value?: string) {
  if (!value) return false;
  const [expires, signature] = value.split(".");
  const secret = process.env.JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  const expected = crypto.createHmac("sha256", secret).update(expires).digest("base64url");
  return Boolean(expires && signature && Number(expires) > Date.now() && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)));
}
function hasAdminSession(req: any) { return isAdminSessionValid(parse(req.headers.cookie ?? "")[ADMIN_COOKIE]); }
function cookieHeader(value: string, maxAge: number) { return `${ADMIN_COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`; }
function setAdminCookie(res: any) { res.setHeader("Set-Cookie", cookieHeader(signAdminSession(Date.now() + 8 * 60 * 60 * 1000), 8 * 60 * 60)); }
function clearAdminCookie(res: any) { res.setHeader("Set-Cookie", cookieHeader("", 0)); }
function requireAdmin(ctx: { req: any }) { if (!hasAdminSession(ctx.req)) throw new Error("ADMIN_UNAUTHORIZED"); }

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  admin: router({
    login: publicProcedure.input(z.object({ password: z.string().min(1) })).mutation(({ input, ctx }) => { const configured = process.env.ADMIN_PASSWORD ?? ""; const supplied = Buffer.from(input.password); const expected = Buffer.from(configured); if (!configured || supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) throw new Error("ADMIN_INVALID_PASSWORD"); setAdminCookie(ctx.res); return { success: true }; }),
    logout: publicProcedure.mutation(({ ctx }) => { clearAdminCookie(ctx.res); return { success: true }; }),
    me: publicProcedure.query(({ ctx }) => ({ authenticated: hasAdminSession(ctx.req) })),
    requests: publicProcedure.query(async ({ ctx }) => { requireAdmin(ctx); const data = await firebaseRequest<Record<string, unknown> | null>("watchRequests"); return data ?? {}; }),
    updateRequestStatus: publicProcedure.input(z.object({ requestId: z.string().min(1).max(120), status: requestStatusSchema })).mutation(async ({ input, ctx }) => { requireAdmin(ctx); await firebaseRequest(`watchRequests/${encodeURIComponent(input.requestId)}/status`, "PUT", input.status); return { success: true, requestId: input.requestId, status: input.status }; }),
    visitors: publicProcedure.query(async ({ ctx }) => { requireAdmin(ctx); const data = await firebaseRequest<Record<string, any> | null>("activeVisitors"); const cutoff = Date.now() - 2 * 60 * 1000; return Object.fromEntries(Object.entries(data ?? {}).filter(([, item]) => item?.lastSeenAt && new Date(item.lastSeenAt).getTime() >= cutoff)); }),
  }),
  watch: router({
    submit: publicProcedure.input(watchRequestSchema).mutation(async ({ input, ctx }) => { const key = crypto.randomUUID(); await firebaseRequest(`watchRequests/${key}`, "PUT", { ...input, createdAt: new Date().toISOString(), source: "website" }); return { success: true, requestId: key }; }),
    heartbeat: publicProcedure.input(z.object({ visitorId: z.string().regex(/^[a-zA-Z0-9_-]{16,80}$/), path: z.string().max(120).optional(), language: z.enum(["ar", "en"]).optional() })).mutation(async ({ input }) => { await firebaseRequest(`activeVisitors/${input.visitorId}`, "PUT", { path: input.path ?? "/", language: input.language ?? "ar", lastSeenAt: new Date().toISOString() }); return { success: true }; }),
  }),
});

export type AppRouter = typeof appRouter;
