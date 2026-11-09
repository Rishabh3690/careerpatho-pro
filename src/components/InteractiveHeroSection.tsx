import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CareersDatabase, Language, CareerSearchFilters } from '../data/types';
import {
  parseNaturalCareerQuery,
  t,
  computeCareerKPIs,
  scoreCareerFuzzyMatch,
  getFormalDesignation,
} from '../utils/careerEngine';
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Cpu,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  GitCompare,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface InteractiveHeroSectionProps {
  data: CareersDatabase;
  lang: Language;
  totalCareersCount: number;
  filters: CareerSearchFilters;
  onFilterChange: (filters: CareerSearchFilters) => void;
  onCommitSearchQuery?: (query: string) => void;
  resultCount: number;
  onSelectCareerId: (id: string) => void;
  onOpenAICounselor: () => void;
  onOpenQuiz: () => void;
  onOpenCollabStudio?: () => void;
}

type ClusterFilter = 'ALL' | 'TECH' | 'FIN_LAW' | 'MED_BIO' | 'GOVT' | 'SCI_DES';

interface StarNode {
  id: string;
  label: string;
  labelHi: string;
  category: string;
  cluster: ClusterFilter;
  stream: 'PCM' | 'PCB' | 'Commerce' | 'Arts' | 'Any';
  entryCtc: string;
  growth: string;
  exam: string;
  x: number;
  y: number;
  z: number;
  connections: number[];
}

const CONSTELLATION_NODES: Omit<StarNode, 'x' | 'y' | 'z'>[] = [
  {
    id: 'btech-ai-ds',
    label: 'AI / ML Architect',
    labelHi: 'AI / ML इंजीनियर',
    category: 'Tech',
    cluster: 'TECH',
    stream: 'PCM',
    entryCtc: '₹12–28 LPA',
    growth: '+42% YoY',
    exam: 'JEE / GATE',
    connections: [1, 2, 4, 7],
  },
  {
    id: 'quant-finance-india',
    label: 'Quant Researcher',
    labelHi: 'क्वांट एनालिस्ट',
    category: 'Finance',
    cluster: 'FIN_LAW',
    stream: 'PCM',
    entryCtc: '₹24–50 LPA',
    growth: '+38% YoY',
    exam: 'ISI / JEE Adv',
    connections: [0, 3, 7, 11],
  },
  {
    id: 'btech-cse',
    label: 'Systems Software Eng',
    labelHi: 'सॉफ्टवेयर इंजीनियर',
    category: 'Tech',
    cluster: 'TECH',
    stream: 'PCM',
    entryCtc: '₹8–24 LPA',
    growth: '+28% YoY',
    exam: 'JEE / BITSAT',
    connections: [0, 4, 5, 16],
  },
  {
    id: 'cfa-investment',
    label: 'Investment Banking',
    labelHi: 'इन्वेस्टमेंट बैंकर',
    category: 'Finance',
    cluster: 'FIN_LAW',
    stream: 'Commerce',
    entryCtc: '₹15–35 LPA',
    growth: '+24% YoY',
    exam: 'CAT / CFA',
    connections: [1, 11, 13],
  },
  {
    id: 'btech-cyber',
    label: 'Zero-Trust CyberSec',
    labelHi: 'साइबर सुरक्षा',
    category: 'Tech',
    cluster: 'TECH',
    stream: 'PCM',
    entryCtc: '₹9–20 LPA',
    growth: '+35% YoY',
    exam: 'JEE / OSCP',
    connections: [0, 2, 15],
  },
  {
    id: 'btech-ece-vlsi',
    label: 'VLSI Chip Architect',
    labelHi: 'सेमीकंडक्टर इंजीनियर',
    category: 'Silicon',
    cluster: 'TECH',
    stream: 'PCM',
    entryCtc: '₹14–30 LPA',
    growth: '+40% YoY',
    exam: 'JEE / GATE EC',
    connections: [2, 6, 17],
  },
  {
    id: 'btech-aerospace',
    label: 'Aerospace & SpaceTech',
    labelHi: 'एयरोस्पेस इंजीनियर',
    category: 'Space',
    cluster: 'SCI_DES',
    stream: 'PCM',
    entryCtc: '₹10–22 LPA',
    growth: '+31% YoY',
    exam: 'JEE / ICRB',
    connections: [5, 15, 17],
  },
  {
    id: 'btech-quantum-computing',
    label: 'Quantum & Photonics',
    labelHi: 'क्वांटम कंप्यूटिंग',
    category: 'DeepTech',
    cluster: 'TECH',
    stream: 'PCM',
    entryCtc: '₹12–24 LPA',
    growth: '+42% YoY',
    exam: 'JEE Adv / IAT',
    connections: [0, 1, 9],
  },
  {
    id: 'mbbs-clinical',
    label: 'Clinical Medicine (MBBS)',
    labelHi: 'डॉक्टर (MBBS/MD)',
    category: 'Medical',
    cluster: 'MED_BIO',
    stream: 'PCB',
    entryCtc: '₹9–18 LPA',
    growth: '+22% YoY',
    exam: 'NEET UG / NEXT',
    connections: [9, 10],
  },
  {
    id: 'bioinformatics-computational-bio',
    label: 'Genomics & Bio-AI',
    labelHi: 'बायोइनफॉरमैटिक्स',
    category: 'BioTech',
    cluster: 'MED_BIO',
    stream: 'PCB',
    entryCtc: '₹8–18 LPA',
    growth: '+36% YoY',
    exam: 'IAT / GAT-B',
    connections: [7, 8, 10],
  },
  {
    id: 'nuclear-medicine-tech',
    label: 'Nuclear Medicine Spec',
    labelHi: 'न्यूक्लियर मेडिसिन',
    category: 'Medical',
    cluster: 'MED_BIO',
    stream: 'PCB',
    entryCtc: '₹7–15 LPA',
    growth: '+29% YoY',
    exam: 'AIIMS / AERB',
    connections: [8, 9],
  },
  {
    id: 'ca-audit',
    label: 'Chartered Accountant',
    labelHi: 'चार्टर्ड अकाउंटेंट (CA)',
    category: 'Commerce',
    cluster: 'FIN_LAW',
    stream: 'Commerce',
    entryCtc: '₹11–25 LPA',
    growth: '+21% YoY',
    exam: 'ICAI CA Final',
    connections: [1, 3, 13],
  },
  {
    id: 'upsc-ias',
    label: 'IAS / Civil Services',
    labelHi: 'IAS / सिविल सेवा',
    category: 'Govt',
    cluster: 'GOVT',
    stream: 'Any',
    entryCtc: '₹12–18 LPA + Perks',
    growth: 'Apex Authority',
    exam: 'UPSC CSE',
    connections: [13, 14, 15],
  },
  {
    id: 'ba-llb-corp',
    label: 'M&A Corporate Counsel',
    labelHi: 'कॉर्पोरेट वकील',
    category: 'Law',
    cluster: 'FIN_LAW',
    stream: 'Any',
    entryCtc: '₹14–28 LPA',
    growth: '+25% YoY',
    exam: 'CLAT / AILET',
    connections: [3, 11, 12],
  },
  {
    id: 'public-policy',
    label: 'Public Policy Strategist',
    labelHi: 'पब्लिक पॉलिसी',
    category: 'Arts/Gov',
    cluster: 'GOVT',
    stream: 'Arts',
    entryCtc: '₹8–16 LPA',
    growth: '+23% YoY',
    exam: 'CUET PG / UPSC',
    connections: [12, 13],
  },
  {
    id: 'defense-officer',
    label: 'Armed Forces Officer',
    labelHi: 'सेना अधिकारी (NDA)',
    category: 'Defense',
    cluster: 'GOVT',
    stream: 'Any',
    entryCtc: '₹10–18 LPA',
    growth: 'Command Track',
    exam: 'UPSC NDA / CDS',
    connections: [4, 6, 12],
  },
  {
    id: 'bdes-ux-product',
    label: 'Product & UX Systems',
    labelHi: 'प्रोडक्ट डिज़ाइनर',
    category: 'Design',
    cluster: 'SCI_DES',
    stream: 'Any',
    entryCtc: '₹9–22 LPA',
    growth: '+30% YoY',
    exam: 'UCEED / NID',
    connections: [2, 17],
  },
  {
    id: 'spatial-xr-design',
    label: 'Spatial & XR Architect',
    labelHi: 'स्पेशियल और XR डिज़ाइन',
    category: 'Spatial',
    cluster: 'SCI_DES',
    stream: 'Any',
    entryCtc: '₹9–20 LPA',
    growth: '+37% YoY',
    exam: 'UCEED / CEED',
    connections: [5, 6, 16],
  },
];

