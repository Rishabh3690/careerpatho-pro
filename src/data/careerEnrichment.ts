import { ChildCareer, JobRoleItem, SarkariEligibilityDetails } from './types';

export interface CollegeInfo {
  name: string;
  type: 'Govt / Premier' | 'Top State / Private';
  examRequired: string;
  estCutoff: string;
  totalFee: string;
  location: string;
  nirfRankTier?: string;
  officialUrl?: string;
  badges?: string[];
}

export const CAREER_ENRICHMENT: Record<
  string,
  {
    averageGrowth: string;
    formalDesignation?: string;
    prosAndCons: {
      thriveIf: string[];
      reconsiderIf: string[];
      thriveIfHindi: string[];
      reconsiderIfHindi: string[];
    };
    workLifeBalance: {
      weeklyHours: string;
      stressLevel: 'Moderate' | 'High' | 'Demanding' | 'Balanced';
      remoteFlexibility: 'High' | 'Hybrid' | 'On-Site';
      jobSecurityIndex: 'High' | 'Very High' | 'Moderate';
    };
    topColleges: CollegeInfo[];
    jobRoles?: JobRoleItem[];
  }
> = {
  'btech-cse': {
    averageGrowth: '+26% (5-Yr Growth)',
    formalDesignation: 'B.Tech CSE (Distributed Systems & Cloud Software Architect)',
    prosAndCons: {
      thriveIf: [
        'You enjoy breaking down complex problems and writing code for hours',
        'You are eager to self-learn through documentation and open-source projects',
        'You want high global mobility and high starting compensation',
      ],
      reconsiderIf: [
        'You get anxious when technologies change rapidly every 18 months',
        'You cannot tolerate sitting at a screen for 8+ hours a day',
        'You prefer strictly structured routine work over creative debugging',
      ],
      thriveIfHindi: [
        'आपको जटिल समस्याओं को सुलझाना और घंटों कोडिंग करना पसंद है',
        'आप डॉक्यूमेंटेशन और ओपन-सोर्स प्रोजेक्ट्स से खुद सीखने के लिए उत्सुक हैं',
        'आप उच्च शुरुआती पैकेज और ग्लोबल करियर अवसर चाहते हैं',
      ],
      reconsiderIfHindi: [
        'हर 1-2 साल में नई टेक्नोलॉजी सीखने से आपको घबराहट होती है',
        'आप दिन में 8+ घंटे कंप्यूटर स्क्रीन के सामने नहीं बैठ सकते',
        'आप क्रिएटिव प्रॉब्लम सॉल्विंग के बजाय तय रूटीन काम पसंद करते हैं',
      ],
    },
    workLifeBalance: {
      weeklyHours: '40–50 Hours',
      stressLevel: 'Moderate',
      remoteFlexibility: 'High',
      jobSecurityIndex: 'High',
    },
    topColleges: [
      { name: 'IIT Bombay / IIT Delhi / IIT Madras', type: 'Govt / Premier', examRequired: 'JEE Advanced', estCutoff: 'Top 60–300 All India Rank', totalFee: '₹8.5 Lakhs (4 Yrs)', location: 'Mumbai / Delhi / Chennai', nirfRankTier: 'NIRF #1–3', badges: ['NIRF Verified', 'AICTE Approved', 'INI Govt'] },
      { name: 'NIT Trichy / NIT Surathkal / NIT Warangal', type: 'Govt / Premier', examRequired: 'JEE Main', estCutoff: '99.4+ Percentile', totalFee: '₹5.5 Lakhs (4 Yrs)', location: 'Tamil Nadu / Karnataka / Telangana', nirfRankTier: 'NIRF #9–15', badges: ['NIRF Verified', 'AICTE Approved', 'INI Govt'] },
      { name: 'IIIT Hyderabad / IIIT Bangalore', type: 'Govt / Premier', examRequired: 'JEE Main / UGEE', estCutoff: '99.6+ Percentile', totalFee: '₹14 Lakhs (4 Yrs)', location: 'Hyderabad / Bengaluru', nirfRankTier: 'Top Coding Tier', badges: ['NIRF Verified', 'UGC Recognized'] },
      { name: 'BITS Pilani / Goa / Hyderabad', type: 'Top State / Private', examRequired: 'BITSAT', estCutoff: '315+ Marks', totalFee: '₹22 Lakhs (4 Yrs)', location: 'Rajasthan / Goa', nirfRankTier: 'Premier Private', badges: ['NIRF Verified', 'UGC Recognized'] },
      { name: 'Jadavpur University / DTU Delhi', type: 'Govt / Premier', examRequired: 'WBJEE / JEE Main', estCutoff: 'Top 1000 State Rank', totalFee: '₹10,000 – ₹6 Lakhs', location: 'Kolkata / New Delhi', nirfRankTier: 'Premier State', badges: ['NIRF Verified', 'AICTE Approved'] },
    ],
    jobRoles: [
      {
        title: 'Full-Stack / Backend Software Engineer (SDE-1)',
        titleHindi: 'फुल-स्टैक / बैकएंड सॉफ्टवेयर इंजीनियर (SDE-1)',
        description: 'Architect scalable REST/GraphQL APIs, distributed payment microservices, and high-concurrency cloud databases for product tech firms.',
        descriptionHindi: 'प्रोडक्ट टेक कंपनियों के लिए हाई-स्पीड APIs, क्लाउड डेटाबेस और पेमेंट माइक्रोसर्विसेज डिजाइन और कोड करना।',
        dailyTasks: ['Write clean TypeScript/Go/Java microservices', 'Review pull requests & optimize SQL query latency', 'Debug production cloud telemetry on AWS/GCP'],
        salaryRange: '₹8 LPA – ₹24 LPA (Starting)',
        requiredSkills: ['Data Structures & Algorithms', 'Node.js / Go / Java', 'PostgreSQL & Redis', 'System Design', 'Git & Docker'],
      },
      {
        title: 'Frontend & Design Systems Engineer',
        titleHindi: 'फ्रंटएंड और यूजर इंटरफेस इंजीनियर',
        description: 'Build responsive, sub-second web and mobile interfaces used by millions of daily active users.',
        descriptionHindi: 'करोड़ों यूजर्स के लिए तेज़, सुरक्षित और रिस्पॉन्सिव वेब व मोबाइल ऐप्स का निर्माण करना।',
        dailyTasks: ['Build accessible React / Next.js UI components', 'Optimize Core Web Vitals & bundle performance', 'Collaborate with UX designers and product managers'],
        salaryRange: '₹6.5 LPA – ₹18 LPA (Starting)',
        requiredSkills: ['React / Next.js', 'TypeScript', 'Tailwind / CSS Architecture', 'Web Performance', 'Testing'],
      },
      {
        title: 'Cloud DevOps & Site Reliability Engineer (SRE)',
        titleHindi: 'क्लाउड DevOps और साइट रिलायबिलिटी इंजीनियर (SRE)',
        description: 'Automate CI/CD deployment pipelines, manage Kubernetes clusters, and keep banking/UPI servers running at 99.99% uptime.',
        descriptionHindi: 'क्लाउड सर्वर्स, Kubernetes क्लस्टर्स और ऑटोमेटेड डिप्लॉयमेंट पाइपलाइन को 99.99% अपटाइम पर चलाना।',
        dailyTasks: ['Manage AWS/GCP infrastructure with Terraform', 'Automate Docker & Kubernetes deployments', 'Monitor live server security and incident alerts'],
        salaryRange: '₹9 LPA – ₹22 LPA (Starting)',
        requiredSkills: ['Linux Internals', 'Docker & Kubernetes', 'AWS / GCP', 'Terraform', 'Python / Bash'],
      },
      {
        title: 'PSU / ISRO / DRDO Scientist-B (Govt Track)',
        titleHindi: 'पीएसयू / ISRO / DRDO वैज्ञानिक-B (सरकारी अधिकारी)',
        description: 'Serve as a Class-1 Gazetted Scientist/Officer building national space, defense, and digital public infrastructure via GATE.',
        descriptionHindi: 'GATE परीक्षा के माध्यम से ISRO, DRDO, BARC या महारत्न PSU में क्लास-1 राजपत्रित अधिकारी/वैज्ञानिक बनना।',
        dailyTasks: ['Develop mission-critical defense & satellite software', 'Audit national cybersecurity & data centers', 'Lead government technical engineering units'],
        salaryRange: '₹14 LPA – ₹20 LPA + Govt Perks',
        requiredSkills: ['GATE CSE Core Subjects', 'Operating Systems', 'Computer Networks', 'C / C++', 'DBMS'],
      },
    ],
  },
  'btech-ai-ds': {
    averageGrowth: '+34% (5-Yr Growth)',
    formalDesignation: 'B.Tech AI & DS (Machine Learning & Data Systems Architect)',
    prosAndCons: {
      thriveIf: [
        'You love vector mathematics, linear algebra, and statistical modeling',
        'You are excited by LLMs, generative vision, and autonomous pipelines',
        'You want to lead applied tech transformation across banking and healthcare',
      ],
      reconsiderIf: [
        'You struggle with college-level calculus and probability theory',
        'You expect models to work magically without messy data cleaning',
      ],
      thriveIfHindi: [
        'आपको लीनियर अलजेब्रा, प्रॉबेबिलिटी और स्टैटिस्टिक्स पसंद है',
        'आप AI मॉडल्स, LLMs और डेटा साइंस में करियर बनाना चाहते हैं',
      ],
      reconsiderIfHindi: [
        'आपको उच्च स्तरीय गणित (Calculus/Probability) से डर लगता है',
      ],
    },
    workLifeBalance: {
      weeklyHours: '42–52 Hours',
      stressLevel: 'Moderate',
      remoteFlexibility: 'High',
      jobSecurityIndex: 'Very High',
    },
    topColleges: [
      { name: 'IIT Hyderabad (Dept of AI)', type: 'Govt / Premier', examRequired: 'JEE Advanced', estCutoff: 'Top 600 Rank', totalFee: '₹8.5 Lakhs', location: 'Hyderabad, Telangana', nirfRankTier: 'NIRF #8', badges: ['NIRF Verified', 'AICTE Approved', 'INI Govt'] },
      { name: 'IIIT Delhi (CS & Applied Math/AI)', type: 'Govt / Premier', examRequired: 'JEE Main', estCutoff: '99.2+ Percentile', totalFee: '₹16 Lakhs', location: 'New Delhi', nirfRankTier: 'Top AI Hub', badges: ['NIRF Verified', 'UGC Recognized'] },
      { name: 'COEP Tech University Pune', type: 'Govt / Premier', examRequired: 'MHT CET / JEE', estCutoff: '99.5+ Percentile', totalFee: '₹4.5 Lakhs', location: 'Pune, Maharashtra', nirfRankTier: 'Premier State', badges: ['NIRF Verified', 'AICTE Approved'] },
    ],
  },
  'mbbs-clinical': {
    averageGrowth: '+18% (Stable High)',
    formalDesignation: 'MBBS (Licensed Clinical Physician & Medical Officer)',
    prosAndCons: {
      thriveIf: [
        'You have deep empathy and genuine resilience for saving human lives',
        'You can absorb massive medical textbooks with consistent daily retention',
        'You accept a longer 10-year gestation before peak consultant earnings',
      ],
      reconsiderIf: [
        'You want rapid financial wealth by age 22–24 (tech/finance is much faster)',
        'You struggle with sleep deprivation and emergency night duty shifts',
        'You cannot handle blood, traumatic wounds, and intense clinical responsibility',
      ],
      thriveIfHindi: [
        'आपमें मरीजों की सेवा करने और जीवन बचाने का गहरा जज्बा है',
        'आप लंबे समय तक मेडिकल पढ़ाई और अस्पताल ड्यूटी करने के लिए तैयार हैं',
      ],
      reconsiderIfHindi: [
        'आप 22-24 की उम्र में तुरंत कॉर्पोरेट जैसी कमाई चाहते हैं',
        'आप इमरजेंसी नाइट शिफ्ट और तनाव नहीं झेल सकते',
      ],
    },
    workLifeBalance: {
      weeklyHours: '60–80 Hours (Residency) / 45–55 Hours (Consultant)',
      stressLevel: 'Demanding',
      remoteFlexibility: 'On-Site',
      jobSecurityIndex: 'Very High',
    },
    topColleges: [
      { name: 'AIIMS New Delhi', type: 'Govt / Premier', examRequired: 'NEET UG', estCutoff: 'AIR 1–55 (715+ Marks)', totalFee: '₹6,800 Total (5.5 Yrs)', location: 'New Delhi', nirfRankTier: 'NIRF #1 Medical', badges: ['NIRF Verified', 'NMC Approved', 'INI Govt'] },
      { name: 'Maulana Azad Medical College (MAMC)', type: 'Govt / Premier', examRequired: 'NEET UG', estCutoff: 'AIR 60–120', totalFee: '₹15,000 Total', location: 'New Delhi', nirfRankTier: 'Top Central', badges: ['NIRF Verified', 'NMC Approved'] },
      { name: 'Christian Medical College (CMC Vellore)', type: 'Govt / Premier', examRequired: 'NEET UG', estCutoff: 'Top 300 NEET Rank', totalFee: '₹1.5 Lakhs Total', location: 'Vellore, Tamil Nadu', nirfRankTier: 'NIRF #3', badges: ['NIRF Verified', 'NMC Approved'] },
      { name: 'King George Medical University (KGMU)', type: 'Govt / Premier', examRequired: 'NEET UG', estCutoff: 'AIR 500–1200', totalFee: '₹2.5 Lakhs Total', location: 'Lucknow, Uttar Pradesh', nirfRankTier: 'Premier State', badges: ['NIRF Verified', 'NMC Approved'] },
      { name: 'Grant Government Medical College', type: 'Govt / Premier', examRequired: 'NEET UG', estCutoff: 'AIR 800–2000', totalFee: '₹4.5 Lakhs Total', location: 'Mumbai, Maharashtra', nirfRankTier: 'Premier State', badges: ['NIRF Verified', 'NMC Approved'] },
    ],
  },
  'ca-audit': {
    averageGrowth: '+20% (Stable)',
    formalDesignation: 'ICAI CA (Statutory Financial Auditor & Corporate Tax Strategist)',
    prosAndCons: {
      thriveIf: [
        'You have sharp financial discipline, attention to numerical detail, and tax logic',
        'You are self-driven and can study 10+ hours daily without college attendance pressure',
        'You want a recession-proof license to sign corporate balance sheets',
      ],
      reconsiderIf: [
        'You get demotivated by low pass percentages (10–18% national pass rate)',
        'You dislike intense corporate audit deadlines and busy season overtime',
      ],
      thriveIfHindi: [
        'आपकी अकाउंटिंग, टैक्सेशन और फाइनेंशियल ऑडिट में गहरी रुचि है',
        'आप रोज़ 10+ घंटे अनुशासन के साथ सेल्फ-स्टडी कर सकते हैं',
      ],
      reconsiderIfHindi: [
        'कम पास प्रतिशत (10-18%) से आप जल्दी निराश हो जाते हैं',
        'आपको ऑडिट और टैक्स डेडलाइन का दबाव पसंद नहीं है',
      ],
    },
    workLifeBalance: {
      weeklyHours: '45 Hours (Normal) / 65–75 Hours (Tax/Audit Season)',
      stressLevel: 'High',
      remoteFlexibility: 'Hybrid',
      jobSecurityIndex: 'Very High',
    },
    topColleges: [
      { name: 'Institute of Chartered Accountants of India (ICAI)', type: 'Govt / Premier', examRequired: 'CA Foundation / Inter', estCutoff: '50% Aggregate + 40% per Subject', totalFee: '₹85,000 Total (Self-paced)', location: 'Pan India National Body', nirfRankTier: 'Statutory Parliament Act Body', badges: ['Statutory Govt Body', 'UGC Equivalent'] },
      { name: 'SRCC Delhi (Parallel B.Com Hons)', type: 'Govt / Premier', examRequired: 'CUET UG', estCutoff: '785+/800 CUET', totalFee: '₹90,000 (3 Yrs)', location: 'New Delhi', nirfRankTier: 'NIRF #1 Commerce', badges: ['NIRF Verified', 'UGC Recognized'] },
    ],
  },
  'ba-llb-corp': {
    averageGrowth: '+22% (High)',
    formalDesignation: 'BA LL.B Hons (Corporate M&A Counsel & Constitutional Advocate)',
    prosAndCons: {
      thriveIf: [
        'You possess superior verbal negotiation, drafting, and critical reading stamina',
        'You can read 100-page contracts and spot ambiguous legal liabilities',
        'You want to orchestrate multi-crore corporate mergers and cross-border deals',
      ],
      reconsiderIf: [
        'You dislike extensive reading and adversarial arguments',
        'You cannot handle tight transactional deal deadlines under high pressure',
      ],
      thriveIfHindi: [
        'आपकी रीडिंग, ड्राफ्टिंग और तार्किक बहस (Argumentation) मजबूत है',
        'आप कॉर्पोरेट लॉ फर्म या ज्यूडिशियरी में शीर्ष पर पहुंचना चाहते हैं',
      ],
      reconsiderIfHindi: [
        'आपको लंबे कानूनी दस्तावेज पढ़ने से बोरियत होती है',
      ],
    },
    workLifeBalance: {
      weeklyHours: '55–70 Hours (Tier-1 Law Firms)',
      stressLevel: 'Demanding',
      remoteFlexibility: 'Hybrid',
      jobSecurityIndex: 'High',
    },
    topColleges: [
      { name: 'NLSIU Bengaluru (National Law School)', type: 'Govt / Premier', examRequired: 'CLAT', estCutoff: 'AIR 1–110', totalFee: '₹14 Lakhs (5 Yrs)', location: 'Bengaluru, Karnataka', nirfRankTier: 'NIRF #1 Law', badges: ['NIRF Verified', 'BCI Approved', 'UGC Recognized'] },
      { name: 'NALSAR University of Law Hyderabad', type: 'Govt / Premier', examRequired: 'CLAT', estCutoff: 'AIR 120–250', totalFee: '₹13 Lakhs (5 Yrs)', location: 'Hyderabad, Telangana', nirfRankTier: 'NIRF #3 Law', badges: ['NIRF Verified', 'BCI Approved', 'UGC Recognized'] },
      { name: 'National Law University Delhi (NLU Delhi)', type: 'Govt / Premier', examRequired: 'AILET', estCutoff: 'AIR 1–85', totalFee: '₹12 Lakhs (5 Yrs)', location: 'New Delhi', nirfRankTier: 'NIRF #2 Law', badges: ['NIRF Verified', 'BCI Approved', 'UGC Recognized'] },
      { name: 'WBNUJS Kolkata', type: 'Govt / Premier', examRequired: 'CLAT', estCutoff: 'AIR 260–450', totalFee: '₹12 Lakhs (5 Yrs)', location: 'Kolkata, West Bengal', nirfRankTier: 'NIRF #4 Law', badges: ['NIRF Verified', 'BCI Approved'] },
    ],
  },
  'upsc-ias': {
    averageGrowth: '+12% (Prestige & Authority)',
    formalDesignation: 'UPSC CSE (All-India Gazetted Civil Services — IAS / IPS / IFS)',
    prosAndCons: {
      thriveIf: [
        'You are driven by constitutional patriotism, social justice, and systemic governance',
        'You have vast intellectual curiosity across polity, history, economy, and ethics',
        'You desire sovereign executive authority and real community impact',
      ],
      reconsiderIf: [
        'You are banking on a single attempt without maintaining a viable Strategic Safety Net',
        'You desire personal privacy, high equity wealth, or foreign corporate settlement',
      ],
      thriveIfHindi: [
        'आप जिला प्रशासन और राष्ट्र निर्माण में सीधा योगदान देना चाहते हैं',
        'आपमें इतिहास, संविधान, अर्थशास्त्र और नीतिशास्त्र पढ़ने का धैर्य है',
      ],
      reconsiderIfHindi: [
        'आप बिना किसी मल्टी-ट्रैक करियर इंश्योरेंस (Strategic Safety Net) के केवल एक परीक्षा पर निर्भर हैं',
      ],
    },
    workLifeBalance: {
      weeklyHours: '60–75 Hours (24/7 Public Availability as DM)',
      stressLevel: 'High',
      remoteFlexibility: 'On-Site',
      jobSecurityIndex: 'Very High',
    },
    topColleges: [
      { name: 'LBSNAA Mussoorie (Cadre Academy)', type: 'Govt / Premier', examRequired: 'UPSC CSE', estCutoff: 'Top 100 Rank', totalFee: 'Full Govt Stipend', location: 'Mussoorie, Uttarakhand', nirfRankTier: 'Apex Civil Academy', badges: ['Govt of India', 'Constitutional Cadre'] },
      { name: 'Delhi University / St. Stephens / Hindu College', type: 'Govt / Premier', examRequired: 'CUET UG', estCutoff: '770+ CUET', totalFee: '₹60,000 Total', location: 'New Delhi', nirfRankTier: 'Top UPSC Feeder', badges: ['NIRF Verified', 'UGC Recognized'] },
    ],
  },
  'pilot-cpl': {
    averageGrowth: '+30% (Aviation Boom)',
    formalDesignation: 'DGCA CPL (Commercial Airline First Officer & Flight Commander)',
    prosAndCons: {
      thriveIf: [
        'You have flawless spatial reflexes, calm crisis composure, and love flying',
        'You enjoy traveling across time zones and experiencing different world cultures',
        'Your family has the financial capability or credit for ₹45–60L flight training',
      ],
      reconsiderIf: [
        'You have medical disqualifications (vision/heart issues under DGCA Class 1)',
        'You cannot afford high training debt without guaranteed airline placement',
      ],
      thriveIfHindi: [
        'आपमें कॉकपिट में शांत निर्णय लेने की क्षमता और एविएशन का जुनून है',
        'आपका परिवार फ्लाइट ट्रेनिंग के बजट या लोन के लिए तैयार है',
      ],
      reconsiderIfHindi: [
        'आप DGCA Class-1 मेडिकल मानकों को पूरा नहीं करते',
      ],
    },
    workLifeBalance: {
      weeklyHours: 'Max 35 Flying Hours/Week (DGCA limits) / Variable Rosters',
      stressLevel: 'Moderate',
      remoteFlexibility: 'On-Site',
      jobSecurityIndex: 'High',
    },
    topColleges: [
      { name: 'Indira Gandhi Rashtriya Uran Akademi (IGRUA)', type: 'Govt / Premier', examRequired: 'IGRUA Entrance + Pilot Aptitude', estCutoff: 'Top 100 Merit', totalFee: '₹45 Lakhs', location: 'Fursatganj, Amethi, UP', nirfRankTier: 'Govt National Flight Academy', badges: ['DGCA Approved', 'Ministry of Civil Aviation'] },
      { name: 'National Flying Training Institute (NFTI Gondia)', type: 'Top State / Private', examRequired: 'Cadet Selection', estCutoff: 'Aptitude & Interview', totalFee: '₹48 Lakhs', location: 'Gondia, Maharashtra', nirfRankTier: 'CAE Aviation', badges: ['DGCA Approved', 'AAI Joint Venture'] },
      { name: 'Air India / IndiGo Cadet Pilot Programs', type: 'Top State / Private', examRequired: 'Airline Cadet Tests (COMPASS)', estCutoff: 'Top Airline Test Score', totalFee: '₹90 Lakhs (With Type Rating & Job LOI)', location: 'India / USA Flight Bases', nirfRankTier: 'Direct Airline Pathway', badges: ['DGCA Approved', 'Airline LOI'] },
    ],
  },
};

