import { describe, expect, it, vi } from "vitest";

const firebaseRequest = vi.fn(async () => ({ ok: true }));
vi.mock("./firebase", () => ({ firebaseRequest }));

const { appRouter } = await import("./routers");

function responseMock() {
  let cookie = "";
  return { setHeader: (_name: string, value: string) => { cookie = value; }, clearCookie: vi.fn(), get cookie() { return cookie; } } as any;
}
function context(req: any, res: any) { return { req, res, user: null } as any; }

describe("Admin and watch router security", () => {
  it("rejects an invalid Admin password", async () => {
    const caller = appRouter.createCaller(context({ headers: { cookie: "" } }, responseMock()));
    await expect(caller.admin.login({ password: "definitely-not-the-password" })).rejects.toThrow();
  });

  it("allows Admin data only after a valid password session", async () => {
    const res = responseMock();
    const loginCaller = appRouter.createCaller(context({ headers: { cookie: "" } }, res));
    await loginCaller.admin.login({ password: process.env.ADMIN_PASSWORD! });
    expect(res.cookie).toContain("nbe_admin_session=");

    const unauthorized = appRouter.createCaller(context({ headers: { cookie: "" } }, responseMock()));
    await expect(unauthorized.admin.requests()).rejects.toThrow("ADMIN_UNAUTHORIZED");
    await expect(unauthorized.admin.visitors()).rejects.toThrow("ADMIN_UNAUTHORIZED");

    const authorized = appRouter.createCaller(context({ headers: { cookie: res.cookie } }, responseMock()));
    await authorized.admin.requests();
    expect(firebaseRequest).toHaveBeenCalledWith("watchRequests");
  });

  it("saves a validated watch request through Firebase", async () => {
    firebaseRequest.mockClear();
    const caller = appRouter.createCaller(context({ headers: { cookie: "" } }, responseMock()));
    const result = await caller.watch.submit({ name: "عميل تجريبي", nationalId: "12345678901234", nationalIdExpiry: "2030-01-01", birthDate: "1990-01-01", email: "customer@gmail.com", consent: true, watchId: "01" });
    expect(result.success).toBe(true);
    expect(firebaseRequest).toHaveBeenCalledWith(expect.stringMatching(/^watchRequests\//), "PUT", expect.objectContaining({ email: "customer@gmail.com", nationalId: "12345678901234" }));
  });
});
