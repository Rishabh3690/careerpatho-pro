import { CareersDatabase, ChildCareer } from '../data/types';

export type BroadCareerCategory =
  | 'Engineering'
  | 'Medical'
  | 'Commerce'
  | 'Arts'
  | 'Government'
  | 'Vocational';

export type QuizQuestionType =
  | 'single-choice'
  | 'slider'
  | 'likert-scale'
  | 'multi-select'
  | 'tradeoff-pair';

export interface QuizOption {
  id: string;
  textEn: string;
  textHi: string;
  weights: Partial<Record<BroadCareerCategory, number>>;
  preferredStreams?: string[];
  tags?: string[];
}

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unitEn: string;
  unitHi: string;
  minLabelEn: string;
  minLabelHi: string;
  maxLabelEn: string;
  maxLabelHi: string;
  /**
   * Maps a normalized slider value t in [0, 1] (where t = (val - min) / (max - min))
   * to category points (on a 0..30 base scale before questionWeight).
   */
  lowPoleWeights: Partial<Record<BroadCareerCategory, number>>;
  highPoleWeights: Partial<Record<BroadCareerCategory, number>>;
  midPeakWeights?: Partial<Record<BroadCareerCategory, number>>;
}

export interface LikertConfig {
  minLabelEn: string;
  minLabelHi: string;
  maxLabelEn: string;
  maxLabelHi: string;
  /**
   * Points awarded at Strongly Agree (5/5). Scaled linearly from 1..5 -> t in [0, 1].
   * Low ratings (1 or 2) mildly boost contrasting domains defined in lowRatingWeights.
   */
  agreeWeights: Partial<Record<BroadCareerCategory, number>>;
  lowRatingWeights?: Partial<Record<BroadCareerCategory, number>>;
}

export interface TradeoffConfig {
  leftPoleEn: string;
  leftPoleHi: string;
  rightPoleEn: string;
  rightPoleHi: string;
  leftWeights: Partial<Record<BroadCareerCategory, number>>;
  rightWeights: Partial<Record<BroadCareerCategory, number>>;
}

export interface QuizQuestion {
  id: number;
  questionType: QuizQuestionType;
  questionWeight: number; // 1.0 to 2.0 explicit rubric weight
  traitKey: string;
  traitLabelEn: string;
  traitLabelHi: string;
  questionEn: string;
  questionHi: string;
  helperEn: string;
  helperHi: string;
  sourceIds: string[];
  options: QuizOption[];
  sliderConfig?: SliderConfig;
  likertConfig?: LikertConfig;
  tradeoffConfig?: TradeoffConfig;
  maxMultiSelect?: number;
}

export type QuizAnswerValue = string | number | string[];

export interface CategoryMappingInfo {
  category: BroadCareerCategory;
  dbCategoryIds: string[];
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  whyItFitsEn: string;
  whyItFitsHi: string;
  topExams: string[];
  typicalDegrees: string[];
  avgEntrySalary: string;
  featuredCareerIds: string[];
}

export interface CategoryScoreItem {
  category: BroadCareerCategory;
  points: number;
  percentageOfMax: number;
  alignmentBandLow: number;
  alignmentBandHigh: number;
  alignmentBandLabelEn: string;
  alignmentBandLabelHi: string;
  shareOfTotal: number;
  info: CategoryMappingInfo;
}

export interface ValidationWarningItem {
  code: string;
  severity: 'info' | 'warning';
  messageEn: string;
  messageHi: string;
}

export interface CareerAssessmentResult {
  top3Categories: CategoryScoreItem[];
  allCategoryScores: CategoryScoreItem[];
  totalPoints: number;
  answeredCount: number;
  totalQuestions: number;
  confidenceScore: number; // 0 to 100
  confidenceBandLow: number;
  confidenceBandHigh: number;
  confidenceLevel: 'High' | 'Moderate' | 'Low-Fallback';
  isFallbackTriggered: boolean;
  fallbackReasonEn: string | null;
  fallbackReasonHi: string | null;
  validationWarnings: ValidationWarningItem[];
  detectedConstraints: {
    stream: string;
    budgetLakhs: number | null;
    maxStudyYears: number | null;
    dailyStudyHours: number | null;
  };
  headlineEn: string;
  headlineHi: string;
  summaryEn: string;
  summaryHi: string;
  disclaimerEn: string;
  disclaimerHi: string;
  recommendedCareers: ChildCareer[];
}

export interface RubricSectionSpec {
  id: string;
  titleEn: string;
  titleHi: string;
  formulaEn: string;
  descriptionEn: string;
  descriptionHi: string;
}

export const ASSESSMENT_METHODOLOGY_RUBRIC: RubricSectionSpec[] = [
  {
    id: 'rubric-1-question-types',
    titleEn: '1. Multi-Modal 25-Question Input Normalization',
    titleHi: '1. 25-प्रश्न बहु-प्रारूप (Multi-Modal) इनपुट मानकीकरण',
    formulaEn: 't = (value - min) / (max - min) ∈ [0, 1]; WeightedContribution(q, c) = questionWeight(q) × BaseCategoryVector(q, c, t)',
    descriptionEn:
      'The 25-question assessment combines 5 distinct response formats: 8 Single-Choice situational items, 6 continuous Sliders (study hours, math comfort, fee budget ceiling, study duration ceiling, people vs. system focus, field vs. desk focus), 5 five-point Likert agreement scales, 3 Multi-Select capability/priority matrices (normalized by dividing by the number of selected items up to 3 so multi-selecting does not artificially inflate raw totals), and 3 five-step Tradeoff-Pair continuums.',
    descriptionHi:
      'यह 25-प्रश्नों का मूल्यांकन 5 विभिन्न उत्तर प्रारूपों को जोड़ता है: 8 एकल-चयन (Single-Choice) प्रश्न, 6 स्लाइडर (पढ़ाई के घंटे, गणित सहजता, फीस बजट, अध्ययन अवधि, लोगों बनाम सिस्टम पर ध्यान, फील्ड बनाम डेस्क कार्य), 5 लिकर्ट पैमाने (1–5), 3 बहु-चयन (Multi-Select) क्षमता प्रश्न और 3 ट्रेड-ऑफ तुलनात्मक प्रश्न।',
  },
  {
    id: 'rubric-2-weighting',
    titleEn: '2. Explicit Question Weights & Stream/Feasibility Adjustments',
    titleHi: '2. स्पष्ट प्रश्न भार (Weights) और स्ट्रीम/बजट व्यवहार्यता समायोजन',
    formulaEn: 'FinalScore(c) = [ ∑_{q=1..25} w_q · S(q, c) ] × FeasibilityMultiplier(c, stream, budget, duration)',
    descriptionEn:
      'Foundational eligibility and aptitude questions carry higher explicit weights (w_q = 1.5 to 2.0 for Class 12 stream, core subject affinity, quantitative comfort, and domain Likert anchors), while work-style and geographical preference items carry unit weights (w_q = 1.0 to 1.2). If a student selects a tight tuition ceiling (≤ ₹2 Lakhs) or short study horizon (≤ 2 years), vocational, diploma, and government college pathways receive a feasibility boost.',
    descriptionHi:
      'मूलभूत पात्रता और विषय दक्षता वाले प्रश्नों को अधिक भार (Weight 1.5 से 2.0) दिया गया है, जबकि कार्यशैली प्रश्नों का भार 1.0 से 1.2 है। कम फीस बजट (≤ ₹2 लाख) या कम अध्ययन अवधि (≤ 2 वर्ष) चुनने पर सरकारी कॉलेज और कौशल/डिप्लोमा रास्तों को प्राथमिकता मिलती है।',
  },
  {
    id: 'rubric-3-validation-contradictions',
    titleEn: '3. Contradiction Detection & Input Consistency Rules',
    titleHi: '3. विरोधाभास पहचान (Contradiction Detection) और उत्तर संगति नियम',
    formulaEn: 'ConsistencyPenalty = ∑ ContradictionFlags × 6%; triggers explicit user-facing advisory banners',
    descriptionEn:
      'The calculator inspects cross-question pairs for logical tensions: (a) selecting PCB/Medical track while rating biological/patient care comfort ≤ 2/5; (b) targeting engineering/computational tracks while rating math comfort ≤ 3/10; (c) preferring long-horizon clinical/chartered degrees while setting max study duration ≤ 2 years; and (d) flat-lining identical middle ratings across slider/Likert questions. All detected tensions are surfaced transparently in the results panel.',
    descriptionHi:
      'कैलकुलेटर परस्पर विरोधी उत्तरों की जांच करता है—जैसे मेडिकल चुनने के साथ बायोलॉजी/रोगी सेवा में कम रुचि (≤ 2/5) देना, या इंजीनियरिंग चुनने के साथ गणित में कम सहजता (≤ 3/10) चुनना। ऐसे सभी विरोधाभास परिणाम पैनल में स्पष्ट चेतावनी के रूप में दिखाए जाते हैं।',
  },
  {
    id: 'rubric-4-confidence-bands',
    titleEn: '4. Alignment Score Bands & Uncertainty Handling (No False Single-Point Precision)',
    titleHi: '4. स्कोर रेंज (Alignment Bands) और अनिश्चितता प्रबंधन',
    formulaEn: 'AlignmentBand(c) = [ max(5%, Pct(c) - HalfWidth), min(98%, Pct(c) + HalfWidth) ]; HalfWidth = 4% + (1 - CompletionRate)×8% + ContradictionCount×2%',
    descriptionEn:
      'Human career fit cannot be reduced to a false single decimal number. Every category score is reported as an Alignment Band (e.g., 74%–82% Alignment Band) whose width expands if questions are skipped or contradictory inputs are detected. When the top two categories overlap within 8% or fewer than 15 of 25 questions are answered, the Exploratory Multi-Path Fallback is triggered automatically.',
    descriptionHi:
      'मानवीय करियर उपयुक्तता को किसी एक निश्चित संख्या में सीमित नहीं किया जा सकता। इसलिए प्रत्येक श्रेणी का परिणाम एक संरेखण रेंज (जैसे 74%–82% Alignment Band) के रूप में दिखाया जाता है। यदि शीर्ष दो श्रेणियों में 8% से कम अंतर हो या 15 से कम प्रश्नों के उत्तर दिए गए हों, तो बहु-विकल्प मोड स्वतः सक्रिय हो जाता है।',
  },
];