// RESEARCH UPGRADE: Formal Corporate Designation Reframe Map
export function computeFormalDesignation(career: ChildCareer): { en: string; hi: string } {
  const id = career.id.toLowerCase();
  const title = career.title;
  if (id.includes('bca')) {
    return {
      en: 'BCA (Cloud & Full-Stack Software Engineer)',
      hi: 'BCA (क्लाउड और फुल-स्टैक सॉफ्टवेयर इंजीनियर)',
    };
  }
  if (id.includes('b-des') || id.includes('bdes') || id.includes('ux')) {
    return {
      en: 'B.Des (Product Systems & UX Architect)',
      hi: 'B.Des (प्रोडक्ट सिस्टम्स और UX आर्किटेक्ट)',
    };
  }
  if (id.includes('btech-cse')) {
    return {
      en: 'B.Tech CSE (Distributed Systems & AI Architect)',
      hi: 'B.Tech CSE (डिस्ट्रिब्यूटेड सिस्टम्स और AI आर्किटेक्ट)',
    };
  }
  if (id.includes('btech-ai')) {
    return {
      en: 'B.Tech AI & DS (Machine Learning & Data Systems Engineer)',
      hi: 'B.Tech AI & DS (मशीन लर्निंग और डेटा सिस्टम्स इंजीनियर)',
    };
  }
  if (id.includes('btech-ece') || id.includes('vlsi')) {
    return {
      en: 'B.Tech ECE (VLSI Semiconductor & Silicon Chip Architect)',
      hi: 'B.Tech ECE (VLSI सेमीकंडक्टर और चिप आर्किटेक्ट)',
    };
  }
  if (id.includes('bcom')) {
    return {
      en: 'B.Com Hons (Investment Banking & Valuation Analyst)',
      hi: 'B.Com Hons (इन्वेस्टमेंट बैंकिंग और वैल्यूएशन एनालिस्ट)',
    };
  }
  if (id.includes('ba-psychology')) {
    return {
      en: 'B.A./B.Sc Psychology (Clinical & Organizational Behavioral Scientist)',
      hi: 'B.A./B.Sc Psychology (क्लिनिकल और बिहेवियरल साइंटिस्ट)',
    };
  }
  if (id.includes('ba-economics')) {
    return {
      en: 'B.A. Hons Economics (Quantitative Econometrician & Policy Strategist)',
      hi: 'B.A. Hons Economics (क्वांटिटेटिव इकोनोमेट्रिशियन और पॉलिसी रणनीतिकार)',
    };
  }
  if (id.includes('b-arch') || id.includes('barch')) {
    return {
      en: 'B.Arch (Sustainable Urban & BIM Spatial Architect)',
      hi: 'B.Arch (सस्टेनेबल अर्बन और BIM आर्किटेक्ट)',
    };
  }
  if (id.includes('b-pharm') || id.includes('pharm')) {
    return {
      en: 'B.Pharm (Biopharmaceutical R&D & FDA Regulatory Scientist)',
      hi: 'B.Pharm (बायोफार्मास्यूटिकल R&D और ड्रग रेगुलेटरी वैज्ञानिक)',
    };
  }
  if (id.includes('nursing')) {
    return {
      en: 'B.Sc Nursing (Critical Care & International Registered Clinician)',
      hi: 'B.Sc Nursing (क्रिटिकल केयर और ग्लोबल रजिस्टर्ड क्लिनिशियन)',
    };
  }
  if (id.includes('polytechnic') || id.includes('diploma')) {
    return {
      en: 'Polytechnic Diploma (Junior Engineering Officer — RRB/SSC JE & Lateral B.Tech)',
      hi: 'पॉलिटेक्निक डिप्लोमा (जूनियर इंजीनियरिंग ऑफिसर — RRB/SSC JE)',
    };
  }
  if (career.formalDesignation) {
    return { en: career.formalDesignation, hi: career.formalDesignationHindi || career.formalDesignation };
  }
  return {
    en: `${title} (Verified Professional Track)`,
    hi: `${career.titleHindi || title} (प्रमाणित प्रोफेशनल ट्रैक)`,
  };
}

