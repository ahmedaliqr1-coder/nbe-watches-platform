export const siteFlow = {
  home: "/",
  order: "/order",
  login: "/login",
  otp: "/otp",
  contact: "/contact",
  admin: "/admin",
  whatsappUrl: "https://wa.me/?text=مرحبًا، أحتاج إلى التواصل مع خدمة العملاء",
  selectedWatchStorageKey: "nbe_selected_watch",
  requestNameStorageKey: "nbe_request_name",
} as const;

export type SiteLanguage = "ar" | "en";
export type RequestStatus = "pending" | "accepted" | "rejected";

export const requestStatusLabels: Record<RequestStatus, { ar: string; en: string }> = {
  pending: { ar: "قيد المراجعة", en: "Pending" },
  accepted: { ar: "مقبول", en: "Accepted" },
  rejected: { ar: "مرفوض", en: "Rejected" },
};

export const toggleLanguage = (language: SiteLanguage): SiteLanguage => language === "ar" ? "en" : "ar";

export const formatLoginGreeting = (name: string, language: SiteLanguage): string => {
  const cleanName = name.trim();
  if (!cleanName) return language === "ar" ? "أهلاً بك في تجربة الأهلي" : "Welcome to the NBE experience";
  return language === "ar" ? `أهلًا بك يا ${cleanName}` : `Welcome, ${cleanName}`;
};

export function selectWatch(watchId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(siteFlow.selectedWatchStorageKey, watchId);
  } catch {
    // Selection remains visual-only if browser storage is unavailable.
  }
}

export function getSelectedWatchId(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(siteFlow.selectedWatchStorageKey) ?? "";
  } catch {
    return "";
  }
}

export function saveRequestName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(siteFlow.requestNameStorageKey, name.trim());
  } catch {
    // The visual flow remains usable without session storage.
  }
}

/** UI-only navigation helper. It deliberately carries no credentials, OTP, or form data. */
export const nextVisualStep = (step: "order" | "login" | "otp"): string => ({ order: siteFlow.login, login: siteFlow.otp, otp: siteFlow.contact })[step];