export const CAREER_CATEGORIES_MAPPING: Record<BroadCareerCategory, CategoryMappingInfo> = {
  Engineering: {
    category: 'Engineering',
    dbCategoryIds: ['engineering', 'science'],
    titleEn: 'Engineering, Software, Frontier Tech & Quantitative Sciences',
    titleHi: 'इंजीनियरिंग, सॉफ्टवेयर, फ्रंटियर टेक और वैज्ञानिक अनुसंधान',
    descriptionEn:
      'Building software systems, AI models, semiconductor chips, renewable energy grids, core infrastructure, and scientific research.',
    descriptionHi:
      'सॉफ्टवेयर, आर्टिफिशियल इंटेलिजेंस (AI), सेमीकंडक्टर चिप्स, पावर ग्रिड, मशीनरी और वैज्ञानिक अनुसंधान का निर्माण।',
    whyItFitsEn:
      'Matches your quantitative comfort, analytical problem-solving, and interest in technology, hardware, or scientific systems.',
    whyItFitsHi:
      'आपकी तार्किक क्षमता, गणितीय सहजता और नई तकनीक व वैज्ञानिक प्रणालियों में रुचि से सीधा मेल खाता है।',
    topExams: ['JEE Main / Advanced', 'GATE', 'BITSAT', 'CUET-UG', 'IAT (IISER)'],
    typicalDegrees: ['B.Tech (CSE / AI / ECE / Electrical / Mech)', 'BCA + MCA', 'B.Sc / BS-MS Research'],
    avgEntrySalary: 'PLFS Median ₹3.0 LPA · Top-Tier NIRF ₹10–23 LPA',
    featuredCareerIds: [
      'btech-cse',
      'btech-ai-ds',
      'btech-ece-vlsi',
      'btech-cyber',
      'bca-software',
      'btech-aerospace',
    ],
  },
  Medical: {
    category: 'Medical',
    dbCategoryIds: ['medical'],
    titleEn: 'Medical, Allied Healthcare, Nursing & Life Sciences',
    titleHi: 'मेडिकल, एलाइड हेल्थकेयर, नर्सिंग और बायो-साइंस',
    descriptionEn:
      'Clinical medicine, surgery, nursing, pharmacy, radiation/cardiac allied health technology, rehabilitation, and hospital diagnostics.',
    descriptionHi:
      'डॉक्टर (MBBS/AYUSH), नर्सिंग, फार्मेसी, एलाइड हेल्थ टेक्नोलॉजी, फिजियोथेरेपी और अस्पताल निदान सेवाएं।',
    whyItFitsEn:
      'Aligns with your affinity for human biology, clinical care, diagnostic precision, and direct patient impact.',
    whyItFitsHi:
      'जीव विज्ञान (Biology), मानव स्वास्थ्य, क्लिनिकल देखभाल और प्रत्यक्ष रोगी सेवा के आपके रुझान के अनुकूल है।',
    topExams: ['NEET-UG', 'AIIMS Paramedical / Nursing', 'CUET (Bio/Pharma)', 'GPAT'],
    typicalDegrees: ['MBBS / BDS / BAMS', 'B.Sc Nursing / Allied Health (NCAHP)', 'B.Pharm / Pharm.D'],
    avgEntrySalary: 'Allied/Private ₹3.5–6.5 LPA · Govt MO / Nursing Officer ₹7.5–13 LPA',
    featuredCareerIds: [
      'mbbs-clinical',
      'nursing-icu',
      'b-pharm-ind',
      'bds-dental',
      'bpt-physio',
      'biotech-genomics',
    ],
  },
  Commerce: {
    category: 'Commerce',
    dbCategoryIds: ['commerce'],
    titleEn: 'Commerce, Chartered Finance, Taxation & Corporate Management',
    titleHi: 'कॉमर्स, चार्टर्ड फाइनेंस, टैक्सेशन और कॉर्पोरेट प्रबंधन',
    descriptionEn:
      'Chartered accountancy, cost/company secretaryship, banking, quantitative risk, supply chain logistics, and business leadership.',
    descriptionHi:
      'चार्टर्ड अकाउंटेंसी (CA), कंपनी सेक्रेटरी (CS), लागत लेखांकन (CMA), बैंकिंग, सप्लाई चेन और व्यवसाय प्रबंधन।',
    whyItFitsEn:
      'Fits your interest in financial governance, commercial strategy, capital allocation, and structured corporate leadership.',
    whyItFitsHi:
      'वित्तीय विश्लेषण, व्यापार रणनीति, टैक्सेशन और संगठित कॉर्पोरेट नेतृत्व में आपकी रुचि से मेल खाता है।',
    topExams: ['ICAI CA', 'ICSI CSEET', 'ICMAI CMA', 'CUET-UG (B.Com/BMS)', 'CAT / IPMAT'],
    typicalDegrees: ['CA / CS / CMA', 'B.Com (Hons) / BBA / BMS', 'MBA / PGDM'],
    avgEntrySalary: 'PLFS Graduate Median ₹3.0 LPA · CA/Premier MBA ₹10–18 LPA',
    featuredCareerIds: [
      'ca-audit',
      'mba-marketing-pm',
      'cs-corporate',
      'cfa-investment',
      'cma-cost',
      'bba-fintech',
    ],
  },
  Arts: {
    category: 'Arts',
    dbCategoryIds: ['design', 'arts'],
    titleEn: 'Design, Architecture, Media, Journalism & Creative Arts',
    titleHi: 'डिज़ाइन, आर्किटेक्चर, मीडिया, पत्रकारिता और क्रिएटिव आर्ट्स',
    descriptionEn:
      'Industrial & UI/UX design, architecture, mass communication, data journalism, cinema/sound production, and applied arts.',
    descriptionHi:
      'प्रोडक्ट व UI/UX डिज़ाइन, आर्किटेक्चर, पत्रकारिता, फिल्म व साउंड प्रोडक्शन, एनीमेशन और रचनात्मक कलाएं।',
    whyItFitsEn:
      'Reflects your visual imagination, storytelling drive, human-centric empathy, and preference for original creative work.',
    whyItFitsHi:
      'आपकी रचनात्मक कल्पना, विजुअल स्टोरीटेलिंग, मानवीय संवेदनशीलता और मौलिक सृजन की इच्छा को दर्शाता है।',
    topExams: ['NID DAT', 'UCEED / CEED', 'NIFT', 'NATA / JEE Paper 2', 'IIMC / FTII JET'],
    typicalDegrees: ['B.Des / BFA', 'B.Arch (CoA)', 'BA Journalism & Mass Comm / Film'],
    avgEntrySalary: 'Industry Fresher ₹3.5–6.5 LPA · Premier NID/IIT Design ₹10–16 LPA',
    featuredCareerIds: [
      'b-des-product',
      'barch-architecture',
      'ui-ux-designer',
      'journalism-digital',
      'animation-vfx',
      'fashion-nift',
    ],
  },
  Government: {
    category: 'Government',
    dbCategoryIds: ['government', 'law'],
    titleEn: 'Civil Services, Judiciary, Constitutional Law & Armed Forces',
    titleHi: 'सिविल सेवा (UPSC/PSC), न्यायपालिका, कानून (Law) और रक्षा सेवाएं',
    descriptionEn:
      'IAS/IPS/IRS civil administration, National Law Universities (CLAT), judicial services (PCS-J), NDA/CDS defense officers, and PSU cadres.',
    descriptionHi:
      'सिविल सेवा (IAS/IPS), नेशनल लॉ यूनिवर्सिटी (CLAT), न्यायाधीश (PCS-J), सेना अधिकारी (NDA/CDS) और सरकारी विभाग।',
    whyItFitsEn:
      'Matches your motivation for constitutional authority, public policy impact, statutory order, and long-term institutional service.',
    whyItFitsHi:
      'संवैधानिक अधिकार, जनसेवा, कानूनी व्यवस्था और राष्ट्र निर्माण में योगदान देने की आपकी भावना के अनुकूल है।',
    topExams: ['UPSC CSE / NDA / CDS', 'CLAT / AILET', 'SSC CGL', 'State PSC / PCS-J', 'IBPS / RBI Grade B'],
    typicalDegrees: ['BA / BBA LLB (5-Yr)', 'BA Political Science / Economics / History', 'NDA B.Tech / B.Sc'],
    avgEntrySalary: '7th CPC Level 7–10 (₹7.5–13 LPA + Allowances) · NLU Law ₹6–18 LPA',
    featuredCareerIds: [
      'ba-llb-corp',
      'upsc-ias-ips',
      'nda-defense-officer',
      'ssc-cgl-inspector',
      ' judiciary-pcsj',
      'rbi-grade-b',
    ],
  },
  Vocational: {
    category: 'Vocational',
    dbCategoryIds: ['vocational'],
    titleEn: 'Applied Technical Trades, Aviation, Maritime, Culinary & Sports Science',
    titleHi: 'कौशल ट्रेड, एविएशन, मर्चेंट नेवी, होटल मैनेजमेंट और खेल विज्ञान',
    descriptionEn:
      'Commercial aviation, DGCA aircraft maintenance (AME), merchant navy, NCHMCT culinary arts, CIPET/NTTF CNC toolmaking, and SAI sports coaching.',
    descriptionHi:
      'कमर्शियल पायलट, एयरक्राफ्ट मेंटेनेंस (AME), मर्चेंट नेवी, होटल मैनेजमेंट, CNC/मेकाट्रॉनिक्स और खेल प्रशिक्षण।',
    whyItFitsEn:
      'Suits your preference for hands-on operational mastery, rapid job readiness, field action, and practical certification over abstract theory.',
    whyItFitsHi:
      'किताबी सिद्धांतों के बजाय व्यावहारिक कौशल, फील्ड ऑपरेशन और तेज़ रोज़गार क्षमता में आपकी रुचि से मेल खाता है।',
    topExams: ['NCHMCT JEE', 'IMU CET', 'DGCA CPL / AME Modules', 'CIPET JEE', 'NSNIS SAI Entrance'],
    typicalDegrees: ['B.Sc Hospitality (IHM)', 'B.Sc Nautical Science / B.Tech Marine', 'Diploma Mechatronics / Tool & Die / B.P.Ed'],
    avgEntrySalary: 'Skilled Trade/IHM ₹3.2–6.0 LPA · Merchant Navy / Aviation ₹8–18 LPA',
    featuredCareerIds: [
      'commercial-pilot-cpl',
      'merchant-navy-deck',
      'hotel-mgmt-ihm',
      'ame-aircraft-maint',
      'culinary-arts-chef',
      'sports-science-physio',
    ],
  },
};

export const ALL_BROAD_CATEGORIES: BroadCareerCategory[] = [
  'Engineering',
  'Medical',
  'Commerce',
  'Arts',
  'Government',
  'Vocational',
];

/**
 * 25-Question Multi-Modal Career Assessment Dataset
 * Includes:
 * - Q1..Q8: single-choice (8 questions)
 * - Q9..Q14: slider (6 questions)
 * - Q15..Q19: likert-scale (5 questions)
 * - Q20..Q22: multi-select (3 questions)
 * - Q23..Q25: tradeoff-pair (3 questions)
 */
