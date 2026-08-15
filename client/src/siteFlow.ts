export const siteFlow = {
  home: "/",
  order: "/order",
  login: "/login",
  otp: "/otp",
  contact: "/contact",
  admin: "/admin",
  whatsappUrl: "https://wa.me/?text=مرحبًا، أحتاج إلى التواصل مع خدمة العملاء",
} as const;

export type SiteLanguage = "ar" | "en";
export const toggleLanguage = (language: SiteLanguage): SiteLanguage => language === "ar" ? "en" : "ar";

/** UI-only navigation helper. It deliberately carries no credentials, OTP, or form data. */
export const nextVisualStep = (step: "order" | "login" | "otp"): string => ({ order: siteFlow.login, login: siteFlow.otp, otp: siteFlow.contact })[step];
