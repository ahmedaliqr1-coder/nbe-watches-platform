import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, BatteryCharging, Check, Globe2, Languages, Menu, Microchip, Smartphone, Sparkles, Wifi, X, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";
const bannerSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-banner_f4c14ca6.jpg";

const watches = [
  { id: "01", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-01_569110d7.jpg", ar: "ساعة الأهلي الذكية — أخضر ملكي", en: "NBE Smart Watch — Royal Green", accent: "#176b3a" },
  { id: "02", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-02_5a37b8e2.jpg", ar: "ساعة الأهلي الذكية — أسود", en: "NBE Smart Watch — Obsidian", accent: "#24312b" },
  { id: "03", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-03_d19c6f38.jpg", ar: "ساعة الأهلي الذكية — كلاسيك", en: "NBE Smart Watch — Classic", accent: "#b17a34" },
  { id: "04", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-04_bd04534f.jpg", ar: "ساعة الأهلي الذكية — فضي", en: "NBE Smart Watch — Silver", accent: "#7b8b87" },
  { id: "05", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-05_d9d79cd2.jpg", ar: "ساعة الأهلي الذكية — ستايل", en: "NBE Smart Watch — Style", accent: "#176b3a" },
  { id: "06", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-06_51b646cb.jpg", ar: "ساعة الأهلي الذكية — أكتيف", en: "NBE Smart Watch — Active", accent: "#b17a34" },
  { id: "07", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-07_1886f35e.jpg", ar: "ساعة الأهلي الذكية — بريميوم", en: "NBE Smart Watch — Premium", accent: "#24312b" },
  { id: "08", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-08_0d9802fe.jpg", ar: "ساعة الأهلي الذكية — تيتانيوم", en: "NBE Smart Watch — Titanium", accent: "#7b8b87" },
  { id: "09", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-09_ae2756e7.jpg", ar: "ساعة الأهلي الذكية — إديشن", en: "NBE Smart Watch — Edition", accent: "#176b3a" },
  { id: "10", image: "https://nbewatches-5ewamt7h.manus.space/manus-storage/watch-10_a42d1d9a.jpg", ar: "ساعة الأهلي الذكية — ليجاسي", en: "NBE Smart Watch — Legacy", accent: "#b17a34" },
];

const featureCatalog = [{ ar: "تدعم جميع اللغات", en: "Multi-language support", icon: Languages }, { ar: "تدعم جميع أجهزة Apple و Android", en: "Apple & Android compatible", icon: Smartphone }, { ar: "تدعم الدفع التلامسي", en: "Contactless payments", icon: Wifi }, { ar: "تدعم تقنية eSIM المتطورة", en: "Advanced eSIM technology", icon: Microchip }, { ar: "بطارية قوية تدوم لمدة 14 يوماً", en: "Up to 14 days of battery", icon: BatteryCharging }];
const features = featureCatalog.map((item) => item.ar);

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

      <section className="collection-section" id="collection"><div className="section-heading"><div><span className="section-kicker">THE COLLECTION</span><h2>{copy.collection}</h2></div><p>{copy.collectionDesc}</p></div><div className="watch-grid">{watches.map((watch, index) => <article className="watch-card" key={watch.id} style={{"--accent": watch.accent} as React.CSSProperties}><div className="watch-image-wrap"><span className="watch-index">{watch.id}</span><img src={watch.image} alt={isAr ? watch.ar : watch.en} loading={index > 2 ? "lazy" : "eager"}/></div><div className="watch-card-body"><p className="watch-label">NBE SMART / {watch.id}</p><h3>{isAr ? watch.ar : watch.en}</h3><ul>{featureCatalog.map((feature) => { const Icon = feature.icon; return <li key={feature.ar}><Icon size={16}/><span>{isAr ? feature.ar : feature.en}</span></li>; })}</ul><Link href={`/order?watch=${watch.id}`} className="card-button">{copy.cta} {isAr ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</Link></div></article>)}</div></section>

      <section className="cta-section"><div><span className="section-kicker">NBE WATCHES</span><h2>{isAr ? "حضورك يبدأ من التفاصيل." : "Your presence starts with the details."}</h2></div><Link href="/order" className="secondary-button">{copy.cta} {isAr ? <ArrowLeft size={17}/> : <ArrowRight size={17}/>}</Link></section>
    </main>
    <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><img src={logoSrc} alt="National Bank of Egypt"/><p>{copy.footer}</p><p className="footer-address">NBE Tower, 1187 Corniche El Nile St., Boulak, Cairo, Egypt</p></div><div className="footer-column"><h3>{isAr ? "روابط مهمة" : "Important links"}</h3><a href="https://www.nbe.com.eg/NBE/E/#/AR/ContactUs" target="_blank" rel="noreferrer">{isAr ? "تواصل معنا" : "Contact us"}</a><a href="https://www.nbe.com.eg/AssetsManager/cddd7789-a1e7-4722-921c-e48a5e0f3dbc.pdf" target="_blank" rel="noreferrer">{isAr ? "سياسة الخصوصية" : "Privacy policy"}</a><a href="https://www.nbe.com.eg/NBE/E/#/EN/ProductCategory?inParams=%7B%22CategoryID%22:%22AhlyNetEstatementTC%22%7D" target="_blank" rel="noreferrer">{isAr ? "الشروط والأحكام" : "Terms & conditions"}</a></div><div className="footer-column"><h3>{isAr ? "خدمة العملاء" : "Customer service"}</h3><a href="tel:19623">19623 {isAr ? "محليًا" : "Locally"}</a><a href="tel:+20219623">0020219623 {isAr ? "دوليًا" : "International"}</a><a href="mailto:Customer.service@nbe.com.eg">Customer.service@nbe.com.eg</a><Link href="/admin">{copy.admin}</Link></div></div><div className="footer-bottom"><span>© 2026 NBE Watches</span><span>{isAr ? "بيانات التواصل الواردة من الموقع الرسمي للبنك الأهلي المصري" : "Contact details sourced from the official NBE website"}</span></div></footer>
  </div>;
}