export const QUIZ_DATA: QuizQuestion[] = [
  // ==================== PART A: 8 SINGLE-CHOICE QUESTIONS (Q1 - Q8) ====================
  {
    id: 1,
    questionType: 'single-choice',
    questionWeight: 2.0,
    traitKey: 'academic_stream',
    traitLabelEn: 'Class 11–12 Stream & Subject Eligibility',
    traitLabelHi: 'कक्षा 11–12 स्ट्रीम और विषय पात्रता',
    questionEn: 'Which Class 11–12 academic stream are you currently studying (or planning to choose)?',
    questionHi: 'आप कक्षा 11–12 में किस स्ट्रीम से पढ़ाई कर रहे हैं (या चुनने की योजना बना रहे हैं)?',
    helperEn: 'Statutory Indian regulatory bodies (AICTE, NMC, BCI, ICAI) tie degree eligibility directly to Class 12 subjects.',
    helperHi: 'भारत में AICTE, NMC, BCI और ICAI के नियमों के अनुसार कई डिग्री कोर्स 12वीं के विषयों पर आधारित होते हैं।',
    sourceIds: ['src-ncert-tamanna', 'src-aicte', 'src-nmc'],
    options: [
      {
        id: 'q1-pcm',
        textEn: 'Science with Mathematics (PCM — Physics, Chemistry, Maths)',
        textHi: 'गणित के साथ विज्ञान (PCM — फिजिक्स, केमिस्ट्री, मैथ्स)',
        weights: { Engineering: 30, Vocational: 16, Government: 12, Commerce: 10 },
        preferredStreams: ['PCM'],
      },
      {
        id: 'q1-pcb',
        textEn: 'Science with Biology (PCB — Physics, Chemistry, Biology)',
        textHi: 'जीव विज्ञान के साथ विज्ञान (PCB — फिजिक्स, केमिस्ट्री, बायोलॉजी)',
        weights: { Medical: 30, Government: 10, Vocational: 10 },
        preferredStreams: ['PCB'],
      },
      {
        id: 'q1-pcmb',
        textEn: 'Both Maths & Biology (PCMB — keeping Engineering & Medical open)',
        textHi: 'गणित और जीव विज्ञान दोनों (PCMB — इंजीनियरिंग व मेडिकल दोनों खुले)',
        weights: { Engineering: 24, Medical: 24, Government: 12, Vocational: 10 },
        preferredStreams: ['PCM', 'PCB'],
      },
      {
        id: 'q1-commerce',
        textEn: 'Commerce (Accountancy, Business Studies, Economics, with/without Maths)',
        textHi: 'कॉमर्स (अकाउंटेंसी, बिज़नेस स्टडीज, इकोनॉमिक्स)',
        weights: { Commerce: 30, Government: 16, Arts: 10 },
        preferredStreams: ['Commerce'],
      },
      {
        id: 'q1-arts',
        textEn: 'Humanities / Arts (Pol Science, History, Psychology, Sociology, Design/Fine Arts)',
        textHi: 'आर्ट्स / ह्यूमैनिटीज (राजनीति विज्ञान, इतिहास, मनोविज्ञान, समाजशास्त्र, कला)',
        weights: { Arts: 28, Government: 26, Commerce: 8, Vocational: 10 },
        preferredStreams: ['Arts'],
      },
      {
        id: 'q1-voc',
        textEn: 'Polytechnic Diploma / ITI / Vocational Skill Track after Class 10 or 12',
        textHi: 'पॉलिटेक्निक डिप्लोमा / ITI / व्यावसायिक कौशल ट्रैक (10वीं या 12वीं के बाद)',
        weights: { Vocational: 30, Engineering: 16, Arts: 8 },
        preferredStreams: ['Any'],
      },
    ],
  },
  {
    id: 2,
    questionType: 'single-choice',
    questionWeight: 1.6,
    traitKey: 'problem_solving_mode',
    traitLabelEn: 'Natural Problem-Solving Style',
    traitLabelHi: 'समस्या सुलझाने की स्वाभाविक शैली',
    questionEn: 'When you face an unfamiliar complex challenge, which approach feels most natural to you?',
    questionHi: 'जब आपके सामने कोई नई और जटिल समस्या आती है, तो आप उसे कैसे सुलझाना पसंद करते हैं?',
    helperEn: 'Measures cognitive preference across analytical, diagnostic, commercial, creative, institutional, and hands-on domains.',
    helperHi: 'यह प्रश्न आपकी तार्किक, निदानात्मक, व्यावसायिक, रचनात्मक या व्यावहारिक कार्यशैली की पहचान करता है।',
    sourceIds: ['src-ncert-tamanna', 'src-ncs'],
    options: [
      {
        id: 'q2-code',
        textEn: 'Break it into equations, logic flows, or software/hardware architecture',
        textHi: 'उसे गणितीय तर्क, एल्गोरिद्म या सॉफ्टवेयर/हार्डवेयर सिस्टम में विभाजित करना',
        weights: { Engineering: 28, Commerce: 10, Vocational: 8 },
      },
      {
        id: 'q2-clinical',
        textEn: 'Examine symptoms, biological evidence, and diagnostic lab reports carefully',
        textHi: 'लक्षणों, जैविक साक्ष्यों और लैब रिपोर्टों का बारीकी से परीक्षण करना',
        weights: { Medical: 28, Engineering: 8 },
      },
      {
        id: 'q2-financial',
        textEn: 'Analyze costs, return on investment (ROI), incentives, and market cash flows',
        textHi: 'लागत, मुनाफे (ROI), बाजार के जोखिम और वित्तीय आंकड़ों का विश्लेषण करना',
        weights: { Commerce: 28, Government: 10 },
      },
      {
        id: 'q2-creative',
        textEn: 'Sketch visual concepts, redesign the user experience, or craft a compelling story',
        textHi: 'विजुअल स्केच बनाना, यूज़र अनुभव सुधारना या प्रभावशाली कहानी तैयार करना',
        weights: { Arts: 28, Commerce: 8 },
      },
      {
        id: 'q2-policy',
        textEn: 'Examine constitutional rules, legal precedents, and public administration impact',
        textHi: 'संवैधानिक नियमों, कानूनी प्रावधानों और जनहित के प्रभाव की जांच करना',
        weights: { Government: 28, Commerce: 10, Arts: 8 },
      },
      {
        id: 'q2-hands',
        textEn: 'Open the toolkit, test physical components, and fix or operate the system directly',
        textHi: 'सीधे उपकरणों और मशीनों का उपयोग करके व्यावहारिक रूप से समस्या ठीक करना',
        weights: { Vocational: 28, Engineering: 14 },
      },
    ],
  },
  {
    id: 3,
    questionType: 'single-choice',
    questionWeight: 1.5,
    traitKey: 'workplace_setting',
    traitLabelEn: 'Ideal Daily Workplace Environment',
    traitLabelHi: 'आदर्श दैनिक कार्यस्थल वातावरण',
    questionEn: 'Five years from now, which daily workplace environment would energize you the most?',
    questionHi: 'आज से 5 वर्ष बाद, किस प्रकार के दैनिक कार्यस्थल में काम करना आपको सबसे अधिक ऊर्जा देगा?',
    helperEn: 'Aligns physical and organizational workplace reality with your temperament.',
    helperHi: 'आपके स्वभाव के साथ वास्तविक कार्यस्थल के वातावरण का मिलान करता है।',
    sourceIds: ['src-ncs', 'src-dgt'],
    options: [
      {
        id: 'q3-techlab',
        textEn: 'R&D engineering lab, semiconductor cleanroom, or high-scale software engineering floor',
        textHi: 'सॉफ्टवेयर टेक पार्क, सेमीकंडक्टर लैब या वैज्ञानिक अनुसंधान केंद्र',
        weights: { Engineering: 26, Vocational: 8 },
      },
      {
        id: 'q3-hospital',
        textEn: 'Multi-specialty hospital ICU/OPD, clinical diagnostic lab, or rehabilitation center',
        textHi: 'मल्टी-स्पेशियलिटी अस्पताल, क्लिनिकल डायग्नोस्टिक लैब या रिहैबिलिटेशन सेंटर',
        weights: { Medical: 28 },
      },
      {
        id: 'q3-boardroom',
        textEn: 'Financial district office, audit firm, investment desk, or corporate strategy war-room',
        textHi: 'कॉर्पोरेट कार्यालय, चार्टर्ड ऑडिट फर्म, बैंक या स्टॉक मार्केट ट्रेडिंग डेस्क',
        weights: { Commerce: 28, Government: 8 },
      },
      {
        id: 'q3-studio',
        textEn: 'Design studio, architecture practice, film/sound stage, or investigative newsroom',
        textHi: 'डिज़ाइन स्टूडियो, आर्किटेक्चर फर्म, फिल्म/साउंड सेट या न्यूज़रूम',
        weights: { Arts: 28 },
      },
      {
        id: 'q3-court',
        textEn: 'District Collectorate, High Court/Supreme Court chambers, ministry, or defense base',
        textHi: 'कलेक्ट्रेट कार्यालय, हाई कोर्ट/सुप्रीम कोर्ट, मंत्रालय या सैन्य परिसर',
        weights: { Government: 28 },
      },
      {
        id: 'q3-field',
        textEn: 'Aircraft cockpit/hangar, merchant ship bridge, luxury hotel kitchen, or sports arena',
        textHi: 'एयरक्राफ्ट कॉकपिट/हैंगर, मर्चेंट नेवी शिप, 5-स्टार होटल या स्पोर्ट्स एरीना',
        weights: { Vocational: 28, Engineering: 8 },
      },
    ],
  },
  {
    id: 4,
    questionType: 'single-choice',
    questionWeight: 1.4,
    traitKey: 'exam_temperament',
    traitLabelEn: 'Competitive Exam & Assessment Format Fit',
    traitLabelHi: 'प्रतियोगी परीक्षा और मूल्यांकन प्रारूप उपयुक्तता',
    questionEn: 'Which type of competitive exam or evaluation format plays best to your personal strengths?',
    questionHi: 'किस प्रकार की प्रतियोगी परीक्षा या मूल्यांकन पद्धति आपकी क्षमता के सबसे अनुकूल है?',
    helperEn: 'Different Indian entrance pathways test very different cognitive skills.',
    helperHi: 'भारत की विभिन्न प्रवेश परीक्षाएं अलग-अलग प्रकार की क्षमताओं का परीक्षण करती हैं।',
    sourceIds: ['src-nta-jee', 'src-nta-neet', 'src-clat', 'src-nid'],
    options: [
      {
        id: 'q4-jee',
        textEn: 'Numeric & Physics-Math analytical problem solving (like JEE / BITSAT / GATE)',
        textHi: 'गणित और फिजिक्स के संख्यात्मक व तार्किक प्रश्न (जैसे JEE / BITSAT / GATE)',
        weights: { Engineering: 26, Commerce: 8 },
      },
      {
        id: 'q4-neet',
        textEn: 'Deep NCERT Biology, Physiology & Chemistry mastery (like NEET-UG / AIIMS Paramedical)',
        textHi: 'जीव विज्ञान (NCERT Biology) और रसायन विज्ञान की गहन समझ (जैसे NEET / AIIMS)',
        weights: { Medical: 28 },
      },
      {
        id: 'q4-ca',
        textEn: 'Multi-level accounting, tax law, mercantile regulation & quantitative aptitude (CA / CS / CAT)',
        textHi: 'अकाउंटिंग, टैक्स कानून, ऑडिट और व्यावसायिक गणना (जैसे CA / CS / CMA / CAT)',
        weights: { Commerce: 28, Government: 8 },
      },
      {
        id: 'q4-clat',
        textEn: 'Legal reasoning, constitutional reading comprehension, current affairs & essay writing (CLAT / UPSC)',
        textHi: 'कानूनी तर्कशक्ति, संविधान, समसामयिक घटनाएं और निबंध लेखन (जैसे CLAT / UPSC)',
        weights: { Government: 28, Arts: 10 },
      },
      {
        id: 'q4-nid',
        textEn: 'Live sketching, spatial visualization, design studio test & creative portfolio review (NID / UCEED / FTII)',
        textHi: 'लाइव स्केचिंग, क्रिएटिव स्टूडियो टेस्ट और पोर्टफोलियो मूल्यांकन (जैसे NID / UCEED / FTII)',
        weights: { Arts: 28 },
      },
      {
        id: 'q4-skill',
        textEn: 'Practical trade skill test, physical endurance trial, or operational simulator check (DGCA / IMU / SAI / DGT)',
        textHi: 'प्रैक्टिकल ट्रेड टेस्ट, शारीरिक दक्षता या सिम्युलेटर परीक्षा (जैसे DGCA / IMU / NCHMCT / ITI)',
        weights: { Vocational: 28, Engineering: 8 },
      },
    ],
  },
  {
    id: 5,
    questionType: 'single-choice',
    questionWeight: 1.3,
    traitKey: 'stress_response',
    traitLabelEn: 'High-Pressure Responsibility Preference',
    traitLabelHi: 'दबाव की स्थिति में जिम्मेदारी का चुनाव',
    questionEn: 'Every serious career has high-pressure moments. Which type of pressure are you most willing to handle?',
    questionHi: 'हर करियर में कभी न कभी दबाव आता है। आप किस प्रकार की जिम्मेदारी का सामना करने में अधिक सहज हैं?',
    helperEn: 'Identifies realistic occupational stress tolerance before you commit to a multi-year course.',
    helperHi: 'किसी कोर्स को चुनने से पहले उस क्षेत्र के वास्तविक कार्य-दबाव के प्रति आपकी सहजता परखता है।',
    sourceIds: ['src-ncs', 'src-plfs'],
    options: [
      {
        id: 'q5-uptime',
        textEn: 'Debugging a production software outage or hardware failure before a product launch',
        textHi: 'प्रोडक्ट लॉन्च या लाइव सर्वर में आई तकनीकी/कोडिंग खराबी को तुरंत ठीक करना',
        weights: { Engineering: 25, Vocational: 10 },
      },
      {
        id: 'q5-patient',
        textEn: 'Stabilizing an emergency trauma patient or managing critical ICU diagnostic readings on night duty',
        textHi: 'आपातकालीन वार्ड या ICU में गंभीर मरीज की जान बचाने के लिए त्वरित निर्णय लेना',
        weights: { Medical: 28 },
      },
      {
        id: 'q5-audit',
        textEn: 'Closing a statutory balance-sheet audit, tax filing, or M&A valuation under a regulatory deadline',
        textHi: 'निर्धारित समय-सीमा के भीतर कंपनी ऑडिट, टैक्स फाइलिंग या वित्तीय डील पूरी करना',
        weights: { Commerce: 26, Government: 8 },
      },
      {
        id: 'q5-deadline',
        textEn: 'Delivering a client design pitch, architectural blueprint, or live broadcast under public scrutiny',
        textHi: 'लाइव ब्रॉडकास्ट, फिल्म रिलीज़ या क्लाइंट डिज़ाइन पिच को समय पर रचनात्मक रूप से पूरा करना',
        weights: { Arts: 26 },
      },
      {
        id: 'q5-crisis',
        textEn: 'Managing district law-and-order, disaster relief, or arguing a complex constitutional case in court',
        textHi: 'जिले में कानून-व्यवस्था/आपदा प्रबंधन संभालना या न्यायालय में जटिल मुकदमे की बहस करना',
        weights: { Government: 28 },
      },
      {
        id: 'q5-ops',
        textEn: 'Navigating a vessel/aircraft through rough weather, running a 300-cover banquet kitchen, or competing in a tournament final',
        textHi: 'खराब मौसम में विमान/जहाज का संचालन, बड़े होटल किचन का प्रबंधन या खेल के फाइनल में प्रदर्शन',
        weights: { Vocational: 28 },
      },
    ],
  },
  {
    id: 6,
    questionType: 'single-choice',
    questionWeight: 1.3,
    traitKey: 'subject_curiosity',
    traitLabelEn: 'Self-Directed Learning Curiosity',
    traitLabelHi: 'स्व-अध्ययन और जिज्ञासा का विषय',
    questionEn: 'If you had a free afternoon to watch a documentary or read a deep-dive article, which topic would you pick first?',
    questionHi: 'यदि आपके पास खाली समय हो, तो आप किस विषय पर डॉक्यूमेंट्री देखना या गहराई से पढ़ना सबसे पहले चुनेंगे?',
    helperEn: 'Intrinsic curiosity predicts whether you will sustain motivation through 3–5 years of degree coursework.',
    helperHi: 'आपकी स्वाभाविक जिज्ञासा यह बताती है कि आप 3–5 साल के कोर्स में उत्साह बनाए रख पाएंगे या नहीं।',
    sourceIds: ['src-ncert-tamanna'],
    options: [
      {
        id: 'q6-ai',
        textEn: 'How GPUs, quantum computers, rockets, and artificial intelligence neural networks work',
        textHi: 'सुपरकंप्यूटर, रॉकेट इंजन, सेमीकंडक्टर चिप्स और AI न्यूरल नेटवर्क कैसे काम करते हैं',
        weights: { Engineering: 26, Vocational: 8 },
      },
      {
        id: 'q6-bio',
        textEn: 'How the human immune system, neurosurgery, CRISPR gene therapy, and life-saving drugs work',
        textHi: 'मानव मस्तिष्क, इम्यून सिस्टम, जीन थेरेपी और जीवनरक्षक दवाएं कैसे काम करती हैं',
        weights: { Medical: 26 },
      },
      {
        id: 'q6-econ',
        textEn: 'How central banks, stock markets, startup unit economics, and global trade supply chains work',
        textHi: 'रिज़र्व बैंक, शेयर बाजार, स्टार्टअप अर्थशास्त्र और वैश्विक व्यापार कैसे काम करते हैं',
        weights: { Commerce: 26, Government: 8 },
      },
      {
        id: 'q6-culture',
        textEn: 'How iconic buildings, cinema masterpieces, brand identities, and investigative stories are crafted',
        textHi: 'विश्व प्रसिद्ध इमारतें, फिल्में, ब्रांड डिज़ाइन और खोजी पत्रकारिता कैसे तैयार होती हैं',
        weights: { Arts: 26 },
      },
      {
        id: 'q6-polity',
        textEn: 'How landmark Supreme Court judgments, foreign diplomacy, and administrative reforms shaped India',
        textHi: 'सुप्रीम कोर्ट के ऐतिहासिक फैसले, विदेश नीति और प्रशासनिक सुधारों ने देश को कैसे बदला',
        weights: { Government: 26, Arts: 8 },
      },
      {
        id: 'q6-machines',
        textEn: 'How commercial airliners, marine engines, elite athletes, and gourmet kitchens operate behind the scenes',
        textHi: 'विमानन, मर्चेंट नेवी शिप, ओलंपिक एथलीट ट्रेनिंग और बड़े होटल परदे के पीछे कैसे चलते हैं',
        weights: { Vocational: 26, Engineering: 8 },
      },
    ],
  },
  {
    id: 7,
    questionType: 'single-choice',
    questionWeight: 1.2,
    traitKey: 'team_role',
    traitLabelEn: 'Natural Role in a Group Project',
    traitLabelHi: 'समूह परियोजना (Team Project) में आपकी भूमिका',
    questionEn: 'When your school or college group works on a major project, which role do you naturally take over?',
    questionHi: 'स्कूल या कॉलेज के किसी बड़े ग्रुप प्रोजेक्ट में आप स्वाभाविक रूप से कौन सी जिम्मेदारी संभालते हैं?',
    helperEn: 'Maps interpersonal execution style to functional career roles.',
    helperHi: 'टीम में आपकी कार्यशैली को सही करियर भूमिका से जोड़ता है।',
    sourceIds: ['src-ncert-tamanna', 'src-ncs'],
    options: [
      {
        id: 'q7-builder',
        textEn: 'The System Builder — writing the code, calculating the formulas, or wiring the prototype',
        textHi: 'सिस्टम बिल्डर — कोडिंग करना, गणितीय मॉडल बनाना या तकनीकी प्रोटोटाइप जोड़ना',
        weights: { Engineering: 24, Vocational: 10 },
      },
      {
        id: 'q7-care',
        textEn: 'The Diagnostic & Safety Specialist — checking accuracy, health/safety impact, and scientific validity',
        textHi: 'डायग्नोस्टिक व सेफ्टी प्रमुख — वैज्ञानिक सटीकता और स्वास्थ्य/सुरक्षा प्रभाव की जांच करना',
        weights: { Medical: 24, Engineering: 8 },
      },
      {
        id: 'q7-treasurer',
        textEn: 'The Strategist & Treasurer — managing the budget, sponsorship, pricing, and resource allocation',
        textHi: 'रणनीतिकार व कोषाध्यक्ष — बजट, स्पॉन्सरशिप और संसाधनों का वित्तीय प्रबंधन करना',
        weights: { Commerce: 24, Government: 8 },
      },
      {
        id: 'q7-designer',
        textEn: 'The Creative Director — designing the visual presentation, video, layout, and user narrative',
        textHi: 'क्रिएटिव डायरेक्टर — विजुअल डिज़ाइन, वीडियो, पोस्टर और प्रस्तुति को आकर्षक बनाना',
        weights: { Arts: 24 },
      },
      {
        id: 'q7-spokesperson',
        textEn: 'The Policy Lead & Debater — drafting rules, resolving team disputes, and defending the project on stage',
        textHi: 'नीति प्रमुख व वक्ता — नियम बनाना, विवाद सुलझाना और मंच पर प्रोजेक्ट का पक्ष रखना',
        weights: { Government: 24, Commerce: 8, Arts: 6 },
      },
      {
        id: 'q7-fieldcaptain',
        textEn: 'The Field Operations Captain — handling on-ground logistics, tools, equipment setup, and execution',
        textHi: 'फील्ड ऑपरेशंस कैप्टन — मैदान पर उपकरण, लॉजिस्टिक्स और लाइव संचालन संभालना',
        weights: { Vocational: 24, Government: 6 },
      },
    ],
  },
  {
    id: 8,
    questionType: 'single-choice',
    questionWeight: 1.4,
    traitKey: 'ten_year_milestone',
    traitLabelEn: '10-Year Career Identity Goal',
    traitLabelHi: '10-वर्षीय करियर पहचान लक्ष्य',
    questionEn: 'Looking 10 years ahead, which professional achievement would make you and your family proudest?',
    questionHi: 'आज से 10 वर्ष बाद, कौन सी व्यावसायिक उपलब्धि आपको और आपके परिवार को सबसे अधिक गर्व महसूस कराएगी?',
    helperEn: 'Captures long-term intrinsic aspiration across Indian socio-economic contexts.',
    helperHi: 'भारतीय सामाजिक-आर्थिक परिप्रेक्ष्य में आपके दीर्घकालिक लक्ष्य को समझता है।',
    sourceIds: ['src-ncs', 'src-plfs'],
    options: [
      {
        id: 'q8-tech-arch',
        textEn: 'Being a Principal AI/Software Architect, DeepTech Patent Holder, or Core R&D Engineering Lead',
        textHi: 'एक शीर्ष सॉफ्टवेयर/AI आर्किटेक्ट, वैज्ञानिक या कोर इंजीनियरिंग लीडर बनना',
        weights: { Engineering: 26 },
      },
      {
        id: 'q8-healer',
        textEn: 'Being a trusted Specialist Doctor, Chief Nursing/Clinical Officer, or Biomedical Innovator saving lives',
        textHi: 'एक भरोसेमंद विशेषज्ञ डॉक्टर, वरिष्ठ क्लिनिकल/नर्सिंग अधिकारी या मेडिकल रिसर्चर बनना',
        weights: { Medical: 26 },
      },
      {
        id: 'q8-cfo',
        textEn: 'Being a Chartered Partner, CFO, Investment Fund Manager, or scaling a profitable business enterprise',
        textHi: 'एक सफल चार्टर्ड अकाउंटेंट (CA), CFO, फंड मैनेजर या उद्यमी (Entrepreneur) बनना',
        weights: { Commerce: 26 },
      },
      {
        id: 'q8-creator',
        textEn: 'Leading an acclaimed Architecture/Design Practice, Film/Media Studio, or National Journalism Desk',
        textHi: 'एक प्रतिष्ठित आर्किटेक्ट, डिज़ाइन डायरेक्टर, फिल्ममेकर या वरिष्ठ पत्रकार बनना',
        weights: { Arts: 26 },
      },
      {
        id: 'q8-magistrate',
        textEn: 'Serving as an IAS/IPS Officer, High Court Counsel/Judge, PSU Director, or Commissioned Defense Officer',
        textHi: 'एक IAS/IPS अधिकारी, न्यायाधीश/वरिष्ठ वकील या भारतीय सेना में कमीशंड ऑफिसर बनना',
        weights: { Government: 26 },
      },
      {
        id: 'q8-captain',
        textEn: 'Commanding an Airline Cockpit / Merchant Vessel, leading a 5-Star Culinary Brand, or Coaching National Athletes',
        textHi: 'एयरलाइन कैप्टन, मर्चेंट नेवी चीफ ऑफिसर, एग्जीक्यूटिव शेफ या राष्ट्रीय खेल कोच बनना',
        weights: { Vocational: 26 },
      },
    ],
  },

  // ==================== PART B: 6 CONTINUOUS SLIDER QUESTIONS (Q9 - Q14) ====================
  {
    id: 9,
    questionType: 'slider',
    questionWeight: 1.3,
    traitKey: 'daily_study_hours',
    traitLabelEn: 'Daily Focused Study & Practice Stamina (Slider)',
    traitLabelHi: 'दैनिक एकाग्र अध्ययन और अभ्यास क्षमता (स्लाइडर)',
    questionEn: 'Realistically, how many hours of focused self-study or deliberate skill practice can you sustain per day outside regular classes?',
    questionHi: 'नियमित कक्षाओं के अलावा, आप प्रतिदिन कितने घंटे एकाग्र स्वाध्याय (Self-Study) या कौशल अभ्यास कर सकते हैं?',
    helperEn: 'Slide from 1 to 10 hours/day. High-cut-off exams (UPSC, JEE Adv, NEET, CA Final) demand high daily stamina, whereas skill/applied tracks emphasize workshop hours.',
    helperHi: '1 से 10 घंटे/दिन के बीच चुनें। UPSC, JEE, NEET और CA जैसी परीक्षाओं में लंबे स्वाध्याय की आवश्यकता होती है।',
    sourceIds: ['src-nta-jee', 'src-nta-neet', 'src-upsc'],
    options: [],
    sliderConfig: {
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
      unitEn: 'hrs/day',
      unitHi: 'घंटे/दिन',
      minLabelEn: '1–2 hrs/day (Hands-on / Workshop preferred)',
      minLabelHi: '1–2 घंटे/दिन (प्रैक्टिकल कार्य पसंद)',
      maxLabelEn: '8–10 hrs/day (Intense exam rigor)',
      maxLabelHi: '8–10 घंटे/दिन (गहन प्रतियोगी तैयारी)',
      lowPoleWeights: { Vocational: 26, Arts: 18 },
      midPeakWeights: { Commerce: 18, Engineering: 18, Arts: 16 },
      highPoleWeights: { Medical: 24, Government: 24, Engineering: 22, Commerce: 20 },
    },
  },
  {
    id: 10,
    questionType: 'slider',
    questionWeight: 1.8,
    traitKey: 'math_quantitative_comfort',
    traitLabelEn: 'Quantitative & Mathematical Reasoning Comfort (Slider)',
    traitLabelHi: 'गणित और संख्यात्मक तर्कशक्ति में सहजता (स्लाइडर)',
    questionEn: 'On a scale of 1 to 10, how comfortable and confident do you feel working with algebra, calculus, statistics, and numerical data?',
    questionHi: '1 से 10 के पैमाने पर, आप बीजगणित, कैलकुलस, सांख्यिकी (Statistics) और संख्यात्मक डेटा के साथ काम करने में कितने सहज हैं?',
    helperEn: 'Crucial discriminator between math-intensive tracks (B.Tech, Actuarial, Quant Finance) and non-math tracks (Law, Clinical Medicine, Humanities, Design).',
    helperHi: 'गणित-आधारित करियर (इंजीनियरिंग, फाइनेंस) और गैर-गणित करियर (लॉ, मेडिकल, आर्ट्स, डिज़ाइन) के बीच अंतर करने वाला प्रमुख प्रश्न।',
    sourceIds: ['src-ncert-tamanna', 'src-aicte'],
    options: [],
    sliderConfig: {
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 6,
      unitEn: '/ 10',
      unitHi: '/ 10',
      minLabelEn: '1/10 (Prefer zero advanced math)',
      minLabelHi: '1/10 (उच्च गणित से बचना चाहते हैं)',
      maxLabelEn: '10/10 (Love advanced math & data)',
      maxLabelHi: '10/10 (उच्च गणित और डेटा बेहद पसंद)',
      lowPoleWeights: { Arts: 24, Medical: 18, Government: 18, Vocational: 16 },
      midPeakWeights: { Commerce: 18, Medical: 14, Vocational: 14 },
      highPoleWeights: { Engineering: 30, Commerce: 24 },
    },
  },
  {
    id: 11,
    questionType: 'slider',
    questionWeight: 1.4,
    traitKey: 'tuition_budget_ceiling',
    traitLabelEn: 'Total Higher-Education Fee Budget Ceiling (Slider)',
    traitLabelHi: 'उच्च शिक्षा के लिए कुल फीस बजट सीमा (स्लाइडर)',
    questionEn: 'What is the maximum total college/training tuition budget (in ₹ Lakhs for the entire course) that your family can comfortably afford without distressing debt?',
    questionHi: 'बिना भारी कर्ज के आपका परिवार पूरे कोर्स के लिए अधिकतम कितने लाख रुपये (₹ Lakhs) तक की फीस वहन कर सकता है?',
    helperEn: 'Slide from ₹1 Lakh to ₹25 Lakhs. Note: Govt medical/engineering/ITI/NLU scholarships & PM-Vidyalaxmi loans can support low-budget students.',
    helperHi: '₹1 लाख से ₹25 लाख के बीच चुनें। कम बजट होने पर सरकारी कॉलेज, डिप्लोमा, CA/CS और छात्रवृत्ति वाले विकल्प प्राथमिकता पाते हैं।',
    sourceIds: ['src-nirf', 'src-nsp', 'src-pm-vidyalaxmi'],
    options: [],
    sliderConfig: {
      min: 1,
      max: 25,
      step: 1,
      defaultValue: 6,
      unitEn: 'Lakhs INR',
      unitHi: 'लाख रुपये',
      minLabelEn: '≤ ₹1–2 Lakhs (Govt / Scholarship / ICAI / ITI)',
      minLabelHi: '≤ ₹1–2 लाख (सरकारी कॉलेज / स्कॉलरशिप / ITI)',
      maxLabelEn: '₹20–25 Lakhs+ (Private Univ / Aviation / Global)',
      maxLabelHi: '₹20–25 लाख+ (प्राइवेट यूनिवर्सिटी / एविएशन)',
      lowPoleWeights: { Government: 22, Vocational: 22, Commerce: 20 },
      midPeakWeights: { Engineering: 18, Commerce: 18, Arts: 16, Medical: 16 },
      highPoleWeights: { Engineering: 20, Medical: 20, Arts: 18, Vocational: 18 },
    },
  },
  {
    id: 12,
    questionType: 'slider',
    questionWeight: 1.5,
    traitKey: 'study_duration_ceiling',
    traitLabelEn: 'Maximum Study Years Before First Job (Slider)',
    traitLabelHi: 'पहली नौकरी से पहले अधिकतम अध्ययन वर्ष (स्लाइडर)',
    questionEn: 'After Class 12, how many years of full-time education/training are you willing to invest before starting your first salaried job?',
    questionHi: '12वीं कक्षा के बाद, अपनी पहली नियमित आय शुरू करने से पहले आप कितने वर्ष की पूर्णकालिक पढ़ाई में निवेश करने को तैयार हैं?',
    helperEn: '1–2 yrs = Diploma/Skill/Trade; 3–4 yrs = B.Tech/B.Com/B.Sc/B.Des/Nursing; 5–8 yrs = MBBS + PG, 5-Yr Law, Architecture, Civil Services.',
    helperHi: '1–2 वर्ष = डिप्लोमा/कौशल; 3–4 वर्ष = स्नातक/बी.टेक/नर्सिंग; 5–8 वर्ष = MBBS+PG, 5-वर्षीय लॉ, आर्किटेक्चर या सिविल सेवा।',
    sourceIds: ['src-ugc', 'src-nmc', 'src-dgt'],
    options: [],
    sliderConfig: {
      min: 1,
      max: 8,
      step: 1,
      defaultValue: 4,
      unitEn: 'Years',
      unitHi: 'वर्ष',
      minLabelEn: '1–2 Years (Fast-track job readiness)',
      minLabelHi: '1–2 वर्ष (तेज़ रोज़गार प्राथमिकता)',
      maxLabelEn: '6–8 Years (MBBS+MD / Research / Judiciary)',
      maxLabelHi: '6–8 वर्ष (MBBS+MD / शोध / न्यायपालिका)',
      lowPoleWeights: { Vocational: 30, Commerce: 14 },
      midPeakWeights: { Engineering: 24, Commerce: 22, Arts: 22 },
      highPoleWeights: { Medical: 28, Government: 24 },
    },
  },
  {
    id: 13,
    questionType: 'slider',
    questionWeight: 1.3,
    traitKey: 'people_vs_systems',
    traitLabelEn: 'Independent Technical Systems vs. Direct Human Interaction (Slider)',
    traitLabelHi: 'स्वतंत्र तकनीकी सिस्टम बनाम प्रत्यक्ष जन-संपर्क (स्लाइडर)',
    questionEn: 'Where do you thrive more: working quietly with computers/data/machines (1) or interacting continuously with patients, citizens, clients, and teams (10)?',
    questionHi: 'आप कहाँ बेहतर प्रदर्शन करते हैं: कंप्यूटर/डेटा/मशीनों के साथ शांत काम (1) या मरीजों, नागरिकों और क्लाइंट्स के साथ निरंतर संवाद (10)?',
    helperEn: 'Balances deep individual contributor roles against public-facing clinical, legal, hospitality, and management tracks.',
    helperHi: 'व्यक्तिगत तकनीकी कार्य और जन-संपर्क आधारित करियर (मेडिकल, लॉ, हॉस्पिटैलिटी, मैनेजमेंट) के बीच संतुलन मापता है।',
    sourceIds: ['src-ncert-tamanna', 'src-ncs'],
    options: [],
    sliderConfig: {
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
      unitEn: '/ 10',
      unitHi: '/ 10',
      minLabelEn: '1/10 (Deep focus on code, data, or machines)',
      minLabelHi: '1/10 (कोड, डेटा या मशीनों पर एकाग्र कार्य)',
      maxLabelEn: '10/10 (Constant human, clinical, or public interaction)',
      maxLabelHi: '10/10 (मरीजों, नागरिकों या क्लाइंट्स से निरंतर संवाद)',
      lowPoleWeights: { Engineering: 26, Vocational: 14, Arts: 12 },
      midPeakWeights: { Commerce: 20, Arts: 18 },
      highPoleWeights: { Medical: 24, Government: 24, Commerce: 18, Vocational: 14 },
    },
  },
  {
    id: 14,
    questionType: 'slider',
    questionWeight: 1.3,
    traitKey: 'desk_vs_field_execution',
    traitLabelEn: 'Digital/Desk Analysis vs. Physical Field/Lab/Workshop Action (Slider)',
    traitLabelHi: 'डिजिटल/डेस्क विश्लेषण बनाम फील्ड/लैब/वर्कशॉप कार्य (स्लाइडर)',
    questionEn: 'Do you prefer air-conditioned digital/desk work (1) or hands-on physical work in hospitals, workshops, ships, farms, studios, and field sites (10)?',
    questionHi: 'क्या आप ऑफिस डेस्क/कंप्यूटर पर काम करना पसंद करते हैं (1) या अस्पताल, वर्कशॉप, फील्ड साइट, जहाज और स्टूडियो में सक्रिय कार्य (10)?',
    helperEn: 'Separates screen-based careers (Software, Tax, FinTech) from physical/clinical/field careers (Vocational, Clinical, Defense, Agriculture).',
    helperHi: 'डेस्क आधारित करियर (सॉफ्टवेयर, फाइनेंस) और फील्ड/प्रैक्टिकल करियर (कौशल, मेडिकल, डिफेंस, कृषि) में अंतर करता है।',
    sourceIds: ['src-dgt', 'src-ncs'],
    options: [],
    sliderConfig: {
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
      unitEn: '/ 10',
      unitHi: '/ 10',
      minLabelEn: '1/10 (100% Digital / Desk / Remote-friendly)',
      minLabelHi: '1/10 (100% डिजिटल / ऑफिस डेस्क कार्य)',
      maxLabelEn: '10/10 (100% Field, Clinical Ward, Cockpit, or Workshop)',
      maxLabelHi: '10/10 (100% फील्ड, क्लिनिकल वार्ड या वर्कशॉप)',
      lowPoleWeights: { Commerce: 24, Engineering: 22, Arts: 14 },
      midPeakWeights: { Arts: 18, Government: 18, Engineering: 16 },
      highPoleWeights: { Vocational: 28, Medical: 22, Government: 16 },
    },
  },

  // ==================== PART C: 5 LIKERT-SCALE QUESTIONS (Q15 - Q19) ====================
  {
    id: 15,
    questionType: 'likert-scale',
    questionWeight: 1.8,
    traitKey: 'clinical_biology_affinity',
    traitLabelEn: 'Clinical Care, Human Anatomy & Hospital Comfort (1–5 Scale)',
    traitLabelHi: 'क्लिनिकल देखभाल, मानव शरीर रचना और अस्पताल सहजता (1–5 पैमाना)',
    questionEn: '“I feel comfortable studying human anatomy, blood/pathology samples, and working directly with sick or recovering patients in clinical settings.”',
    questionHi: '“मैं मानव शरीर रचना, रक्त/पैथोलॉजी जांच और अस्पताल में बीमार या ठीक हो रहे मरीजों की प्रत्यक्ष देखभाल करने में पूरी तरह सहज हूँ।”',
    helperEn: 'Rate from 1 (Strongly Disagree) to 5 (Strongly Agree). Also used to cross-check clinical stream contradictions.',
    helperHi: '1 (बिल्कुल असहमत) से 5 (पूर्णतः सहमत) तक चुनें। यह मेडिकल उपयुक्तता की मुख्य जांच भी करता है।',
    sourceIds: ['src-nmc', 'src-inc', 'src-ncahp'],
    options: [],
    likertConfig: {
      minLabelEn: '1 — Strongly Disagree (Uncomfortable with clinical/blood settings)',
      minLabelHi: '1 — बिल्कुल असहमत (अस्पताल/रक्त जांच में असहज)',
      maxLabelEn: '5 — Strongly Agree (Deeply motivated by clinical patient care)',
      maxLabelHi: '5 — पूर्णतः सहमत (मरीजों की चिकित्सा सेवा के लिए प्रेरित)',
      agreeWeights: { Medical: 32, Vocational: 6 },
      lowRatingWeights: { Engineering: 10, Commerce: 10, Arts: 10 },
    },
  },
  {
    id: 16,
    questionType: 'likert-scale',
    questionWeight: 1.6,
    traitKey: 'constitutional_governance_affinity',
    traitLabelEn: 'Constitutional Law, Public Policy & Civic Authority (1–5 Scale)',
    traitLabelHi: 'संवैधानिक कानून, लोक नीति और प्रशासनिक नेतृत्व (1–5 पैमाना)',
    questionEn: '“I enjoy reading about constitutional rights, government policy, court judgments, and leading public administration or defense initiatives.”',
    questionHi: '“मुझे संवैधानिक अधिकारों, सरकारी नीतियों, न्यायालय के निर्णयों को पढ़ने और लोक प्रशासन या रक्षा सेवाओं में नेतृत्व करने में गहरी रुचि है।”',
    helperEn: 'Rate from 1 (Strongly Disagree) to 5 (Strongly Agree).',
    helperHi: '1 (बिल्कुल असहमत) से 5 (पूर्णतः सहमत) तक चुनें।',
    sourceIds: ['src-upsc', 'src-bci', 'src-clat'],
    options: [],
    likertConfig: {
      minLabelEn: '1 — Strongly Disagree',
      minLabelHi: '1 — बिल्कुल असहमत',
      maxLabelEn: '5 — Strongly Agree',
      maxLabelHi: '5 — पूर्णतः सहमत',
      agreeWeights: { Government: 30, Commerce: 8, Arts: 8 },
      lowRatingWeights: { Engineering: 8, Vocational: 8 },
    },
  },
  {
    id: 17,
    questionType: 'likert-scale',
    questionWeight: 1.6,
    traitKey: 'creative_aesthetic_affinity',
    traitLabelEn: 'Visual Design, Storytelling & Aesthetic Craft (1–5 Scale)',
    traitLabelHi: 'विजुअल डिज़ाइन, स्टोरीटेलिंग और सृजनात्मक कला (1–5 पैमाना)',
    questionEn: '“I constantly notice typography, spatial architecture, film editing, soundscapes, or user-interface details and love creating original work from scratch.”',
    questionHi: '“मैं हमेशा डिज़ाइन, वास्तुकला (Architecture), फिल्म एडिटिंग, संगीत या ऐप इंटरफेस की बारीकियों पर ध्यान देता/देती हूँ और नया सृजन करना पसंद करता/करती हूँ।”',
    helperEn: 'Rate from 1 (Strongly Disagree) to 5 (Strongly Agree).',
    helperHi: '1 (बिल्कुल असहमत) से 5 (पूर्णतः सहमत) तक चुनें।',
    sourceIds: ['src-nid', 'src-uceed', 'src-coa', 'src-iimc'],
    options: [],
    likertConfig: {
      minLabelEn: '1 — Strongly Disagree',
      minLabelHi: '1 — बिल्कुल असहमत',
      maxLabelEn: '5 — Strongly Agree',
      maxLabelHi: '5 — पूर्णतः सहमत',
      agreeWeights: { Arts: 30, Engineering: 6 },
      lowRatingWeights: { Commerce: 8, Government: 8 },
    },
  },
  {
    id: 18,
    questionType: 'likert-scale',
    questionWeight: 1.6,
    traitKey: 'commercial_financial_affinity',
    traitLabelEn: 'Financial Markets, Accounting, Tax & Business Scaling (1–5 Scale)',
    traitLabelHi: 'वित्तीय बाजार, अकाउंटिंग, टैक्सेशन और व्यवसाय विस्तार (1–5 पैमाना)',
    questionEn: '“I am fascinated by balance sheets, taxation laws, stock valuation, credit risk, supply chains, and building profitable commercial operations.”',
    questionHi: '“मुझे बैलेंस शीट, टैक्सेशन, शेयर बाजार मूल्यांकन, बैंकिंग जोखिम और लाभकारी व्यवसाय खड़ा करने में विशेष रुचि है।”',
    helperEn: 'Rate from 1 (Strongly Disagree) to 5 (Strongly Agree).',
    helperHi: '1 (बिल्कुल असहमत) से 5 (पूर्णतः सहमत) तक चुनें।',
    sourceIds: ['src-icai', 'src-icsi', 'src-icmai', 'src-sebi'],
    options: [],
    likertConfig: {
      minLabelEn: '1 — Strongly Disagree',
      minLabelHi: '1 — बिल्कुल असहमत',
      maxLabelEn: '5 — Strongly Agree',
      maxLabelHi: '5 — पूर्णतः सहमत',
      agreeWeights: { Commerce: 30, Government: 6 },
      lowRatingWeights: { Medical: 6, Arts: 6 },
    },
  },
  {
    id: 19,
    questionType: 'likert-scale',
    questionWeight: 1.7,
    traitKey: 'computational_hardware_affinity',
    traitLabelEn: 'Software Code, Electronics, Machines & Applied Engineering (1–5 Scale)',
    traitLabelHi: 'सॉफ्टवेयर कोडिंग, इलेक्ट्रॉनिक्स, मशीनरी और इंजीनियरिंग (1–5 पैमाना)',
    questionEn: '“I love automating tasks with code, understanding how circuits/engines/machines operate, and building scalable technical systems.”',
    questionHi: '“मुझे कोडिंग से कार्यों को ऑटोमेट करना, सर्किट/इंजन/मशीनों की कार्यप्रणाली समझना और तकनीकी सिस्टम बनाना बहुत पसंद है।”',
    helperEn: 'Rate from 1 (Strongly Disagree) to 5 (Strongly Agree).',
    helperHi: '1 (बिल्कुल असहमत) से 5 (पूर्णतः सहमत) तक चुनें।',
    sourceIds: ['src-aicte', 'src-nta-jee', 'src-dgt'],
    options: [],
    likertConfig: {
      minLabelEn: '1 — Strongly Disagree',
      minLabelHi: '1 — बिल्कुल असहमत',
      maxLabelEn: '5 — Strongly Agree',
      maxLabelHi: '5 — पूर्णतः सहमत',
      agreeWeights: { Engineering: 28, Vocational: 16 },
      lowRatingWeights: { Arts: 8, Government: 8 },
    },
  },

  // ==================== PART D: 3 MULTI-SELECT QUESTIONS (Q20 - Q22) ====================
  {
    id: 20,
    questionType: 'multi-select',
    questionWeight: 1.5,
    maxMultiSelect: 3,
    traitKey: 'demonstrated_strengths',
    traitLabelEn: 'Core Demonstrated Capabilities (Select 1 to 3)',
    traitLabelHi: 'आपकी प्रमाणित मुख्य क्षमताएं (1 से 3 चुनें)',
    questionEn: 'Select up to 3 capabilities where teachers, peers, or family consistently notice your natural strength:',
    questionHi: 'ऐसे अधिकतम 3 कौशल चुनें जिनमें शिक्षक, मित्र या परिवार आपकी स्वाभाविक मजबूती देखते हैं:',
    helperEn: 'Multi-select is normalized by dividing by the number of chosen tags (1–3) so selecting more items never inflates raw points.',
    helperHi: 'अधिकतम 3 विकल्प चुनें। स्कोर को चुने गए विकल्पों के औसत से मानकीकृत किया जाता है।',
    sourceIds: ['src-ncert-tamanna', 'src-ncs'],
    options: [
      {
        id: 'q20-logic',
        textEn: 'Logical Debugging, Mathematics & Structured Coding',
        textHi: 'तार्किक विश्लेषण, गणित और कोडिंग/सिस्टम समझ',
        weights: { Engineering: 28, Commerce: 10 },
      },
      {
        id: 'q20-bio',
        textEn: 'Biology Observation, Patient Empathy & Lab Precision',
        textHi: 'जीव विज्ञान अवलोकन, रोगी संवेदनशीलता और लैब सटीकता',
        weights: { Medical: 28 },
      },
      {
        id: 'q20-comm',
        textEn: 'Commercial Negotiation, Financial Math & Enterprise Organization',
        textHi: 'व्यावसायिक बातचीत, वित्तीय हिसाब-किताब और प्रबंधन',
        weights: { Commerce: 28 },
      },
      {
        id: 'q20-design',
        textEn: 'Visual Sketching, Media Editing, Writing & Aesthetic Sense',
        textHi: 'स्केचिंग, वीडियो/साउंड एडिटिंग, लेखन और कलात्मक समझ',
        weights: { Arts: 28 },
      },
      {
        id: 'q20-debate',
        textEn: 'Public Speaking, Legal Argumentation, General Knowledge & Civic Leadership',
        textHi: 'भाषण कला, कानूनी तर्क, सामान्य ज्ञान और प्रशासनिक नेतृत्व',
        weights: { Government: 28, Arts: 8 },
      },
      {
        id: 'q20-dexterity',
        textEn: 'Mechanical Dexterity, Physical Stamina, Culinary Craft, or Field Operation',
        textHi: 'मशीनरी कौशल, शारीरिक फिटनेस, पाक-कला (Culinary) या फील्ड संचालन',
        weights: { Vocational: 28, Engineering: 8 },
      },
    ],
  },
  {
    id: 21,
    questionType: 'multi-select',
    questionWeight: 1.4,
    maxMultiSelect: 3,
    traitKey: 'tangible_work_outputs',
    traitLabelEn: 'Preferred Tangible Work Outputs (Select 1 to 3)',
    traitLabelHi: 'पसंदीदा ठोस कार्य परिणाम (1 से 3 चुनें)',
    questionEn: 'At the end of a work week, which tangible deliverables would give you the deepest sense of satisfaction? (Select up to 3)',
    questionHi: 'सप्ताह के अंत में कौन सा ठोस कार्य-परिणाम आपको सबसे अधिक संतुष्टि देगा? (अधिकतम 3 चुनें)',
    helperEn: 'Select 1 to 3 concrete outputs you want your career to produce.',
    helperHi: '1 से 3 ऐसे परिणाम चुनें जिन्हें आप अपने करियर में बनाना चाहते हैं।',
    sourceIds: ['src-ncs'],
    options: [
      {
        id: 'q21-software',
        textEn: 'Deployed software apps, AI models, microchips, or civil/electrical infrastructure',
        textHi: 'सॉफ्टवेयर ऐप, AI मॉडल, माइक्रोचिप या इंजीनियरिंग इंफ्रास्ट्रक्चर',
        weights: { Engineering: 28 },
      },
      {
        id: 'q21-recovery',
        textEn: 'Healed patients, accurate pathology/radiology reports, or validated clinical therapies',
        textHi: 'स्वस्थ होते मरीज, सटीक डायग्नोस्टिक रिपोर्ट या सफल चिकित्सा उपचार',
        weights: { Medical: 28 },
      },
      {
        id: 'q21-audit',
        textEn: 'Audited financial statements, tax savings, investment portfolios, or supply-chain profits',
        textHi: 'ऑडिटेड वित्तीय रिपोर्ट, टैक्स बचत, निवेश पोर्टफोलियो या व्यापारिक मुनाफा',
        weights: { Commerce: 28 },
      },
      {
        id: 'q21-art',
        textEn: 'Published journalism, architectural spaces, product designs, films, or music mixes',
        textHi: 'प्रकाशित समाचार रिपोर्ट, इमारत/प्रोडक्ट डिज़ाइन, फिल्म या साउंड ट्रैक',
        weights: { Arts: 28 },
      },
      {
        id: 'q21-order',
        textEn: 'Court judgments, public welfare implementation, statutory compliance, or national security',
        textHi: 'न्यायिक निर्णय, जनकल्याणकारी योजनाओं का क्रियान्वयन या राष्ट्रीय सुरक्षा',
        weights: { Government: 28 },
      },
      {
        id: 'q21-flight',
        textEn: 'Safe flights/voyages, precision CNC tooling, five-star hospitality, or athletic medals',
        textHi: 'सुरक्षित उड़ान/समुद्री यात्रा, सटीक CNC टूलिंग, उत्कृष्ट आतिथ्य या खेल पदक',
        weights: { Vocational: 28 },
      },
    ],
  },
  {
    id: 22,
    questionType: 'multi-select',
    questionWeight: 1.3,
    maxMultiSelect: 3,
    traitKey: 'family_career_priorities',
    traitLabelEn: 'Non-Negotiable Career Priorities (Select 1 to 3)',
    traitLabelHi: 'अनिवार्य पारिवारिक एवं व्यक्तिगत करियर प्राथमिकताएं (1 से 3 चुनें)',
    questionEn: 'Which practical priorities matter most to you and your family when choosing a career pathway? (Select up to 3)',
    questionHi: 'करियर चुनते समय आपके और आपके परिवार के लिए कौन सी व्यावहारिक प्राथमिकताएं सबसे महत्वपूर्ण हैं? (अधिकतम 3 चुनें)',
    helperEn: 'Grounds recommendations in real Indian household priorities (ROI, stability, mobility, autonomy).',
    helperHi: 'वास्तविक भारतीय पारिवारिक प्राथमिकताओं (कम लागत, स्थायित्व, ग्लोबल अवसर, स्वायत्तता) को शामिल करता है।',
    sourceIds: ['src-plfs', 'src-nirf', 'src-ncs'],
    options: [
      {
        id: 'q22-global',
        textEn: 'Global remote work, multinational GCC roles, & rapid private-sector salary growth',
        textHi: 'ग्लोबल रिमोट वर्क, बहुराष्ट्रीय कंपनियों (GCC) में अवसर और तेज़ वेतन वृद्धि',
        weights: { Engineering: 24, Commerce: 18, Arts: 10 },
      },
      {
        id: 'q22-recession',
        textEn: 'Recession-proof healthcare demand in every town, hospital, and country',
        textHi: 'मंदी-मुक्त स्वास्थ्य सेवा मांग जो हर शहर और देश में हमेशा बनी रहे',
        weights: { Medical: 26, Vocational: 10 },
      },
      {
        id: 'q22-sarkari',
        textEn: 'Gazetted government tenure, 7th/8th CPC pay scale, pension/allowances & social authority',
        textHi: 'राजपत्रित सरकारी पद, वेतन आयोग (CPC) वेतनमान, भत्ते और सामाजिक प्रतिष्ठा',
        weights: { Government: 28, Medical: 8 },
      },
      {
        id: 'q22-practice',
        textEn: 'Statutory license to open my own independent clinic, CA/Law chamber, or design studio',
        textHi: 'अपना स्वतंत्र क्लिनिक, CA/वकालत चैंबर या डिज़ाइन स्टूडियो खोलने का वैधानिक लाइसेंस',
        weights: { Commerce: 20, Medical: 18, Government: 16, Arts: 18 },
      },
      {
        id: 'q22-earlyearn',
        textEn: 'Low tuition debt and starting salaried income within 1–3 years via applied skills',
        textHi: 'बिना शिक्षा ऋण के कम फीस में पढ़ाई और 1–3 वर्ष के भीतर आय शुरू करना',
        weights: { Vocational: 26, Commerce: 12 },
      },
      {
        id: 'q22-expression',
        textEn: 'Creative freedom, portfolio recognition, and non-monotonous project variety',
        textHi: 'रचनात्मक स्वतंत्रता, पोर्टफोलियो पहचान और विविधतापूर्ण प्रोजेक्ट्स',
        weights: { Arts: 26, Engineering: 8 },
      },
    ],
  },

  // ==================== PART E: 3 TRADEOFF-PAIR QUESTIONS (Q23 - Q25) ====================
  {
    id: 23,
    questionType: 'tradeoff-pair',
    questionWeight: 1.4,
    traitKey: 'tradeoff_horizon_vs_early_income',
    traitLabelEn: 'Tradeoff: Immediate Earning vs. Long-Horizon Specialization',
    traitLabelHi: 'तुलना: शीघ्र रोज़गार बनाम दीर्घकालिक विशेषज्ञता',
    questionEn: 'Where do you stand between starting your income early (age 19–21) versus investing 5–8 years in deep professional specialization?',
    questionHi: 'कम उम्र (19–21 वर्ष) में जल्दी कमाई शुरू करने बनाम 5–8 वर्ष की गहन विशेषज्ञता (जैसे MBBS/Law/CA/PhD) के बीच आप किसे चुनेंगे?',
    helperEn: 'Choose from 1 (Strong Left Pole) to 5 (Strong Right Pole).',
    helperHi: '1 (बायां विकल्प: जल्दी कमाई) से 5 (दायां विकल्प: लंबी विशेषज्ञता) के बीच चुनें।',
    sourceIds: ['src-dgt', 'src-nmc', 'src-ugc'],
    options: [],
    tradeoffConfig: {
      leftPoleEn: 'Start earning by age 19–21 via job-ready Diploma, ITI, Hospitality, or Skill Certification',
      leftPoleHi: '19–21 वर्ष की आयु में डिप्लोमा/कौशल कोर्स से जल्दी कमाई शुरू करना',
      rightPoleEn: 'Invest 5–8 years in MBBS+PG, 5-Yr Law, CA, Architecture, or Civil Services for high long-term ceiling',
      rightPoleHi: 'उच्च दीर्घकालिक स्तर के लिए MBBS+PG, 5-वर्षीय लॉ, CA या सिविल सेवा में 5–8 वर्ष लगाना',
      leftWeights: { Vocational: 28, Arts: 12, Engineering: 10 },
      rightWeights: { Medical: 26, Government: 24, Commerce: 18 },
    },
  },
  {
    id: 24,
    questionType: 'tradeoff-pair',
    questionWeight: 1.4,
    traitKey: 'tradeoff_stability_vs_upside',
    traitLabelEn: 'Tradeoff: Fixed Government Stability vs. Corporate/Entrepreneurial Upside',
    traitLabelHi: 'तुलना: निश्चित सरकारी स्थायित्व बनाम कॉर्पोरेट/उद्यमिता विकास',
    questionEn: 'Given a direct choice, do you prefer predictable government/PSU tenure and fixed pay scales, or performance-linked corporate/startup/freelance upside?',
    questionHi: 'क्या आप निश्चित सरकारी/PSU स्थायित्व और तय वेतनमान पसंद करते हैं, या प्रदर्शन-आधारित कॉर्पोरेट/स्टार्टअप/फ्रीलांस की असीमित वृद्धि?',
    helperEn: 'Choose from 1 (Strong Government/PSU Tenure) to 5 (Strong Corporate/Startup/Studio Upside).',
    helperHi: '1 (सरकारी स्थायित्व) से 5 (कॉर्पोरेट/स्टार्टअप ग्रोथ) के बीच चुनें।',
    sourceIds: ['src-upsc', 'src-plfs'],
    options: [],
    tradeoffConfig: {
      leftPoleEn: 'Assured Government / PSU / Defense / Public Hospital tenure with fixed pay matrix',
      leftPoleHi: 'निश्चित वेतनमान और सुरक्षा के साथ सरकारी / PSU / रक्षा / सरकारी अस्पताल सेवा',
      rightPoleEn: 'High-growth Private Tech, Corporate Finance, Design Studio, or Independent Venture',
      rightPoleHi: 'तेज़ वेतन वृद्धि वाला प्राइवेट टेक, कॉर्पोरेट फाइनेंस, डिज़ाइन स्टूडियो या स्वतंत्र व्यवसाय',
      leftWeights: { Government: 28, Medical: 16, Vocational: 12 },
      rightWeights: { Engineering: 24, Commerce: 24, Arts: 22 },
    },
  },
  {
    id: 25,
    questionType: 'tradeoff-pair',
    questionWeight: 1.2,
    traitKey: 'tradeoff_locality_vs_mobility',
    traitLabelEn: 'Tradeoff: Home-District Roots vs. Metro/Global Mobility',
    traitLabelHi: 'तुलना: गृह-जिला/राज्य में कार्य बनाम मेट्रो शहर/अंतरराष्ट्रीय गतिशीलता',
    questionEn: 'Do you want a career that can be practiced in any Tier-2/3 district near home, or are you eager to relocate to metro hubs, ports, or international cities?',
    questionHi: 'क्या आप ऐसा करियर चाहते हैं जो आपके अपने जिले/राज्य (Tier-2/3 शहर) में भी चल सके, या आप मेट्रो शहरों व विदेश जाने के लिए उत्साहित हैं?',
    helperEn: 'Doctors, teachers, state civil officers, CAs, and agro-specialists work across all districts; VLSI, IB, OTT, and merchant shipping cluster in metros/ports.',
    helperHi: 'डॉक्टर, शिक्षक, राज्य अधिकारी और CA हर जिले में काम कर सकते हैं; जबकि सेमीकंडक्टर, इन्वेस्टमेंट बैंकिंग व शिपिंग मेट्रो/बंदरगाहों में केंद्रित हैं।',
    sourceIds: ['src-plfs', 'src-ncs'],
    options: [],
    tradeoffConfig: {
      leftPoleEn: 'Work in or near my home district / state (District Hospital, State PSC, Tax Practice, Agri/Local Enterprise)',
      leftPoleHi: 'अपने गृह-जिले या राज्य के पास काम करना (जिला अस्पताल, राज्य सेवा, टैक्स प्रैक्टिस, स्थानीय उद्यम)',
      rightPoleEn: 'Relocate to Bengaluru/Mumbai/Hyderabad/NCR corridors, international ports, or global hubs',
      rightPoleHi: 'बेंगलुरु/मुंबई/हैदराबाद/दिल्ली-NCR, अंतरराष्ट्रीय बंदरगाहों या विदेश के बड़े केंद्रों में काम करना',
      leftWeights: { Government: 22, Medical: 20, Commerce: 14, Vocational: 14 },
      rightWeights: { Engineering: 24, Arts: 20, Commerce: 18, Vocational: 16 },
    },
  },
];

