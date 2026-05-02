import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../lib/AuthContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { useTranslation } from "../../lib/LanguageContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors py-2 ${isActive ? "text-civic-blue font-bold underline underline-offset-4 decoration-2" : "hover:text-civic-blue"}`;

const navLinkHighlight = ({ isActive }: { isActive: boolean }) =>
  `font-bold flex items-center gap-1 transition-colors py-2 ${isActive ? "text-orange-500 underline underline-offset-4 decoration-2" : "text-orange-600 hover:text-orange-500"}`;

const navLinkAI = ({ isActive }: { isActive: boolean }) =>
  `font-bold flex items-center gap-1 transition-colors py-2 ${isActive ? "text-purple-600 underline underline-offset-4 decoration-2" : "text-purple-500 hover:text-purple-600"}`;

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation([
    "India Deep Module", "Countries", "Find Booth", "Timeline",
    "My Report", "Quiz", "Compare", "Learn", "Ask AI", "About", "Sign in", "Sign Out"
  ]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <NavLink to="/india" className={navLinkHighlight} onClick={mobile ? closeMobileMenu : undefined}>
        <span aria-hidden="true">🇮🇳</span> {t("India Deep Module")}
      </NavLink>
      <NavLink to="/countries" className={navLinkClass} onClick={mobile ? closeMobileMenu : undefined}>{t("Countries")}</NavLink>
      <NavLink to="/map" className={navLinkClass} onClick={mobile ? closeMobileMenu : undefined}>{t("Find Booth")}</NavLink>
      <NavLink to="/timeline" className={navLinkClass} onClick={mobile ? closeMobileMenu : undefined}>{t("Timeline")}</NavLink>
      <NavLink to="/report" className={navLinkClass} onClick={mobile ? closeMobileMenu : undefined}>{t("My Report")}</NavLink>
      <NavLink to="/quiz" className={navLinkClass} onClick={mobile ? closeMobileMenu : undefined}>{t("Quiz")}</NavLink>
      <NavLink to="/compare" className={navLinkClass} onClick={mobile ? closeMobileMenu : undefined}>{t("Compare")}</NavLink>
      <NavLink to="/learn" className={navLinkClass} onClick={mobile ? closeMobileMenu : undefined}>{t("Learn")}</NavLink>
      <NavLink to="/assistant" className={navLinkAI} onClick={mobile ? closeMobileMenu : undefined}>
        {t("Ask AI")}
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `font-bold transition-colors py-2 ${isActive ? "text-civic-blue underline underline-offset-4 decoration-2" : "hover:text-civic-blue"}`} onClick={mobile ? closeMobileMenu : undefined}>{t("About")}</NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/75 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" aria-label="CivicPath Home">
          <Logo className="w-12 h-12" />
          <span className="text-2xl font-bold text-civic-blue tracking-tight">CivicPath</span>
        </Link>

        {/* Middle: Desktop Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600" aria-label="Main navigation">
          <NavLinks />
        </nav>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden p-2 rounded-lg hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-civic-blue focus-visible:ring-offset-2 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-civic-blue text-white rounded-full flex items-center justify-center text-xs font-bold" aria-hidden="true">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate">{user.displayName || 'User'}</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
                aria-label="Sign Out"
              >
                <LogOut className="w-5 h-5 sm:w-4 sm:h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t("Sign Out")}</span>
              </button>
            </div>
          ) : (
             <>
               <button
                 onClick={() => navigate('/login')}
                 className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-full hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-civic-blue focus-visible:ring-offset-2"
               >
                 <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 {t("Sign in")}
               </button>
               <button onClick={() => navigate('/login')} className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full focus-visible:ring-2 focus-visible:ring-civic-blue focus-visible:ring-offset-2">
                 <LogIn className="w-5 h-5" aria-hidden="true" />
                 <span className="sr-only">{t("Sign in")}</span>
               </button>
             </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          className="xl:hidden bg-white border-t border-slate-200 shadow-lg animate-in slide-in-from-top-2 duration-200"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1 text-sm font-medium text-slate-600">
            <NavLinks mobile />
          </div>
        </nav>
      )}
    </header>
  );
};
