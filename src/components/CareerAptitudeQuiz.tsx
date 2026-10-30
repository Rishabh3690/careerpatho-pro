import React, { useState, useMemo, useEffect } from 'react';
import { ChildCareer, CareersDatabase, Language } from '../data/types';
import {
  QUIZ_DATA,
  CAREER_CATEGORIES_MAPPING,
  calculateCareerMatch,
  SigmaQuizResult,
} from '../utils/sigmaQuizEngine';
import {
  buildSigmaQuizPrintableHtml,
  downloadHtmlReportFile,
  safeTriggerBrowserPrint,
} from '../utils/pdfAndPrintEngine';
import { t, tr, getFormalDesignation } from '../utils/careerEngine';
import { CareerSvgIcon } from './CareerSvgIcon';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Printer,
  ArrowUpRight,
  Compass,
  Code2,
  Copy,
  Check,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Award,
  ListChecks,
} from 'lucide-react';

interface CareerAptitudeQuizProps {
  career?: ChildCareer;
  careersData?: CareersDatabase;
  lang: Language;
  isFullPage?: boolean;
  isStartingQuiz?: boolean;
  onSelectCareer?: (careerId: string) => void;
  onExitToExplore?: () => void;
  onShowToast?: (msg: string) => void;
}

// UPGRADE 1: Loading Skeleton State for Quiz Components to improve perceived performance
export function QuizLoadingSkeleton() {
  return (
    <div
      data-testid="quiz-loading-skeleton"
      className="rounded-2xl border p-5 sm:p-7 mb-10 bg-[var(--bg2)] border-[var(--border2)] space-y-4 animate-pulse"
    >
      <div className="h-5 w-64 rounded bg-[var(--bg3)]" />
      <div className="h-8 w-3/4 rounded-lg bg-[var(--bg3)]" />
      <div className="h-2 w-full rounded-full bg-[var(--bg3)]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="h-24 rounded-xl bg-[var(--bg)] border border-[var(--border)]" />
        <div className="h-24 rounded-xl bg-[var(--bg)] border border-[var(--border)]" />
        <div className="h-24 rounded-xl bg-[var(--bg)] border border-[var(--border)]" />
        <div className="h-24 rounded-xl bg-[var(--bg)] border border-[var(--border)]" />
      </div>
    </div>
  );
}

