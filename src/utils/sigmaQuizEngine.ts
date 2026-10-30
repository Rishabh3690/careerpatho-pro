import { CareersDatabase, ChildCareer } from '../data/types';

export type BroadCareerCategory =
  | 'Engineering'
  | 'Medical'
  | 'Commerce'
  | 'Arts'
  | 'Government'
  | 'Vocational';

export interface QuizOption {
  id: string;
  textEn: string;
  textHi: string;
  weights: Partial<Record<BroadCareerCategory, number>>;
  preferredStreams?: string[];
  tags?: string[];
}

export interface QuizQuestion {
  id: number;
  traitKey: string;
  traitLabelEn: string;
  traitLabelHi: string;
  questionEn: string;
  questionHi: string;
  helperEn: string;
  helperHi: string;
  options: QuizOption[];
}

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
  shareOfTotal: number;
  info: CategoryMappingInfo;
}

export interface SigmaQuizResult {
  top3Categories: CategoryScoreItem[];
  allCategoryScores: CategoryScoreItem[];
  totalPoints: number;
  answeredCount: number;
  confidenceScore: number; // 0 to 100
  confidenceLevel: 'High' | 'Moderate' | 'Low-Fallback';
  isFallbackTriggered: boolean;
  fallbackReasonEn: string | null;
  fallbackReasonHi: string | null;
  headlineEn: string;
  headlineHi: string;
  summaryEn: string;
  summaryHi: string;
  recommendedCareers: ChildCareer[];
  bestCareerMatch?: ChildCareer | null;
  bestCareerMatchScore?: number;
  bestCareerReasonEn?: string;
  bestCareerReasonHi?: string;
}

/**
 * CAREER_CATEGORIES_MAPPING
 * Maps the 6 core broad categories used in the Sigma Algorithm to CareerPathO's database categories,
 * bilingual explanations, entrance exams, and canonical career IDs.
 */
