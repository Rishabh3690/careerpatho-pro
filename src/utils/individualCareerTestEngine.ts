import { ChildCareer } from '../data/types';

export interface IndividualQuestionOption {
  id: string;
  textEn: string;
  textHi: string;
  points: number; // 0 to 100 scale weight for this question
  feedbackEn: string;
  feedbackHi: string;
}

export interface IndividualCareerQuestion {
  id: string;
  stepNumber: number;
  dimension: 'eligibility' | 'daily_work' | 'core_skills' | 'exam_stamina' | 'scenario' | 'work_life' | 'financial_roi';
  dimensionLabelEn: string;
  dimensionLabelHi: string;
  questionEn: string;
  questionHi: string;
  helperEn: string;
  helperHi: string;
  options: IndividualQuestionOption[];
}

export type VerdictTier = 'CAPABLE_STRONG' | 'CAPABLE_CONDITIONAL' | 'RECONSIDER_ALTERNATIVE';

export interface DimensionBreakdown {
  dimension: string;
  labelEn: string;
  labelHi: string;
  scorePct: number;
  status: 'strong' | 'moderate' | 'gap';
}

export interface CareerCapabilityVerdict {
  careerId: string;
  careerTitleEn: string;
  careerTitleHi: string;
  answeredCount: number;
  totalQuestions: number;
  scorePct: number;
  verdictTier: VerdictTier;
  verdictBadgeEn: string;
  verdictBadgeHi: string;
  headlineEn: string;
  headlineHi: string;
  plainSummaryEn: string;
  plainSummaryHi: string;
  strengthsEn: string[];
  strengthsHi: string[];
  gapsToFixEn: string[];
  gapsToFixHi: string[];
  actionPlanEn: string[];
  actionPlanHi: string[];
  dimensionScores: DimensionBreakdown[];
}

export interface PlainLanguageCareerGuide {
  whatIsItEn: string;
  whatIsItHi: string;
  whoCanJoinEn: string;
  whoCanJoinHi: string;
  moneyTruthEn: string;
  moneyTruthHi: string;
  safetyNetEn: string;
  safetyNetHi: string;
}

interface CustomCareerScenario {
  questionEn: string;
  questionHi: string;
  helperEn: string;
  helperHi: string;
  options: IndividualQuestionOption[];
}

