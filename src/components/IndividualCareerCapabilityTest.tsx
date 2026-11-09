import React, { useState, useMemo, useEffect } from 'react';
import { ChildCareer, Language } from '../data/types';
import {
  buildIndividualCareerQuestions,
  evaluateCareerCapability,
} from '../utils/individualCareerTestEngine';
import { t, tr, getFormalDesignation } from '../utils/careerEngine';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  Target,
  HelpCircle,
} from 'lucide-react';

interface IndividualCareerCapabilityTestProps {
  career: ChildCareer;
  siblingCareers: ChildCareer[];
  lang: Language;
  onSelectCareer: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export const IndividualCareerCapabilityTest: React.FC<IndividualCareerCapabilityTestProps> = ({
  career,
  siblingCareers,
  lang,
  onSelectCareer,
  onShowToast,
}) => {
  const cleanTitle = t(career, 'title', lang).split('(')[0].trim();
  const storageKey = `careerpatho-ind-test-${career.id}`;

  const questions = useMemo(() => buildIndividualCareerQuestions(career), [career]);

  const [answersByCareer, setAnswersByCareer] = useState<Record<string, Record<string, string>>>({});
  const [submittedByCareer, setSubmittedByCareer] = useState<Record<string, boolean>>({});

  const storedData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed as Record<string, string>;
        }
      }
    } catch {
      // Ignore storage error
    }
    return null;
  }, [storageKey]);

  const answers = useMemo(
    () => answersByCareer[storageKey] ?? storedData ?? {},
    [answersByCareer, storageKey, storedData]
  );
  const setAnswers = (next: Record<string, string>) =>
    setAnswersByCareer((prev) => ({ ...prev, [storageKey]: next }));
  const isSubmitted =
    submittedByCareer[storageKey] ??
    (storedData ? Object.keys(storedData).length >= questions.length : false);
  const setIsSubmitted = (val: boolean) =>
    setSubmittedByCareer((prev) => ({ ...prev, [storageKey]: val }));

  const saveAnswers = (next: Record<string, string>) => {
    setAnswersByCareer((prev) => ({ ...prev, [storageKey]: next }));
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
    }
  };

  const answeredCount = useMemo(
    () => questions.filter((q) => Boolean(answers[q.id])).length,
    [questions, answers]
  );

  const progressPct = Math.round((answeredCount / questions.length) * 100);

  const verdict = useMemo(
    () => evaluateCareerCapability(career, answers),
    [career, answers]
  );

  const scrollToVerdict = () => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const el = document.getElementById('individual-career-verdict-panel');
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    });
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    const next = { ...answers, [questionId]: optionId };
    saveAnswers(next);

    const nextCount = questions.filter((q) => Boolean(next[q.id])).length;
    if (nextCount >= questions.length) {
      setIsSubmitted(true);
      scrollToVerdict();
      onShowToast?.(
        tr(
          lang,
          `Capability Verdict ready for ${cleanTitle}!`,
          `${cleanTitle} के लिए आपका योग्यता परिणाम तैयार है!`
        )
      );
    }
  };

  const handleComputeVerdict = () => {
    if (answeredCount === 0) {
      onShowToast?.(
        tr(
          lang,
          'Please answer at least 1 question (or tap a Quick Demo Profile) to see your verdict!',
          'अपना परिणाम देखने के लिए कम से कम 1 प्रश्न का उत्तर दें (या डेमो बटन दबाएं)!'
        )
      );
      return;
    }
    setIsSubmitted(true);
    scrollToVerdict();
    onShowToast?.(
      tr(
        lang,
        `Verdict Calculated: ${verdict.scorePct}% Capability Score`,
        `परिणाम तैयार: ${verdict.scorePct}% क्षमता स्कोर`
      )
    );
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Ignore
      }
    }
    onShowToast?.(
      tr(lang, 'Capability test reset!', 'योग्यता टेस्ट रीसेट हो गया!')
    );
  };

  const applyDemoPreset = (mode: 'strong' | 'conditional' | 'mismatch') => {
    const next: Record<string, string> = {};
    questions.forEach((q, idx) => {
      if (mode === 'strong') {
        next[q.id] = q.options[0].id;
      } else if (mode === 'conditional') {
        next[q.id] = idx % 2 === 0 ? q.options[1].id : q.options[0].id;
      } else {
        next[q.id] = q.options[q.options.length - 1].id;
      }
    });
    saveAnswers(next);
    setIsSubmitted(true);
    scrollToVerdict();
    onShowToast?.(
      mode === 'strong'
        ? tr(lang, `Loaded Capable Student Profile for ${cleanTitle}`, 'सक्षम छात्र प्रोफाइल लोड किया गया')
        : mode === 'conditional'
        ? tr(lang, `Loaded Moderate / Needs-Prep Profile for ${cleanTitle}`, 'मध्यम तैयारी प्रोफाइल लोड किया गया')
        : tr(lang, `Loaded Mismatch Profile for ${cleanTitle}`, 'असंगत प्रोफाइल लोड किया गया')
    );
  };

  return (
    <section
      id="individual-career-capability-test"
      data-testid="individual-career-capability-test"
      aria-label={`Individual Capability Test for ${cleanTitle}`}
      className="mb-10 p-5 sm:p-7 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)]"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 mb-5 border-b border-[var(--border)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] text-[11px] font-mono font-extrabold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span>
              {tr(
                lang,
                `CAREER-SPECIFIC CAPABILITY & READINESS TEST • 7 UNIQUE QUESTIONS`,
                `व्यक्तिगत करियर क्षमता परीक्षण • 7 विशेष प्रश्न`
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)] leading-snug">
            {tr(
              lang,
              `Are You Capable & Ready for ${cleanTitle}? (Take the 2-Minute Test)`,
              `क्या आप ${cleanTitle} के लिए सक्षम और तैयार हैं? (2-मिनट की व्यक्तिगत जांच)`
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed max-w-3xl">
            {tr(
              lang,
              `Unlike a general quiz, these 7 questions test your exact fit for ${cleanTitle}—checking your Class 12 stream, real daily tasks, core subjects, entrance exam stamina, and a practical work scenario to give you an honest Capability Verdict.`,
              `यह कोई सामान्य क्विज़ नहीं है—ये 7 विशेष प्रश्न केवल ${cleanTitle} के लिए आपकी असली योग्यता (12वीं स्ट्रीम, रोज़ का काम, मुख्य विषय, प्रवेश परीक्षा और व्यावहारिक स्थिति) की जांच करके आपको ईमानदार फैसला (Verdict) देते हैं।`
            )}
          </p>
        </div>

        {/* Progress & Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
            <div className="text-[10px] font-mono uppercase text-[var(--text3)]">
              {tr(lang, 'Test Progress', 'आपकी प्रगति')}
            </div>
            <div
              data-testid="ind-test-progress"
              className="text-sm font-mono font-extrabold text-[var(--text)] tabular-nums"
            >
              {answeredCount} / {questions.length} ({progressPct}%)
            </div>
          </div>

          {answeredCount > 0 && (
            <button
              type="button"
              data-testid="ind-test-reset-btn"
              onClick={handleReset}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono font-bold text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{tr(lang, 'Reset Test', 'रीसेट करें')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Quick 1-Click Test Profiles */}
      <div className="mb-6 space-y-3">
        <div className="w-full h-2.5 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden">
          <div
            className="h-full bg-[var(--text)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-[11px] text-[var(--text3)]">
            {tr(
              lang,
              'Quick Demo Profiles (1-Click Verdict Preview):',
              'त्वरित डेमो (1-क्लिक में परिणाम देखें):'
            )}
          </span>
          <button
            type="button"
            data-testid="ind-test-demo-strong"
            onClick={() => applyDemoPreset('strong')}
            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text)] hover:border-[var(--text)] cursor-pointer"
          >
            {tr(lang, '✅ Strong Fit Student', '✅ सक्षम छात्र डेमो')}
          </button>
          <button
            type="button"
            data-testid="ind-test-demo-conditional"
            onClick={() => applyDemoPreset('conditional')}
            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text)] hover:border-[var(--text)] cursor-pointer"
          >
            {tr(lang, '⚡ Needs Prep Student', '⚡ मध्यम तैयारी डेमो')}
          </button>
          <button
            type="button"
            data-testid="ind-test-demo-mismatch"
            onClick={() => applyDemoPreset('mismatch')}
            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text)] hover:border-[var(--text)] cursor-pointer"
          >
            {tr(lang, '⚠️ Mismatch Student', '⚠️ असंगत प्रोफाइल डेमो')}
          </button>
        </div>
      </div>

      {/* 7 Career-Specific Questions */}
      <div className="space-y-4">
        {questions.map((q) => {
          const selectedOptId = answers[q.id];
          return (
            <div
              key={q.id}
              data-testid={`ind-question-card-${q.stepNumber}`}
              className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
                selectedOptId
                  ? 'bg-[var(--bg)] border-[var(--text)]'
                  : 'bg-[var(--bg)] border-[var(--border)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-[var(--bg2)] border border-[var(--border2)] text-[11px] font-mono font-bold text-[var(--text)]">
                  {tr(lang, q.dimensionLabelEn, q.dimensionLabelHi)}
                </span>
                {selectedOptId && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[var(--text)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{tr(lang, 'Answered', 'उत्तर चुना गया')}</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-[var(--text)] leading-snug mb-1 break-words">
                {tr(lang, q.questionEn, q.questionHi)}
              </h3>
              <p className="text-xs text-[var(--text3)] mb-3.5 flex items-center gap-1.5 break-words">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{tr(lang, q.helperEn, q.helperHi)}</span>
              </p>

              {/* Options (1 column on mobile with 48px+ touch target for effortless reading) */}
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt) => {
                  const isSelected = selectedOptId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      data-testid={`ind-opt-${q.stepNumber}-${opt.id}`}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`min-h-[52px] w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold shadow-sm'
                          : 'bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] hover:border-[var(--text)]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[var(--bg)] bg-[var(--bg)]'
                            : 'border-[var(--border2)]'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[var(--text)]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold leading-relaxed break-words">
                          {tr(lang, opt.textEn, opt.textHi)}
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

      {/* Submit / Compute Verdict CTA */}
      <div className="mt-6 p-4 rounded-2xl border border-[var(--border2)] bg-[var(--bg)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-[var(--text2)]">
          {answeredCount < questions.length
            ? tr(
                lang,
                `Answered ${answeredCount} of ${questions.length} career-specific questions. Answer all ${questions.length} or tap the button to check your capability verdict now.`,
                `आपने ${questions.length} में से ${answeredCount} प्रश्नों के उत्तर दिए हैं। अपना योग्यता फैसला (Verdict) देखने के लिए नीचे क्लिक करें।`
              )
            : tr(
                lang,
                `All ${questions.length} questions answered! Read your personalized Capability Verdict below.`,
                `सभी ${questions.length} प्रश्नों के उत्तर पूरे हुए! अपना व्यक्तिगत योग्यता फैसला (Verdict) नीचे पढ़ें।`
              )}
        </div>
        <button
          type="button"
          data-testid="ind-test-submit-btn"
          onClick={handleComputeVerdict}
          className="min-h-[48px] w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {tr(
              lang,
              `Check My Capability Verdict (${answeredCount}/${questions.length})`,
              `मेरा योग्यता फैसला देखें (${answeredCount}/${questions.length})`
            )}
          </span>
        </button>
      </div>

      {/* CAPABILITY VERDICT PANEL */}
      {isSubmitted && answeredCount > 0 && (
        <div
          id="individual-career-verdict-panel"
          data-testid="individual-career-verdict-panel"
          className="mt-8 pt-6 border-t-2 border-[var(--text)] space-y-6 animate-fadeIn scroll-mt-24"
        >
          {/* Main Verdict Banner */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="space-y-2">
                <div
                  data-testid="ind-verdict-badge"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold"
                >
                  {verdict.verdictTier === 'CAPABLE_STRONG' ? (
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{tr(lang, verdict.verdictBadgeEn, verdict.verdictBadgeHi)}</span>
                </div>
                <h3
                  data-testid="ind-verdict-headline"
                  className="text-lg sm:text-2xl font-extrabold text-[var(--text)] leading-snug break-words"
                >
                  {tr(lang, verdict.headlineEn, verdict.headlineHi)}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
                  {tr(lang, verdict.plainSummaryEn, verdict.plainSummaryHi)}
                </p>
              </div>

              {/* Score Box */}
              <div className="p-4 rounded-xl border-2 border-[var(--border2)] bg-[var(--bg2)] min-w-[190px] text-center shrink-0">
                <div className="text-[10px] font-mono uppercase text-[var(--text3)] mb-1">
                  {tr(lang, 'Capability Score', 'क्षमता स्कोर')}
                </div>
                <div
                  data-testid="ind-verdict-score"
                  className="text-3xl font-mono font-black text-[var(--text)] tabular-nums"
                >
                  {verdict.scorePct}%
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--bg)] border border-[var(--border)] mt-2 overflow-hidden">
                  <div
                    className="h-full bg-[var(--text)]"
                    style={{ width: `${verdict.scorePct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 7-Dimension Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-4 border-t border-[var(--border)]">
              {verdict.dimensionScores.map((dim) => (
                <div
                  key={dim.dimension}
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg2)] flex items-center justify-between gap-2"
                >
                  <div className="text-[11px] font-mono font-semibold text-[var(--text2)] leading-snug break-words">
                    {tr(lang, dim.labelEn, dim.labelHi).replace(/^\d+\.\s*/, '')}
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-extrabold text-[var(--text)] shrink-0 tabular-nums">
                    {dim.scorePct}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths vs Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-[var(--border2)] bg-[var(--bg)]">
              <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {tr(
                    lang,
                    `Why You Can Succeed in ${cleanTitle}`,
                    `${cleanTitle} के लिए आपकी मजबूत बातें`
                  )}
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                {verdict.strengthsEn.map((stEn, idx) => {
                  const stHi = verdict.strengthsHi[idx] || stEn;
                  return (
                    <li key={`${stEn.slice(0, 15)}-${idx}`} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-[var(--text)]">✓</span>
                      <span className="break-words">{tr(lang, stEn, stHi)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border2)] bg-[var(--bg)]">
              <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {tr(
                    lang,
                    'What You Must Improve / Watch Out For',
                    'किन कमियों को सुधारना जरूरी है'
                  )}
                </span>
              </div>
              {verdict.gapsToFixEn.length === 0 ? (
                <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                  {tr(
                    lang,
                    'Zero critical blockers detected! Stay consistent with daily practice and past-year entrance papers.',
                    'कोई बड़ी रुकावट नहीं मिली! बस रोज़ाना अभ्यास और पिछले वर्षों के प्रश्नपत्रों पर ध्यान बनाए रखें।'
                  )}
                </p>
              ) : (
                <ul className="space-y-2 text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                  {verdict.gapsToFixEn.map((gapEn, idx) => {
                    const gapHi = verdict.gapsToFixHi[idx] || gapEn;
                    return (
                      <li key={`${gapEn.slice(0, 15)}-${idx}`} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-[var(--text)]">•</span>
                        <span className="break-words">{tr(lang, gapEn, gapHi)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* 3-Step Immediate Action Plan */}
          <div className="p-5 rounded-2xl border border-[var(--border2)] bg-[var(--bg)]">
            <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)] mb-3">
              {tr(
                lang,
                `Your 3-Step Next Action Plan for ${cleanTitle}`,
                `${cleanTitle} के लिए आपके अगले 3 व्यावहारिक कदम`
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {verdict.actionPlanEn.map((stepEn, idx) => {
                const stepHi = verdict.actionPlanHi[idx] || stepEn;
                return (
                  <div
                    key={`${stepEn.slice(0, 15)}-${idx}`}
                    className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs sm:text-sm text-[var(--text)] leading-relaxed break-words"
                  >
                    {tr(lang, stepEn, stepHi)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alternative / Sibling Career Recommendations when Conditional or Reconsider */}
          {siblingCareers.length > 0 && (
            <div className="p-5 rounded-2xl border border-[var(--border2)] bg-[var(--bg)]">
              <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)] mb-2">
                {verdict.verdictTier === 'RECONSIDER_ALTERNATIVE'
                  ? tr(
                      lang,
                      'Safer Alternative Careers You Should Compare Right Now:',
                      'आपके लिए अधिक सुरक्षित और उपयुक्त वैकल्पिक करियर:'
                    )
                  : tr(
                      lang,
                      'Compare Parallel Backup Pathways in This Field:',
                      'इसी क्षेत्र के समानांतर (Plan B) करियर विकल्प भी देखें:'
                    )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {siblingCareers.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => onSelectCareer(sc.id)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{getFormalDesignation(sc, lang)}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
