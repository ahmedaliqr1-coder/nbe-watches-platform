import { BatteryCharging, Languages, Microchip, Smartphone, Wifi } from "lucide-react";

export const watchCatalog = [
  { id: "01", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-01_569110d7.jpg", ar: "ساعة الأهلي الذكية — أخضر ملكي", en: "NBE Smart Watch — Royal Green", accent: "#176b3a" },
  { id: "02", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-02_5a37b8e2.jpg", ar: "ساعة الأهلي الذكية — أسود", en: "NBE Smart Watch — Obsidian", accent: "#24312b" },
  { id: "05", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-05_d9d79cd2.jpg", ar: "ساعة الأهلي الذكية — ستايل", en: "NBE Smart Watch — Style", accent: "#176b3a" },
  { id: "06", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-06_51b646cb.jpg", ar: "ساعة الأهلي الذكية — أكتيف", en: "NBE Smart Watch — Active", accent: "#b17a34" },
  { id: "09", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-09_ae2756e7.jpg", ar: "ساعة الأهلي الذكية — إديشن", en: "NBE Smart Watch — Edition", accent: "#176b3a" },
  { id: "10", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-10_a42d1d9a.jpg", ar: "ساعة الأهلي الذكية — ليجاسي", en: "NBE Smart Watch — Legacy", accent: "#b17a34" },
] as const;

export const featureCatalog = [
  { ar: "تدعم جميع اللغات", en: "Supports all languages", icon: Languages },
  { ar: "تدعم جميع أجهزة Apple و Android", en: "Supports all Apple and Android devices", icon: Smartphone },
  { ar: "تدعم الدفع التلامسي", en: "Supports contactless payment", icon: Wifi },
  { ar: "تدعم تقنية eSIM المتطورة", en: "Supports advanced eSIM technology", icon: Microchip },
  { ar: "بطارية قوية تدوم لمدة 14 يوماً", en: "Powerful battery lasting up to 14 days", icon: BatteryCharging },
] as const;