const CAREER_SPECIFIC_SCENARIOS: Record<string, CustomCareerScenario> = {
  'btech-cse': {
    questionEn:
      'Real B.Tech CSE Scenario: Imagine an app you built slows down when 10,000 users open it at the same time, and a bug appears in your code at 6 PM. How would you react?',
    questionHi:
      'असली B.Tech CSE स्थिति: मान लीजिए आपके बनाए ऐप पर एक साथ 10,000 यूजर्स आने से वह धीमा हो जाता है और कोड में एरर आ जाता है। आपकी पहली प्रतिक्रिया क्या होगी?',
    helperEn:
      'Software engineers spend 60% of their time debugging logical problems and optimizing systems.',
    helperHi:
      'सॉफ्टवेयर इंजीनियर अपना 60% समय कोड की गलतियां ढूंढने (Debugging) और सिस्टम तेज़ करने में लगाते हैं।',
    options: [
      {
        id: 'sc_high',
        textEn: 'I would check the error logs step-by-step, test which database query or loop is slow, and fix the logic calmly.',
        textHi: 'मैं स्टेप-बाय-स्टेप एरर लॉग्स चेक करूंगा, देखूंगा कौन-सा कोड या डेटाबेस धीमा है, और शांत रहकर उसे ठीक करूंगा।',
        points: 100,
        feedbackEn: 'Strong software engineering mindset: systematic debugging and logical patience.',
        feedbackHi: 'मजबूत सॉफ्टवेयर इंजीनियरिंग सोच: तार्किक धैर्य और स्टेप-बाय-स्टेप समस्या समाधान।',
      },
      {
        id: 'sc_med',
        textEn: 'I would search documentation or ask a senior teammate for guidance to learn how to fix it.',
        textHi: 'मैं डॉक्यूमेंटेशन खोजूंगा या किसी सीनियर से पूछकर उसे ठीक करना सीखूंगा।',
        points: 75,
        feedbackEn: 'Good collaborative attitude; building independent debugging practice will make you stronger.',
        feedbackHi: 'अच्छा सीखने का रवैया; नियमित कोडिंग अभ्यास से आप आत्मनिर्भर बनेंगे।',
      },
      {
        id: 'sc_low',
        textEn: 'Looking at lines of broken code on a computer screen for hours makes me frustrated and exhausted.',
        textHi: 'कंप्यूटर स्क्रीन पर घंटों कोड की गलतियां ढूंढना मुझे बहुत थकाऊ और परेशान करने वाला लगता है।',
        points: 20,
        feedbackEn: 'Warning: Core B.Tech CSE jobs require daily screen-based coding and debugging.',
        feedbackHi: 'चेतावनी: B.Tech CSE की मुख्य नौकरियों में रोज़ स्क्रीन पर कोडिंग और डीबगिंग करनी होती है।',
      },
    ],
  },
  'mbbs-clinical': {
    questionEn:
      'Real MBBS Hospital Scenario: During your hospital internship at 2 AM, an anxious patient arrives with chest pain while 4 other patients are waiting. How do you handle this?',
    questionHi:
      'असली MBBS अस्पताल स्थिति: रात के 2 बजे अस्पताल ड्यूटी के दौरान सीने में दर्द वाला एक घबराया हुआ मरीज आता है, जबकि 4 अन्य मरीज भी इंतजार कर रहे हैं। आप क्या करेंगे?',
    helperEn:
      'Doctors must combine clinical triage (prioritizing life-threatening cases) with calm empathy under sleep pressure.',
    helperHi:
      'डॉक्टरों को कम नींद और दबाव के बीच भी शांत रहकर सबसे गंभीर मरीज को पहले देखना होता है।',
    options: [
      {
        id: 'sc_high',
        textEn: 'Immediately check vital signs & ECG for the chest-pain patient first (triage), reassure the family calmly, and alert the senior resident.',
        textHi: 'तुरंत सीने के दर्द वाले मरीज की जांच (ECG/Vitals) पहले करूंगा, परिवार को शांत करूंगा और सीनियर डॉक्टर को सूचित करूंगा।',
        points: 100,
        feedbackEn: 'Strong clinical temperament: emergency prioritization and calm bedside manner.',
        feedbackHi: 'उत्कृष्ट क्लिनिकल स्वभाव: आपातकालीन प्राथमिकता और शांत निर्णय क्षमता।',
      },
      {
        id: 'sc_med',
        textEn: 'I want to help patients, though night emergencies and hospital pressure feel scary right now.',
        textHi: 'मैं मरीजों की मदद करना चाहता हूँ, हालांकि रात की इमरजेंसी ड्यूटी अभी थोड़ी डरावनी लगती है।',
        points: 70,
        feedbackEn: 'Clinical training builds confidence over 5.5 years, provided you have empathy and biology stamina.',
        feedbackHi: '5.5 साल की ट्रेनिंग से आत्मविश्वास आ जाता है, बशर्ते आपमें सेवा भाव और मेहनत की क्षमता हो।',
      },
      {
        id: 'sc_low',
        textEn: 'I cannot tolerate blood, hospital emergencies, or losing sleep during night shifts.',
        textHi: 'मैं खून, अस्पताल की इमरजेंसी या नाइट शिफ्ट में नींद खराब होना बिल्कुल सहन नहीं कर सकता।',
        points: 15,
        feedbackEn: 'Warning: Clinical MBBS requires mandatory emergency duties and intense hospital residency.',
        feedbackHi: 'चेतावनी: MBBS में अस्पताल की इमरजेंसी ड्यूटी और लंबी रेजिडेंसी अनिवार्य होती है।',
      },
    ],
  },
  'ca-audit': {
    questionEn:
      'Real Chartered Accountancy (CA) Scenario: While auditing a company’s ₹200 Crore balance sheet before the tax deadline, you spot a ₹18 Lakh invoice mismatch. What do you do?',
    questionHi:
      'असली चार्टर्ड अकाउंटेंट (CA) स्थिति: टैक्स डेडलाइन से ठीक पहले ₹200 करोड़ की बैलेंस शीट जांचते समय आपको ₹18 लाख के बिलों में अंतर दिखता है। आप क्या करेंगे?',
    helperEn:
      'CAs sign statutory audits where accuracy, tax law compliance, and ethical integrity are non-negotiable.',
    helperHi:
      'CA के हस्ताक्षर का कानूनी महत्व होता है—यहाँ आंकड़ों की सटीकता और ईमानदारी सबसे जरूरी है।',
    options: [
      {
        id: 'sc_high',
        textEn: 'Trace every ledger entry and bank voucher to find the exact root cause before signing the audit report.',
        textHi: 'ऑडिट रिपोर्ट साइन करने से पहले हर लेजर और बैंक वाउचर की गहराई से जांच करके असली कारण पकड़ूंगा।',
        points: 100,
        feedbackEn: 'Natural auditor instinct: precision with financial numbers and statutory ethics.',
        feedbackHi: 'सच्चे ऑडिटर की पहचान: आंकड़ों की बारीकी और कानूनी ईमानदारी।',
      },
      {
        id: 'sc_med',
        textEn: 'I enjoy business and finance, though checking hundreds of tax rules and vouchers requires extra focus for me.',
        textHi: 'मुझे बिजनेस और फाइनेंस पसंद है, पर सैकड़ों बिलों और टैक्स नियमों की जांच में मुझे अतिरिक्त ध्यान देना होगा।',
        points: 70,
        feedbackEn: 'Solid interest; CA articleship (2 years) will train your practical audit speed.',
        feedbackHi: 'अच्छी रुचि; 2 साल की CA आर्टिकलशिप आपको प्रैक्टिकल ऑडिट में निपुण बना देगी।',
      },
      {
        id: 'sc_low',
        textEn: 'Reading tax laws, balance sheets, and accounting tables for hours bores me quickly.',
        textHi: 'टैक्स कानून, बैलेंस शीट और अकाउंटिंग की तालिकाएं घंटों पढ़ना मुझे बहुत उबाऊ लगता है।',
        points: 15,
        feedbackEn: 'Warning: CA revolves around deep accounting, taxation, and statutory compliance.',
        feedbackHi: 'चेतावनी: CA का पूरा काम अकाउंटिंग, टैक्सेशन और ऑडिट पर आधारित है।',
      },
    ],
  },
  'ba-llb-corp': {
    questionEn:
      'Real Corporate Law Scenario: Two companies are merging in a ₹500 Crore deal, and you must read a 90-page contract tonight to make sure your client cannot be sued unfairly. How do you feel?',
    questionHi:
      'असली कॉर्पोरेट लॉ (BA LLB) स्थिति: दो कंपनियों की ₹500 करोड़ की डील हो रही है और आपको अपने क्लाइंट को कानूनी नुकसान से बचाने के लिए 90 पन्नों का कॉन्ट्रैक्ट ध्यान से पढ़ना है। आपको कैसा लगेगा?',
    helperEn:
      'Corporate lawyers and advocates win by reading fine print, spotting hidden risks, and drafting sharp arguments.',
    helperHi:
      'वकील और कॉर्पोरेट लॉयर बारीक शब्दों को पकड़कर और मजबूत कानूनी तर्क लिखकर ही जीतते हैं।',
    options: [
      {
        id: 'sc_high',
        textEn: 'Excited—I love reading carefully, finding hidden loopholes in rules, and writing persuasive arguments.',
        textHi: 'उत्साहित—मुझे ध्यान से पढ़ना, नियमों की बारीकियां पकड़ना और मजबूत तर्क लिखना बहुत पसंद है।',
        points: 100,
        feedbackEn: 'Strong legal aptitude: analytical reading and sharp drafting mindset.',
        feedbackHi: 'मजबूत कानूनी क्षमता: गहरी रीडिंग और तार्किक ड्राफ्टिंग में आपकी पकड़ शानदार है।',
      },
      {
        id: 'sc_med',
        textEn: 'I am good at speaking and debating, and I am willing to practice reading long legal documents.',
        textHi: 'मैं बोलने और बहस करने में अच्छा हूँ, और लंबे कानूनी दस्तावेज पढ़ने का अभ्यास करने को तैयार हूँ।',
        points: 75,
        feedbackEn: 'Good verbal foundation; law school moot courts will sharpen your drafting.',
        feedbackHi: 'अच्छी बुनियाद; लॉ कॉलेज के मूट कोर्ट आपकी ड्राफ्टिंग को और मजबूत करेंगे।',
      },
      {
        id: 'sc_low',
        textEn: 'I dislike reading long English/Hindi passages, rules, and contracts.',
        textHi: 'मुझे लंबे पैराग्राफ, कानून की किताबें और कॉन्ट्रैक्ट पढ़ना बिल्कुल पसंद नहीं है।',
        points: 20,
        feedbackEn: 'Warning: Both CLAT and legal practice require heavy daily reading.',
        feedbackHi: 'चेतावनी: CLAT परीक्षा और वकालत दोनों में रोज़ बहुत अधिक पढ़ना पड़ता है।',
      },
    ],
  },
};