export const CAREER_CATEGORIES_MAPPING: Record<BroadCareerCategory, CategoryMappingInfo> = {
  Engineering: {
    category: 'Engineering',
    dbCategoryIds: ['engineering', 'science'],
    titleEn: 'Engineering, Software & Frontier Tech',
    titleHi: 'इंजीनियरिंग, सॉफ्टवेयर और भविष्य की तकनीक (Tech & Science)',
    descriptionEn:
      'Building software systems, AI models, semiconductor chips, core infrastructure, and scientific research.',
    descriptionHi:
      'सॉफ्टवेयर, आर्टिफिशियल इंटेलिजेंस (AI), सेमीकंडक्टर चिप्स, मशीनरी और वैज्ञानिक अनुसंधान का निर्माण।',
    whyItFitsEn:
      'Matches your strong analytical logic, structured problem-solving, and interest in technology or machines.',
    whyItFitsHi:
      'आपकी तार्किक क्षमता (Logic), गणितीय समझ और नई तकनीक व मशीनों में रुचि से सीधा मेल खाता है।',
    topExams: ['JEE Main / Advanced', 'GATE', 'BITSAT', 'CUET-UG', 'IAT (IISER)'],
    typicalDegrees: ['B.Tech (CSE / AI / ECE / Mech)', 'BCA + MCA', 'B.Sc Data Science / BS-MS'],
    avgEntrySalary: '₹6 – ₹24 LPA',
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
    titleEn: 'Medical, Healthcare & Bio-Sciences',
    titleHi: 'मेडिकल, स्वास्थ्य सेवा और बायो-साइंस (Healthcare & Bio)',
    descriptionEn:
      'Clinical medicine, surgery, nursing, pharmacy, biotechnology, diagnostics, and hospital care.',
    descriptionHi:
      'डॉक्टर, नर्सिंग, फार्मेसी, बायोटेक्नोलॉजी, न्यूक्लियर मेडिसिन और अस्पताल स्वास्थ्य सेवाएं।',
    whyItFitsEn:
      'Aligns with your interest in biology, human health, lab/clinical work, and impactful patient service.',
    whyItFitsHi:
      'जीव विज्ञान (Biology), मानव स्वास्थ्य, लैब/अस्पताल कार्य और समाज सेवा के आपके जज्बे के अनुकूल है।',
    topExams: ['NEET-UG', 'AIIMS Paramedical / Nursing', 'CUET (Bio/Pharma)', 'GPAT'],
    typicalDegrees: ['MBBS / BDS / BAMS', 'B.Sc Nursing / Paramedical', 'B.Pharm / B.Tech Biotech'],
    avgEntrySalary: '₹5 – ₹18 LPA',
    featuredCareerIds: [
      'mbbs-clinical',
      'nursing-icu',
      'b-pharm-ind',
      'nuclear-medicine-tech',
      'bioinformatics-computational-bio',
      'clinical-embryology',
    ],
  },
  Commerce: {
    category: 'Commerce',
    dbCategoryIds: ['commerce'],
    titleEn: 'Commerce, Finance, CA & Corporate Management',
    titleHi: 'कॉमर्स, फाइनेंस, CA और कॉरपोरेट मैनेजमेंट (Business & Finance)',
    descriptionEn:
      'Chartered Accountancy, Investment Banking, MBA leadership, Quant Finance, FinTech, and Entrepreneurship.',
    descriptionHi:
      'चार्टर्ड अकाउंटेंट (CA), इन्वेस्टमेंट बैंकिंग, MBA, शेयर बाजार, फिनटेक और व्यापार प्रबंधन।',
    whyItFitsEn:
      'Fits your comfort with numbers, money management, business strategy, and high corporate wealth creation.',
    whyItFitsHi:
      'अंकों की समझ, व्यापारिक सोच, फाइनेंस और उच्च कॉरपोरेट पैकेज के आपके लक्ष्य से मेल खाता है।',
    topExams: ['ICAI CA Foundation', 'CAT / XAT', 'IPMAT (IIM)', 'CFA', 'CUET Commerce'],
    typicalDegrees: ['CA / CS / CMA', 'BBA / BMS + MBA', 'B.Com (Hons) / B.Sc Finance'],
    featuredCareerIds: [
      'ca-audit',
      'cfa-investment',
      'mba-marketing-pm',
      'quant-finance-india',
      'actuarial-science',
      'quant-fintech',
    ],
    avgEntrySalary: '₹7 – ₹25 LPA',
  },
  Arts: {
    category: 'Arts',
    dbCategoryIds: ['arts', 'design', 'law'],
    titleEn: 'Arts, Design, Law, Media & Creative Strategy',
    titleHi: 'आर्ट्स, डिजाइन (UX), कानून (Law), मीडिया और क्रिएटिव क्षेत्र',
    descriptionEn:
      'Corporate & Constitutional Law, Product UI/UX Design, Psychology, Policy, Journalism, and Digital Media.',
    descriptionHi:
      'कॉरपोरेट वकालत (CLAT), प्रोडक्ट UI/UX डिजाइन, मनोविज्ञान, पत्रकारिता और क्रिएटिव मीडिया।',
    whyItFitsEn:
      'Matches your creative thinking, communication strength, visual/human understanding, and independent expression.',
    whyItFitsHi:
      'आपकी रचनात्मक सोच (Creativity), संवाद कौशल, कानून/समाज की समझ और स्वतंत्र कार्यशैली के अनुकूल है।',
    topExams: ['CLAT / AILET', 'UCEED / NID DAT', 'CUET Humanities', 'NIFT'],
    typicalDegrees: ['BA LL.B (Hons)', 'B.Des (UI/UX / Product)', 'BA Psychology / Economics / Media'],
    avgEntrySalary: '₹6 – ₹20 LPA',
    featuredCareerIds: [
      'ba-llb-corp',
      'bdes-ux-product',
      'ba-psychology',
      'public-policy',
      'spatial-xr-design',
      'tech-law-privacy',
    ],
  },
  Government: {
    category: 'Government',
    dbCategoryIds: ['government', 'defense'],
    titleEn: 'Government Services, UPSC, Defense & PSU Leadership',
    titleHi: 'सरकारी सेवा, UPSC (IAS/IPS), रक्षा (NDA/CDS) और PSU अधिकारी',
    descriptionEn:
      'Civil Services (IAS/IPS), Armed Forces Officer (NDA/CDS), Banking (RBI/SBI PO), Railways, and State PSC.',
    descriptionHi:
      'प्रशासनिक सेवा (IAS/IPS), भारतीय सेना अधिकारी (NDA/CDS), RBI/बैंक PO, रेलवे और राज्य पीएससी।',
    whyItFitsEn:
      'Ideal for your desire for job security, social status, public authority, and direct nation-building impact.',
    whyItFitsHi:
      'नौकरी की 100% सुरक्षा, सामाजिक प्रतिष्ठा, प्रशासनिक अधिकार और देश सेवा के आपके लक्ष्य के लिए सर्वोत्तम।',
    topExams: ['UPSC CSE', 'NDA / CDS / AFCAT', 'SSC CGL', 'RBI Grade B / IBPS PO', 'State PSC'],
    typicalDegrees: ['Any Graduation (BA / B.Sc / B.Tech / B.Com)', 'NDA (After 12th)'],
    avgEntrySalary: '₹8 – ₹16 LPA + Govt Perks & Allowances',
    featuredCareerIds: [
      'upsc-ias',
      'defense-officer',
      'rbi-sebi-nabard',
      'ssc-cgl-inspector',
      'psu-gate-officer',
      'judicial-magistrate',
    ],
  },
  Vocational: {
    category: 'Vocational',
    dbCategoryIds: ['vocational'],
    titleEn: 'Vocational, Skill Diplomas, Aviation & Early-Job Tracks',
    titleHi: 'वोकेशनल, पॉलिटेक्निक डिप्लोमा, एविएशन और त्वरित रोजगार ट्रैक',
    descriptionEn:
      'Polytechnic Engineering Diplomas, Commercial Pilot, Merchant Navy, Cloud/IT Certifications, and Paramedical Diplomas.',
    descriptionHi:
      'पॉलिटेक्निक डिप्लोमा, मर्चेंट नेवी, कमर्शियल पायलट, आईटी स्किल सर्टिफिकेशन और त्वरित जॉब कोर्स।',
    whyItFitsEn:
      'Best for practical hands-on learners who want fast job readiness after Class 10/12 with high ROI.',
    whyItFitsHi:
      'व्यावहारिक कौशल (Hands-on work) और 10वीं/12वीं के बाद कम समय में अच्छी नौकरी पाने के लिए सबसे उपयुक्त।',
    topExams: ['State Polytechnic JEECUP / CET', 'IMU-CET (Merchant Navy)', 'DGCA CPL', 'ITI / NSDC'],
    typicalDegrees: ['3-Yr Polytechnic Diploma', 'B.Voc Degree', 'DGCA CPL / Merchant Navy B.Sc Nautical'],
    avgEntrySalary: '₹4 – ₹15 LPA',
    featuredCareerIds: [
      'navy-marine-deck',
      'pilot-cpl',
      'polytechnic-diploma-je',
      'atc-aai-aviation',
      'ame-aircraft-maintenance',
      'aircraft-maintenance-ame',
    ],
  },
};

/**
 * QUIZ_DATA
 * 10 Relatable, Bilingual (English + Hindi) Career Aptitude Questions for Indian Students
 * Covers all 10 mandated traits with zero complex jargon.
 */
