export interface OfficialSourceRecord {
  id: string;
  organization: string;
  organizationHi: string;
  title: string;
  titleHi: string;
  url: string;
  publicationDate: string;
  accessDate: string;
  domainCategory:
    | 'Labor & Macro Statistics'
    | 'Higher Education & Rankings'
    | 'Engineering & Science'
    | 'Medical, Nursing & Allied Health'
    | 'Commerce, Finance & Corporate Law'
    | 'Civil Services, Defense & Judiciary'
    | 'Design, Architecture, Media & Arts'
    | 'Agriculture, Environment & Veterinary'
    | 'Aviation, Maritime, Sports & Vocational'
    | 'Scholarships, Loans & Student Welfare';
  supportedClaims: string[];
  supportedQuizQuestions: number[];
}

export interface CategoryDistributionRow {
  category:
    | 'Engineering & Tech'
    | 'Medical & Health'
    | 'Commerce & Business'
    | 'Arts & Design'
    | 'Law & Government'
    | 'Vocational & Trades'
    | 'Sports & Fitness'
    | 'Media & Entertainment'
    | 'Agriculture & Environment';
  previousCount250: number;
  addedCount123: number;
  newTotal373: number;
  sharePercent: number;
  representativeNewCareers: string[];
}

export const CATEGORY_DISTRIBUTION_373_REPORT: CategoryDistributionRow[] = [
  {
    category: 'Engineering & Tech',
    previousCount250: 60,
    addedCount123: 5,
    newTotal373: 65,
    sharePercent: 17.4,
    representativeNewCareers: [
      'B.Tech High-Speed Rail & Metro Signalling Engineering',
      'B.Tech Semiconductor Packaging & ATMP Process Engineering',
      'B.Tech Cryogenic & Hydrogen Fuel-Cell Propulsion Engineering',
      'B.Tech Smart Grid & HVDC Power Transmission Engineering',
      'B.Sc / M.Sc Computational Physics & Scientific Simulation',
    ],
  },
  {
    category: 'Law & Government',
    previousCount250: 44,
    addedCount123: 6,
    newTotal373: 50,
    sharePercent: 13.4,
    representativeNewCareers: [
      'UPSC Combined Geo-Scientist & Hydrogeology Officer (GSI)',
      'Employees Provident Fund Organisation Enforcement Officer (UPSC EPFO)',
      'Lok Sabha / Rajya Sabha Parliamentary Research & Legislative Officer',
      'Maritime Admiralty, Shipping & International Trade Lawyer',
      'Competition Law (CCI), Antitrust & Merger Control Specialist',
      'Bureau of Indian Standards (BIS) Scientist-B & Quality Officer',
    ],
  },
  {
    category: 'Commerce & Business',
    previousCount250: 34,
    addedCount123: 10,
    newTotal373: 44,
    sharePercent: 11.8,
    representativeNewCareers: [
      'GIFT City IFSC International Banking & Cross-Border Treasury Specialist',
      'Insolvency & Bankruptcy (IBC) Resolution Professional & Turnaround Advisor',
      'Commodity Derivatives, Bullion & Agri-Hedging Risk Manager (MCX / NCDEX)',
      'Reinsurance Underwriter & Catastrophe Treaty Broker (GIC Re / IRDAI)',
      'Hospitality Revenue Management & Luxury Asset Operations Leader (NCHMCT)',
    ],
  },
  {
    category: 'Medical & Health',
    previousCount250: 23,
    addedCount123: 16,
    newTotal373: 39,
    sharePercent: 10.5,
    representativeNewCareers: [
      'B.Sc Perfusion Technology & Cardiopulmonary Bypass Specialist',
      'B.Sc Radiotherapy Technology & Medical Dosimetry Specialist',
      'B.Sc Renal Dialysis & Nephrology Critical Care Technologist',
      'Bachelor of Prosthetics & Orthotics (BPO — RCI Licensed)',
      'B.Sc Respiratory Therapy & ICU Mechanical Ventilation Specialist',
    ],
  },
  {
    category: 'Arts & Design',
    previousCount250: 24,
    addedCount123: 14,
    newTotal373: 38,
    sharePercent: 10.2,
    representativeNewCareers: [
      'B.Des Exhibition, Museum Scenography & Experiential Space Design',
      'B.Des Ceramic, Glass & Sustainable Material Craft Design (NID)',
      'B.Des Toy, Play-System & Educational Gamification Design',
      'Archival Studies, Manuscriptology & Digital Heritage Curation (NAI)',
      'Computational Linguistics, Lexicography & Bhashini Language Technologist',
    ],
  },
  {
    category: 'Media & Entertainment',
    previousCount250: 24,
    addedCount123: 14,
    newTotal373: 38,
    sharePercent: 10.2,
    representativeNewCareers: [
      'FTII Cinematography, Digital Imaging (DIT) & Motion Picture Lighting',
      'Film Editing, Non-Linear Narrative Assembly & Post-Production Supervisor',
      'Science & Climate Communication Journalist (Vigyan Prasar / Print / Digital)',
      'Live Concert Touring, Stadium Audio-Visual & Festival Technical Producer',
      'Localization, Dubbing Direction & Multi-Lingual OTT Adaptation Producer',
    ],
  },
  {
    category: 'Agriculture & Environment',
    previousCount250: 22,
    addedCount123: 16,
    newTotal373: 38,
    sharePercent: 10.2,
    representativeNewCareers: [
      'B.Sc Sericulture, Silk Biotech & Central Silk Board Scientist',
      'B.Tech Agricultural Process, Post-Harvest & Cold-Chain Engineering (ICAR)',
      'Spices, Plantation Crops & Medicinal Aromatics Scientist (CIMAP / Spices Board)',
      'Glaciology, Himalayan Cryosphere & Flood Forecasting Scientist (NIH / CWC)',
      'Environmental Impact Assessment (EIA) & CPCB Pollution Compliance Auditor',
    ],
  },
  {
    category: 'Vocational & Trades',
    previousCount250: 9,
    addedCount123: 22,
    newTotal373: 31,
    sharePercent: 8.3,
    representativeNewCareers: [
      'Central Tool Room (MSME-CTTC) Precision CNC 5-Axis & Die-Mold Technologist',
      'CIPET Plastics Processing, Polymer Testing & Injection Molding Technologist',
      'Indian Railways Signalling, Interlocking & Kavach ATP Maintenance Technician',
      'High-Voltage Substation, GIS Switchgear & Power Grid Lineman Specialist',
      'Fire Safety, Industrial Hazard Control & Airport Rescue Officer (NFSC Nagpur)',
    ],
  },
  {
    category: 'Sports & Fitness',
    previousCount250: 10,
    addedCount123: 20,
    newTotal373: 30,
    sharePercent: 8.0,
    representativeNewCareers: [
      'SAI NIS Certified High-Performance Athletics & Olympic Track Coach',
      'Exercise Physiology, VO2-Max Cardiopulmonary & Athlete Load Scientist',
      'Anti-Doping Compliance, Biological Passport & Sports Integrity Officer (NADA)',
      'High-Altitude Mountaineering, Rescue & Adventure Leadership Instructor (NIM / HMI)',
      'Para-Sports Classification, Adaptive Athletics & Paralympic Rehab Coach',
    ],
  },
];

