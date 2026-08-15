import { FormEvent, useState } from "react";
import { Eye, EyeOff, Fingerprint, Globe2, Menu, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { nextVisualStep } from "@/siteFlow";

const logoSrc = "https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png";

export default function Login() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [showPassword, setShowPassword] = useState(false);
  const [demoMessage, setDemoMessage] = useState(false);
  const [remember, setRemember] = useState(false);
  const isAr = lang === "ar";
  const copy = isAr ? {
    greeting: "أهلاً بك في تجربة الأهلي", title: "قم بتسجيل الدخول إلى حسابك", user: "كود المستخدم", password: "كلمة المرور", remember: "حفظ كود المستخدم", forgot: "نسيت كود المستخدم / رمز المرور", biometric: "تمكين الدخول بالبصمة", submit: "تسجيل دخول", demo: "هذه واجهة تجريبية فقط. سيتم ربطها بالمزود الرسمي لاحقًا.", back: "العودة إلى الطلب"
  } : {
    greeting: "Welcome to the NBE experience", title: "Sign in to your account", user: "User code", password: "Password", remember: "Remember user code", forgot: "Forgot user code / passcode", biometric: "Enable biometric login", submit: "Sign in", demo: "This is a visual-only interface. The official provider will be connected later.", back: "Back to request"
  };
  function submit(event: FormEvent) { event.preventDefault(); navigate(nextVisualStep("login")); }
  return <div className={isAr ? "login-page rtl" : "login-page ltr"} dir={isAr ? "rtl" : "ltr"}>
    <header className="login-header"><Link href="/" className="login-logo"><img src={logoSrc} alt="البنك الأهلي المصري" /></Link><div className="login-actions"><button className="login-language" type="button" onClick={() => setLang(isAr ? "en" : "ar")}><Globe2 size={16}/>{isAr ? "English" : "العربية"}</button><button className="login-menu" type="button" aria-label={isAr ? "القائمة" : "Menu"}><Menu size={30}/></button></div></header>
    <div className="login-hero-logo"><img src={logoSrc} alt="National Bank of Egypt" /></div>
    <main className="login-sheet"><div className="sheet-handle"/><div className="login-intro"><div className="login-user-icon"><UserRound size={30}/></div><div><p>{copy.greeting}</p><h1>{copy.title}</h1></div></div><form onSubmit={submit} className="mock-login-form"><label><span>{copy.user}</span><input aria-label={copy.user} autoComplete="off" placeholder={copy.user}/></label><label className="password-field"><span>{copy.password}</span><input aria-label={copy.password} type={showPassword ? "text" : "password"} autoComplete="off" placeholder={copy.password}/><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={22}/> : <Eye size={22}/>}</button></label><div className="login-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)}/><span>{copy.remember}</span></label><button className="forgot-link" type="button" onClick={() => setDemoMessage(true)}>{copy.forgot}</button></div><button className="biometric-option" type="button" onClick={() => setDemoMessage(true)}><span>{copy.biometric}</span><Fingerprint size={27}/><span className="toggle-visual"><i/></span></button><button className="login-submit" type="submit">{copy.submit}</button>{demoMessage && <p className="login-demo-note" role="status">{copy.demo}</p>}<Link className="login-back-link" href="/order">{copy.back}</Link></form></main>
  </div>;
}