function buildCategoryScenario(career: ChildCareer): CustomCareerScenario {
  if (CAREER_SPECIFIC_SCENARIOS[career.id]) {
    return CAREER_SPECIFIC_SCENARIOS[career.id];
  }

  const cleanTitle = career.title.split('(')[0].trim();
  const cleanTitleHi = (career.titleHindi || cleanTitle).split('(')[0].trim();
  const primaryRole = career.jobRoles?.[0]?.title || `${cleanTitle} Specialist`;
  const primaryTask =
    career.jobRoles?.[0]?.dailyTasks?.[0] ||
    career.roadmap?.[0]?.details?.what ||
    `solving real-world ${cleanTitle} problems`;
  const primarySkill =
    career.jobRoles?.[0]?.requiredSkills?.[0] ||
    career.roadmap?.[0]?.details?.skills?.[0] ||
    'core domain analysis';

  return {
    questionEn: `Real-World ${cleanTitle} Scenario: As a ${primaryRole}, your team faces a tight deadline on "${primaryTask}" requiring ${primarySkill}. How would you handle it?`,
    questionHi: `असली ${cleanTitleHi} स्थिति: एक ${primaryRole} के रूप में, आपके सामने "${primarySkill}" से जुड़ा एक जरूरी काम और तय समय-सीमा है। आप इसे कैसे संभालेंगे?`,
    helperEn: `This tests your practical problem-solving temperament for ${cleanTitle}.`,
    helperHi: `यह ${cleanTitleHi} के वास्तविक कार्य माहौल में आपकी व्यावहारिक क्षमता की जांच करता है।`,
    options: [
      {
        id: 'sc_high',
        textEn: `Break the problem into small steps, apply ${primarySkill} methodically, and verify quality before submitting.`,
        textHi: `काम को छोटे हिस्सों में बांटूंगा, ${primarySkill} का सही उपयोग करूंगा और गुणवत्ता जांचकर समय पर पूरा करूंगा।`,
        points: 100,
        feedbackEn: `Excellent execution mindset for ${cleanTitle}.`,
        feedbackHi: `${cleanTitleHi} के लिए शानदार व्यावहारिक और अनुशासित सोच।`,
      },
      {
        id: 'sc_med',
        textEn: `I am eager to learn ${primarySkill} step-by-step through college labs, internships, and mentorship.`,
        textHi: `मैं कॉलेज प्रैक्टिकल और इंटर्नशिप के जरिए ${primarySkill} को स्टेप-बाय-स्टेप सीखने के लिए तैयार हूँ।`,
        points: 75,
        feedbackEn: `Good learning mindset; hands-on projects in Year 1–2 will build your confidence.`,
        feedbackHi: `अच्छा सीखने का जज्बा; पहले वर्ष से प्रैक्टिकल प्रोजेक्ट्स करने से आपका आत्मविश्वास बढ़ेगा।`,
      },
      {
        id: 'sc_low',
        textEn: `I do not enjoy hands-on tasks involving ${primarySkill} or structured problem-solving in this field.`,
        textHi: `मुझे ${primarySkill} से जुड़े प्रैक्टिकल काम या इस क्षेत्र की जिम्मेदारियां पसंद नहीं हैं।`,
        points: 20,
        feedbackEn: `Warning: ${cleanTitle} relies heavily on ${primarySkill} in daily work.`,
        feedbackHi: `चेतावनी: ${cleanTitleHi} के रोज़मर्रा के काम में ${primarySkill} की मुख्य भूमिका होती है।`,
      },
    ],
  };
}

function formatCleanExams(rawExams?: string[]): string {
  if (!rawExams || rawExams.length === 0) return 'National / State Merit Entrance';
  return rawExams
    .slice(0, 3)
    .map((ex) => ex.replace(/\s*\([^)]*https?:\/\/[^)]*\)/gi, '').replace(/https?:\/\/\S+/gi, '').trim())
    .filter(Boolean)
    .join(', ');
}

/**
 * Generates 7 unique, career-specific capability questions tailored to the exact ChildCareer.
 */
