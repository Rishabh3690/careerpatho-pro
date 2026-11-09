import React, { useState, useEffect, useMemo } from 'react';
import {
  Language,
  ThemeMode,
  UserEligibilityProfile,
  CareerSearchFilters,
  ChildCareer,
  CareersDatabase,
} from './data/types';
import {
  loadPreference,
  savePreference,
  t,
  tr,
} from './utils/careerEngine';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CareerSvgIcon } from './components/CareerSvgIcon';
import { DonationBox } from './components/DonationBox';
import { StudentRetentionHub } from './components/StudentRetentionHub';
import { CareersListPage } from './components/CareersListPage';
import { ChildCareerView } from './components/ChildCareerView';
import { ParentCareerView } from './components/ParentCareerView';
import { CategoryView } from './components/CategoryView';
import { CompareSection } from './components/CompareSection';
import { LearningModal } from './components/LearningModal';
import { CareerAptitudeQuiz } from './components/CareerAptitudeQuiz';
import { SmartAICounselorModal } from './components/SmartAICounselorModal';
import { SmartSalaryEstimator } from './components/SmartSalaryEstimator';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { SUPPORTED_LANGUAGES } from './utils/regionalLocalization';
import {
  SupportersPage,
  FeedbackPage,
  AboutPage,
  SourcesPage,
  HowWeCalculatePage,
  PrivacyPage,
  TermsPage,
  NotFoundPage,
} from './components/StaticPages';
import { ArrowLeft, Compass, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import {
  useHashRoute,
  navigateToHash,
  resolveCareerRouteTarget,
} from './utils/hashRouter';

// Module-level singleton cache so navigating across routes never re-fetches or resets careersData
let cachedCareersDb: CareersDatabase | null = null;

function ViewLoadingFallback() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-4">
      <div className="h-8 w-48 rounded-xl bg-[var(--bg2)] border border-[var(--border)] animate-pulse" />
      <div className="h-44 w-full rounded-2xl bg-[var(--bg2)] border border-[var(--border)] animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-32 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] animate-pulse" />
        <div className="h-32 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] animate-pulse" />
      </div>
    </div>
  );
}