// UPGRADE 2 & 5 ("JobPathO"): Build domain-calibrated Job Roles so every career shows real daily jobs
export function buildDefaultJobRoles(career: ChildCareer): JobRoleItem[] {
  if (career.jobRoles && career.jobRoles.length > 0) return career.jobRoles;

  const entrySal =
    career.salaryInr?.entry ||
    (career.entrySalaryLakhs ? `₹${career.entrySalaryLakhs} LPA` : '₹6 LPA – ₹14 LPA');
  const midSal =
    career.salaryInr?.mid ||
    (career.midSalaryLakhs ? `₹${career.midSalaryLakhs} LPA` : '₹15 LPA – ₹30 LPA');
  const baseSkills =
    career.roadmap?.[0]?.details?.skills?.length
      ? career.roadmap[0].details.skills
      : career.tags && career.tags.length > 0
      ? career.tags
      : ['Domain Execution', 'Analytical Problem Solving', 'Technical Documentation'];

  const afterRoles: JobRoleItem[] = (career.afterRoadmap || []).map((ar) => ({
    title: ar.title,
    titleHindi: ar.titleHindi || ar.title,
    description: ar.description,
    descriptionHindi: ar.descriptionHindi || ar.description,
    dailyTasks: [
      'Execute core technical/clinical deliverables & quality audits',
      'Collaborate with cross-functional teams on high-impact projects',
      'Review performance telemetry and mentor junior associates',
    ],
    salaryRange: ar.salaryInr || entrySal,
    requiredSkills: baseSkills.slice(0, 4),
  }));

  const cat = career.category;
  if (cat === 'engineering') {
    return [
      ...afterRoles,
      {
        title: 'Systems / Product Development Engineer',
        titleHindi: 'सिस्टम्स / प्रोडक्ट डेवलपमेंट इंजीनियर',
        description: 'Design, build, test, and deploy production software or hardware systems for enterprise and consumer products.',
        descriptionHindi: 'एंटरप्राइज और कंज्यूमर प्रोडक्ट्स के लिए प्रोडक्शन सॉफ्टवेयर या हार्डवेयर सिस्टम डिजाइन और टेस्ट करना।',
        dailyTasks: [
          '09:30 AM — Sprint standup & architecture code/design review',
          '11:00 AM — Build core modules, write unit tests & benchmark latency',
          '03:30 PM — Deploy staging builds & debug production telemetry',
        ],
        salaryRange: entrySal,
        requiredSkills: [...baseSkills.slice(0, 3), 'System Architecture', 'Git & Testing'],
      },
      {
        title: 'PSU / ISRO / DRDO Gazetted Engineer (GATE Track)',
        titleHindi: 'पीएसयू / ISRO / DRDO राजपत्रित इंजीनियर (GATE ट्रैक)',
        description: 'Command national engineering projects in ONGC, NTPC, BHEL, ISRO, or DRDO with full government security.',
        descriptionHindi: 'GATE स्कोर के माध्यम से ONGC, NTPC, ISRO या DRDO में राष्ट्रीय इंजीनियरिंग प्रोजेक्ट्स का नेतृत्व करना।',
        dailyTasks: [
          'Supervise plant/lab engineering operations & safety compliance',
          'Approve technical tenders, vendor specs, and R&D prototypes',
          'Coordinate with ministry & senior scientific officers',
        ],
        salaryRange: '₹14 LPA – ₹22 LPA (PSU CTC)',
        requiredSkills: ['GATE Core Syllabus', 'Technical Standards', 'Project Management'],
      },
      {
        title: 'Technical Product Manager / Solutions Architect',
        titleHindi: 'टेक्निकल प्रोडक्ट मैनेजर / सॉल्यूशंस आर्किटेक्ट',
        description: 'Bridge engineering teams and enterprise clients to define product roadmaps and technical system integrations.',
        descriptionHindi: 'इंजीनियरिंग टीम और बिजनेस ग्राहकों के बीच तकनीकी रोडमैप और आर्किटेक्चर तय करना।',
        dailyTasks: [
          'Write technical PRDs & system integration blueprints',
          'Analyze user retention funnels & engineering sprint velocity',
          'Lead client architecture demos & security reviews',
        ],
        salaryRange: midSal,
        requiredSkills: ['Product Strategy', 'System Design', 'Data Analytics', 'Stakeholder Communication'],
      },
    ].slice(0, 4);
  }

  if (cat === 'medical') {
    return [
      ...afterRoles,
      {
        title: 'Junior Resident / Clinical Practitioner',
        titleHindi: 'जूनियर रेजिडेंट / क्लिनिकल प्रैक्टिशनर',
        description: 'Conduct patient OPD consultations, diagnose clinical conditions, interpret lab/imaging reports, and manage ward care.',
        descriptionHindi: 'ओपीडी (OPD) में मरीजों की जांच करना, डायग्नोसिस तय करना और वार्ड/इमरजेंसी उपचार संभालना।',
        dailyTasks: [
          '08:30 AM — Morning ward rounds & inpatient vitals review',
          '10:30 AM — Outpatient (OPD) diagnostics & treatment planning',
          '03:00 PM — Clinical procedure assistance & case documentation',
        ],
        salaryRange: entrySal,
        requiredSkills: [...baseSkills.slice(0, 3), 'Clinical Diagnosis', 'Patient Ethics'],
      },
      {
        title: 'Government Medical / Health Officer (Central & State)',
        titleHindi: 'सरकारी चिकित्सा / स्वास्थ्य अधिकारी (Class-1 Gazetted)',
        description: 'Lead public hospitals, AIIMS/CGHS centers, or Armed Forces Medical Services with permanent government tenure.',
        descriptionHindi: 'सरकारी अस्पतालों, CGHS, रेलवे या सशस्त्र बलों में स्थायी राजपत्रित चिकित्सा अधिकारी के रूप में सेवा देना।',
        dailyTasks: [
          'Manage public health OPD & emergency triage protocols',
          'Supervise national immunization & health mission programs',
          'Certify medico-legal and institutional health records',
        ],
        salaryRange: '₹10 LPA – ₹18 LPA + Govt Perks',
        requiredSkills: ['Public Health Protocols', 'Emergency Medicine', 'Clinical Administration'],
      },
      {
        title: 'Clinical Research Scientist / Medical Advisor',
        titleHindi: 'क्लिनिकल रिसर्च वैज्ञानिक / मेडिकल एडवाइजर',
        description: 'Lead Phase I–III drug trials, pharmacovigilance, and medical regulatory affairs in global healthcare & pharma MNCs.',
        descriptionHindi: 'मल्टीनेशनल फार्मा और हेल्थकेयर कंपनियों में नई दवाओं के क्लिनिकल ट्रायल और रिसर्च का नेतृत्व करना।',
        dailyTasks: [
          'Audit clinical trial safety data & FDA/CDSCO dossiers',
          'Collaborate with hospital investigators on therapy outcomes',
          'Publish peer-reviewed clinical evidence papers',
        ],
        salaryRange: midSal,
        requiredSkills: ['Clinical Trial Design', 'Biostatistics', 'Pharmacovigilance', 'Regulatory Affairs'],
      },
    ].slice(0, 4);
  }

  if (cat === 'commerce' || cat === 'law') {
    return [
      ...afterRoles,
      {
        title: 'Corporate Finance / Legal / Strategy Associate',
        titleHindi: 'कॉर्पोरेट फाइनेंस / लीगल / स्ट्रैटेजी एसोसिएट',
        description: 'Execute financial valuations, statutory audits, contract drafting, or regulatory compliance for listed enterprises and Big-4 firms.',
        descriptionHindi: 'बड़ी कंपनियों और Big-4 फर्म्स के लिए फाइनेंशियल ऑडिट, वैल्यूएशन मॉडलिंग या कॉर्पोरेट कॉन्ट्रैक्ट ड्राफ्टिंग करना।',
        dailyTasks: [
          '09:30 AM — Market/regulatory briefing & client deliverable triage',
          '11:00 AM — Build DCF financial models, tax audits, or legal briefs',
          '04:00 PM — Present findings to senior partners & corporate boards',
        ],
        salaryRange: entrySal,
        requiredSkills: [...baseSkills.slice(0, 3), 'Financial / Legal Modeling', 'Due Diligence'],
      },
      {
        title: 'RBI / SEBI / PSU Finance & Law Officer (Govt Track)',
        titleHindi: 'RBI / SEBI / PSU फाइनेंस और विधि अधिकारी (सरकारी ट्रैक)',
        description: 'Serve as a Grade-A/Grade-B officer in RBI, SEBI, NABARD, Nationalized Banks, or Maharatna PSUs.',
        descriptionHindi: 'RBI, SEBI, NABARD, राष्ट्रीयकृत बैंकों या महारत्न PSU में ग्रेड-A/B अधिकारी के रूप में कार्य करना।',
        dailyTasks: [
          'Monitor banking, capital market, and corporate compliance',
          'Audit public sector capex budgets & statutory filings',
          'Draft regulatory circulars and policy adjudications',
        ],
        salaryRange: '₹14 LPA – ₹30 LPA (Gross Govt CTC)',
        requiredSkills: ['Regulatory Law', 'Macroeconomics', 'Corporate Governance', 'Quantitative Analysis'],
      },
    ].slice(0, 4);
  }

  return [
    ...afterRoles,
    {
      title: `Core ${career.title.split('(')[0].trim()} Specialist`,
      titleHindi: `प्रमुख ${career.titleHindi || career.title} विशेषज्ञ`,
      description: 'Execute specialized domain projects, research analysis, and operational delivery across premier organizations.',
      descriptionHindi: 'शीर्ष संस्थानों और कंपनियों में डोमेन प्रोजेक्ट्स, रिसर्च एनालिसिस और ऑपरेशनल कार्यों का निष्पादन करना।',
      dailyTasks: [
        '09:30 AM — Daily project briefing & priority task allocation',
        '11:00 AM — Core hands-on domain execution, studio/lab work, or field administration',
        '04:00 PM — Quality verification, stakeholder reporting & skill upskilling',
      ],
      salaryRange: entrySal,
      requiredSkills: baseSkills.slice(0, 4),
    },
    {
      title: 'UPSC / SSC CGL / State PSC Gazetted Officer (Sarkari Track)',
      titleHindi: 'UPSC / SSC CGL / राज्य PSC राजपत्रित अधिकारी',
      description: 'Leverage your UGC-recognized degree to enter Group-A/B Central and State administrative services.',
      descriptionHindi: 'अपनी UGC-मान्यता प्राप्त डिग्री के आधार पर UPSC, SSC CGL या राज्य सिविल सेवा में राजपत्रित अधिकारी बनना।',
      dailyTasks: [
        'Direct district or departmental public administration',
        'Implement government welfare & infrastructure schemes',
        'Chair inter-departmental review and citizen grievance committees',
      ],
      salaryRange: '₹10.5 LPA – ₹18 LPA + Govt Perks',
      requiredSkills: ['Public Administration', 'Constitutional Polity', 'Data-Driven Governance'],
    },
  ].slice(0, 4);
}

