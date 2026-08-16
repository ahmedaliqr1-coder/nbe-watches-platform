import { describe, expect, it } from "vitest";
import { formatLoginGreeting, nextVisualStep, requestStatusLabels, toggleLanguage } from "./siteFlow";

describe("visual login flow", () => {
  it("formats the request name in Arabic and English greetings", () => {
    expect(formatLoginGreeting(" أحمد علي ", "ar")).toBe("أهلًا بك يا أحمد علي");
    expect(formatLoginGreeting("Ahmed Ali", "en")).toBe("Welcome, Ahmed Ali");
    expect(formatLoginGreeting("", "ar")).toBe("أهلاً بك في تجربة الأهلي");
  });

  it("exposes safe request status labels for the admin workflow", () => {
    expect(requestStatusLabels.pending.ar).toBe("قيد المراجعة");
    expect(requestStatusLabels.accepted.en).toBe("Accepted");
    expect(requestStatusLabels.rejected.ar).toBe("مرفوض");
  });

  it("keeps the visual-only route sequence intact", () => {
    expect(nextVisualStep("order")).toBe("/login");
    expect(nextVisualStep("login")).toBe("/otp");
    expect(nextVisualStep("otp")).toBe("/contact");
    expect(toggleLanguage("ar")).toBe("en");
  });
});
