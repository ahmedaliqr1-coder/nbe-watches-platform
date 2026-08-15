import { FormEvent, useState } from "react";
import { ArrowLeft, Globe2, Menu, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { nextVisualStep, siteFlow, toggleLanguage, type SiteLanguage } from "@/siteFlow";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";

export default function Otp() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<SiteLanguage>("ar");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const isAr = lang === "ar";
  const copy = isAr ? { title: "أدخل رمز التحقق", subtitle: "أدخل الرمز المكوّن من 6 أرقام للمتابعة", hint: "هذه واجهة شكلية فقط، ولن يتم التحقق من الرمز حاليًا.", submit: "متابعة", back: "العودة لتسجيل الدخول", language: "English" } : { title: "Enter verification code", subtitle: "Enter the 6-digit code to continue", hint: "This is a visual-only interface; the code is not verified at this stage.", submit: "Continue", back: "Back to sign in", language: "العربية" };
  function update(index: number, value: string) { const next = [...code]; next[index] = value.replace(/\D/g, "").slice(-1); setCode(next); if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus(); }
  function submit(event: FormEvent) { event.preventDefault(); navigate(nextVisualStep("otp")); }
  return <div className={isAr ? "login-page rtl" : "login-page ltr"} dir={isAr ? "rtl" : "ltr"}><header className="login-header"><Link href={siteFlow.home} className="login-logo"><img src={logoSrc} alt="البنك الأهلي المصري" /></Link><div className="login-actions"><button className="login-language" type="button" onClick={() => setLang(toggleLanguage(lang))}><Globe2 size={16}/>{copy.language}</button><button className="login-menu" type="button" aria-label={isAr ? "القائمة" : "Menu"}><Menu size={30}/></button></div></header><div className="login-hero-logo"><img src={logoSrc} alt="National Bank of Egypt" /></div><main className="login-sheet"><div className="sheet-handle"/><div className="login-intro"><div className="login-user-icon"><ShieldCheck size={30}/></div><div><p>{isAr ? "خطوة تحقق آمنة" : "Secure verification step"}</p><h1>{copy.title}</h1></div></div><form onSubmit={submit} className="mock-login-form"><p className="otp-subtitle">{copy.subtitle}</p><div className="otp-inputs" dir="ltr">{code.map((value, index) => <input key={index} id={`otp-${index}`} inputMode="numeric" maxLength={1} value={value} onChange={(event) => update(index, event.target.value)} aria-label={`OTP digit ${index + 1}`} />)}</div><p className="login-demo-note">{copy.hint}</p><button className="login-submit" type="submit">{copy.submit} <ArrowLeft size={18}/></button><Link className="login-back-link" href={siteFlow.login}>{copy.back}</Link></form></main></div>;
}