function AppContent() {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    loadPreference<ThemeMode>('careerpatho-theme', 'dark')
  );
  const [lang, setLang] = useState<Language>(() => {
    const saved = loadPreference<string>('careerpatho-lang', 'en');
    const validIds = SUPPORTED_LANGUAGES.map((l) => l.id as string);
    return validIds.includes(saved) ? (saved as Language) : 'en';
  });

  // Initialize from module-level cache if already loaded
  const [careersData, setCareersData] = useState<CareersDatabase | null>(() => cachedCareersDb);

  const [savedCareers, setSavedCareers] = useState<string[]>(() =>
    loadPreference<string[]>('careerpatho-saved', [])
  );
  const [eligibilityProfile, setEligibilityProfile] = useState<UserEligibilityProfile>(() =>
    loadPreference<UserEligibilityProfile>('careerpatho-eligibility', {
      stream: 'PCM',
      percent: '60-75',
      category: 'General',
      state: 'Delhi',
    })
  );

  const { route } = useHashRoute();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Modals & Starting Quiz state
  const [learningModalCareer, setLearningModalCareer] = useState<ChildCareer | null>(null);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [showAICounselorModal, setShowAICounselorModal] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [showStartingQuizOnHome, setShowStartingQuizOnHome] = useState<boolean>(false);
  const [showSalaryEstimatorOnHome, setShowSalaryEstimatorOnHome] = useState<boolean>(false);

  // Search filters state (stores the last 3 user search queries in localStorage)
  const [searchFilters] = useState<CareerSearchFilters>(() => ({
    query: '',
    category: 'All',
    stream: 'All',
    audience: 'All',
    minSalaryLakhs: 0,
    sortBy: 'relevance',
    recentQueries: loadPreference<string[]>('careerpatho-recent-queries', [
      'B.Tech CSE',
      'MBBS',
      'CA',
    ]).slice(0, 3),
  }));

  // Warm up career database in the background right after initial paint so quiz & detail pages are 0ms instant
  useEffect(() => {
    if (cachedCareersDb || careersData) {
      return;
    }

    let active = true;
    const loadDb = () => {
      import('./data/careersAll')
        .then((mod) => {
          const db = mod.getActiveCareersData();
          cachedCareersDb = db;
          if (active) {
            setCareersData(db);
          }
        })
        .catch(() => {});
    };

    const needsImmediately =
      route.name === 'career' ||
      route.name === 'compare' ||
      route.name === 'category' ||
      route.name === 'talentQuiz' ||
      route.name === 'saved' ||
      route.name === 'comingSoon' ||
      showStartingQuizOnHome ||
      showAICounselorModal ||
      showCommandPalette;

    if (needsImmediately) {
      loadDb();
    } else {
      const timer = setTimeout(loadDb, 40);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }

    return () => {
      active = false;
    };
  }, [route.name, showStartingQuizOnHome, showAICounselorModal, showCommandPalette, careersData]);

  // Global Cmd+K / Ctrl+K shortcut for Power-User Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const showToast = (msg: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(msg);
    const timer = setTimeout(() => setToastMessage(null), 2500);
    setToastTimer(timer);
  };

  const openAndScrollToHomeQuiz = () => {
    setShowStartingQuizOnHome(true);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          const el = document.getElementById('career-aptitude-quiz');
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 40);
      });
    }
  };

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    savePreference('careerpatho-theme', theme);
  }, [theme]);

  // Sync lang attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'hi' ? 'hi' : 'en');
    savePreference('careerpatho-lang', lang);
  }, [lang]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(next === 'dark' ? 'Switched to Monochrome Dark' : 'Switched to Monochrome Light');
  };

  const handleSetLang = (next: Language) => {
    setLang(next);
    const found = SUPPORTED_LANGUAGES.find((l) => l.id === next);
    showToast(`Language: ${found ? `${found.nativeLabel} (${found.label})` : next}`);
  };

  const handleToggleLang = () => {
    const idx = SUPPORTED_LANGUAGES.findIndex((l) => l.id === lang);
    const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length].id;
    handleSetLang(next);
  };

  const handleToggleSave = (careerId: string) => {
    let nextSaved: string[];
    if (savedCareers.includes(careerId)) {
      nextSaved = savedCareers.filter((id) => id !== careerId);
      showToast(tr(lang, 'Removed from saved', 'सेव किए गए करियर से हटाया गया'));
    } else {
      nextSaved = [...savedCareers, careerId];
      showToast(tr(lang, 'Saved on this device', 'इस डिवाइस पर सेव किया गया'));
    }
    setSavedCareers(nextSaved);
    savePreference('careerpatho-saved', nextSaved);
  };

  const handleEligibilityChange = (newProfile: UserEligibilityProfile) => {
    setEligibilityProfile(newProfile);
    savePreference('careerpatho-eligibility', newProfile);
  };

  // Resolved career target for `#/career/:id` (Parent Hub like `p-btech` or Child Career like `btech-cse`)
  const resolvedCareerTarget = useMemo(
    () =>
      route.name === 'career' && careersData
        ? resolveCareerRouteTarget(careersData, route.id)
        : null,
    [route.name, route.id, careersData]
  );

  // Update document title and meta description
  useEffect(() => {
    const isHi = lang === 'hi';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (route.name === 'home') {
      document.title = isHi
        ? 'CareerPathO — 12th ke baad kya karu?'
        : 'CareerPathO — 12th ke baad kya karu? (395+ Careers)';
      metaDesc?.setAttribute(
        'content',
        'CareerPathO — Free · No login · No ads · 395+ careers · No phone calls.'
      );
    } else if (route.name === 'careers') {
      document.title = 'CareerPathO — Explore 395+ Careers';
    } else if (route.name === 'compare') {
      document.title = isHi
        ? 'CareerPathO — करियर की तुलना करें'
        : 'CareerPathO — Side-by-Side Career Comparison';
    } else if (route.name === 'career' && route.id && careersData) {
      const ch = careersData.children[route.id];
      const p = careersData.parents[route.id];
      const title = ch ? t(ch, 'title', lang) : p ? t(p, 'title', lang) : 'Career';
      document.title = `CareerPathO — ${title}`;
    } else {
      document.title = 'CareerPathO';
    }
  }, [route, lang, careersData]);

  const isHi = lang === 'hi';

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col transition-colors bg-[var(--bg)] text-[var(--text)] pb-20 md:pb-0">
      <Navbar
        theme={theme}
        lang={lang}
        currentRoute={route.name}
        onToggleTheme={handleToggleTheme}
        onToggleLang={handleToggleLang}
        onSetLang={handleSetLang}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        savedCount={savedCareers.length}
      />

      <main className="flex-1 w-full min-w-0" id="app">
        {route.name === 'home' ? (
          /* CLEAN HOMEPAGE: Headline "12th ke baad kya karu?", one quiz button, one trust line, + 3-step beginner orientation. */
          <div
            data-testid="clean-homepage"
            className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16"
          >
            <section className="p-5 sm:p-12 rounded-3xl border-2 border-[var(--text)] bg-[var(--bg2)] surface-ambient text-center space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono font-bold text-[var(--text)] max-w-full">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--accent-emerald)]" />
                  <span data-testid="homepage-trust-line" className="break-words">
                    Free · No login · No ads · 395+ careers · No phone calls
                  </span>
                </div>
                <span
                  data-testid="homepage-nov11-badge"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border badge-nov11-subtle text-xs font-mono font-extrabold"
                >
                  <span>{tr(lang, 'All 395+ Careers Updated: 11 Nov 2026', 'सभी 395+ करियर अपडेटेड: 11 नवंबर 2026')}</span>
                </span>
              </div>

              <h1
                data-testid="homepage-headline"
                className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text)] leading-tight break-words"
              >
                {tr(lang, '12th ke baad kya karu?', '12वीं के बाद क्या करूँ? (12th ke baad kya karu?)')}
              </h1>

              <p className="text-sm sm:text-base text-[var(--text2)] max-w-2xl mx-auto leading-relaxed break-words">
                {tr(
                  lang,
                  'Built in simple, everyday language so any student or parent can find the right path without confusion. Take our 25-question quiz or browse 395+ careers organized into 10 easy parent sections (with zero false salary guarantees).',
                  'सरल और सीधी भाषा में बनाया गया ताकि कोई भी छात्र या अभिभावक बिना किसी उलझन के सही रास्ता चुन सके। 25-प्रश्नों का क्विज़ दें या 10 मुख्य वर्गों में व्यवस्थित 395+ करियर देखें (बिना किसी झूठी वेतन गारंटी के)।'
                )}
              </p>

              {/* Primary Quiz Button + Secondary Link to /careers */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  type="button"
                  data-testid="homepage-quiz-button"
                  onClick={() => {
                    if (showStartingQuizOnHome) {
                      setShowStartingQuizOnHome(false);
                    } else {
                      openAndScrollToHomeQuiz();
                    }
                  }}
                  className="w-full sm:w-auto min-h-[52px] px-6 sm:px-8 py-3.5 rounded-2xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs sm:text-base inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Compass className="w-5 h-5 shrink-0" />
                  <span className="break-words">
                    {showStartingQuizOnHome
                      ? tr(lang, 'Hide 25-Question Quiz', 'क्विज़ छुपाएं')
                      : tr(lang, 'Start 25-Question Career Quiz →', '25-प्रश्न करियर क्विज़ शुरू करें →')}
                  </span>
                </button>

                <a
                  href="#/careers"
                  data-testid="homepage-explore-250-link"
                  className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl border-2 border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] font-mono font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{tr(lang, 'Browse All 395+ Careers (10 Easy Sections)', 'सभी 395+ करियर देखें (10 आसान वर्ग)')}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
              </div>

              {/* Recent Search Chips Quick Access -> opens /careers */}
              {searchFilters.recentQueries && searchFilters.recentQueries.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-[var(--text3)]">
                  <span>{tr(lang, 'Popular:', 'लोकप्रिय:')}</span>
                  <a href="#/career/btech-cse" className="underline hover:text-[var(--text)]">
                    B.Tech CSE
                  </a>
                  <span>·</span>
                  <a href="#/career/mbbs-clinical" className="underline hover:text-[var(--text)]">
                    MBBS
                  </a>
                  <span>·</span>
                  <a href="#/career/p-agri-sustainability" className="underline hover:text-[var(--text)]">
                    {tr(lang, 'NEW: Agriculture & Food Tech Hub (22)', 'नया: कृषि व फूड टेक हब (22)')}
                  </a>
                  <span>·</span>
                  <a href="#/career/ca-audit" className="underline hover:text-[var(--text)]">
                    CA
                  </a>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setShowSalaryEstimatorOnHome((prev) => !prev)}
                    className="underline hover:text-[var(--text)] cursor-pointer"
                  >
                    {tr(lang, 'Smart Salary Estimator', 'स्मार्ट सैलरी एस्टिमेटर')}
                  </button>
                  <span>·</span>
                  <a href="#/feedback" className="underline hover:text-[var(--text)]">
                    {tr(lang, 'Feedback / Report Bug', 'सुझाव / त्रुटि रिपोर्ट करें')}
                  </a>
                </div>
              )}
            </section>

            {/* 3-Step Non-Technical Beginner Guide so any new visitor immediately understands the site */}
            <section
              data-testid="home-three-step-beginner-guide"
              className="mt-6 p-5 sm:p-6 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[var(--text3)]">
                    {tr(lang, 'FIRST TIME HERE? ZERO TECHNICAL KNOWLEDGE NEEDED', 'पहली बार आए हैं? किसी तकनीकी जानकारी की आवश्यकता नहीं')}
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[var(--text)]">
                    {tr(lang, 'How to Use CareerPathO in 3 Simple Steps', '3 आसान चरणों में अपना सही करियर कैसे चुनें')}
                  </h2>
                </div>
                <a
                  href="#/career/p-agri-sustainability"
                  className="px-3 py-1.5 rounded-xl border border-[var(--text)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors self-start"
                >
                  {tr(lang, 'NEW: Agriculture & Green Energy Hub (22 Careers) →', 'नया: कृषि और हरित ऊर्जा हब (22 करियर) →')}
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="font-mono font-extrabold text-[var(--text)] mb-1">
                    {tr(lang, 'STEP 1: Not sure what to do?', 'चरण 1: समझ नहीं आ रहा क्या करें?')}
                  </div>
                  <p className="text-[var(--text2)] leading-relaxed">
                    {tr(
                      lang,
                      'Click "Start 25-Question Career Quiz" above. Answer in simple language — you can even pick "Unsure / Neutral" if you do not know an answer.',
                      'ऊपर "25-प्रश्न करियर क्विज़" दबाएं। सरल भाषा में उत्तर दें — यदि किसी प्रश्न में संदेह हो तो "Unsure / Neutral" भी चुन सकते हैं।'
                    )}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="font-mono font-extrabold text-[var(--text)] mb-1">
                    {tr(lang, 'STEP 2: Browse by 10 Easy Groups', 'चरण 2: 10 आसान वर्गों में से चुनें')}
                  </div>
                  <p className="text-[var(--text2)] leading-relaxed">
                    {tr(
                      lang,
                      'Instead of reading 395+ careers at once, open "Explore Careers" to see 10 simple Parent Sections (Engineering, Medical, Agriculture, Commerce, Govt, etc.).',
                      '395+ करियर एक साथ पढ़ने के बजाय 10 आसान मुख्य वर्गों (इंजीनियरिंग, मेडिकल, कृषि, कॉमर्स, सरकारी नौकरी आदि) में से अपना क्षेत्र चुनें।'
                    )}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="font-mono font-extrabold text-[var(--text)] mb-1">
                    {tr(lang, 'STEP 3: Check Honest Reality & Fees', 'चरण 3: असली फीस और वेतन का सच जानें')}
                  </div>
                  <p className="text-[var(--text2)] leading-relaxed">
                    {tr(
                      lang,
                      'Every career page shows required 12th subjects, college fees, and real starting pay vs CTC — with zero false salary guarantees.',
                      'हर करियर पेज पर 12वीं के आवश्यक विषय, कुल फीस और वास्तविक इन-हैंड वेतन का सच साफ़ लिखा है — बिना किसी झूठी गारंटी के।'
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Expandable 10-Question Starting Quiz (renders immediately with zero Suspense flash) */}
            {showStartingQuizOnHome && (
              <div className="mt-8">
                <CareerAptitudeQuiz
                  careersData={careersData || undefined}
                  lang={lang}
                  onSelectCareer={(id) => {
                    navigateToHash(`#/career/${id}`);
                  }}
                  onExitQuiz={() => {
                    navigateToHash('#/careers');
                  }}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* Optional Expandable Smart Salary Estimator */}
            {showSalaryEstimatorOnHome && (
              <div className="mt-8">
                <SmartSalaryEstimator lang={lang} onShowToast={showToast} />
              </div>
            )}

            {/* All-in-One Student Retention Hub so new users never have to leave the site */}
            <StudentRetentionHub
              lang={lang}
              onStartQuiz={openAndScrollToHomeQuiz}
              onShowToast={showToast}
            />
          </div>
        ) : route.name === 'careers' || route.name === 'saved' ? (
          <CareersListPage
            lang={lang}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSave}
            savedOnly={route.name === 'saved'}
          />
        ) : route.name === 'compare' ? (
          !careersData ? (
            <ViewLoadingFallback />
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
              <a
                href="#/careers"
                className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono font-semibold text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors mb-6 no-print"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{tr(lang, 'BACK TO 395+ CAREERS', '395+ करियर पर वापस जाएं')}</span>
              </a>
              <CompareSection
                data={careersData}
                lang={lang}
                initialCareerId1={route.c1}
                initialCareerId2={route.c2}
                isFullPage
                onShowToast={showToast}
              />
            </div>
          )
        ) : route.name === 'career' && route.id ? (
          !careersData ? (
            <ViewLoadingFallback />
          ) : resolvedCareerTarget?.kind === 'parent' ? (
            <ParentCareerView
              key={resolvedCareerTarget.id}
              parent={resolvedCareerTarget.parent}
              careersData={careersData}
              lang={lang}
              savedCareers={savedCareers}
              onToggleSave={handleToggleSave}
              onNavigateCareer={(id) => {
                navigateToHash(`#/career/${id}`);
              }}
            />
          ) : resolvedCareerTarget?.kind === 'child' ? (
            <ChildCareerView
              key={resolvedCareerTarget.id}
              career={resolvedCareerTarget.child}
              careersData={careersData}
              lang={lang}
              eligibilityProfile={eligibilityProfile}
              onChangeEligibility={handleEligibilityChange}
              isSaved={savedCareers.includes(resolvedCareerTarget.id)}
              onToggleSave={handleToggleSave}
              onNavigateCareer={(id) => {
                navigateToHash(`#/career/${id}`);
              }}
              onOpenLearning={() => setLearningModalCareer(resolvedCareerTarget.child)}
              onOpenDonationModal={() => setShowDonationModal(true)}
              onShowToast={showToast}
            />
          ) : (
            <NotFoundPage lang={lang} />
          )
        ) : route.name === 'category' && route.id ? (
          !careersData ? (
            <ViewLoadingFallback />
          ) : (
            <CategoryView
              key={route.id}
              catId={route.id}
              careersData={careersData}
              lang={lang}
              savedCareers={savedCareers}
              onToggleSave={handleToggleSave}
              onNavigateCareer={(id) => {
                navigateToHash(`#/career/${id}`);
              }}
              onShowToast={showToast}
            />
          )
        ) : route.name === 'supporters' ? (
          <SupportersPage lang={lang} onOpenDonation={() => setShowDonationModal(true)} />
        ) : route.name === 'talentQuiz' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 no-print">
              <a
                href="#/"
                className="inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors"
              >
                ← {tr(lang, 'Back to Home', 'वापस होम पर')}
              </a>
              <a
                href="#/careers"
                className="min-h-[48px] inline-flex items-center px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold"
              >
                {tr(lang, 'Browse All 395+ Careers', 'सभी 395+ करियर देखें')} →
              </a>
            </div>
            <CareerAptitudeQuiz
              careersData={careersData || undefined}
              lang={lang}
              isFullPage
              onSelectCareer={(id) => {
                navigateToHash(`#/career/${id}`);
              }}
              onExitQuiz={() => {
                navigateToHash('#/careers');
              }}
              onShowToast={showToast}
            />
          </div>
        ) : route.name === 'comingSoon' ? (
          !careersData ? (
            <ViewLoadingFallback />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-8">
              <a
                href="#/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text)] font-semibold mb-4"
              >
                ← {tr(lang, 'Back to Home', 'वापस होम पर')}
              </a>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
                {isHi ? 'आगामी करियर और टूल्स' : 'Upcoming Frontier Careers & Tools'}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {careersData.comingSoon.map((cs) => (
                  <div
                    key={cs.id}
                    className="p-5 rounded-2xl border bg-[var(--bg2)] border-[var(--border)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg3)] border border-[var(--border2)] flex items-center justify-center text-[var(--text)]">
                        <CareerSvgIcon id={cs.id} category={cs.category} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--text)]">
                          {t(cs, 'title', lang)}
                        </div>
                        <div className="text-xs font-mono text-[var(--text3)] capitalize">
                          {cs.category}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded border border-[var(--border2)] bg-[var(--bg3)] text-[var(--text2)]">
                      {isHi ? 'जल्द आ रहा है' : 'Coming Soon'}
                    </span>
                  </div>
                ))}
              </div>
              <DonationBox lang={lang} onOpenModal={() => setShowDonationModal(true)} />
            </div>
          )
        ) : route.name === 'feedback' ? (
          <FeedbackPage
            key={`${route.id || 'general'}-${route.c1 || 'default'}`}
            lang={lang}
            onShowToast={showToast}
            initialCareerId={route.id}
            initialReportType={route.c1}
          />
        ) : route.name === 'about' ? (
          <AboutPage lang={lang} />
        ) : route.name === 'sources' ? (
          <SourcesPage lang={lang} />
        ) : route.name === 'howWeCalculate' ? (
          <HowWeCalculatePage lang={lang} />
        ) : route.name === 'privacy' ? (
          <PrivacyPage lang={lang} />
        ) : route.name === 'terms' ? (
          <TermsPage lang={lang} />
        ) : (
          <NotFoundPage lang={lang} />
        )}
      </main>

      <Footer lang={lang} />

      {/* Learning Resources Modal */}
      {learningModalCareer && (
        <LearningModal
          career={learningModalCareer}
          lang={lang}
          onClose={() => setLearningModalCareer(null)}
          onShowToast={showToast}
        />
      )}

      {/* Smart ROI & Career Counselor Modal */}
      {showAICounselorModal && careersData && (
        <SmartAICounselorModal
          data={careersData}
          lang={lang}
          onClose={() => setShowAICounselorModal(false)}
          onSelectCareer={(id) => {
            setShowAICounselorModal(false);
            navigateToHash(`#/career/${id}`);
          }}
        />
      )}

      {/* Power-User Instant Command Palette (Cmd+K / Ctrl+K) */}
      {showCommandPalette && careersData && (
        <CommandPaletteModal
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          data={careersData}
          lang={lang}
        />
      )}

      {/* Donation / Verification Modal */}
      {showDonationModal && (
        <div
          id="donation-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDonationModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl bg-[var(--bg)] border-[var(--border2)]"
          >
            <div className="p-4 border-b flex items-center justify-between border-[var(--border)] bg-[var(--bg2)]">
              <h3 className="font-bold text-sm text-[var(--text)]">
                {isHi ? 'डेटा सत्यापन और कार्यप्रणाली' : 'Official Data Verification'}
              </h3>
              <button
                type="button"
                onClick={() => setShowDonationModal(false)}
                aria-label="Close support modal"
                className="p-1 rounded text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[80vh]">
              <DonationBox lang={lang} isChildPage onOpenModal={() => {}} />
            </div>
          </div>
        </div>
      )}

      {/* Monochrome Toast Alert */}
      {toastMessage && (
        <div
          id="toast"
          role="alert"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl font-mono font-bold text-xs shadow-2xl transition-all bg-[var(--text)] text-[var(--bg)] border border-[var(--border2)]"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppContent />}>
          <Route path="/" element={null} />
          <Route path="/careers" element={null} />
          <Route path="/career/:id" element={null} />
          <Route path="/compare" element={null} />
          <Route path="/category/:id" element={null} />
          <Route path="/sources" element={null} />
          <Route path="/how-we-calculate" element={null} />
          <Route path="/about" element={null} />
          <Route path="/privacy" element={null} />
          <Route path="/terms" element={null} />
          <Route path="*" element={null} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
