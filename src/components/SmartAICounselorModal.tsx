import React, { useState } from 'react';
import { CareersDatabase, Language, AICareerMatchResult } from '../data/types';
import { runSmartCareerMatcher, parseNaturalCareerQuery, t } from '../utils/careerEngine';
import { CareerSvgIcon } from './CareerSvgIcon';
import {
  X,
  Compass,
  ArrowRight,
  ShieldAlert,
  Target,
  Terminal,
  Sliders,
  Check,
} from 'lucide-react';

interface SmartAICounselorModalProps {
  data: CareersDatabase;
  lang: Language;
  onClose: () => void;
  onSelectCareer: (careerId: string) => void;
}

export const SmartAICounselorModal: React.FC<SmartAICounselorModalProps> = ({
  data,
  lang,
  onClose,
  onSelectCareer,
}) => {
  const isHi = lang === 'hi';

  const [naturalPrompt, setNaturalPrompt] = useState<string>('');
  const [detectedSignals, setDetectedSignals] = useState<string[]>([]);
  const [selectedTalents, setSelectedTalents] = useState<string[]>(['coding']);
  const [stream, setStream] = useState<string>('PCM');
  const [percentBucket, setPercentBucket] = useState<string>('60-75');
  const [budgetMax, setBudgetMax] = useState<number>(10);
  const [workStyle, setWorkStyle] = useState<'corporate' | 'public-service' | 'creative-remote' | 'any'>('corporate');

  const [results, setResults] = useState<AICareerMatchResult[] | null>(() =>
    runSmartCareerMatcher(data, {
      talents: ['coding'],
      stream: 'PCM',
      boardPercentBucket: '60-75',
      budgetMaxLakhs: 10,
      workStyle: 'corporate',
    }).slice(0, 6)
  );
  const [activeDoubt, setActiveDoubt] = useState<string>('drop-year');

  const talentOptions = [
    { id: 'coding', label: isHi ? 'लॉजिक, कोडिंग व गणित' : 'Logic, Code & Math', cat: 'engineering' },
    { id: 'healthcare', label: isHi ? 'बायोलॉजी व चिकित्सा' : 'Biology & Healthcare', cat: 'medical' },
    { id: 'finance', label: isHi ? 'फाइनेंस, CA व बिजनेस' : 'Finance & Business', cat: 'commerce' },
    { id: 'law-governance', label: isHi ? 'कानून, नीति व प्रशासन' : 'Law & Governance', cat: 'law' },
    { id: 'design', label: isHi ? 'डिजाइन, आर्किटेक्चर व UX' : 'Design, UX & Media', cat: 'design' },
    { id: 'aviation', label: isHi ? 'पायलट, नेवी व डिफेंस' : 'Aviation & Defense', cat: 'vocational' },
  ];

  const toggleTalent = (id: string) => {
    setSelectedTalents((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  const handleAnalyzePrompt = (customText?: string) => {
    const textToParse = customText !== undefined ? customText : naturalPrompt;
    const parsed = parseNaturalCareerQuery(textToParse);
    const nextTalents = parsed.talents && parsed.talents.length > 0 ? parsed.talents : selectedTalents;
    const nextStream = parsed.stream || stream;
    const nextBudget = parsed.budgetMaxLakhs !== undefined ? parsed.budgetMaxLakhs : budgetMax;
    const nextStyle = (parsed.workStyle as typeof workStyle) || workStyle;

    setSelectedTalents(nextTalents);
    setStream(nextStream);
    setBudgetMax(nextBudget);
    setWorkStyle(nextStyle);
    setDetectedSignals(parsed.detectedKeywords || []);

    const matched = runSmartCareerMatcher(data, {
      talents: nextTalents,
      stream: nextStream,
      boardPercentBucket: percentBucket,
      budgetMaxLakhs: nextBudget,
      workStyle: nextStyle,
    });
    setResults(matched.slice(0, 6));
  };

  const handleRunMatch = () => {
    const matched = runSmartCareerMatcher(data, {
      talents: selectedTalents,
      stream,
      boardPercentBucket: percentBucket,
      budgetMaxLakhs: budgetMax,
      workStyle,
    });
    setResults(matched.slice(0, 6));
  };

  const samplePrompts = [
    {
      label: isHi ? 'कम बजट में हाई-सैलरी टेक करियर' : 'Low budget (<₹3L) + High salary coding path',
      prompt: 'I love coding and math, have PCM stream, need low budget govt college under 3 lakhs with high salary',
    },
    {
      label: isHi ? 'बिना NEET मेडिकल व बायोटेक विकल्प' : 'PCB student without NEET wanting high corporate pay',
      prompt: 'PCB biology student looking for medical healthcare or tech career with high salary package',
    },
    {
      label: isHi ? 'कॉमर्स/आर्ट्स से फाइनेंस या टेक लॉ' : 'Commerce / Arts student aiming for Finance or Law',
      prompt: 'Commerce and law student interested in finance, investment banking, corporate law and high salary',
    },
  ];

  const sampleDoubtAnswers: Record<string, { q: string; a: string }> = {
    'drop-year': {
      q: isHi ? 'क्या मुझे JEE / NEET के लिए ड्रॉप लेना चाहिए?' : 'Should I take a drop year for JEE or NEET?',
      a: isHi
        ? 'यदि आपका स्कोर पिछले प्रयास में 85+ परसेंटाइल था और बुनियादी सिद्धांत स्पष्ट हैं, तो 1 साल का अनुशासित ड्रॉप टॉप कॉलेज दिला सकता है। परंतु यदि आपकी रुचि व्यावहारिक कोडिंग या प्रोजेक्ट्स में है, तो किसी अच्छे राज्य कॉलेज में प्रवेश लेकर प्रथम वर्ष से स्किल्स (DSA, Open Source, GATE) पर ध्यान देना दूसरे ड्रॉप से कहीं अधिक फलदायी रहता है।'
        : 'If your previous score was in the 85–92 percentile bracket with clear fundamentals, a single disciplined drop year has a strong upside for Tier-1 seats. However, taking a 2nd or 3rd drop rarely beats enrolling in a Tier-2/State college and building real-world proof-of-work or targeting GATE/CAT later.',
    },
    'non-neet': {
      q: isHi ? 'बिना NEET के उच्च-वेतन मेडिकल और रिसर्च करियर?' : 'High-paying medical & healthcare tracks without NEET?',
      a: isHi
        ? '1. न्यूक्लियर मेडिसिन टेक्नोलॉजी (AIIMS / TMC — ₹6–24 LPA)\n2. क्लिनिकल एम्ब्रियोलॉजी व IVF विशेषज्ञ (₹8–32 LPA)\n3. बायोइन्फॉरमैटिक्स और कम्प्यूटेशनल जीनोमिक्स (₹8–28 LPA)\n4. बायोनिक्स, प्रोस्थेटिक्स व ऑर्थोटिक्स (RCI लाइसेंस — ₹6–22 LPA)'
        : '1. Nuclear Medicine & Molecular Imaging (AIIMS/BARC — ₹6–24 LPA, 0% saturation).\n2. Clinical Embryology & ART Fertility Specialist (₹8–32 LPA).\n3. Computational Biology & Genomics Data Science (₹8–28 LPA).\n4. Bionics, Prosthetics & Orthotics (RCI Licensed — ₹6–22 LPA).',
    },
    'arts-tech': {
      q: isHi ? 'Arts या Commerce से Tech और IIT में कैसे प्रवेश करें?' : 'How to enter IITs & Tech from Arts or Commerce?',
      a: isHi
        ? '1. IIT M.Sc Cognitive Science (COGJET / GATE XH के माध्यम से BA/B.Com छात्र पात्र)।\n2. IIT UCEED / NID के माध्यम से Product UX Design (₹12–40 LPA)।\n3. Tech Privacy Law (DPDP Act DPO) और क्वांटिटेटिव फाइनेंस।'
        : '1. IIT M.Sc in Cognitive Science (open to BA/B.Com graduates via COGJET / GATE XH).\n2. Product & UX Design via UCEED / NID DAT (₹12–40 LPA starting packages).\n3. AI Governance & Data Privacy Law (DPDP Act Data Protection Officers).',
    },
    'govt-scholarship': {
      q: isHi ? 'बिना गारंटी शिक्षा ऋण (PM-Vidyalaxmi) और छात्रवृत्ति कैसे पाएं?' : 'Collateral-Free Govt Education Loan (PM-Vidyalaxmi) & Scholarships?',
      a: isHi
        ? '1. PM-Vidyalaxmi योजना (pmvidyalaxmi.co.in): 860+ शीर्ष कॉलेजों में प्रवेश पर बिना किसी ज़मीन/गहने की गारंटी के शिक्षा ऋण, ₹7.5L तक 75% सरकारी गारंटी और ₹10L तक 3% ब्याज छूट (<₹8L पारिवारिक आय)।\n2. CSIS 100% ब्याज माफी: ₹4.5L से कम पारिवारिक आय पर पढ़ाई के दौरान पूरा ब्याज सरकार भरती है।\n3. AICTE प्रगति छात्रवृत्ति: बेटियों के लिए ₹50,000/वर्ष (scholarships.gov.in)।'
        : '1. PM-Vidyalaxmi Scheme (pmvidyalaxmi.co.in): 100% collateral-free & guarantor-free loans for 860+ NIRF institutions, 75% Govt credit guarantee up to ₹7.5L, and 3% interest subvention up to ₹10L (<₹8L family income).\n2. CSIS 100% Interest Waiver during moratorium for family income under ₹4.5 LPA.\n3. AICTE Pragati Scholarship: ₹50,000/yr for up to 2 girls per family (<₹8L income).',
    },
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-3xl max-h-[92vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl bg-[var(--bg)] border-[var(--border2)] text-xs"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b flex items-center justify-between border-[var(--border)] bg-[var(--bg2)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text3)]">
                {isHi ? '100% प्योर-कोड इंजन · ₹0 शुल्क' : '100% PURE-CODE DETERMINISTIC ENGINE · ₹0 API COST'}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--text)]">
                {isHi ? 'स्मार्ट AI करियर मैचर और ROI इंजन' : 'Smart AI Career Matcher & ROI Optimizer'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI Counselor"
            className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Maintenance Notice */}
        <div className="px-5 py-3 bg-[var(--bg2)] border-b border-[var(--border)] text-[var(--text2)] flex items-start gap-2.5 text-[11px] leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-[var(--text)] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[var(--text)]">
              {isHi ? 'छात्रों के लिए सूचना (Maintenance Notice):' : 'Student Advisory (Algorithmic Maintenance):'}
            </strong>{' '}
            {isHi
              ? 'यह प्योर-कोड इंजन बिना किसी पेड सब्सक्रिप्शन के आपके डिवाइस पर चलता है। कृपया सुझावों को मार्गदर्शक मानें और कोई भी बिंदु जो आपकी व्यक्तिगत स्थिति के अनुकूल न हो उसे अनदेखा करें।'
              : 'This pure-code heuristic engine runs 100% locally with zero paid APIs. Treat scores as exploratory guidance and ignore any suggestion that does not fit your personal circumstances.'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Natural Language Career Goal Input (Pure-Code NLP Parser) */}
          <div className="p-4 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
            <label className="block font-bold text-xs uppercase font-mono tracking-wider text-[var(--text)] mb-1.5">
              {isHi
                ? '1. अपने शब्दों में अपना लक्ष्य लिखें (Pure-Code NLP Analyzer)'
                : '1. Describe Your Goal in Plain Words (Pure-Code Query Parser)'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={naturalPrompt}
                onChange={(e) => setNaturalPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyzePrompt();
                }}
                placeholder={
                  isHi
                    ? 'उदा: मुझे कोडिंग और गणित पसंद है, कम फीस में उच्च पैकेज चाहिए...'
                    : 'e.g., I like biology and computers, want high salary without NEET...'
                }
                className="flex-1 min-h-[42px] px-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--text)]"
              />
              <button
                type="button"
                onClick={() => handleAnalyzePrompt()}
                className="px-4 py-2.5 rounded-xl font-mono font-bold text-xs bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                {isHi ? 'विश्लेषण करें →' : 'Parse & Match →'}
              </button>
            </div>

            {/* Quick Sample Prompts */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[10px] font-mono text-[var(--text3)]">
                {isHi ? 'उदाहरण:' : 'Try:'}
              </span>
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNaturalPrompt(sp.prompt);
                    handleAnalyzePrompt(sp.prompt);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[11px] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
                >
                  {sp.label}
                </button>
              ))}
            </div>

            {detectedSignals.length > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="text-[var(--text3)]">{isHi ? 'पहचाने गए सिग्नल:' : 'Detected Signals:'}</span>
                {detectedSignals.map((sig) => (
                  <span
                    key={sig}
                    className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] font-bold"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Structured Multi-Factor Parameters */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xs font-mono uppercase tracking-wider mb-3 text-[var(--text)]">
              <Sliders className="w-3.5 h-3.5" />
              <span>{isHi ? '2. अपनी रुचियां और पैरामीटर चुनें' : '2. Fine-Tune Strengths & Constraints'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
              {talentOptions.map((opt) => {
                const active = selectedTalents.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleTalent(opt.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-bold'
                        : 'bg-[var(--bg2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--text)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CareerSvgIcon id={opt.cat} category={opt.cat} className="w-4 h-4 shrink-0" />
                      <span className="text-xs truncate">{opt.label}</span>
                    </div>
                    {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1 text-[var(--text3)]">
                  {isHi ? 'स्ट्रीम' : 'Class 12 Stream'}
                </label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl border bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] outline-none font-semibold"
                >
                  <option value="PCM">Science (PCM)</option>
                  <option value="PCB">Science (PCB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts / Humanities</option>
                  <option value="Vocational">Vocational / Diploma</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1 text-[var(--text3)]">
                  {isHi ? 'बोर्ड प्रतिशत' : 'Board Marks'}
                </label>
                <select
                  value={percentBucket}
                  onChange={(e) => setPercentBucket(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl border bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] outline-none font-mono"
                >
                  <option value="Above 90">90%+ Marks</option>
                  <option value="75-90">75% – 90%</option>
                  <option value="60-75">60% – 75%</option>
                  <option value="50-60">50% – 60%</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1 text-[var(--text3)]">
                  {isHi ? 'कार्य शैली' : 'Workstyle'}
                </label>
                <select
                  value={workStyle}
                  onChange={(e) => setWorkStyle(e.target.value as typeof workStyle)}
                  className="w-full min-h-[40px] px-3 rounded-xl border bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] outline-none font-semibold"
                >
                  <option value="corporate">{isHi ? 'कॉरपोरेट व टेक' : 'Corporate / High-Growth'}</option>
                  <option value="public-service">{isHi ? 'सरकारी व लोक सेवा' : 'Govt / Public Service'}</option>
                  <option value="creative-remote">{isHi ? 'क्रिएटिव व रिमोट' : 'Creative / Remote'}</option>
                  <option value="any">{isHi ? 'कोई भी' : 'Any Workstyle'}</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1 text-[var(--text3)]">
                  {isHi ? 'अधिकतम कोर्स बजट' : 'Max Tuition Budget'}
                </label>
                <select
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full min-h-[40px] px-3 rounded-xl border bg-[var(--bg2)] border-[var(--border2)] text-[var(--text)] outline-none font-mono"
                >
                  <option value={3}>Under ₹3 Lakhs</option>
                  <option value={8}>Under ₹8 Lakhs</option>
                  <option value={15}>Under ₹15 Lakhs</option>
                  <option value={50}>₹25+ Lakhs (Flexible)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunMatch}
              className="mt-4 w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{isHi ? 'मेरे अनुकूल श्रेष्ठ करियर रास्ते खोजें' : 'Compute Top Career Matches & ROI'}</span>
            </button>
          </div>

          {/* Matched Results Grid */}
          {results && (
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-[var(--text)] flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>
                    {isHi
                      ? `शीर्ष ${results.length} अनुशंसित करियर पाथवे`
                      : `Top ${results.length} Algorithmic Matches (${ data.children ? Object.keys(data.children).length : 100}+ Evaluated)`}
                  </span>
                </h4>
                <span className="text-[11px] font-mono text-[var(--text3)]">
                  {isHi ? 'ROI व कौशल के आधार पर रैंक' : 'Ranked by Fit + ROI Payback'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {results.map((res) => {
                  const ch = res.career;
                  return (
                    <div
                      key={ch.id}
                      className="p-4 rounded-2xl border flex flex-col justify-between bg-[var(--bg2)] border-[var(--border2)] hover:border-[var(--text)] transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border2)] flex items-center justify-center text-[var(--text)]">
                            <CareerSvgIcon id={ch.id} category={ch.category} className="w-4 h-4" />
                          </div>
                          <div className="flex items-center gap-1.5 font-mono tabular-nums">
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[var(--text)] text-[var(--bg)]">
                              {res.matchScore}% FIT
                            </span>
                            <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg)] border border-[var(--border)] text-[var(--text2)]">
                              ROI {res.roiScore}/10
                            </span>
                          </div>
                        </div>

                        <div className="font-bold text-sm text-[var(--text)] line-clamp-1">
                          {t(ch, 'title', lang)}
                        </div>
                        <div className="text-[11px] text-[var(--text2)] mt-1 line-clamp-2 leading-relaxed">
                          {isHi && res.matchReasonsHindi.length > 0
                            ? res.matchReasonsHindi[0]
                            : res.matchReasons[0]}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex justify-between text-[11px] font-mono tabular-nums text-[var(--text2)]">
                          <span>
                            {isHi ? 'शुरुआती:' : 'Entry:'}{' '}
                            <strong className="text-[var(--text)]">
                              {ch.salaryInr?.entry || `₹${ch.entrySalaryLakhs || 8} LPA`}
                            </strong>
                          </span>
                          <span>
                            {isHi ? 'फीस रिकवरी:' : 'Payback:'}{' '}
                            <strong className="text-[var(--text)]">~{res.paybackMonths} mo</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectCareer(ch.id);
                        }}
                        className="mt-3.5 w-full py-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 bg-[var(--bg)] border border-[var(--border2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
                      >
                        <span>{isHi ? 'संपूर्ण रोडमैप खोलें' : 'Inspect Full Blueprint'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Common Career Dilemmas & Strategic Advice */}
          <div className="pt-4 border-t border-[var(--border)]">
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-[var(--text)] mb-2.5">
              {isHi ? 'आम करियर शंकाएं व त्वरित समाधान' : 'High-Stakes Student Dilemmas — Instant Playbooks'}
            </h4>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {Object.keys(sampleDoubtAnswers).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveDoubt(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeDoubt === key
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'bg-[var(--bg2)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)]'
                  }`}
                >
                  {sampleDoubtAnswers[key].q}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl border whitespace-pre-line leading-relaxed bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)]">
              {sampleDoubtAnswers[activeDoubt]?.a}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
