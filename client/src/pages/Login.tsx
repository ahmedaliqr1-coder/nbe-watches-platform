import { FormEvent, useState } from "react";
import { Eye, EyeOff, Fingerprint, Globe2, Menu, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatLoginGreeting, nextVisualStep } from "@/siteFlow";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";

export default function Login() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [showPassword, setShowPassword] = useState(false);
  const [demoMessage, setDemoMessage] = useState(false);
  const [remember, setRemember] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [requestName] = useState(() => { try { return window.sessionStorage.getItem("nbe_request_name")?.trim() || ""; } catch { return ""; } });
  const isAr = lang === "ar";
  const copy = isAr ? {
    greeting: "أهلاً بك في تجربة الأهلي", title: "قم بتسجيل الدخول إلى حسابك", user: "كود المستخدم", password: "كلمة المرور", remember: "حفظ كود المستخدم", forgot: "نسيت كود المستخدم / رمز المرور", biometric: "تمكين الدخول بالبصمة", submit: "تسجيل دخول", back: "العودة إلى الطلب", demo: "هذه واجهة تجريبية فقط. سيتم ربطها بالمزود الرسمي لاحقًا.", menu: "القائمة", show: "إظهار كلمة المرور", hide: "إخفاء كلمة المرور"
  } : {
    greeting: "Welcome to the NBE experience", title: "Sign in to your account", user: "User code", password: "Password", remember: "Remember user code", forgot: "Forgot user code / passcode", biometric: "Enable biometric login", submit: "Sign in", back: "Back to request", demo: "This is a visual-only interface. The official provider will be connected later.", menu: "Menu", show: "Show password", hide: "Hide password"
  };

  const greeting = formatLoginGreeting(requestName, lang);

  function submit(event: FormEvent) { event.preventDefault(); navigate(nextVisualStep("login")); }

  return <div className={isAr ? "login-page reference-login rtl" : "login-page reference-login ltr"} dir={isAr ? "rtl" : "ltr"}>
    <header className="reference-login-header"><Link href="/" className="reference-login-brand"><img src={logoSrc} alt="البنك الأهلي المصري" /></Link><div className="reference-login-actions"><button className="reference-language" type="button" onClick={() => setLang(isAr ? "en" : "ar")}><Globe2 size={17} />{isAr ? "English" : "العربية"}</button><button className="reference-menu" type="button" aria-label={copy.menu}><Menu size={34} /></button></div></header>
    <main className="reference-login-main">
      <div className="reference-hero-logo"><img src={logoSrc} alt="National Bank of Egypt" /></div>
      <section className="reference-login-sheet">
        <div className="reference-handle" />
        <div className="reference-login-intro"><div className="reference-user-icon"><UserRound size={31} /></div><div><p>{greeting}</p><h1>{copy.title}</h1></div></div>
        <form onSubmit={submit} className="reference-login-form">
          <label><span>{copy.user}</span><input aria-label={copy.user} autoComplete="off" placeholder={copy.user} /></label>
          <label className="reference-password"><span>{copy.password}</span><input aria-label={copy.password} type={showPassword ? "text" : "password"} autoComplete="off" placeholder={copy.password} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? copy.hide : copy.show}>{showPassword ? <EyeOff size={22} /> : <Eye size={22} />}</button></label>
          <div className="reference-options"><label className="reference-remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>{copy.remember}</span></label><button className="reference-forgot" type="button" onClick={() => setDemoMessage(true)}>{copy.forgot}</button></div>
          <button className={`reference-biometric ${biometricEnabled ? "is-enabled" : ""}`} type="button" aria-pressed={biometricEnabled} onClick={() => setBiometricEnabled((enabled) => !enabled)}><span>{copy.biometric}</span><Fingerprint size={27} /><span className="reference-toggle"><i /></span></button>
          <button className="reference-submit" type="submit">{copy.submit}</button>
          {demoMessage && <p className="reference-demo" role="status">{copy.demo}</p>}
          <Link className="reference-back" href="/order">{copy.back}</Link>
        </form>
      </section>
    </main>
  </div>;
}