export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    traitKey: 'stream_background',
    traitLabelEn: '1. Stream & Academic Background',
    traitLabelHi: '1. आपकी स्ट्रीम और पढ़ाई की पृष्ठभूमि',
    questionEn: 'Which stream or subject group are you currently studying (or planning to choose in Class 11/12)?',
    questionHi: 'अभी आप किस स्ट्रीम या विषय समूह में पढ़ाई कर रहे हैं (या 11वीं/12वीं में चुनना चाहते हैं)?',
    helperEn: 'Choose the closest match to your current subjects.',
    helperHi: 'अपने वर्तमान विषयों के सबसे करीब वाला विकल्प चुनें।',
    options: [
      {
        id: 'q1_pcm',
        textEn: 'Science with Maths (PCM — Physics, Chemistry, Maths)',
        textHi: 'साइंस - गणित (PCM — फिजिक्स, केमिस्ट्री, मैथ्स)',
        weights: { Engineering: 30, Vocational: 10, Government: 10, Commerce: 8 },
        preferredStreams: ['PCM'],
      },
      {
        id: 'q1_pcb',
        textEn: 'Science with Biology (PCB — Physics, Chemistry, Biology)',
        textHi: 'साइंस - बायोलॉजी (PCB — फिजिक्स, केमिस्ट्री, बायो)',
        weights: { Medical: 32, Vocational: 8, Government: 8 },
        preferredStreams: ['PCB'],
      },
      {
        id: 'q1_commerce',
        textEn: 'Commerce (Accounts, Business Studies, Economics)',
        textHi: 'कॉमर्स (अकाउंट्स, बिजनेस स्टडीज, इकोनॉमिक्स)',
        weights: { Commerce: 30, Government: 12, Arts: 8 },
        preferredStreams: ['Commerce'],
      },
      {
        id: 'q1_arts',
        textEn: 'Arts / Humanities (History, Political Science, Psychology, Literature)',
        textHi: 'आर्ट्स / ह्यूमैनिटीज (इतिहास, राजनीति विज्ञान, मनोविज्ञान, साहित्य)',
        weights: { Arts: 28, Government: 22 },
        preferredStreams: ['Arts'],
      },
      {
        id: 'q1_vocational',
        textEn: 'Class 10 Student / ITI / Polytechnic Diploma / Open to Any Stream',
        textHi: 'कक्षा 10 के छात्र / पॉलिटेक्निक डिप्लोमा / अभी स्ट्रीम तय नहीं है',
        weights: { Vocational: 26, Engineering: 12, Government: 12, Commerce: 10, Arts: 10 },
        preferredStreams: ['Any'],
      },
    ],
  },
  {
    id: 2,
    traitKey: 'work_style',
    traitLabelEn: '2. Daily Work Environment',
    traitLabelHi: '2. काम करने का पसंदीदा माहौल (Work Style)',
    questionEn: 'Where do you see yourself working happiest every day after finishing your studies?',
    questionHi: 'पढ़ाई पूरी करने के बाद आप रोज़ किस तरह के माहौल में काम करना सबसे ज्यादा पसंद करेंगे?',
    helperEn: 'Imagine your regular Monday morning at work.',
    helperHi: 'सोचिए कि आप हर दिन कहाँ काम करते हुए सबसे खुश रहेंगे।',
    options: [
      {
        id: 'q2_desk',
        textEn: 'At a computer desk or modern office (Coding, Finance, Data, Corporate Strategy)',
        textHi: 'लैपटॉप/कंप्यूटर डेस्क और आधुनिक ऑफिस में (कोडिंग, फाइनेंस, डेटा या मैनेजमेंट)',
        weights: { Engineering: 22, Commerce: 22, Arts: 8 },
      },
      {
        id: 'q2_field',
        textEn: 'In the field, public administration, defense, ships, or infrastructure sites',
        textHi: 'फील्ड में, प्रशासनिक दौरे पर, सेना/नेवी में या बड़े प्रोजेक्ट साइट्स पर',
        weights: { Government: 26, Vocational: 20, Engineering: 10 },
      },
      {
        id: 'q2_lab',
        textEn: 'In a hospital, clinical care center, or scientific research laboratory',
        textHi: 'अस्पताल में मरीजों के बीच, क्लिनिक में या वैज्ञानिक रिसर्च लैब में',
        weights: { Medical: 28, Engineering: 8 },
      },
      {
        id: 'q2_creative',
        textEn: 'In a design studio, courtroom, media house, or flexible work-from-home setup',
        textHi: 'डिजाइन स्टूडियो, कोर्ट रूम, मीडिया हाउस या घर से स्वतंत्र काम (Remote/Studio)',
        weights: { Arts: 28, Engineering: 10, Commerce: 8 },
      },
    ],
  },
  {
    id: 3,
    traitKey: 'math_logic',
    traitLabelEn: '3. Comfort with Maths & Calculations',
    traitLabelHi: '3. गणित और तार्किक सवालों (Maths & Logic) के साथ सहजता',
    questionEn: 'How do you feel when solving Maths, puzzles, or numerical calculations?',
    questionHi: 'गणित के सवाल, कैलकुलेशन या लॉजिकल पहेलियाँ हल करते समय आपको कैसा लगता है?',
    helperEn: 'Be completely honest—many top careers do not need heavy Maths!',
    helperHi: 'पूरी ईमानदारी से चुनें — कई बेहतरीन करियर में कठिन गणित की जरूरत नहीं होती!',
    options: [
      {
        id: 'q3_love_math',
        textEn: 'I enjoy tough Maths, coding logic, and complex formulas',
        textHi: 'मुझे कठिन गणित, कोडिंग लॉजिक और फॉर्मूले हल करना बहुत पसंद है',
        weights: { Engineering: 26, Commerce: 16 },
      },
      {
        id: 'q3_business_math',
        textEn: 'I am good with practical numbers (money, accounts, profit-loss, data tables)',
        textHi: 'मुझे व्यावहारिक हिसाब-किताब (पैसा, अकाउंट्स, लाभ-हानि, डेटा) पसंद है',
        weights: { Commerce: 26, Government: 14, Vocational: 10 },
      },
      {
        id: 'q3_basic_math',
        textEn: 'I can manage basic 10th-level Maths for entrance exams, but prefer theory/science',
        textHi: 'मैं 10वीं स्तर की सामान्य गणित कर लेता हूँ, पर मुझे थ्योरी या साइंस ज्यादा पसंद है',
        weights: { Medical: 20, Government: 18, Vocational: 14 },
      },
      {
        id: 'q3_no_math',
        textEn: 'I dislike Maths and want a strong career focused on reading, creativity, or biology',
        textHi: 'मुझे गणित पसंद नहीं है — मैं पढ़ने-लिखने, क्रिएटिविटी या बायोलॉजी वाला करियर चाहता हूँ',
        weights: { Arts: 26, Medical: 18, Government: 10 },
      },
    ],
  },
  {
    id: 4,
    traitKey: 'people_interaction',
    traitLabelEn: '4. Working with People vs Machines',
    traitLabelHi: '4. लोगों से बातचीत बनाम शांत फोकस (Introvert vs Extrovert)',
    questionEn: 'How much daily interaction with people or the public do you prefer in your job?',
    questionHi: 'अपनी नौकरी में आप रोज़ाना लोगों या आम जनता के साथ कितना जुड़ना पसंद करेंगे?',
    helperEn: 'Do you gain energy from quiet focus or from talking to people?',
    helperHi: 'क्या आपको शांत रहकर काम करना पसंद है या लोगों का नेतृत्व करना?',
    options: [
      {
        id: 'q4_introvert',
        textEn: 'Quiet deep focus — working with code, machines, lab instruments, or financial data',
        textHi: 'शांत एकाग्रता — कंप्यूटर कोड, मशीनों, लैब उपकरणों या डेटा के साथ काम करना',
        weights: { Engineering: 24, Vocational: 16, Commerce: 10 },
      },
      {
        id: 'q4_helping',
        textEn: 'One-on-one care & counseling — helping patients, clients, or individuals solve problems',
        textHi: 'एक-एक व्यक्ति की सीधी मदद — मरीजों का इलाज, कानूनी सलाह या काउंसलिंग',
        weights: { Medical: 26, Arts: 18 },
      },
      {
        id: 'q4_team',
        textEn: 'Corporate teamwork — managing business deals, teams, and client presentations',
        textHi: 'ऑफिस टीमवर्क — बिजनेस मीटिंग्स, क्लाइंट प्रेजेंटेशन और टीम मैनेजमेंट',
        weights: { Commerce: 24, Engineering: 12, Arts: 12 },
      },
      {
        id: 'q4_public',
        textEn: 'Public leadership — commanding officers, addressing citizens, or arguing in court',
        textHi: 'जन-नेतृत्व — प्रशासन चलाना, जनता की समस्याएं सुनना या कोर्ट में बहस करना',
        weights: { Government: 28, Arts: 18 },
      },
    ],
  },
  {
    id: 5,
    traitKey: 'risk_appetite',
    traitLabelEn: '5. Job Security vs High-Growth Risk',
    traitLabelHi: '5. सरकारी सुरक्षा बनाम प्राइवेट ग्रोथ और बिजनेस',
    questionEn: 'What matters more to you when comparing a Government job vs a Private/Business career?',
    questionHi: 'सरकारी नौकरी बनाम प्राइवेट कंपनी या खुद के काम में आपके लिए क्या सबसे महत्वपूर्ण है?',
    helperEn: 'Think about your family priorities and personal ambition.',
    helperHi: 'अपने परिवार की प्राथमिकताओं और अपने सपनों को ध्यान में रखकर चुनें।',
    options: [
      {
        id: 'q5_govt_stability',
        textEn: '100% Permanent Govt job security, pension/allowances, and social respect',
        textHi: '100% पक्की सरकारी नौकरी की सुरक्षा, भत्ते और समाज में सम्मान',
        weights: { Government: 30, Medical: 10, Vocational: 8 },
      },
      {
        id: 'q5_mnc_growth',
        textEn: 'Fast salary growth in top MNCs/Hospitals (starting ₹10L+ and doubling in 4–5 years)',
        textHi: 'बड़ी प्राइवेट कंपनियों/अस्पतालों में तेज़ सैलरी ग्रोथ (4–5 साल में पैकेज दोगुना)',
        weights: { Engineering: 24, Commerce: 20, Medical: 14 },
      },
      {
        id: 'q5_startup_practice',
        textEn: 'Building my own startup, business, independent clinic, law chamber, or freelance studio',
        textHi: 'अपना खुद का स्टार्टअप, बिजनेस, क्लिनिक, लॉ चैंबर या डिजाइन स्टूडियो शुरू करना',
        weights: { Commerce: 24, Arts: 22, Medical: 14, Engineering: 12 },
      },
      {
        id: 'q5_practical_skill',
        textEn: 'A reliable technical skill that guarantees immediate employment anywhere in India or abroad',
        textHi: 'ऐसा पक्का तकनीकी हुनर जिससे भारत या विदेश में तुरंत नौकरी मिल सके',
        weights: { Vocational: 28, Engineering: 14, Medical: 10 },
      },
    ],
  },
  {
    id: 6,
    traitKey: 'time_horizon',
    traitLabelEn: '6. Time Horizon to First Salary',
    traitLabelHi: '6. पहली सैलरी शुरू होने का समय (Time Horizon)',
    questionEn: 'How many years after Class 12 can you and your family wait before you start earning?',
    questionHi: '12वीं के बाद अपनी पहली कमाई शुरू करने के लिए आप और आपका परिवार कितने साल दे सकते हैं?',
    helperEn: 'Different careers take different years to start paying well.',
    helperHi: 'हर करियर में पढ़ाई पूरी करके कमाई शुरू करने का समय अलग होता है।',
    options: [
      {
        id: 'q6_quick',
        textEn: 'Need a job quickly within 1 to 3 years (Diploma, Skill Cert, Paramedical, Defense entry)',
        textHi: '1 से 3 साल के भीतर जल्दी नौकरी चाहिए (डिप्लोमा, स्किल कोर्स, पैरामेडिकल, डिफेंस)',
        weights: { Vocational: 30, Government: 14, Commerce: 8 },
      },
      {
        id: 'q6_standard',
        textEn: '3 to 4 years — Standard Graduation/B.Tech followed by immediate campus placement',
        textHi: '3 से 4 साल — ग्रेजुएशन/B.Tech पूरी करते ही तुरंत अच्छी कैंपस प्लेसमेंट',
        weights: { Engineering: 26, Commerce: 20, Arts: 16 },
      },
      {
        id: 'q6_medium',
        textEn: '4 to 5 years — Integrated degree (BA LL.B / BBA+MBA / CA / UPSC preparation)',
        textHi: '4 से 5 साल — इंटीग्रेटेड डिग्री (BA LL.B / CA / MBA) या सरकारी परीक्षा की तैयारी',
        weights: { Commerce: 22, Arts: 22, Government: 22 },
      },
      {
        id: 64 as unknown as string,
        textEn: '5.5 to 8+ years — Ready for long rigorous study (MBBS + MD or deep research)',
        textHi: '5.5 से 8+ साल — लंबी और गहन पढ़ाई (MBBS + MD डॉक्टर या वैज्ञानिक रिसर्च) के लिए तैयार',
        weights: { Medical: 30, Engineering: 10 },
      },
    ],
  },
  {
    id: 7,
    traitKey: 'budget_constraints',
    traitLabelEn: '7. Family College Fee Budget & ROI',
    traitLabelHi: '7. कॉलेज फीस बजट और शिक्षा ऋण (Budget & ROI)',
    questionEn: 'What is your realistic total budget for college fees after Class 12?',
    questionHi: '12वीं के बाद कॉलेज की पूरी पढ़ाई के लिए आपके परिवार का बजट क्या है?',
    helperEn: 'Include whether you prefer low-fee Govt colleges or PM-Vidyalaxmi education loans.',
    helperHi: 'कम फीस वाले सरकारी कॉलेज या एजुकेशन लोन की सुविधा को ध्यान में रखकर चुनें।',
    options: [
      {
        id: 'q7_ultra_low',
        textEn: 'Under ₹1.5 Lakhs total — Need Govt college, Polytechnic, ICAI CA, or scholarship track',
        textHi: 'कुल ₹1.5 लाख से कम — सरकारी कॉलेज, पॉलिटेक्निक, CA या छात्रवृत्ति वाला कोर्स चाहिए',
        weights: { Government: 22, Vocational: 24, Commerce: 18, Arts: 14 },
      },
      {
        id: 'q7_moderate_roi',
        textEn: '₹2 Lakhs to ₹6 Lakhs — Want high ROI where first year salary recovers full college fee',
        textHi: '₹2 से ₹6 लाख — ऐसा कोर्स जहाँ पहले ही साल की सैलरी से पूरी फीस वसूल हो जाए (High ROI)',
        weights: { Engineering: 24, Commerce: 20, Vocational: 16, Medical: 12 },
      },
      {
        id: 'q7_loan_ready',
        textEn: '₹6 Lakhs to ₹15 Lakhs — Fine with NIT/IIIT/NLU/IIM fees using collateral-free Govt Education Loan',
        textHi: '₹6 से ₹15 लाख — अच्छे कॉलेज (NIT/IIIT/NLU/MBA) के लिए PM-Vidyalaxmi एजुकेशन लोन ले सकते हैं',
        weights: { Engineering: 22, Arts: 20, Commerce: 20 },
      },
      {
        id: 'q7_flexible',
        textEn: '₹15 Lakhs+ or Merit Govt Seat — Budget is flexible if the career is prestigious',
        textHi: '₹15 लाख+ या सरकारी मेरिट सीट — यदि करियर शानदार हो तो बजट या लोन की समस्या नहीं है',
        weights: { Medical: 24, Engineering: 18, Commerce: 18, Arts: 14 },
      },
    ],
  },
  {
    id: 8,
    traitKey: 'subject_interest',
    traitLabelEn: '8. Core Subject & Topic Curiosity',
    traitLabelHi: '8. किस विषय के बारे में पढ़ना या जानना सबसे अच्छा लगता है?',
    questionEn: 'If you watch a 20-minute video or read an article today, which topic grabs your attention first?',
    questionHi: 'यदि आज आप 20 मिनट का कोई वीडियो देखें या किताब पढ़ें, तो कौन सा विषय आपको सबसे ज्यादा आकर्षित करेगा?',
    helperEn: 'Your natural curiosity is the strongest predictor of long-term success.',
    helperHi: 'आपकी स्वाभाविक जिज्ञासा ही लंबे समय में आपकी सबसे बड़ी ताकत बनेगी।',
    options: [
      {
        id: 'q8_code_machines',
        textEn: 'How AI, apps, video games, rockets, semiconductors, and machines work',
        textHi: 'AI, मोबाइल ऐप्स, कंप्यूटर कोडिंग, रॉकेट, सेमीकंडक्टर चिप्स और मशीनें कैसे काम करती हैं',
        weights: { Engineering: 30, Vocational: 14 },
      },
      {
        id: 'q8_human_body',
        textEn: 'How the human body, brain, medicines, genetics, and surgeries save lives',
        textHi: 'मानव शरीर, मस्तिष्क, दवाइयां, डीएनए और सर्जरी कैसे लोगों की जान बचाती हैं',
        weights: { Medical: 32 },
      },
      {
        id: 'q8_money_markets',
        textEn: 'How companies make crores, stock markets move, taxes work, and brands grow',
        textHi: 'कंपनियां करोड़ों कैसे कमाती हैं, शेयर बाजार, टैक्स, बैंकिंग और बिजनेस कैसे चलते हैं',
        weights: { Commerce: 32 },
      },
      {
        id: 'q8_law_polity',
        textEn: 'How the Constitution, Supreme Court, IAS officers, foreign policy, and defense operate',
        textHi: 'संविधान, सुप्रीम कोर्ट, IAS/IPS अधिकारी, देश की सुरक्षा और सरकारी नीतियां कैसे काम करती हैं',
        weights: { Government: 28, Arts: 20 },
      },
      {
        id: 'q8_design_psychology',
        textEn: 'Visual design, animation, architecture, human psychology, and storytelling',
        textHi: 'डिजाइन, एनिमेशन, आर्किटेक्चर, मानव मनोविज्ञान (Psychology) और क्रिएटिव लेखन',
        weights: { Arts: 30, Vocational: 10 },
      },
    ],
  },
  {
    id: 9,
    traitKey: 'problem_solving_style',
    traitLabelEn: '9. Problem-Solving Approach',
    traitLabelHi: '9. किसी नई समस्या को सुलझाने का आपका तरीका',
    questionEn: 'When you face a difficult problem in school or life, how do you naturally solve it?',
    questionHi: 'जब आपके सामने पढ़ाई या जीवन में कोई कठिन समस्या आती है, तो आप उसे कैसे सुलझाते हैं?',
    helperEn: 'Choose the style that feels most natural to you.',
    helperHi: 'वह तरीका चुनें जो आपके स्वभाव के सबसे करीब हो।',
    options: [
      {
        id: 'q9_logical_system',
        textEn: 'Break it into logical steps, write code/formulas, and test until it works',
        textHi: 'उसे छोटे-छोटे तार्किक हिस्सों (Logic/Steps) में बांटकर फॉर्मूले या प्रयोग से हल करता हूँ',
        weights: { Engineering: 26, Medical: 14 },
      },
      {
        id: 'q9_structured_rules',
        textEn: 'Follow established rules, laws, financial audits, or official standard operating procedures',
        textHi: 'तय नियमों, कानूनों, हिसाब-किताब और आधिकारिक प्रक्रिया (Rules & Discipline) का पालन करता हूँ',
        weights: { Government: 24, Commerce: 24 },
      },
      {
        id: 'q9_hands_on_fix',
        textEn: 'Use practical tools and hands-on action immediately instead of reading long theories',
        textHi: 'लंबी थ्योरी पढ़ने के बजाय सीधे अपने हाथों से प्रैक्टिकल करके समाधान निकालता हूँ',
        weights: { Vocational: 28, Medical: 14, Engineering: 12 },
      },
      {
        id: 'q9_creative_abstract',
        textEn: 'Think outside the box—use creativity, empathy, debate, or visual redesign',
        textHi: 'लीक से हटकर (Out-of-the-box) नई क्रिएटिविटी, संवाद या डिजाइन से समाधान खोजता हूँ',
        weights: { Arts: 28, Commerce: 10 },
      },
    ],
  },
  {
    id: 10,
    traitKey: 'ultimate_goal',
    traitLabelEn: '10. Ultimate Life & Career Goal',
    traitLabelHi: '10. आपके करियर का सबसे बड़ा अंतिम लक्ष्य (Ultimate Goal)',
    questionEn: 'Ten years from now, what achievement will make you and your parents proudest?',
    questionHi: 'आज से 10 साल बाद, कौन सी उपलब्धि आपको और आपके माता-पिता को सबसे ज्यादा गर्व महसूस कराएगी?',
    helperEn: 'Pick your #1 long-term motivation.',
    helperHi: 'अपनी सबसे बड़ी प्रेरणा चुनें।',
    options: [
      {
        id: 'q10_wealth',
        textEn: 'Financial freedom — Earning a high package (₹30L–₹1Cr+), buying a home, and building wealth',
        textHi: 'आर्थिक समृद्धि — उच्च पैकेज (₹30 लाख+), परिवार के लिए सुख-सुविधाएं और मजबूत संपत्ति',
        weights: { Commerce: 26, Engineering: 24 },
      },
      {
        id: 'q10_innovation',
        textEn: 'Technological innovation — Building world-class AI, software, chips, or scientific breakthroughs',
        textHi: 'तकनीकी नवाचार — विश्वस्तरीय AI, सॉफ्टवेयर, चिप्स या वैज्ञानिक खोज का हिस्सा बनना',
        weights: { Engineering: 28, Arts: 12 },
      },
      {
        id: 'q10_service',
        textEn: 'Healing & saving lives — Being a respected Doctor, Healthcare leader, or Life-Scientist',
        textHi: 'लोगों की जान बचाना — एक सम्मानित डॉक्टर, स्वास्थ्य विशेषज्ञ या बायो-साइंटिस्ट बनना',
        weights: { Medical: 30 },
      },
      {
        id: 'q10_status_power',
        textEn: 'Authority & Nation Service — Serving as an IAS/IPS Officer, Judge, Defense Officer, or Top Advocate',
        textHi: 'प्रतिष्ठा और देश सेवा — IAS/IPS अधिकारी, जज, सेना अधिकारी या वरिष्ठ वकील बनकर नेतृत्व करना',
        weights: { Government: 30, Arts: 16 },
      },
      {
        id: 'q10_self_reliant',
        textEn: 'Early self-reliance — Supporting my family early with a stable, stress-free technical career',
        textHi: 'जल्द आत्मनिर्भरता — कम खर्च में जल्दी नौकरी पाकर अपने माता-पिता का सहारा बनना',
        weights: { Vocational: 28, Government: 14 },
      },
    ],
  },
];