export function buildIndividualCareerQuestions(career: ChildCareer): IndividualCareerQuestion[] {
  const cleanTitle = career.title.split('(')[0].trim();
  const cleanTitleHi = (career.titleHindi || cleanTitle).split('(')[0].trim();
  const streams = career.eligibility?.streams?.length
    ? career.eligibility.streams.join(' / ')
    : 'Any Stream (PCM / PCB / Commerce / Arts)';
  const minPercent = career.eligibility?.minPercent || 50;
  const exams = formatCleanExams(career.eligibility?.exams);
  const duration = career.duration || '3–4 Years';
  const cost = career.cost || '₹60,000 – ₹8 Lakhs';
  const entrySalary = career.salaryInr?.entry || '₹3.0–12 LPA';

  const skillsList = Array.from(
    new Set([
      ...(career.roadmap?.[0]?.details?.skills || []),
      ...(career.jobRoles?.[0]?.requiredSkills || []),
    ])
  ).slice(0, 4);
  const skillsText =
    skillsList.length > 0
      ? skillsList.join(', ')
      : 'Core Analytical Thinking, Practical Execution, and Domain Communication';

  const primaryRole = career.jobRoles?.[0]?.title || `${cleanTitle} Professional`;
  const dailyTasks = career.jobRoles?.[0]?.dailyTasks || [
    `Execute core ${cleanTitle} projects and technical deliverables`,
    'Collaborate with teams and review quality benchmarks',
  ];
  const dailyTaskSummary = dailyTasks.slice(0, 2).join('; ');

  const weeklyHours = career.workLifeBalance?.weeklyHours || '40–48 Hours/Week';
  const stressLevel = career.workLifeBalance?.stressLevel || 'Moderate';
  const workMode = career.workLifeBalance?.remoteFlexibility || 'Hybrid / On-Site';

  const scenario = buildCategoryScenario(career);

  return [
    {
      id: `${career.id}_q1_eligibility`,
      stepNumber: 1,
      dimension: 'eligibility',
      dimensionLabelEn: '1. Stream & Marks Eligibility',
      dimensionLabelHi: '1. स्ट्रीम और अंक पात्रता',
      questionEn: `For ${cleanTitle}, the required Class 12 stream is "${streams}" with at least ${minPercent}% board marks. Where do you stand right now?`,
      questionHi: `${cleanTitleHi} में प्रवेश के लिए आवश्यक 12वीं स्ट्रीम "${streams}" और न्यूनतम ${minPercent}% बोर्ड अंक हैं। आपकी वर्तमान स्थिति क्या है?`,
      helperEn: `Checks if your school stream and marks qualify you for ${cleanTitle} admissions.`,
      helperHi: `यह जांचता है कि आपकी स्कूल स्ट्रीम और अंक ${cleanTitleHi} के नियमों के अनुसार पात्र हैं या नहीं।`,
      options: [
        {
          id: 'q1_full_match',
          textEn: `Yes! I have (or am choosing) ${streams} and my marks are safely above ${minPercent}%.`,
          textHi: `हाँ! मेरे पास ${streams} स्ट्रीम है (या मैं यही चुन रहा हूँ) और मेरे अंक ${minPercent}% से ऊपर हैं।`,
          points: 100,
          feedbackEn: `You meet 100% of the academic stream and board marks requirements for ${cleanTitle}.`,
          feedbackHi: `आप ${cleanTitleHi} की शैक्षणिक स्ट्रीम और बोर्ड अंकों की शर्त पूरी तरह पूरी करते हैं।`,
        },
        {
          id: 'q1_borderline',
          textEn: `I have the right stream (${streams}), but my marks are close to ${minPercent}% and I need to improve.`,
          textHi: `मेरी स्ट्रीम सही (${streams}) है, लेकिन मेरे अंक ${minPercent}% के आसपास हैं और मुझे सुधार करना होगा।`,
          points: 70,
          feedbackEn: `Eligible stream—focus on NCERT/board exam revision or category relaxation where applicable.`,
          feedbackHi: `आपकी स्ट्रीम सही है—बोर्ड परीक्षा में थोड़ा सुधार या राज्य कोटा से आपको प्रवेश मिल सकता है।`,
        },
        {
          id: 'q1_mismatch',
          textEn: `I do not have ${streams} (or my marks are far below ${minPercent}%).`,
          textHi: `मेरे पास ${streams} स्ट्रीम नहीं है (या मेरे अंक ${minPercent}% से काफी कम हैं)।`,
          points: 10,
          feedbackEn: `Stream/Marks Alert: Direct entry into ${cleanTitle} requires ${streams}. Check lateral/allied pathways below.`,
          feedbackHi: `पात्रता चेतावनी: ${cleanTitleHi} में सीधे प्रवेश के लिए ${streams} आवश्यक है। वैकल्पिक रास्ते नीचे देखें।`,
        },
      ],
    },
    {
      id: `${career.id}_q2_daily_work`,
      stepNumber: 2,
      dimension: 'daily_work',
      dimensionLabelEn: '2. Real Daily Work Fit',
      dimensionLabelHi: '2. रोज़मर्रा के काम में रुचि',
      questionEn: `In ${cleanTitle} (working as a ${primaryRole}), your daily routine involves: "${dailyTaskSummary}". Does this daily work excite you?`,
      questionHi: `${cleanTitleHi} (${primaryRole}) में आपका रोज़ का असली काम होगा: "${dailyTaskSummary}"। क्या यह काम आपको सच में पसंद है?`,
      helperEn: 'Many students pick a degree for its name without checking what the daily job looks like.',
      helperHi: 'कई छात्र केवल डिग्री का नाम सुनकर करियर चुन लेते हैं, इसलिए रोज़ के असली काम को समझना जरूरी है।',
      options: [
        {
          id: 'q2_love_work',
          textEn: `Yes! Doing this kind of practical work every day sounds meaningful and interesting to me.`,
          textHi: `हाँ! रोज़ इस तरह का व्यावहारिक काम करना मुझे बहुत रोचक और सार्थक लगता है।`,
          points: 100,
          feedbackEn: `Strong intrinsic motivation for a ${primaryRole}'s day-to-day responsibilities.`,
          feedbackHi: `${primaryRole} के रोज़मर्रा के काम के प्रति आपकी रुचि बहुत मजबूत है।`,
        },
        {
          id: 'q2_curious',
          textEn: `It sounds okay—I haven't tried it deeply yet, but I am open to learning it seriously.`,
          textHi: `यह ठीक लगता है—मैंने अभी इसे गहराई से नहीं किया है, पर मैं इसे गंभीरता से सीखने को तैयार हूँ।`,
          points: 70,
          feedbackEn: `Good openness—try a 1-week free beginner project or NPTEL module to confirm your interest.`,
          feedbackHi: `अच्छी बात है—अपनी रुचि पक्की करने के लिए 1 हफ्ते का छोटा प्रैक्टिकल प्रोजेक्ट या मुफ्त कोर्स जरूर करके देखें।`,
        },
        {
          id: 'q2_dislike_work',
          textEn: `Honestly no—doing this work every day for the next 10 years would bore or stress me out.`,
          textHi: `सच कहूं तो नहीं—अगले 10 साल तक रोज़ यह काम करना मुझे बोरिंग या तनावपूर्ण लगेगा।`,
          points: 15,
          feedbackEn: `Red Flag: If you dislike the core daily tasks of ${cleanTitle}, even a top college won't make you happy.`,
          feedbackHi: `चेतावनी: यदि आपको ${cleanTitleHi} का रोज़ का काम ही पसंद नहीं है, तो यह करियर आपके लिए बोझ बन सकता है।`,
        },
      ],
    },
    {
      id: `${career.id}_q3_core_skills`,
      stepNumber: 3,
      dimension: 'core_skills',
      dimensionLabelEn: '3. Core Subjects & Skills',
      dimensionLabelHi: '3. मुख्य विषय और कौशल (Skills)',
      questionEn: `To succeed in ${cleanTitle}, you must master these specific skills: "${skillsText}". How comfortable are you with learning and practicing them?`,
      questionHi: `${cleanTitleHi} में सफल होने के लिए आपको इन मुख्य कौशलों में महारत हासिल करनी होगी: "${skillsText}"। आप इनके साथ कितने सहज हैं?`,
      helperEn: `These are the exact skills top employers test when hiring ${cleanTitle} graduates.`,
      helperHi: `${cleanTitleHi} के छात्रों को नौकरी देते समय कंपनियां और चयन बोर्ड इन्हीं कौशलों की जांच करते हैं।`,
      options: [
        {
          id: 'q3_strong_skills',
          textEn: `I enjoy these subjects/skills and can practice them consistently for 2–3 hours every day.`,
          textHi: `मुझे ये विषय और कौशल पसंद हैं और मैं रोज़ 2–3 घंटे इनका नियमित अभ्यास कर सकता हूँ।`,
          points: 100,
          feedbackEn: `Strong aptitude for ${skillsText}.`,
          feedbackHi: `${skillsText} सीखने के लिए आपकी क्षमता और लगन मजबूत है।`,
        },
        {
          id: 'q3_moderate_skills',
          textEn: `I am average right now, but if taught step-by-step from basics, I will work hard to master them.`,
          textHi: `मैं अभी औसत हूँ, लेकिन अगर बेसिक से स्टेप-बाय-स्टेप सिखाया जाए तो मैं कड़ी मेहनत से इन्हें सीख लूंगा।`,
          points: 75,
          feedbackEn: `Totally capable—start building fundamentals from Year 1 using free SWAYAM/NPTEL lectures.`,
          feedbackHi: `पूरी तरह सक्षम—पहले वर्ष से ही मुफ्त सरकारी SWAYAM/NPTEL लेक्चर से अपनी नींव मजबूत करें।`,
        },
        {
          id: 'q3_weak_skills',
          textEn: `I strongly dislike or struggle with "${skillsText}" and want to avoid them.`,
          textHi: `मुझे "${skillsText}" से बहुत डर लगता है या मैं इनसे बचना चाहता हूँ।`,
          points: 20,
          feedbackEn: `Skill Gap Alert: You cannot succeed in ${cleanTitle} while avoiding ${skillsText}.`,
          feedbackHi: `कौशल चेतावनी: ${skillsText} से बचकर ${cleanTitleHi} में आगे बढ़ना बहुत कठिन होगा।`,
        },
      ],
    },
    {
      id: `${career.id}_q4_exam_stamina`,
      stepNumber: 4,
      dimension: 'exam_stamina',
      dimensionLabelEn: '4. Entrance Exam & Study Duration',
      dimensionLabelHi: '4. प्रवेश परीक्षा और पढ़ाई की अवधि',
      questionEn: `${cleanTitle} takes "${duration}" and admission goes through "${exams}". Are you ready for this entrance preparation and study timeline?`,
      questionHi: `${cleanTitleHi} की पढ़ाई की अवधि "${duration}" है और इसके मुख्य प्रवेश मार्ग "${exams}" हैं। क्या आप इस तैयारी और समय के लिए तैयार हैं?`,
      helperEn: 'Tests your patience for the academic duration and entrance competition.',
      helperHi: 'यह पढ़ाई की कुल अवधि और प्रवेश परीक्षा की मेहनत के लिए आपके धैर्य को परखता है।',
      options: [
        {
          id: 'q4_ready_exam',
          textEn: `Yes! I am ready to commit ${duration} and solve past-year papers for ${exams} with a backup state college plan.`,
          textHi: `हाँ! मैं ${duration} देने और ${exams} के पिछले वर्षों के प्रश्नपत्र हल करने के लिए पूरी तरह तैयार हूँ।`,
          points: 100,
          feedbackEn: `Realistic and disciplined approach toward ${exams} and the ${duration} timeline.`,
          feedbackHi: `${exams} और ${duration} की पढ़ाई के लिए आपका दृष्टिकोण बहुत व्यावहारिक और मजबूत है।`,
        },
        {
          id: 'q4_moderate_exam',
          textEn: `I can study for ${duration}, but I prefer moderate state/university entrances over ultra-tough cutoffs.`,
          textHi: `मैं ${duration} पढ़ सकता हूँ, लेकिन बहुत कठिन कटऑफ के बजाय राज्य/यूनिवर्सिटी प्रवेश परीक्षा का सुरक्षित रास्ता भी रखूंगा।`,
          points: 80,
          feedbackEn: `Smart Multi-Track Strategy: Target both national exams (${exams}) and high-ROI state universities.`,
          feedbackHi: `स्मार्ट रणनीति: मुख्य परीक्षा (${exams}) के साथ-साथ अच्छे राज्य विश्वविद्यालयों का विकल्प भी खुला रखें।`,
        },
        {
          id: 'q4_impatient',
          textEn: `${duration} feels too long for me—I need a shorter job-ready course with minimal entrance exams.`,
          textHi: `${duration} मेरे लिए बहुत लंबा समय है—मुझे कम समय में जल्दी नौकरी दिलाने वाला कोर्स चाहिए।`,
          points: 25,
          feedbackEn: `Timeline Mismatch: Consider shorter 1–3 year diploma, vocational, or skill-based pathways instead.`,
          feedbackHi: `समय अंतराल: आपके लिए 1–3 साल का डिप्लोमा या स्किल-आधारित कोर्स अधिक उपयुक्त रहेगा।`,
        },
      ],
    },
    {
      id: `${career.id}_q5_scenario`,
      stepNumber: 5,
      dimension: 'scenario',
      dimensionLabelEn: '5. Practical Career Scenario',
      dimensionLabelHi: '5. व्यावहारिक कार्य परीक्षा (Scenario)',
      questionEn: scenario.questionEn,
      questionHi: scenario.questionHi,
      helperEn: scenario.helperEn,
      helperHi: scenario.helperHi,
      options: scenario.options,
    },
    {
      id: `${career.id}_q6_work_life`,
      stepNumber: 6,
      dimension: 'work_life',
      dimensionLabelEn: '6. Work Hours & Lifestyle Reality',
      dimensionLabelHi: '6. कार्य के घंटे और जीवनशैली',
      questionEn: `Professionals in ${cleanTitle} typically work "${weeklyHours}" with a "${stressLevel}" pressure level (${workMode} work mode). Are you comfortable with this lifestyle?`,
      questionHi: `${cleanTitleHi} में पेशेवर आमतौर पर सप्ताह में "${weeklyHours}" काम करते हैं, जहाँ दबाव का स्तर "${stressLevel}" (${workMode}) रहता है। क्या आप इसके लिए सहज हैं?`,
      helperEn: 'Every career has a real work-life trade-off that you should know before joining.',
      helperHi: 'हर करियर की अपनी कार्यशैली और समय की मांग होती है जिसे पहले जानना जरूरी है।',
      options: [
        {
          id: 'q6_fit_lifestyle',
          textEn: `Yes, "${weeklyHours}" in a ${workMode} setup with ${stressLevel} responsibility works well for me.`,
          textHi: `हाँ, "${weeklyHours}" (${workMode}) की कार्यशैली और जिम्मेदारी मेरे लिए बिल्कुल ठीक है।`,
          points: 100,
          feedbackEn: `Your lifestyle expectations match the real working conditions of ${cleanTitle}.`,
          feedbackHi: `आपकी जीवनशैली की उम्मीदें ${cleanTitleHi} के वास्तविक माहौल से मेल खाती हैं।`,
        },
        {
          id: 'q6_manageable',
          textEn: `I can handle it during my early career years as long as there is steady career growth and job security.`,
          textHi: `यदि करियर में अच्छी ग्रोथ और सुरक्षा हो, तो मैं शुरुआती वर्षों में इतनी मेहनत कर सकता हूँ।`,
          points: 75,
          feedbackEn: `Balanced view—early discipline in the first 3–5 years builds long-term seniority and flexibility.`,
          feedbackHi: `संतुलित सोच—शुरुआती 3–5 वर्षों की मेहनत आगे चलकर बेहतर पद और सुविधा दिलाती है।`,
        },
        {
          id: 'q6_mismatch_lifestyle',
          textEn: `No, this work schedule or pressure level does not match the life I want.`,
          textHi: `नहीं, काम के ये घंटे या दबाव का स्तर मेरी प्राथमिकताओं से मेल नहीं खाता।`,
          points: 20,
          feedbackEn: `Lifestyle Alert: Check the Sarkari/Govt or Academic track within this field for more predictable hours.`,
          feedbackHi: `जीवनशैली सुझाव: निश्चित समय के लिए इस क्षेत्र के सरकारी (Sarkari) या टीचिंग ट्रैक पर विचार करें।`,
        },
      ],
    },
    {
      id: `${career.id}_q7_financial_roi`,
      stepNumber: 7,
      dimension: 'financial_roi',
      dimensionLabelEn: '7. Fees, ROI & Starting Salary Truth',
      dimensionLabelHi: '7. फीस, बजट और शुरुआती सैलरी का सच',
      questionEn: `Estimated course cost is "${cost}" (much lower in Govt colleges) and verified entry pay is "${entrySalary}". How prepared are you financially?`,
      questionHi: `अनुमानित कोर्स फीस "${cost}" है (सरकारी कॉलेजों में बहुत कम) और शुरुआती वेतन "${entrySalary}" है। आपकी आर्थिक योजना क्या है?`,
      helperEn: 'Never take a ₹15–20 Lakh high-interest loan without comparing against realistic starting in-hand pay.',
      helperHi: 'शुरुआती इन-हैंड सैलरी को समझे बिना कभी भी ₹15–20 लाख का महंगा कर्ज न लें।',
      options: [
        {
          id: 'q7_smart_roi',
          textEn: `We will prioritize Govt/Central colleges first, or use scholarships / PM-Vidyalaxmi loan safely within our budget.`,
          textHi: `हम पहले सरकारी/केंद्रीय कॉलेज का प्रयास करेंगे, या बजट के भीतर सरकारी छात्रवृत्ति / पीएम-विद्यालक्ष्मी लोन का उपयोग करेंगे।`,
          points: 100,
          feedbackEn: `Smart financial planning—maximizes Return on Investment (ROI) with zero debt trap.`,
          feedbackHi: `स्मार्ट आर्थिक योजना—इससे बिना किसी कर्ज जाल के बेहतरीन रिटर्न (ROI) मिलेगा।`,
        },
        {
          id: 'q7_realistic_pay',
          textEn: `My family can afford the fees, and I understand that entry in-hand pay starts realistic and grows with skills.`,
          textHi: `मेरा परिवार फीस वहन कर सकता है, और मैं समझता हूँ कि शुरुआती सैलरी कौशल (Skills) के साथ धीरे-धीरे बढ़ती है।`,
          points: 85,
          feedbackEn: `Clear financial readiness and realistic salary expectations.`,
          feedbackHi: `स्पष्ट आर्थिक तैयारी और शुरुआती वेतन को लेकर व्यावहारिक समझ।`,
        },
        {
          id: 'q7_debt_risk',
          textEn: `We would have to take a heavy private loan expecting an instant ₹25+ Lakh salary on Day 1 without a Govt seat.`,
          textHi: `हमें भारी प्राइवेट कर्ज लेना पड़ेगा और हमें पहले ही दिन ₹25+ लाख सालाना पैकेज की उम्मीद है।`,
          points: 20,
          feedbackEn: `Debt Trap Warning: Entry salaries follow national medians unless you are in a top tier institute. Target Govt seats or scholarships first!`,
          feedbackHi: `कर्ज जाल चेतावनी: पहले दिन ₹25 लाख केवल गिने-चुने टॉप कॉलेजों में मिलता है। भारी कर्ज लेने के बजाय सरकारी कॉलेज या स्कॉलरशिप चुनें!`,
        },
      ],
    },
  ];
}