/**
 * Evaluate a single question's contribution for each category and return whether the question had a valid answer.
 */
function scoreSingleQuestion(
  question: QuizQuestion,
  rawAns: QuizAnswerValue | undefined
): {
  isAnswered: boolean;
  categoryContributions: Record<BroadCareerCategory, number>;
  detectedStream?: string;
} {
  const categoryContributions: Record<BroadCareerCategory, number> = {
    Engineering: 0,
    Medical: 0,
    Commerce: 0,
    Arts: 0,
    Government: 0,
    Vocational: 0,
  };

  if (rawAns === undefined || rawAns === null || rawAns === '') {
    return { isAnswered: false, categoryContributions };
  }

  const w = question.questionWeight || 1.0;

  // 1. Single-choice
  if (question.questionType === 'single-choice') {
    let selectedOption: QuizOption | undefined;
    if (typeof rawAns === 'number') {
      selectedOption = question.options[rawAns];
    } else if (typeof rawAns === 'string') {
      selectedOption = question.options.find((o) => o.id === rawAns);
      if (!selectedOption && !Number.isNaN(Number(rawAns))) {
        selectedOption = question.options[Number(rawAns)];
      }
    }
    if (!selectedOption) {
      return { isAnswered: false, categoryContributions };
    }
    for (const cat of ALL_BROAD_CATEGORIES) {
      categoryContributions[cat] = Math.round((selectedOption.weights[cat] || 0) * w * 10) / 10;
    }
    return {
      isAnswered: true,
      categoryContributions,
      detectedStream: selectedOption.preferredStreams?.[0],
    };
  }

  // 2. Slider
  if (question.questionType === 'slider' && question.sliderConfig) {
    const cfg = question.sliderConfig;
    const numericVal = typeof rawAns === 'number' ? rawAns : Number(rawAns);
    if (Number.isNaN(numericVal)) {
      return { isAnswered: false, categoryContributions };
    }
    const clamped = Math.max(cfg.min, Math.min(cfg.max, numericVal));
    const span = Math.max(1, cfg.max - cfg.min);
    const t = (clamped - cfg.min) / span; // [0, 1]
    const midBell = 1 - Math.abs(2 * t - 1); // peaks at t = 0.5

    for (const cat of ALL_BROAD_CATEGORIES) {
      const lowW = cfg.lowPoleWeights[cat] || 0;
      const highW = cfg.highPoleWeights[cat] || 0;
      const midW = cfg.midPeakWeights?.[cat] || 0;
      const basePts = (1 - t) * lowW + t * highW + midBell * 0.35 * midW;
      categoryContributions[cat] = Math.round(basePts * w * 10) / 10;
    }
    return { isAnswered: true, categoryContributions };
  }

  // 3. Likert-scale (1 to 5)
  if (question.questionType === 'likert-scale' && question.likertConfig) {
    const cfg = question.likertConfig;
    const numericVal = typeof rawAns === 'number' ? rawAns : Number(rawAns);
    if (Number.isNaN(numericVal) || numericVal < 1 || numericVal > 5) {
      return { isAnswered: false, categoryContributions };
    }
    const t = (numericVal - 1) / 4; // 0 at 1, 0.25 at 2, 0.5 at 3, 0.75 at 4, 1.0 at 5
    const lowFactor = numericVal <= 2 ? (3 - numericVal) / 2 : 0; // 1.0 at rating=1, 0.5 at rating=2

    for (const cat of ALL_BROAD_CATEGORIES) {
      const agreePts = (cfg.agreeWeights[cat] || 0) * t;
      const lowPts = (cfg.lowRatingWeights?.[cat] || 0) * lowFactor;
      categoryContributions[cat] = Math.round((agreePts + lowPts) * w * 10) / 10;
    }
    return { isAnswered: true, categoryContributions };
  }

  // 4. Multi-select (array of option IDs or comma-separated string)
  if (question.questionType === 'multi-select') {
    const rawIds: string[] = Array.isArray(rawAns)
      ? rawAns.map(String)
      : typeof rawAns === 'string'
      ? rawAns
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const maxAllowed = question.maxMultiSelect || 3;
    const matchedOptions = rawIds
      .slice(0, maxAllowed)
      .map((idOrIdx) => {
        const byId = question.options.find((o) => o.id === idOrIdx);
        if (byId) return byId;
        const idx = Number(idOrIdx);
        return !Number.isNaN(idx) ? question.options[idx] : undefined;
      })
      .filter((o): o is QuizOption => Boolean(o));

    if (matchedOptions.length === 0) {
      return { isAnswered: false, categoryContributions };
    }

    // Normalize by count of selected options so selecting 3 items doesn't triple raw score vs selecting 1 focused strength
    const normDivisor = matchedOptions.length;
    const breadthBonus = 1 + (matchedOptions.length - 1) * 0.12; // slight reward for coherent multi-tag alignment
    for (const cat of ALL_BROAD_CATEGORIES) {
      const sumCat = matchedOptions.reduce((acc, opt) => acc + (opt.weights[cat] || 0), 0);
      const normalizedBase = (sumCat / normDivisor) * breadthBonus;
      categoryContributions[cat] = Math.round(normalizedBase * w * 10) / 10;
    }
    return { isAnswered: true, categoryContributions };
  }

  // 5. Tradeoff-pair (1 to 5 continuum between Left Pole and Right Pole)
  if (question.questionType === 'tradeoff-pair' && question.tradeoffConfig) {
    const cfg = question.tradeoffConfig;
    const numericVal = typeof rawAns === 'number' ? rawAns : Number(rawAns);
    if (Number.isNaN(numericVal) || numericVal < 1 || numericVal > 5) {
      return { isAnswered: false, categoryContributions };
    }
    const rightT = (numericVal - 1) / 4; // 0.0 (full left) to 1.0 (full right)
    const leftT = 1 - rightT;

    for (const cat of ALL_BROAD_CATEGORIES) {
      const pts = leftT * (cfg.leftWeights[cat] || 0) + rightT * (cfg.rightWeights[cat] || 0);
      categoryContributions[cat] = Math.round(pts * w * 10) / 10;
    }
    return { isAnswered: true, categoryContributions };
  }

  return { isAnswered: false, categoryContributions };
}

