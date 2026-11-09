import React, { useState } from 'react';
import { RoadmapStep, Language, CareersDatabase } from '../data/types';
import { t, tr } from '../utils/careerEngine';
import {
  ChevronDown,
  ArrowRight,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Cpu,
  Target,
  ShieldAlert,
  BookOpen,
  Layers,
  Lock,
} from 'lucide-react';
import { CareerSvgIcon } from './CareerSvgIcon';

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  lang: Language;
  openIndexes: number[];
  careersData: CareersDatabase;
  onNavigateCareer: (careerId: string) => void;
}

/**
 * Generates stage-specific deliverables, weekly effort benchmarks, and pitfall warnings
 * so every single roadmap phase gives students actionable execution clarity across all 7 languages.
 */
function getStageExecutionExtras(step: RoadmapStep, idx: number, total: number, lang: Language) {
  const examsList =
    step.details?.exams?.join(', ') || tr(lang, 'Entrance / Merit Test', 'प्रवेश / मेरिट परीक्षा');
  const skillsList =
    step.details?.skills?.slice(0, 2).join(' & ') ||
    tr(lang, 'Core Domain Fundamentals', 'मूलभूत डोमेन कौशल');

  if (idx === 0) {
    return {
      phaseTag: tr(lang, 'PHASE 1 · FOUNDATION & ENTRY GATE', 'चरण 1 · नींव और प्रवेश'),
      weeklyEffort: tr(lang, '15–20 hrs/wk (Focused Prep)', '15–20 घंटे / सप्ताह (केंद्रित तैयारी)'),
      freeStack: tr(
        lang,
        'NCERT Core + 10-Yr Past Papers (PYQs) + Official Mock Tests',
        'NCERT + पिछले 10 वर्षों के प्रश्नपत्र (PYQs) + NTA/NPTEL मॉक'
      ),
      pitfall: tr(
        lang,
        'Jumping into expensive coaching without mastering syllabus weightage & 10-year PYQs.',
        'बिना पिछले वर्षों के कटऑफ और सिलेबस देखे महंगे कोचिंग बैच में समय गंवाना।'
      ),
      deliverables: [
        tr(
          lang,
          `Lock in stream fundamentals & core subject command (${step.duration || '1–2 Yrs'})`,
          `पात्रता और मुख्य विषय मजबूत करें (${step.duration || '1–2 वर्ष'})`
        ),
        tr(
          lang,
          `Complete 25+ full-length timed mocks for ${examsList}`,
          `${examsList} के लिए 25+ फुल-लेंथ मॉक टेस्ट और समय प्रबंधन पूरा करें`
        ),
        tr(
          lang,
          'Apply across Central/State counseling rounds + Govt scholarship portals simultaneously',
          'सरकारी व शीर्ष एनआईआरएफ (NIRF) कॉलेजों की काउंसलिंग और छात्रवृत्ति फॉर्म समय पर भरें'
        ),
      ],
    };
  }

  if (idx < total - 1) {
    return {
      phaseTag: tr(
        lang,
        `PHASE ${idx + 1} · CORE SKILL & LAB MASTERY`,
        `चरण ${idx + 1} · कौशल और प्रैक्टिकल निर्माण`
      ),
      weeklyEffort: tr(lang, '12–16 hrs/wk (Labs & Projects)', '12–16 घंटे / सप्ताह (प्रोजेक्ट्स व लैब)'),
      freeStack: tr(
        lang,
        'SWAYAM / NPTEL IIT Lectures + Real Industry Case Projects',
        'SWAYAM / NPTEL सर्टिफिकेशन + ओपन-सोर्स / इंटर्नशिप पोर्टफोलियो'
      ),
      pitfall: tr(
        lang,
        'Relying purely on college theory exams with zero hands-on internships or proof-of-work.',
        'केवल कॉलेज की थ्योरी परीक्षाओं पर निर्भर रहना और कोई वास्तविक इंटर्नशिप या पोर्टफोलियो न बनाना।'
      ),
      deliverables: [
        tr(
          lang,
          `Build verifiable proof-of-work in ${skillsList} (2+ audited projects/cases)`,
          `${skillsList} में व्यावहारिक दक्षता और कम से कम 2 लाइव प्रोजेक्ट बनाएं`
        ),
        tr(
          lang,
          'Complete a 6–8 week summer internship, clinical rotation, or research apprenticeship',
          'अकादमिक ब्रेक के दौरान 6-8 सप्ताह की वास्तविक इंडस्ट्री / क्लिनिकल / फील्ड इंटर्नशिप करें'
        ),
        tr(
          lang,
          'Benchmark resume & portfolio against top-decile placement/selection criteria',
          'सीनियर्स और पूर्व छात्रों (Alumni) के साथ नेटवर्क बनाएं और प्लेसमेंट प्रोफाइल तैयार करें'
        ),
      ],
    };
  }

  return {
    phaseTag: tr(
      lang,
      `PHASE ${idx + 1} · CAREER LAUNCH & ACCELERATION`,
      `चरण ${idx + 1} · करियर लॉन्च और ग्रोथ`
    ),
    weeklyEffort: tr(
      lang,
      'Full-Time Execution + Continuous Upskilling',
      'पूर्णकालिक पेशेवर निष्पादन + अपस्किलिंग'
    ),
    freeStack: tr(
      lang,
      'Industry Benchmark Reports + Professional Licensing / Fellowship Tracks',
      'इंडस्ट्री बेंचमार्क रिपोर्ट्स + प्रोफेशनल लाइसेंसिंग गाइड्स'
    ),
    pitfall: tr(
      lang,
      'Signing predatory employment bonds without reading clauses or stagnating after your first role.',
      'पहली नौकरी मिलते ही सीखना बंद कर देना या बॉन्ड/अनुबंध की शर्तों को बिना पढ़े साइन करना।'
    ),
    deliverables: [
      tr(
        lang,
        `Convert final placement / selection gate (${step.details?.salaryInr?.entry || 'Entry Band'})`,
        `पहली पूर्णकालिक भूमिका में उच्च-प्रभाव प्रदर्शन (${step.details?.salaryInr?.entry || 'एंट्री बैंड'})`
      ),
      tr(
        lang,
        'Target 2–3 year specialization jump to unlock mid-career 2x compensation multiplier',
        '2–3 वर्षों के भीतर मिड-सीनियर प्रमोशन या विशेषज्ञता प्रमाणन प्राप्त करें'
      ),
      tr(
        lang,
        'Build domain authority, mentorship network, and senior leadership track record',
        'नेतृत्व, डोमेन विशेषज्ञता और हाई-आरओआई (High-ROI) नेटवर्क का विस्तार करें'
      ),
    ],
  };
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  steps,
  lang,
  openIndexes,
  careersData,
  onNavigateCareer,
}) => {
  // Open first two steps by default so users immediately see deep roadmap content
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggleStep = (index: number) => {
    setExpandedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const allExpanded = steps.every((_, i) => !!expandedSteps[i]);
  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedSteps({ 0: true });
    } else {
      const next: Record<number, boolean> = {};
      steps.forEach((_, i) => {
        next[i] = true;
      });
      setExpandedSteps(next);
    }
  };

  const filteredBadgeText = tr(lang, 'Stream Mismatch', 'आपकी स्ट्रीम के लिए नहीं');

  return (
    <div className="mb-10">
      {/* Top Interactive Roadmap Control Bar & Visual Phase Stepper */}
      <div className="p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-1.5">
          {steps.map((step, idx) => {
            const isOpen = !!expandedSteps[idx];
            return (
              <React.Fragment key={`${step.id || 'step'}-${idx}`}>
                <button
                  type="button"
                  onClick={() => toggleStep(idx)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isOpen
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
                  }`}
                >
                  <span>P{idx + 1}</span>
                  <span className="hidden md:inline truncate max-w-[110px]">
                    · {t(step, 'title', lang)}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <span className="text-[var(--text3)] font-mono text-xs">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleToggleAll}
          className="px-3 py-1.5 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] font-mono font-bold text-[11px] transition-colors cursor-pointer self-start sm:self-center shrink-0"
        >
          {allExpanded
            ? tr(lang, 'Collapse Phases', 'संक्षिप्त करें (Collapse)')
            : tr(lang, `Expand All ${steps.length} Phases`, `सभी ${steps.length} चरण खोलें`)}
        </button>
      </div>

      {/* Step Cards */}
      <div className="flex flex-col gap-3.5">
        {steps.map((step, idx) => {
          const isEligible = openIndexes.includes(idx);
          const isOpen = !!expandedSteps[idx];
          const stepTitle = t(step, 'title', lang);
          const stepDesc = t(step, 'description', lang);
          const details = step.details || {};
          const extras = getStageExecutionExtras(step, idx, steps.length, lang);

          return (
            <div
              key={`${step.id || 'step'}-${idx}`}
              id={`step-card-${idx}`}
              className={`rounded-2xl border overflow-hidden transition-all duration-200 bg-[var(--bg2)] ${
                isOpen ? 'border-[var(--text)]' : 'border-[var(--border2)]'
              } ${!isEligible ? 'opacity-60' : ''}`}
            >
              {/* Header */}
              <button
                type="button"
                onClick={() => toggleStep(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3.5 hover:bg-[var(--bg3)]/50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 font-mono tabular-nums">
                  0{idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] mb-1 text-[var(--text3)] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-bold">
                      {extras.phaseTag}
                    </span>
                    {step.duration && (
                      <span className="inline-flex items-center gap-1 text-[var(--text2)] tabular-nums">
                        <Clock className="w-3 h-3" />
                        <span>{step.duration}</span>
                      </span>
                    )}
                    {step.ageHint && (
                      <span className="inline-flex items-center gap-1 text-[var(--text2)] tabular-nums">
                        <User className="w-3 h-3" />
                        <span>{step.ageHint}</span>
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-extrabold text-[var(--text)] leading-snug flex items-center flex-wrap gap-2 ${
                      !isEligible ? 'line-through' : ''
                    }`}
                  >
                    <span>{stepTitle}</span>
                    {!isEligible && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--text2)] border border-[var(--border2)]">
                        <AlertCircle className="w-3 h-3" />
                        <span>{filteredBadgeText}</span>
                      </span>
                    )}
                  </h3>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-[var(--text2)] shrink-0 transition-transform duration-200 mt-1 ${
                    isOpen ? 'rotate-180 text-[var(--text)]' : ''
                  }`}
                />
              </button>

              {/* Expandable Body */}
              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 border-t border-[var(--border)] flex flex-col gap-4 bg-[var(--bg)]/50 text-xs">
                  <p className="text-sm pt-4 leading-relaxed text-[var(--text2)]">{stepDesc}</p>

                  {/* Subgrid: What / Why / How */}
                  {(details.what || details.why || details.how) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {details.what && (
                        <div className="p-3.5 rounded-xl border bg-[var(--bg2)] border-[var(--border)]">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-1">
                            {tr(lang, '01 · WHAT HAPPENS', 'क्या होता है (What)')}
                          </div>
                          <div className="text-xs leading-relaxed text-[var(--text)]">
                            {t(details, 'what', lang)}
                          </div>
                        </div>
                      )}
                      {details.why && (
                        <div className="p-3.5 rounded-xl border bg-[var(--bg2)] border-[var(--border)]">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-1">
                            {tr(lang, '02 · WHY IT MATTERS', 'क्यों आवश्यक है (Why)')}
                          </div>
                          <div className="text-xs leading-relaxed text-[var(--text)]">
                            {t(details, 'why', lang)}
                          </div>
                        </div>
                      )}
                      {details.how && (
                        <div className="p-3.5 rounded-xl border bg-[var(--bg2)] border-[var(--border)]">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-1">
                            {tr(lang, '03 · HOW TO EXECUTE', 'कैसे करें (How)')}
                          </div>
                          <div className="text-xs leading-relaxed text-[var(--text)]">
                            {t(details, 'how', lang)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stage Action Checklist & Strategy Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Left 7 cols: Concrete Deliverables Checklist */}
                    <div className="lg:col-span-7 p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                      <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5 mb-2.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>
                          {tr(
                            lang,
                            'STAGE DELIVERABLES & MILESTONE CHECKLIST',
                            'इस चरण के अनिवार्य लक्ष्य (Action Checklist)'
                          )}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {extras.deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-xs text-[var(--text2)]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text)] shrink-0 mt-0.5" />
                            <span className="leading-snug text-[var(--text)]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right 5 cols: Effort, Free Study Stack & Critical Mistake to Avoid */}
                    <div className="lg:col-span-5 p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] flex flex-col justify-between gap-2.5">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text3)] uppercase mb-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {tr(lang, 'FREE PREP STACK', 'निःशुल्क संसाधन स्टैक')}
                          </span>
                          <span className="font-bold text-[var(--text)]">{extras.weeklyEffort}</span>
                        </div>
                        <div className="text-xs font-semibold text-[var(--text)] leading-snug">
                          {extras.freeStack}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[var(--border)]">
                        <div className="text-[10px] font-mono font-bold uppercase text-[var(--text3)] flex items-center gap-1 mb-0.5">
                          <ShieldAlert className="w-3 h-3 text-[var(--text)]" />
                          <span>{tr(lang, 'TRAP TO AVOID IN THIS PHASE', 'इस चरण में किस गलती से बचें')}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text2)] leading-snug">{extras.pitfall}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exams, Skills & Compensation Band in a Compact 3-Column Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Exams Chips */}
                    <div className="p-3 rounded-xl border bg-[var(--bg2)] border-[var(--border)]">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-2 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-[var(--text)]" />
                        <span>{tr(lang, 'ENTRANCE / GATEWAY EXAMS', 'प्रवेश / लाइसेंस परीक्षा')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(
                          new Set(
                            details.exams && details.exams.length > 0
                              ? details.exams
                              : [tr(lang, 'Merit / Direct Counseling', 'मेरिट / काउंसलिंग')]
                          )
                        ).map((ex, exIdx) => (
                          <span
                            key={`${ex}-${exIdx}`}
                            className="px-2 py-0.5 rounded border text-[11px] font-mono font-semibold bg-[var(--bg)] border-[var(--border2)] text-[var(--text)]"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skills Chips */}
                    <div className="p-3 rounded-xl border bg-[var(--bg2)] border-[var(--border)]">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-2 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[var(--text)]" />
                        <span>{tr(lang, 'CORE SKILLS ACQUIRED', 'प्रमुख कौशल (Skills)')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(
                          new Set(
                            details.skills && details.skills.length > 0
                              ? details.skills
                              : [
                                  tr(lang, 'Domain Execution', 'डोमेन विश्लेषण'),
                                  tr(lang, 'Applied Systems', 'प्रैक्टिकल लैब'),
                                ]
                          )
                        ).map((sk, skIdx) => (
                          <span
                            key={`${sk}-${skIdx}`}
                            className="px-2 py-0.5 rounded border text-[11px] font-mono font-medium bg-[var(--bg)] border-[var(--border)] text-[var(--text)]"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Salary Box */}
                    <div className="p-3 rounded-xl border bg-[var(--bg2)] border-[var(--border)]">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[var(--text)]" />
                        <span>{tr(lang, 'COMPENSATION BAND', 'वेतन बैंड (CTC Band)')}</span>
                      </div>
                      {details.salaryInr &&
                      (details.salaryInr.entry || details.salaryInr.mid || details.salaryInr.senior) ? (
                        <div className="grid grid-cols-3 gap-1.5 font-mono">
                          <div>
                            <div className="text-[9px] text-[var(--text3)] uppercase">
                              {tr(lang, 'Entry', 'शुरुआती')}
                            </div>
                            <div className="text-[11px] font-bold text-[var(--text)] truncate">
                              {details.salaryInr.entry || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-[var(--text3)] uppercase">
                              {tr(lang, 'Mid', 'मध्यम')}
                            </div>
                            <div className="text-[11px] font-bold text-[var(--text)] truncate">
                              {details.salaryInr.mid || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-[var(--text3)] uppercase">
                              {tr(lang, 'Senior', 'वरिष्ठ')}
                            </div>
                            <div className="text-[11px] font-bold text-[var(--text)] truncate">
                              {details.salaryInr.senior || '—'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-[var(--text2)]">
                          {tr(
                            lang,
                            'Academic / Foundation Phase (Pre-Placement)',
                            'शैक्षणिक / फाउंडेशन चरण (कौशल निर्माण)'
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Strategic Safety Net / Multi-Track Career Insurance */}
                  {step.planB && step.planB.length > 0 && (
                    <div className="pt-3 border-t border-dashed border-[var(--border2)]">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text2)] mb-2">
                        {tr(
                          lang,
                          'STRATEGIC SAFETY NET • MULTI-TRACK CAREER INSURANCE (IF CUTOFFS MISS)',
                          'रणनीतिक सुरक्षा कवच (Multi-Track Career Insurance / Strategic Safety Net)'
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.planB.map((pb, pbIdx) => {
                          const target = careersData.children?.[pb.careerId];
                          if (target) {
                            return (
                              <button
                                key={`${pb.careerId}-${pbIdx}`}
                                type="button"
                                onClick={() => onNavigateCareer(target.id)}
                                className="min-h-[48px] p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer hover:border-[var(--text)] transition-colors bg-[var(--bg2)] border-[var(--border)] text-left"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--bg3)] border border-[var(--border2)] flex items-center justify-center shrink-0 text-[var(--text)]">
                                    <CareerSvgIcon id={target.id} category={target.category} className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-[var(--text)] truncate">
                                      {t(target, 'title', lang)}
                                    </div>
                                    <div className="text-[11px] text-[var(--text2)] line-clamp-1">
                                      {t(pb, 'reason', lang)}
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[var(--text2)] shrink-0" />
                              </button>
                            );
                          }
                          return (
                            <div
                              key={`${pb.careerId}-${pbIdx}`}
                              className="p-3 rounded-xl border flex items-center justify-between gap-3 opacity-60 bg-[var(--bg2)] border-[var(--border)]"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center text-[var(--text2)]">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-xs text-[var(--text)]">
                                    {tr(lang, 'Upcoming Pathway', 'जल्द आ रहा है')}
                                  </div>
                                  <div className="text-[11px] text-[var(--text2)]">{t(pb, 'reason', lang)}</div>
                                </div>
                              </div>
                              <Lock className="w-3.5 h-3.5 text-[var(--text3)]" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
