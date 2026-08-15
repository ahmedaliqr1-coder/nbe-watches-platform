import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { BatteryCharging, Globe2, Languages, Menu, Microchip, Smartphone, Wifi, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";
const bannerSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-banner_f4c14ca6.jpg";

const watches = [
  { id: "01", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-01_569110d7.jpg", ar: "ساعة الأهلي الذكية — أخضر ملكي", en: "NBE Smart Watch — Royal Green", accent: "#176b3a" },
  { id: "02", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-02_5a37b8e2.jpg", ar: "ساعة الأهلي الذكية — أسود", en: "NBE Smart Watch — Obsidian", accent: "#24312b" },
  { id: "05", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-05_d9d79cd2.jpg", ar: "ساعة الأهلي الذكية — ستايل", en: "NBE Smart Watch — Style", accent: "#176b3a" },
  { id: "06", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-06_51b646cb.jpg", ar: "ساعة الأهلي الذكية — أكتيف", en: "NBE Smart Watch — Active", accent: "#b17a34" },
  { id: "09", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-09_ae2756e7.jpg", ar: "ساعة الأهلي الذكية — إديشن", en: "NBE Smart Watch — Edition", accent: "#176b3a" },
  { id: "10", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-10_a42d1d9a.jpg", ar: "ساعة الأهلي الذكية — ليجاسي", en: "NBE Smart Watch — Legacy", accent: "#b17a34" },
];


const featureCatalog = [
  { ar: "تدعم جميع اللغات", en: "Supports all languages", icon: Languages },
  { ar: "تدعم جميع أجهزة Apple و Android", en: "Supports all Apple and Android devices", icon: Smartphone },
  { ar: "تدعم الدفع التلامسي", en: "Supports contactless payment", icon: Wifi },
  { ar: "تدعم تقنية eSIM المتطورة", en: "Supports advanced eSIM technology", icon: Microchip },
  { ar: "بطارية قوية تدوم لمدة 14 يوماً", en: "Powerful battery lasting up to 14 days", icon: BatteryCharging },
];

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitorId] = useState(() => { const key = "nbe_visitor_id"; const existing = window.localStorage.getItem(key); if (existing) return existing; const created = `${crypto.randomUUID()}_${Date.now()}`; window.localStorage.setItem(key, created); return created; });
  const heartbeat = trpc.watch.heartbeat.useMutation();
  useEffect(() => { heartbeat.mutate({ visitorId, path: window.location.pathname, language: lang }); const timer = window.setInterval(() => heartbeat.mutate({ visitorId, path: window.location.pathname, language: lang }), 45_000); return () => window.clearInterval(timer); }, [lang, visitorId]);
  const isAr = lang === "ar";
  const copy = useMemo(() => isAr ? {
    eyebrow: "إصدار خاص لعملاء البنك الأهلي المصري", title: "الوقت أصبح جزءًا من تجربتك المصرفية", desc: "ساعات ذكية بتصميم مستوحى من هوية البنك، لتبقى قريبًا من حساباتك واتصالاتك في كل لحظة.", cta: "اطلب ساعتك الآن", collection: "اختر ساعتك", collectionDesc: "مجموعة من التصاميم الذكية التي تجمع بين الحضور العملي والهوية المصرية.", features: "مميزات مصممة ليومك", login: "تسجيل الدخول", menu: "القائمة", admin: "لوحة الإدارة", order: "طلب جديد", footer: "كل لحظة تستحق أن تُعاش بثقة." } : {
    eyebrow: "A special edition for NBE customers", title: "Time is now part of your banking experience", desc: "Smart watches shaped by the bank’s identity, keeping your accounts and connections close at every moment.", cta: "Order your watch", collection: "Find your watch", collectionDesc: "Smart designs that balance everyday function with a distinctly Egyptian identity.", features: "Features designed for your day", login: "Sign in", menu: "Menu", admin: "Admin panel", order: "New request", footer: "Every moment deserves to be lived with confidence."
  }, [isAr]);

  return <div className={isAr ? "site rtl" : "site ltr"} dir={isAr ? "rtl" : "ltr"}>
    <header className="site-header">
      <div className="header-inner">
        <button className="icon-button menu-button" aria-label={copy.menu} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
        <Link href="/" className="brand"><img src={logoSrc} alt="البنك الأهلي المصري" /></Link>
        <div className="header-actions">
          <button className="lang-switch" onClick={() => setLang(isAr ? "en" : "ar")} aria-label="تبديل اللغة"><Globe2 size={17}/><span>{isAr ? "EN" : "العربية"}</span></button>
          <Link href="/login" className="text-link">{copy.login}</Link>
        </div>
      </div>
      {menuOpen && <nav className="mobile-menu"><Link href="#collection" onClick={() => setMenuOpen(false)}>{copy.collection}</Link><Link href="/order" onClick={() => setMenuOpen(false)}>{copy.order}</Link><Link href="/admin" onClick={() => setMenuOpen(false)}>{copy.admin}</Link></nav>}
    </header>

    <main>
      <section className="banner-section" aria-label={isAr ? "إعلان البنك الأهلي" : "NBE campaign banner"}><img src={bannerSrc} alt={isAr ? "حملة البنك الأهلي المصري" : "National Bank of Egypt campaign"} /></section>
      <p className="banner-message">{isAr ? "الساعة الذكية مقدمة من البنك الأهلي المصري هدية مجانية لعملاء البنك. اختر ساعتك الآن." : "The smartwatch is a complimentary gift from the National Bank of Egypt for bank customers. Choose your watch now."}</p>

      <section className="collection-section" id="collection"><div className="section-heading"><div><span className="section-kicker">THE COLLECTION</span><h2>{copy.collection}</h2></div></div><div className="watch-grid">{watches.map((watch, index) => <article className="watch-card" key={watch.id}><div className="watch-image-wrap"><img src={watch.image} alt={isAr ? "صورة ساعة ذكية" : "Smartwatch image"} loading={index > 2 ? "lazy" : "eager"}/></div><ul className="watch-features">{featureCatalog.map((feature) => { const Icon = feature.icon; return <li key={feature.ar}><Icon size={18} strokeWidth={2.2}/><span>{isAr ? feature.ar : feature.en}</span></li>; })}</ul></article>)}</div></section>

    </main>
    <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><img src={logoSrc} alt="National Bank of Egypt"/><p>{copy.footer}</p><p className="footer-address">NBE Tower, 1187 Corniche El Nile St., Boulak, Cairo, Egypt</p></div><div className="footer-column"><h3>{isAr ? "روابط مهمة" : "Important links"}</h3><a href="https://www.nbe.com.eg/NBE/E/#/AR/ContactUs" target="_blank" rel="noreferrer">{isAr ? "تواصل معنا" : "Contact us"}</a><a href="https://www.nbe.com.eg/AssetsManager/cddd7789-a1e7-4722-921c-e48a5e0f3dbc.pdf" target="_blank" rel="noreferrer">{isAr ? "سياسة الخصوصية" : "Privacy policy"}</a><a href="https://www.nbe.com.eg/NBE/E/#/EN/ProductCategory?inParams=%7B%22CategoryID%22:%22AhlyNetEstatementTC%22%7D" target="_blank" rel="noreferrer">{isAr ? "الشروط والأحكام" : "Terms & conditions"}</a></div><div className="footer-column"><h3>{isAr ? "خدمة العملاء" : "Customer service"}</h3><a href="tel:19623">19623 {isAr ? "محليًا" : "Locally"}</a><a href="tel:+20219623">0020219623 {isAr ? "دوليًا" : "International"}</a><a href="mailto:Customer.service@nbe.com.eg">Customer.service@nbe.com.eg</a><Link href="/admin">{copy.admin}</Link></div></div><div className="footer-bottom"><span>© 2026 NBE Watches</span><span>{isAr ? "بيانات التواصل الواردة من الموقع الرسمي للبنك الأهلي المصري" : "Contact details sourced from the official NBE website"}</span></div></footer>
  </div>;
}