// Fix option id q6_long to clean string id
QUIZ_DATA[5].options[3].id = 'q6_long';

const ALL_BROAD_CATEGORIES: BroadCareerCategory[] = [
  'Engineering',
  'Medical',
  'Commerce',
  'Arts',
  'Government',
  'Vocational',
];

/**
 * Theoretical maximum points a category can achieve across all 10 questions.
 * Used for normalizing category fit percentages cleanly.
 */
function getTheoreticalMaxForCategory(cat: BroadCareerCategory): number {
  let maxSum = 0;
  for (const q of QUIZ_DATA) {
    let bestInQ = 0;
    for (const opt of q.options) {
      const w = opt.weights[cat] || 0;
      if (w > bestInQ) bestInQ = w;
    }
    maxSum += bestInQ;
  }
  return Math.max(100, maxSum);
}

/**
 * The "Sigma" Deterministic Career Aptitude Scoring Algorithm
 * - Purely mathematical, weighted scoring system in vanilla JS/TS.
 * - Zero LLM/AI calls, zero hallucinations.
 * - Sums points across the 6 broad categories.
 * - Returns the Top 3 matching categories.
 * - Computes a mathematical Confidence Score (0-100) and triggers the Fallback
 *   ("We're not sure, let's look at all options") if the top score is too close to
 *   the second score or if total points / answered questions are too low.
 *
 * @param answers Record mapping question ID (1..10) -> selected option ID (e.g. 'q1_pcm') or option index (0..4)
 * @param careersData Optional CareersDatabase to attach top specific ChildCareer blueprints
 */
