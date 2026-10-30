import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import {
  Language,
  ThemeMode,
  UserEligibilityProfile,
  CareerSearchFilters,
  ChildCareer,
} from './data/types';
import { getActiveCareersData } from './data/careersAll';
import {
  loadPreference,
  savePreference,
  t,
  tr,
  scoreCareerFuzzyMatch,
} from './utils/careerEngine';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InteractiveHeroSection } from './components/InteractiveHeroSection';
import { CareerCard } from './components/CareerCard';
import { CareerSvgIcon } from './components/CareerSvgIcon';
import { CompareSection } from './components/CompareSection';
import { DonationBox } from './components/DonationBox';
import { SmartAICounselorModal } from './components/SmartAICounselorModal';
import { CareerAptitudeQuiz } from './components/CareerAptitudeQuiz';
import {
  SupportersPage,
  FeedbackPage,
  AboutPage,
  PrivacyPage,
  TermsPage,
  NotFoundPage,
} from './components/StaticPages';
import { ArrowUpRight, GitCompare, ArrowLeft, Compass, Layers } from 'lucide-react';

// Code-split secondary views & modals for fast initial page load
const ChildCareerView = lazy(() =>
  import('./components/ChildCareerView').then((m) => ({ default: m.ChildCareerView }))
);
const ParentCareerView = lazy(() =>
  import('./components/ParentCareerView').then((m) => ({ default: m.ParentCareerView }))
);
const CategoryView = lazy(() =>
  import('./components/CategoryView').then((m) => ({ default: m.CategoryView }))
);
const LearningModal = lazy(() =>
  import('./components/LearningModal').then((m) => ({ default: m.LearningModal }))
);

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

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    loadPreference<ThemeMode>('careerpatho-theme', 'dark')
  );
  const [lang, setLang] = useState<Language>(() => {
    const saved = loadPreference<string>('careerpatho-lang', 'en');
    return saved === 'hi' || saved === 'hinglish' ? saved : 'en';
  });
  const [careersData] = useState(() => getActiveCareersData());
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

  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Starting 10-Question Career Estimator Quiz state (active on start, with Exit button to explore 101+ careers)
  const [showStartingQuiz, setShowStartingQuiz] = useState<boolean>(true);

  // Modals state
  const [learningModalCareer, setLearningModalCareer] = useState<ChildCareer | null>(null);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [showAICounselorModal, setShowAICounselorModal] = useState<boolean>(false);

  // Search portal filter state
  const [searchFilters, setSearchFilters] = useState<CareerSearchFilters>({
    query: '',
    category: 'All',
    stream: 'All',
    audience: 'All',
    minSalaryLakhs: 0,
    sortBy: 'relevance',
  });

  // Directory organization state: 'paths' (grouped into smaller parent degree paths) or 'grid' (paginated cards)
  const [directoryViewMode, setDirectoryViewMode] = useState<'paths' | 'grid'>('paths');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [visibleGridCount, setVisibleGridCount] = useState<number>(12);

  const showToast = (msg: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(msg);
    const timer = setTimeout(() => setToastMessage(null), 2500);
    setToastTimer(timer);
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

  // Hash listener
  useEffect(() => {
    const onHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(next === 'dark' ? 'Switched to Monochrome Dark' : 'Switched to Monochrome Light');
  };

  // UPGRADE 2: 3-Way Language Toggle (English | Hinglish | हिंदी)
  const handleSetLang = (next: Language) => {
    setLang(next);
    showToast(
      next === 'hi'
        ? 'भाषा: हिंदी'
        : next === 'hinglish'
        ? 'Language: Hinglish (Conversational)'
        : 'Language: English'
    );
  };

  const handleToggleLang = () => {
    const next: Language = lang === 'en' ? 'hinglish' : lang === 'hinglish' ? 'hi' : 'en';
    handleSetLang(next);
  };

  const handleToggleSave = (careerId: string) => {
    let nextSaved: string[];
    if (savedCareers.includes(careerId)) {
      nextSaved = savedCareers.filter((id) => id !== careerId);
      showToast(lang === 'hi' ? 'सेव किए गए करियर से हटाया गया' : 'Removed from saved');
    } else {
      nextSaved = [...savedCareers, careerId];
      showToast(lang === 'hi' ? 'इस डिवाइस पर सेव किया गया' : 'Saved on this device');
    }
    setSavedCareers(nextSaved);
    savePreference('careerpatho-saved', nextSaved);
  };

  const handleEligibilityChange = (newProfile: UserEligibilityProfile) => {
    setEligibilityProfile(newProfile);
    savePreference('careerpatho-eligibility', newProfile);
  };

  // Expose window.CAREERPATHO_DEBUG
  useEffect(() => {
    (window as unknown as { CAREERPATHO_DEBUG: Record<string, unknown> }).CAREERPATHO_DEBUG = {
      STATE: {
        theme,
        lang,
        careers: careersData,
        saved: savedCareers,
        eligibility: eligibilityProfile,
      },
      showToast,
      openLearningModal: () => {
        const firstChild = Object.values(careersData.children)[0];
        if (firstChild) setLearningModalCareer(firstChild);
      },
      openDonation: () => setShowDonationModal(true),
    };
  }, [theme, lang, careersData, savedCareers, eligibilityProfile]);

  // Route Dispatcher (UPGRADE 4: Replaced #/collab with Stateless #/compare?c1=...&c2=...)
  const parseRoute = (hash: string): { name: string; id?: string; c1?: string; c2?: string } => {
    const clean = hash.replace(/^#\/?/, '').trim();
    if (!clean) return { name: 'home' };
    const [pathPart, queryPart] = clean.split('?');
    const parts = pathPart.split('/');

    if (parts[0] === 'compare') {
      const params = new URLSearchParams(queryPart || '');
      return {
        name: 'compare',
        c1: params.get('c1') || undefined,
        c2: params.get('c2') || undefined,
      };
    }
    if (parts[0] === 'category' && parts[1]) return { name: 'category', id: parts[1] };
    if (parts[0] === 'career' && parts[1]) return { name: 'career', id: parts[1] };
    if (parts[0] === 'supporters') return { name: 'supporters' };
    if (parts[0] === 'coming-soon') return { name: 'comingSoon' };
    if (parts[0] === 'talent-quiz') return { name: 'talentQuiz' };
    if (parts[0] === 'feedback') return { name: 'feedback' };
    if (parts[0] === 'about') return { name: 'about' };
    if (parts[0] === 'privacy') return { name: 'privacy' };
    if (parts[0] === 'terms') return { name: 'terms' };
    if (parts[0] === 'saved') return { name: 'saved' };
    return { name: 'notFound' };
  };

  const route = parseRoute(currentHash);

  // Update document title and meta description
  useEffect(() => {
    const isHi = lang === 'hi';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (route.name === 'home') {
      document.title = isHi ? 'CareerPathO — अपना रास्ता चुनें' : 'CareerPathO — Find Your Path';
      metaDesc?.setAttribute(
        'content',
        'CareerPathO — free trilingual career guidance for Indian students after Class 10, 12, and graduation. No login, no ads, no paywall.'
      );
    } else if (route.name === 'compare') {
      document.title = isHi
        ? 'CareerPathO — करियर की तुलना करें'
        : 'CareerPathO — Side-by-Side Career Comparison';
    } else if (route.name === 'career' && route.id) {
      const ch = careersData.children[route.id];
      const p = careersData.parents[route.id];
      const title = ch ? t(ch, 'title', lang) : p ? t(p, 'title', lang) : 'Career';
      document.title = `CareerPathO — ${title}`;
      metaDesc?.setAttribute(
        'content',
        `${title} — roadmap, eligibility, cost & salary ranges. CareerPathO.`
      );
    } else if (route.name === 'category' && route.id) {
      const cat = careersData.categories.find((c) => c.id === route.id);
      const label = cat ? t(cat, 'label', lang) : route.id;
      document.title = `CareerPathO — ${label}`;
      metaDesc?.setAttribute(
        'content',
        `${label} careers — roadmaps, eligibility, salary ranges. CareerPathO.`
      );
    } else {
      document.title = 'CareerPathO';
    }
  }, [route, lang, careersData]);

  // Memoize all children array
  const allChildren = useMemo(() => Object.values(careersData.children || {}), [careersData.children]);

  // UPGRADE 2 (Fuzzy Search Scoring Algorithm): Filter & sort children for Homepage Directory
  const filteredChildren = useMemo(() => {
    const queryStr = searchFilters.query.trim();
    const hasQuery = queryStr.length >= 2;

    const scoredList: Array<{ career: ChildCareer; score: number }> = [];

    for (const ch of allChildren) {
      if (searchFilters.category !== 'All' && ch.category !== searchFilters.category) {
        continue;
      }
      if (searchFilters.stream !== 'All') {
        const streamsArr = ch.eligibility?.streams || [];
        const matchesArr =
          streamsArr.length === 0 ||
          streamsArr.includes(searchFilters.stream) ||
          streamsArr.includes('Any');
        if (!matchesArr) {
          continue;
        }
      }
      if (route.name === 'saved' && !savedCareers.includes(ch.id)) {
        continue;
      }

      if (hasQuery) {
        const fuzzyScore = scoreCareerFuzzyMatch(ch, queryStr);
        if (fuzzyScore <= 0) continue;
        scoredList.push({ career: ch, score: fuzzyScore });
      } else {
        scoredList.push({ career: ch, score: 50 });
      }
    }

    if (searchFilters.sortBy === 'salary-high') {
      scoredList.sort((a, b) => (b.career.entrySalaryLakhs || 8) - (a.career.entrySalaryLakhs || 8));
    } else if (searchFilters.sortBy === 'alphabetical') {
      scoredList.sort((a, b) =>
        t(a.career, 'title', lang).localeCompare(t(b.career, 'title', lang))
      );
    } else if (hasQuery) {
      scoredList.sort((a, b) => b.score - a.score);
    }

    return scoredList.map((item) => item.career);
  }, [allChildren, searchFilters, route.name, savedCareers, lang]);

  // Memoize parent pathway clusters
  const parentGroups = useMemo(() => {
    return Object.values(careersData.parents)
      .map((parent) => {
        const matchingInParent = filteredChildren.filter((ch) => ch.parentId === parent.id);
        return { parent, matchingInParent };
      })
      .filter((group) => group.matchingInParent.length > 0);
  }, [careersData.parents, filteredChildren]);

  const isHi = lang === 'hi';

  const handleExitStartingQuizToExplore = () => {
    setShowStartingQuiz(false);
    showToast(
      tr(
        lang,
        `Exploring all ${allChildren.length}+ verified careers!`,
        `Ab sabhi ${allChildren.length}+ careers explore karein!`,
        `अब सभी ${allChildren.length}+ सत्यापित करियर एक्सप्लोर करें!`
      )
    );
    setTimeout(() => {
      document.getElementById('careers-directory-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors bg-[var(--bg)] text-[var(--text)] pb-20 md:pb-0">
      <Navbar
        theme={theme}
        lang={lang}
        currentRoute={route.name}
        onToggleTheme={handleToggleTheme}
        onToggleLang={handleToggleLang}
        onSetLang={handleSetLang}
        savedCount={savedCareers.length}
      />

      <main className="flex-1 w-full" id="app">
        <Suspense fallback={<ViewLoadingFallback />}>
          {route.name === 'home' || route.name === 'saved' ? (
            <div>
              {/* STARTING 10-QUESTION CAREER ESTIMATOR QUIZ SECTION (With 1-Click Exit to Explore 101+ Careers) */}
              {route.name === 'home' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                  {showStartingQuiz ? (
                    <CareerAptitudeQuiz
                      careersData={careersData}
                      lang={lang}
                      isStartingQuiz
                      onSelectCareer={(id) => {
                        window.location.hash = `#/career/${id}`;
                      }}
                      onExitToExplore={handleExitStartingQuizToExplore}
                      onShowToast={showToast}
                    />
                  ) : (
                    <div
                      data-testid="reopen-starting-quiz-bar"
                      className="mb-6 p-4 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shrink-0">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono uppercase text-[var(--text3)]">
                            {isHi ? '10-प्रश्न प्रारंभिक करियर अनुमानक' : '10-QUESTION STARTING CAREER ESTIMATOR'}
                          </div>
                          <div className="text-sm sm:text-base font-extrabold text-[var(--text)]">
                            {isHi
                              ? 'जानना चाहते हैं कि आपके लिए कौन-सा करियर सबसे अच्छा है?'
                              : 'Not sure which path fits you best? Take the 10-Question Starting Quiz'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setShowStartingQuiz(true)}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                        >
                          <Compass className="w-4 h-4" />
                          <span>{isHi ? '10-प्रश्न क्विज़ खोलें' : 'Launch 10-Question Starting Quiz'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById('careers-directory-section')
                              ?.scrollIntoView({ behavior: 'smooth' })
                          }
                          className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] text-xs font-mono font-bold hover:border-[var(--text)] cursor-pointer flex items-center gap-1.5"
                        >
                          <Layers className="w-4 h-4" />
                          <span>{isHi ? `सभी ${allChildren.length}+ करियर देखें` : `Browse ${allChildren.length}+ Careers ↓`}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {route.name === 'home' && (
                <InteractiveHeroSection
                  data={careersData}
                  lang={lang}
                  totalCareersCount={allChildren.length}
                  filters={searchFilters}
                  onFilterChange={setSearchFilters}
                  resultCount={filteredChildren.length}
                  onSelectCareerId={(id) => {
                    window.location.hash = `#/career/${id}`;
                  }}
                  onOpenAICounselor={() => setShowAICounselorModal(true)}
                  onOpenQuiz={() => {
                    window.location.hash = '#/talent-quiz';
                  }}
                  onOpenCollabStudio={() => {
                    window.location.hash = '#/compare?c1=btech-cse&c2=bca-software';
                  }}
                />
              )}

              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* UPGRADE 4: Stateless Shareable Comparison Banner Strip on Homepage */}
                {route.name === 'home' && (
                  <section className="mb-12 p-5 sm:p-6 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-[var(--text3)]">
                        {tr(
                          lang,
                          'Stateless Parent Comparison Link · Zero Login · Zero Backend',
                          'Shareable Comparison Link · Bina Login Parents Ko WhatsApp Bhejein',
                          'बिना लॉगिन माता-पिता के साथ साझा करने योग्य सीधी करियर तुलना'
                        )}
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)]">
                        {tr(
                          lang,
                          'Compare Any 2 Careers Side-by-Side & Share Link with Parents',
                          'Compare 2 Careers (e.g. B.Tech CSE vs BCA) & Share Link with Family',
                          'किन्हीं दो करियर विकल्पों की तुलना करें और अभिभावकों के साथ लिंक साझा करें'
                        )}
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--text2)] max-w-2xl">
                        {tr(
                          lang,
                          'Generate an instant URL like #/compare?c1=btech-cse&c2=bca. When your parents or relatives open the link, it immediately renders the side-by-side comparison table.',
                          '#/compare?c1=btech-cse&c2=bca jaisa link banayein jo khulte hi seedha comparison table dikhata hai.',
                          'बिना किसी डेटाबेस या अकाउंट के तुरंत तुलना लिंक बनाएं और व्हाट्सएप पर साझा करें।'
                        )}
                      </p>
                    </div>
                    <a
                      href="#/compare?c1=btech-cse&c2=bca-software"
                      className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap"
                    >
                      <GitCompare className="w-4 h-4" />
                      <span>
                        {tr(
                          lang,
                          'Compare Careers Side-by-Side →',
                          'Compare 2 Careers →',
                          'करियर तुलना खोलें →'
                        )}
                      </span>
                    </a>
                  </section>
                )}

                {/* Saved section if saved list non-empty */}
                {savedCareers.length > 0 && route.name !== 'saved' && (
                  <section className="mb-12 no-print">
                    <div className="text-xs font-mono uppercase tracking-widest text-[var(--text3)] mb-2">
                      {isHi ? 'बुकमार्क किए गए करियर' : 'Bookmarked Pathways'}
                    </div>
                    <h2 className="text-lg font-bold tracking-tight mb-3 text-[var(--text)]">
                      {isHi ? 'आपके सेव किए गए करियर' : 'Your Saved Careers'}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {savedCareers.map((sId) => {
                        const c = careersData.children[sId] || careersData.parents[sId];
                        if (!c) return null;
                        return (
                          <div
                            key={sId}
                            className="min-h-[48px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)]"
                          >
                            <a href={`#/career/${sId}`} className="hover:underline">
                              {t(c, 'title', lang)}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleToggleSave(sId)}
                              aria-label={`Remove ${t(c, 'title', lang)}`}
                              className="text-[var(--text3)] hover:text-[var(--text)] font-bold ml-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Browse by Category Grid */}
                {route.name !== 'saved' &&
                  searchFilters.query.length === 0 &&
                  searchFilters.category === 'All' && (
                    <section className="mb-16">
                      <div className="flex items-end justify-between mb-6 pb-4 border-b border-[var(--border)]">
                        <div>
                          <div className="text-xs font-mono text-[var(--text3)] mb-1">
                            {isHi ? '01. 9 मुख्य डोमेन' : '01. Nine Core Domains'}
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
                            {isHi ? 'श्रेणी के अनुसार खोजें' : 'Browse by Domain Category'}
                          </h2>
                        </div>
                        <span className="text-xs font-mono text-[var(--text2)] hidden sm:inline tabular-nums">
                          {allChildren.length} {isHi ? 'सत्यापित रोडमैप' : 'Verified Pathways'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {careersData.categories.map((cat) => {
                          const childCount = allChildren.filter((c) => c.category === cat.id).length;
                          return (
                            <a
                              key={cat.id}
                              href={`#/category/${cat.id}`}
                              className="p-6 rounded-2xl border flex items-center justify-between gap-4 transition-all bg-[var(--bg2)] border-[var(--border)] hover:border-[var(--text)] hover:-translate-y-0.5 group"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-[var(--bg3)] border border-[var(--border2)] flex items-center justify-center shrink-0 text-[var(--text)] group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition-colors">
                                  <CareerSvgIcon id={cat.id} category={cat.id} className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-base text-[var(--text)] truncate">
                                    {t(cat, 'label', lang)}
                                  </div>
                                  <div className="text-xs font-mono text-[var(--text2)] mt-1 tabular-nums">
                                    {childCount} {isHi ? 'करियर पथ' : 'career pathways'}
                                  </div>
                                </div>
                              </div>
                              <ArrowUpRight className="w-5 h-5 text-[var(--text3)] group-hover:text-[var(--text)] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                          );
                        })}
                      </div>
                    </section>
                  )}

                {/* Careers Directory: Structured into Smaller Parent Pathways */}
                <section id="careers-directory-section" className="mb-16">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
                    <div>
                      <div className="text-xs font-mono text-[var(--text3)] mb-1">
                        {isHi ? '02. संरचित करियर पथ (101+ करियर)' : '02. Full 101+ Career Pathways Directory'}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
                        {route.name === 'saved'
                          ? isHi
                            ? 'सेव किए गए करियर ब्लूप्रिंट'
                            : 'Saved Career Blueprints'
                          : isHi
                          ? `मुख्य डिग्री और ट्रैक के अनुसार सभी ${allChildren.length}+ करियर पथ`
                          : `Explore All ${allChildren.length}+ Career Pathways Grouped by Core Track`}
                      </h2>
                      <p className="text-xs text-[var(--text2)] mt-1">
                        {isHi
                          ? `सभी ${filteredChildren.length} विशेष करियर रोडमैप आसान तुलना के लिए समूहित किए गए हैं।`
                          : `All ${filteredChildren.length} specialized roadmaps organized into compact degree & domain pathways for effortless scanning.`}
                      </p>
                    </div>

                    {route.name !== 'saved' && (
                      <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg2)] border border-[var(--border)] self-start">
                        <button
                          type="button"
                          onClick={() => setDirectoryViewMode('paths')}
                          className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap ${
                            directoryViewMode === 'paths'
                              ? 'bg-[var(--text)] text-[var(--bg)]'
                              : 'text-[var(--text2)] hover:text-[var(--text)]'
                          }`}
                        >
                          {isHi ? 'समूह दृश्य (Grouped Paths)' : 'Grouped by Path'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDirectoryViewMode('grid');
                            setVisibleGridCount(12);
                          }}
                          className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap ${
                            directoryViewMode === 'grid'
                              ? 'bg-[var(--text)] text-[var(--bg)]'
                              : 'text-[var(--text2)] hover:text-[var(--text)]'
                          }`}
                        >
                          {isHi ? 'ग्रिड दृश्य (Compact Grid)' : 'Compact Grid'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Category Filter Bar */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchFilters({ ...searchFilters, category: 'All' });
                        setVisibleGridCount(12);
                      }}
                      className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        searchFilters.category === 'All'
                          ? 'bg-[var(--text)] text-[var(--bg)]'
                          : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
                      }`}
                    >
                      All ({allChildren.length})
                    </button>
                    {careersData.categories.map((cat) => {
                      const count = allChildren.filter((c) => c.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSearchFilters({ ...searchFilters, category: cat.id });
                            setVisibleGridCount(12);
                          }}
                          className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            searchFilters.category === cat.id
                              ? 'bg-[var(--text)] text-[var(--bg)]'
                              : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
                          }`}
                        >
                          {cat.label.split(' ')[0].replace(',', '')} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {filteredChildren.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] text-sm">
                      {isHi
                        ? 'कोई करियर नहीं मिला। कृपया फिल्टर रीसेट करें।'
                        : 'No careers matched your search criteria. Try resetting filters.'}
                    </div>
                  ) : route.name === 'saved' ||
                    directoryViewMode === 'grid' ||
                    searchFilters.query.trim().length >= 2 ? (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredChildren.slice(0, visibleGridCount).map((career) => (
                          <CareerCard
                            key={career.id}
                            career={career}
                            lang={lang}
                            isSaved={savedCareers.includes(career.id)}
                            onToggleSave={handleToggleSave}
                            onSelect={(id) => {
                              window.location.hash = `#/career/${id}`;
                            }}
                          />
                        ))}
                      </div>
                      {filteredChildren.length > visibleGridCount && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setVisibleGridCount((prev) => prev + 16)}
                            className="min-h-[48px] px-5 py-2.5 rounded-xl font-mono font-bold text-xs bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            {isHi
                              ? `अगले 16 करियर दिखाएं (${filteredChildren.length - visibleGridCount} शेष)`
                              : `Show Next 16 Pathways (${filteredChildren.length - visibleGridCount} Remaining)`}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDirectoryViewMode('paths')}
                            className="min-h-[48px] px-4 py-2.5 rounded-xl font-mono font-semibold text-xs border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
                          >
                            {isHi ? 'समूह दृश्य में बदलें' : 'Switch to Grouped Pathway View'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {parentGroups.map(({ parent, matchingInParent }) => {
                        const isExpanded = !!expandedParents[parent.id];
                        const visibleInGroup = isExpanded
                          ? matchingInParent
                          : matchingInParent.slice(0, 4);
                        const hiddenCount = matchingInParent.length - visibleInGroup.length;

                        return (
                          <div
                            key={parent.id}
                            className="cv-auto rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-4 sm:p-5 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-[var(--border)]">
                              <div className="flex items-start sm:items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shrink-0">
                                  <CareerSvgIcon
                                    id={parent.id}
                                    category={parent.category}
                                    className="w-5 h-5"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-0.5 text-[10px] font-mono text-[var(--text2)]">
                                    <span className="uppercase">{parent.category} Hub</span>
                                    <span aria-hidden="true">•</span>
                                    <span className="font-bold text-[var(--text)] tabular-nums">
                                      {matchingInParent.length} {isHi ? 'पथ' : 'Paths'}
                                    </span>
                                    <span aria-hidden="true">•</span>
                                    <span className="font-bold text-[var(--text)]">
                                      {parent.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]'}
                                    </span>
                                  </div>
                                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--text)] truncate">
                                    <a href={`#/career/${parent.id}`} className="hover:underline">
                                      {t(parent, 'title', lang)}
                                    </a>
                                  </h3>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                                {matchingInParent.length > 4 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedParents((prev) => ({
                                        ...prev,
                                        [parent.id]: !prev[parent.id],
                                      }))
                                    }
                                    className="min-h-[44px] px-3.5 py-1.5 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    {isExpanded
                                      ? isHi
                                        ? 'संक्षिप्त करें (4)'
                                        : 'Collapse (4)'
                                      : isHi
                                      ? `+${hiddenCount} और देखें`
                                      : `+${hiddenCount} More`}
                                  </button>
                                )}
                                <a
                                  href={`#/career/${parent.id}`}
                                  className="min-h-[44px] px-3.5 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] hover:opacity-90 text-xs font-mono font-bold transition-opacity whitespace-nowrap inline-flex items-center gap-1"
                                >
                                  <span>{isHi ? 'हब' : 'Hub'}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                              {visibleInGroup.map((career) => (
                                <CareerCard
                                  key={career.id}
                                  career={career}
                                  lang={lang}
                                  isSaved={savedCareers.includes(career.id)}
                                  onToggleSave={handleToggleSave}
                                  onSelect={(id) => {
                                    window.location.hash = `#/career/${id}`;
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* Compare Careers Section */}
                <CompareSection data={careersData} lang={lang} onShowToast={showToast} />

                {/* Support / Open-Access Box */}
                <section className="mb-10">
                  <DonationBox lang={lang} onOpenModal={() => setShowDonationModal(true)} />
                </section>
              </div>
            </div>
          ) : route.name === 'compare' ? (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
              <a
                href="#/"
                className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono font-semibold text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors mb-6 no-print"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isHi ? 'वापस होम पर जाएं' : 'BACK TO HOME'}</span>
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
          ) : route.name === 'career' && route.id ? (
            careersData.parents[route.id] ? (
              <ParentCareerView
                parent={careersData.parents[route.id]}
                careersData={careersData}
                lang={lang}
                savedCareers={savedCareers}
                onToggleSave={handleToggleSave}
                onNavigateCareer={(id) => {
                  window.location.hash = `#/career/${id}`;
                }}
              />
            ) : careersData.children[route.id] ? (
              <ChildCareerView
                career={careersData.children[route.id]}
                careersData={careersData}
                lang={lang}
                eligibilityProfile={eligibilityProfile}
                onChangeEligibility={handleEligibilityChange}
                isSaved={savedCareers.includes(route.id)}
                onToggleSave={handleToggleSave}
                onNavigateCareer={(id) => {
                  window.location.hash = `#/career/${id}`;
                }}
                onOpenLearning={() => setLearningModalCareer(careersData.children[route.id!])}
                onOpenDonationModal={() => setShowDonationModal(true)}
                onShowToast={showToast}
              />
            ) : (
              <NotFoundPage lang={lang} />
            )
          ) : route.name === 'category' && route.id ? (
            <CategoryView
              catId={route.id}
              careersData={careersData}
              lang={lang}
              savedCareers={savedCareers}
              onToggleSave={handleToggleSave}
              onNavigateCareer={(id) => {
                window.location.hash = `#/career/${id}`;
              }}
              onShowToast={showToast}
            />
          ) : route.name === 'supporters' ? (
            <SupportersPage lang={lang} onOpenDonation={() => setShowDonationModal(true)} />
          ) : route.name === 'talentQuiz' ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 no-print">
                <a
                  href="#/"
                  className="inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors"
                >
                  ← {isHi ? 'वापस होम पर' : 'BACK TO HOME'}
                </a>
                <button
                  type="button"
                  onClick={() => setShowAICounselorModal(true)}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text2)] hover:border-[var(--text)] hover:text-[var(--text)] text-xs font-mono font-bold cursor-pointer"
                >
                  {isHi ? 'स्मार्ट ROI और करियर मैचर खोलें →' : 'Open Smart ROI & Query Matcher →'}
                </button>
              </div>
              <CareerAptitudeQuiz
                careersData={careersData}
                lang={lang}
                isFullPage
                isStartingQuiz
                onSelectCareer={(id) => {
                  window.location.hash = `#/career/${id}`;
                }}
                onExitToExplore={() => {
                  setShowStartingQuiz(false);
                  window.location.hash = '#/';
                  setTimeout(() => {
                    document.getElementById('careers-directory-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
                onShowToast={showToast}
              />
            </div>
          ) : route.name === 'comingSoon' ? (
            <div className="max-w-4xl mx-auto px-4 py-8">
              <a
                href="#/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text)] font-semibold mb-4"
              >
                ← {isHi ? 'वापस होम पर' : 'BACK TO HOME'}
              </a>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
                {isHi ? 'आगामी करियर और टूल्स' : 'Upcoming Frontier Careers & Tools'}
              </h1>
              <p className="text-sm text-[var(--text2)] mb-6">
                {isHi
                  ? 'CareerPathO उभरते हुए भविष्य के क्षेत्रों का विस्तार कर रहा है।'
                  : 'Expanding CareerPathO into emerging frontier technology and applied sciences.'}
              </p>
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
          ) : route.name === 'feedback' ? (
            <FeedbackPage lang={lang} onShowToast={showToast} />
          ) : route.name === 'about' ? (
            <AboutPage lang={lang} />
          ) : route.name === 'privacy' ? (
            <PrivacyPage lang={lang} />
          ) : route.name === 'terms' ? (
            <TermsPage lang={lang} />
          ) : (
            <NotFoundPage lang={lang} />
          )}
        </Suspense>
      </main>

      <Footer lang={lang} />

      {/* Learning Resources Modal */}
      {learningModalCareer && (
        <Suspense fallback={null}>
          <LearningModal
            career={learningModalCareer}
            lang={lang}
            onClose={() => setLearningModalCareer(null)}
            onShowToast={showToast}
          />
        </Suspense>
      )}

      {/* Smart ROI & Career Counselor Modal */}
      {showAICounselorModal && (
        <SmartAICounselorModal
          data={careersData}
          lang={lang}
          onClose={() => setShowAICounselorModal(false)}
          onSelectCareer={(id) => {
            setShowAICounselorModal(false);
            window.location.hash = `#/career/${id}`;
          }}
        />
      )}

      {/* Donation Modal */}
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
                {isHi ? 'मुक्त शिक्षा का समर्थन करें' : 'Support Open-Access Education'}
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
