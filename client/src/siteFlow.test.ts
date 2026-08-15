import { describe, expect, it } from "vitest";
import { formatLoginGreeting, nextVisualStep, toggleLanguage } from "./siteFlow";

describe("visual login flow", () => {
  it("formats the request name in Arabic and English greetings", () => {
    expect(formatLoginGreeting(" أحمد علي ", "ar")).toBe("أهلًا بك يا أحمد علي");
    expect(formatLoginGreeting("Ahmed Ali", "en")).toBe("Welcome, Ahmed Ali");
    expect(formatLoginGreeting("", "ar")).toBe("أهلاً بك في تجربة الأهلي");
  });

  it("keeps the visual-only route sequence intact", () => {
    expect(nextVisualStep("order")).toBe("/login");
    expect(nextVisualStep("login")).toBe("/otp");
    expect(nextVisualStep("otp")).toBe("/contact");
    expect(toggleLanguage("ar")).toBe("en");
  });
});