type ArchitectStream = 'PCM' | 'PCB' | 'Commerce' | 'Arts' | 'Class10';
type ArchitectGoal = 'high-pay' | 'frontier-tech' | 'govt-authority' | 'low-fee-roi' | 'clinical-bio';

interface ValuePropositionPillar {
  id: string;
  index: string;
  labelEn: string;
  labelHi: string;
  headlineEn: string;
  headlineHi: string;
  descEn: string;
  descHi: string;
  metrics: Array<{
    titleEn: string;
    titleHi: string;
    valueEn: string;
    valueHi: string;
    barPct: number;
  }>;
  ctaLabelEn: string;
  ctaLabelHi: string;
}

const VALUE_PROPOSITION_PILLARS: ValuePropositionPillar[] = [
  {
    id: 'vp-blueprints',
    index: '01',
    labelEn: '395+ Verified Roadmaps',
    labelHi: '395+ सत्यापित रोडमैप',
    headlineEn: 'Step-by-Step Execution Roadmaps & Strategic Safety Nets',
    headlineHi: 'चरण-दर-चरण करियर रोडमैप और रणनीतिक सुरक्षा कवच',
    descEn:
      'Every career blueprint maps exact Class 10/12 eligibility, national & state entrance cutoffs, 4-gate hiring funnels, and Multi-Track Career Insurance (Strategic Safety Nets) so no student wastes years in an unplanned drop cycle.',
    descHi:
      'प्रत्येक करियर ब्लूप्रिंट में कक्षा 10/12 पात्रता, प्रवेश परीक्षा कटऑफ, कौशल रडार और रणनीतिक सुरक्षा कवच (Multi-Track Career Insurance) शामिल हैं ताकि किसी भी छात्र का वर्ष बर्बाद न हो।',
    metrics: [
      {
        titleEn: 'Engineering, AI, VLSI & Pure Sciences',
        titleHi: 'इंजीनियरिंग, AI, सेमीकंडक्टर और विज्ञान',
        valueEn: '65+ Specialized Paths',
        valueHi: '65+ विशेष करियर ट्रैक',
        barPct: 94,
      },
      {
        titleEn: 'Medical, Allied Health & Non-NEET BioTech',
        titleHi: 'मेडिकल, नर्सिंग और बिना-NEET बायोटेक',
        valueEn: '77+ Clinical, Bio & Env Paths',
        valueHi: '77+ क्लिनिकल और बायो ट्रैक',
        barPct: 86,
      },
      {
        titleEn: 'Commerce, Law, Design, Media, Sports & Vocational',
        titleHi: 'कॉमर्स, लॉ, डिज़ाइन, मीडिया, खेल और कौशल ट्रेड',
        valueEn: '231+ High-ROI Tracks',
        valueHi: '231+ उच्च-ROI करियर ट्रैक',
        barPct: 92,
      },
    ],
    ctaLabelEn: 'Explore 395+ Careers',
    ctaLabelHi: 'सभी 395+ करियर देखें',
  },
  {
    id: 'vp-roi-salary',
    index: '02',
    labelEn: 'Real In-Hand vs CTC & ROI',
    labelHi: 'वास्तविक वेतन और कॉलेज ROI',
    headlineEn: 'Transparent Monthly Take-Home Pay & PM-Vidyalaxmi Loan Math',
    headlineHi: 'विज्ञापित CTC बनाम वास्तविक इन-हैंड वेतन और शिक्षा ऋण गणना',
    descEn:
      'We strip away inflated college placement brochures to show real post-tax monthly in-hand pay across 5 career stages, Government vs Private college fee payback months, and collateral-free PM-Vidyalaxmi loan subsidies.',
    descHi:
      'हम भ्रामक कॉलेज विज्ञापनों के बजाय वास्तविक मासिक इन-हैंड वेतन, सरकारी बनाम प्राइवेट कॉलेज फीस की तुलना और बिना गारंटी वाले पीएम-विद्यालक्ष्मी ऋण की सटीक जानकारी देते हैं।',
    metrics: [
      {
        titleEn: 'Govt / INI College Tuition ROI Payback',
        titleHi: 'सरकारी कॉलेज फीस रिकवरी समय (ROI)',
        valueEn: '2–5 Months Payback',
        valueHi: 'मात्र 2–5 महीने में फीस वसूल',
        barPct: 96,
      },
      {
        titleEn: 'PM-Vidyalaxmi Collateral-Free Loan Coverage',
        titleHi: 'पीएम-विद्यालक्ष्मी बिना गारंटी शिक्षा ऋण',
        valueEn: 'Up to ₹7.5L (75% Govt Guarantee)',
        valueHi: '₹7.5 लाख तक (75% सरकारी गारंटी)',
        barPct: 88,
      },
      {
        titleEn: '12-Year Compensation Trajectory Modeling',
        titleHi: '12-वर्षीय वेतन वृद्धि विश्लेषण',
        valueEn: 'Entry to Principal Apex Bands',
        valueHi: 'शुरुआती से शीर्ष स्तर तक वेतन',
        barPct: 90,
      },
    ],
    ctaLabelEn: 'Launch Smart ROI & Career Matcher',
    ctaLabelHi: 'स्मार्ट ROI और करियर काउंसलर खोलें',
  },
  {
    id: 'vp-live-collab',
    index: '03',
    labelEn: 'Shareable Career Comparison',
    labelHi: 'अभिभावक करियर तुलना लिंक',
    headlineEn: 'Instant Side-by-Side Comparison Links for Parents & Relatives',
    headlineHi: 'माता-पिता के साथ साझा करने योग्य सीधी करियर तुलना तालिका',
    descEn:
      'Compare any two careers side-by-side (e.g., B.Tech CSE vs BCA) and generate a stateless URL (#/compare?c1=btech-cse&c2=bca) that opens immediately on WhatsApp with zero login or database required.',
    descHi:
      'बिना किसी लॉगिन के दो करियर की सीधी तुलना करें और तुरंत व्हाट्सएप पर माता-पिता के साथ तुलना लिंक साझा करें।',
    metrics: [
      {
        titleEn: 'Stateless Parent Comparison URLs',
        titleHi: 'तुरंत खुलने वाला तुलना लिंक',
        valueEn: 'Zero Login · Zero Backend',
        valueHi: 'बिना लॉगिन तुरंत साझा करें',
        barPct: 98,
      },
      {
        titleEn: 'Sarkari Eligibility & Authority Verification',
        titleHi: 'UPSC/SSC पात्रता और सरकारी मान्यता',
        valueEn: 'NIRF · AICTE · UGC Badges',
        valueHi: 'NIRF · AICTE · UGC प्रमाणित',
        barPct: 95,
      },
      {
        titleEn: 'Strategic Safety Net Comparison',
        titleHi: 'रणनीतिक सुरक्षा कवच तुलना',
        valueEn: 'Multi-Track Career Insurance',
        valueHi: 'मल्टी-ट्रैक करियर इंश्योरेंस',
        barPct: 95,
      },
    ],
    ctaLabelEn: 'Compare 2 Careers Side-by-Side',
    ctaLabelHi: 'दो करियर की तुलना करें',
  },
  {
    id: 'vp-bilingual-free',
    index: '04',
    labelEn: 'Trilingual & Zero Paywall',
    labelHi: 'त्रिभाषी (EN | Hinglish | हिं)',
    headlineEn: '100% Free, Ad-Free & 1-Click Uncle-Defense Parent PDFs',
    headlineHi: '100% निःशुल्क, विज्ञापन-मुक्त और शुद्ध हिंदी माता-पिता मार्गदर्शिका',
    descEn:
      'Private counselors charge ₹10,000+ to push sponsored private universities. CareerPathO is 100% free with zero ads, zero login walls, and instant printable Uncle-Defense Parent Guides for every single career.',
    descHi:
      'प्राइवेट काउंसलर ₹10,000+ फीस लेते हैं। CareerPathO पूरी तरह निःशुल्क है और हर करियर के लिए 1-क्लिक में शुद्ध हिंदी "माता-पिता मार्गदर्शिका PDF" प्रदान करता है।',
    metrics: [
      {
        titleEn: '25-Question Multi-Modal Career Assessment Calculator',
        titleHi: '25-प्रश्न बहु-आयामी करियर मूल्यांकन कैलकुलेटर',
        valueEn: '5 Answer Types · Alignment Bands',
        valueHi: '5 उत्तर प्रारूप · अनुकूलता रेंज',
        barPct: 100,
      },
      {
        titleEn: '1-Click Uncle-Defense Parent Guide (माता-पिता गाइड)',
        titleHi: '1-क्लिक शुद्ध हिंदी माता-पिता गाइड',
        valueEn: 'Fees, Scholarships & Safety Net',
        valueHi: 'फीस, छात्रवृत्ति और सुरक्षा कवच',
        barPct: 96,
      },
      {
        titleEn: 'Zero Ads, Zero Trackers, Zero Forced Accounts',
        titleHi: 'कोई विज्ञापन नहीं, कोई लॉगिन बाध्यता नहीं',
        valueEn: '100% Open Student Access',
        valueHi: 'हर भारतीय छात्र के लिए खुला',
        barPct: 100,
      },
    ],
    ctaLabelEn: 'Take 10-Question Aptitude Matcher',
    ctaLabelHi: '10-प्रश्न एप्टीट्यूड क्विज़ शुरू करें',
  },
];