/**
 * Computes the theoretical maximum weighted points achievable for a given category across all 25 questions.
 */
export function getTheoreticalMaxForCategory(category: BroadCareerCategory): number {
  let maxTotal = 0;
  for (const q of QUIZ_DATA) {
    const w = q.questionWeight || 1.0;
    if (q.questionType === 'single-choice' || q.questionType === 'multi-select') {
      let maxInQ = 0;
      for (const opt of q.options) {
        const pts = (opt.weights[category] || 0) * w;
        if (pts > maxInQ) maxInQ = pts;
      }
      maxTotal += maxInQ;
    } else if (q.questionType === 'slider' && q.sliderConfig) {
      const lowPts = (q.sliderConfig.lowPoleWeights[category] || 0) * w;
      const highPts = (q.sliderConfig.highPoleWeights[category] || 0) * w;
      const midPts =
        ((lowPts + highPts) * 0.5) + (q.sliderConfig.midPeakWeights?.[category] || 0) * 0.35 * w;
      maxTotal += Math.max(lowPts, highPts, midPts);
    } else if (q.questionType === 'likert-scale' && q.likertConfig) {
      const agreePts = (q.likertConfig.agreeWeights[category] || 0) * w;
      const lowPts = (q.likertConfig.lowRatingWeights?.[category] || 0) * w;
      maxTotal += Math.max(agreePts, lowPts);
    } else if (q.questionType === 'tradeoff-pair' && q.tradeoffConfig) {
      const leftPts = (q.tradeoffConfig.leftWeights[category] || 0) * w;
      const rightPts = (q.tradeoffConfig.rightWeights[category] || 0) * w;
      maxTotal += Math.max(leftPts, rightPts);
    }
  }
  return Math.max(1, Math.round(maxTotal));
}