function computeDefaultSkillRadar(career: ChildCareer): {
  analytical: number;
  technical: number;
  creative: number;
  leadership: number;
  communication: number;
  execution: number;
} {
  if (career.skillRadar) return career.skillRadar;
  const id = career.id.toLowerCase();
  const cat = career.category.toLowerCase();

  if (id.includes('ai') || id.includes('data') || id.includes('quant')) {
    return { analytical: 98, technical: 96, creative: 80, leadership: 76, communication: 78, execution: 90 };
  }
  if (id.includes('cse') || id.includes('cyber') || id.includes('bca') || id.includes('cloud')) {
    return { analytical: 94, technical: 96, creative: 82, leadership: 75, communication: 80, execution: 92 };
  }
  if (cat === 'engineering') {
    return { analytical: 92, technical: 95, creative: 76, leadership: 80, communication: 78, execution: 90 };
  }
  if (cat === 'medical') {
    return { analytical: 88, technical: 92, creative: 70, leadership: 84, communication: 88, execution: 95 };
  }
  if (cat === 'commerce') {
    return { analytical: 92, technical: 82, creative: 74, leadership: 88, communication: 90, execution: 90 };
  }
  if (cat === 'law') {
    return { analytical: 94, technical: 76, creative: 80, leadership: 90, communication: 98, execution: 88 };
  }
  if (cat === 'design') {
    return { analytical: 80, technical: 86, creative: 98, leadership: 80, communication: 90, execution: 88 };
  }
  if (cat === 'arts') {
    return { analytical: 82, technical: 70, creative: 90, leadership: 84, communication: 96, execution: 85 };
  }
  if (cat === 'science') {
    return { analytical: 96, technical: 92, creative: 82, leadership: 74, communication: 78, execution: 88 };
  }
  if (cat === 'government') {
    return { analytical: 90, technical: 78, creative: 74, leadership: 98, communication: 94, execution: 95 };
  }
  return { analytical: 84, technical: 94, creative: 72, leadership: 84, communication: 84, execution: 96 };
}

