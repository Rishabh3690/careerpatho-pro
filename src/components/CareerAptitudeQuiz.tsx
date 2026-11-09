import React, { useState, useMemo, useEffect } from 'react';
import { CareersDatabase, ChildCareer, Language } from '../data/types';
import {
  QUIZ_DATA,
  ASSESSMENT_METHODOLOGY_RUBRIC,
  calculateCareerAssessmentResult,
  BroadCareerCategory,
  CareerAssessmentResult,
  QuizAnswerValue,
  QuizQuestion,
} from '../utils/careerAssessmentEngine';
import { tr } from '../utils/careerEngine';
import { CareerSvgIcon } from './CareerSvgIcon';
import {
  Compass,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  SlidersHorizontal,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Info,
  HelpCircle,
  X,
} from 'lucide-react';

interface CareerAptitudeQuizProps {
  career?: ChildCareer;
  careersData?: CareersDatabase;
  lang: Language;
  onSelectCareer: (id: string) => void;
  onExitQuiz?: () => void;
  isFullPage?: boolean;
  onShowToast?: (msg: string) => void;
}

const STORAGE_KEY_ANSWERS = 'careerpatho-career-assessment-answers-v2';

type QuizSectionFilter = 'all' | 'sec1' | 'sec2' | 'sec3' | 'sec4';

const QUIZ_SECTIONS: Array<{
  id: QuizSectionFilter;
  labelEn: string;
  labelHi: string;
  range: [number, number];
  descEn: string;
  descHi: string;
}> = [
  {
    id: 'all',
    labelEn: 'All 25 Questions',
    labelHi: 'सभी 25 प्रश्न',
    range: [1, 25],
    descEn: 'Complete 25-question multi-modal career assessment across 5 response formats.',
    descHi: '5 उत्तर प्रारूपों में संपूर्ण 25-प्रश्न करियर मूल्यांकन।',
  },
  {
    id: 'sec1',
    labelEn: '1. Stream & Reality (Q1–Q8)',
    labelHi: '1. स्ट्रीम व कार्यशैली (Q1–Q8)',
    range: [1, 8],
    descEn: 'Your Class 12 stream, daily work environment, entrance exam mindset, and real-world scenarios.',
    descHi: 'आपकी कक्षा 12 स्ट्रीम, दैनिक कार्य वातावरण, प्रवेश परीक्षा मानसिकता और व्यावहारिक परिदृश्य।',
  },
  {
    id: 'sec2',
    labelEn: '2. Sliders: Stamina & Budget (Q9–Q14)',
    labelHi: '2. स्लाइडर: क्षमता व बजट (Q9–Q14)',
    range: [9, 14],
    descEn: 'Interactive sliders for daily study hours, math comfort, family tuition ceiling, and study years.',
    descHi: 'दैनिक पढ़ाई के घंटे, गणित सहजता, परिवार का फीस बजट और अध्ययन वर्षों के लिए इंटरएक्टिव स्लाइडर।',
  },
  {
    id: 'sec3',
    labelEn: '3. Interest Scales (Q15–Q19)',
    labelHi: '3. रुचि पैमाने (Q15–Q19)',
    range: [15, 19],
    descEn: '1–5 agreement scales checking clinical comfort, public speaking, Law/Policy, Finance, and Design.',
    descHi: 'क्लिनिकल सहजता, संवाद, कानून/नीति, फाइनेंस और डिज़ाइन रुचि की जांच करने वाले 1–5 पैमाने।',
  },
  {
    id: 'sec4',
    labelEn: '4. Strengths & Tradeoffs (Q20–Q25)',
    labelHi: '4. कौशल व प्राथमिकताएं (Q20–Q25)',
    range: [20, 25],
    descEn: 'Multi-select personal strengths (up to 3) and 5-step career tradeoff continuums.',
    descHi: 'बहु-चयन व्यक्तिगत कौशल (अधिकतम 3) और 5-चरणीय करियर प्राथमिकता तुलना।',
  },
];

function isQuestionAnswered(q: QuizQuestion, val: QuizAnswerValue | undefined): boolean {
  if (val === undefined || val === null || val === '') return false;
  if (q.questionType === 'multi-select') {
    return Array.isArray(val) ? val.length > 0 : String(val).trim().length > 0;
  }
  return true;
}

function getWhyWeAskNote(q: QuizQuestion, lang: Language): string {
  const id = q.id;
  if (id === 1) {
    return tr(
      lang,
      'Reality Check: Statutory councils (NMC for MBBS, AICTE for B.Tech, CoA for B.Arch) enforce strict Class 12 subject rules, while Law (CLAT), Design (UCEED/NID), Management (IPMAT/CUET), and CA are open to all streams.',
      'वास्तविकता: MBBS (NMC) और B.Tech (AICTE) में 12वीं के विषयों के सख्त नियम हैं, जबकि कानून (CLAT), डिज़ाइन (NID), मैनेजमेंट और CA सभी स्ट्रीम के छात्रों के लिए खुले हैं।'
    );
  }
  if (id === 10) {
    return tr(
      lang,
      'Reality Check: Engineering, Data Science, Actuarial Science, and Economics require college-level calculus and statistics. Low math comfort does NOT block high-paying careers in Law, Clinical Medicine, Design, or Management.',
      'वास्तविकता: इंजीनियरिंग, डेटा साइंस और इकोनॉमिक्स में उच्च गणित की आवश्यकता होती है, लेकिन कानून (Law), मेडिकल, डिज़ाइन और मैनेजमेंट में बिना कठिन गणित के भी बेहतरीन करियर बनता है।'
    );
  }
  if (id === 11) {
    return tr(
      lang,
      'Reality Check: Taking a ₹15–25 Lakh education loan for a Tier-3 private college where the national PLFS starting salary median is ₹3.0 LPA (₹25,000/month) creates severe EMI stress. Low-fee government colleges and statutory tracks (ICAI/NCVET/INI) protect family savings.',
      'वास्तविकता: जहां राष्ट्रीय शुरुआती वेतन औसत (PLFS) ₹3.0 LPA (₹25,000/माह) है, वहां किसी सामान्य प्राइवेट कॉलेज के लिए ₹15–25 लाख का एजुकेशन लोन लेना परिवार पर भारी दबाव डालता है।'
    );
  }
  if (id === 12) {
    return tr(
      lang,
      'Reality Check: MBBS + MD/MS takes 8–10 years before independent consultant earnings begin, whereas Diplomas, B.Sc Nursing, BCA, or B.Tech allow workforce entry in 2–4 years.',
      'वास्तविकता: MBBS + MD में स्वतंत्र प्रैक्टिस शुरू करने में 8–10 साल लगते हैं, जबकि डिप्लोमा, नर्सिंग, BCA या B.Tech के बाद 2–4 साल में नौकरी शुरू हो सकती है।'
    );
  }
  if (id === 15) {
    return tr(
      lang,
      'Reality Check: Many students choose PCB due to family pressure, only to realize in hospital wards that blood, emergency trauma, and night duties cause severe distress. Non-clinical biotech, pharma, and research are safer alternatives if clinical comfort is low.',
      'वास्तविकता: कई छात्र परिवार के कहने पर PCB ले लेते हैं, लेकिन अस्पताल की इमरजेंसी ड्यूटी और रक्त/सर्जरी देखकर घबरा जाते हैं। कम क्लिनिकल सहजता होने पर फार्मा, बायोटेक या रिसर्च बेहतर विकल्प हैं।'
    );
  }
  return tr(
    lang,
    'Guidance Note: There is no "right" or "wrong" answer here. Answer honestly based on your actual daily habits—not what relatives or coaching ads tell you to pick.',
    'मार्गदर्शन नोट: यहाँ कोई "सही" या "गलत" उत्तर नहीं है। रिश्तेदारों या कोचिंग विज्ञापनों के दबाव के बिना अपनी वास्तविक आदतों के अनुसार उत्तर दें।'
  );
}