/**
 * Evaluates the student's answers to the 7 career-specific questions and produces a clear, plain-language Verdict.
 */
export function evaluateCareerCapability(
  career: ChildCareer,
  answers: Record<string, string>
): CareerCapabilityVerdict {
  const questions = buildIndividualCareerQuestions(career);
  const cleanTitle = career.title.split('(')[0].trim();
  const cleanTitleHi = (career.titleHindi || cleanTitle).split('(')[0].trim();

  // Dimension weights (Eligibility, Daily Work, and Core Skills carry highest weight)
  const weights: Record<IndividualCareerQuestion['dimension'], number> = {
    eligibility: 18,
    daily_work: 18,
    core_skills: 18,
    scenario: 16,
    exam_stamina: 12,
    work_life: 9,
    financial_roi: 9,
  };

  let weightedSum = 0;
  let totalWeightAnswered = 0;
  let answeredCount = 0;

  const strengthsEn: string[] = [];
  const strengthsHi: string[] = [];
  const gapsToFixEn: string[] = [];
  const gapsToFixHi: string[] = [];
  const dimensionScores: DimensionBreakdown[] = [];

  let hasHardEligibilityMismatch = false;
  let hasHardWorkDislike = false;

  for (const q of questions) {
    const selectedOptId = answers[q.id];
    const selectedOpt = q.options.find((o) => o.id === selectedOptId);
    const w = weights[q.dimension] || 10;

    if (selectedOpt) {
      answeredCount += 1;
      weightedSum += (selectedOpt.points * w) / 100;
      totalWeightAnswered += w;

      const status: DimensionBreakdown['status'] =
        selectedOpt.points >= 80 ? 'strong' : selectedOpt.points >= 65 ? 'moderate' : 'gap';

      dimensionScores.push({
        dimension: q.dimension,
        labelEn: q.dimensionLabelEn,
        labelHi: q.dimensionLabelHi,
        scorePct: selectedOpt.points,
        status,
      });

      if (selectedOpt.points >= 80) {
        strengthsEn.push(selectedOpt.feedbackEn);
        strengthsHi.push(selectedOpt.feedbackHi);
      } else if (selectedOpt.points <= 30) {
        gapsToFixEn.push(selectedOpt.feedbackEn);
        gapsToFixHi.push(selectedOpt.feedbackHi);
        if (q.dimension === 'eligibility') hasHardEligibilityMismatch = true;
        if (q.dimension === 'daily_work') hasHardWorkDislike = true;
      } else {
        gapsToFixEn.push(selectedOpt.feedbackEn);
        gapsToFixHi.push(selectedOpt.feedbackHi);
      }
    } else {
      dimensionScores.push({
        dimension: q.dimension,
        labelEn: q.dimensionLabelEn,
        labelHi: q.dimensionLabelHi,
        scorePct: 0,
        status: 'gap',
      });
    }
  }

  const rawScorePct =
    totalWeightAnswered > 0 ? Math.round((weightedSum / totalWeightAnswered) * 100) : 0;

  // Apply realistic penalty if the student lacks the required stream or strongly hates the core daily work
  let finalScorePct = rawScorePct;
  if (hasHardEligibilityMismatch && hasHardWorkDislike) {
    finalScorePct = Math.min(finalScorePct, 42);
  } else if (hasHardEligibilityMismatch || hasHardWorkDislike) {
    finalScorePct = Math.min(finalScorePct, 64);
  }

  let verdictTier: VerdictTier = 'CAPABLE_STRONG';
  if (finalScorePct >= 78 && !hasHardEligibilityMismatch && !hasHardWorkDislike) {
    verdictTier = 'CAPABLE_STRONG';
  } else if (finalScorePct >= 52) {
    verdictTier = 'CAPABLE_CONDITIONAL';
  } else {
    verdictTier = 'RECONSIDER_ALTERNATIVE';
  }

  const examsText = (career.eligibility?.exams || ['National / State Entrance']).slice(0, 2).join(' / ');
  const primarySkill =
    career.jobRoles?.[0]?.requiredSkills?.[0] ||
    career.roadmap?.[0]?.details?.skills?.[0] ||
    'core domain fundamentals';

  const actionPlanEn =
    verdictTier === 'CAPABLE_STRONG'
      ? [
          `Step 1 (This Month): Download the official syllabus & past 5 years' papers for ${examsText} from the Free Resources tab.`,
          `Step 2 (Skill Proof): Spend 45 minutes daily building your foundation in ${primarySkill} using free NPTEL/SWAYAM or NCERT modules.`,
          `Step 3 (College & ROI Target): Shortlist at least 3 Government / Central Universities alongside state counseling options so your fees stay low.`,
        ]
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? [
          `Step 1 (Fix the Gap First): Review the yellow/amber points below—especially your comfort with ${primarySkill} and ${examsText}.`,
          `Step 2 (7-Day Trial Test): Watch 3 beginner lectures on SWAYAM/YouTube and try 1 hands-on exercise in ${cleanTitle} before committing.`,
          `Step 3 (Keep Safety Net Ready): Apply for both ${examsText} and a parallel state university / allied track so you never waste drop years.`,
        ]
      : [
          `Step 1 (Pause Before Paying Fees): Do NOT join an expensive private coaching batch or high-fee college for ${cleanTitle} right now.`,
          `Step 2 (Check Stream/Interest Match): Your answers show a mismatch in stream eligibility, daily work interest, or core skills for ${cleanTitle}.`,
          `Step 3 (Explore Better-Fit Alternatives): Check the Related Pathways at the bottom of this page or take the Homepage 25-Question 373-Career Assessment.`,
        ];

  const actionPlanHi =
    verdictTier === 'CAPABLE_STRONG'
      ? [
          `कदम 1 (इस महीने): ${examsText} का आधिकारिक सिलेबस और पिछले 5 वर्षों के प्रश्नपत्र (PYQs) डाउनलोड करें।`,
          `कदम 2 (कौशल अभ्यास): मुफ्त सरकारी SWAYAM/NPTEL या NCERT की मदद से रोज़ 45 मिनट "${primarySkill}" का अभ्यास करें।`,
          `कदम 3 (कॉलेज लक्ष्य): कम फीस और बेहतरीन ROI के लिए कम से कम 3 सरकारी / केंद्रीय कॉलेजों को अपनी पहली प्राथमिकता बनाएं।`,
        ]
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? [
          `कदम 1 (कमियों को सुधारें): नीचे दिए गए सुझावों को ध्यान से पढ़ें—विशेषकर "${primarySkill}" और "${examsText}" की तैयारी पर ध्यान दें।`,
          `कदम 2 (7-दिन का ट्रायल): अंतिम निर्णय लेने से पहले ${cleanTitleHi} के 3 शुरुआती लेक्चर देखें और प्रैक्टिकल काम को समझें।`,
          `कदम 3 (सुरक्षा कवच): ड्रॉप ईयर से बचने के लिए मुख्य परीक्षा (${examsText}) के साथ राज्य विश्वविद्यालय का विकल्प भी भरें।`,
        ]
      : [
          `कदम 1 (महंगी फीस देने से रुकें): अभी ${cleanTitleHi} के लिए किसी महंगी कोचिंग या प्राइवेट कॉलेज में भारी फीस जमा न करें।`,
          `कदम 2 (असली कारण समझें): आपके उत्तर बताते हैं कि स्ट्रीम पात्रता या रोज़ के काम की रुचि इस करियर से मेल नहीं खा रही है।`,
          `कदम 3 (बेहतर विकल्प चुनें): इस पेज के नीचे दिए गए संबंधित करियर (Related Pathways) देखें जहाँ आपकी क्षमता बेहतर काम आएगी।`,
        ];

  const verdictBadgeEn =
    verdictTier === 'CAPABLE_STRONG'
      ? `✅ STRONG FIT (${finalScorePct}%) — YOU ARE CAPABLE & READY FOR ${cleanTitle.toUpperCase()}`
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? `⚡ CONDITIONAL FIT (${finalScorePct}%) — CAPABLE IF YOU BRIDGE KEY GAPS`
      : `⚠️ HIGH RISK (${finalScorePct}%) — RECONSIDER OR EXPLORE ALTERNATIVE PATHWAYS`;

  const verdictBadgeHi =
    verdictTier === 'CAPABLE_STRONG'
      ? `✅ पूर्णतः सक्षम (${finalScorePct}%) — आप ${cleanTitleHi} के लिए तैयार हैं`
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? `⚡ तैयारी के साथ सक्षम (${finalScorePct}%) — पहले मुख्य कमियों को पूरा करें`
      : `⚠️ उच्च जोखिम (${finalScorePct}%) — इस करियर पर पुनर्विचार करें या विकल्प देखें`;

  const headlineEn =
    verdictTier === 'CAPABLE_STRONG'
      ? `Verdict: Yes! You have the right stream, daily work interest, and mindset to succeed in ${cleanTitle}.`
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? `Verdict: You can succeed in ${cleanTitle}, but you must fix ${gapsToFixEn.length || 1} specific preparation gap(s) first.`
      : `Verdict: Honest Warning — ${cleanTitle} may frustrate you based on your current stream, work preference, or timeline.`;

  const headlineHi =
    verdictTier === 'CAPABLE_STRONG'
      ? `निर्णय: हाँ! आपमें ${cleanTitleHi} में सफल होने के लिए सही पात्रता, रुचि और मानसिकता है।`
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? `निर्णय: आप ${cleanTitleHi} कर सकते हैं, लेकिन पहले नीचे बताई गई मुख्य कमियों को सुधारना जरूरी है।`
      : `निर्णय: ईमानदार सलाह — आपके वर्तमान उत्तरों के अनुसार ${cleanTitleHi} आपके लिए कठिन या असंतोषजनक हो सकता है।`;

  const plainSummaryEn =
    verdictTier === 'CAPABLE_STRONG'
      ? `In simple words: Your school stream, comfort with ${primarySkill}, and readiness for ${examsText} align strongly with what ${cleanTitle} actually demands in the real world.`
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? `In simple words: You have potential for ${cleanTitle}, but jumping in blindly without improving the areas listed under "What You Must Improve" could make college and job placements tough.`
      : `In simple words: Don't choose ${cleanTitle} just because relatives or friends talked about it. Look at the specific warnings below and compare safer sibling careers before deciding.`;

  const plainSummaryHi =
    verdictTier === 'CAPABLE_STRONG'
      ? `सरल शब्दों में: आपकी स्ट्रीम, "${primarySkill}" में रुचि और "${examsText}" के लिए आपकी तैयारी इस करियर की असली मांग से पूरी तरह मेल खाती है।`
      : verdictTier === 'CAPABLE_CONDITIONAL'
      ? `सरल शब्दों में: आपमें ${cleanTitleHi} की क्षमता है, लेकिन नीचे बताए गए सुधार बिंदुओं पर काम किए बिना आगे बढ़ना चुनौतीपूर्ण हो सकता है।`
      : `सरल शब्दों में: केवल दूसरों की देखा-देखी ${cleanTitleHi} न चुनें। नीचे दी गई चेतावनियों को पढ़ें और अपने लिए अधिक उपयुक्त करियर विकल्प देखें।`;

  return {
    careerId: career.id,
    careerTitleEn: cleanTitle,
    careerTitleHi: cleanTitleHi,
    answeredCount,
    totalQuestions: questions.length,
    scorePct: finalScorePct,
    verdictTier,
    verdictBadgeEn,
    verdictBadgeHi,
    headlineEn,
    headlineHi,
    plainSummaryEn,
    plainSummaryHi,
    strengthsEn:
      strengthsEn.length > 0
        ? strengthsEn
        : [`You took the time to honestly evaluate your readiness for ${cleanTitle}.`],
    strengthsHi:
      strengthsHi.length > 0
        ? strengthsHi
        : [`आपने ईमानदारी से ${cleanTitleHi} के लिए अपनी क्षमता का मूल्यांकन किया।`],
    gapsToFixEn,
    gapsToFixHi,
    actionPlanEn,
    actionPlanHi,
    dimensionScores,
  };
}