export function calculateCareerMatch(
  answers: Record<number, string | number>,
  careersData?: CareersDatabase
): SigmaQuizResult {
  const rawTotals: Record<BroadCareerCategory, number> = {
    Engineering: 0,
    Medical: 0,
    Commerce: 0,
    Arts: 0,
    Government: 0,
    Vocational: 0,
  };

  let answeredCount = 0;
  let detectedStream: string | undefined;

  for (const question of QUIZ_DATA) {
    const rawAns = answers[question.id];
    if (rawAns === undefined || rawAns === null || rawAns === '') continue;

    let selectedOption: QuizOption | undefined;
    if (typeof rawAns === 'number') {
      selectedOption = question.options[rawAns];
    } else {
      selectedOption = question.options.find((o) => o.id === String(rawAns));
      if (!selectedOption && !Number.isNaN(Number(rawAns))) {
        selectedOption = question.options[Number(rawAns)];
      }
    }

    if (!selectedOption) continue;
    answeredCount += 1;

    if (question.id === 1 && selectedOption.preferredStreams?.length) {
      detectedStream = selectedOption.preferredStreams[0];
    }

    for (const cat of ALL_BROAD_CATEGORIES) {
      const pts = selectedOption.weights[cat] || 0;
      rawTotals[cat] += pts;
    }
  }

  const totalPoints = ALL_BROAD_CATEGORIES.reduce((acc, cat) => acc + rawTotals[cat], 0);

  // Build sorted category score items
  const allCategoryScores: CategoryScoreItem[] = ALL_BROAD_CATEGORIES.map((cat) => {
    const points = rawTotals[cat];
    const maxPossible = getTheoreticalMaxForCategory(cat);
    const percentageOfMax = Math.min(99, Math.round((points / maxPossible) * 100));
    const shareOfTotal = totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0;
    return {
      category: cat,
      points,
      percentageOfMax,
      shareOfTotal,
      info: CAREER_CATEGORIES_MAPPING[cat],
    };
  }).sort((a, b) => b.points - a.points || b.percentageOfMax - a.percentageOfMax);

  const top3Categories = allCategoryScores.slice(0, 3);
  const top1 = top3Categories[0];
  const top2 = top3Categories[1];
  const top3 = top3Categories[2];

  // Sigma Confidence Score & Fallback Trigger Calculation
  // Conditions that trigger fallback:
  // 1. Too few questions answered (< 6 out of 10) or totalPoints < 120
  // 2. Top1 score is too close to Top2 score: relative margin (top1 - top2) / top1 < 0.08 (within 8%)
  // 3. Top1 absolute points < 65 (flat distribution across all 6 categories)
  const MIN_ANSWERED_QUESTIONS = 6;
  const MIN_TOTAL_POINTS = 120;
  const MIN_TOP1_POINTS = 65;
  const MIN_RELATIVE_MARGIN = 0.08; // 8% separation required between #1 and #2

  const relativeMargin12 = top1.points > 0 ? (top1.points - top2.points) / top1.points : 0;
  const relativeMargin13 = top1.points > 0 ? (top1.points - top3.points) / top1.points : 0;
  const completionFactor = Math.min(1, answeredCount / QUIZ_DATA.length);

  // Mathematical confidence formula combining separation margin, top1 strength, and completion rate
  const marginComponent = Math.min(45, Math.round(relativeMargin12 * 160 + relativeMargin13 * 45));
  const strengthComponent = Math.min(40, Math.round((top1.percentageOfMax / 85) * 40));
  const completionComponent = Math.round(completionFactor * 15);

  const rawConfidence = marginComponent + strengthComponent + completionComponent;
  const confidenceScore = answeredCount === 0 ? 0 : Math.min(98, Math.max(18, rawConfidence));

  let isFallbackTriggered = false;
  let fallbackReasonEn: string | null = null;
  let fallbackReasonHi: string | null = null;

  if (answeredCount < MIN_ANSWERED_QUESTIONS || totalPoints < MIN_TOTAL_POINTS) {
    isFallbackTriggered = true;
    fallbackReasonEn =
      "Your vibes are mixed! Here are 3 different paths you can explore, or click here to browse all 101 careers. (We're not sure, let's look at all options — Please answer all 10 questions or explore all 6 broad domains below.)";
    fallbackReasonHi =
      'हम पूरी तरह निश्चित नहीं हैं, आइए सभी विकल्पों को देखें — अभी पर्याप्त प्रश्नों के उत्तर नहीं मिले हैं या कुल अंक कम हैं। यहाँ 3 अलग-अलग करियर ट्रैक दिए गए हैं या सभी 101+ करियर देखें।';
  } else if (top1.points < MIN_TOP1_POINTS) {
    isFallbackTriggered = true;
    fallbackReasonEn =
      "Your vibes are mixed! Here are 3 different paths you can explore, or click here to browse all 101 careers. (We're not sure, let's look at all options — Your answers show an evenly balanced interest across almost all domains.)";
    fallbackReasonHi =
      'हम पूरी तरह निश्चित नहीं हैं, आइए सभी विकल्पों को देखें — आपके उत्तर किसी एक क्षेत्र के बजाय लगभग सभी क्षेत्रों में समान रुचि दिखाते हैं। यहाँ 3 अलग-अलग करियर ट्रैक दिए गए हैं या सभी 101+ करियर देखें।';
  } else if (relativeMargin12 < MIN_RELATIVE_MARGIN) {
    isFallbackTriggered = true;
    fallbackReasonEn = `Your vibes are mixed! Here are 3 different paths you can explore, or click here to browse all 101 careers. (We're not sure, let's look at all options — Your #1 match ${top1.category}: ${top1.points} pts and #2 match ${top2.category}: ${top2.points} pts are tied within ${Math.round(relativeMargin12 * 100)}%.)`;
    fallbackReasonHi = `हम पूरी तरह निश्चित नहीं हैं, आइए सभी विकल्पों को देखें — आपका पहला विकल्प (${top1.info.titleHi}: ${top1.points} अंक) और दूसरा विकल्प (${top2.info.titleHi}: ${top2.points} अंक) बेहद करीब हैं (केवल ${Math.round(relativeMargin12 * 100)}% का अंतर)। यहाँ 3 अलग-अलग करियर ट्रैक एक्सप्लोर करें या सभी 101+ करियर देखें!`;
  }

  const confidenceLevel: SigmaQuizResult['confidenceLevel'] = isFallbackTriggered
    ? 'Low-Fallback'
    : confidenceScore >= 75
    ? 'High'
    : 'Moderate';

  const headlineEn = isFallbackTriggered
    ? 'Your vibes are mixed! Here are 3 different paths you can explore, or click here to browse all 101 careers.'
    : `Primary Match: ${top1.info.titleEn} (${confidenceScore}% Confidence)`;

  const headlineHi = isFallbackTriggered
    ? 'आपके रुझान मिले-जुले हैं! यहाँ 3 अलग-अलग रास्ते दिए गए हैं जिन्हें आप चुन सकते हैं, या सभी 101 करियर देखने के लिए यहाँ क्लिक करें।'
    : `सर्वोच्च मिलान: ${top1.info.titleHi} (${confidenceScore}% विश्वास स्कोर)`;

  const summaryEn = isFallbackTriggered
    ? `Your responses distribute points closely across ${top1.category} (${top1.points} pts), ${top2.category} (${top2.points} pts), and ${top3.category} (${top3.points} pts). Rather than forcing a narrow recommendation, we unlocked a side-by-side view of your top 3 categories and all 101+ career pathways.`
    : `Based on your 10-trait assessment, ${top1.category} leads with ${top1.points} weighted points, followed by ${top2.category} (${top2.points} pts) and ${top3.category} (${top3.points} pts).`;

  const summaryHi = isFallbackTriggered
    ? `आपके उत्तरों के अनुसार ${top1.category} (${top1.points} अंक), ${top2.category} (${top2.points} अंक) और ${top3.category} (${top3.points} अंक) के बीच बहुत कम अंतर है। इसलिए गलत सिफारिश थोपने के बजाय हम आपको शीर्ष 3 क्षेत्रों और सभी 101+ विकल्पों का खुला विश्लेषण दिखा रहे हैं।`
    : `10-सूत्रीय मूल्यांकन के आधार पर ${top1.info.titleHi} (${top1.points} अंक) आपके लिए सबसे उपयुक्त है, जिसके बाद ${top2.category} (${top2.points} अंक) और ${top3.category} (${top3.points} अंक) आते हैं।`;

  // Resolve top matching ChildCareers from CareersDatabase if provided
  const recommendedCareers: ChildCareer[] = [];
  if (careersData && careersData.children) {
    const categoriesToPull = isFallbackTriggered ? allCategoryScores.slice(0, 4) : top3Categories;
    const seenIds = new Set<string>();

    for (const catItem of categoriesToPull) {
      for (const cid of catItem.info.featuredCareerIds) {
        const found = careersData.children[cid];
        if (found && !seenIds.has(found.id)) {
          // If student selected a strict stream (e.g. PCB), prioritize compatible careers first
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

    // Fill up to 6 careers if needed
    if (recommendedCareers.length < 6) {
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

  const finalRecommended = recommendedCareers.slice(0, 6);
  const bestCareerMatch = finalRecommended[0] || null;
  const bestCareerMatchScore = bestCareerMatch
    ? Math.min(98, Math.max(76, Math.round(top1.percentageOfMax * 0.6 + confidenceScore * 0.4)))
    : Math.min(96, Math.max(74, top1.percentageOfMax));

  const bestCareerReasonEn = bestCareerMatch
    ? `Selected as your #1 Best Career out of 101+ pathways because it aligns with your ${top1.info.titleEn} strengths (${top1.points} weighted pts), ${
        detectedStream ? `${detectedStream} stream eligibility, ` : ''
      }and offers strong starting compensation (${bestCareerMatch.salaryInr?.entry || '₹8–18 LPA'}) with full ${
        bestCareerMatch.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]'
      } status.`
    : top1.info.whyItFitsEn;

  const bestCareerReasonHi = bestCareerMatch
    ? `101+ करियर विकल्पों में से यह आपके लिए #1 सर्वश्रेष्ठ करियर है क्योंकि यह आपके ${top1.info.titleHi} रुझान (${top1.points} अंक), शुरुआती पैकेज (${bestCareerMatch.salaryInr?.entry || '₹8–18 LPA'}) और ${
        bestCareerMatch.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]'
      } पात्रता से सीधा मेल खाता है।`
    : top1.info.whyItFitsHi;

  return {
    top3Categories,
    allCategoryScores,
    totalPoints,
    answeredCount,
    confidenceScore,
    confidenceLevel,
    isFallbackTriggered,
    fallbackReasonEn,
    fallbackReasonHi,
    headlineEn,
    headlineHi,
    summaryEn,
    summaryHi,
    recommendedCareers: finalRecommended,
    bestCareerMatch,
    bestCareerMatchScore,
    bestCareerReasonEn,
    bestCareerReasonHi,
  };
}
