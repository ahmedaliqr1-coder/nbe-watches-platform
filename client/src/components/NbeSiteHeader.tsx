import { Globe2, Menu, X } from "lucide-react";
import { Link } from "wouter";

type Lang = "ar" | "en";

interface NbeSiteHeaderProps {
  lang: Lang;
  onLanguageChange: () => void;
  menuOpen?: boolean;
  onMenuToggle?: () => void;
  menuLabel: string;
  collectionLabel?: string;
  orderLabel?: string;
  adminLabel?: string;
}

export default function NbeSiteHeader({ lang, onLanguageChange, menuOpen = false, onMenuToggle, menuLabel, collectionLabel, orderLabel, adminLabel }: NbeSiteHeaderProps) {
  const isAr = lang === "ar";
  return <header className="official-login-header site-shared-header">
    <Link href="/" className="official-login-brand"><img src="https://nbewatches-5ewamt7h.manus.space/manus-storage/nbe-logo-clean_640cbc86.png" alt="البنك الأهلي المصري" /></Link>
    <div className="official-login-header-actions">
      <button className="official-language" type="button" onClick={onLanguageChange} aria-label={isAr ? "تبديل اللغة إلى الإنجليزية" : "Switch language to Arabic"}><Globe2 size={17} />{isAr ? "English" : "العربية"}</button>
      {onMenuToggle && <button className="official-menu" type="button" onClick={onMenuToggle} aria-label={menuLabel}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>}
    </div>
    {menuOpen && onMenuToggle && <nav className="site-shared-menu"><Link href="/#collection" onClick={onMenuToggle}>{collectionLabel}</Link><Link href="/order" onClick={onMenuToggle}>{orderLabel}</Link><Link href="/admin" onClick={onMenuToggle}>{adminLabel}</Link></nav>}
  </header>;
}
