import React, { useState } from 'react';
import { Language, ThemeMode } from '../data/types';
import { tr } from '../utils/careerEngine';
import { SUPPORTED_LANGUAGES } from '../utils/regionalLocalization';
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
  Globe,
  Search,
} from 'lucide-react';

interface NavbarProps {
  theme: ThemeMode;
  lang: Language;
  currentRoute?: string;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onSetLang?: (lang: Language) => void;
  onOpenCommandPalette?: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  lang,
  currentRoute = 'home',
  onToggleTheme,
  onToggleLang,
  onSetLang,
  onOpenCommandPalette,
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

      {/* TRUST ELEMENT 6: Trust Bar Above the Fold */}
      <div
        data-testid="trust-no-spam-banner"
        className="w-full border-b border-[var(--border)] bg-[var(--bg2)] px-3 sm:px-6 py-1.5 text-[11px] font-mono no-print"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[var(--text)] min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[var(--accent-emerald)]" />
            <span className="break-words">Free · No login · No ads · 395+ careers · No phone calls</span>
          </div>
          <div
            data-testid="offline-pwa-badge"
            className="inline-flex flex-wrap items-center gap-1.5 px-2.5 py-0.5 rounded border badge-nov11-subtle text-[10px] font-extrabold max-w-full"
          >
            <Zap className="w-3 h-3 shrink-0" />
            <span className="break-words">Honest Data · Zero Salary Guarantee · Updated: 11 Nov 2026</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-[var(--bg)]/95 border-[var(--border)] no-print">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 min-h-14 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2">
          {/* Zone 1: Brand */}
          <a
            href="#/"
            onClick={closeMenu}
            className="text-base sm:text-xl font-extrabold tracking-tight whitespace-nowrap shrink-0 text-[var(--text)] hover:opacity-85 transition-opacity"
          >
            CareerPathO
          </a>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 text-xs xl:text-[13px] font-medium text-[var(--text2)] min-w-0"
          >
            <a
              href="#/"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'home' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Home', 'होम')}
            </a>
            <a
              href="#/careers"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'careers' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Explore Careers (395+)', 'करियर खोजें (395+)')}
            </a>
            <a
              href="#/talent-quiz"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'talentQuiz' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Aptitude Quiz', 'एप्टीट्यूड क्विज़')}
            </a>
            <a
              href="#/compare?c1=btech-cse&c2=bca-software"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'compare' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Compare Careers', 'करियर तुलना')}
            </a>
            <a
              href="#/sources"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'sources' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'Sources', 'स्रोत')}
            </a>
            <a
              href="#/how-we-calculate"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === 'howWeCalculate' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, 'How We Calculate', 'गणना पद्धति')}
            </a>
            <a
              href="#/saved"
              className={`hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                currentRoute === 'saved' ? 'text-[var(--text)] font-bold underline' : ''
              }`}
            >
              {tr(lang, `Saved (${savedCount})`, `सेव (${savedCount})`)}
            </a>
          </nav>

          {/* Zone 3: Cmd+K Search, 7-Language Selector & Theme Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenCommandPalette && (
              <button
                type="button"
                data-testid="navbar-cmd-k-btn"
                onClick={onOpenCommandPalette}
                title={isHi ? 'त्वरित करियर खोज (Ctrl+K / Cmd+K)' : 'Quick Search All 395+ Careers (Cmd+K / Ctrl+K)'}
                className="min-h-[38px] px-2.5 py-1 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono font-bold text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-[var(--accent-cyan)] shrink-0" />
                <span className="hidden sm:inline">{isHi ? 'खोजें' : 'Search'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] font-mono text-[var(--text)]">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Desktop 7-Language Pill Strip */}
            <div
              role="group"
              aria-label="7 Indian Languages Selector"
              data-testid="seven-lang-toggle"
              className="hidden md:inline-flex items-center p-0.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]"
            >
              {SUPPORTED_LANGUAGES.map((item) => {
                const isActive = lang === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`lang-btn-${item.id}`}
                    data-testid={`lang-btn-${item.id}`}
                    onClick={() => {
                      if (onSetLang) onSetLang(item.id);
                      else onToggleLang();
                    }}
                    title={item.label}
                    className={`min-h-[34px] px-2 xl:px-2.5 py-1 rounded-lg text-[10px] xl:text-[11px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'text-[var(--text2)] hover:text-[var(--text)]'
                    }`}
                  >
                    {item.nativeLabel}
                  </button>
                );
              })}
            </div>

            {/* Mobile Compact 7-Language Select Dropdown */}
            <div className="md:hidden relative flex items-center min-w-0">
              <Globe className="w-3.5 h-3.5 text-[var(--text2)] absolute left-2 pointer-events-none" />
              <select
                aria-label="Select Language"
                data-testid="mobile-lang-select"
                value={lang}
                onChange={(e) => {
                  const next = e.target.value as Language;
                  if (onSetLang) onSetLang(next);
                }}
                className="min-h-[38px] max-w-[112px] sm:max-w-none pl-6 pr-1.5 py-1 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[11px] font-mono font-bold text-[var(--text)] outline-none"
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nativeLabel} ({item.shortCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              id="theme-toggle"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="min-h-[38px] min-w-[38px] sm:min-h-[42px] sm:min-w-[42px] flex items-center justify-center rounded-xl border text-xs font-semibold transition-colors bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] hover:border-[var(--text)] cursor-pointer shrink-0"
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
              className="lg:hidden min-h-[38px] min-w-[38px] sm:min-h-[42px] sm:min-w-[42px] flex items-center justify-center rounded-xl border bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] hover:border-[var(--text)] cursor-pointer shrink-0"
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
            {/* Mobile Regional Language Grid inside Drawer */}
            <div className="pb-2 mb-2 border-b border-[var(--border)]">
              <div className="text-[10px] font-mono uppercase text-[var(--text3)] mb-1.5">
                {tr(lang, 'Choose Regional Language (7 Languages):', 'अपनी भाषा चुनें (7 भारतीय भाषाएं):')}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (onSetLang) onSetLang(item.id);
                    }}
                    className={`min-h-[40px] px-2 py-1 rounded-lg border text-xs font-mono font-bold cursor-pointer ${
                      lang === item.id
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                        : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border)]'
                    }`}
                  >
                    {item.nativeLabel}
                  </button>
                ))}
              </div>
            </div>

            <a
              href="#/careers"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              <span>{isHi ? 'करियर निर्देशिका (395+ करियर)' : 'Explore All 395+ Careers'}</span>
              <span className="text-xs font-mono text-[var(--text3)]">→</span>
            </a>
            <a
              href="#/talent-quiz"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              <span>{isHi ? '25-प्रश्न करियर मूल्यांकन क्विज़' : '25-Question Assessment Calculator'}</span>
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
              href="#/feedback"
              onClick={closeMenu}
              className="flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              <span>{tr(lang, 'Report Data Correction', 'डेटा सुधार रिपोर्ट करें')}</span>
              <span className="text-xs font-mono text-[var(--text3)]">→</span>
            </a>
          </nav>
        )}
      </header>

      {/* BHARAT MOBILE UX UPGRADE 4: Sticky Thumb-Zone Bottom Navigation Bar (Home, 395+ Careers, Quiz, Compare) */}
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
          href="#/careers"
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
            currentRoute === 'careers'
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold'
              : 'bg-[var(--bg2)] text-[var(--text2)] border-[var(--border)]'
          }`}
        >
          <Bookmark className="w-4 h-4 shrink-0" />
          <span className="text-[10px] sm:text-[11px] tracking-tight truncate max-w-full px-0.5">
            {isHi ? '395+ करियर' : '395+ Careers'}
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
