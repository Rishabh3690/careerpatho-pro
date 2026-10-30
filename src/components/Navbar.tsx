import React, { useState } from 'react';
import { Language, ThemeMode } from '../data/types';
import { tr } from '../utils/careerEngine';
import {
  Sun,
  Moon,
  Compass,
  Bookmark,
  Menu,
  X,
  Home,
  GitCompare,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  theme: ThemeMode;
  lang: Language;
  currentRoute?: string;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onSetLang?: (lang: Language) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  lang,
  currentRoute = 'home',
  onToggleTheme,
  onToggleLang,
  onSetLang,
  savedCount,
}) => {
  const isHi = lang === 'hi';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <a
        href="#app"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-[var(--text)] focus:text-[var(--bg)] focus:font-mono focus:font-bold focus:text-xs"
      >
        {isHi ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>

      {/* TRUST UPGRADE 1 & OFFLINE PWA UPGRADE 4: Sticky "No Spam" Trust Banner + Offline Mode Badge */}
      <div
        data-testid="trust-no-spam-banner"
        className="w-full border-b border-[var(--border)] bg-[var(--bg2)] px-3 sm:px-6 py-1.5 text-[11px] font-mono no-print"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>
              {tr(
                lang,
                '100% Free. No Login Required. Zero Phone Numbers. Zero Sales Calls.',
                '100% Free. No Login Required. Zero Phone Numbers. Zero Sales Calls.',
                '100% निःशुल्क। कोई लॉगिन नहीं। कोई फोन नंबर नहीं। कोई सेल्स कॉल नहीं।'
              )}
            </span>
          </div>
          <div
            data-testid="offline-pwa-badge"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[var(--border2)] bg-[var(--bg)] text-[10px] font-extrabold text-[var(--text)] shrink-0"
          >
            <Zap className="w-3 h-3 shrink-0" />
            <span>⚡ Offline Mode Active • Uses &lt; 0.2 MB</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-[var(--bg)]/95 border-[var(--border)] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand */}
          <a
            href="#/"
            onClick={closeMenu}
            className="text-lg sm:text-xl font-extrabold tracking-tight whitespace-nowrap shrink-0 text-[var(--text)] hover:opacity-85 transition-opacity"
          >
            CareerPathO
          </a>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--text2)]"
          >
            <a
              href="#/"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'home' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Directory', 'Careers Directory', 'करियर निर्देशिका')}
            </a>
            <a
              href="#/talent-quiz"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'talentQuiz' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Aptitude Quiz', '10-Q Aptitude Quiz', 'एप्टीट्यूड क्विज़')}
            </a>
            <a
              href="#/compare?c1=btech-cse&c2=bca-software"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'compare' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Compare Careers', 'Compare 2 Careers', 'करियर तुलना')}
            </a>
            <a
              href="#/supporters"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'supporters' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Supporters', 'Supporters', 'समर्थक')}
            </a>
            <a
              href="#/saved"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                currentRoute === 'saved' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, `Saved (${savedCount})`, `Saved (${savedCount})`, `सेव (${savedCount})`)}
            </a>
          </nav>

          {/* Zone 3: 3-Way Language Toggle (English | Hinglish | हिंदी) & Theme Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* LANGUAGE UPGRADE: 3-Way Toggle (English | Hinglish | हिंदी) */}
            <div
              role="group"
              aria-label="3-Way Language Toggle"
              data-testid="three-way-lang-toggle"
              className="inline-flex items-center p-0.5 sm:p-1 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]"
            >
              {(
                [
                  { id: 'en', label: 'English' },
                  { id: 'hinglish', label: 'Hinglish' },
                  { id: 'hi', label: 'हिंदी' },
                ] as { id: Language; label: string }[]
              ).map((item) => {
                const isActive = lang === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={item.id === 'en' ? 'lang-btn-en' : item.id === 'hinglish' ? 'lang-btn-hinglish' : 'lang-btn-hi'}
                    onClick={() => {
                      if (onSetLang) onSetLang(item.id);
                      else onToggleLang();
                    }}
                    className={`min-h-[38px] px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'text-[var(--text2)] hover:text-[var(--text)]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle (44-48px touch target) */}
            <button
              type="button"
              id="theme-toggle"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] flex items-center justify-center rounded-xl border text-xs font-semibold transition-colors bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] hover:border-[var(--text)] cursor-pointer shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[var(--text)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--text)]" />
              )}
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] hover:border-[var(--text)] cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Accessible Slide-Down Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile Navigation Drawer"
            className="lg:hidden border-t border-[var(--border)] bg-[var(--bg2)] px-4 py-3 space-y-2 animate-fadeIn"
          >
            <a
              href="#/"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              <span>{isHi ? 'करियर निर्देशिका (101+ करियर)' : 'Career Directory (101+ Blueprints)'}</span>
              <span className="text-xs font-mono text-[var(--text3)]">→</span>
            </a>
            <a
              href="#/talent-quiz"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              <span>{isHi ? '10-प्रश्न एप्टीट्यूड क्विज़' : '10-Question Aptitude Matcher'}</span>
              <span className="text-xs font-mono text-[var(--text3)]">→</span>
            </a>
            <a
              href="#/compare?c1=btech-cse&c2=bca-software"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              <span>{isHi ? 'दो करियर की तुलना करें (Compare)' : 'Compare 2 Careers Side-by-Side'}</span>
              <span className="text-xs font-mono text-[var(--text2)]">SHARE</span>
            </a>
            <a
              href="#/saved"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              <span>{isHi ? 'सेव किए गए करियर' : 'Saved Career Blueprints'}</span>
              <span className="text-xs font-mono font-bold tabular-nums text-[var(--text)]">
                {savedCount}
              </span>
            </a>
            <a
              href="#/supporters"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text2)] hover:bg-[var(--bg3)]"
            >
              <span>{isHi ? 'समर्थकों की दीवार' : 'Wall of Supporters'}</span>
              <span className="text-xs font-mono text-[var(--text3)]">→</span>
            </a>
          </nav>
        )}
      </header>

      {/* BHARAT MOBILE UX UPGRADE 4: Sticky Thumb-Zone Bottom Navigation Bar (Home, Quiz, Saved, Compare) with 48px height & 12px gap */}
      <nav
        aria-label="Mobile Thumb-Zone Navigation"
        data-testid="mobile-thumb-zone-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-t border-[var(--border2)] grid grid-cols-4 gap-3 px-3 py-1.5 no-print"
      >
        <a
          href="#/"
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
            currentRoute === 'home'
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold'
              : 'bg-[var(--bg2)] text-[var(--text2)] border-[var(--border)]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px] tracking-tight whitespace-nowrap">
            {isHi ? 'होम' : 'Home'}
          </span>
        </a>
        <a
          href="#/talent-quiz"
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
            currentRoute === 'talentQuiz'
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold'
              : 'bg-[var(--bg2)] text-[var(--text2)] border-[var(--border)]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[11px] tracking-tight whitespace-nowrap">
            {isHi ? 'क्विज़' : 'Quiz'}
          </span>
        </a>
        <a
          href="#/saved"
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
            currentRoute === 'saved'
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold'
              : 'bg-[var(--bg2)] text-[var(--text2)] border-[var(--border)]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[11px] tracking-tight whitespace-nowrap tabular-nums">
            {isHi ? `सेव (${savedCount})` : `Saved (${savedCount})`}
          </span>
        </a>
        <a
          href="#/compare?c1=btech-cse&c2=bca-software"
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
            currentRoute === 'compare'
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold'
              : 'bg-[var(--bg2)] text-[var(--text2)] border-[var(--border)]'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span className="text-[11px] tracking-tight whitespace-nowrap">
            {isHi ? 'तुलना' : 'Compare'}
          </span>
        </a>
      </nav>
    </>
  );
};