export const InteractiveHeroSection: React.FC<InteractiveHeroSectionProps> = ({
  data,
  lang,
  totalCareersCount,
  filters,
  onFilterChange,
  onCommitSearchQuery,
  resultCount,
  onSelectCareerId,
  onOpenAICounselor,
  onOpenQuiz,
  onOpenCollabStudio,
}) => {
  const isHi = lang === 'hi';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic Animated Value Proposition Showcase state
  const [activeVpIdx, setActiveVpIdx] = useState<number>(0);
  const [vpAutoPlay, setVpAutoPlay] = useState<boolean>(true);

  // Interactive Hero Path Architect state
  const [archStream, setArchStream] = useState<ArchitectStream>('PCM');
  const [archGoal, setArchGoal] = useState<ArchitectGoal>('high-pay');

  // 3D Constellation Controls state
  const [polyLevel, setPolyLevel] = useState<number>(3);
  const [zoomScale, setZoomScale] = useState<number>(1.08);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [clusterFilter, setClusterFilter] = useState<ClusterFilter>('ALL');
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<StarNode | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // UPGRADE 1 (Performance & Mobile Optimization): Static fallback for 3D Hero Mesh
  // If mobile OR prefers-reduced-motion: reduce OR saveData is active, render static high-contrast SVG constellation
  const [useStaticFallback, setUseStaticFallback] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isMobileViewport = window.innerWidth < 768;
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const isSlowNet = !!(conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g');
    return isMobileViewport || reducedMotion || isSlowNet;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const updateFallback = () => {
      if (mqReduce.matches || mqMobile.matches) {
        setUseStaticFallback(true);
      }
    };
    updateFallback();
    mqReduce.addEventListener?.('change', updateFallback);
    mqMobile.addEventListener?.('change', updateFallback);
    return () => {
      mqReduce.removeEventListener?.('change', updateFallback);
      mqMobile.removeEventListener?.('change', updateFallback);
    };
  }, []);

  // Auto-cycle the Value Proposition Showcase every 5.5 seconds unless paused
  useEffect(() => {
    if (!vpAutoPlay) return;
    const timer = window.setInterval(() => {
      setActiveVpIdx((prev) => (prev + 1) % VALUE_PROPOSITION_PILLARS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [vpAutoPlay]);

  const currentVp = VALUE_PROPOSITION_PILLARS[activeVpIdx] || VALUE_PROPOSITION_PILLARS[0];

  const handleVpAction = (pillarId: string) => {
    if (pillarId === 'vp-live-collab') {
      if (onOpenCollabStudio) onOpenCollabStudio();
      else window.location.hash = '#/compare?c1=btech-cse&c2=bca-software';
    } else if (pillarId === 'vp-roi-salary') {
      onOpenAICounselor();
    } else if (pillarId === 'vp-bilingual-free') {
      onOpenQuiz();
    } else {
      document.getElementById('careers-directory-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Build 3D Fibonacci sphere coordinates for all 18 nodes
  const nodes3D = useMemo<StarNode[]>(() => {
    const count = CONSTELLATION_NODES.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    return CONSTELLATION_NODES.map((n, i) => {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const radius = 160;
      return {
        ...n,
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      };
    });
  }, []);

  const activeNode = hoveredNode || nodes3D[selectedNodeIdx] || nodes3D[0];

  // Live Path Architect: Compute top 3 tailored career blueprints from the full database
  const architectRecommendations = useMemo(() => {
    const allCareers = Object.values(data.children || {});
    const scored = allCareers.map((c) => {
      let score = 50;
      const streams = c.eligibility?.streams || [];
      const streamTarget = archStream === 'Class10' ? 'Any' : archStream;

      if (archStream === 'Class10') {
        if (c.audience?.includes('class10') || streams.includes('Any')) score += 30;
      } else if (streams.includes(streamTarget)) {
        score += 35;
      } else if (streams.includes('Any')) {
        score += 18;
      } else {
        score -= 40;
      }

      const sal = c.entrySalaryLakhs || 8;
      if (archGoal === 'high-pay') {
        score += Math.min(35, sal * 2);
      } else if (archGoal === 'frontier-tech') {
        if (c.category === 'engineering' || c.category === 'science') score += 30;
        if (c.id.includes('ai') || c.id.includes('quant') || c.id.includes('vlsi') || c.id.includes('data')) {
          score += 15;
        }
      } else if (archGoal === 'govt-authority') {
        if (c.category === 'government' || c.category === 'defense' || c.category === 'law') score += 38;
      } else if (archGoal === 'low-fee-roi') {
        if (c.category === 'commerce' || c.category === 'government' || sal >= 10) score += 25;
      } else if (archGoal === 'clinical-bio') {
        if (c.category === 'medical' || c.category === 'science') score += 38;
      }

      return { career: c, matchPct: Math.min(99, Math.max(68, Math.round(score))) };
    });

    scored.sort((a, b) => b.matchPct - a.matchPct);
    return scored.slice(0, 3);
  }, [data.children, archStream, archGoal]);

  // Sync Architect Stream selection with 3D Constellation Cluster highlight
  const handleSelectArchStream = (s: ArchitectStream) => {
    setArchStream(s);
    if (s === 'PCB') {
      setClusterFilter('MED_BIO');
      setSelectedNodeIdx(8);
    } else if (s === 'Commerce') {
      setClusterFilter('FIN_LAW');
      setSelectedNodeIdx(3);
    } else if (s === 'Arts') {
      setClusterFilter('GOVT');
      setSelectedNodeIdx(12);
    } else {
      setClusterFilter('ALL');
      setSelectedNodeIdx(0);
    }
  };

  const handleCycleNode = (dir: -1 | 1) => {
    setSelectedNodeIdx((prev) => (prev + dir + nodes3D.length) % nodes3D.length);
  };

  useEffect(() => {
    // UPGRADE 1: Skip 3D Canvas loop when Static Fallback is active (saves battery & CPU on mobile/reduced-motion)
    if (useStaticFallback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisibleInViewport = true;
    let rotY = 0.4;
    let rotX = 0.2;
    let targetVelY = 0.0038;
    let targetVelX = 0.0012;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let pulseTick = 0;

    const projectedPoints: {
      node: StarNode;
      idx: number;
      px: number;
      py: number;
      pz: number;
      scale: number;
      inCluster: boolean;
    }[] = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Pause canvas animation loop when scrolled out of viewport to save battery & CPU
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              if (entries[0]) {
                isVisibleInViewport = entries[0].isIntersecting;
              }
            },
            { threshold: 0.05 }
          )
        : null;
    observer?.observe(canvas);

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisibleInViewport) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        rotY += dx * 0.007;
        rotX += dy * 0.007;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else if (mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        targetVelY = ((mx - cx) / cx) * 0.006;
        targetVelX = ((my - cy) / cy) * 0.004;
      }

      let found: StarNode | null = null;
      for (const p of projectedPoints) {
        const dist = Math.hypot(mx - p.px, my - p.py);
        if (dist < 22) {
          found = p.node;
          break;
        }
      }
      setHoveredNode(found);
      canvas.style.cursor = found ? 'pointer' : isDragging ? 'grabbing' : 'grab';
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for smooth mobile 3D rotation & tap selection
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      rotY += dx * 0.007;
      rotX += dy * 0.007;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (const p of projectedPoints) {
        if (Math.hypot(mx - p.px, my - p.py) < 24) {
          setSelectedNodeIdx(p.idx);
          break;
        }
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    canvas.addEventListener('click', onClick);

    const render = () => {
      if (!isVisibleInViewport) {
        animId = requestAnimationFrame(render);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2 - 14;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const fg = isDark ? '255, 255, 255' : '10, 10, 10';

      ctx.clearRect(0, 0, w, h);

      // Subtle architectural radar rings
      ctx.strokeStyle = `rgba(${fg}, 0.06)`;
      ctx.lineWidth = 1;
      [62, 118, 174].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * zoomScale, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshair axes
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy);
      ctx.lineTo(cx + 200, cy);
      ctx.moveTo(cx, cy - 155);
      ctx.lineTo(cx, cy + 155);
      ctx.strokeStyle = `rgba(${fg}, 0.04)`;
      ctx.stroke();

      if (!isDragging && autoRotate) {
        rotY += targetVelY;
        rotX += targetVelX * 0.45;
      }
      pulseTick += 0.014;

      // Project 3D points
      projectedPoints.length = 0;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      nodes3D.forEach((node, idx) => {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;
        const y1 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;

        const fov = 360 * zoomScale;
        const scale = fov / (fov + z2 + 210);
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;
        const inCluster = clusterFilter === 'ALL' || node.cluster === clusterFilter;

        projectedPoints.push({ node, idx, px, py, pz: z2, scale, inCluster });
      });

      // Draw 3D Poly-Mesh Wireframe Core at center
      const polyRings = polyLevel * 3;
      const coreRadius = 42 * zoomScale;
      ctx.strokeStyle = `rgba(${fg}, 0.12)`;
      ctx.lineWidth = 0.75;
      for (let i = 0; i < polyRings; i++) {
        const angle = (i / polyRings) * Math.PI + rotY * 0.8;
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          coreRadius,
          Math.max(4, Math.abs(coreRadius * Math.cos(angle))),
          rotX * 0.5,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Draw Constellation Connections + Animated Signal Packets
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        p1.node.connections.forEach((targetIdx) => {
          const p2 = projectedPoints[targetIdx];
          if (!p2 || targetIdx < i) return;

          const bothActive = p1.inCluster && p2.inCluster;
          const isSelectedEdge =
            p1.idx === selectedNodeIdx ||
            p2.idx === selectedNodeIdx ||
            (hoveredNode && (p1.node.id === hoveredNode.id || p2.node.id === hoveredNode.id));

          const avgScale = (p1.scale + p2.scale) / 2;
          const alpha = isSelectedEdge
            ? 0.65
            : bothActive
            ? Math.max(0.08, (avgScale - 0.45) * 0.48)
            : 0.04;

          ctx.strokeStyle = `rgba(${fg}, ${alpha})`;
          ctx.lineWidth = isSelectedEdge ? 1.5 : polyLevel >= 3 ? 1.1 : 0.75;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();

          if (bothActive || isSelectedEdge) {
            const tPos = (pulseTick + (i * 0.19 + targetIdx * 0.11)) % 1;
            const sx = p1.px + (p2.px - p1.px) * tPos;
            const sy = p1.py + (p2.py - p1.py) * tPos;
            ctx.beginPath();
            ctx.arc(sx, sy, isSelectedEdge ? 2.4 : 1.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${fg}, ${isSelectedEdge ? 0.95 : 0.55})`;
            ctx.fill();
          }
        });
      }

      // Sort back-to-front for nodes and avoid overlapping text labels
      const sorted = [...projectedPoints].sort((a, b) => b.pz - a.pz);
      const placedLabelBoxes: Array<{ x: number; y: number; w: number; h: number }> = [];

      for (const p of sorted) {
        const isHovered = hoveredNode?.id === p.node.id;
        const isSelected = p.idx === selectedNodeIdx;
        const isHighlighted = isHovered || isSelected;
        const baseAlpha = p.inCluster
          ? Math.min(1, Math.max(0.28, (p.scale - 0.35) * 1.45))
          : 0.14;
        const nodeRadius = isHighlighted ? 7 : Math.max(3, 4.8 * p.scale);

        if (isHighlighted) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, 14, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${fg}, 0.85)`;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.px, p.py, 20, pulseTick * 2, pulseTick * 2 + Math.PI * 1.3);
          ctx.strokeStyle = `rgba(${fg}, 0.4)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.px, p.py, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fg}, ${isHighlighted ? 1 : baseAlpha})`;
        ctx.fill();

        // Only draw text labels for front-facing nodes or highlighted node, with collision guard
        const isFrontFacing = p.pz < 20 || clusterFilter !== 'ALL';
        if ((p.inCluster && isFrontFacing) || isHighlighted) {
          const text = isHi ? p.node.labelHi : p.node.label;
          const approxW = text.length * 5.8;
          const lx = p.px + 9;
          const ly = p.py + 3.5;

          const collides =
            !isHighlighted &&
            placedLabelBoxes.some(
              (box) =>
                Math.abs(lx - box.x) < (approxW + box.w) * 0.45 && Math.abs(ly - box.y) < 13
            );

          if (!collides) {
            ctx.font = `${isHighlighted ? '700 11px' : '500 10px'} "Plus Jakarta Sans", sans-serif`;
            ctx.fillStyle = `rgba(${fg}, ${isHighlighted ? 1 : baseAlpha * 0.92})`;
            ctx.fillText(text, lx, ly);
            placedLabelBoxes.push({ x: lx, y: ly, w: approxW, h: 12 });
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('click', onClick);
    };
  }, [useStaticFallback, nodes3D, polyLevel, zoomScale, autoRotate, clusterFilter, selectedNodeIdx, hoveredNode, isHi]);

  const streams = ['All', 'PCM', 'PCB', 'Commerce', 'Arts', 'Any'];

  // Pure-Code Natural Language Query Detection
  const parsedIntent = useMemo(() => {
    if (filters.query.trim().length < 3) return null;
    return parseNaturalCareerQuery(filters.query);
  }, [filters.query]);

  // UPGRADE 2 (Fuzzy Search Scoring Algorithm): Instant Search Dropdown Matches (Top 6 sorted by fuzzy score)
  const instantSearchMatches = useMemo(() => {
    const q = filters.query.trim();
    if (q.length < 2) return [];
    return Object.values(data.children || {})
      .map((ch) => ({ career: ch, score: scoreCareerFuzzyMatch(ch, q) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.career);
  }, [data.children, filters.query]);

  const handleApplySmartIntent = () => {
    if (!parsedIntent) return;
    let detectedCategory = filters.category;
    if (parsedIntent.talents?.includes('coding')) detectedCategory = 'engineering';
    else if (parsedIntent.talents?.includes('healthcare')) detectedCategory = 'medical';
    else if (parsedIntent.talents?.includes('finance')) detectedCategory = 'commerce';
    else if (parsedIntent.talents?.includes('law-governance')) detectedCategory = 'government';
    else if (parsedIntent.talents?.includes('design')) detectedCategory = 'design';

    onFilterChange({
      ...filters,
      query: '',
      stream: parsedIntent.stream || filters.stream,
      category: detectedCategory,
    });
  };

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] pt-4 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Clean Editorial Kicker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--border)] text-xs text-[var(--text2)]">
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="font-bold text-[var(--text)]">
              {isHi
                ? 'कक्षा 10 · कक्षा 12 · ग्रेजुएशन करियर पोर्टल'
                : 'Class 10 · Class 12 · Graduation Career Discovery Portal'}
            </span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">
              {totalCareersCount}+ {isHi ? 'सत्यापित रोडमैप' : 'Verified Career Blueprints'}
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--text2)]">
            {isHi ? '100% निःशुल्क · बिना विज्ञापन · बिना पेवॉल' : '100% Free · Zero Ads · Zero Paywall'}
          </div>
        </div>

        {/* Main 12-Column Asymmetric Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 7 Columns: Editorial Typography + Search + Live Path Architect */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-extrabold tracking-tight leading-[1.06] text-[var(--text)] text-balance">
                {isHi ? (
                  <>
                    अपने करियर का निर्माण करें।{' '}
                    <span className="underline decoration-2 underline-offset-8">
                      पूरी स्पष्टता के साथ।
                    </span>
                  </>
                ) : (
                  <>
                    Architect Your Future.{' '}
                    <span className="underline decoration-2 underline-offset-8">
                      With Absolute Clarity.
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm text-[var(--text2)] max-w-2xl leading-relaxed">
                {isHi
                  ? `${totalCareersCount}+ करियर रास्तों का वास्तविक डेटा: प्रवेश परीक्षाएं, सरकारी बनाम प्राइवेट कॉलेज फीस, वास्तविक इन-हैंड वेतन, रणनीतिक सुरक्षा कवच (Multi-Track Career Insurance) और माता-पिता के साथ साझा करने योग्य तुलना।`
                  : `Explore ${totalCareersCount}+ structured career blueprints engineered for Indian students. Real entrance cutoffs, Government vs Private ROI, skill radar charts, Strategic Safety Nets (Multi-Track Career Insurance), and instant parent-shareable comparisons.`}
              </p>
            </div>

            {/* Instant Search & Filter Console */}
            <div className="p-3.5 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] space-y-2.5">
              {/* UPGRADE: Last 3 User Search Queries stored in localStorage displayed as Quick-Access Chips above the Search Bar */}
              {filters.recentQueries && filters.recentQueries.length > 0 && (
                <div
                  data-testid="recent-search-chips"
                  className="flex flex-wrap items-center gap-1.5 pb-1"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mr-1">
                    {isHi ? 'हाल की खोजें (Recent):' : 'Recent Searches:'}
                  </span>
                  {filters.recentQueries.slice(0, 3).map((rq) => (
                    <button
                      key={rq}
                      type="button"
                      data-testid={`recent-query-chip-${rq}`}
                      onClick={() => {
                        onFilterChange({ ...filters, query: rq });
                        onCommitSearchQuery?.(rq);
                      }}
                      className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        filters.query.toLowerCase() === rq.toLowerCase()
                          ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                          : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border2)] hover:border-[var(--text)]'
                      }`}
                    >
                      <Search className="w-3 h-3 opacity-70" />
                      <span>{rq}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-row gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-[var(--text3)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={filters.query}
                    onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && filters.query.trim().length >= 2) {
                        onCommitSearchQuery?.(filters.query.trim());
                      }
                    }}
                    onBlur={() => {
                      if (filters.query.trim().length >= 2) {
                        onCommitSearchQuery?.(filters.query.trim());
                      }
                    }}
                    placeholder={
                      isHi
                        ? `${totalCareersCount}+ करियर, परीक्षा (JEE, NEET, CLAT, UPSC) या कौशल खोजें...`
                        : `Search ${totalCareersCount}+ careers, exams (JEE, NEET, UPSC, CLAT), or skills...`
                    }
                    aria-label="Search career portal"
                    className="w-full min-h-[48px] pl-10 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] placeholder:text-[var(--text3)] focus:border-[var(--text)] outline-none transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters((prev) => !prev)}
                  aria-expanded={showAdvancedFilters}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    showAdvancedFilters
                      ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                      : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:border-[var(--text)]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isHi ? 'फिल्टर' : 'Filters'}</span>
                </button>
              </div>

              {/* Instant Live Search Results Dropdown */}
              {instantSearchMatches.length > 0 && (
                <div className="p-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] space-y-1 animate-fadeIn">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono text-[var(--text3)]">
                    <span>
                      {isHi ? 'त्वरित खोज परिणाम' : 'INSTANT CAREER MATCHES'} ({resultCount})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById('careers-directory-section')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }
                      className="text-[var(--text)] font-bold hover:underline cursor-pointer"
                    >
                      {isHi ? 'सभी परिणाम देखें ↓' : 'View All Below ↓'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {instantSearchMatches.map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => onSelectCareerId(ch.id)}
                        className="min-h-[48px] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--text)] text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[var(--text)] truncate">
                            {getFormalDesignation(ch, lang)}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--text2)] capitalize truncate">
                            {ch.category} · {ch.salaryInr?.entry?.split('(')[0]?.trim() || '₹8–15 LPA'}
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text2)] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pure-Code Natural Language Intent Banner */}
              {parsedIntent && parsedIntent.detectedKeywords.length > 0 && (
                <div className="p-2.5 rounded-xl border border-[var(--text)] bg-[var(--bg)] flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--text)] shrink-0" />
                    <span className="font-mono text-[var(--text2)]">
                      {isHi ? 'स्मार्ट कोड विश्लेषण:' : 'Pure-Code Intent Detected:'}{' '}
                      <strong className="text-[var(--text)]">
                        {parsedIntent.detectedKeywords.join(' · ')}
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplySmartIntent}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] text-[11px] font-mono font-bold hover:opacity-90 cursor-pointer whitespace-nowrap"
                  >
                    {isHi ? 'स्मार्ट फिल्टर लागू करें →' : 'Apply Smart Filter →'}
                  </button>
                </div>
              )}

              {/* Stream Filter Buttons + Result Count */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[var(--text3)] mr-1">
                    {isHi ? 'स्ट्रीम:' : 'Stream:'}
                  </span>
                  {streams.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, stream: st })}
                      className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                        filters.stream === st
                          ? 'bg-[var(--text)] text-[var(--bg)] font-bold'
                          : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-mono text-[var(--text2)] tabular-nums">
                  {resultCount} {isHi ? 'परिणाम' : 'matches'}
                </div>
              </div>

              {/* Expandable Advanced Portal Filters */}
              {showAdvancedFilters && (
                <div className="pt-3 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label
                      htmlFor="hero-domain-select"
                      className="block text-[10px] font-mono uppercase text-[var(--text3)] mb-1"
                    >
                      {isHi ? 'कैटेगरी' : 'Domain Category'}
                    </label>
                    <select
                      id="hero-domain-select"
                      value={filters.category}
                      onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                      className="w-full min-h-[40px] px-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                    >
                      <option value="All">{isHi ? 'सभी कैटेगरी' : 'All Categories'}</option>
                      {data.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {t(c, 'label', lang)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="hero-sort-select"
                      className="block text-[10px] font-mono uppercase text-[var(--text3)] mb-1"
                    >
                      {isHi ? 'क्रमबद्ध करें' : 'Sort By'}
                    </label>
                    <select
                      id="hero-sort-select"
                      value={filters.sortBy}
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          sortBy: e.target.value as CareerSearchFilters['sortBy'],
                        })
                      }
                      className="w-full min-h-[40px] px-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                    >
                      <option value="relevance">{isHi ? 'प्रासंगिकता' : 'High Relevance'}</option>
                      <option value="salary-high">{isHi ? 'उच्च शुरुआती वेतन' : 'Highest Entry Salary'}</option>
                      <option value="alphabetical">{isHi ? 'नाम (A-Z)' : 'Alphabetical (A–Z)'}</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          query: '',
                          category: 'All',
                          stream: 'All',
                          audience: 'All',
                          minSalaryLakhs: 0,
                          sortBy: 'relevance',
                        })
                      }
                      className="w-full min-h-[40px] px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text2)] hover:text-[var(--text)] flex items-center justify-center gap-1.5 font-mono cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isHi ? 'रीसेट करें' : 'Reset All'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Path Architect (Stream × Priority Matrix) */}
            <div className="p-3.5 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[var(--text)] shrink-0" />
                  <span className="text-xs font-bold text-[var(--text)]">
                    {isHi
                      ? 'इंटरैक्टिव पाथ आर्किटेक्ट · अपनी स्ट्रीम और लक्ष्य चुनें'
                      : 'Interactive Path Architect · Select Your Stage & Priority'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[var(--text3)] hidden sm:inline">
                  {isHi ? '3D मेश के साथ सिंक' : 'Synced with 3D Constellation'}
                </span>
              </div>

              {/* Row 1: Stream Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-[var(--text3)] mr-1">
                  {isHi ? '01. स्ट्रीम:' : '01. Stage:'}
                </span>
                {(
                  [
                    { id: 'PCM', label: '12th PCM' },
                    { id: 'PCB', label: '12th PCB' },
                    { id: 'Commerce', label: 'Commerce' },
                    { id: 'Arts', label: 'Arts / Humanities' },
                    { id: 'Class10', label: 'Class 10 / Diploma' },
                  ] as { id: ArchitectStream; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectArchStream(item.id)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      archStream === item.id
                        ? 'bg-[var(--text)] text-[var(--bg)] font-bold'
                        : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--text)] hover:text-[var(--text)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Row 2: Ambition Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-[var(--text3)] mr-1">
                  {isHi ? '02. लक्ष्य:' : '02. Priority:'}
                </span>
                {(
                  [
                    { id: 'high-pay', label: isHi ? '₹20L+ पैकेज' : '₹20L+ High Package' },
                    { id: 'frontier-tech', label: isHi ? 'AI और भविष्य टेक' : 'AI & Frontier Tech' },
                    { id: 'govt-authority', label: isHi ? 'सरकारी / IAS / रक्षा' : 'Govt / IAS / Defense' },
                    { id: 'low-fee-roi', label: isHi ? 'कम फीस · उच्च ROI' : 'Low-Fee High-ROI' },
                    { id: 'clinical-bio', label: isHi ? 'मेडिकल और बायो' : 'Clinical & BioTech' },
                  ] as { id: ArchitectGoal; label: string }[]
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setArchGoal(g.id)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      archGoal === g.id
                        ? 'bg-[var(--text)] text-[var(--bg)] font-bold'
                        : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--text)] hover:text-[var(--text)]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Row 3: Instant 3-Card Live Blueprint Output */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
                {architectRecommendations.map(({ career, matchPct }, idx) => {
                  const kpis = computeCareerKPIs(career);
                  const entrySal =
                    career.salaryInr?.entry?.split('(')[0]?.trim() ||
                    career.roadmap?.[0]?.details?.salaryInr?.entry?.split('(')[0]?.trim() ||
                    (career.entrySalaryLakhs ? `₹${career.entrySalaryLakhs} LPA` : '₹8–15 LPA');
                  return (
                    <button
                      key={career.id}
                      type="button"
                      onClick={() => onSelectCareerId(career.id)}
                      className="p-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] hover:border-[var(--text)] transition-all cursor-pointer flex flex-col justify-between text-left group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-[var(--text2)] mb-0.5">
                          <span className="font-bold text-[var(--text)] tabular-nums">
                            0{idx + 1} · {matchPct}% Fit
                          </span>
                          <span className="tabular-nums">{kpis.averageGrowthYoY}</span>
                        </div>
                        <div className="font-extrabold text-xs text-[var(--text)] line-clamp-1 group-hover:underline">
                          {t(career, 'title', lang)}
                        </div>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono w-full">
                        <span className="font-bold text-[var(--text)] truncate tabular-nums">
                          {entrySal}
                        </span>
                        <span className="text-[var(--text2)] inline-flex items-center gap-0.5 font-bold">
                          <span>{isHi ? 'खोलें' : 'Open'}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary & Secondary Action CTAs (48px min height, 12px gap) */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenQuiz}
                className="min-h-[48px] px-4 py-2.5 rounded-xl font-bold text-xs bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span>{isHi ? '10-प्रश्न एप्टीट्यूड क्विज़' : '10-Question Aptitude Match'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenCollabStudio) onOpenCollabStudio();
                  else window.location.hash = '#/compare?c1=btech-cse&c2=bca-software';
                }}
                className="min-h-[48px] px-4 py-2.5 rounded-xl font-bold text-xs border border-[var(--text)] bg-[var(--bg2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <GitCompare className="w-4 h-4" />
                <span>{isHi ? 'करियर की तुलना करें (Compare)' : 'Compare 2 Careers (Parent Link)'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenAICounselor}
                className="min-h-[48px] px-4 py-2.5 rounded-xl font-mono font-semibold text-xs border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text2)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Cpu className="w-4 h-4" />
                <span>{isHi ? 'स्मार्ट ROI मैचर' : 'Smart ROI Matcher'}</span>
              </button>
            </div>
          </div>

          {/* Right 5 Columns: 3D Career Constellation Mesh (with UPGRADE 1 Static Fallback for Mobile / Reduced Motion) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] overflow-hidden flex-1 flex flex-col justify-between">
              {/* Top Mesh Header + Domain Cluster Filter Bar */}
              <div className="px-3.5 pt-3 pb-2.5 border-b border-[var(--border)] bg-[var(--bg)] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text2)]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[var(--text)]" />
                    <span className="font-bold text-[var(--text)]">
                      {useStaticFallback
                        ? isHi
                          ? 'स्टैटिक तारामंडल (बैटरी सेवर मोड)'
                          : 'Static Constellation (Battery Saver)'
                        : isHi
                        ? '3D करियर तारामंडल (18 नोड्स)'
                        : '3D Career Constellation (18 Nodes)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setUseStaticFallback((prev) => !prev)}
                      className="min-h-[32px] px-2 py-0.5 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                      title="Toggle between Static Image Fallback and 3D Mesh"
                    >
                      <Zap className="w-3 h-3" />
                      <span>{useStaticFallback ? 'STATIC' : '3D MESH'}</span>
                    </button>
                    {!useStaticFallback && (
                      <button
                        type="button"
                        onClick={() => setAutoRotate((prev) => !prev)}
                        className="min-h-[32px] px-2 py-0.5 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                        aria-label={autoRotate ? 'Pause 3D orbit' : 'Resume 3D orbit'}
                      >
                        {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{autoRotate ? 'ORBIT' : 'PAUSED'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCycleNode(-1)}
                      aria-label="Previous career node"
                      className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCycleNode(1)}
                      aria-label="Next career node"
                      className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Constellation Cluster Filter Tabs */}
                <div className="grid grid-cols-6 gap-1">
                  {(
                    [
                      { id: 'ALL', label: 'All (18)' },
                      { id: 'TECH', label: 'Tech & AI' },
                      { id: 'FIN_LAW', label: 'Fin & Law' },
                      { id: 'MED_BIO', label: 'Med & Bio' },
                      { id: 'GOVT', label: 'Govt & Def' },
                      { id: 'SCI_DES', label: 'Sci & UX' },
                    ] as { id: ClusterFilter; label: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setClusterFilter(tab.id)}
                      className={`min-h-[30px] px-1.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-colors cursor-pointer text-center truncate ${
                        clusterFilter === tab.id
                          ? 'bg-[var(--text)] text-[var(--bg)]'
                          : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPGRADE 1: Static Fallback for 3D Mesh on Mobile / Reduced Motion vs Interactive 3D Canvas */}
              <div className="relative h-[275px] sm:h-[295px] w-full select-none flex-1">
                {useStaticFallback ? (
                  <div
                    data-testid="hero-static-constellation-fallback"
                    className="w-full h-full flex items-center justify-center bg-[var(--bg2)] p-3"
                  >
                    <svg
                      viewBox="0 0 420 260"
                      className="w-full h-full max-h-[210px]"
                      role="img"
                      aria-label="Static high-efficiency career constellation map"
                    >
                      <circle cx="210" cy="110" r="85" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="3 3" />
                      <circle cx="210" cy="110" r="52" fill="none" stroke="currentColor" strokeOpacity="0.16" />
                      {nodes3D.slice(0, 10).map((n, idx) => {
                        const angle = (idx / 10) * Math.PI * 2 - Math.PI / 2;
                        const r = idx % 2 === 0 ? 78 : 48;
                        const nx = Number((210 + r * Math.cos(angle)).toFixed(1));
                        const ny = Number((108 + r * Math.sin(angle)).toFixed(1));
                        const isSel = idx === selectedNodeIdx;
                        return (
                          <g
                            key={n.id}
                            onClick={() => setSelectedNodeIdx(idx)}
                            className="cursor-pointer"
                          >
                            <line
                              x1={210}
                              y1={108}
                              x2={nx}
                              y2={ny}
                              stroke="currentColor"
                              strokeOpacity={isSel ? 0.65 : 0.18}
                              strokeWidth={isSel ? 1.5 : 1}
                            />
                            <circle
                              cx={nx}
                              cy={ny}
                              r={isSel ? 6 : 4}
                              fill="currentColor"
                            />
                            <text
                              x={nx + (nx >= 210 ? 8 : -8)}
                              y={ny + 3}
                              textAnchor={nx >= 210 ? 'start' : 'end'}
                              className="fill-[var(--text)] text-[9px] font-mono font-bold"
                            >
                              {isHi ? n.labelHi : n.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    data-testid="hero-constellation-canvas"
                    className="w-full h-full block"
                    aria-label="Interactive 3D career constellation graph"
                  />
                )}

                {/* Top-Left Instruction Line */}
                <div className="absolute top-2.5 left-3 pointer-events-none px-2.5 py-1 rounded-lg bg-[var(--bg)]/85 border border-[var(--border)] text-[10px] font-mono text-[var(--text2)]">
                  {useStaticFallback
                    ? isHi
                      ? '⚡ बैटरी सेवर स्टैटिक मोड · नोड पर टैप करें'
                      : '⚡ Static Battery-Saver Mode · Tap any node'
                    : isHi
                    ? 'घुमाने के लिए ड्रैग करें · विवरण के लिए नोड चुनें'
                    : 'Drag to orbit · Click any node to inspect'}
                </div>

                {/* Bottom Selected Node Telemetry HUD */}
                <div className="absolute bottom-2.5 left-3 right-3 p-3 rounded-xl border border-[var(--border2)] bg-[var(--bg)]/95 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text2)]">
                        <span className="font-bold text-[var(--text)]">{activeNode.category}</span>
                        <span>·</span>
                        <span>Stream: {activeNode.stream}</span>
                        <span>·</span>
                        <span>Exam: {activeNode.exam}</span>
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-[var(--text)] truncate mt-0.5">
                        {isHi ? activeNode.labelHi : activeNode.label}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectCareerId(activeNode.id)}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0 flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>{isHi ? 'रोडमैप खोलें' : 'Inspect'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-[var(--border)] text-[10px] font-mono">
                    <div>
                      <span className="text-[var(--text3)] block text-[9px]">Entry CTC</span>
                      <span className="font-bold text-[var(--text)] tabular-nums">
                        {activeNode.entryCtc}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text3)] block text-[9px]">5-Yr Growth</span>
                      <span className="font-bold text-[var(--text)] tabular-nums">
                        {activeNode.growth}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text3)] block text-[9px]">Linked Paths</span>
                      <span className="font-bold text-[var(--text)] tabular-nums">
                        {activeNode.connections.length} Connected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Dual Interactive Sliders: Zoom Scale & Poly-Mesh Density */}
              <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg)] grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="hero-zoom-slider" className="text-[var(--text2)] whitespace-nowrap">
                    {isHi ? 'ज़ूम:' : 'Zoom:'}
                  </label>
                  <input
                    id="hero-zoom-slider"
                    type="range"
                    min={0.85}
                    max={1.35}
                    step={0.05}
                    value={zoomScale}
                    onChange={(e) => setZoomScale(Number(e.target.value))}
                    aria-label="3D Constellation Zoom FOV"
                    className="w-20 accent-[var(--text)] cursor-pointer"
                  />
                  <span className="font-bold text-[var(--text)] tabular-nums w-8 text-right">
                    {zoomScale.toFixed(1)}x
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="hero-mesh-slider" className="text-[var(--text2)] whitespace-nowrap">
                    {isHi ? 'मेश घनत्व:' : 'Mesh:'}
                  </label>
                  <input
                    id="hero-mesh-slider"
                    type="range"
                    min={1}
                    max={4}
                    step={1}
                    value={polyLevel}
                    onChange={(e) => setPolyLevel(Number(e.target.value))}
                    aria-label="Mesh subdivision density"
                    className="w-20 accent-[var(--text)] cursor-pointer"
                  />
                  <span className="font-bold text-[var(--text)] tabular-nums w-6 text-right">
                    {polyLevel}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Dynamic, Animated Value Proposition Visualizer Strip Below Hero Split */}
        <div
          data-testid="hero-value-prop-showcase"
          className="mt-5 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-4 sm:p-5 transition-all"
        >
          {/* Top Selector Tabs for the 4 Core Value Propositions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {VALUE_PROPOSITION_PILLARS.map((pillar, idx) => {
                const isActive = idx === activeVpIdx;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => {
                      setActiveVpIdx(idx);
                      setVpAutoPlay(false);
                    }}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                      isActive
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'bg-[var(--bg)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--text)]'
                    }`}
                  >
                    <span>{pillar.index}.</span>
                    <span>{isHi ? pillar.labelHi : pillar.labelEn}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setVpAutoPlay((prev) => !prev)}
              aria-label={vpAutoPlay ? 'Pause value proposition showcase' : 'Play value proposition showcase'}
              className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[11px] font-mono text-[var(--text2)] hover:text-[var(--text)] inline-flex items-center gap-1.5 self-start sm:self-center cursor-pointer shrink-0"
            >
              {vpAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{vpAutoPlay ? (isHi ? 'ऑटो-प्ले सक्रिय' : 'Auto-Cycling') : isHi ? 'रुका हुआ' : 'Paused'}</span>
            </button>
          </div>

          {/* Animated Active Value Proposition Stage */}
          <div key={currentVp.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono text-[var(--text3)]">
                {isHi
                  ? `मुख्य विशेषता ${currentVp.index} / 04`
                  : `Core Value Proposition ${currentVp.index} of 04`}
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--text)] text-balance">
                {isHi ? currentVp.headlineHi : currentVp.headlineEn}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                {isHi ? currentVp.descHi : currentVp.descEn}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleVpAction(currentVp.id)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-bold inline-flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span>{isHi ? currentVp.ctaLabelHi : currentVp.ctaLabelEn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right 7 Cols: Dynamic Animated Telemetry Bars for the Active Value Proposition */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentVp.metrics.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[var(--text3)] mb-1">
                      <span>0{mIdx + 1}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text)]" />
                    </div>
                    <div className="text-xs font-bold text-[var(--text)] leading-snug">
                      {isHi ? m.titleHi : m.titleEn}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                    <div className="text-xs font-mono font-extrabold text-[var(--text)] tabular-nums">
                      {isHi ? m.valueHi : m.valueEn}
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--bg2)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--text)] rounded-full transition-all duration-500"
                        style={{ width: `${m.barPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
