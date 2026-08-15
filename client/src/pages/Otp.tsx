import { FormEvent, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import NbeSiteHeader from "@/components/NbeSiteHeader";
import { nextVisualStep, siteFlow, toggleLanguage, type SiteLanguage } from "@/siteFlow";

export default function Otp() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<SiteLanguage>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [code, setCode] = useState("");
  const isAr = lang === "ar";
  const copy = isAr
    ? {
        title: "أدخل رمز التحقق",
        subtitle: "أدخل الرمز المكوّن من 6 أرقام للمتابعة",
        hint: "هذه واجهة شكلية فقط، ولن يتم التحقق من الرمز حاليًا.",
        submit: "متابعة",
        back: "العودة لتسجيل الدخول",
        language: "English",
        menu: "القائمة",
        collection: "اختر ساعتك",
        order: "طلب جديد",
        admin: "لوحة الإدارة",
      }
    : {
        title: "Enter verification code",
        subtitle: "Enter the 6-digit code to continue",
        hint: "This is a visual-only interface; the code is not verified at this stage.",
        submit: "Continue",
        back: "Back to sign in",
        language: "العربية",
        menu: "Menu",
        collection: "Find your watch",
        order: "New request",
        admin: "Admin panel",
      };

  function submit(event: FormEvent) {
    event.preventDefault();
    navigate(nextVisualStep("otp"));
  }

  return (
    <div className={isAr ? "otp-page rtl" : "otp-page ltr"} dir={isAr ? "rtl" : "ltr"}>
      <NbeSiteHeader
        lang={lang}
        onLanguageChange={() => setLang(toggleLanguage(lang))}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((value) => !value)}
        menuLabel={copy.menu}
        collectionLabel={copy.collection}
        orderLabel={copy.order}
        adminLabel={copy.admin}
      />
      <main className="otp-main">
        <div className="otp-brand-mark">
          <img src="https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png" alt="البنك الأهلي المصري" />
        </div>
        <section className="otp-card" aria-labelledby="otp-title">
          <div className="otp-heading">
            <div className="otp-shield"><ShieldCheck size={25} /></div>
            <div>
              <p>{isAr ? "خطوة تحقق آمنة" : "Secure verification step"}</p>
              <h1 id="otp-title">{copy.title}</h1>
            </div>
          </div>
          <form onSubmit={submit} className="otp-form">
            <p className="otp-subtitle">{copy.subtitle}</p>
            <label className="otp-code-label" htmlFor="otp-code">{isAr ? "رمز التحقق" : "Verification code"}</label>
            <input
              id="otp-code"
              className="otp-single-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              aria-label={isAr ? "رمز التحقق المكون من ستة أرقام" : "Six-digit verification code"}
            />
            <p className="login-demo-note">{copy.hint}</p>
            <button className="login-submit otp-submit" type="submit">{copy.submit} <ArrowLeft size={18} /></button>
            <Link className="login-back-link" href={siteFlow.login}>{copy.back}</Link>
          </form>
        </section>
      </main>
    </div>
  );
}