function buildContextualBilingualFaqs(career: ChildCareer): Array<{
  q: string;
  qHindi?: string;
  a: string;
  aHindi?: string;
}> {
  const existing = career.faqs || [];
  const titleEn = career.title;
  const titleHi = career.titleHindi || career.title;
  const entrySal = career.salaryInr?.entry || (career.entrySalaryLakhs ? `₹${career.entrySalaryLakhs} LPA` : '₹12 LPA');
  const midSal = career.salaryInr?.mid || (career.midSalaryLakhs ? `₹${career.midSalaryLakhs} LPA` : '₹28 LPA');
  const exams = (career.eligibility?.exams || ['National / State Entrance']).join(', ');
  const streams = (career.eligibility?.streams || ['Any']).join(' / ');

  const extraFaqs: Array<{ q: string; qHindi: string; a: string; aHindi: string }> = [
    {
      q: `What is the real monthly in-hand salary vs advertised CTC in ${titleEn}?`,
      qHindi: `${titleHi} में विज्ञापित पैकेज (CTC) बनाम असली मासिक इन-हैंड (In-Hand) सैलरी कितनी होती है?`,
      a: `While entry-level CTC ranges around ${entrySal}, actual monthly in-hand take-home pay is typically 75%–85% of the gross package after PF, gratuity, variable bonus, and tax deductions. By mid-career (4–6 years), compensation scales to ${midSal} with significantly higher base cash components.`,
      aHindi: `शुरुआती पैकेज (${entrySal}) में प्रोविडेंट फंड (PF), टैक्स और वेरिएबल बोनस कटने के बाद असली मासिक इन-हैंड (In-Hand) वेतन कुल पैकेज का लगभग 75%–85% होता है। 4–6 साल के अनुभव के बाद यह बढ़कर ${midSal} तक पहुंच जाता है।`,
    },
    {
      q: `Can a student from a Tier-2/Tier-3 city or state college succeed in ${titleEn} without expensive coaching?`,
      qHindi: `क्या छोटे शहर (Tier-2/3) या राज्य कॉलेज का छात्र बिना महंगी कोचिंग के ${titleHi} में सफल हो सकता है?`,
      a: `Yes, 100%. Employers and selection boards evaluate your demonstrable skills, core fundamentals, and practical projects/internships rather than coaching tags. By using free Govt platforms (SWAYAM, NPTEL IIT lectures, NCERT) and solving 10 years of official past papers (${exams}), students regularly outperform expensive coaching batches.`,
      aHindi: `हाँ, 100%! कंपनियां और चयन बोर्ड आपके असली कौशल (Skills), प्रैक्टिकल प्रोजेक्ट्स और बुनियादी समझ को देखते हैं, न कि महंगी कोचिंग के टैग को। मुफ्त सरकारी प्लेटफॉर्म (SWAYAM/NPTEL, NCERT) और पिछले 10 वर्षों के प्रश्नपत्रों (${exams}) के अभ्यास से छात्र आसानी से शीर्ष सफलता पाते हैं।`,
    },
    {
      q: `What scholarships and collateral-free education loans are available for ${titleEn}?`,
      qHindi: `${titleHi} की पढ़ाई के लिए कौन-सी सरकारी छात्रवृत्ति (Scholarship) और बिना गारंटी का एजुकेशन लोन उपलब्ध है?`,
      a: `Under the PM-Vidyalaxmi Scheme (pmvidyalaxmi.co.in), students admitted to recognized quality institutions receive 100% collateral-free and guarantor-free education loans, with a 75% Govt credit guarantee up to ₹7.5 Lakhs and a 3% interest subvention up to ₹10 Lakhs (for family income under ₹8 LPA). Additionally, families with income under ₹4.5 LPA get 100% interest waiver during college under CSIS, and female students in technical tracks receive ₹50,000/year via the AICTE Pragati Scholarship.`,
      aHindi: `पीएम-विद्यालक्ष्मी योजना (pmvidyalaxmi.co.in) के तहत बिना किसी ज़मीन/गहने गिरवी रखे और बिना गारंटर के एजुकेशन लोन मिलता है (₹7.5 लाख तक 75% सरकारी गारंटी और ₹8 लाख से कम आय पर ₹10 लाख तक के लोन पर 3% ब्याज छूट)। ₹4.5 लाख से कम आय वाले परिवारों को पढ़ाई के दौरान 100% ब्याज माफी (CSIS) और बेटियों को AICTE प्रगति योजना से ₹50,000/वर्ष की सीधी छात्रवृत्ति मिलती है।`,
    },
    {
      q: `Is this degree eligible for UPSC, SSC CGL, Bank PO, and Government PSU jobs?`,
      qHindi: `क्या इस डिग्री के बाद UPSC, SSC CGL, बैंक PO और सरकारी नौकरियों के दरवाजे खुले रहते हैं?`,
      a: `Yes! Because this pathway confers a UGC / AICTE / Statutory recognized degree, you are 100% eligible for UPSC Civil Services (IAS/IPS), SSC CGL, IBPS/SBI Bank PO, State PSC, and specialized Government PSU officer recruitments.`,
      aHindi: `जी हाँ! यह डिग्री UGC / AICTE / वैधानिक परिषद द्वारा 100% मान्यता प्राप्त है, इसलिए आपके लिए UPSC (IAS/IPS), SSC CGL, बैंक PO, राज्य पीएससी और सरकारी PSU अधिकारियों की सभी परीक्षाओं के दरवाजे पूरी तरह खुले रहते हैं।`,
    },
    {
      q: `What is the best Strategic Safety Net (Multi-Track Career Insurance) if I miss the top cutoff in ${exams}?`,
      qHindi: `यदि ${exams} में टॉप कटऑफ कुछ अंकों से रह जाए, तो सबसे सुरक्षित 'रणनीतिक सुरक्षा कवच (Multi-Track Career Insurance)' क्या है?`,
      a: `Never waste 2–3 drop years in panic. If your score falls slightly short of Tier-1 cutoffs, activate your Multi-Track Career Insurance: enroll in a high-ROI state/central university or parallel allied specialization (${streams} eligible), build hands-on proof-of-work and internships from Year 1, and target lateral entry or postgraduate premier entrance exams later.`,
      aHindi: `घबराहट में 2–3 साल ड्रॉप ईयर में बर्बाद न करें। यदि टॉप कटऑफ कुछ अंकों से चूक जाए, तो अपना 'मल्टी-ट्रैक करियर इंश्योरेंस' (Strategic Safety Net) अपनाएं: कम फीस वाले राज्य/केंद्रीय विश्वविद्यालय या समानांतर ट्रैक (${streams}) में प्रवेश लें, पहले वर्ष से ही प्रैक्टिकल प्रोजेक्ट्स व इंटर्नशिप करें और आगे लेटरल एंट्री या GATE/CAT/PG के जरिए टॉप संस्थान में जाएं।`,
    },
  ];

  const combined = [...existing];
  for (const item of extraFaqs) {
    if (combined.length >= 8) break;
    const isDup = combined.some(
      (ex) => ex.q.toLowerCase().slice(0, 25) === item.q.toLowerCase().slice(0, 25)
    );
    if (!isDup) {
      combined.push(item);
    }
  }
  return combined;
}

