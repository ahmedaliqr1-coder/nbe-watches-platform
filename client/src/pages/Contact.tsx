import { Globe2, Headphones, Menu, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { siteFlow, toggleLanguage, type SiteLanguage } from "@/siteFlow";
import { useState } from "react";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";

export default function Contact() {
  const [lang, setLang] = useState<SiteLanguage>("ar");
  const isAr = lang === "ar";
  const copy = isAr ? { kicker: "NBE / SUPPORT", title: "كيف يمكننا مساعدتك؟", text: "فريق خدمة العملاء جاهز لمساعدتك والإجابة عن استفساراتك حول الساعات والطلب.", whatsapp: "تواصل عبر WhatsApp", phone: "اتصل بخدمة العملاء", hours: "متاحون يوميًا من 9 صباحًا حتى 9 مساءً", back: "العودة للرئيسية", language: "English" } : { kicker: "NBE / SUPPORT", title: "How can we help?", text: "Our customer care team is ready to help with your watch and request questions.", whatsapp: "Chat on WhatsApp", phone: "Call customer care", hours: "Available daily from 9 AM to 9 PM", back: "Back to home", language: "العربية" };
  return <div className={isAr ? "login-page rtl" : "login-page ltr"} dir={isAr ? "rtl" : "ltr"}><header className="login-header"><Link href={siteFlow.home} className="login-logo"><img src={logoSrc} alt="البنك الأهلي المصري" /></Link><div className="login-actions"><button className="login-language" type="button" onClick={() => setLang(toggleLanguage(lang))}><Globe2 size={16}/>{copy.language}</button><button className="login-menu" type="button" aria-label={isAr ? "القائمة" : "Menu"}><Menu size={30}/></button></div></header><main className="contact-page"><div className="contact-mark"><Headphones size={34}/></div><span className="section-kicker">{copy.kicker}</span><h1>{copy.title}</h1><p>{copy.text}</p><div className="contact-cards"><a className="contact-card whatsapp-card" href={siteFlow.whatsappUrl} target="_blank" rel="noreferrer"><span className="contact-icon"><MessageCircle size={25}/></span><span><strong>{copy.whatsapp}</strong><small>WhatsApp</small></span></a><button className="contact-card" type="button"><span className="contact-icon"><Phone size={25}/></span><span><strong>{copy.phone}</strong><small>{copy.hours}</small></span></button></div><Link href={siteFlow.home} className="login-back-link">{copy.back}</Link></main></div>;
}