export const CareerAptitudeQuiz: React.FC<CareerAptitudeQuizProps> = ({
  careersData,
  lang,
  onSelectCareer,
  onExitQuiz,
  isFullPage = false,
  onShowToast,
}) => {
  const [localCareersDb, setLocalCareersDb] = useState<CareersDatabase | undefined>(careersData);

  useEffect(() => {
    if (careersData) return;
    let active = true;
    import('../data/careersAll')
      .then((mod) => {
        if (!active) return;
        setLocalCareersDb(mod.getActiveCareersData());
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [careersData]);

  const activeDb = careersData || localCareersDb;

  const [answers, setAnswers] = useState<Record<number, QuizAnswerValue>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return {};
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed && Object.keys(parsed).length >= QUIZ_DATA.length;
      }
    } catch {
      return false;
    }
    return false;
  });

  const [viewMode, setViewMode] = useState<'all' | 'step'>('all');
  const [sectionFilter, setSectionFilter] = useState<QuizSectionFilter>('all');
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [showRubricDrawer, setShowRubricDrawer] = useState<boolean>(false);
  const [expandedWhyIds, setExpandedWhyIds] = useState<Record<number, boolean>>({});

  const [showAllFallbackExplorer, setShowAllFallbackExplorer] = useState<boolean>(false);
  const [selectedExplorerCategory, setSelectedExplorerCategory] = useState<string>('All');
  const [selectedExplorerStream, setSelectedExplorerStream] = useState<string>('All');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    } catch {
      // Ignore storage error
    }
  }, [answers]);

  const answeredCount = useMemo(
    () => QUIZ_DATA.filter((q) => isQuestionAnswered(q, answers[q.id])).length,
    [answers]
  );

  const progressPct = Math.round((answeredCount / QUIZ_DATA.length) * 100);

  const assessmentResult: CareerAssessmentResult = useMemo(
    () => calculateCareerAssessmentResult(answers, activeDb),
    [answers, activeDb]
  );

  const scrollToElementById = (elementId: string) => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    });
  };

  const handleSetAnswer = (questionId: number, value: QuizAnswerValue, autoAdvance = false) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: value };
      const totalNow = QUIZ_DATA.filter((q) => isQuestionAnswered(q, updated[q.id])).length;

      if (totalNow === QUIZ_DATA.length) {
        setIsSubmitted(true);
        scrollToElementById('assessment-results-panel');
      } else if (autoAdvance) {
        if (viewMode === 'step') {
          const currentIdx = QUIZ_DATA.findIndex((q) => q.id === questionId);
          if (currentIdx >= 0 && currentIdx < QUIZ_DATA.length - 1) {
            setActiveQuestionIdx(currentIdx + 1);
          }
        } else {
          const nextUnanswered = QUIZ_DATA.find(
            (q) => q.id > questionId && !isQuestionAnswered(q, updated[q.id])
          );
          if (nextUnanswered) {
            scrollToElementById(`quiz-question-${nextUnanswered.id}`);
          }
        }
      }
      return updated;
    });
  };

  const handleClearQuestionAnswer = (questionId: number) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleNeutralAnswer = (q: QuizQuestion) => {
    if (q.questionType === 'slider' && q.sliderConfig) {
      handleSetAnswer(q.id, q.sliderConfig.defaultValue, false);
    } else if (q.questionType === 'likert-scale' || q.questionType === 'tradeoff-pair') {
      handleSetAnswer(q.id, 3, false);
    } else if (q.questionType === 'multi-select' && q.options.length > 0) {
      handleSetAnswer(q.id, [q.options[0].id], false);
    } else if (q.options.length > 0) {
      const midIdx = Math.floor(q.options.length / 2);
      handleSetAnswer(q.id, q.options[midIdx].id, false);
    }
  };

  const handleToggleMultiSelect = (question: QuizQuestion, optionId: string) => {
    const maxSelect = question.maxMultiSelect || 3;
    setAnswers((prev) => {
      const existingRaw = prev[question.id];
      const currentList: string[] = Array.isArray(existingRaw)
        ? existingRaw.map(String)
        : typeof existingRaw === 'string' && existingRaw
        ? existingRaw.split(',').filter(Boolean)
        : [];

      let nextList: string[];
      if (currentList.includes(optionId)) {
        nextList = currentList.filter((id) => id !== optionId);
      } else if (currentList.length < maxSelect) {
        nextList = [...currentList, optionId];
      } else {
        nextList = [...currentList.slice(1), optionId];
      }

      return { ...prev, [question.id]: nextList };
    });
  };

  const handleCalculateSubmit = () => {
    setIsSubmitted(true);
    if (assessmentResult.isFallbackTriggered) {
      setShowAllFallbackExplorer(true);
    }
    scrollToElementById('assessment-results-panel');
    if (onShowToast) {
      onShowToast(
        assessmentResult.isFallbackTriggered
          ? tr(
              lang,
              'Multi-Domain Tie or Open Profile — Exploring Top 3 Domains & 395+ Careers',
              'बहु-क्षेत्रीय समानता — शीर्ष 3 क्षेत्रों और 395+ करियर का विश्लेषण तैयार'
            )
          : tr(
              lang,
              `Career Assessment Complete: ${assessmentResult.top3Categories[0].category} (${assessmentResult.top3Categories[0].alignmentBandLabelEn})`,
              `करियर मूल्यांकन तैयार: ${assessmentResult.top3Categories[0].info.titleHi}`
            )
      );
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setShowAllFallbackExplorer(false);
    setSelectedExplorerCategory('All');
    setSelectedExplorerStream('All');
    setActiveQuestionIdx(0);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY_ANSWERS);
    } catch {
      // Ignore
    }
    scrollToElementById('career-aptitude-quiz');
    if (onShowToast) {
      onShowToast(tr(lang, '25-Question Assessment Reset', '25-प्रश्न मूल्यांकन रीसेट किया गया'));
    }
  };

  const handleLoadPreset = (
    presetType: 'engineering' | 'medical' | 'commerce' | 'contradictory' | 'tied'
  ) => {
    if (presetType === 'engineering') {
      setAnswers({
        1: 'q1-pcm',
        2: 'q2-code',
        3: 'q3-techlab',
        4: 'q4-jee',
        5: 'q5-uptime',
        6: 'q6-ai',
        7: 'q7-builder',
        8: 'q8-tech-arch',
        9: 7,
        10: 9,
        11: 10,
        12: 4,
        13: 3,
        14: 3,
        15: 1,
        16: 2,
        17: 3,
        18: 3,
        19: 5,
        20: ['q20-logic', 'q20-dexterity'],
        21: ['q21-software'],
        22: ['q22-global'],
        23: 3,
        24: 5,
        25: 5,
      });
      setIsSubmitted(true);
      setShowAllFallbackExplorer(false);
      scrollToElementById('assessment-results-panel');
    } else if (presetType === 'medical') {
      setAnswers({
        1: 'q1-pcb',
        2: 'q2-clinical',
        3: 'q3-hospital',
        4: 'q4-neet',
        5: 'q5-patient',
        6: 'q6-bio',
        7: 'q7-care',
        8: 'q8-healer',
        9: 8,
        10: 4,
        11: 8,
        12: 6,
        13: 9,
        14: 8,
        15: 5,
        16: 2,
        17: 2,
        18: 1,
        19: 2,
        20: ['q20-bio'],
        21: ['q21-recovery'],
        22: ['q22-recession', 'q22-practice'],
        23: 5,
        24: 2,
        25: 2,
      });
      setIsSubmitted(true);
      setShowAllFallbackExplorer(false);
      scrollToElementById('assessment-results-panel');
    } else if (presetType === 'commerce') {
      setAnswers({
        1: 'q1-commerce',
        2: 'q2-financial',
        3: 'q3-boardroom',
        4: 'q4-ca',
        5: 'q5-audit',
        6: 'q6-econ',
        7: 'q7-treasurer',
        8: 'q8-cfo',
        9: 7,
        10: 8,
        11: 5,
        12: 4,
        13: 7,
        14: 2,
        15: 1,
        16: 3,
        17: 2,
        18: 5,
        19: 2,
        20: ['q20-comm', 'q20-logic'],
        21: ['q21-audit'],
        22: ['q22-practice', 'q22-global'],
        23: 4,
        24: 4,
        25: 4,
      });
      setIsSubmitted(true);
      setShowAllFallbackExplorer(false);
      scrollToElementById('assessment-results-panel');
    } else if (presetType === 'contradictory') {
      setAnswers({
        1: 'q1-pcb',
        2: 'q2-clinical',
        3: 'q3-hospital',
        4: 'q4-neet',
        5: 'q5-patient',
        6: 'q6-bio',
        7: 'q7-care',
        8: 'q8-healer',
        9: 5,
        10: 2,
        11: 2,
        12: 2,
        13: 5,
        14: 5,
        15: 1,
        16: 2,
        17: 2,
        18: 2,
        19: 2,
        20: ['q20-bio'],
        21: ['q21-recovery'],
        22: ['q22-earlyearn'],
        23: 1,
        24: 3,
        25: 3,
      });
      setIsSubmitted(true);
      setShowAllFallbackExplorer(false);
      scrollToElementById('assessment-results-panel');
    } else {
      setAnswers({
        1: 'q1-pcm',
        2: 'q2-clinical',
        3: 'q3-boardroom',
        4: 'q4-clat',
        5: 'q5-deadline',
        6: 'q6-machines',
        7: 'q7-builder',
        8: 'q8-healer',
        9: 5,
        10: 5,
        11: 6,
        12: 4,
        13: 5,
        14: 5,
        15: 3,
        16: 3,
        17: 3,
        18: 3,
        19: 3,
        20: ['q20-comm', 'q20-design', 'q20-debate'],
        21: ['q21-art', 'q21-order', 'q21-flight'],
        22: ['q22-sarkari', 'q22-earlyearn', 'q22-expression'],
        23: 3,
        24: 3,
        25: 3,
      });
      setIsSubmitted(true);
      setShowAllFallbackExplorer(true);
      scrollToElementById('assessment-results-panel');
    }
  };

  const allChildCareers = useMemo(() => {
    if (!activeDb || !activeDb.children) return [];
    return Object.values(activeDb.children);
  }, [activeDb]);

  const filteredExplorerCareers = useMemo(() => {
    return allChildCareers.filter((c) => {
      if (selectedExplorerCategory !== 'All') {
        const catInfo = assessmentResult.allCategoryScores.find(
          (s) => s.category === selectedExplorerCategory
        )?.info;
        if (catInfo && !catInfo.dbCategoryIds.includes(c.category)) {
          return false;
        }
      }
      if (selectedExplorerStream !== 'All') {
        const streams = c.eligibility?.streams || [];
        if (!streams.includes(selectedExplorerStream) && !streams.includes('Any')) {
          return false;
        }
      }
      return true;
    });
  }, [
    allChildCareers,
    selectedExplorerCategory,
    selectedExplorerStream,
    assessmentResult.allCategoryScores,
  ]);

  const questionsToRender = useMemo(() => {
    if (viewMode === 'step') {
      return [QUIZ_DATA[activeQuestionIdx] || QUIZ_DATA[0]];
    }
    const activeSec = QUIZ_SECTIONS.find((s) => s.id === sectionFilter) || QUIZ_SECTIONS[0];
    const [minId, maxId] = activeSec.range;
    return QUIZ_DATA.filter((q) => q.id >= minId && q.id <= maxId);
  }, [viewMode, activeQuestionIdx, sectionFilter]);

  const getQuestionTypeBadge = (qType: QuizQuestion['questionType']) => {
    switch (qType) {
      case 'single-choice':
        return tr(lang, 'Single Choice', 'एकल विकल्प');
      case 'slider':
        return tr(lang, 'Interactive Slider', 'इंटरएक्टिव स्लाइडर');
      case 'likert-scale':
        return tr(lang, '1–5 Agreement Scale', '1–5 सहमति पैमाना');
      case 'multi-select':
        return tr(lang, 'Multi-Select (Up to 3)', 'बहु-चयन (अधिकतम 3)');
      case 'tradeoff-pair':
        return tr(lang, 'Tradeoff Continuum', 'तुलनात्मक चयन');
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    setActiveQuestionIdx(idx);
    if (viewMode === 'all') {
      setSectionFilter('all');
      const q = QUIZ_DATA[idx];
      if (q) {
        scrollToElementById(`quiz-question-${q.id}`);
      }
    }
  };

  return (
    <section
      id="career-aptitude-quiz"
      aria-label="25-Question Multi-Modal Career Assessment & Calculator"
      className={`w-full overflow-x-hidden ${
        isFullPage ? 'py-4 sm:py-8 px-3 sm:px-6' : 'my-8 sm:my-12'
      } transition-all`}
    >
      <div className="max-w-5xl mx-auto rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] overflow-hidden">
        {/* Top Architectural Header Banner (Core Monochrome UI — Zero Blue Theme) */}
        <div className="bg-[var(--bg)] text-[var(--text)] p-4 sm:p-8 border-b-2 border-[var(--text)]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2.5 min-w-0">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] text-[11px] font-mono font-extrabold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span className="break-words">
                  {tr(
                    lang,
                    'QUIZ CENTER • 25 VERSATILE QUESTIONS • 5 FORMATS • NO FALSE GUARANTEES',
                    'क्विज़ सेंटर • 25 बहु-आयामी प्रश्न • 5 उत्तर प्रारूप • कोई झूठा वादा नहीं'
                  )}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] break-words">
                {tr(
                  lang,
                  '25-Question Career Assessment & Reality Calculator',
                  '25-प्रश्न करियर मूल्यांकन और वास्तविकता कैलकुलेटर'
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text2)] max-w-2xl leading-relaxed break-words">
                {tr(
                  lang,
                  'Test your Class 12 stream, study stamina slider, math comfort slider, family tuition budget, clinical/coding/legal interest scales, and career tradeoffs across 395+ career pathways. Results show statistical alignment bands—never a medical diagnosis or a guaranteed salary promise.',
                  'अपनी 12वीं स्ट्रीम, अध्ययन क्षमता स्लाइडर, गणित सहजता, फीस बजट, रुचि पैमाने और प्राथमिकताओं के आधार पर 395+ करियर विकल्पों में अपनी अनुकूलता रेंज जानें। यह केवल शैक्षिक मार्गदर्शन है—किसी वेतन या नौकरी की गारंटी नहीं।'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
              <div
                role="group"
                aria-label="Quiz Display Mode"
                className="flex items-center bg-[var(--bg2)] p-1 rounded-xl border border-[var(--border2)] text-xs font-mono"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    viewMode === 'all'
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'text-[var(--text2)] hover:text-[var(--text)]'
                  }`}
                >
                  {tr(lang, 'All 25 View', 'सूची मोड (25)')}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('step')}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    viewMode === 'step'
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'text-[var(--text2)] hover:text-[var(--text)]'
                  }`}
                >
                  {tr(lang, 'Step-by-Step (1-by-1)', 'एक-एक प्रश्न')}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowRubricDrawer((prev) => !prev)}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{tr(lang, 'Rubric & Weights', 'गणना नियम')}</span>
              </button>

              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{tr(lang, 'Reset All', 'रीसेट')}</span>
                </button>
              )}

              {onExitQuiz && (
                <button
                  type="button"
                  onClick={onExitQuiz}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{tr(lang, 'Close', 'बंद करें')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Expandable Methodology & Rubric Drawer */}
          {showRubricDrawer && (
            <div
              id="assessment-rubric-drawer"
              className="mt-5 p-4 sm:p-5 rounded-2xl bg-[var(--bg2)] border-2 border-[var(--text)] text-[var(--text)] space-y-3"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-sm font-mono font-extrabold text-[var(--text)] flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    {tr(
                      lang,
                      'DOCUMENTED CALCULATOR RUBRIC, QUESTION WEIGHTS & CONTRADICTION RULES',
                      'प्रलेखित कैलकुलेटर रुब्रिक, प्रश्न भार और विरोधाभास नियम'
                    )}
                  </span>
                </h3>
                <span className="text-[11px] font-mono font-bold text-[var(--bg)] bg-[var(--text)] px-2.5 py-0.5 rounded">
                  {tr(lang, '25 Questions • Weights 1.2x–2.0x', '25 प्रश्न • भार 1.2x–2.0x')}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ASSESSMENT_METHODOLOGY_RUBRIC.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border2)] space-y-1.5 min-w-0"
                  >
                    <div className="text-xs font-extrabold text-[var(--text)] break-words">
                      {tr(lang, sec.titleEn, sec.titleHi)}
                    </div>
                    <code className="block text-[11px] font-mono text-[var(--text)] bg-[var(--bg2)] border border-[var(--border)] px-2.5 py-1.5 rounded break-all">
                      {sec.formulaEn}
                    </code>
                    <p className="text-xs text-[var(--text2)] leading-relaxed break-words">
                      {tr(lang, sec.descriptionEn, sec.descriptionHi)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar + Live Detected Constraints + Quick Test Presets */}
          <div className="mt-5 pt-4 border-t border-[var(--border)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text)] mb-1.5 gap-2">
                  <span className="truncate">
                    {tr(
                      lang,
                      `Completion: ${answeredCount} of ${QUIZ_DATA.length} questions answered`,
                      `प्रगति: ${QUIZ_DATA.length} में से ${answeredCount} प्रश्नों के उत्तर दिए गए`
                    )}
                  </span>
                  <span className="tabular-nums shrink-0">{progressPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--bg2)] border border-[var(--border2)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--text)] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                <span className="text-[var(--text3)] font-bold mr-1">
                  {tr(lang, '1-Click Demo Profiles:', 'डेमो प्रोफ़ाइल:')}
                </span>
                <button
                  type="button"
                  data-testid="preset-engineering-btn"
                  onClick={() => handleLoadPreset('engineering')}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border border-[var(--border2)] font-bold transition cursor-pointer"
                >
                  {tr(lang, 'Tech/PCM', 'इंजीनियरिंग')}
                </button>
                <button
                  type="button"
                  data-testid="preset-medical-btn"
                  onClick={() => handleLoadPreset('medical')}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border border-[var(--border2)] font-bold transition cursor-pointer"
                >
                  {tr(lang, 'Medical/PCB', 'मेडिकल')}
                </button>
                <button
                  type="button"
                  data-testid="preset-commerce-btn"
                  onClick={() => handleLoadPreset('commerce')}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border border-[var(--border2)] font-bold transition cursor-pointer"
                >
                  {tr(lang, 'Commerce/CA', 'कॉमर्स/CA')}
                </button>
                <button
                  type="button"
                  data-testid="preset-contradictory-btn"
                  onClick={() => handleLoadPreset('contradictory')}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border border-[var(--border2)] font-bold transition cursor-pointer"
                >
                  {tr(lang, 'Contradiction Check', 'विरोधाभास जांच')}
                </button>
                <button
                  type="button"
                  data-testid="preset-tied-btn"
                  onClick={() => handleLoadPreset('tied')}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border border-[var(--border2)] font-bold transition cursor-pointer"
                >
                  {tr(lang, 'Mixed/Tie', 'मिश्रित/टाई')}
                </button>
              </div>
            </div>

            {/* Live Constraint Snapshot Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-between gap-2">
                <span className="text-[var(--text3)]">{tr(lang, 'Stream:', 'स्ट्रीम:')}</span>
                <strong className="text-[var(--text)] truncate">
                  {assessmentResult.detectedConstraints.stream || 'Any'}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-between gap-2">
                <span className="text-[var(--text3)]">{tr(lang, 'Study Hrs:', 'पढ़ाई/दिन:')}</span>
                <strong className="text-[var(--text)] tabular-nums">
                  {assessmentResult.detectedConstraints.dailyStudyHours !== null
                    ? `${assessmentResult.detectedConstraints.dailyStudyHours} hrs/day`
                    : '—'}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-between gap-2">
                <span className="text-[var(--text3)]">{tr(lang, 'Max Fee:', 'अधिकतम फीस:')}</span>
                <strong className="text-[var(--text)] tabular-nums">
                  {assessmentResult.detectedConstraints.budgetLakhs !== null
                    ? `≤ ₹${assessmentResult.detectedConstraints.budgetLakhs}L`
                    : '—'}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-between gap-2">
                <span className="text-[var(--text3)]">{tr(lang, 'Study Yrs:', 'अवधि सीमा:')}</span>
                <strong className="text-[var(--text)] tabular-nums">
                  {assessmentResult.detectedConstraints.maxStudyYears !== null
                    ? `≤ ${assessmentResult.detectedConstraints.maxStudyYears} Yrs`
                    : '—'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Center Navigation Bar: 5 Section Filter Tabs + 25-Question Number Strip */}
        <div className="p-3 sm:p-5 bg-[var(--bg2)] border-b border-[var(--border)] space-y-3">
          {viewMode === 'all' && (
            <div
              role="tablist"
              aria-label="Filter Quiz Questions by Section"
              data-testid="quiz-section-filter-tabs"
              className="flex flex-wrap items-center gap-1.5"
            >
              {QUIZ_SECTIONS.map((sec) => {
                const isActive = sectionFilter === sec.id;
                const [rMin, rMax] = sec.range;
                const secAnswered = QUIZ_DATA.filter(
                  (q) => q.id >= rMin && q.id <= rMax && isQuestionAnswered(q, answers[q.id])
                ).length;
                const secTotal = rMax - rMin + 1;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-testid={`quiz-section-tab-${sec.id}`}
                    onClick={() => setSectionFilter(sec.id)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                        : 'bg-[var(--bg)] text-[var(--text2)] border-[var(--border2)] hover:border-[var(--text)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span>{tr(lang, sec.labelEn, sec.labelHi)}</span>
                    <span className="text-[10px] opacity-80 tabular-nums">
                      ({secAnswered}/{secTotal})
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 1–25 Quick Jump Question Number Map */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--text3)] mr-1">
              {tr(lang, 'Jump to Q:', 'प्रश्न चुनें:')}
            </span>
            {QUIZ_DATA.map((q, idx) => {
              const answered = isQuestionAnswered(q, answers[q.id]);
              const isCurrent = viewMode === 'step' && idx === activeQuestionIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJumpToQuestion(idx)}
                  title={`Q${q.id}: ${q.traitLabelEn}`}
                  className={`w-7 h-7 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0 tabular-nums ${
                    isCurrent
                      ? 'bg-[var(--text)] text-[var(--bg)] border-2 border-[var(--text)] ring-2 ring-[var(--border2)]'
                      : answered
                      ? 'bg-[var(--text)] text-[var(--bg)] border border-[var(--text)]'
                      : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border2)] hover:border-[var(--text)] hover:text-[var(--text)]'
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions Container */}
        <div className="p-3 sm:p-8 space-y-5 bg-[var(--bg2)]">
          {questionsToRender.map((q) => {
            const currentAns = answers[q.id];
            const isAnswered = isQuestionAnswered(q, currentAns);
            const showWhy = Boolean(expandedWhyIds[q.id]);

            return (
              <div
                key={q.id}
                id={`quiz-question-${q.id}`}
                data-testid={`quiz-question-${q.id}`}
                data-question-type={q.questionType}
                className={`rounded-2xl border p-4 sm:p-6 transition-all bg-[var(--bg)] min-w-0 ${
                  isAnswered
                    ? 'border-2 border-[var(--text)]'
                    : 'border border-[var(--border2)]'
                }`}
              >
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 font-mono">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-[var(--text)] text-[var(--bg)] tabular-nums">
                        Q{q.id} / {QUIZ_DATA.length}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg2)] border border-[var(--border2)] text-[var(--text)]">
                        {getQuestionTypeBadge(q.questionType)}
                      </span>
                      <span className="text-[11px] font-bold text-[var(--text2)] break-words">
                        {tr(lang, q.traitLabelEn, q.traitLabelHi)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg2)] text-[var(--text3)] border border-[var(--border)]">
                        {tr(lang, `Weight: ${q.questionWeight}x`, `भार: ${q.questionWeight}x`)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-[var(--text)] leading-snug break-words">
                      {tr(lang, q.questionEn, q.questionHi)}
                    </h3>
                    <p className="text-xs text-[var(--text2)] break-words">
                      {tr(lang, q.helperEn, q.helperHi)}
                    </p>
                  </div>

                  {/* Per-Question Versatile Action Controls: Neutral/Unsure, Why We Ask, Clear */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 font-mono">
                    {isAnswered && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[var(--text)] text-[var(--bg)]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{tr(lang, 'Saved', 'दर्ज')}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      data-testid={`q${q.id}-neutral-btn`}
                      onClick={() => handleNeutralAnswer(q)}
                      title={tr(
                        lang,
                        'Set a balanced/neutral answer if you are undecided on this question',
                        'यदि आप इस प्रश्न पर अनिश्चित हैं तो संतुलित उत्तर चुनें'
                      )}
                      className="min-h-[32px] px-2.5 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] hover:border-[var(--text)] text-[11px] font-bold text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
                    >
                      {tr(lang, 'Unsure / Neutral', 'अनिश्चित / तटस्थ')}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedWhyIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="min-h-[32px] px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--text)] text-[11px] font-bold text-[var(--text3)] hover:text-[var(--text)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>{tr(lang, 'Why?', 'क्यों?')}</span>
                    </button>
                    {isAnswered && (
                      <button
                        type="button"
                        onClick={() => handleClearQuestionAnswer(q.id)}
                        className="min-h-[32px] px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--text)] text-[11px] font-bold text-[var(--text3)] hover:text-[var(--text)] cursor-pointer"
                      >
                        {tr(lang, 'Clear', 'हटाएं')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Reality Check Note for This Question */}
                {showWhy && (
                  <div className="mb-4 p-3 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs text-[var(--text2)] font-mono leading-relaxed break-words">
                    {getWhyWeAskNote(q, lang)}
                  </div>
                )}

                {/* 1. SINGLE-CHOICE RENDERER */}
                {q.questionType === 'single-choice' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = currentAns === opt.id || currentAns === String(optIdx);
                      const optionLetter = String.fromCharCode(65 + optIdx);

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          data-testid={`q${q.id}-opt-${optIdx}`}
                          onClick={() => handleSetAnswer(q.id, opt.id, true)}
                          className={`min-h-[52px] group text-left p-3 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer min-w-0 ${
                            isSelected
                              ? 'bg-[var(--text)] text-[var(--bg)] border-2 border-[var(--text)] font-bold'
                              : 'bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border-[var(--border2)]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-mono font-extrabold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? 'bg-[var(--bg)] text-[var(--text)]'
                                : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border2)]'
                            }`}
                          >
                            {optionLetter}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-semibold leading-snug break-words">
                              {tr(lang, opt.textEn, opt.textHi)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. SLIDER RENDERER (Mobile-first range input + quick tap step buttons) */}
                {q.questionType === 'slider' && q.sliderConfig && (
                  <div className="p-3.5 sm:p-5 rounded-xl bg-[var(--bg2)] border border-[var(--border2)] space-y-4">
                    {(() => {
                      const cfg = q.sliderConfig;
                      const numericVal =
                        currentAns !== undefined && !Number.isNaN(Number(currentAns))
                          ? Number(currentAns)
                          : cfg.defaultValue;
                      const quickSteps: number[] = [];
                      const totalRange = cfg.max - cfg.min;
                      const stepStride = totalRange > 12 ? 4 : 1;
                      for (let v = cfg.min; v <= cfg.max; v += stepStride) {
                        quickSteps.push(v);
                      }
                      if (quickSteps[quickSteps.length - 1] !== cfg.max) {
                        quickSteps.push(cfg.max);
                      }

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-[var(--text2)]">
                              {tr(lang, 'Selected Value:', 'चयनित मान:')}
                            </span>
                            <span
                              data-testid={`q${q.id}-slider-value`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--text)] text-[var(--bg)] text-sm sm:text-base font-mono font-extrabold tabular-nums"
                            >
                              <span>{numericVal}</span>
                              <span className="text-xs font-semibold opacity-90">
                                {tr(lang, cfg.unitEn, cfg.unitHi)}
                              </span>
                            </span>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="range"
                              min={cfg.min}
                              max={cfg.max}
                              step={cfg.step}
                              value={numericVal}
                              aria-label={tr(lang, q.questionEn, q.questionHi)}
                              data-testid={`q${q.id}-slider-input`}
                              onChange={(e) =>
                                handleSetAnswer(q.id, Number(e.target.value), false)
                              }
                              className="w-full h-3 bg-[var(--bg)] border border-[var(--border2)] rounded-lg appearance-none cursor-pointer accent-[var(--text)]"
                            />
                            <div className="flex items-start justify-between gap-4 text-[11px] font-mono text-[var(--text2)]">
                              <span className="max-w-[48%] break-words">
                                {tr(lang, cfg.minLabelEn, cfg.minLabelHi)}
                              </span>
                              <span className="max-w-[48%] text-right break-words">
                                {tr(lang, cfg.maxLabelEn, cfg.maxLabelHi)}
                              </span>
                            </div>
                          </div>

                          {/* Mobile Quick-Tap Value Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {quickSteps.map((val) => {
                              const active = currentAns !== undefined && Number(currentAns) === val;
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  data-testid={`q${q.id}-slider-pill-${val}`}
                                  onClick={() => handleSetAnswer(q.id, val, false)}
                                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer tabular-nums ${
                                    active
                                      ? 'bg-[var(--text)] text-[var(--bg)] border border-[var(--text)]'
                                      : 'bg-[var(--bg)] text-[var(--text)] border border-[var(--border2)] hover:border-[var(--text)]'
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 3. LIKERT-SCALE RENDERER (1 to 5 Agreement Scale) */}
                {q.questionType === 'likert-scale' && q.likertConfig && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {[
                        {
                          val: 1,
                          en: '1 · Strongly Disagree',
                          hi: '1 · बिल्कुल असहमत',
                        },
                        {
                          val: 2,
                          en: '2 · Disagree',
                          hi: '2 · असहमत',
                        },
                        {
                          val: 3,
                          en: '3 · Neutral / Unsure',
                          hi: '3 · तटस्थ',
                        },
                        {
                          val: 4,
                          en: '4 · Agree',
                          hi: '4 · सहमत',
                        },
                        {
                          val: 5,
                          en: '5 · Strongly Agree',
                          hi: '5 · पूर्णतः सहमत',
                        },
                      ].map((item) => {
                        const selected = Number(currentAns) === item.val;
                        return (
                          <button
                            key={item.val}
                            type="button"
                            data-testid={`q${q.id}-likert-${item.val}`}
                            onClick={() => handleSetAnswer(q.id, item.val, true)}
                            className={`min-h-[48px] p-3 rounded-xl border text-center font-mono transition-all cursor-pointer min-w-0 ${
                              selected
                                ? 'bg-[var(--text)] text-[var(--bg)] border-2 border-[var(--text)] font-extrabold'
                                : 'bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border-[var(--border2)] font-semibold'
                            }`}
                          >
                            <div className="text-xs sm:text-sm break-words">
                              {tr(lang, item.en, item.hi)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-start justify-between gap-4 text-[11px] font-mono text-[var(--text2)]">
                      <span className="max-w-[48%] break-words">
                        {tr(lang, q.likertConfig.minLabelEn, q.likertConfig.minLabelHi)}
                      </span>
                      <span className="max-w-[48%] text-right break-words">
                        {tr(lang, q.likertConfig.maxLabelEn, q.likertConfig.maxLabelHi)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. MULTI-SELECT RENDERER (Up to 3 tags) */}
                {q.questionType === 'multi-select' && (
                  <div className="space-y-2.5">
                    {(() => {
                      const selectedIds: string[] = Array.isArray(currentAns)
                        ? currentAns.map(String)
                        : typeof currentAns === 'string' && currentAns
                        ? currentAns.split(',').filter(Boolean)
                        : [];

                      return (
                        <>
                          <div className="text-xs font-mono font-bold text-[var(--text2)]">
                            {tr(
                              lang,
                              `Selected ${selectedIds.length} of ${q.maxMultiSelect || 3} maximum options`,
                              `अधिकतम ${q.maxMultiSelect || 3} में से ${selectedIds.length} विकल्प चुने गए`
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedIds.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  data-testid={`q${q.id}-multi-${optIdx}`}
                                  onClick={() => handleToggleMultiSelect(q, opt.id)}
                                  className={`min-h-[52px] p-3 sm:p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer min-w-0 ${
                                    isSelected
                                      ? 'bg-[var(--text)] text-[var(--bg)] border-2 border-[var(--text)] font-bold'
                                      : 'bg-[var(--bg2)] hover:border-[var(--text)] text-[var(--text)] border-[var(--border2)]'
                                  }`}
                                >
                                  <span
                                    className={`w-6 h-6 rounded-md text-xs font-mono font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                                      isSelected
                                        ? 'bg-[var(--bg)] text-[var(--text)]'
                                        : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border2)]'
                                    }`}
                                  >
                                    {isSelected ? '✓' : '+'}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs sm:text-sm font-semibold leading-snug break-words">
                                      {tr(lang, opt.textEn, opt.textHi)}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 5. TRADEOFF-PAIR RENDERER (1 to 5 Continuum between Left & Right Poles) */}
                {q.questionType === 'tradeoff-pair' && q.tradeoffConfig && (
                  <div className="p-3.5 sm:p-5 rounded-xl bg-[var(--bg2)] border border-[var(--border2)] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border2)] min-w-0">
                        <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[var(--text3)] mb-1">
                          {tr(lang, 'Pole A (Rating 1–2)', 'विकल्प A (रेटिंग 1–2)')}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[var(--text)] break-words">
                          {tr(lang, q.tradeoffConfig.leftPoleEn, q.tradeoffConfig.leftPoleHi)}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border2)] min-w-0">
                        <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[var(--text3)] mb-1">
                          {tr(lang, 'Pole B (Rating 4–5)', 'विकल्प B (रेटिंग 4–5)')}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[var(--text)] break-words">
                          {tr(lang, q.tradeoffConfig.rightPoleEn, q.tradeoffConfig.rightPoleHi)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { val: 1, en: '1 · Strong Pole A', hi: '1 · पूर्णतः A' },
                        { val: 2, en: '2 · Lean Pole A', hi: '2 · झुकाव A' },
                        { val: 3, en: '3 · Balanced (50/50)', hi: '3 · संतुलित' },
                        { val: 4, en: '4 · Lean Pole B', hi: '4 · झुकाव B' },
                        { val: 5, en: '5 · Strong Pole B', hi: '5 · पूर्णतः B' },
                      ].map((step) => {
                        const selected = Number(currentAns) === step.val;
                        return (
                          <button
                            key={step.val}
                            type="button"
                            data-testid={`q${q.id}-tradeoff-${step.val}`}
                            onClick={() => handleSetAnswer(q.id, step.val, true)}
                            className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                              selected
                                ? 'bg-[var(--text)] text-[var(--bg)] border-2 border-[var(--text)]'
                                : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border2)] hover:border-[var(--text)]'
                            }`}
                          >
                            {tr(lang, step.en, step.hi)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Step Navigation Controls when in Step-by-Step mode */}
          {viewMode === 'step' && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={activeQuestionIdx === 0}
                onClick={() => setActiveQuestionIdx((i) => Math.max(0, i - 1))}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] text-xs sm:text-sm font-mono font-bold disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{tr(lang, 'Previous', 'पिछला प्रश्न')}</span>
              </button>

              <span className="text-xs font-mono font-bold text-[var(--text2)] tabular-nums">
                {activeQuestionIdx + 1} / {QUIZ_DATA.length}
              </span>

              {activeQuestionIdx < QUIZ_DATA.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveQuestionIdx((i) => Math.min(QUIZ_DATA.length - 1, i + 1))
                  }
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs sm:text-sm font-mono font-extrabold cursor-pointer"
                >
                  <span>{tr(lang, 'Next Question', 'अगला प्रश्न')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCalculateSubmit}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs sm:text-sm font-mono font-extrabold cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{tr(lang, 'Calculate Results', 'परिणाम देखें')}</span>
                </button>
              )}
            </div>
          )}

          {/* Action Bar to Calculate / View Results */}
          <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-[var(--text2)] font-medium break-words">
              {answeredCount === QUIZ_DATA.length
                ? tr(
                    lang,
                    'All 25 assessment inputs captured! Review your Alignment Score Bands and Top 3 Career Pathways below.',
                    'सभी 25 प्रश्नों के उत्तर दर्ज हो गए हैं! नीचे अपनी अनुकूलता रेंज और शीर्ष 3 करियर विकल्प देखें।'
                  )
                : tr(
                    lang,
                    `You have answered ${answeredCount} of ${QUIZ_DATA.length} questions. Answer at least 15–25 questions for narrow Alignment Bands, or click Calculate now.`,
                    `आपने ${QUIZ_DATA.length} में से ${answeredCount} प्रश्नों के उत्तर दिए हैं। सटीक रेंज के लिए सभी 25 उत्तर दें या अभी परिणाम देखें।`
                  )}
            </div>

            <button
              type="button"
              id="assessment-submit-btn"
              data-testid="assessment-submit-btn"
              onClick={handleCalculateSubmit}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--text)] text-[var(--bg)] hover:opacity-90 font-mono font-extrabold text-xs sm:text-sm transition-opacity cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {tr(
                  lang,
                  `Calculate 25-Question Career Match (${answeredCount}/${QUIZ_DATA.length})`,
                  `25-प्रश्न करियर मिलान की गणना करें (${answeredCount}/${QUIZ_DATA.length})`
                )}
              </span>
            </button>
          </div>
        </div>

        {/* RESULTS PANEL (Core Monochrome UI + Strict Anti-Hallucination Framing) */}
        {(isSubmitted || answeredCount >= QUIZ_DATA.length) && (
          <div
            id="assessment-results-panel"
            data-testid="assessment-results-panel"
            className="p-4 sm:p-8 bg-[var(--bg)] border-t-2 border-[var(--text)] space-y-8"
          >
            {/* Top Anti-Hallucination & Non-Guarantee Advisory Banner */}
            <div className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] text-xs font-mono text-[var(--text)] leading-relaxed">
              <strong>
                {tr(
                  lang,
                  '⚠️ IMPORTANT NOTICE FOR PARENTS & STUDENTS (NO SALARY OR JOB GUARANTEE):',
                  '⚠️ माता-पिता और छात्रों के लिए महत्वपूर्ण सूचना (वेतन या नौकरी की कोई गारंटी नहीं):'
                )}
              </strong>{' '}
              {tr(
                lang,
                'This calculator provides educational self-exploration based on your answers. It is NOT a psychological test, admission guarantee, or job offer. All salary figures shown below are historical statistical ranges (MoSPI PLFS national entry baseline is ₹3.0 LPA / ₹25,000 per month)—individual starting salaries can be ₹0 (unplaced) or higher depending entirely on student skill, exam rank, and market hiring.',
                'यह कैलकुलेटर आपके उत्तरों पर आधारित केवल एक शैक्षिक मार्गदर्शन है। यह किसी प्रवेश, नौकरी या वेतन की गारंटी नहीं देता है। नीचे दिखाए गए सभी वेतन आंकड़े ऐतिहासिक सांख्यिकीय रेंज हैं (राष्ट्रीय PLFS शुरुआती औसत ₹3.0 LPA है)—व्यक्तिगत वेतन पूरी तरह छात्र के कौशल और परीक्षा रैंक पर निर्भर करता है।'
              )}
            </div>

            {/* Top Result Summary Banner */}
            <div className="p-4 sm:p-6 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="inline-flex flex-wrap items-center gap-2">
                    {assessmentResult.isFallbackTriggered ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-extrabold bg-[var(--text)] text-[var(--bg)]">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {tr(
                            lang,
                            'MULTI-DOMAIN TIE / OPEN PROFILE FALLBACK',
                            'बहु-क्षेत्रीय समानता / खुला अन्वेषण मोड'
                          )}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-extrabold bg-[var(--text)] text-[var(--bg)]">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {tr(
                            lang,
                            '25-QUESTION MULTI-MODAL ALIGNMENT CALCULATED',
                            '25-प्रश्न बहु-आयामी अनुकूलता परिणाम'
                          )}
                        </span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] break-words">
                    {tr(lang, assessmentResult.headlineEn, assessmentResult.headlineHi)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
                    {tr(lang, assessmentResult.summaryEn, assessmentResult.summaryHi)}
                  </p>
                </div>

                {/* Alignment Confidence Band Meter */}
                <div className="p-4 rounded-2xl bg-[var(--bg)] border-2 border-[var(--border2)] min-w-[220px] shrink-0">
                  <div className="text-[11px] font-mono font-bold text-[var(--text3)] uppercase tracking-wider">
                    {tr(lang, 'Assessment Confidence Band', 'मूल्यांकन विश्वास रेंज')}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2 flex-wrap font-mono">
                    <span className="text-xl sm:text-2xl font-black text-[var(--text)] tabular-nums">
                      {assessmentResult.confidenceBandLow}%–{assessmentResult.confidenceBandHigh}%
                    </span>
                    <span className="text-xs font-bold text-[var(--text2)]">
                      ({assessmentResult.confidenceLevel})
                    </span>
                  </div>
                  <div className="mt-2 w-full h-2 bg-[var(--bg2)] border border-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--text)] rounded-full"
                      style={{ width: `${assessmentResult.confidenceScore}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] font-mono text-[var(--text3)]">
                    {tr(
                      lang,
                      `Stream: ${assessmentResult.detectedConstraints.stream} • Answered: ${assessmentResult.answeredCount}/25`,
                      `स्ट्रीम: ${assessmentResult.detectedConstraints.stream} • उत्तरित: ${assessmentResult.answeredCount}/25`
                    )}
                  </div>
                </div>
              </div>

              {/* Contradiction & Validation Warnings */}
              {assessmentResult.validationWarnings.length > 0 && (
                <div
                  id="assessment-validation-warnings"
                  data-testid="assessment-validation-warnings"
                  className="mt-4 space-y-2"
                >
                  {assessmentResult.validationWarnings.map((warn) => (
                    <div
                      key={warn.code}
                      className="p-3.5 rounded-xl bg-[var(--bg)] border-2 border-[var(--text)] flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text)]"
                    >
                      <AlertTriangle className="w-4 h-4 text-[var(--text)] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 break-words font-medium">
                        {tr(lang, warn.messageEn, warn.messageHi)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback Explanation Banner */}
              {assessmentResult.isFallbackTriggered && (
                <div
                  id="assessment-fallback-banner"
                  data-testid="assessment-fallback-banner"
                  className="mt-4 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="text-xs sm:text-sm text-[var(--text)] font-medium break-words">
                    {tr(
                      lang,
                      assessmentResult.fallbackReasonEn || '',
                      assessmentResult.fallbackReasonHi || ''
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllFallbackExplorer((prev) => !prev)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold shrink-0 cursor-pointer"
                  >
                    {showAllFallbackExplorer
                      ? tr(lang, 'Hide All-Options Explorer', 'एक्सप्लोरर छुपाएं')
                      : tr(lang, 'Browse All 395+ Careers', 'सभी 395+ करियर देखें')}
                  </button>
                </div>
              )}
            </div>

            {/* Top 3 Matching Career Categories */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-extrabold text-[var(--text)] flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--text)] shrink-0" />
                <span className="break-words">
                  {tr(
                    lang,
                    'Your Top 3 Matching Career Domains (With Statistical Alignment Bands)',
                    'आपके शीर्ष 3 अनुकूल करियर क्षेत्र (अनुकूलता स्कोर रेंज के साथ)'
                  )}
                </span>
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {assessmentResult.top3Categories.map((item, idx) => (
                  <div
                    key={item.category}
                    data-testid={`assessment-top-category-${idx + 1}`}
                    className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 min-w-0 bg-[var(--bg2)] ${
                      idx === 0
                        ? 'border-2 border-[var(--text)]'
                        : 'border border-[var(--border2)]'
                    }`}
                  >
                    <div className="space-y-2.5 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap font-mono">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-[var(--text)] text-[var(--bg)]">
                          #{idx + 1} {item.category}
                        </span>
                        <span className="text-xs font-extrabold text-[var(--text)] bg-[var(--bg)] border border-[var(--border2)] px-2.5 py-0.5 rounded-md">
                          {tr(lang, item.alignmentBandLabelEn, item.alignmentBandLabelHi)}
                        </span>
                      </div>

                      <h5 className="text-base font-extrabold text-[var(--text)] break-words">
                        {tr(lang, item.info.titleEn, item.info.titleHi)}
                      </h5>

                      <p className="text-xs text-[var(--text2)] leading-relaxed break-words">
                        {tr(lang, item.info.whyItFitsEn, item.info.whyItFitsHi)}
                      </p>

                      <div className="pt-2 border-t border-[var(--border)] space-y-1.5 text-xs">
                        <div className="text-[var(--text2)] break-words">
                          <strong className="font-bold text-[var(--text)]">
                            {tr(lang, 'Key Exams:', 'प्रमुख परीक्षाएं:')}
                          </strong>{' '}
                          {item.info.topExams.join(' • ')}
                        </div>
                        <div className="text-[var(--text2)] break-words">
                          <strong className="font-bold text-[var(--text)]">
                            {tr(lang, 'Degrees:', 'प्रमुख डिग्री:')}
                          </strong>{' '}
                          {item.info.typicalDegrees.join(' • ')}
                        </div>
                        <div className="text-[var(--text)] font-mono font-semibold break-words">
                          <strong>
                            {tr(
                              lang,
                              'Historical Median (Not Guaranteed):',
                              'ऐतिहासिक वेतन रेंज (कोई गारंटी नहीं):'
                            )}
                          </strong>{' '}
                          {item.info.avgEntrySalary}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono font-bold text-[var(--text3)] tabular-nums">
                      <span>
                        {tr(lang, `Weighted Points: ${item.points}`, `भारित अंक: ${item.points}`)}
                      </span>
                      <span>{item.shareOfTotal}% Share</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete 6-Category Score Breakdown */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg2)] border border-[var(--border2)] space-y-3">
              <h4 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--text)] shrink-0" />
                <span>
                  {tr(
                    lang,
                    'Complete 6-Domain Weighted Alignment Band Breakdown',
                    'सभी 6 करियर क्षेत्रों का संपूर्ण अनुकूलता रेंज विवरण'
                  )}
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {assessmentResult.allCategoryScores.map((sc) => (
                  <div
                    key={sc.category}
                    className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border2)] space-y-1.5 min-w-0 font-mono"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-bold">
                      <span className="text-[var(--text)] truncate">{sc.category}</span>
                      <span className="text-[var(--text)] shrink-0 tabular-nums">
                        {sc.alignmentBandLow}%–{sc.alignmentBandHigh}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg2)] border border-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--text)] rounded-full"
                        style={{ width: `${sc.percentageOfMax}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[var(--text3)] flex justify-between tabular-nums">
                      <span>{sc.points} pts</span>
                      <span>{sc.shareOfTotal}% share</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Recommended Specific Careers (Strictly capped at 3) */}
            {assessmentResult.recommendedCareers.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-base sm:text-lg font-extrabold text-[var(--text)]">
                    {tr(
                      lang,
                      'Top 3 Specific Career Roadmaps to Explore Next',
                      'आपकी प्रोफ़ाइल से मेल खाते शीर्ष 3 विशिष्ट करियर रोडमैप'
                    )}
                  </h4>
                  <span className="text-xs font-mono font-semibold text-[var(--text3)]">
                    {tr(
                      lang,
                      'Showing top 3 of 395+ career pathways (Click to inspect & verify)',
                      '395+ करियर रास्तों में से शीर्ष 3 (विस्तार से देखने के लिए क्लिक करें)'
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {assessmentResult.recommendedCareers.slice(0, 3).map((career) => (
                    <div
                      key={career.id}
                      data-testid={`assessment-recommended-career-${career.id}`}
                      onClick={() => onSelectCareer(career.id)}
                      className="group rounded-2xl border border-[var(--border2)] hover:border-[var(--text)] bg-[var(--bg2)] p-4 sm:p-5 transition-all flex flex-col justify-between gap-4 cursor-pointer min-w-0"
                    >
                      <div className="space-y-2.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] shrink-0">
                            <CareerSvgIcon id={career.id} category={career.category} className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[var(--bg)] text-[var(--text)] border border-[var(--border2)]">
                            {career.eligibility?.streams?.[0] || 'Any Stream'}
                          </span>
                        </div>

                        <h5 className="text-base font-extrabold text-[var(--text)] group-hover:underline transition-colors break-words">
                          {tr(lang, career.title, career.titleHindi)}
                        </h5>

                        <p className="text-xs text-[var(--text2)] line-clamp-3 leading-relaxed break-words">
                          {tr(lang, career.overview, career.overviewHindi)}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 text-xs font-mono font-bold text-[var(--text)]">
                        <span className="truncate">{career.duration}</span>
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <span>{tr(lang, 'View Roadmap', 'रोडमैप देखें')}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exploratory All-Options Explorer */}
            {(assessmentResult.isFallbackTriggered || showAllFallbackExplorer) && (
              <div
                id="assessment-all-options-explorer"
                className="p-4 sm:p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--border2)] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-extrabold text-[var(--text)] flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[var(--text)] shrink-0" />
                      <span>
                        {tr(
                          lang,
                          'Open Career Directory Explorer (395+ Career Pathways)',
                          'खुला करियर डायरेक्टरी एक्सप्लोरर (395+ करियर रास्ते)'
                        )}
                      </span>
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label="Filter by broad domain"
                      value={selectedExplorerCategory}
                      onChange={(e) => setSelectedExplorerCategory(e.target.value)}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono font-bold text-[var(--text)]"
                    >
                      <option value="All">{tr(lang, 'All 6 Broad Domains', 'सभी 6 क्षेत्र')}</option>
                      {(
                        [
                          'Engineering',
                          'Medical',
                          'Commerce',
                          'Arts',
                          'Government',
                          'Vocational',
                        ] as BroadCareerCategory[]
                      ).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <select
                      aria-label="Filter by Class 12 stream"
                      value={selectedExplorerStream}
                      onChange={(e) => setSelectedExplorerStream(e.target.value)}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono font-bold text-[var(--text)]"
                    >
                      <option value="All">{tr(lang, 'All Streams', 'सभी स्ट्रीम')}</option>
                      <option value="PCM">PCM</option>
                      <option value="PCB">PCB</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                      <option value="Any">Any Stream</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredExplorerCareers.slice(0, 12).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectCareer(c.id)}
                      className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border2)] hover:border-[var(--text)] text-left transition flex flex-col justify-between gap-2 cursor-pointer min-w-0"
                    >
                      <div className="text-xs sm:text-sm font-bold text-[var(--text)] break-words">
                        {tr(lang, c.title, c.titleHindi)}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text2)] font-semibold">
                        {c.eligibility?.streams?.[0] || 'Any Stream'} • {c.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mandatory Exploratory Guidance Disclaimer */}
            <div
              data-testid="assessment-guidance-disclaimer"
              className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg2)] border border-[var(--border2)] text-xs font-mono text-[var(--text2)] leading-relaxed break-words"
            >
              {tr(lang, assessmentResult.disclaimerEn, assessmentResult.disclaimerHi)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