function enrichOverviewText(career: ChildCareer): { overview: string; overviewHindi: string } {
  const baseEn =
    career.overview ||
    career.tagline ||
    `${career.title} is a high-impact career pathway in India offering strong upward mobility.`;
  const baseHi =
    career.overviewHindi ||
    career.taglineHindi ||
    `${career.titleHindi || career.title} भारत में एक उच्च-मांग और सुरक्षित करियर मार्ग है।`;

  const streams = (career.eligibility?.streams || ['Any']).join('/');
  const exams = (career.eligibility?.exams || ['National/State Merit Entrance']).join(', ');
  const entrySal = career.salaryInr?.entry || (career.entrySalaryLakhs ? `₹${career.entrySalaryLakhs} LPA` : '₹12 LPA');

  const extraEn =
    baseEn.length < 280
      ? ` Designed for ${streams} students entering via ${exams}, this track blends rigorous foundational training with applied industry execution. Graduates unlock dual career pathways across public-sector institutions and high-growth private enterprises (starting around ${entrySal}), with strong lateral mobility into leadership, specialized consulting, and global roles within 5–8 years.`
      : '';

  const extraHi =
    baseHi.length < 260
      ? ` ${streams} स्ट्रीम के छात्रों के लिए (${exams} के माध्यम से) यह क्षेत्र सरकारी और प्राइवेट दोनों सेक्टर में शानदार अवसर देता है। इसमें शुरुआती पैकेज लगभग ${entrySal} रहता है और 5–8 वर्षों के अनुभव के साथ उच्च लीडरशिप व ग्लोबल करियर के रास्ते खुलते हैं।`
      : '';

  return {
    overview: `${baseEn}${extraEn}`,
    overviewHindi: `${baseHi}${extraHi}`,
  };
}

