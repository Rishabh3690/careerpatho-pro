import React, { useState, useMemo } from 'react';
import { Language } from '../data/types';
import {
  calculateDropYearCost,
  calculateLoanEMI,
  loadPreference,
  savePreference,
  tr,
} from '../utils/careerEngine';
import { navigateToHash } from '../utils/hashRouter';
import {
  Compass,
  Calculator,
  Landmark,
  CheckCircle2,
  ArrowUpRight,
  GitCompare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface StudentRetentionHubProps {
  lang: Language;
  onStartQuiz: () => void;
  onShowToast?: (msg: string) => void;
}

type HubTab = 'matcher' | 'drop-cost' | 'loan-scholarship';
type StreamChoice = 'PCM' | 'PCB' | 'Commerce' | 'Arts';
type BudgetChoice = 'low' | 'mid' | 'any';

interface QuickMatchCard {
  id: string;
  titleEn: string;
  titleHi: string;
  stream: StreamChoice[];
  budget: BudgetChoice[];
  verifiedBadge: boolean;
  salarySummaryEn: string;
  salarySummaryHi: string;
  feeSummary: string;
  exams: string;
  comparePairId: string;
}

const VERIFIED_QUICK_MATCHES: QuickMatchCard[] = [
  {
    id: 'btech-cse',
    titleEn: 'B.Tech CSE (Software & Cloud Engineering)',
    titleHi: 'B.Tech CSE (सॉफ्टवेयर और क्लाउड इंजीनियरिंग)',
    stream: ['PCM'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'PLFS median ₹3.0 LPA · NIRF top-college median ₹13–23 LPA',
    salarySummaryHi: 'PLFS मीडियन ₹3.0 LPA · NIRF टॉप कॉलेज ₹13–23 LPA',
    feeSummary: 'Govt/NIT: ₹10k–₹5.5L · Pvt: ₹8L–₹22L',
    exams: 'JEE Main, JEE Advanced, State CETs, BITSAT',
    comparePairId: 'bca-software',
  },
  {
    id: 'barch-architecture',
    titleEn: 'B.Arch (Architecture & Urban Design)',
    titleHi: 'B.Arch (आर्किटेक्चर और अर्बन डिजाइन)',
    stream: ['PCM'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'NIRF median ₹2–6 LPA (Verified CoA & NIRF 2025)',
    salarySummaryHi: 'NIRF मीडियन ₹2–6 LPA (सत्यापित CoA और NIRF)',
    feeSummary: 'SPA/NIT Govt: ₹2.2L–₹5L',
    exams: 'NATA & JEE Main Paper 2A',
    comparePairId: 'b-des-product',
  },
  {
    id: 'bca-software',
    titleEn: 'BCA (Computer Applications & Full-Stack Track)',
    titleHi: 'BCA (कंप्यूटर एप्लीकेशन और सॉफ्टवेयर ट्रैक)',
    stream: ['PCM', 'Commerce', 'Arts'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'No single national exam · Check institute placement reports (UGC/AICTE)',
    salarySummaryHi: 'कोई एकल राष्ट्रीय परीक्षा नहीं · संस्थान प्लेसमेंट रिपोर्ट जांचें',
    feeSummary: 'Central/State Univ: ₹45k–₹3L',
    exams: 'CUET-UG / State University Merit',
    comparePairId: 'btech-cse',
  },
  {
    id: 'mbbs-clinical',
    titleEn: 'MBBS (Clinical Physician & Govt Medical Officer)',
    titleHi: 'MBBS (चिकित्सक और सरकारी मेडिकल ऑफिसर)',
    stream: ['PCB'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'Govt MO ₹80,000–1.1L/mo · Private fresher ₹40,000–75,000/mo',
    salarySummaryHi: 'सरकारी MO ₹80,000–1.1L/माह · प्राइवेट ₹40,000–75,000/माह',
    feeSummary: 'AIIMS/Govt: ₹6,800–₹2.5L total',
    exams: 'NEET-UG (NMC / MCC)',
    comparePairId: 'nursing-icu',
  },
  {
    id: 'nursing-icu',
    titleEn: 'B.Sc Nursing (AIIMS Nursing Officer & Clinical Care)',
    titleHi: 'B.Sc Nursing (AIIMS नर्सिंग ऑफिसर और क्लिनिकल केयर)',
    stream: ['PCB'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'Govt Nursing Officer ₹60,000–70,000/mo · Private ₹25,000–45,000/mo',
    salarySummaryHi: 'सरकारी नर्सिंग ऑफिसर ₹60,000–70,000/माह · प्राइवेट ₹25k–45k/माह',
    feeSummary: 'AIIMS/Govt College: ₹3,000–₹60,000',
    exams: 'AIIMS Nursing Entrance, State CETs, NEET-UG',
    comparePairId: 'mbbs-clinical',
  },
  {
    id: 'b-pharm-ind',
    titleEn: 'B.Pharm (Pharmaceutical R&D & Drug Regulatory)',
    titleHi: 'B.Pharm (फार्मास्यूटिकल R&D और ड्रग रेगुलेटरी)',
    stream: ['PCB', 'PCM'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'Entry via State CETs / CUET / NEET (GPAT is for M.Pharm)',
    salarySummaryHi: 'प्रवेश स्टेट CET / CUET से (GPAT केवल M.Pharm के लिए है)',
    feeSummary: 'Govt/NIPER: ₹60,000–₹3.5L',
    exams: 'State CETs, CUET-UG, BITSAT',
    comparePairId: 'nursing-icu',
  },
  {
    id: 'ca-audit',
    titleEn: 'Chartered Accountancy (ICAI CA — Statutory Audit & Tax)',
    titleHi: 'चार्टर्ड अकाउंटेंसी (ICAI CA — ऑडिट और टैक्सेशन)',
    stream: ['Commerce', 'PCM', 'PCB', 'Arts'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'ICAI campus avg ₹12.88 LPA · Broader fresher market ₹6–10 LPA',
    salarySummaryHi: 'ICAI कैंपस औसत ₹12.88 LPA · फ्रेशर मार्केट ₹6–10 LPA',
    feeSummary: '₹85,000 total statutory ICAI fee',
    exams: 'CA Foundation, Intermediate & Final (ICAI)',
    comparePairId: 'mba-marketing-pm',
  },
  {
    id: 'mba-marketing-pm',
    titleEn: 'BBA / Integrated Management (BBA + MBA)',
    titleHi: 'BBA / इंटीग्रेटेड मैनेजमेंट (BBA + MBA)',
    stream: ['Commerce', 'PCM', 'PCB', 'Arts'],
    budget: ['low', 'mid', 'any'],
    verifiedBadge: true,
    salarySummaryEn: 'BBA PLFS median ₹25,000/month (₹3.0 LPA)',
    salarySummaryHi: 'BBA PLFS मीडियन ₹25,000/माह (₹3.0 LPA)',
    feeSummary: 'DU/Central Univ BBA: ₹45,000–₹1.5L',
    exams: 'CUET-UG, IPMAT (IIM Indore/Rohtak)',
    comparePairId: 'ca-audit',
  },
  {
    id: 'ba-llb-corp',
    titleEn: 'BA LL.B Hons (National Law Universities & Corporate Law)',
    titleHi: 'BA LL.B Hons (नेशनल लॉ यूनिवर्सिटी और कॉर्पोरेट लॉ)',
    stream: ['Arts', 'Commerce', 'PCM', 'PCB'],
    budget: ['mid', 'any', 'low'],
    verifiedBadge: true,
    salarySummaryEn: 'NIRF median ₹3–20 LPA (Top NLUs ₹16–20 LPA, other colleges ₹3–6 LPA)',
    salarySummaryHi: 'NIRF मीडियन ₹3–20 LPA (टॉप NLU ₹16–20 LPA, अन्य ₹3–6 LPA)',
    feeSummary: 'Govt Law: ₹50k–₹3L · NLUs: ₹10L–₹14L',
    exams: 'CLAT (24 NLUs), AILET (NLU Delhi), MH-CET Law',
    comparePairId: 'ca-audit',
  },
  {
    id: 'b-des-product',
    titleEn: 'B.Des (NID / IIT UCEED Product & UI/UX Design)',
    titleHi: 'B.Des (NID / IIT UCEED प्रोडक्ट और UI/UX डिजाइन)',
    stream: ['Arts', 'PCM', 'PCB', 'Commerce'],
    budget: ['mid', 'any', 'low'],
    verifiedBadge: true,
    salarySummaryEn: 'Check institute placement reports (NID & IIT UCEED Official Portals)',
    salarySummaryHi: 'संस्थान की आधिकारिक प्लेसमेंट रिपोर्ट जांचें (NID / UCEED)',
    feeSummary: 'IIT/NID Govt: ₹8L–₹11L (4 Yrs)',
    exams: 'NID DAT, UCEED (IIT Bombay), NIFT',
    comparePairId: 'barch-architecture',
  },
];

export const StudentRetentionHub: React.FC<StudentRetentionHubProps> = ({
  lang,
  onStartQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('matcher');

  // Interactive 3-Step Checklist stored in localStorage so returning or new users see progress
  const [completedSteps, setCompletedSteps] = useState<string[]>(() =>
    loadPreference<string[]>('careerpatho-onboarding-steps', ['step-stream'])
  );

  const markStepDone = (stepId: string) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepId)) return prev;
      const next = [...prev, stepId];
      savePreference('careerpatho-onboarding-steps', next);
      return next;
    });
  };

  // Tab 1: Stream & Budget Matcher state
  const [selectedStream, setSelectedStream] = useState<StreamChoice>('PCM');
  const [selectedBudget, setSelectedBudget] = useState<BudgetChoice>('low');

  const matchedCards = useMemo(() => {
    return VERIFIED_QUICK_MATCHES.filter(
      (c) => c.stream.includes(selectedStream) && c.budget.includes(selectedBudget)
    ).slice(0, 3);
  }, [selectedStream, selectedBudget]);

  // Tab 2: Drop-Year Real Cost Calculator state
  const [coachingLakhs, setCoachingLakhs] = useState<number>(1.5);
  const [livingLakhs, setLivingLakhs] = useState<number>(0.9);
  const [lostSalaryLakhs, setLostSalaryLakhs] = useState<number>(3.0);

  const dropCostResult = useMemo(
    () => calculateDropYearCost(coachingLakhs, lostSalaryLakhs, livingLakhs),
    [coachingLakhs, lostSalaryLakhs, livingLakhs]
  );

  // Tab 3: PM-Vidyalaxmi Education Loan EMI & Scholarship state
  const [loanPrincipalInr, setLoanPrincipalInr] = useState<number>(400000);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(8);
  const [familyIncomeBracket, setFamilyIncomeBracket] = useState<'under45' | '45to8' | 'above8'>('under45');

  const effectiveInterestRate =
    familyIncomeBracket === 'under45' ? 5.5 : familyIncomeBracket === '45to8' ? 6.0 : 8.8;
  const monthlyEmiInr = useMemo(
    () => calculateLoanEMI(loanPrincipalInr, effectiveInterestRate, loanTenureYears),
    [loanPrincipalInr, effectiveInterestRate, loanTenureYears]
  );

  return (
    <section
      data-testid="student-retention-hub"
      className="mt-8 p-6 sm:p-8 rounded-3xl border-2 border-[var(--border2)] bg-[var(--bg2)] space-y-6"
    >
      {/* Header + 3-Step New Visitor Checklist */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] text-[11px] font-mono font-extrabold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {tr(
                lang,
                'NO NEED TO LEAVE · ALL-IN-ONE STUDENT TOOLKIT',
                'कहीं और जाने की ज़रूरत नहीं · ऑल-इन-वन छात्र टूलकिट'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]">
            {tr(
              lang,
              'Stay & Decide: Complete Student Decision Hub',
              'यहीं तय करें: स्ट्रीम मैचिंग, ड्रॉप-ईयर खर्च और एजुकेशन लोन कैलकुलेटर'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] max-w-2xl">
            {tr(
              lang,
              'Everything you need to shortlist your degree, calculate real in-hand salary, check drop-year loss, and compute education loan EMIs — in one place without leaving this page.',
              'अपनी स्ट्रीम के अनुसार सही डिग्री चुनना, असली इन-हैंड सैलरी, 1-साल ड्रॉप का असली नुकसान और बिना गारंटी एजुकेशन लोन की EMI — सब कुछ इसी पेज पर तुरंत जांचें।'
            )}
          </p>
        </div>

        {/* 3-Step Interactive Checklist Badge */}
        <div className="p-3.5 rounded-2xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono space-y-1.5 shrink-0">
          <div className="font-extrabold text-[var(--text)] flex items-center justify-between gap-3">
            <span>{tr(lang, 'Your 3-Step Career Plan:', 'आपका 3-स्टेप करियर प्लान:')}</span>
            <span className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px]">
              {completedSteps.length}/3
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[11px] text-[var(--text2)]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('matcher');
                markStepDone('step-stream');
              }}
              className="flex items-center gap-1.5 text-left hover:text-[var(--text)] cursor-pointer"
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 ${
                  completedSteps.includes('step-stream') ? 'text-[var(--text)]' : 'opacity-40'
                }`}
              />
              <span>1. {tr(lang, 'Shortlist by Class 12 Stream', '12वीं स्ट्रीम से करियर चुनें')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('drop-cost');
                markStepDone('step-drop');
              }}
              className="flex items-center gap-1.5 text-left hover:text-[var(--text)] cursor-pointer"
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 ${
                  completedSteps.includes('step-drop') ? 'text-[var(--text)]' : 'opacity-40'
                }`}
              />
              <span>2. {tr(lang, 'Check Drop-Year Financial Cost', '1-साल ड्रॉप का खर्च जांचें')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('loan-scholarship');
                markStepDone('step-loan');
              }}
              className="flex items-center gap-1.5 text-left hover:text-[var(--text)] cursor-pointer"
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 ${
                  completedSteps.includes('step-loan') ? 'text-[var(--text)]' : 'opacity-40'
                }`}
              />
              <span>3. {tr(lang, 'Check Govt Loan & Scholarship', 'सरकारी लोन व छात्रवृत्ति देखें')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Interactive Tool Tabs */}
      <div
        role="tablist"
        aria-label="Student Retention Tools"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'matcher'}
          data-testid="retention-tab-matcher"
          onClick={() => {
            setActiveTab('matcher');
            markStepDone('step-stream');
          }}
          className={`min-h-[46px] px-4 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'matcher'
              ? 'bg-[var(--text)] text-[var(--bg)]'
              : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span>{tr(lang, 'Instant Stream & Budget Matcher', 'स्ट्रीम और बजट मैचर')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'drop-cost'}
          data-testid="retention-tab-drop-cost"
          onClick={() => {
            setActiveTab('drop-cost');
            markStepDone('step-drop');
          }}
          className={`min-h-[46px] px-4 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'drop-cost'
              ? 'bg-[var(--text)] text-[var(--bg)]'
              : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
          }`}
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span>{tr(lang, 'Drop-Year Cost Calculator', 'ड्रॉप-ईयर खर्च कैलकुलेटर')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'loan-scholarship'}
          data-testid="retention-tab-loan"
          onClick={() => {
            setActiveTab('loan-scholarship');
            markStepDone('step-loan');
          }}
          className={`min-h-[46px] px-4 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'loan-scholarship'
              ? 'bg-[var(--text)] text-[var(--bg)]'
              : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
          }`}
        >
          <Landmark className="w-4 h-4 shrink-0" />
          <span>{tr(lang, 'Education Loan & Scholarships', 'एजुकेशन लोन और छात्रवृत्ति')}</span>
        </button>
      </div>

      {/* TAB 1 CONTENT: Instant Stream & Budget Shortlister */}
      {activeTab === 'matcher' && (
        <div data-testid="retention-panel-matcher" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
            <div>
              <div className="text-xs font-mono font-bold text-[var(--text2)] mb-2">
                {tr(lang, '1. Select Your Class 12 Stream:', '1. अपनी कक्षा 12 की स्ट्रीम चुनें:')}
              </div>
              <div className="flex flex-wrap gap-2">
                {(['PCM', 'PCB', 'Commerce', 'Arts'] as StreamChoice[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    data-testid={`quick-stream-${st}`}
                    onClick={() => {
                      setSelectedStream(st);
                      markStepDone('step-stream');
                    }}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-extrabold cursor-pointer ${
                      selectedStream === st
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'bg-[var(--bg2)] text-[var(--text)] border border-[var(--border2)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono font-bold text-[var(--text2)] mb-2">
                {tr(lang, '2. Total 4-Year College Fee Budget:', '2. कुल कॉलेज फीस बजट चुनें:')}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'low' as BudgetChoice, labelEn: 'Govt Seat (< ₹2L)', labelHi: 'सरकारी सीट (< ₹2 लाख)' },
                  { id: 'mid' as BudgetChoice, labelEn: 'Moderate (₹2L–₹8L)', labelHi: 'मध्यम बजट (₹2–8 लाख)' },
                  { id: 'any' as BudgetChoice, labelEn: 'Any / Loan Eligible', labelHi: 'कोई भी / लोन सहित' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBudget(b.id)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                      selectedBudget === b.id
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'bg-[var(--bg2)] text-[var(--text)] border border-[var(--border2)]'
                    }`}
                  >
                    {tr(lang, b.labelEn, b.labelHi)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {matchedCards.map((card) => (
              <div
                key={card.id}
                data-testid={`quick-match-card-${card.id}`}
                className="p-4 rounded-2xl border border-[var(--border2)] bg-[var(--bg)] flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{tr(lang, 'Verified', 'सत्यापित')}</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[var(--text3)]">
                      {card.stream.join(' / ')}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-[var(--text)]">
                    {tr(lang, card.titleEn, card.titleHi)}
                  </h3>

                  <div className="text-xs font-mono text-[var(--text)] font-bold">
                    {tr(lang, card.salarySummaryEn, card.salarySummaryHi)}
                  </div>

                  <div className="text-[11px] font-mono text-[var(--text2)] space-y-0.5 pt-1 border-t border-[var(--border)]">
                    <div>
                      <strong>Exams:</strong> {card.exams}
                    </div>
                    <div>
                      <strong>Fees:</strong> {card.feeSummary}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => navigateToHash(`#/career/${card.id}`)}
                    className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs inline-flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                  >
                    <span>{tr(lang, 'View', 'देखें')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigateToHash(`#/compare?c1=${card.id}&c2=${card.comparePairId}`)
                    }
                    className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] font-mono font-bold text-xs inline-flex items-center justify-center gap-1 hover:border-[var(--text)] cursor-pointer"
                    title="Compare Side-by-Side"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>{tr(lang, 'Compare', 'तुलना')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono">
            <span className="text-[var(--text2)]">
              {tr(
                lang,
                'Want a deeper personalized match across all 373+ careers?',
                'क्या आप सभी 373+ करियर में से अपने लिए सबसे सटीक मैच जानना चाहते हैं?'
              )}
            </span>
            <button
              type="button"
              data-testid="retention-start-quiz-btn"
              onClick={onStartQuiz}
              className="underline font-extrabold text-[var(--text)] hover:opacity-80 cursor-pointer"
            >
              {tr(lang, 'Take the 25-Question Career Quiz →', '25-प्रश्न करियर क्विज़ अभी दें →')}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2 CONTENT: 1-Year Drop Cost vs Immediate Start Calculator */}
      {activeTab === 'drop-cost' && (
        <div
          data-testid="retention-panel-drop-cost"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="drop-coaching-select"
                className="block text-xs font-mono font-bold text-[var(--text2)] mb-1.5"
              >
                {tr(lang, '1-Year Coaching Fee (₹ Lakhs):', '1-साल की कोचिंग फीस (₹ लाख):')}
              </label>
              <select
                id="drop-coaching-select"
                value={coachingLakhs}
                onChange={(e) => setCoachingLakhs(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] font-mono font-bold text-xs text-[var(--text)]"
              >
                <option value={0.5}>₹0.5 Lakhs (Online / Self-Study)</option>
                <option value={1.5}>₹1.5 Lakhs (Standard Offline Coaching)</option>
                <option value={2.2}>₹2.2 Lakhs (Metro / Kota Batch)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="drop-living-select"
                className="block text-xs font-mono font-bold text-[var(--text2)] mb-1.5"
              >
                {tr(lang, 'Hostel / PG & Test Series (₹ Lakhs):', 'हॉस्टल / पीजी व टेस्ट खर्च (₹ लाख):')}
              </label>
              <select
                id="drop-living-select"
                value={livingLakhs}
                onChange={(e) => setLivingLakhs(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] font-mono font-bold text-xs text-[var(--text)]"
              >
                <option value={0.3}>₹0.3 Lakhs (Staying at Home)</option>
                <option value={0.9}>₹0.9 Lakhs (Shared Hostel / Mess)</option>
                <option value={1.5}>₹1.5 Lakhs (Metro PG + Books)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="drop-salary-select"
                className="block text-xs font-mono font-bold text-[var(--text2)] mb-1.5"
              >
                {tr(
                  lang,
                  '1-Yr Delayed Entry Salary (PLFS/NIRF):',
                  '1 साल देरी से मिलने वाली शुरुआती सैलरी:'
                )}
              </label>
              <select
                id="drop-salary-select"
                value={lostSalaryLakhs}
                onChange={(e) => setLostSalaryLakhs(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] font-mono font-bold text-xs text-[var(--text)]"
              >
                <option value={3.0}>₹3.0 LPA (PLFS National Graduate Median)</option>
                <option value={6.0}>₹6.0 LPA (Tier-2 / Corporate Track)</option>
                <option value={12.0}>₹12.0 LPA (ICAI / Top-Tier Track)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase text-[var(--text3)]">
                {tr(
                  lang,
                  'TOTAL 1-YEAR DROP FINANCIAL IMPACT (COACHING + HOSTEL + 1 YR LOST SALARY)',
                  '1 साल ड्रॉप लेने का कुल वित्तीय नुकसान (कोचिंग + हॉस्टल + 1 साल की खोई सैलरी)'
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--text)]">
                {tr(lang, dropCostResult.summaryEn, dropCostResult.summaryHi)}
              </p>
            </div>
            <div
              data-testid="drop-year-total-loss"
              className="px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-black text-base sm:text-lg whitespace-nowrap self-start sm:self-center"
            >
              ₹{dropCostResult.totalLossLakhs} Lakhs
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 CONTENT: PM-Vidyalaxmi Education Loan EMI & Scholarship Checker */}
      {activeTab === 'loan-scholarship' && (
        <div
          data-testid="retention-panel-loan"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="loan-amount-select"
                className="block text-xs font-mono font-bold text-[var(--text2)] mb-1.5"
              >
                {tr(lang, 'Education Loan Amount:', 'एजुकेशन लोन राशि:')}
              </label>
              <select
                id="loan-amount-select"
                value={loanPrincipalInr}
                onChange={(e) => setLoanPrincipalInr(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] font-mono font-bold text-xs text-[var(--text)]"
              >
                <option value={200000}>₹2.0 Lakhs (Govt / State Univ Fee)</option>
                <option value={400000}>₹4.0 Lakhs (No Collateral Required)</option>
                <option value={750000}>₹7.5 Lakhs (PM-Vidyalaxmi 75% Govt Guarantee)</option>
                <option value={1200000}>₹12.0 Lakhs (Premier Private / NLU / IIT)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="loan-income-select"
                className="block text-xs font-mono font-bold text-[var(--text2)] mb-1.5"
              >
                {tr(lang, 'Annual Family Income:', 'वार्षिक पारिवारिक आय:')}
              </label>
              <select
                id="loan-income-select"
                value={familyIncomeBracket}
                onChange={(e) =>
                  setFamilyIncomeBracket(e.target.value as 'under45' | '45to8' | 'above8')
                }
                className="w-full min-h-[42px] px-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] font-mono font-bold text-xs text-[var(--text)]"
              >
                <option value="under45">Under ₹4.5 LPA (100% Interest Subsidy in College — CSIS)</option>
                <option value="45to8">₹4.5L – ₹8.0 LPA (3% PM-Vidyalaxmi Interest Subvention)</option>
                <option value="above8">Above ₹8.0 LPA (Standard Public Bank Rate ~8.8%)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="loan-tenure-select"
                className="block text-xs font-mono font-bold text-[var(--text2)] mb-1.5"
              >
                {tr(lang, 'Repayment Tenure (After Graduation):', 'लोन चुकाने की अवधि (पढ़ाई के बाद):')}
              </label>
              <select
                id="loan-tenure-select"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] font-mono font-bold text-xs text-[var(--text)]"
              >
                <option value={5}>5 Years</option>
                <option value={8}>8 Years</option>
                <option value={10}>10 Years</option>
                <option value={12}>12 Years</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="font-mono font-bold uppercase text-[var(--text)]">
                {tr(
                  lang,
                  'ESTIMATED MONTHLY EMI AFTER GRADUATION (+1 YR MORATORIUM)',
                  'ग्रेजुएशन के बाद अनुमानित मासिक किस्त (EMI)'
                )}
              </div>
              <p className="text-[var(--text2)]">
                {familyIncomeBracket === 'under45'
                  ? 'Eligible for CSIS 100% Interest Waiver during degree + PM-Vidyalaxmi collateral-free guarantee (scholarships.gov.in).'
                  : familyIncomeBracket === '45to8'
                  ? 'Eligible for PM-Vidyalaxmi 3% interest subvention up to ₹10 Lakhs with zero collateral.'
                  : 'Collateral-free up to ₹7.5 Lakhs under PM-Vidyalaxmi credit guarantee.'}
              </p>
            </div>
            <div
              data-testid="loan-emi-display"
              className="px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-black text-base sm:text-lg whitespace-nowrap self-start sm:self-center"
            >
              ₹{monthlyEmiInr.toLocaleString('en-IN')}/month
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentRetentionHub;