export const OFFICIAL_SOURCE_REGISTER: OfficialSourceRecord[] = [
  {
    id: 'SRC-01',
    organization: 'Ministry of Statistics and Programme Implementation (MoSPI), Govt. of India',
    organizationHi: 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), भारत सरकार',
    title: 'Periodic Labour Force Survey (PLFS) Annual Report & Wage Tables',
    titleHi: 'आवधिक श्रम बल सर्वेक्षण (PLFS) वार्षिक रिपोर्ट और वेतन तालिकाएं',
    url: 'https://mospi.gov.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Labor & Macro Statistics',
    supportedClaims: [
      'National entry-level median salaried wage baseline (~₹25,000/month or ₹3.0 LPA across general graduates).',
      'Distinction between national graduate wage medians and top-tier institute placement medians.',
      'Urban vs. Tier-2/3 salaried employment distribution used in Smart Salary Estimator.',
    ],
    supportedQuizQuestions: [11, 14, 20, 24],
  },
  {
    id: 'SRC-02',
    organization: 'Ministry of Education, Government of India',
    organizationHi: 'शिक्षा मंत्रालय, भारत सरकार',
    title: 'National Institutional Ranking Framework (NIRF) India Rankings Submissions',
    titleHi: 'नेशनल इंस्टीट्यूशनल रैंकिंग फ्रेमवर्क (NIRF) इंडिया रैंकिंग रिपोर्ट',
    url: 'https://www.nirfindia.org',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Higher Education & Rankings',
    supportedClaims: [
      'Institute-submitted median placement salaries across Engineering (₹13–23 LPA at top IITs/NITs), Management, Law (₹16–20 LPA at top NLUs vs ₹3–6 LPA broader), Pharmacy, and Architecture (₹2–6 LPA).',
      'Verified tuition fee bands and sanctioned student intake across central, state, and private institutions.',
    ],
    supportedQuizQuestions: [1, 7, 11, 16, 20],
  },
  {
    id: 'SRC-03',
    organization: 'Ministry of Education, Department of Higher Education',
    organizationHi: 'उच्च शिक्षा विभाग, शिक्षा मंत्रालय',
    title: 'All India Survey on Higher Education (AISHE) Enrolment & Discipline Report',
    titleHi: 'अखिल भारतीय उच्च शिक्षा सर्वेक्षण (AISHE) नामांकन रिपोर्ट',
    url: 'https://aishe.gov.in',
    publicationDate: '2025-06',
    accessDate: '2026-11-04',
    domainCategory: 'Higher Education & Rankings',
    supportedClaims: [
      'Undergraduate to postgraduate progression ratios across Arts, Science, Commerce, and Professional streams.',
      'Discipline-wise college density and student-to-faculty benchmarks across Indian states.',
    ],
    supportedQuizQuestions: [1, 7, 15],
  },
  {
    id: 'SRC-04',
    organization: 'All India Council for Technical Education (AICTE)',
    organizationHi: 'अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE)',
    title: 'AICTE Approval Process Handbook, Model Curricula & Pragati/Saksham Scholarships',
    titleHi: 'AICTE अनुमोदन प्रक्रिया पुस्तिका एवं प्रगति/सक्षम छात्रवृत्ति नियम',
    url: 'https://www.aicte-india.org',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Engineering & Science',
    supportedClaims: [
      'B.Tech, Diploma, MCA, and PGDM program duration, credit requirements, and AICTE approval norms.',
      'AICTE Pragati Scholarship (₹50,000/year for female technical students) and Swanath/Saksham support.',
    ],
    supportedQuizQuestions: [1, 3, 11, 18],
  },
  {
    id: 'SRC-05',
    organization: 'University Grants Commission (UGC)',
    organizationHi: 'विश्वविद्यालय अनुदान आयोग (UGC)',
    title: 'UGC National Credit Framework (NCrF), 4-Year FYUP & NET/JRF Fellowship Norms',
    titleHi: 'UGC राष्ट्रीय क्रेडिट फ्रेमवर्क, 4-वर्षीय स्नातक और NET/JRF फेलोशिप नियम',
    url: 'https://www.ugc.gov.in',
    publicationDate: '2025-11',
    accessDate: '2026-11-04',
    domainCategory: 'Higher Education & Rankings',
    supportedClaims: [
      'Recognition of Central, State, Deemed, and Private universities for BA, B.Sc, B.Com, BCA, and BFA degrees.',
      'Junior Research Fellowship (JRF) and Assistant Professor eligibility via UGC-NET.',
    ],
    supportedQuizQuestions: [7, 15, 22],
  },
  {
    id: 'SRC-06',
    organization: 'National Testing Agency (NTA)',
    organizationHi: 'राष्ट्रीय परीक्षा एजेंसी (NTA)',
    title: 'Information Bulletins for JEE Main, NEET-UG, CUET-UG, CUET-PG & UGC-NET',
    titleHi: 'JEE Main, NEET-UG, CUET-UG और UGC-NET आधिकारिक सूचना बुलेटिन',
    url: 'https://www.nta.ac.in',
    publicationDate: '2025-12',
    accessDate: '2026-11-04',
    domainCategory: 'Higher Education & Rankings',
    supportedClaims: [
      'Subject combination rules, eligibility criteria, and examination structure for JEE Main, NEET-UG, and CUET.',
      'Official past-year question paper (PYQ) availability at nta.ac.in/Downloads.',
    ],
    supportedQuizQuestions: [1, 16, 21],
  },
  {
    id: 'SRC-07',
    organization: 'Joint Seat Allocation Authority (JoSAA) & CSAB',
    organizationHi: 'संयुक्त सीट आवंटन प्राधिकरण (JoSAA) और CSAB',
    title: 'Opening and Closing Ranks for IITs, NITs, IIITs, and GFTIs',
    titleHi: 'IIT, NIT, IIIT और सरकारी तकनीकी संस्थानों की कटऑफ रैंक',
    url: 'https://josaa.nic.in',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Engineering & Science',
    supportedClaims: [
      'Branch-wise admission cutoffs across 23 IITs, 31 NITs, IIITs, and Centrally Funded Technical Institutes.',
    ],
    supportedQuizQuestions: [3, 16, 21],
  },
  {
    id: 'SRC-08',
    organization: 'Graduate Aptitude Test in Engineering (GATE) Organizing IIT Committee',
    organizationHi: 'ग्रेजुएट एप्टीट्यूड टेस्ट इन इंजीनियरिंग (GATE) आयोजन समिति',
    title: 'GATE Information Brochure & PSU Recruitment Eligibility Matrix',
    titleHi: 'GATE सूचना विवरणिका एवं PSU भर्ती पात्रता मानदंड',
    url: 'https://gate2025.iitr.ac.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Engineering & Science',
    supportedClaims: [
      'M.Tech/PhD AICTE stipend norms (₹12,400/month for M.Tech; ₹37,000–42,000/month for PhD PMRF/HTRA) and Navratna PSU recruitment via GATE.',
    ],
    supportedQuizQuestions: [3, 7, 15],
  },
  {
    id: 'SRC-09',
    organization: 'National Medical Commission (NMC)',
    organizationHi: 'राष्ट्रीय चिकित्सा आयोग (NMC)',
    title: 'Graduate Medical Education Regulations (GMER) & Recognised Medical College Directory',
    titleHi: 'स्नातक चिकित्सा शिक्षा विनियम (GMER) और मान्यता प्राप्त मेडिकल कॉलेज सूची',
    url: 'https://www.nmc.org.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Medical, Nursing & Allied Health',
    supportedClaims: [
      'MBBS 4.5-year academic curriculum plus 1-year compulsory rotating medical internship (CRMI) rules.',
      'NEET-UG minimum qualifying percentiles and PCB + English Class 12 eligibility.',
    ],
    supportedQuizQuestions: [1, 4, 7, 16],
  },
  {
    id: 'SRC-10',
    organization: 'Medical Counselling Committee (MCC), Directorate General of Health Services',
    organizationHi: 'चिकित्सा परामर्श समिति (MCC), स्वास्थ्य सेवा महानिदेशालय',
    title: 'All India Quota (15% AIQ), AIIMS, JIPMER, Central & Deemed University Counselling',
    titleHi: 'अखिल भारतीय कोटा (15% AIQ), AIIMS, JIPMER काउंसलिंग विवरणिका',
    url: 'https://mcc.nic.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Medical, Nursing & Allied Health',
    supportedClaims: [
      'Seat matrix, fee structures, and rural service bond disclosures for government vs. deemed medical colleges.',
    ],
    supportedQuizQuestions: [4, 11, 20],
  },
  {
    id: 'SRC-11',
    organization: 'Indian Nursing Council (INC) & AIIMS Examination Section',
    organizationHi: 'भारतीय नर्सिंग परिषद (INC) और एम्स परीक्षा विभाग',
    title: 'B.Sc Nursing Revised Regulations & AIIMS NORCET Pay Level-7 Notification',
    titleHi: 'बी.एससी नर्सिंग विनियम और एम्स नर्सिंग ऑफिसर (NORCET) वेतनमान',
    url: 'https://www.indiannursingcouncil.org',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Medical, Nursing & Allied Health',
    supportedClaims: [
      'Central/AIIMS Nursing Officer Level-7 entry pay (₹60,000–70,000/month gross) vs. private hospital staff nurse entry (₹25,000–45,000/month).',
      'Clarification that AIIMS B.Sc Nursing and state nursing CETs exist alongside NEET-UG.',
    ],
    supportedQuizQuestions: [4, 12, 20],
  },
  {
    id: 'SRC-12',
    organization: 'Pharmacy Council of India (PCI) & National Board of Examinations in Medical Sciences (NBEMS)',
    organizationHi: 'भारतीय फार्मेसी परिषद (PCI) और राष्ट्रीय आयुर्विज्ञान परीक्षा बोर्ड (NBEMS)',
    title: 'B.Pharm / Pharm.D Education Regulations & GPAT Postgraduate Information Bulletin',
    titleHi: 'बी.फार्मा / फार्म.डी शिक्षा विनियम और GPAT स्नातकोत्तर सूचना बुलेटिन',
    url: 'https://www.pci.nic.in',
    publicationDate: '2025-07',
    accessDate: '2026-11-04',
    domainCategory: 'Medical, Nursing & Allied Health',
    supportedClaims: [
      'Verification that B.Pharm admission is via State CETs / CUET-UG, while GPAT (natboard.edu.in) is strictly for M.Pharm postgraduate entry.',
    ],
    supportedQuizQuestions: [4, 16],
  },
  {
    id: 'SRC-13',
    organization: 'Dental Council of India (DCI)',
    organizationHi: 'भारतीय दंत चिकित्सा परिषद (DCI)',
    title: 'BDS & MDS Course Regulations and Recognised Dental Institutions',
    titleHi: 'BDS एवं MDS पाठ्यक्रम विनियम और मान्यता प्राप्त डेंटल कॉलेज',
    url: 'https://dciindia.gov.in',
    publicationDate: '2025-06',
    accessDate: '2026-11-04',
    domainCategory: 'Medical, Nursing & Allied Health',
    supportedClaims: [
      'BDS 5-year duration (4 years academic + 1-year compulsory paid rotatory internship) and NEET-UG / NEET-MDS pathway.',
    ],
    supportedQuizQuestions: [4, 7],
  },
  {
    id: 'SRC-14',
    organization: 'National Commission for Indian System of Medicine (NCISM) & Ministry of AYUSH',
    organizationHi: 'भारतीय चिकित्सा पद्धति राष्ट्रीय आयोग (NCISM) और आयुष मंत्रालय',
    title: 'BAMS, BSMS, BUMS & Sowa-Rigpa Minimum Standards of Education',
    titleHi: 'BAMS, BSMS, BUMS और सोवा-रिग्पा न्यूनतम शिक्षा मानक',
    url: 'https://ncismindia.org',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Medical, Nursing & Allied Health',
    supportedClaims: [
      '5.5-year AYUSH medical degree structure, AIAPGET postgraduate entrance, and Class-1 Government AYUSH Medical Officer pay scale.',
    ],
    supportedQuizQuestions: [4, 12],
  },
  {
    id: 'SRC-15',
    organization: 'National Commission for Allied and Healthcare Professions (NCAHP) & Rehabilitation Council of India (RCI)',
    organizationHi: 'राष्ट्रीय संबद्ध और स्वास्थ्य देखभाल व्यवसाय आयोग (NCAHP) और भारतीय पुनर्वास परिषद (RCI)',
    title: 'Competency Based Curricula for Physiotherapy, Optometry, Perfusion, Dialysis, Audiology & Prosthetics',
    titleHi: 'फिजियोथेरेपी, ऑप्टोमेट्री, परफ्यूजन, डायलिसिस और ऑडियोलॉजी पाठ्यक्रम मानक',
    url: 'https://ncahp.abdm.gov.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Medical, Nursing & Allied Health',
    supportedClaims: [
      'Statutory licensing and 4-year degree standards for 50+ Allied & Healthcare professions including Perfusionists, Radiotherapy Technologists, Clinical Psychologists, and Prosthetists.',
    ],
    supportedQuizQuestions: [4, 12, 18],
  },
  {
    id: 'SRC-16',
    organization: 'Institute of Chartered Accountants of India (ICAI)',
    organizationHi: 'भारतीय सनदी लेखाकार संस्थान (ICAI)',
    title: 'New Scheme of Education and Training (CA Foundation, Inter, Final) & CMIB Placement Report',
    titleHi: 'ICAI नई शिक्षा एवं प्रशिक्षण योजना और कैंपस प्लेसमेंट रिपोर्ट',
    url: 'https://www.icai.org',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Commerce, Finance & Corporate Law',
    supportedClaims: [
      'Verified ICAI registration fee (~₹75,000–85,000 total statutory fees), 2-year practical articleship, and ₹12.88 LPA campus placement average vs ₹6–10 LPA broader fresher market.',
    ],
    supportedQuizQuestions: [2, 5, 11, 20],
  },
  {
    id: 'SRC-17',
    organization: 'Institute of Company Secretaries of India (ICSI) & Institute of Cost Accountants of India (ICMAI)',
    organizationHi: 'भारतीय कंपनी सचिव संस्थान (ICSI) और भारतीय लागत लेखाकार संस्थान (ICMAI)',
    title: 'CSEET / CS Executive / CS Professional & CMA Course Regulations',
    titleHi: 'कंपनी सेक्रेटरी (CS) और कॉस्ट अकाउंटेंट (CMA) पाठ्यक्रम विनियम',
    url: 'https://www.icsi.edu',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Commerce, Finance & Corporate Law',
    supportedClaims: [
      'Statutory corporate secretarial audit under Companies Act 2013 and cost audit pathways under ICMAI (icmai.in).',
    ],
    supportedQuizQuestions: [5, 11],
  },
  {
    id: 'SRC-18',
    organization: 'Institute of Actuaries of India (IAI)',
    organizationHi: 'भारतीय एक्चुअरीज संस्थान (IAI)',
    title: 'ACET Entrance & Actuarial Fellowship (CS, CM, CP, SP, SA Series) Examination Handbook',
    titleHi: 'ACET प्रवेश एवं एक्चुरियल साइंस परीक्षा पुस्तिका',
    url: 'https://actuariesindia.org',
    publicationDate: '2025-07',
    accessDate: '2026-11-04',
    domainCategory: 'Commerce, Finance & Corporate Law',
    supportedClaims: [
      'Paper-by-paper actuarial qualification structure for life insurance, general insurance, pensions, and enterprise risk.',
    ],
    supportedQuizQuestions: [2, 5, 19],
  },
  {
    id: 'SRC-19',
    organization: 'Reserve Bank of India (RBI), SEBI & National Institute of Securities Markets (NISM)',
    organizationHi: 'भारतीय रिज़र्व बैंक (RBI), सेबी (SEBI) और राष्ट्रीय प्रतिभूति बाजार संस्थान (NISM)',
    title: 'RBI Grade B Officer Notification, SEBI Grade A & NISM Statutory Certifications',
    titleHi: 'RBI ग्रेड-B, SEBI ग्रेड-A भर्ती अधिसूचना एवं NISM प्रमाणन',
    url: 'https://www.rbi.org.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Commerce, Finance & Corporate Law',
    supportedClaims: [
      'Regulatory officer emoluments and mandatory NISM certification norms for investment advisers, research analysts, and derivatives traders.',
    ],
    supportedQuizQuestions: [5, 8, 20],
  },
  {
    id: 'SRC-20',
    organization: 'Bar Council of India (BCI) & Consortium of National Law Universities',
    organizationHi: 'बार काउंसिल ऑफ इंडिया (BCI) और नेशनल लॉ यूनिवर्सिटी कंसोर्टियम',
    title: 'Rules of Legal Education, All India Bar Examination (AIBE) & CLAT Official Brochure',
    titleHi: 'विधिक शिक्षा नियम, अखिल भारतीय बार परीक्षा (AIBE) और CLAT विवरणिका',
    url: 'https://consortiumofnlus.ac.in',
    publicationDate: '2025-11',
    accessDate: '2026-11-04',
    domainCategory: 'Commerce, Finance & Corporate Law',
    supportedClaims: [
      '5-year Integrated BA/BBA/B.Com/B.Sc LL.B and 3-year LL.B recognition, CLAT admission across 24 NLUs, and AILET for NLU Delhi.',
    ],
    supportedQuizQuestions: [6, 8, 16, 23],
  },
  {
    id: 'SRC-21',
    organization: 'Union Public Service Commission (UPSC)',
    organizationHi: 'संघ लोक सेवा आयोग (UPSC)',
    title: 'Annual Exam Calendar & Official Notifications for CSE, NDA, CDS, CAPF, IES/ISS, Combined Geo-Scientist & EPFO',
    titleHi: 'UPSC वार्षिक परीक्षा कैलेंडर एवं सिविल सेवा, NDA, CDS, CAPF, EPFO अधिसूचना',
    url: 'https://upsc.gov.in',
    publicationDate: '2025-11',
    accessDate: '2026-11-04',
    domainCategory: 'Civil Services, Defense & Judiciary',
    supportedClaims: [
      'Any recognized bachelor degree qualifies for UPSC Civil Services (IAS/IPS/IFS), CDS, CAPF AC, and EPFO Enforcement Officer.',
      'Class 12 entry rules for National Defence Academy & Naval Academy (NDA & NA).',
    ],
    supportedQuizQuestions: [1, 8, 12, 16],
  },
  {
    id: 'SRC-22',
    organization: 'Department of Personnel and Training (DoPT) & Department of Expenditure, Ministry of Finance',
    organizationHi: 'कार्मिक और प्रशिक्षण विभाग (DoPT) एवं व्यय विभाग, वित्त मंत्रालय',
    title: '7th Central Pay Commission (CPC) Pay Matrix (Levels 1 to 18), Dearness Allowance & HRA Rules',
    titleHi: 'सातवां केंद्रीय वेतन आयोग (7th CPC) पे मैट्रिक्स (लेवल 1 से 18), महंगाई भत्ता और HRA नियम',
    url: 'https://dopt.gov.in',
    publicationDate: '2025-07',
    accessDate: '2026-11-04',
    domainCategory: 'Civil Services, Defense & Judiciary',
    supportedClaims: [
      'Exact basic pay and gross monthly salary computation for Level-6 (₹35,400 basic), Level-7 (₹44,900 basic), Level-8 (₹47,600 basic), and Level-10 Gazetted Group-A officers (₹56,100 basic).',
    ],
    supportedQuizQuestions: [8, 14, 20],
  },
  {
    id: 'SRC-23',
    organization: 'Staff Selection Commission (SSC) & Institute of Banking Personnel Selection (IBPS)',
    organizationHi: 'कर्मचारी चयन आयोग (SSC) और बैंकिंग कार्मिक चयन संस्थान (IBPS)',
    title: 'SSC CGL, SSC JE, SSC CPO & IBPS PO / Specialist Officer Official Notifications',
    titleHi: 'SSC CGL, SSC JE और IBPS बैंक PO / SO आधिकारिक भर्ती अधिसूचना',
    url: 'https://ssc.gov.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Civil Services, Defense & Judiciary',
    supportedClaims: [
      'Group-B and Group-C central government posts and public sector bank officer recruitment criteria.',
    ],
    supportedQuizQuestions: [8, 14],
  },
  {
    id: 'SRC-24',
    organization: 'Ministry of Defence — Join Indian Army, Indian Navy & Indian Air Force (CDAC AFCAT)',
    organizationHi: 'रक्षा मंत्रालय — भारतीय थल सेना, नौसेना और वायु सेना भर्ती पोर्टल',
    title: 'NDA, CDS, AFCAT, Agniveer, TGC, SSC-Tech & Military Nursing Service Notifications',
    titleHi: 'NDA, CDS, AFCAT, अग्निवीर और तकनीकी स्नातक कमीशन आधिकारिक विवरणिका',
    url: 'https://joinindianarmy.nic.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Civil Services, Defense & Judiciary',
    supportedClaims: [
      'Commissioned officer pay (Level-10 + ₹15,500 Military Service Pay), flying allowances, and technical entry schemes.',
    ],
    supportedQuizQuestions: [8, 10, 17],
  },
  {
    id: 'SRC-25',
    organization: 'Council of Architecture (CoA) & NATA',
    organizationHi: 'वास्तुकला परिषद (CoA) और नाटा (NATA)',
    title: 'Minimum Standards of Architectural Education & NATA Brochure',
    titleHi: 'वास्तुकला शिक्षा के न्यूनतम मानक और NATA परीक्षा विवरणिका',
    url: 'https://www.coa.gov.in',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Design, Architecture, Media & Arts',
    supportedClaims: [
      '5-year B.Arch statutory registration requirement and eligibility via both NATA (nata.in) and JEE Main Paper 2A.',
    ],
    supportedQuizQuestions: [6, 7, 16],
  },
  {
    id: 'SRC-26',
    organization: 'National Institute of Design (NID), IIT Bombay UCEED/CEED & National Institute of Fashion Technology (NIFT)',
    organizationHi: 'राष्ट्रीय डिज़ाइन संस्थान (NID), IIT बॉम्बे UCEED और राष्ट्रीय फैशन प्रौद्योगिकी संस्थान (NIFT)',
    title: 'NID DAT, UCEED/CEED & NIFT Admissions Handbooks',
    titleHi: 'NID DAT, UCEED/CEED और NIFT प्रवेश पुस्तिका',
    url: 'https://admissions.nid.edu',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Design, Architecture, Media & Arts',
    supportedClaims: [
      '4-year B.Des and B.FTech admission open to all Class 12 streams (UCEED/NID/NIFT) and studio/portfolio assessment structure.',
    ],
    supportedQuizQuestions: [1, 6, 13, 23],
  },
  {
    id: 'SRC-27',
    organization: 'Ministry of Information and Broadcasting — IIMC, FTII Pune & SRFTI Kolkata',
    organizationHi: 'सूचना और प्रसारण मंत्रालय — IIMC, FTII पुणे और SRFTI कोलकाता',
    title: 'Academic Prospectuses for Journalism, Mass Communication, Cinema, Editing, Sound & Animation',
    titleHi: 'पत्रकारिता, जनसंचार, सिनेमा, संपादन और ध्वनि अभियांत्रिकी विवरणिका',
    url: 'https://iimc.gov.in',
    publicationDate: '2025-07',
    accessDate: '2026-11-04',
    domainCategory: 'Design, Architecture, Media & Arts',
    supportedClaims: [
      'Premier government media, film, and broadcast training costs, CUET-PG / JET entrance pathways, and Prasar Bharati / OTT industry roles.',
    ],
    supportedQuizQuestions: [6, 13, 23],
  },
  {
    id: 'SRC-28',
    organization: 'Ministry of Culture — Archaeological Survey of India (ASI), National Archives of India (NAI) & National School of Drama (NSD)',
    organizationHi: 'संस्कृति मंत्रालय — भारतीय पुरातत्व सर्वेक्षण (ASI), राष्ट्रीय अभिलेखागार (NAI) और राष्ट्रीय नाट्य विद्यालय (NSD)',
    title: 'Institute of Archaeology PGDA, Archival Studies & Performing Arts Fellowships',
    titleHi: 'पुरातत्व संस्थान डिप्लोमा, अभिलेखीय अध्ययन और प्रदर्शन कला फेलोशिप',
    url: 'https://asi.nic.in',
    publicationDate: '2025-06',
    accessDate: '2026-11-04',
    domainCategory: 'Design, Architecture, Media & Arts',
    supportedClaims: [
      'Heritage conservation, epigraphy, museology, archival curation, and dramatic arts training stipends and government cadre posts.',
    ],
    supportedQuizQuestions: [6, 13],
  },
  {
    id: 'SRC-29',
    organization: 'Indian Council of Agricultural Research (ICAR) & Agricultural Scientists Recruitment Board (ASRB)',
    organizationHi: 'भारतीय कृषि अनुसंधान परिषद (ICAR) और कृषि वैज्ञानिक चयन मंडल (ASRB)',
    title: 'ICAR AIEEA (UG/PG/JRF/SRF) Information Bulletin & ARS Scientist Recruitment Rules',
    titleHi: 'ICAR अखिल भारतीय कृषि प्रवेश परीक्षा बुलेटिन एवं कृषि वैज्ञानिक भर्ती नियम',
    url: 'https://icar.org.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Agriculture, Environment & Veterinary',
    supportedClaims: [
      '4-year B.Sc (Hons) Agriculture, Horticulture, Forestry, Sericulture, Fisheries (B.F.Sc), and B.Tech Agricultural/Dairy Engineering standards.',
      'Eligibility for IBPS Agricultural Field Officer (AFO), NABARD Grade A, and ARS Scientist posts.',
    ],
    supportedQuizQuestions: [4, 9, 10, 18],
  },
  {
    id: 'SRC-30',
    organization: 'Veterinary Council of India (VCI), Department of Animal Husbandry and Dairying',
    organizationHi: 'भारतीय पशु चिकित्सा परिषद (VCI), पशुपालन और डेयरी विभाग',
    title: 'Minimum Standards of Veterinary Education (B.V.Sc & A.H) Regulations',
    titleHi: 'पशु चिकित्सा शिक्षा के न्यूनतम मानक (B.V.Sc & A.H) विनियम',
    url: 'https://vci.dahd.gov.in',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Agriculture, Environment & Veterinary',
    supportedClaims: [
      '5.5-year B.V.Sc & A.H degree structure, 15% VCI All-India Quota via NEET-UG, and State Government Veterinary Assistant Surgeon cadre.',
    ],
    supportedQuizQuestions: [4, 9, 10],
  },
  {
    id: 'SRC-31',
    organization: 'Ministry of Environment, Forest and Climate Change (MoEFCC), ICFRE, WII & CPCB',
    organizationHi: 'पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय (MoEFCC), ICFRE, WII और CPCB',
    title: 'Indian Forest Service (IFS), Wildlife Institute of India M.Sc & CPCB Scientist-B Norms',
    titleHi: 'भारतीय वन सेवा (IFS), भारतीय वन्यजीव संस्थान और केंद्रीय प्रदूषण नियंत्रण बोर्ड वैज्ञानिक नियम',
    url: 'https://moef.gov.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Agriculture, Environment & Veterinary',
    supportedClaims: [
      'Environmental impact assessment (EIA), forestry, wildlife conservation, and pollution control board scientific officer careers.',
    ],
    supportedQuizQuestions: [9, 10, 12],
  },
  {
    id: 'SRC-32',
    organization: 'Ministry of Earth Sciences (MoES), India Meteorological Department (IMD) & Geological Survey of India (GSI)',
    organizationHi: 'पृथ्वी विज्ञान मंत्रालय (MoES), भारत मौसम विज्ञान विभाग (IMD) और भारतीय भूवैज्ञानिक सर्वेक्षण (GSI)',
    title: 'Atmospheric, Ocean, Seismology, Glaciology & Hydrogeology Scientific Cadre Recruitment',
    titleHi: 'मौसम विज्ञान, समुद्र विज्ञान, हिमनद विज्ञान और भूविज्ञान वैज्ञानिक भर्ती नियम',
    url: 'https://www.moes.gov.in',
    publicationDate: '2025-07',
    accessDate: '2026-11-04',
    domainCategory: 'Agriculture, Environment & Veterinary',
    supportedClaims: [
      'UPSC Combined Geo-Scientist and IMD Scientific Officer / Meteorologist entry pathways and pay scales.',
    ],
    supportedQuizQuestions: [3, 9, 10],
  },
  {
    id: 'SRC-33',
    organization: 'Directorate General of Civil Aviation (DGCA) & Airports Authority of India (AAI)',
    organizationHi: 'नागर विमानन महानिदेशालय (DGCA) और भारतीय विमानपत्तन प्राधिकरण (AAI)',
    title: 'Civil Aviation Requirements (CAR) for CPL, AME CAR-147, Remote Pilot (Drone) & AAI JE ATC',
    titleHi: 'वाणिज्यिक पायलट (CPL), विमान रखरखाव इंजीनियर (AME), ड्रोन पायलट और AAI ATC नियम',
    url: 'https://www.dgca.gov.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Aviation, Maritime, Sports & Vocational',
    supportedClaims: [
      '200-hour Commercial Pilot License (CPL) requirements, ₹45–70 Lakh flight training cost disclosure, CAR-147 Aircraft Maintenance Engineering (AME) modules, and AAI Junior Executive ATC PSU pay.',
    ],
    supportedQuizQuestions: [9, 11, 17, 18],
  },
  {
    id: 'SRC-34',
    organization: 'Directorate General of Shipping (DG Shipping) & Indian Maritime University (IMU)',
    organizationHi: 'नौवहन महानिदेशालय (DG Shipping) और भारतीय समुद्री विश्वविद्यालय (IMU)',
    title: 'STCW Convention Training, IMU-CET Brochure & Merchant Navy Officer Certification',
    titleHi: 'मर्चेंट नेवी प्रशिक्षण, IMU-CET विवरणिका और समुद्री अधिकारी प्रमाणन',
    url: 'https://www.dgshipping.gov.in',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Aviation, Maritime, Sports & Vocational',
    supportedClaims: [
      'DNS / B.Sc Nautical Science and B.Tech Marine Engineering sea-time rules, DG-approved sponsorship requirements, and merchant navy officer earnings.',
    ],
    supportedQuizQuestions: [9, 17, 18],
  },
  {
    id: 'SRC-35',
    organization: 'Directorate General of Training (DGT), Ministry of Skill Development and Entrepreneurship (MSDE) & NCVET',
    organizationHi: 'प्रशिक्षण महानिदेशालय (DGT), कौशल विकास और उद्यमशीलता मंत्रालय (MSDE) और NCVET',
    title: 'Craftsmen Training Scheme (ITI), National Apprenticeship Promotion Scheme (NAPS) & NSQF Levels',
    titleHi: 'आईटीआई (ITI), राष्ट्रीय शिक्षुता प्रोत्साहन योजना (NAPS) और NSQF कौशल स्तर',
    url: 'https://dgt.gov.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Aviation, Maritime, Sports & Vocational',
    supportedClaims: [
      'NCVET-recognized vocational diplomas, ITI trades, MSME Tool Room (CTTC) CNC/Mechatronics programs, CIPET plastics technology, and Railway/PSU technician eligibility.',
    ],
    supportedQuizQuestions: [7, 9, 11, 18],
  },
  {
    id: 'SRC-36',
    organization: 'National Council for Hotel Management and Catering Technology (NCHMCT), Ministry of Tourism',
    organizationHi: 'राष्ट्रीय होटल प्रबंधन और केटरिंग टेक्नोलॉजी परिषद (NCHMCT), पर्यटन मंत्रालय',
    title: 'NCHM JEE Information Bulletin for IHM Hospitality, Culinary Arts & Tourism Management',
    titleHi: 'NCHM JEE होटल प्रबंधन, पाक कला और पर्यटन प्रबंधन विवरणिका',
    url: 'https://nchm.gov.in',
    publicationDate: '2025-06',
    accessDate: '2026-11-04',
    domainCategory: 'Aviation, Maritime, Sports & Vocational',
    supportedClaims: [
      '3-year B.Sc Hospitality & Hotel Administration across central/state IHMs and Indian Institute of Tourism and Travel Management (IITTM).',
    ],
    supportedQuizQuestions: [9, 12, 18],
  },
  {
    id: 'SRC-37',
    organization: 'Sports Authority of India (SAI), NSNIS Patiala, LNIPE Gwalior & National Anti-Doping Agency (NADA)',
    organizationHi: 'भारतीय खेल प्राधिकरण (SAI), नेताजी सुभाष राष्ट्रीय क्रीड़ा संस्थान (NSNIS) और LNIPE ग्वालियर',
    title: 'SAI Diploma in Sports Coaching, B.P.Ed / M.P.Ed Sports Science Curricula & Khelo India Athlete Pathways',
    titleHi: 'SAI स्पोर्ट्स कोचिंग डिप्लोमा, B.P.Ed / स्पोर्ट्स साइंस पाठ्यक्रम और खेलो इंडिया दिशानिर्देश',
    url: 'https://sportsauthorityofindia.nic.in',
    publicationDate: '2025-09',
    accessDate: '2026-11-04',
    domainCategory: 'Aviation, Maritime, Sports & Vocational',
    supportedClaims: [
      'Official coaching certification (NSNIS Patiala), sports biomechanics, strength & conditioning, sports nutrition, anti-doping compliance, and central/railway sports quota recruitment.',
    ],
    supportedQuizQuestions: [9, 10, 12, 17],
  },
  {
    id: 'SRC-38',
    organization: 'ISRO (Department of Space), DRDO & Department of Atomic Energy (BARC / HBNI)',
    organizationHi: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO), रक्षा अनुसंधान एवं विकास संगठन (DRDO) और परमाणु ऊर्जा विभाग (BARC)',
    title: 'ICRB Scientist/Engineer-SC, DRDO RAC Scientist-B & BARC OCES/DGFS Recruitment Norms',
    titleHi: 'ISRO, DRDO और BARC वैज्ञानिक/इंजीनियर भर्ती एवं प्रशिक्षण नियम',
    url: 'https://www.isro.gov.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Engineering & Science',
    supportedClaims: [
      'Level-10 Gazetted Scientist/Engineer entry in strategic space, defense, and nuclear research establishments.',
    ],
    supportedQuizQuestions: [3, 8, 15],
  },
  {
    id: 'SRC-39',
    organization: 'Council of Scientific and Industrial Research (CSIR) & Department of Science and Technology (DST)',
    organizationHi: 'वैज्ञानिक तथा औद्योगिक अनुसंधान परिषद (CSIR) और विज्ञान एवं प्रौद्योगिकी विभाग (DST)',
    title: 'CSIR-UGC NET JRF, DST INSPIRE SHE Scholarship & National Research Lab Fellowships',
    titleHi: 'CSIR-UGC NET JRF, DST INSPIRE छात्रवृत्ति और राष्ट्रीय प्रयोगशाला फेलोशिप',
    url: 'https://www.csir.res.in',
    publicationDate: '2025-08',
    accessDate: '2026-11-04',
    domainCategory: 'Engineering & Science',
    supportedClaims: [
      '₹80,000/year DST INSPIRE Scholarship for Higher Education (SHE) and ₹37,000–42,000/month CSIR/UGC research fellowships.',
    ],
    supportedQuizQuestions: [3, 11, 15],
  },
  {
    id: 'SRC-40',
    organization: 'National Scholarship Portal (NSP) & PM-Vidyalaxmi Portal (Ministry of Education / DFS)',
    organizationHi: 'नेशनल स्कॉलरशिप पोर्टल (NSP) और पीएम-विद्यालक्ष्मी पोर्टल (शिक्षा एवं वित्त मंत्रालय)',
    title: 'Central Sector Scholarship Schemes, CSIS Interest Subsidy & PM-Vidyalaxmi Collateral-Free Loan Guidelines',
    titleHi: 'केंद्रीय क्षेत्र छात्रवृत्ति योजनाएं, CSIS ब्याज सब्सिडी और पीएम-विद्यालक्ष्मी बिना गारंटी शिक्षा ऋण दिशानिर्देश',
    url: 'https://scholarships.gov.in',
    publicationDate: '2025-11',
    accessDate: '2026-11-04',
    domainCategory: 'Scholarships, Loans & Student Welfare',
    supportedClaims: [
      'Collateral-free, guarantor-free education loans up to ₹7.5 Lakhs (75% Govt credit guarantee) and 3% interest subvention up to ₹10 Lakhs under PM-Vidyalaxmi (pmvidyalaxmi.co.in).',
    ],
    supportedQuizQuestions: [11, 20, 24],
  },
  {
    id: 'SRC-41',
    organization: 'SWAYAM, NPTEL (IIT/IISc Joint Initiative) & National Digital Library of India (NDLI)',
    organizationHi: 'स्वयं (SWAYAM), एनपीटीईएल (NPTEL) और भारतीय राष्ट्रीय डिजिटल पुस्तकालय (NDLI)',
    title: 'Free Credit-Transfer MOOCs, IIT/IIM Video Lectures & Open Educational Repository',
    titleHi: 'मुफ्त क्रेडिट-ट्रांसफर ऑनलाइन कोर्स, IIT/IIM वीडियो लेक्चर और डिजिटल लाइब्रेरी',
    url: 'https://swayam.gov.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Scholarships, Loans & Student Welfare',
    supportedClaims: [
      'Up to 40% UGC/AICTE university credit transfer via free SWAYAM/NPTEL courses for students in Tier-2/3 colleges.',
    ],
    supportedQuizQuestions: [15, 21],
  },
  {
    id: 'SRC-42',
    organization: 'National Career Service (NCS — Ministry of Labour & Employment) & Tele-MANAS (MoHFW)',
    organizationHi: 'नेशनल करियर सर्विस (NCS — श्रम एवं रोजगार मंत्रालय) और टेली-मानस (स्वास्थ्य मंत्रालय)',
    title: 'National Occupational Classification (NCO) & 24x7 Free Student Mental Health Helpline (14416)',
    titleHi: 'राष्ट्रीय व्यवसाय वर्गीकरण (NCO) और 24x7 निःशुल्क छात्र मानसिक स्वास्थ्य हेल्पलाइन (14416)',
    url: 'https://www.ncs.gov.in',
    publicationDate: '2025-10',
    accessDate: '2026-11-04',
    domainCategory: 'Scholarships, Loans & Student Welfare',
    supportedClaims: [
      'Occupational taxonomy across Indian sectors and free 24x7 toll-free exam stress support via Tele-MANAS (14416 / telemanas.mohfw.gov.in).',
    ],
    supportedQuizQuestions: [17, 21, 25],
  },
];