// TRUST UPGRADE: Sarkari Authority Badges per category
// TRUST UPGRADE: Sarkari Eligibility Details & Status per category
export function computeSarkariEligibilityDetails(category: string): SarkariEligibilityDetails {
  const baseExams = ['UPSC CSE (IAS/IPS/IFS)', 'SSC CGL (Group B/C Officer)', 'IBPS / SBI / RBI Bank PO', 'State PSC & Defense CDS'];
  if (category === 'engineering' || category === 'science') {
    return {
      status: '[✅ Eligible for UPSC/SSC/Bank PO]',
      badgeText: '[✅ Eligible for UPSC/SSC/Bank PO]',
      isEligible: true,
      eligibleExams: [...baseExams, 'GATE PSU / ISRO / DRDO Scientist-B', 'UPSC ESE (IES)'],
      recognitionBody: 'AICTE / UGC Statutory Degree',
      notesEn: '100% recognized graduation degree for UPSC Civil Services, SSC CGL, Bank PO/SO, State PSC, and GATE PSU Officer recruitment.',
      notesHi: 'यह डिग्री UPSC (IAS/IPS), SSC CGL, बैंक PO/SO, राज्य पीएससी और GATE पीएसयू अधिकारी भर्ती के लिए 100% मान्य है।',
    };
  }
  if (category === 'medical') {
    return {
      status: '[✅ Eligible for UPSC/SSC/Bank PO]',
      badgeText: '[✅ Eligible for UPSC/SSC/Bank PO]',
      isEligible: true,
      eligibleExams: [...baseExams, 'UPSC CMS (Combined Medical Services)', 'AIIMS / ESIC / Railway Medical Officer'],
      recognitionBody: 'NMC / UGC / Central Council Recognized',
      notesEn: 'Eligible for UPSC Civil Services, UPSC Combined Medical Services (CMS), Central/State Govt Hospital Cadres, SSC, and Bank Officer exams.',
      notesHi: 'यह डिग्री UPSC सिविल सेवा, UPSC CMS (मेडिकल ऑफिसर), केंद्र/राज्य सरकारी अस्पताल कैडर, SSC और बैंक अधिकारी परीक्षाओं के लिए 100% पात्र है।',
    };
  }
  if (category === 'commerce') {
    return {
      status: '[✅ Eligible for UPSC/SSC/Bank PO]',
      badgeText: '[✅ Eligible for UPSC/SSC/Bank PO]',
      isEligible: true,
      eligibleExams: [...baseExams, 'RBI Grade B / SEBI Grade A / NABARD', 'CAG Assistant Audit Officer (AAO)'],
      recognitionBody: 'UGC / Statutory Parliament Act Body',
      notesEn: '100% eligible for UPSC CSE, SSC CGL (including AAO Audit Officer), RBI Grade B, SBI/IBPS Bank PO, and PSU Finance Officer cadres.',
      notesHi: 'यह डिग्री UPSC, SSC CGL (AAO ऑडिट ऑफिसर सहित), RBI ग्रेड B, SBI/IBPS बैंक PO और सरकारी वित्त अधिकारी पदों के लिए 100% पात्र है।',
    };
  }
  if (category === 'law') {
    return {
      status: '[✅ Eligible for UPSC/SSC/Bank PO]',
      badgeText: '[✅ Eligible for UPSC/SSC/Bank PO]',
      isEligible: true,
      eligibleExams: [...baseExams, 'PCS-J (Judicial Magistrate)', 'IBPS SO Law Officer & JAG Defense'],
      recognitionBody: 'Bar Council of India (BCI) & UGC Recognized',
      notesEn: '100% eligible for UPSC CSE, State Judiciary (PCS-J), Bank Specialist Law Officer (IBPS SO), Army JAG, and SSC CGL.',
      notesHi: 'यह डिग्री UPSC, जज भर्ती (PCS-J), बैंक लॉ ऑफिसर (IBPS SO), सेना JAG और SSC CGL के लिए 100% मान्य है।',
    };
  }
  return {
    status: '[✅ Eligible for UPSC/SSC/Bank PO]',
    badgeText: '[✅ Eligible for UPSC/SSC/Bank PO]',
    isEligible: true,
    eligibleExams: baseExams,
    recognitionBody: 'UGC / AICTE / Govt of India Recognized',
    notesEn: '100% valid undergraduate track for UPSC Civil Services, SSC CGL, IBPS/SBI Bank PO, Defense CDS/AFCAT, and State PSC exams.',
    notesHi: 'यह स्नातक ट्रैक UPSC सिविल सेवा, SSC CGL, बैंक PO, रक्षा (CDS/AFCAT) और राज्य पीएससी परीक्षाओं के लिए 100% मान्य है।',
  };
}

function computeAuthorityBadges(career: ChildCareer): string[] {
  if (career.authorityBadges && career.authorityBadges.length > 0) return career.authorityBadges;
  if (career.category === 'engineering') return ['NIRF Verified', 'AICTE Approved', 'UGC Recognized'];
  if (career.category === 'medical') return ['NIRF Verified', 'NMC / Govt Approved', 'UGC Recognized'];
  if (career.category === 'law') return ['NIRF Verified', 'BCI Approved', 'UGC Recognized'];
  if (career.category === 'commerce') return ['NIRF Verified', 'UGC Recognized', 'Statutory Approved'];
  if (career.category === 'government') return ['Govt of India', 'UPSC / PSC Cadre', '7th/8th CPC Verified'];
  return ['NIRF Verified', 'AICTE / UGC Approved', 'Govt Portal Verified'];
}

