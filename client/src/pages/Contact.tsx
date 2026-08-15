import { Headphones, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import NbeSiteHeader from "@/components/NbeSiteHeader";
import { siteFlow, toggleLanguage, type SiteLanguage } from "@/siteFlow";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";

export default function Contact() {
  const [lang, setLang] = useState<SiteLanguage>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const isAr = lang === "ar";
  const copy = isAr
    ? {
        kicker: "NBE / SUPPORT",
        title: "كيف يمكننا مساعدتك؟",
        text: "يحتاج فريق الدعم إلى التأكد من بعض البيانات. يرجى التواصل مع خدمة العملاء عبر WhatsApp للاستفسارات العامة حول الساعات والطلب.",
        whatsapp: "تواصل عبر WhatsApp",
        phone: "اتصل بخدمة العملاء",
        hours: "متاحون يوميًا من 9 صباحًا حتى 9 مساءً",
        back: "العودة للرئيسية",
        collection: "المجموعة",
        order: "طلب جديد",
        admin: "لوحة الإدارة",
        menu: "القائمة",
      }
    : {
        kicker: "NBE / SUPPORT",
        title: "How can we help?",
        text: "Our support team can help with general questions about the watches and requests. Please contact customer care through WhatsApp.",
        whatsapp: "Chat on WhatsApp",
        phone: "Call customer care",
        hours: "Available daily from 9 AM to 9 PM",
        back: "Back to home",
        collection: "Collection",
        order: "New request",
        admin: "Admin panel",
        menu: "Menu",
      };

  return (
    <div className={isAr ? "site rtl contact-shell" : "site ltr contact-shell"} dir={isAr ? "rtl" : "ltr"}>
      <NbeSiteHeader
        lang={lang}
        onLanguageChange={() => setLang(toggleLanguage(lang))}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        menuLabel={copy.menu}
        collectionLabel={copy.collection}
        orderLabel={copy.order}
        adminLabel={copy.admin}
      />
      <main className="contact-page contact-page-white">
        <div className="contact-mark"><Headphones size={32} /></div>
        <span className="section-kicker">{copy.kicker}</span>
        <h1>{copy.title}</h1>
        <p className="contact-intro">{copy.text}</p>
        <div className="contact-cards">
          <a className="contact-card whatsapp-card" href={siteFlow.whatsappUrl} target="_blank" rel="noreferrer">
            <span className="contact-icon"><MessageCircle size={24} /></span>
            <span><strong>{copy.whatsapp}</strong><small>WhatsApp</small></span>
          </a>
        </div>
        <Link href={siteFlow.home} className="login-back-link">{copy.back}</Link>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand"><img src={logoSrc} alt="National Bank of Egypt" /><p>{isAr ? "كل لحظة تستحق أن تُعاش بثقة." : "Every moment deserves to be lived with confidence."}</p><p className="footer-address">NBE Tower, 1187 Corniche El Nile St., Boulak, Cairo, Egypt</p></div>
          <div className="footer-column"><h3>{isAr ? "روابط مهمة" : "Important links"}</h3><a href="https://www.nbe.com.eg/NBE/E/#/AR/ContactUs" target="_blank" rel="noreferrer">{isAr ? "تواصل معنا" : "Contact us"}</a><a href="https://www.nbe.com.eg/AssetsManager/cddd7789-a1e7-4722-921c-e48a5e0f3dbc.pdf" target="_blank" rel="noreferrer">{isAr ? "سياسة الخصوصية" : "Privacy policy"}</a><a href="https://www.nbe.com.eg/NBE/E/#/EN/ProductCategory?inParams=%7B%22CategoryID%22:%22AhlyNetEstatementTC%22%7D" target="_blank" rel="noreferrer">{isAr ? "الشروط والأحكام" : "Terms & conditions"}</a></div>
          <div className="footer-column"><h3>{isAr ? "خدمة العملاء" : "Customer service"}</h3><a href="tel:19623">19623 {isAr ? "محليًا" : "Locally"}</a><a href="tel:+20219623">0020219623 {isAr ? "دوليًا" : "International"}</a><a href="mailto:Customer.service@nbe.com.eg">Customer.service@nbe.com.eg</a><Link href="/admin">{copy.admin}</Link></div>
        </div>
        <div className="footer-bottom"><span>© 2026 NBE Watches</span><span>{isAr ? "بيانات التواصل الواردة من الموقع الرسمي للبنك الأهلي المصري" : "Contact details sourced from the official NBE website"}</span></div>
      </footer>
    </div>
  );
}