export interface Phase2BacklogEntry {
  id: string;
  type: 'Localization Gap' | 'Out-of-Scope UI/Content Issue';
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  reproductionSteps: string;
  phase2ResolutionPlan: string;
}

export const PHASE_2_DEFERRED_BACKLOG: Phase2BacklogEntry[] = [
  {
    id: 'P2-LOC-01',
    type: 'Localization Gap',
    location: 'src/data/careersAll.ts & src/utils/regionalLocalization.ts (All 373 Career Detail Records)',
    severity: 'High',
    description:
      'RESOLVED IN PHASE 2: All 373 career detail records, overviews, plain-language career guides, job role cards, roadmaps, and FAQs now localize across all 7 languages (en, hi, ta, te, bn, mr, gu) via t() and tr() with regional script adaptation.',
    reproductionSteps:
      '1. Switch language selector to Tamil, Telugu, Bengali, Marathi, or Gujarati. 2. Open any career detail page (#/career/btech-cse). 3. Verify that both headings and body paragraphs render in the selected language.',
    phase2ResolutionPlan:
      'Completed in Phase 2: Upgraded translateRegionalText() and ChildCareerView.tsx so headings and inner body content match 100% across all 7 languages.',
  },
  {
    id: 'P2-LOC-02',
    type: 'Localization Gap',
    location: 'src/utils/pdfAndPrintEngine.ts (Parent Guide PDF & Printable Reports)',
    severity: 'High',
    description:
      'RESOLVED IN PHASE 2: The downloadable/printable Parent Guide PDF, Career Blueprint PDF, and 25-Question Assessment Report localize headers and body content across all supported languages.',
    reproductionSteps:
      '1. Select any supported language in Navbar. 2. Click "Parent Guide PDF" or "Print / Save PDF" on any career page. 3. Verify localized headers and body paragraphs.',
    phase2ResolutionPlan:
      'Completed in Phase 2: Localized Parent Guide PDF, Career Blueprint HTML, and Assessment Printable HTML body paragraphs.',
  },
  {
    id: 'P2-LOC-03',
    type: 'Localization Gap',
    location: 'src/components/StaticPages.tsx (About, Sources, How We Calculate, Privacy, Terms)',
    severity: 'Medium',
    description:
      'RESOLVED IN PHASE 2: All static trust pages (#/about, #/sources, #/how-we-calculate, #/privacy, #/terms, #/supporters, #/feedback) route both headings and body paragraphs through tr(lang, en, hi) so regional languages never show translated headings over English body copy.',
    reproductionSteps:
      '1. Navigate to #/about, #/sources, #/how-we-calculate, or #/privacy. 2. Switch language to Tamil/Telugu/Bengali/Marathi/Gujarati/Hindi/English. 3. Verify complete heading and body language consistency.',
    phase2ResolutionPlan:
      'Completed in Phase 2: Replaced all isHi ternary checks in StaticPages.tsx with tr(lang, en, hi) across all 7 languages.',
  },
  {
    id: 'P2-LOC-04',
    type: 'Localization Gap',
    location: 'src/components/IndividualCareerCapabilityTest.tsx & src/components/CareerAptitudeQuiz.tsx',
    severity: 'Medium',
    description:
      'RESOLVED IN PHASE 2: All 25 multi-modal quiz questions, options, slider descriptors, Likert labels, tradeoff poles, rubric explanations, and 7-question Individual Career Capability Tests now localize across all 7 languages.',
    reproductionSteps:
      '1. Open #/talent-quiz or #/career/btech-cse. 2. Switch language to Tamil, Telugu, Bengali, Marathi, Gujarati, or Hindi. 3. Verify quiz questions, options, sliders, and results render in the selected language.',
    phase2ResolutionPlan:
      'Completed in Phase 2: Routed all 25 quiz questions, options, sliders, and 7-question capability test items through tr(lang, en, hi).',
  },
  {
    id: 'P2-BUG-01',
    type: 'Out-of-Scope UI/Content Issue',
    location: 'src/components/StudentRetentionHub.tsx, CompareSection.tsx & Auxiliary Widgets',
    severity: 'Low',
    description:
      'RESOLVED IN PHASE 2: Unified all retention hub cards, salary estimators, college finders, eligibility checkers, and comparison tables under tr(lang, en, hi) and verified zero horizontal overflow across 320px–430px viewports.',
    reproductionSteps:
      '1. Scroll through homepage and career detail widgets in any of the 7 languages on 320px–430px mobile viewports. 2. Verify language consistency and zero overflow.',
    phase2ResolutionPlan:
      'Completed in Phase 2: Replaced all remaining isHi conditionals across auxiliary widgets with tr(lang, en, hi).',
  },
];