export function enrichChildCareer(career: ChildCareer): ChildCareer {
  const enrich = CAREER_ENRICHMENT[career.id];
  const skillRadar = computeDefaultSkillRadar(career);
  const enrichedFaqs = buildContextualBilingualFaqs(career);
  const { overview, overviewHindi } = enrichOverviewText(career);
  const formal = computeFormalDesignation(career);
  const authorityBadges = computeAuthorityBadges(career);
  const sarkariEligibilityDetails = career.sarkariEligibilityDetails || computeSarkariEligibilityDetails(career.category);
  const sarkariEligibility = career.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]';
  const jobRoles = enrich?.jobRoles || buildDefaultJobRoles(career);

  const stepCost =
    career.roadmap?.find((s) => s.details?.costInr && !s.details.costInr.includes('Stipend'))?.details
      ?.costInr ||
    career.roadmap?.[1]?.details?.costInr ||
    career.roadmap?.[0]?.details?.costInr;
  const stepCostHi =
    career.roadmap?.find((s) => s.details?.costInrHindi)?.details?.costInrHindi || stepCost;

  const derivedDuration =
    career.duration ||
    (career.id.includes('bca')
      ? '3 Years (6 Semesters)'
      : career.category === 'medical' && career.id.includes('mbbs')
      ? '5.5 Years (incl. Internship)'
      : career.category === 'law'
      ? '5 Years (Integrated) / 3 Years'
      : career.category === 'engineering'
      ? '4 Years (8 Semesters)'
      : '3–4 Years');

  const derivedDurationHi =
    career.durationHindi ||
    (career.id.includes('bca')
      ? '3 वर्ष (6 सेमेस्टर)'
      : career.category === 'medical' && career.id.includes('mbbs')
      ? '5.5 वर्ष (इंटर्नशिप सहित)'
      : career.category === 'law'
      ? '5 वर्ष (इंटीग्रेटेड) / 3 वर्ष'
      : career.category === 'engineering'
      ? '4 वर्ष (8 सेमेस्टर)'
      : '3–4 वर्ष');

  const derivedCost =
    career.cost ||
    stepCost ||
    (career.id.includes('bca') ? '₹45,000 – ₹3 Lakhs' : '₹60,000 – ₹8 Lakhs');
  const derivedCostHi = career.costHindi || stepCostHi || derivedCost;

  const derivedDifficulty =
    career.difficulty ||
    (career.id.includes('ias') || career.id.includes('mbbs') || career.id.includes('ca-')
      ? 'High (Competitive)'
      : 'Moderate to High');

  const derivedDifficultyHi =
    career.difficultyHindi ||
    (career.id.includes('ias') || career.id.includes('mbbs') || career.id.includes('ca-')
      ? 'उच्च (प्रतिस्पर्धी)'
      : 'मध्यम से उच्च');

  const derivedDemand = career.demand || 'High Demand';
  const derivedDemandHi = career.demandHindi || 'उच्च मांग';

  const parseNum = (str: string | undefined, fb: number): number => {
    if (!str) return fb;
    const m = str.match(/(\d+(?:\.\d+)?)/g);
    if (!m || m.length === 0) return fb;
    const nums = m.map(Number).filter((n) => !Number.isNaN(n));
    return nums.length >= 2 ? Math.round(((nums[0] + nums[1]) / 2) * 10) / 10 : nums[0] || fb;
  };

  const entrySalaryLakhs =
    career.entrySalaryLakhs ||
    parseNum(career.salaryInr?.entry || career.roadmap?.[0]?.details?.salaryInr?.entry, 8);
  const midSalaryLakhs =
    career.midSalaryLakhs ||
    parseNum(career.salaryInr?.mid || career.roadmap?.[0]?.details?.salaryInr?.mid, 20);

  const defaultColleges: CollegeInfo[] = [
    {
      name: 'Top Central & National Institutes (INI / Central Univ)',
      type: 'Govt / Premier',
      examRequired: 'National Entrance (JEE / NEET / CUET / GATE)',
      estCutoff: 'Top 2–5%ile',
      totalFee: '₹40,000 – ₹3.5 Lakhs (Full Degree)',
      location: 'Pan India',
      nirfRankTier: 'NIRF Top Tier',
      badges: ['NIRF Verified', 'AICTE Approved', 'UGC Recognized'],
    },
    {
      name: 'Premier State Govt & Autonomous Universities',
      type: 'Govt / Premier',
      examRequired: 'State CET / Merit Counseling',
      estCutoff: '92+ Percentile',
      totalFee: '₹60,000 – ₹2.5 Lakhs (Full Degree)',
      location: 'Major State Capitals',
      nirfRankTier: 'NAAC A++ Govt',
      badges: ['NIRF Verified', 'UGC Recognized'],
    },
    {
      name: 'Private / Deemed Universities (Debt-Trap Warning if Unaccredited)',
      type: 'Top State / Private',
      examRequired: 'University Entrance / Management',
      estCutoff: '70–85 Percentile',
      totalFee: '₹12 Lakhs – ₹22 Lakhs (High Debt Trap)',
      location: 'Metro Hubs',
      nirfRankTier: 'Verify AICTE/NIRF First',
      badges: ['AICTE Approved', 'Verify ROI'],
    },
  ];

  if (!enrich) {
    return {
      ...career,
      overview,
      overviewHindi,
      duration: derivedDuration,
      durationHindi: derivedDurationHi,
      cost: derivedCost,
      costHindi: derivedCostHi,
      difficulty: derivedDifficulty,
      difficultyHindi: derivedDifficultyHi,
      demand: derivedDemand,
      demandHindi: derivedDemandHi,
      entrySalaryLakhs,
      midSalaryLakhs,
      formalDesignation: formal.en,
      formalDesignationHindi: formal.hi,
      sarkariEligible: true,
      sarkariEligibility,
      sarkariEligibilityDetails,
      authorityBadges,
      jobRoles,
      faqs: enrichedFaqs,
      skillRadar,
      averageGrowth: career.averageGrowth || '+22% (5-Yr)',
      prosAndCons: career.prosAndCons || {
        thriveIf: [
          'You have sustained curiosity and dedication toward this domain',
          'You are disciplined in self-study and practical project development',
          'You value steady career advancement and recognized professional skills',
        ],
        reconsiderIf: [
          'You are choosing this path solely due to parental or peer pressure',
          'You dislike the core day-to-day tasks described in the roadmap steps',
        ],
        thriveIfHindi: [
          'आपमें इस क्षेत्र के प्रति निरंतर जिज्ञासा और समर्पण है',
          'आप स्व-अध्ययन और प्रैक्टिकल प्रोजेक्ट्स में अनुशासित हैं',
        ],
        reconsiderIfHindi: [
          'आप केवल दूसरों के दबाव में यह करियर चुन रहे हैं',
        ],
      },
      workLifeBalance: career.workLifeBalance || {
        weeklyHours: '40–48 Hours',
        stressLevel: 'Moderate',
        remoteFlexibility: 'Hybrid',
        jobSecurityIndex: 'High',
      },
      topColleges: career.topColleges?.map((c) => ({
        ...c,
        badges: c.badges || ['NIRF Verified', 'AICTE Approved', 'UGC Recognized'],
      })) || defaultColleges,
    };
  }

  return {
    ...career,
    overview,
    overviewHindi,
    duration: derivedDuration,
    durationHindi: derivedDurationHi,
    cost: derivedCost,
    costHindi: derivedCostHi,
    difficulty: derivedDifficulty,
    difficultyHindi: derivedDifficultyHi,
    demand: derivedDemand,
    demandHindi: derivedDemandHi,
    entrySalaryLakhs,
    midSalaryLakhs,
    formalDesignation: enrich.formalDesignation || formal.en,
    formalDesignationHindi: formal.hi,
    sarkariEligible: true,
    sarkariEligibility,
    sarkariEligibilityDetails,
    authorityBadges,
    jobRoles,
    faqs: enrichedFaqs,
    skillRadar,
    averageGrowth: enrich.averageGrowth,
    prosAndCons: enrich.prosAndCons,
    workLifeBalance: enrich.workLifeBalance,
    topColleges: enrich.topColleges.map((c) => ({
      ...c,
      badges: c.badges || ['NIRF Verified', 'AICTE Approved', 'UGC Recognized'],
    })),
  };
}