export const CareerAptitudeQuiz: React.FC<CareerAptitudeQuizProps> = ({
  career,
  careersData,
  lang,
  isFullPage = false,
  isStartingQuiz = false,
  onSelectCareer,
  onExitToExplore,
  onShowToast,
}) => {
  const isHi = lang === 'hi';
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showAllDomains, setShowAllDomains] = useState<boolean>(false);
  const [showCodeDrawer, setShowCodeDrawer] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  // Step-by-step wizard mode vs All-10-questions list view
  const [quizDisplayMode, setQuizDisplayMode] = useState<'step' | 'all'>(
    isStartingQuiz ? 'step' : 'all'
  );
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const totalCareersCount = useMemo(
    () => (careersData?.children ? Object.keys(careersData.children).length : 103),
    [careersData]
  );

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / QUIZ_DATA.length) * 100);

  const handleSelectOption = (questionId: number, optionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionId };
      // If in step-by-step mode and not on the last question, advance smoothly
      if (quizDisplayMode === 'step' && currentStepIdx < QUIZ_DATA.length - 1) {
        setTimeout(() => {
          setCurrentStepIdx((idx) => Math.min(QUIZ_DATA.length - 1, idx + 1));
        }, 160);
      } else if (quizDisplayMode === 'step' && Object.keys(next).length === QUIZ_DATA.length) {
        setIsCalculating(true);
        setIsSubmitted(true);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isCalculating) return;
    const timer = setTimeout(() => setIsCalculating(false), 180);
    return () => clearTimeout(timer);
  }, [isCalculating]);

  const handleExitToExploreAll = () => {
    if (onExitToExplore) {
      onExitToExplore();
      return;
    }
    window.location.hash = '#/';
    setTimeout(() => {
      document.getElementById('careers-directory-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePresetProfile = (preset: 'pcm-tech' | 'pcb-med' | 'commerce-fin' | 'fallback-tie') => {
    setIsCalculating(true);
    if (preset === 'pcm-tech') {
      setAnswers({
        1: 'q1_pcm',
        2: 'q2_desk',
        3: 'q3_love_math',
        4: 'q4_introvert',
        5: 'q5_mnc_growth',
        6: 'q6_standard',
        7: 'q7_moderate_roi',
        8: 'q8_code_machines',
        9: 'q9_logical_system',
        10: 'q10_innovation',
      });
    } else if (preset === 'pcb-med') {
      setAnswers({
        1: 'q1_pcb',
        2: 'q2_lab',
        3: 'q3_basic_math',
        4: 'q4_helping',
        5: 'q5_mnc_growth',
        6: 'q6_long',
        7: 'q7_flexible',
        8: 'q8_human_body',
        9: 'q9_logical_system',
        10: 'q10_service',
      });
    } else if (preset === 'commerce-fin') {
      setAnswers({
        1: 'q1_commerce',
        2: 'q2_desk',
        3: 'q3_business_math',
        4: 'q4_team',
        5: 'q5_mnc_growth',
        6: 'q6_medium',
        7: 'q7_moderate_roi',
        8: 'q8_money_markets',
        9: 'q9_structured_rules',
        10: 'q10_wealth',
      });
    } else if (preset === 'fallback-tie') {
      setAnswers({
        1: 'q1_commerce',
        2: 'q2_field',
        3: 'q3_business_math',
        4: 'q4_public',
        5: 'q5_startup_practice',
        6: 'q6_medium',
        7: 'q7_ultra_low',
        8: 'q8_law_polity',
        9: 'q9_structured_rules',
        10: 'q10_wealth',
      });
    }
    setIsSubmitted(true);
    setTimeout(() => {
      const el = document.getElementById('sigma-results-panel');
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 220);
  };

  const sigmaResult: SigmaQuizResult = useMemo(
    () => calculateCareerMatch(answers, careersData),
    [answers, careersData]
  );

  const bestCareer = sigmaResult.bestCareerMatch || sigmaResult.recommendedCareers[0] || null;

  const currentCareerBroadFit = useMemo(() => {
    if (!career) return null;
    const catMap: Record<string, string> = {
      engineering: 'Engineering',
      science: 'Engineering',
      medical: 'Medical',
      commerce: 'Commerce',
      arts: 'Arts',
      design: 'Arts',
      law: 'Arts',
      government: 'Government',
      defense: 'Government',
      vocational: 'Vocational',
    };
    const targetBroad = catMap[career.category] || 'Engineering';
    const found = sigmaResult.allCategoryScores.find((c) => c.category === targetBroad);
    return found || sigmaResult.top3Categories[0];
  }, [career, sigmaResult]);

  const handleDownloadQuizReport = () => {
    const html = buildSigmaQuizPrintableHtml(sigmaResult, lang);
    const ok = downloadHtmlReportFile('CareerPathO-Sigma-Aptitude-Report.html', html);
    if (onShowToast) {
      onShowToast(
        ok
          ? tr(lang, 'Sigma Aptitude Report downloaded!', 'Sigma Report download ho gayi!', 'आपकी सिग्मा एप्टीट्यूड रिपोर्ट डाउनलोड हो गई है!')
          : tr(lang, 'Report ready', 'Report ready hai', 'रिपोर्ट तैयार है')
      );
    }
  };

  const handlePrintQuizReport = () => {
    handleDownloadQuizReport();
    safeTriggerBrowserPrint();
  };

  const handleCopyAlgorithmCode = () => {
    const snippet = `// CareerPathO Deterministic 10-Question Sigma Engine\nconst QUIZ_DATA = ${JSON.stringify(
      QUIZ_DATA,
      null,
      2
    )};\n\nconst CAREER_CATEGORIES_MAPPING = ${JSON.stringify(CAREER_CATEGORIES_MAPPING, null, 2)};`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(snippet).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
        onShowToast?.(isHi ? 'JSON और कोड कॉपी हो गया!' : 'QUIZ_DATA JSON & Sigma Code copied!');
      });
    }
  };

  const activeQuestion = QUIZ_DATA[currentStepIdx] || QUIZ_DATA[0];

  return (
    <section
      id="sigma-aptitude-quiz"
      data-testid="starting-10q-career-quiz"
      className={`rounded-2xl border-2 p-5 sm:p-7 mb-10 bg-[var(--bg2)] border-[var(--text)] transition-colors ${
        isFullPage || isStartingQuiz ? 'shadow-2xl' : ''
      }`}
    >
      {/* Header Banner + Prominent Exit Button to Explore Full 101+ Careers */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 mb-5 border-b border-[var(--border)]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>
              {tr(
                lang,
                'STARTING 10-QUESTION CAREER ESTIMATOR QUIZ • FIND WHICH CAREER IS BEST FOR YOU',
                'STARTING 10-QUESTION CAREER QUIZ • APNA #1 BEST CAREER KHOJEIN',
                'प्रारंभिक 10-प्रश्न करियर अनुमान क्विज़ • जानें आपके लिए कौन-सा करियर सबसे अच्छा है'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            {tr(
              lang,
              '10-Question Starting Quiz: Estimate Which Career Is Best for You',
              '10-Question Starting Quiz: Kaunsa Career Aapke Liye Best Hai?',
              '10-प्रश्न प्रारंभिक क्विज़: जानें आपके लिए कौन-सा करियर सर्वोत्तम है'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed max-w-3xl">
            {tr(
              lang,
              `Answer 10 quick questions (Stream, Workstyle, Maths comfort, Risk, Budget, Time horizon) to estimate your #1 Best Career Match, or click Exit anytime to explore all ${totalCareersCount}+ verified careers directly.`,
              `10 asaan sawalon ka jawab dein aur apna #1 Best Career janein—ya kabhi bhi 'Exit to Explore ${totalCareersCount}+ Careers' button dabakar poori directory dekhein.`,
              `10 सरल प्रश्नों के उत्तर देकर जानें कि आपके लिए कौन-सा करियर सबसे उपयुक्त है, या किसी भी समय 'Exit' बटन दबाकर सीधे सभी ${totalCareersCount}+ करियर एक्सप्लोर करें।`
            )}
          </p>
        </div>

        {/* Top-Right Controls: Progress Counter, View Mode Toggle & EXIT TO EXPLORE 101+ CAREERS BUTTON */}
        <div className="flex flex-wrap items-center gap-2.5 self-start shrink-0">
          <button
            type="button"
            onClick={() => setQuizDisplayMode((prev) => (prev === 'step' ? 'all' : 'step'))}
            className="min-h-[48px] px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ListChecks className="w-4 h-4" />
            <span>
              {quizDisplayMode === 'step'
                ? isHi
                  ? 'सभी 10 प्रश्न एक साथ देखें'
                  : 'View All 10 Questions'
                : isHi
                ? '1-दर-1 प्रश्न मोड (Wizard)'
                : 'Step-by-Step Mode'}
            </span>
          </button>

          <div className="px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-right font-mono">
            <div className="text-[10px] uppercase text-[var(--text3)]">
              {isHi ? 'प्रगति' : 'PROGRESS'}
            </div>
            <div className="text-sm font-extrabold text-[var(--text)] tabular-nums">
              {answeredCount} / {QUIZ_DATA.length} ({progressPct}%)
            </div>
          </div>

          {answeredCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setIsSubmitted(false);
                setCurrentStepIdx(0);
              }}
              className="min-h-[48px] px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              title="Reset Quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'रीसेट' : 'Reset'}</span>
            </button>
          )}

          {/* MANDATORY EXIT BUTTON TO EXPLORE FULL 101+ CAREERS */}
          <button
            type="button"
            onClick={handleExitToExploreAll}
            data-testid="exit-quiz-explore-101-btn"
            className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--text)] text-[var(--bg)] hover:opacity-90 text-xs font-mono font-extrabold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>
              {tr(
                lang,
                `Exit Quiz & Explore 101+ Careers (${totalCareersCount}) →`,
                `Exit Quiz & Explore 101+ Careers →`,
                `क्विज़ छोड़ें और सभी 101+ करियर देखें →`
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Demo Persona Bar (1-Click Test Profiles including Fallback Trigger) */}
      <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--text2)]">
          <Sparkles className="w-4 h-4 text-[var(--text)] shrink-0" />
          <span className="font-bold text-[var(--text)]">
            {isHi ? 'त्वरित डेमो प्रोफ़ाइल (1-Click Estimate):' : 'Instant 1-Click Demo Profiles:'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => handlePresetProfile('pcm-tech')}
            className="min-h-[42px] px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            {isHi ? '12वीं PCM (Tech/AI)' : '12th PCM Tech'}
          </button>
          <button
            type="button"
            onClick={() => handlePresetProfile('pcb-med')}
            className="min-h-[42px] px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            {isHi ? '12वीं PCB (Medical)' : '12th PCB Healthcare'}
          </button>
          <button
            type="button"
            onClick={() => handlePresetProfile('commerce-fin')}
            className="min-h-[42px] px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            {isHi ? 'कॉमर्स (CA/Finance)' : 'Commerce & Finance'}
          </button>
          <button
            type="button"
            onClick={() => handlePresetProfile('fallback-tie')}
            className="min-h-[42px] px-3 py-1.5 rounded-xl border border-[var(--text)] bg-[var(--bg2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            {isHi ? 'मिश्रित प्रोफ़ाइल (Fallback Test)' : 'Close Tie (Test Fallback Trigger)'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden mb-6">
        <div
          className="h-full bg-[var(--text)] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* QUESTION RENDERER: Step-by-Step 10-Question Wizard OR Full 10-Question List */}
      {quizDisplayMode === 'step' ? (
        <div className="mb-6 space-y-4">
          {/* Question Stepper Pills (1..10) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {QUIZ_DATA.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentStepIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`min-h-[38px] min-w-[38px] px-2.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] scale-105'
                      : isAnswered
                      ? 'bg-[var(--bg)] text-[var(--text)] border-[var(--text)]'
                      : 'bg-[var(--bg)] text-[var(--text3)] border-[var(--border)]'
                  }`}
                >
                  Q{q.id}
                  {isAnswered ? '✓' : ''}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg)]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-[var(--bg2)] border border-[var(--border2)] text-[var(--text)]">
                Question {activeQuestion.id} of {QUIZ_DATA.length} •{' '}
                {isHi ? activeQuestion.traitLabelHi : activeQuestion.traitLabelEn}
              </span>
              {answers[activeQuestion.id] && (
                <span className="text-xs font-mono font-bold text-[var(--text)] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHi ? 'उत्तर चुना गया' : 'Answered'}</span>
                </span>
              )}
            </div>

            <div className="font-extrabold text-lg sm:text-xl text-[var(--text)] leading-snug mb-1">
              {isHi ? activeQuestion.questionHi : activeQuestion.questionEn}
            </div>
            <div className="text-xs sm:text-sm text-[var(--text2)] mb-4">
              {isHi ? activeQuestion.questionEn : activeQuestion.questionHi}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeQuestion.options.map((opt) => {
                const isSelected = answers[activeQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(activeQuestion.id, opt.id)}
                    className={`min-h-[54px] p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold shadow-md'
                        : 'bg-[var(--bg2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--text)]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-[var(--bg)]' : 'border-[var(--text3)]'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[var(--bg)]" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm leading-snug">
                        {isHi ? opt.textHi : opt.textEn}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 leading-snug ${
                          isSelected ? 'opacity-85' : 'text-[var(--text3)]'
                        }`}
                      >
                        {isHi ? opt.textEn : opt.textHi}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Navigation Footer */}
            <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentStepIdx === 0}
                onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] disabled:opacity-40 text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isHi ? 'पिछला प्रश्न' : 'Previous Question'}</span>
              </button>

              <div className="text-xs font-mono text-[var(--text2)]">
                {answeredCount} of 10 answered
              </div>

              {currentStepIdx < QUIZ_DATA.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIdx((prev) => Math.min(QUIZ_DATA.length - 1, prev + 1))}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isHi ? 'अगला प्रश्न' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsCalculating(true);
                    setIsSubmitted(true);
                  }}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isHi ? 'मेरा सर्वश्रेष्ठ करियर परिणाम देखें →' : 'See My Best Career Match →'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* All 10 Bilingual Questions Grid */
        <div className="space-y-4 mb-6">
          {QUIZ_DATA.map((q) => {
            const selectedOptId = answers[q.id];
            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  selectedOptId
                    ? 'border-[var(--text)] bg-[var(--bg)]'
                    : 'border-[var(--border)] bg-[var(--bg)]/70'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg2)] border border-[var(--border2)] text-[var(--text2)]">
                    {isHi ? q.traitLabelHi : q.traitLabelEn}
                  </span>
                  {selectedOptId && (
                    <span className="text-[10px] font-mono font-bold text-[var(--text)] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHi ? 'उत्तर चुना गया' : 'Answered'}</span>
                    </span>
                  )}
                </div>

                <div className="font-extrabold text-base text-[var(--text)] leading-snug mb-1">
                  {isHi ? q.questionHi : q.questionEn}
                </div>
                <div className="text-xs text-[var(--text2)] mb-3">
                  {isHi ? q.questionEn : q.questionHi}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`min-h-[48px] p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold shadow-md'
                            : 'bg-[var(--bg2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--text)]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-[var(--bg)]' : 'border-[var(--text3)]'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[var(--bg)]" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm leading-snug">
                            {isHi ? opt.textHi : opt.textEn}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 leading-snug ${
                              isSelected ? 'opacity-85' : 'text-[var(--text3)]'
                            }`}
                          >
                            {isHi ? opt.textEn : opt.textHi}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Row: Compute Sigma Match + Exit to Explore 101+ Careers */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsCalculating(true);
              setIsSubmitted(true);
            }}
            disabled={answeredCount === 0}
            data-testid="compute-career-match-btn"
            className="min-h-[48px] px-6 py-3.5 rounded-xl font-mono font-extrabold text-xs sm:text-sm uppercase tracking-wider bg-[var(--text)] text-[var(--bg)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
          >
            {isHi
              ? `मेरा #1 सर्वश्रेष्ठ करियर और टॉप 3 क्षेत्र देखें (${answeredCount}/10)`
              : `Estimate My Best Career & Top Matches (${answeredCount}/10)`}
          </button>

          <button
            type="button"
            onClick={handleExitToExploreAll}
            data-testid="exit-quiz-bottom-btn"
            className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-extrabold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>
              {isHi
                ? `क्विज़ बंद करें और सभी ${totalCareersCount}+ करियर देखें →`
                : `Exit Quiz to Explore Full ${totalCareersCount}+ Careers →`}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowCodeDrawer((prev) => !prev)}
          className="min-h-[48px] px-4 py-3 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Code2 className="w-4 h-4" />
          <span>
            {showCodeDrawer
              ? isHi
                ? 'JSON और एल्गोरिदम कोड छुपाएं'
                : 'Hide QUIZ_DATA & Sigma Logic'
              : isHi
              ? 'QUIZ_DATA JSON व Sigma कोड देखें'
              : 'Inspect QUIZ_DATA JSON & Sigma Code'}
          </span>
        </button>
      </div>

      {/* UPGRADE 1: Skeleton state while computing */}
      {isCalculating && <QuizLoadingSkeleton />}

      {/* Results Dashboard */}
      {!isCalculating && (isSubmitted || answeredCount >= 6) && (
        <div
          id="sigma-results-panel"
          className="mt-8 pt-6 border-t-2 border-[var(--text)] space-y-6 animate-fadeIn"
        >
          {/* #1 BEST ESTIMATED CAREER HERO SPOTLIGHT CARD */}
          {bestCareer && (
            <div
              data-testid="best-estimated-career-card"
              className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg)] shadow-xl space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold uppercase">
                  <Award className="w-4 h-4" />
                  <span>
                    {isHi
                      ? '🏆 आपके 10 उत्तरों के अनुसार #1 सर्वश्रेष्ठ करियर (BEST CAREER FOR YOU)'
                      : '🏆 #1 BEST ESTIMATED CAREER FOR YOU (BASED ON YOUR 10 ANSWERS)'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg border border-[var(--text)] bg-[var(--bg2)] text-xs font-mono font-extrabold text-[var(--text)]">
                    {bestCareer.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-black tabular-nums">
                    {sigmaResult.bestCareerMatchScore || 92}% Best Match
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shrink-0">
                      <CareerSvgIcon id={bestCareer.id} category={bestCareer.category} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] leading-tight">
                        {getFormalDesignation(bestCareer, lang)}
                      </h3>
                      <div className="text-xs font-mono text-[var(--text2)] mt-0.5">
                        {t(bestCareer, 'title', lang)} • {bestCareer.duration || '3–4 Years'} • Starting:{' '}
                        <strong>{bestCareer.salaryInr?.entry || `₹${bestCareer.entrySalaryLakhs || 8} LPA`}</strong>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                    {isHi ? sigmaResult.bestCareerReasonHi : sigmaResult.bestCareerReasonEn}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                  <a
                    href={`#/career/${bestCareer.id}`}
                    onClick={(e) => {
                      if (onSelectCareer) {
                        e.preventDefault();
                        onSelectCareer(bestCareer.id);
                      }
                    }}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <span>{isHi ? 'इस #1 करियर का पूरा रोडमैप खोलें →' : 'Open #1 Best Career Roadmap →'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={handleExitToExploreAll}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-[var(--text)] bg-[var(--bg2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] font-mono font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>
                      {isHi ? `सभी ${totalCareersCount}+ करियर एक्सप्लोर करें` : `Exit & Explore All ${totalCareersCount}+ Careers`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top Confidence & Headline Banner */}
          <div className="p-5 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[var(--border)]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text3)] mb-1">
                  {isHi
                    ? 'सिग्मा गणितीय मूल्यांकन परिणाम (SIGMA OUTPUT)'
                    : 'DETERMINISTIC SIGMA SCORING OUTPUT'}
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[var(--text)]">
                  {isHi ? sigmaResult.headlineHi : sigmaResult.headlineEn}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-right font-mono">
                  <div className="text-[9px] uppercase text-[var(--text3)]">
                    {isHi ? 'विश्वास स्कोर (CONFIDENCE)' : 'CONFIDENCE SCORE'}
                  </div>
                  <div className="text-lg font-black text-[var(--text)] tabular-nums">
                    {sigmaResult.confidenceScore}% • {sigmaResult.confidenceLevel}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--text2)] leading-relaxed mb-4">
              {isHi ? sigmaResult.summaryHi : sigmaResult.summaryEn}
            </p>

            {/* UPGRADE 5 (The Quiz Tie-Breaker Fallback Screen) */}
            {sigmaResult.isFallbackTriggered && (
              <div
                role="alert"
                className="p-4 sm:p-5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] mb-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[var(--text)] shrink-0 mt-0.5" />
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="font-mono font-extrabold text-[var(--text)]">
                      Your vibes are mixed! Here are 3 different paths you can explore, or click here to browse all 101 careers.
                    </div>
                    <p className="text-[var(--text2)] leading-relaxed">
                      {isHi ? sigmaResult.fallbackReasonHi : sigmaResult.fallbackReasonEn}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleExitToExploreAll}
                    className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                  >
                    <span>{isHi ? 'सभी 101+ करियर ब्राउज़ करें →' : 'Browse All 101+ Careers →'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAllDomains(true)}
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] font-mono font-bold text-xs cursor-pointer"
                  >
                    {isHi ? 'सभी 6 डोमेन तुलना देखें' : 'Compare All 6 Domains'}
                  </button>
                </div>
              </div>
            )}

            {career && currentCareerBroadFit && (
              <div className="p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-[var(--text)]">
                    {isHi
                      ? `इस करियर (${t(career, 'title', lang)}) के साथ आपका मिलान:`
                      : `Your Alignment with ${t(career, 'title', lang)} (${currentCareerBroadFit.category}):`}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold">
                  {currentCareerBroadFit.points} pts ({currentCareerBroadFit.percentageOfMax}% Fit)
                </span>
              </div>
            )}

            {/* Top 3 Matching Broad Categories Cards */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)]">
                  {isHi
                    ? 'शीर्ष 3 उपयुक्त करियर क्षेत्र (TOP 3 MATCHING CATEGORIES)'
                    : 'TOP 3 MATCHING CAREER CATEGORIES (WEIGHTED SIGMA RANKING)'}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAllDomains((prev) => !prev)}
                  className="min-h-[48px] px-3 text-xs font-mono font-bold underline text-[var(--text)] cursor-pointer"
                >
                  {showAllDomains
                    ? isHi
                      ? 'केवल शीर्ष 3 दिखाएं'
                      : 'Show Top 3 Only'
                    : isHi
                    ? 'सभी 6 क्षेत्रों के अंक देखें'
                    : 'Look at All 6 Options'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {(showAllDomains || sigmaResult.isFallbackTriggered
                  ? sigmaResult.allCategoryScores
                  : sigmaResult.top3Categories
                ).map((item, idx) => (
                  <div
                    key={item.category}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      idx === 0
                        ? 'border-2 border-[var(--text)] bg-[var(--bg2)]'
                        : 'border-[var(--border2)] bg-[var(--bg2)]/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase">
                          RANK #{idx + 1} • {item.category.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-[var(--text)] tabular-nums">
                          {item.points} pts ({item.percentageOfMax}%)
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-[var(--text)] mb-1">
                        {isHi ? item.info.titleHi : item.info.titleEn}
                      </div>
                      <p className="text-xs text-[var(--text2)] leading-relaxed mb-3">
                        {isHi ? item.info.whyItFitsHi : item.info.whyItFitsEn}
                      </p>

                      <div className="w-full h-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden mb-3">
                        <div
                          className="h-full bg-[var(--text)]"
                          style={{ width: `${item.percentageOfMax}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-[var(--border)] space-y-1 text-[11px] font-mono">
                      <div className="truncate">
                        <span className="text-[var(--text3)]">{isHi ? 'परीक्षाएं:' : 'Exams:'} </span>
                        <strong className="text-[var(--text)]">{item.info.topExams.slice(0, 3).join(', ')}</strong>
                      </div>
                      <div className="truncate">
                        <span className="text-[var(--text3)]">{isHi ? 'डिग्री:' : 'Degrees:'} </span>
                        <span className="text-[var(--text2)]">{item.info.typicalDegrees[0]}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text3)]">{isHi ? 'शुरुआती पैकेज:' : 'Avg Entry:'} </span>
                        <strong className="text-[var(--text)]">{item.info.avgEntrySalary}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Specific Career Roadmaps from Database */}
            {sigmaResult.recommendedCareers.length > 0 && (
              <div className="pt-4 border-t border-[var(--border)]">
                <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)] mb-3">
                  {isHi
                    ? 'आपके लिए सुझाए गए शीर्ष 6 विशेष करियर रोडमैप (CLICK TO OPEN)'
                    : 'TOP 6 RECOMMENDED SPECIFIC CAREER BLUEPRINTS FOR YOU'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sigmaResult.recommendedCareers.map((rec, rIdx) => (
                    <a
                      key={rec.id}
                      href={`#/career/${rec.id}`}
                      onClick={(e) => {
                        if (onSelectCareer) {
                          e.preventDefault();
                          onSelectCareer(rec.id);
                        }
                      }}
                      className={`min-h-[48px] p-3.5 rounded-xl border bg-[var(--bg2)] hover:border-[var(--text)] flex items-center justify-between gap-2.5 transition-all group ${
                        rIdx === 0 ? 'border-2 border-[var(--text)]' : 'border-[var(--border2)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--text)] group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition-colors">
                          <CareerSvgIcon id={rec.id} category={rec.category} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[var(--text)] truncate group-hover:underline">
                            {rIdx === 0 ? '🏆 #1 ' : `#${rIdx + 1} `}
                            {t(rec, 'title', lang)}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--text3)] truncate">
                            {rec.salaryInr?.entry || `₹${rec.entrySalaryLakhs || 8} LPA`} •{' '}
                            {rec.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]'}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[var(--text3)] group-hover:text-[var(--text)] shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Print, Download Report & Exit to Explore 101+ Careers Action Bar */}
            <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleExitToExploreAll}
                className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] font-mono font-extrabold text-xs flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>
                  {isHi
                    ? `क्विज़ बंद करें और सभी ${totalCareersCount}+ करियर देखें →`
                    : `Exit Quiz & Explore All ${totalCareersCount}+ Careers →`}
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadQuizReport}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHi ? 'रिपोर्ट डाउनलोड करें (HTML/PDF)' : 'Download Aptitude Report'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintQuizReport}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isHi ? 'प्रिंट करें' : 'Print Report'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Developer JSON & Sigma Algorithm Drawer */}
      {showCodeDrawer && (
        <div className="mt-6 p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
            <span className="font-bold text-[var(--text)]">
              QUIZ_DATA (10 Bilingual Questions) + CAREER_CATEGORIES_MAPPING + calculateCareerMatch(answers)
            </span>
            <button
              type="button"
              onClick={handleCopyAlgorithmCode}
              className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy JSON & Code'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto max-h-80 text-[11px] text-[var(--text2)] leading-relaxed">
            {JSON.stringify({ QUIZ_DATA, CAREER_CATEGORIES_MAPPING }, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
};