/**
 * Generates a plain-language, zero-jargon "In Simple Words" guide for non-technical users & parents on mobile.
 */
export function buildPlainLanguageCareerGuide(career: ChildCareer): PlainLanguageCareerGuide {
  const cleanTitle = career.title.split('(')[0].trim();
  const cleanTitleHi = (career.titleHindi || cleanTitle).split('(')[0].trim();
  const streams = (career.eligibility?.streams || ['Any Stream']).join(' / ');
  const minPercent = career.eligibility?.minPercent || 50;
  const exams = formatCleanExams(career.eligibility?.exams);
  const duration = career.duration || '3–4 Years';
  const primaryJob = career.jobRoles?.[0]?.title || `${cleanTitle} Professional`;
  const primaryDesc =
    career.jobRoles?.[0]?.description ||
    career.tagline ||
    `You work as a qualified ${cleanTitle} specialist in private companies or government departments.`;
  const entrySalary = career.salaryInr?.entry || '₹3.5–10 LPA';
  const cost = career.cost || '₹60,000 – ₹8 Lakhs';

  return {
    whatIsItEn: `After completing ${duration} of ${cleanTitle}, you become a "${primaryJob}". In everyday words: ${primaryDesc}`,
    whatIsItHi: `${duration} की पढ़ाई पूरी करने के बाद आप "${primaryJob}" बनते हैं। सरल शब्दों में: ${career.taglineHindi || primaryDesc}`,
    whoCanJoinEn: `Any student who passes Class 12 with "${streams}" (minimum ${minPercent}% marks) and qualifies through "${exams}" can join.`,
    whoCanJoinHi: `कोई भी छात्र जिसने 12वीं कक्षा "${streams}" स्ट्रीम (कम से कम ${minPercent}% अंक) से पास की हो और "${exams}" के माध्यम से प्रवेश लेता हो, वह इसमें जा सकता है।`,
    moneyTruthEn: `Total course fee is around ${cost} (Government colleges cost 70–85% less than private colleges). Verified starting pay is: ${entrySalary} Remember: "LPA" means yearly package—your actual monthly bank salary is roughly 75–80% of the monthly gross.`,
    moneyTruthHi: `कुल अनुमानित फीस ${cost} है (सरकारी कॉलेजों में प्राइवेट से 70–85% कम खर्च होता है)। सत्यापित शुरुआती वेतन: ${entrySalary} ध्यान रखें: "LPA" सालाना पैकेज होता है—हर महीने बैंक में आने वाली असली तनख्वाह (In-Hand) कुल पैकेज का लगभग 75–80% होती है।`,
    safetyNetEn: `100% Recognized Degree: Even if your plans change later, this degree makes you eligible for UPSC, SSC CGL, Bank PO, State PSC, and specialized Government PSU officer posts.`,
    safetyNetHi: `100% मान्यता प्राप्त डिग्री: भविष्य में यदि आप सरकारी नौकरी में जाना चाहें, तो इस डिग्री से UPSC, SSC CGL, बैंक PO, राज्य सिविल सेवा और सरकारी PSU अधिकारी के सभी रास्ते खुले रहते हैं।`,
  };
}