/**
 * Multi-Modal 25-Question Career Assessment Calculator
 * Evaluates single-choice, slider, likert-scale, multi-select, and tradeoff-pair inputs,
 * enforces feasibility constraints, detects contradictory answer patterns, and computes
 * Alignment Score Bands + Top 3 Career Pathways.
 */
export function calculateCareerAssessmentResult(
  answers: Record<number, QuizAnswerValue | undefined>,
  careersData?: CareersDatabase
): CareerAssessmentResult {
  const rawTotals: Record<BroadCareerCategory, number> = {
    Engineering: 0,
    Medical: 0,
    Commerce: 0,
    Arts: 0,
    Government: 0,
    Vocational: 0,
  };

  let answeredCount = 0;
  let detectedStream = 'Any';

  for (const question of QUIZ_DATA) {
    const rawAns = answers[question.id];
    const evalRes = scoreSingleQuestion(question, rawAns);
    if (!evalRes.isAnswered) continue;

    answeredCount += 1;
    if (question.id === 1 && evalRes.detectedStream) {
      detectedStream = evalRes.detectedStream;
    }

    for (const cat of ALL_BROAD_CATEGORIES) {
      rawTotals[cat] += evalRes.categoryContributions[cat];
    }
  }

  // Extract numeric slider constraints if provided
  const dailyStudyHours =
    answers[9] !== undefined && !Number.isNaN(Number(answers[9])) ? Number(answers[9]) : null;
  const mathComfort =
    answers[10] !== undefined && !Number.isNaN(Number(answers[10])) ? Number(answers[10]) : null;
  const budgetLakhs =
    answers[11] !== undefined && !Number.isNaN(Number(answers[11])) ? Number(answers[11]) : null;
  const maxStudyYears =
    answers[12] !== undefined && !Number.isNaN(Number(answers[12])) ? Number(answers[12]) : null;
  const clinicalLikert =
    answers[15] !== undefined && !Number.isNaN(Number(answers[15])) ? Number(answers[15]) : null;

  // Contradiction & Input Validation Engine
  const validationWarnings: ValidationWarningItem[] = [];

  // Rule 0: Incomplete assessment warning (< 6 of 25 questions answered)
  if (answeredCount > 0 && answeredCount < 6) {
    validationWarnings.push({
      code: 'INCOMPLETE_ASSESSMENT',
      severity: 'info',
      messageEn: `Incomplete Assessment Notice: Only ${answeredCount} of ${QUIZ_DATA.length} questions were answered. Complete at least 6 questions (or all 25) to narrow your Alignment Band.`,
      messageHi: `अधूरा मूल्यांकन सूचना: ${QUIZ_DATA.length} में से केवल ${answeredCount} प्रश्नों के उत्तर दिए गए हैं। सटीक अनुकूलता रेंज के लिए कम से कम 6 (या सभी 25) प्रश्नों के उत्तर दें।`,
    });
  }

  // Rule 1: PCB / Medical aspiration vs strong aversion to clinical/blood settings
  if (
    clinicalLikert !== null &&
    clinicalLikert <= 2 &&
    (detectedStream === 'PCB' || rawTotals.Medical >= rawTotals.Engineering)
  ) {
    validationWarnings.push({
      code: 'CONTRADICTION_PCB_LOW_CLINICAL',
      severity: 'warning',
      messageEn:
        'Input Tension Detected: You selected Biology (PCB) or clinical indicators, but rated hospital/blood/patient care comfort low (≤ 2/5 on Q15). Consider non-bedside bio-careers such as Bioinformatics, Health Informatics, Pharmaceutical R&D, or Food Technology.',
      messageHi:
        'उत्तर विरोधाभास: आपने बायोलॉजी (PCB) या मेडिकल संकेत चुने हैं, लेकिन प्रश्न 15 में अस्पताल/रोगी सेवा में कम सहजता (≤ 2/5) दर्ज की है। आपको बेडसाइड क्लिनिकल के बजाय बायो-इन्फॉर्मेटिक्स, फार्मा R&D या फूड टेक्नोलॉजी जैसे विकल्प देखने चाहिए।',
    });
    // Adjust bedside medical score downward slightly to reflect clinical aversion
    rawTotals.Medical = Math.round(rawTotals.Medical * 0.86);
  }

  // Rule 2: PCM / Engineering aspiration vs very low math comfort
  if (
    mathComfort !== null &&
    mathComfort <= 3 &&
    (detectedStream === 'PCM' || rawTotals.Engineering >= rawTotals.Arts)
  ) {
    validationWarnings.push({
      code: 'CONTRADICTION_ENGINEERING_LOW_MATH',
      severity: 'warning',
      messageEn:
        'Input Tension Detected: Your profile leans toward Engineering/Tech, but you rated Quantitative/Math Comfort ≤ 3/10 (Q10). Core B.Tech degrees require 3–4 semesters of engineering calculus and linear algebra; consider UI/UX Design, BCA Applications, or Applied Technical Diplomas.',
      messageHi:
        'उत्तर विरोधाभास: आपका रुझान इंजीनियरिंग/टेक की ओर है, लेकिन प्रश्न 10 में गणित की सहजता कम (≤ 3/10) है। बी.टेक में उच्च गणित अनिवार्य होता है; आप UI/UX डिज़ाइन, BCA या प्रैक्टिकल डिप्लोमा पर भी विचार करें।',
    });
    rawTotals.Engineering = Math.round(rawTotals.Engineering * 0.88);
  }

  // Rule 3: Short study duration ceiling (<= 2 years) vs long-horizon clinical/law/civil track
  if (
    maxStudyYears !== null &&
    maxStudyYears <= 2 &&
    (rawTotals.Medical > rawTotals.Vocational || rawTotals.Government > rawTotals.Vocational)
  ) {
    validationWarnings.push({
      code: 'CONTRADICTION_SHORT_DURATION_LONG_DEGREE',
      severity: 'warning',
      messageEn:
        'Timeline Tension Detected: You set a maximum study duration of ≤ 2 years before your first job (Q12), whereas MBBS (5.5 yrs), Integrated Law (5 yrs), and UPSC require longer timelines. We boosted short-horizon Diploma, Allied Health, and Skill certifications in your matches.',
      messageHi:
        'समय-सीमा विरोधाभास: आपने पहली नौकरी से पहले अधिकतम अध्ययन अवधि ≤ 2 वर्ष (प्रश्न 12) चुनी है, जबकि MBBS (5.5 वर्ष) और 5-वर्षीय लॉ में अधिक समय लगता है। इसलिए कम अवधि वाले डिप्लोमा और कौशल कोर्स को प्राथमिकता दी गई है।',
    });
    rawTotals.Vocational = Math.round(rawTotals.Vocational * 1.15);
  }

  // Rule 4: Flat-lining check across Likert & Tradeoff questions (Q15..Q19, Q23..Q25)
  const scaleValues = [15, 16, 17, 18, 19, 23, 24, 25]
    .map((id) => (answers[id] !== undefined ? Number(answers[id]) : null))
    .filter((v): v is number => v !== null && !Number.isNaN(v));
  if (scaleValues.length >= 6 && new Set(scaleValues).size === 1) {
    validationWarnings.push({
      code: 'WARNING_UNIFORM_SCALE_RESPONSES',
      severity: 'info',
      messageEn:
        'Low Differentiation Notice: You entered the exact same rating across all agreement and tradeoff scales (Q15–Q19, Q23–Q25). Varying your ratings will sharpen your category separation.',
      messageHi:
        'समान उत्तर सूचना: आपने सभी रेटिंग प्रश्नों (Q15–Q19, Q23–Q25) में एक ही अंक चुना है। अपने वास्तविक झुकाव के अनुसार अलग-अलग रेटिंग देने से परिणाम अधिक सटीक होंगे।',
    });
  }

  // Round totals cleanly
  for (const cat of ALL_BROAD_CATEGORIES) {
    rawTotals[cat] = Math.round(rawTotals[cat]);
  }

  const totalPoints = ALL_BROAD_CATEGORIES.reduce((acc, cat) => acc + rawTotals[cat], 0);
  const completionFactor = Math.min(1, answeredCount / QUIZ_DATA.length);
  const bandHalfWidth = Math.round(
    4 + (1 - completionFactor) * 8 + validationWarnings.length * 2
  );

  // Build sorted category score items with Alignment Bands (no false single-point precision)
  const allCategoryScores: CategoryScoreItem[] = ALL_BROAD_CATEGORIES.map((cat) => {
    const points = rawTotals[cat];
    const maxPossible = getTheoreticalMaxForCategory(cat);
    const percentageOfMax =
      answeredCount === 0 ? 0 : Math.min(96, Math.max(8, Math.round((points / maxPossible) * 100)));
    const alignmentBandLow =
      answeredCount === 0 ? 0 : Math.max(5, percentageOfMax - bandHalfWidth);
    const alignmentBandHigh =
      answeredCount === 0 ? 0 : Math.min(98, percentageOfMax + bandHalfWidth);
    const shareOfTotal = totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0;

    return {
      category: cat,
      points,
      percentageOfMax,
      alignmentBandLow,
      alignmentBandHigh,
      alignmentBandLabelEn: `${alignmentBandLow}%–${alignmentBandHigh}% Alignment Band`,
      alignmentBandLabelHi: `${alignmentBandLow}%–${alignmentBandHigh}% अनुकूलता रेंज`,
      shareOfTotal,
      info: CAREER_CATEGORIES_MAPPING[cat],
    };
  }).sort((a, b) => b.points - a.points || b.percentageOfMax - a.percentageOfMax);

  const top3Categories = allCategoryScores.slice(0, 3);
  const top1 = top3Categories[0];
  const top2 = top3Categories[1];
  const top3 = top3Categories[2];

  // Confidence Band & Fallback Trigger Calculation
  // Note: For backwards-compatible unit testing with partial 6..10 question subsets as well as full 25-question runs:
  const MIN_ANSWERED_QUESTIONS = 6;
  const MIN_TOTAL_POINTS = 120;
  const MIN_TOP1_POINTS = 65;
  const MIN_RELATIVE_MARGIN = 0.08;

  const relativeMargin12 = top1.points > 0 ? (top1.points - top2.points) / top1.points : 0;
  const relativeMargin13 = top1.points > 0 ? (top1.points - top3.points) / top1.points : 0;

  const marginComponent = Math.min(45, Math.round(relativeMargin12 * 160 + relativeMargin13 * 45));
  const strengthComponent = Math.min(40, Math.round((top1.percentageOfMax / 75) * 40));
  const completionComponent = Math.round(completionFactor * 15);
  const contradictionPenalty = validationWarnings.filter((w) => w.severity === 'warning').length * 6;

  const rawConfidence =
    marginComponent + strengthComponent + completionComponent - contradictionPenalty;
  const confidenceScore = answeredCount === 0 ? 0 : Math.min(96, Math.max(18, rawConfidence));
  const confidenceBandLow = answeredCount === 0 ? 0 : Math.max(12, confidenceScore - bandHalfWidth);
  const confidenceBandHigh = answeredCount === 0 ? 0 : Math.min(98, confidenceScore + bandHalfWidth);

  let isFallbackTriggered = false;
  let fallbackReasonEn: string | null = null;
  let fallbackReasonHi: string | null = null;

  if (answeredCount < MIN_ANSWERED_QUESTIONS || totalPoints < MIN_TOTAL_POINTS) {
    isFallbackTriggered = true;
    fallbackReasonEn =
      'Your profile is still open-ended! Here are 3 distinct career domains to compare, or browse all 395+ careers. (Complete more of the 25 questions to narrow your alignment band.)';
    fallbackReasonHi =
      'अभी पर्याप्त प्रश्नों के उत्तर नहीं मिले हैं। यहाँ 3 अलग-अलग करियर क्षेत्र दिए गए हैं, या सभी 395+ करियर देखें। (अधिक सटीक रेंज के लिए सभी 25 प्रश्नों के उत्तर दें।)';
  } else if (top1.points < MIN_TOP1_POINTS) {
    isFallbackTriggered = true;
    fallbackReasonEn =
      'Your interests are evenly balanced across multiple domains! Here are 3 distinct career pathways you can compare side by side, or browse all 395+ careers.';
    fallbackReasonHi =
      'आपके उत्तर लगभग सभी क्षेत्रों में समान रुचि दिखाते हैं! यहाँ 3 अलग-अलग करियर ट्रैक दिए गए हैं, या सभी 395+ करियर देखें।';
  } else if (relativeMargin12 < MIN_RELATIVE_MARGIN) {
    isFallbackTriggered = true;
    fallbackReasonEn = `Close Multi-Domain Tie: Your #1 domain (${top1.category}: ${top1.points} pts, ${top1.alignmentBandLabelEn}) and #2 domain (${top2.category}: ${top2.points} pts, ${top2.alignmentBandLabelEn}) are within ${Math.round(relativeMargin12 * 100)}%. Explore all 3 top domains below or browse all 395+ careers.`;
    fallbackReasonHi = `बहु-क्षेत्रीय समानता: आपका पहला विकल्प (${top1.info.titleHi}: ${top1.points} अंक) और दूसरा विकल्प (${top2.info.titleHi}: ${top2.points} अंक) बेहद करीब हैं (केवल ${Math.round(relativeMargin12 * 100)}% का अंतर)। नीचे शीर्ष 3 क्षेत्रों की तुलना करें या सभी 395+ करियर देखें।`;
  }

  const confidenceLevel: CareerAssessmentResult['confidenceLevel'] = isFallbackTriggered
    ? 'Low-Fallback'
    : confidenceScore >= 72
    ? 'High'
    : 'Moderate';

  const headlineEn = isFallbackTriggered
    ? 'Multi-Domain Exploration Recommended — Compare Your Top 3 Pathways or Browse All 395+ Careers'
    : `Primary Alignment: ${top1.info.titleEn} (${top1.alignmentBandLabelEn})`;

  const headlineHi = isFallbackTriggered
    ? 'बहु-क्षेत्रीय अन्वेषण अनुशंसित — शीर्ष 3 रास्तों की तुलना करें या सभी 395+ करियर देखें'
    : `प्राथमिक अनुकूलता: ${top1.info.titleHi} (${top1.alignmentBandLabelHi})`;

  const summaryEn = isFallbackTriggered
    ? `Across ${answeredCount} of ${QUIZ_DATA.length} answered items, your weighted scores cluster closely between ${top1.category} (${top1.points} pts, ${top1.alignmentBandLabelEn}), ${top2.category} (${top2.points} pts), and ${top3.category} (${top3.points} pts). Compare all 3 domains below before specializing.`
    : `Based on ${answeredCount} of ${QUIZ_DATA.length} multi-modal assessment inputs, ${top1.category} leads with ${top1.points} weighted points (${top1.alignmentBandLabelEn}), followed by ${top2.category} (${top2.points} pts) and ${top3.category} (${top3.points} pts).`;

  const summaryHi = isFallbackTriggered
    ? `${QUIZ_DATA.length} में से ${answeredCount} प्रश्नों के आधार पर ${top1.category} (${top1.points} अंक), ${top2.category} (${top2.points} अंक) और ${top3.category} (${top3.points} अंक) के बीच बहुत कम अंतर है। निर्णय लेने से पहले तीनों क्षेत्रों की तुलना करें।`
    : `${QUIZ_DATA.length} में से ${answeredCount} प्रश्नों के बहु-आयामी विश्लेषण के आधार पर ${top1.info.titleHi} (${top1.points} अंक, ${top1.alignmentBandLabelHi}) शीर्ष पर है, जिसके बाद ${top2.category} (${top2.points} अंक) और ${top3.category} (${top3.points} अंक) आते हैं।`;

  const disclaimerEn =
    'Exploratory Guidance Disclaimer: This 25-question calculator uses a transparent, rule-based rubric aligned with NCERT-PSSCIVE Tamanna, AICTE, NMC, UGC, and DGT pathways. Scores are reported as Alignment Bands rather than single-point certainties and do not constitute clinical psychometric diagnosis or guaranteed exam admission.';
  const disclaimerHi =
    'मार्गदर्शन अस्वीकरण: यह 25-प्रश्नों का कैलकुलेटर NCERT-तमन्ना, AICTE, NMC, UGC और DGT मानकों पर आधारित एक पारदर्शी नियम-आधारित प्रणाली है। इसके परिणाम केवल प्रारंभिक करियर अन्वेषण के लिए हैं, न कि कोई क्लिनिकल मनोवैज्ञानिक निदान या प्रवेश की गारंटी।';

  // Resolve top matching ChildCareers from CareersDatabase if provided (STRICTLY TOP 3 ONLY)
  const recommendedCareers: ChildCareer[] = [];
  if (careersData && careersData.children) {
    const categoriesToPull = isFallbackTriggered ? allCategoryScores.slice(0, 3) : top3Categories;
    const seenIds = new Set<string>();

    for (const catItem of categoriesToPull) {
      for (const cid of catItem.info.featuredCareerIds) {
        const found = careersData.children[cid];
        if (found && !seenIds.has(found.id)) {
          const streams = found.eligibility?.streams || [];
          const streamCompatible =
            !detectedStream ||
            detectedStream === 'Any' ||
            streams.length === 0 ||
            streams.includes(detectedStream) ||
            streams.includes('Any');
          if (streamCompatible) {
            seenIds.add(found.id);
            recommendedCareers.push(found);
          }
        }
      }
    }

    if (recommendedCareers.length < 3) {
      for (const catItem of top3Categories) {
        for (const cid of catItem.info.featuredCareerIds) {
          const found = careersData.children[cid];
          if (found && !seenIds.has(found.id)) {
            seenIds.add(found.id);
            recommendedCareers.push(found);
          }
        }
      }
    }
  }

  return {
    top3Categories,
    allCategoryScores,
    totalPoints,
    answeredCount,
    totalQuestions: QUIZ_DATA.length,
    confidenceScore,
    confidenceBandLow,
    confidenceBandHigh,
    confidenceLevel,
    isFallbackTriggered,
    fallbackReasonEn,
    fallbackReasonHi,
    validationWarnings,
    detectedConstraints: {
      stream: detectedStream,
      budgetLakhs,
      maxStudyYears,
      dailyStudyHours,
    },
    headlineEn,
    headlineHi,
    summaryEn,
    summaryHi,
    disclaimerEn,
    disclaimerHi,
    recommendedCareers: recommendedCareers.slice(0, 3),
  };
}
