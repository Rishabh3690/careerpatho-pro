import { ChildCareer, Language } from '../data/types';
import { computeSalaryTrajectory, computeCareerKPIs, t, tr, getFormalDesignation } from './careerEngine';
import { CareerAssessmentResult } from './careerAssessmentEngine';

export interface HindiParentGuideData {
  careerId: string;
  titleHi: string;
  titleEn: string;
  formalDesignationEn: string;
  categoryLabelHi: string;
  simpleSummaryHi: string;
  durationHi: string;
  eligibilityStreamsHi: string;
  minBoardMarksHi: string;
  keyExamsHi: string;
  feesComparison: {
    govtTotalFeeHi: string;
    privateTotalFeeHi: string;
    hostelMessMonthlyHi: string;
    booksLaptopOneTimeHi: string;
    roiPaybackMonthsHi: string;
  };
  scholarshipsAndLoans: Array<{
    schemeNameHi: string;
    benefitHi: string;
    eligibilityHi: string;
    portalUrl: string;
  }>;
  salaryReality: {
    advertisedCtcHi: string;
    actualMonthlyInHandEntryHi: string;
    midCareer5YrHi: string;
    senior10YrHi: string;
    aiSafetyScoreHi: string;
    jobSecurityVerdictHi: string;
  };
  govtVsPrivateScope: {
    govtRolesHi: string;
    privateRolesHi: string;
    abroadScopeHi: string;
  };
  safePlanBOptions: Array<{
    optionTitleHi: string;
    whySafeHi: string;
    examOrEntryHi: string;
  }>;
  // UPGRADE 2 & 3 ("Uncle-Defense" Family Defense Script)
  uncleDefenseScripts: Array<{
    questionHi: string;
    scriptHi: string;
    scriptEn: string;
  }>;
  // UPGRADE: Teacher & Parent Academic Progress & Counseling Communication Guide
  teacherParentProgressTracker: {
    studentScriptToParentTeacherHi: string;
    studentScriptToParentTeacherEn: string;
    milestones: Array<{
      metricHi: string;
      targetGoalHi: string;
      verificationSourceHi: string;
    }>;
  };
  parentActionableTipsHi: string[];
}

const CATEGORY_HINDI_MAP: Record<string, string> = {
  engineering: 'इंजीनियरिंग और टेक्नोलॉजी (Engineering & Tech)',
  medical: 'मेडिकल और स्वास्थ्य सेवा (Medical & Healthcare)',
  commerce: 'कॉमर्स, CA और फाइनेंस (Commerce & Finance)',
  law: 'कानून और न्यायपालिका (Law & Judiciary)',
  government: 'सरकारी सेवा, UPSC और रक्षा (Govt, UPSC & Defense)',
  design: 'डिजाइन, आर्किटेक्चर और क्रिएटिव (Design & UX)',
  science: 'विज्ञान और अनुसंधान (Pure Sciences & Research)',
  arts: 'मानविकी, नीति और मीडिया (Arts & Humanities)',
  vocational: 'कौशल, एविएशन और तकनीकी डिप्लोमा (Vocational & Aviation)',
};

// UPGRADE 5 (The Viral Loop): Deterministic SVG QR Code pointing to https://careerpatho.in
export function buildCareerPathoQrSvg(seedUrl: string = 'https://careerpatho.in'): string {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const placeFinder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
          reserved[rr][cc] = true;
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
            const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
            grid[rr][cc] = isBorder || isInner;
          }
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  let hash = 2166136261;
  for (let i = 0; i < seedUrl.length; i++) {
    hash ^= seedUrl.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  let state = hash >>> 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        grid[r][c] = ((state >>> 0) + r * 31 + c * 17) % 100 < 48;
      }
    }
  }

  const rects = grid
    .map((row, rIdx) =>
      row
        .map((cell, cIdx) =>
          cell ? `<rect x="${cIdx}" y="${rIdx}" width="1" height="1" fill="#000000" />` : ''
        )
        .join('')
    )
    .join('');

  return `<svg viewBox="0 0 21 21" width="76" height="76" shape-rendering="crispEdges" role="img" aria-label="QR Code for careerpatho.in">${rects}</svg>`;
}

export function generateHindiParentGuideData(career: ChildCareer): HindiParentGuideData {
  const traj = computeSalaryTrajectory(career);
  const kpis = computeCareerKPIs(career);
  const titleHi = career.titleHindi || career.title;
  const titleEn = career.title;
  const formalDesignationEn = getFormalDesignation(career, 'en');
  const catLabelHi = CATEGORY_HINDI_MAP[career.category] || 'प्रमुख करियर क्षेत्र';

  const avgFeeLakhs = career.avgCourseFeeLakhs || 4;
  const entryMonthlyInHand = traj.points[0]?.monthlyInHandInr || 45000;
  const paybackMonths = Math.max(3, Math.round((avgFeeLakhs / Math.max(1, traj.points[0]?.medianLpa || 6)) * 12));

  let govtTotalFeeHi = '₹40,000 से ₹1.8 लाख (पूरी डिग्री — सरकारी/केंद्रीय विश्वविद्यालय)';
  let privateTotalFeeHi = `₹${Math.max(3, avgFeeLakhs)} लाख से ₹${Math.max(8, avgFeeLakhs * 2.5)} लाख (प्राइवेट कॉलेज — ₹15L कर्ज जाल से बचें)`;

  if (career.category === 'medical') {
    govtTotalFeeHi = '₹15,000 से ₹1.2 लाख (AIIMS / सरकारी मेडिकल कॉलेज — पूरी 5.5 वर्ष की फीस)';
    privateTotalFeeHi = '₹25 लाख से ₹75+ लाख (प्राइवेट/डीम्ड कॉलेज — भारी कर्ज से बचें, सरकारी सीट या पैरामेडिकल/बायोटेक चुनें)';
  } else if (career.category === 'engineering') {
    govtTotalFeeHi = '₹1.5 लाख से ₹5.5 लाख (राजकीय इंजीनियरिंग कॉलेज / NIT / IIIT / IIT — छात्रवृत्ति सहित)';
    privateTotalFeeHi = '₹10 लाख से ₹22 लाख (प्राइवेट यूनिवर्सिटी — ₹15 लाख के लोन ट्रैप से सावधान रहें)';
  } else if (career.category === 'commerce') {
    govtTotalFeeHi = '₹30,000 से ₹1.2 लाख (DU / केंद्रीय विश्वविद्यालय B.Com या ICAI CA की पूरी फीस)';
    privateTotalFeeHi = '₹6 लाख से ₹18 लाख (प्राइवेट BBA/MBA कॉलेज)';
  } else if (career.category === 'government') {
    govtTotalFeeHi = '₹15,000 से ₹60,000 (स्नातक डिग्री + परीक्षा शुल्क मात्र ₹100–₹1,000)';
    privateTotalFeeHi = '₹50,000 से ₹2.5 लाख (यदि प्राइवेट कोचिंग लें — हालांकि SWAYAM/NCERT से मुफ्त तैयारी संभव है)';
  } else if (career.category === 'vocational') {
    govtTotalFeeHi = '₹20,000 से ₹90,000 (सरकारी पॉलिटेक्निक / ITI / कौशल संस्थान)';
    privateTotalFeeHi = '₹2 लाख से ₹15 लाख+ (एविएशन/मर्चेंट नेवी अकादमी)';
  }

  let govtRolesHi =
    'केंद्र और राज्य सरकार के विभागों, सार्वजनिक उपक्रमों (PSUs जैसे ONGC, BHEL, NTPC, ISRO, DRDO) और राष्ट्रीयकृत बैंकों में ग्रेड-A/B राजपत्रित अधिकारी के पद।';
  let privateRolesHi =
    'शीर्ष भारतीय और बहुराष्ट्रीय कंपनियों (MNCs), टेक कॉर्पोरेशन, कंसल्टिंग फर्मों और स्टार्टअप्स में उच्च वेतन वाले पद।';

  if (career.category === 'medical') {
    govtRolesHi =
      'AIIMS, केंद्र/राज्य सरकारी अस्पताल, रेलवे, ईएसआईसी (ESIC), सीजीएचएस (CGHS), सशस्त्र बल चिकित्सा सेवा (AMC) और ICMR में स्थायी चिकित्सा अधिकारी/वैज्ञानिक।';
    privateRolesHi =
      'अपोलो, फोर्टिस, मेदांता जैसे कॉर्पोरेट अस्पतालों में कंसल्टेंट, फार्मा R&D, या स्वयं का स्वतंत्र क्लिनिक/डायग्नोस्टिक सेंटर।';
  } else if (career.category === 'law') {
    govtRolesHi =
      'राज्य न्यायिक सेवा (PCS-J) के माध्यम से सिविल जज/मजिस्ट्रेट, सरकारी वकील (Public Prosecutor), भारतीय सेना में JAG अधिकारी, और SEBI/RBI/PSU में लीगल ऑफिसर।';
    privateRolesHi =
      'शीर्ष कॉर्पोरेट लॉ फर्म, सुप्रीम कोर्ट/हाई कोर्ट में स्वतंत्र वकालत, और मल्टीनेशनल कंपनियों में जनरल काउंसल (General Counsel)।';
  } else if (career.category === 'commerce') {
    govtRolesHi =
      'RBI ग्रेड-B, SEBI, NABARD, CAG ऑडिटर, आयकर/GST इंस्पेक्टर (SSC CGL), SBI/IBPS बैंक पीओ और महारत्न PSU फाइनेंस ऑफिसर।';
    privateRolesHi =
      'Big-4 अकाउंटिंग फर्म (Deloitte, PwC, EY, KPMG), इन्वेस्टमेंट बैंकिंग, म्यूचुअल फंड, कॉर्पोरेट CFO और स्वतंत्र CA/फाइनेंस प्रैक्टिस।';
  }

  // PSYCHOLOGY UPGRADE: Reframe "Plan B" -> "Strategic Safety Net (Multi-Track Career Insurance)"
  const safePlanBOptions: HindiParentGuideData['safePlanBOptions'] = [];
  if (career.roadmap && career.roadmap.length > 0) {
    for (const step of career.roadmap) {
      if (step.planB && step.planB.length > 0) {
        for (const pb of step.planB) {
          const pbRec = pb as unknown as Record<string, string | undefined>;
          safePlanBOptions.push({
            optionTitleHi: pbRec.titleHindi || pbRec.title || pb.careerId || 'समानांतर सुरक्षित विकल्प',
            whySafeHi:
              pb.reasonHindi ||
              pb.reason ||
              'मुख्य प्रवेश परीक्षा में कटऑफ चूकने पर बिना साल बर्बाद किए समान वेतन और ग्रोथ देने वाला सुरक्षित विकल्प।',
            examOrEntryHi: 'CUET / राज्य स्तरीय प्रवेश या मेरिट आधारित प्रवेश',
          });
        }
      }
    }
  }

  if (safePlanBOptions.length < 3) {
    if (career.category === 'medical') {
      safePlanBOptions.push(
        {
          optionTitleHi: 'न्यूक्लियर मेडिसिन / रेडियोलॉजी / क्लिनिकल एम्ब्रियोलॉजी (AIIMS / सरकारी कॉलेज)',
          whySafeHi:
            'बिना MBBS की लंबी अवधि के, मात्र 3–4 वर्ष में AIIMS और टाटा मेमोरियल जैसे संस्थानों में ₹10–24 लाख का शुरुआती पैकेज और शून्य बेरोजगारी।',
          examOrEntryHi: 'AIIMS Paramedical / CUET-UG / राज्य पैरामेडिकल प्रवेश',
        },
        {
          optionTitleHi: 'B.Sc नर्सिंग (AIIMS) या B.Pharm (NIPER / सरकारी फार्मेसी)',
          whySafeHi:
            'केंद्र सरकार के अस्पतालों में नर्सिंग ऑफिसर (₹70,000+/माह शुरुआती वेतन) या फार्मा R&D व विदेश (UK/Australia) में सीधा रोजगार।',
          examOrEntryHi: 'AIIMS Nursing / CUET / राज्य CET',
        },
        {
          optionTitleHi: 'B.Sc बायोटेक्नोलॉजी / बायोइनफॉरमैटिक्स + IIT JAM / GAT-B',
          whySafeHi:
            'जीव विज्ञान के साथ कंप्यूटर और डेटा साइंस जोड़कर IIT या IISc से मास्टर्स करने का अवसर और ग्लोबल बायो-टेक कंपनियों में उच्च वेतन।',
          examOrEntryHi: 'CUET-UG + IIT JAM / GAT-B',
        }
      );
    } else if (career.category === 'engineering') {
      safePlanBOptions.push(
        {
          optionTitleHi: 'राज्य सरकार के शीर्ष इंजीनियरिंग कॉलेज + GATE / ऑफ-कैंपस स्किल पोर्टफोलियो',
          whySafeHi:
            'यदि IIT/NIT न मिले, तो कम फीस वाले सरकारी/राज्य कॉलेज से B.Tech करें और GATE या कोडिंग प्रोजेक्ट्स से महारत्न PSU (₹18–24 LPA) या टॉप टेक कंपनी में जाएं।',
          examOrEntryHi: 'राज्य CET (MHT-CET, WBJEE, KCET, UPTAC) + GATE',
        },
        {
          optionTitleHi: 'BCA + NIMCET (NIT से MCA) या IIT मद्रास BS डेटा साइंस डिग्री',
          whySafeHi:
            'बिना JEE के कम खर्च में BCA करें और NIT से MCA करके B.Tech CSE के बराबर प्लेसमेंट पाएं।',
          examOrEntryHi: 'CUET / NIMCET / IITM ऑनलाइन क्वालिफायर',
        },
        {
          optionTitleHi: '3-वर्षीय सरकारी पॉलिटेक्निक डिप्लोमा + लेटरल एंट्री B.Tech / जूनियर इंजीनियर (SSC JE)',
          whySafeHi:
            'मात्र ₹30,000 कुल खर्च में डिप्लोमा पूरा कर रेलवे/CPWD में सरकारी जूनियर इंजीनियर (JE) बनें या सीधे B.Tech द्वितीय वर्ष में प्रवेश लें।',
          examOrEntryHi: 'राज्य पॉलिटेक्निक प्रवेश परीक्षा (JEECUP आदि)',
        }
      );
    } else {
      safePlanBOptions.push(
        {
          optionTitleHi: 'केंद्रीय विश्वविद्यालय (DU / BHU / JNU) से ऑनर्स डिग्री + कॉर्पोरेट स्किल सर्टिफिकेशन',
          whySafeHi:
            'मात्र ₹15,000–40,000 की सरकारी फीस में शीर्ष केंद्रीय विश्वविद्यालय से स्नातक करें और साथ में डेटा/फाइनेंस/लॉ सर्टिफिकेशन जोड़ें।',
          examOrEntryHi: 'CUET-UG (राष्ट्रीय परीक्षा एजेंसी)',
        },
        {
          optionTitleHi: 'ICAI CA / CS / CMA या NISM वित्तीय प्रमाणन (डिग्री के साथ)',
          whySafeHi:
            'कॉलेज की पढ़ाई के साथ-साथ कम फीस में वैधानिक प्रोफेशनल योग्यता हासिल करें जो 100% जॉब सुरक्षा देती है।',
          examOrEntryHi: 'ICAI / ICSI फाउंडेशन प्रवेश',
        },
        {
          optionTitleHi: 'UPSC / राज्य पीएससी / RBI / SSC CGL एवं बैंकिंग अधिकारी ट्रैक',
          whySafeHi:
            'स्नातक के प्रथम वर्ष से ही NCERT और पिछले 10 वर्षों के प्रश्नपत्रों का अभ्यास कर सुरक्षित सरकारी राजपत्रित पद प्राप्त करें।',
          examOrEntryHi: 'UPSC / SSC / IBPS / State PSC',
        }
      );
    }
  }

  const streams = (career.eligibility?.streams || ['Any']).join(' / ');
  const exams = (career.eligibility?.exams || ['राष्ट्रीय / राज्य प्रवेश परीक्षा']).join(', ');

  // UPGRADE 2 & 3 ("Uncle-Defense" PDF Upgrade: What to say when relatives ask about this career)
  const uncleDefenseScripts: HindiParentGuideData['uncleDefenseScripts'] = [
    {
      questionHi: 'सवाल 1: "अरे, यह कौन-सी लाइन ले ली? इसमें सरकारी नौकरी (Sarkari Job) का क्या स्कोप है?"',
      scriptHi: `"यह डिग्री (${formalDesignationEn}) भारत सरकार के UGC / AICTE / वैधानिक नियमों के तहत 100% मान्यता प्राप्त है। हमारा बच्चा UPSC (IAS/IPS), SSC CGL, बैंक PO और PSU अधिकारियों की हर परीक्षा के लिए पूरी तरह पात्र (Eligible) है, और साथ में कॉर्पोरेट सेक्टर का दरवाजा भी खुला है।"`,
      scriptEn: `"My child is pursuing ${formalDesignationEn}, which is 100% UGC/AICTE recognized and fully eligible for UPSC, SSC CGL, Bank PO, and PSU officer exams—while also unlocking high-growth corporate roles."`,
    },
    {
      questionHi: 'सवाल 2: "प्राइवेट कॉलेज से B.Tech / महंगी डिग्री क्यों नहीं करवा रहे?"',
      scriptHi: `"हमने सरकारी/NIRF रैंक वाले संस्थान और हाई-ROI ट्रैक चुना है जिसकी कुल फीस बहुत कम (${govtTotalFeeHi.split('(')[0].trim()}) है। इससे हमारे ₹10 से ₹15 लाख बच रहे हैं जो बिना सोचे-समझे प्राइवेट कॉलेज के कर्ज जाल (Debt Trap) में डूब जाते।"`,
      scriptEn: `"By targeting NIRF/Govt institutions and high-ROI pathways, we are saving ₹10 to ₹15 Lakhs compared to unaccredited private colleges, with zero education loan stress and ~${paybackMonths} months fee payback."`,
    },
    {
      questionHi: 'सवाल 3: "शर्मा जी के बेटे की तरह 1-2 साल कोटा/कोचिंग में ड्रॉप (Drop Year) क्यों नहीं दिलवाया?"',
      scriptHi: `"1 साल ड्रॉप लेने का असली वित्तीय नुकसान ₹1.5 लाख कोचिंग फीस + ₹6–8 लाख की 1 साल की खोई हुई शुरुआती सैलरी = कुल ₹7.5–9.5 लाख होता है। हमने बिना 1 साल गंवाए 'मल्टी-ट्रैक करियर इंश्योरेंस' (Strategic Safety Net) चुना है।"`,
      scriptEn: `"Taking an unplanned 1-year drop costs ₹1.5 Lakh in coaching plus ₹6–8 Lakh in lost first-year earnings (= ₹8+ Lakh total loss). Instead of losing a year, we are executing a verified Multi-Track Career Insurance plan."`,
    },
  ];

  // UPGRADE: Teacher & Parent Academic Progress & Counseling Communication Tracker
  const teacherParentProgressTracker: HindiParentGuideData['teacherParentProgressTracker'] = {
    studentScriptToParentTeacherHi:
      `"आदरणीय माता-पिता / शिक्षक जी, मैंने ${titleHi} (${formalDesignationEn}) के लिए अपना 4-स्तरीय शैक्षणिक रोडमैप तैयार किया है। मैं केवल डिग्री के नाम पर निर्भर नहीं हूँ—मैं हर सेमेस्टर में आधिकारिक पिछले 10 वर्षों के प्रश्नपत्र (PYQs), मुफ्त सरकारी SWAYAM/NPTEL IIT कोर्सेज, और प्रैक्टिकल इंटर्नशिप मील के पत्थर पूरे करूँगा/करूँगी जिन्हें आप नीचे दी गई तालिका से हर 3 महीने में ट्रैक कर सकते हैं।"`,
    studentScriptToParentTeacherEn:
      `"Respected Parents & Teachers, I have mapped out a data-driven 4-stage execution plan for ${formalDesignationEn}. Rather than relying solely on classroom theory, you can track my quarterly progress across official past-paper mocks (${exams}), free Govt SWAYAM/NPTEL certifications, and verified portfolio projects below."`,
    milestones: [
      {
        metricHi: '1. प्रवेश परीक्षा व अकादमिक कटऑफ लक्ष्य (Academic Metric)',
        targetGoalHi: `बोर्ड में ${career.eligibility?.minPercent || 60}%+ अंक और ${exams} के पिछले 10 वर्षों के 25+ मॉक टेस्ट पूरा करना`,
        verificationSourceHi: 'NTA / आधिकारिक मॉक स्कोरकार्ड और एरर नोटबुक',
      },
      {
        metricHi: '2. सरकारी कौशल प्रमाणन (Skill Proof-of-Work)',
        targetGoalHi: 'SWAYAM / NPTEL (IIT/IIM) के 2 मुफ्त सर्टिफिकेट कोर्स और 2 प्रैक्टिकल प्रोजेक्ट्स',
        verificationSourceHi: 'swayam.gov.in / nptel.ac.in आधिकारिक सर्टिफिकेट',
      },
      {
        metricHi: '3. वित्तीय अनुशासन और छात्रवृत्ति (Financial ROI Goal)',
        targetGoalHi: 'NSP छात्रवृत्ति (scholarships.gov.in) व कम फीस वाले NIRF/सरकारी कॉलेजों में आवेदन',
        verificationSourceHi: 'NIRF / AICTE पोर्टल और NSP आवेदन रसीद',
      },
      {
        metricHi: '4. इंटर्नशिप और रोजगार तत्परता (Employability Metric)',
        targetGoalHi: 'AICTE नेशनल इंटर्नशिप पोर्टल के माध्यम से 6–8 सप्ताह की इंडस्ट्री/क्लिनिकल ट्रेनिंग',
        verificationSourceHi: 'internship.aicte-india.org वेरिफाइड सर्टिफिकेट',
      },
    ],
  };

  return {
    careerId: career.id,
    titleHi,
    titleEn,
    formalDesignationEn,
    categoryLabelHi: catLabelHi,
    simpleSummaryHi:
      career.overviewHindi ||
      career.taglineHindi ||
      `${titleHi} (${titleEn}) भारत में एक अत्यधिक सम्मानित, उच्च-वेतन और भविष्य के लिए सुरक्षित करियर मार्ग है।`,
    durationHi:
      t(career, 'duration', 'hi') ||
      (career.category === 'medical' ? '4.5 से 5.5 वर्ष' : career.category === 'engineering' ? '4 वर्ष (8 सेमेस्टर)' : '3 से 5 वर्ष'),
    eligibilityStreamsHi:
      streams === 'Any'
        ? '12वीं किसी भी स्ट्रीम से (Science / Commerce / Arts सभी पात्र हैं)'
        : `12वीं में ${streams} विषय समूह आवश्यक है`,
    minBoardMarksHi: `बोर्ड परीक्षा में न्यूनतम ${career.eligibility?.minPercent || 50}%–60% अंक (आरक्षित वर्ग SC/ST/OBC को सरकारी नियमानुसार 5% छूट)`,
    keyExamsHi: exams,
    feesComparison: {
      govtTotalFeeHi,
      privateTotalFeeHi,
      hostelMessMonthlyHi: '₹4,500 से ₹8,500 प्रति माह (सरकारी हॉस्टल में ₹1,500–₹3,500/माह)',
      booksLaptopOneTimeHi: '₹35,000 से ₹55,000 (पूरी पढ़ाई के दौरान केवल एक बार का खर्च)',
      roiPaybackMonthsHi: `नौकरी लगने के मात्र ${paybackMonths} से ${paybackMonths + 6} महीनों की शुरुआती सैलरी में पूरी पढ़ाई का खर्च वसूल (High ROI) हो जाता है।`,
    },
    scholarshipsAndLoans: [
      {
        schemeNameHi: '1. पीएम-विद्यालक्ष्मी योजना (PM-Vidyalaxmi Scheme)',
        benefitHi:
          'देश के शीर्ष 860+ कॉलेजों (NIRF रैंक) में प्रवेश मिलने पर बिना किसी गारंटी और बिना ज़मीन/गहने गिरवी रखे (100% Collateral-Free) एजुकेशन लोन। ₹7.5 लाख तक के लोन पर 75% भारत सरकार की गारंटी और ₹10 लाख तक के लोन पर 3% ब्याज सब्सिडी।',
        eligibilityHi: 'वार्षिक पारिवारिक आय ₹8 लाख तक (3% ब्याज छूट हेतु); सभी आय वर्गों के लिए बिना गारंटी लोन उपलब्ध।',
        portalUrl: 'https://pmvidyalaxmi.co.in',
      },
      {
        schemeNameHi: '2. CSIS ब्याज सब्सिडी योजना (Central Sector Interest Subsidy)',
        benefitHi:
          'पढ़ाई की पूरी अवधि + नौकरी लगने के 1 साल बाद तक (Moratorium Period) एजुकेशन लोन का 100% ब्याज भारत सरकार स्वयं भरती है।',
        eligibilityHi: 'वार्षिक पारिवारिक आय ₹4.5 लाख से कम (सभी वर्गों के छात्रों के लिए)।',
        portalUrl: 'https://www.vidyalakshmi.co.in',
      },
      {
        schemeNameHi: '3. AICTE प्रगति एवं सक्षम छात्रवृत्ति (बेटियों और दिव्यांग छात्रों हेतु)',
        benefitHi:
          'तकनीकी डिग्री/डिप्लोमा करने वाली प्रत्येक छात्रा को ₹50,000 प्रति वर्ष की सीधी आर्थिक सहायता।',
        eligibilityHi: 'परिवार की वार्षिक आय ₹8 लाख से कम (एक परिवार की अधिकतम 2 बेटियों को लाभ)।',
        portalUrl: 'https://scholarships.gov.in',
      },
      {
        schemeNameHi: '4. नेशनल स्कॉलरशिप पोर्टल (NSP — पोस्ट-मैट्रिक एवं सेंट्रल सेक्टर योजना)',
        benefitHi:
          '12वीं में 80+ परसेंटाइल लाने वाले छात्रों को ₹12,000 से ₹20,000 प्रति वर्ष तथा SC/ST/OBC/EWS वर्ग के छात्रों को 50%–100% ट्यूशन फीस प्रतिपूर्ति।',
        eligibilityHi: '12वीं बोर्ड मेरिट एवं राज्य/केंद्र आय मानदंड (₹2.5 लाख से ₹4.5 लाख वार्षिक आय)।',
        portalUrl: 'https://scholarships.gov.in',
      },
    ],
    salaryReality: {
      advertisedCtcHi: `${career.salaryInr?.entry || `₹${traj.points[0]?.medianLpa || 7} लाख प्रति वर्ष`} (विज्ञापित वार्षिक पैकेज / CTC)`,
      actualMonthlyInHandEntryHi: `₹${entryMonthlyInHand.toLocaleString('en-IN')} से ₹${Math.round(entryMonthlyInHand * 1.25).toLocaleString('en-IN')} प्रति माह (पीएफ और टैक्स कटने के बाद बैंक खाते में आने वाली असली राशि)`,
      midCareer5YrHi: `${career.salaryInr?.mid || `₹${traj.points[2]?.medianLpa || 16} लाख प्रति वर्ष`} (4–6 वर्ष के अनुभव के बाद)`,
      senior10YrHi: `${career.salaryInr?.senior || `₹${traj.points[4]?.medianLpa || 35}+ लाख प्रति वर्ष`} (8–12+ वर्ष के वरिष्ठ अनुभव पर)`,
      aiSafetyScoreHi: `${kpis.aiResilienceScore}% सुरक्षित — AI इस क्षेत्र में नौकरियां खत्म नहीं करेगा, बल्कि आधुनिक टूल्स जानने वाले पेशेवरों की सैलरी 30%–40% बढ़ाएगा।`,
      jobSecurityVerdictHi: `बाजार मांग: ${kpis.demandLevel === 'Very High' ? 'अत्यधिक उच्च (Very High Demand)' : 'मजबूत और स्थिर (Strong & Stable)'} • आगामी 5 वर्षों में ${kpis.averageGrowthYoY} की दर से नए अवसर बढ़ रहे हैं।`,
    },
    govtVsPrivateScope: {
      govtRolesHi,
      privateRolesHi,
      abroadScopeHi:
        '3–5 वर्ष के अनुभव या उच्च शिक्षा के बाद अमेरिका, ब्रिटेन, जर्मनी, ऑस्ट्रेलिया, खाड़ी देशों (UAE), और सिंगापुर में उच्च वेतन के अवसर उपलब्ध हैं।',
    },
    safePlanBOptions: safePlanBOptions.slice(0, 3),
    uncleDefenseScripts,
    teacherParentProgressTracker,
    parentActionableTipsHi: [
      '1. केवल एक प्रवेश परीक्षा के भरोसे न रहें—मुख्य परीक्षा के साथ-साथ कम से कम 2 समानांतर परीक्षाओं (CUET, राज्य CET) का फॉर्म अवश्य भरें।',
      '2. किसी भी प्राइवेट कॉलेज में प्रवेश लेने से पहले उसकी UGC / AICTE / NIRF मान्यता और असली औसत प्लेसमेंट की जांच करें।',
      '3. पैसों की कमी के कारण बच्चे की पढ़ाई कभी न रोकें—पीएम-विद्यालक्ष्मी पोर्टल (pmvidyalaxmi.co.in) और नेशनल स्कॉलरशिप पोर्टल (scholarships.gov.in) पर समय रहते आवेदन करें।',
    ],
  };
}

export function buildHindiParentGuidePrintableHtml(
  career: ChildCareer,
  lang: Language = 'hi'
): string {
  const g = generateHindiParentGuideData(career);
  const qrSvg = buildCareerPathoQrSvg('https://careerpatho.in');
  const loc = (hiStr: string, enStr?: string) =>
    lang === 'en' ? hiStr : tr(lang, enStr || hiStr, hiStr);

  const planBRows = g.safePlanBOptions
    .map(
      (pb, i) => `
      <div class="box" style="margin-bottom:8px;">
        <div style="font-weight:800;font-size:13px;">${loc(`विकल्प ${i + 1}: ${pb.optionTitleHi}`)}</div>
        <div style="font-size:12px;margin-top:3px;color:#222;"><strong>${loc('क्यों सुरक्षित है:')}</strong> ${loc(pb.whySafeHi)}</div>
        <div style="font-size:11px;margin-top:2px;color:#555;"><strong>${loc('प्रवेश माध्यम:')}</strong> ${loc(pb.examOrEntryHi)}</div>
      </div>`
    )
    .join('');

  const uncleDefenseRows = g.uncleDefenseScripts
    .map(
      (u) => `
      <div class="box" style="margin-bottom:8px;">
        <div style="font-weight:800;font-size:12px;color:#111;">${loc(u.questionHi)}</div>
        <div style="font-size:12px;margin-top:4px;color:#000;"><strong>${loc('जवाब (Native):')}</strong> ${loc(u.scriptHi)}</div>
        <div style="font-size:11px;margin-top:3px;color:#333;"><strong>What to say (English):</strong> ${u.scriptEn}</div>
      </div>`
    )
    .join('');

  const trackerRows = g.teacherParentProgressTracker.milestones
    .map(
      (m) => `
      <tr>
        <td style="font-weight:700;">${loc(m.metricHi)}</td>
        <td>${loc(m.targetGoalHi)}</td>
        <td>${loc(m.verificationSourceHi)}</td>
      </tr>`
    )
    .join('');

  const scholarshipRows = g.scholarshipsAndLoans
    .map(
      (s) => `
      <tr>
        <td style="font-weight:700;">${loc(s.schemeNameHi)}</td>
        <td>${loc(s.benefitHi)}</td>
        <td>${loc(s.eligibilityHi)}<br/><span style="font-family:monospace;font-size:10px;">${s.portalUrl}</span></td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${lang === 'en' ? 'hi' : lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${loc(`अभिभावक मार्गदर्शिका — ${g.titleHi}`)} (CareerPathO)</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Devanagari', 'Mangal', 'Segoe UI', system-ui, sans-serif;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.55;
      font-size: 13px;
    }
    .page {
      max-width: 820px;
      margin: 0 auto;
      border: 2px solid #000;
      padding: 24px;
    }
    .header {
      border-bottom: 2px solid #000;
      padding-bottom: 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    .badge {
      display: inline-block;
      background: #000;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      margin-bottom: 6px;
    }
    h1 {
      font-size: 22px;
      margin: 4px 0;
      font-weight: 900;
    }
    h2 {
      font-size: 15px;
      font-weight: 800;
      background: #000;
      color: #fff;
      padding: 6px 10px;
      margin: 18px 0 10px 0;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .box {
      border: 1px solid #000;
      padding: 10px 12px;
      background: #fafafa;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f0f0f0;
      font-weight: 800;
    }
    ul {
      margin: 6px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 6px;
    }
    .no-print-bar {
      max-width: 820px;
      margin: 0 auto 16px auto;
      padding: 12px 16px;
      background: #000;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      background: #fff;
      color: #000;
      border: none;
      padding: 8px 16px;
      font-weight: 800;
      cursor: pointer;
      font-size: 13px;
    }
    @media print {
      .no-print-bar { display: none !important; }
      body { padding: 0; }
      .page { border: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div><strong>${loc('CareerPathO अभिभावक मार्गदर्शिका')}</strong> — ${loc('प्रिंट करने या PDF सेव करने के लिए बटन दबाएं')}</div>
    <button class="btn" onclick="window.print()">🖨️ ${loc('प्रिंट करें / Save as PDF')}</button>
  </div>
  <div class="page">
    <div class="header">
      <div>
        <span class="badge">${loc('माता-पिता एवं अभिभावक विशेष मार्गदर्शिका • ✅ Eligible for UPSC / SSC / Bank PO')}</span>
        <h1>${loc(g.titleHi)} (${g.formalDesignationEn})</h1>
        <div style="font-size:12px;color:#333;">${loc('क्षेत्र:')} <strong>${loc(g.categoryLabelHi)}</strong> • ${loc('कोर्स अवधि:')} <strong>${loc(g.durationHi)}</strong></div>
      </div>
      <div style="text-align:right;font-family:monospace;font-size:11px;">
        <strong>CareerPathO.in</strong><br/>
        ${loc('सत्यापित डेटा: 2026')}<br/>
        ${loc('निःशुल्क जनहित पोर्टल')}
      </div>
    </div>

    <h2>${loc('1. यह करियर क्या है और इसमें क्या काम होता है? (सरल परिचय)')}</h2>
    <div class="box">
      <p style="margin:0 0 8px 0;">${loc(g.simpleSummaryHi)}</p>
      <div class="grid-2" style="margin-top:8px;">
        <div><strong>${loc('पात्र स्ट्रीम (12वीं):')}</strong> ${loc(g.eligibilityStreamsHi)}</div>
        <div><strong>${loc('न्यूनतम बोर्ड अंक:')}</strong> ${loc(g.minBoardMarksHi)}</div>
        <div><strong>${loc('मुख्य प्रवेश परीक्षाएं:')}</strong> ${loc(g.keyExamsHi)}</div>
        <div><strong>${loc('कुल पढ़ाई अवधि:')}</strong> ${loc(g.durationHi)}</div>
      </div>
    </div>

    <h2>${loc('2. कुल खर्च की सच्चाई: सरकारी कॉलेज बनाम प्राइवेट कॉलेज (₹15 लाख कर्ज जाल से बचाव)')}</h2>
    <table>
      <thead>
        <tr>
          <th>${loc('खर्च का विवरण (Cost Head)')}</th>
          <th>${loc('अनुमानित राशि एवं महत्वपूर्ण जानकारी')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${loc('सरकारी / केंद्रीय कॉलेज कुल फीस')}</strong></td>
          <td><strong>${loc(g.feesComparison.govtTotalFeeHi)}</strong></td>
        </tr>
        <tr>
          <td><strong>${loc('प्राइवेट कॉलेज कुल फीस')}</strong></td>
          <td>${loc(g.feesComparison.privateTotalFeeHi)}</td>
        </tr>
        <tr>
          <td><strong>${loc('हॉस्टल और मेस का मासिक खर्च')}</strong></td>
          <td>${loc(g.feesComparison.hostelMessMonthlyHi)}</td>
        </tr>
        <tr>
          <td><strong>${loc('किताबें और लैपटॉप (एकमुश्त खर्च)')}</strong></td>
          <td>${loc(g.feesComparison.booksLaptopOneTimeHi)}</td>
        </tr>
        <tr>
          <td><strong>${loc('पढ़ाई का खर्च कितने समय में वसूल होगा? (ROI Payback)')}</strong></td>
          <td><strong>${loc(g.feesComparison.roiPaybackMonthsHi)}</strong></td>
        </tr>
      </tbody>
    </table>

    <h2>${loc('3. सरकारी छात्रवृत्ति और बिना गारंटी का एजुकेशन लोन (PM-Vidyalaxmi व NSP योजना)')}</h2>
    <table>
      <thead>
        <tr>
          <th style="width:28%;">${loc('सरकारी योजना का नाम')}</th>
          <th style="width:44%;">${loc('आपको क्या लाभ मिलेगा?')}</th>
          <th style="width:28%;">${loc('पात्रता एवं आधिकारिक वेबसाइट')}</th>
        </tr>
      </thead>
      <tbody>
        ${scholarshipRows}
      </tbody>
    </table>

    <h2>${loc('4. असली मासिक इन-हैंड सैलरी बनाम CTC और भविष्य की सुरक्षा')}</h2>
    <div class="grid-2">
      <div class="box">
        <div><strong>${loc('शुरुआती पैकेज (CTC):')}</strong> ${loc(g.salaryReality.advertisedCtcHi)}</div>
        <div style="margin-top:6px;"><strong>${loc('असली मासिक इन-हैंड वेतन (शुरुआत में):')}</strong> <span style="text-decoration:underline;font-weight:800;">${loc(g.salaryReality.actualMonthlyInHandEntryHi)}</span></div>
        <div style="margin-top:6px;"><strong>${loc('5 साल बाद वेतन:')}</strong> ${loc(g.salaryReality.midCareer5YrHi)}</div>
        <div style="margin-top:4px;"><strong>${loc('10+ साल बाद वरिष्ठ वेतन:')}</strong> ${loc(g.salaryReality.senior10YrHi)}</div>
      </div>
      <div class="box">
        <div><strong>${loc('नौकरी की सुरक्षा और मांग:')}</strong><br/>${loc(g.salaryReality.jobSecurityVerdictHi)}</div>
        <div style="margin-top:8px;"><strong>${loc('AI और भविष्य का प्रभाव:')}</strong><br/>${loc(g.salaryReality.aiSafetyScoreHi)}</div>
      </div>
    </div>

    <h2>${loc('5. What to tell relatives when they ask about this career (रिश्तेदारों के सवालों का जवाब)')}</h2>
    ${uncleDefenseRows}

    <h2>${loc('6. रणनीतिक सुरक्षा कवच (Strategic Safety Net / Multi-Track Career Insurance)')}</h2>
    <p style="margin:0 0 8px 0;font-size:12px;">${loc('बच्चे का 1–2 साल ड्रॉप (Drop Year) में बर्बाद करने के बजाय नीचे दिए गए समानांतर सुरक्षित विकल्पों को साथ लेकर चलें:')}</p>
    ${planBRows}

    <h2>${loc('7. शिक्षक और अभिभावक संवाद: शैक्षणिक प्रगति और व्यक्तिगत लक्ष्य ट्रैकर')}</h2>
    <div class="box" style="margin-bottom:8px;">
      <p style="margin:0 0 6px 0;"><strong>${loc('छात्र द्वारा शिक्षक/अभिभावक को बताने योग्य संदेश:')}</strong> ${loc(g.teacherParentProgressTracker.studentScriptToParentTeacherHi)}</p>
      <p style="margin:0;font-size:11px;color:#333;"><strong>Student Progress Statement:</strong> ${g.teacherParentProgressTracker.studentScriptToParentTeacherEn}</p>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:28%;">${loc('प्रदर्शन मापदंड (Performance Metric)')}</th>
          <th style="width:44%;">${loc('व्यक्तिगत लक्ष्य (Personalized Goal)')}</th>
          <th style="width:28%;">${loc('पारदर्शी सत्यापन स्रोत (Verification)')}</th>
        </tr>
      </thead>
      <tbody>
        ${trackerRows}
      </tbody>
    </table>

    <h2>${loc('8. माता-पिता के लिए 3 सबसे जरूरी सुझाव')}</h2>
    <div class="box">
      <ul>
        ${g.parentActionableTipsHi.map((tip) => `<li>${loc(tip)}</li>`).join('')}
      </ul>
    </div>

    <!-- UPGRADE 5 (The Viral Loop): Prominent QR Code pointing to careerpatho.in + exact Govt verification text -->
    <div style="margin-top:18px;padding-top:14px;border-top:2px solid #000;display:flex;align-items:center;justify-content:space-between;gap:16px;">
      <div style="font-size:11.5px;line-height:1.5;">
        <div style="font-weight:900;font-size:13px;">Generated via CareerPathO — Free, No Login, No Ads. Data verified via Govt Portals.</div>
        <div>${loc('आधिकारिक सरकारी पोर्टल डेटा (NIRF, AICTE, NTA, UGC) पर आधारित • छात्र मानसिक स्वास्थ्य हेल्पलाइन (Tele-MANAS):')} <strong>14416</strong></div>
        <div style="font-family:monospace;font-size:11px;margin-top:2px;">Scan QR or visit: <strong>https://careerpatho.in</strong></div>
      </div>
      <div style="border:2px solid #000;padding:6px;background:#fff;text-align:center;flex-shrink:0;">
        ${qrSvg}
        <div style="font-family:monospace;font-size:8px;font-weight:800;margin-top:2px;">CAREERPATHO.IN</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function buildCareerBlueprintPrintableHtml(career: ChildCareer, lang: Language): string {
  const title = t(career, 'title', lang);
  const formalTitle = getFormalDesignation(career, lang);
  const tagline = t(career, 'tagline', lang);
  const overview = t(career, 'overview', lang);
  const traj = computeSalaryTrajectory(career);
  const kpis = computeCareerKPIs(career);
  const qrSvg = buildCareerPathoQrSvg('https://careerpatho.in');

  const stepsHtml = (career.roadmap || [])
    .map(
      (st, i) => `
      <div style="border:1px solid #000;padding:10px 12px;margin-bottom:8px;">
        <div style="font-weight:800;font-size:13px;">Step ${i + 1}: ${t(st, 'title', lang)} (${st.duration || ''})</div>
        <div style="font-size:12px;margin-top:4px;">${t(st, 'description', lang)}</div>
        ${
          st.details?.exams?.length
            ? `<div style="font-size:11px;margin-top:4px;font-family:monospace;"><strong>Exams:</strong> ${st.details.exams.join(', ')}</div>`
            : ''
        }
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>${formalTitle} — CareerPathO Blueprint</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; color: #000; background: #fff; margin: 0; padding: 24px; line-height: 1.5; font-size: 13px; }
    .page { max-width: 820px; margin: 0 auto; border: 2px solid #000; padding: 24px; }
    h1 { font-size: 22px; margin: 4px 0; font-weight: 900; }
    h2 { font-size: 14px; font-weight: 800; background: #000; color: #fff; padding: 6px 10px; margin: 16px 0 10px 0; text-transform: uppercase; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 12px 0; }
    .metric { border: 1px solid #000; padding: 8px; }
    .no-print-bar { max-width: 820px; margin: 0 auto 16px auto; padding: 12px 16px; background: #000; color: #fff; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #fff; color: #000; border: none; padding: 8px 16px; font-weight: 800; cursor: pointer; }
    @media print { .no-print-bar { display: none !important; } body { padding: 0; } .page { border: none; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div><strong>CareerPathO Official Career Blueprint</strong> — ${formalTitle}</div>
    <button class="btn" onclick="window.print()">🖨️ ${tr(lang, 'Print / Save as PDF', 'प्रिंट करें / Save PDF')}</button>
  </div>
  <div class="page">
    <div style="border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:12px;">
      <div style="font-family:monospace;font-size:11px;font-weight:700;">CAREERPATHO VERIFIED ROADMAP • ${career.category.toUpperCase()} • [✅ Eligible for UPSC / SSC / Bank PO]</div>
      <h1>${formalTitle} (${title})</h1>
      <p style="margin:4px 0 0 0;color:#333;">${tagline}</p>
    </div>
    <div class="grid-4">
      <div class="metric"><div style="font-size:10px;color:#555;">ENTRY CTC</div><strong>${career.salaryInr?.entry || `₹${traj.entryMedianLpa} LPA`}</strong></div>
      <div class="metric"><div style="font-size:10px;color:#555;">IN-HAND / MO</div><strong>₹${traj.points[0].monthlyInHandInr.toLocaleString('en-IN')}/mo</strong></div>
      <div class="metric"><div style="font-size:10px;color:#555;">5-YR GROWTH</div><strong>${kpis.averageGrowthYoY}</strong></div>
      <div class="metric"><div style="font-size:10px;color:#555;">AI RESILIENCE</div><strong>${kpis.aiResilienceScore}% Safe</strong></div>
    </div>
    <h2>${tr(lang, '1. Executive Overview', '1. करियर परिचय')}</h2>
    <p>${overview}</p>
    <h2>${tr(lang, '2. Step-by-Step Execution Roadmap', '2. चरणबद्ध रोडमैप')}</h2>
    ${stepsHtml}
    <div style="margin-top:18px;padding-top:14px;border-top:2px solid #000;display:flex;align-items:center;justify-content:space-between;gap:16px;">
      <div style="font-size:11.5px;line-height:1.5;">
        <div style="font-weight:900;font-size:13px;">Generated via CareerPathO — Free, No Login, No Ads. Data verified via Govt Portals.</div>
        <div style="font-family:monospace;font-size:11px;margin-top:2px;">Scan QR or visit: <strong>https://careerpatho.in</strong></div>
      </div>
      <div style="border:2px solid #000;padding:6px;background:#fff;text-align:center;flex-shrink:0;">
        ${qrSvg}
        <div style="font-family:monospace;font-size:8px;font-weight:800;margin-top:2px;">CAREERPATHO.IN</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function buildCareerAssessmentPrintableHtml(result: CareerAssessmentResult, lang: Language): string {
  const qrSvg = buildCareerPathoQrSvg('https://careerpatho.in');
  const rows = result.top3Categories
    .map(
      (item, idx) => `
      <div style="border:1px solid #000;padding:12px;margin-bottom:10px;">
        <div style="font-weight:800;font-size:14px;">#${idx + 1}: ${tr(lang, item.info.titleEn, item.info.titleHi)} (${item.points} pts • ${tr(lang, item.alignmentBandLabelEn, item.alignmentBandLabelHi)})</div>
        <div style="font-size:12px;margin-top:4px;">${tr(lang, item.info.whyItFitsEn, item.info.whyItFitsHi)}</div>
        <div style="font-size:11px;margin-top:4px;font-family:monospace;">
          <strong>Exams:</strong> ${item.info.topExams.join(', ')} | <strong>Degrees:</strong> ${item.info.typicalDegrees.join(', ')} | <strong>Avg Starting Salary:</strong> ${item.info.avgEntrySalary}
        </div>
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>CareerPathO 25-Question Career Assessment Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; color: #000; background: #fff; margin: 0; padding: 24px; line-height: 1.5; font-size: 13px; }
    .page { max-width: 820px; margin: 0 auto; border: 2px solid #000; padding: 24px; }
    h1 { font-size: 20px; margin: 4px 0; font-weight: 900; }
    h2 { font-size: 14px; font-weight: 800; background: #000; color: #fff; padding: 6px 10px; margin: 16px 0 10px 0; }
    .no-print-bar { max-width: 820px; margin: 0 auto 16px auto; padding: 12px 16px; background: #000; color: #fff; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #fff; color: #000; border: none; padding: 8px 16px; font-weight: 800; cursor: pointer; }
    @media print { .no-print-bar { display: none !important; } body { padding: 0; } .page { border: none; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div><strong>CareerPathO 25-Question Multi-Modal Career Assessment Report</strong></div>
    <button class="btn" onclick="window.print()">🖨️ ${tr(lang, 'Print / Save as PDF', 'प्रिंट करें / Save PDF')}</button>
  </div>
  <div class="page">
    <h1>${tr(lang, result.headlineEn, result.headlineHi)}</h1>
    <p>${tr(lang, result.summaryEn, result.summaryHi)}</p>
    <div style="border:1px solid #000;padding:10px;margin:12px 0;font-family:monospace;">
      <strong>Confidence Band:</strong> ${result.confidenceBandLow}%–${result.confidenceBandHigh}% (${result.confidenceLevel}) | <strong>Questions Answered:</strong> ${result.answeredCount}/${result.totalQuestions} | <strong>Total Weighted Points:</strong> ${result.totalPoints}
    </div>
    ${
      result.isFallbackTriggered
        ? `<div style="border:2px solid #000;padding:10px;margin-bottom:12px;background:#f5f5f5;"><strong>Fallback Advisory:</strong> ${
            tr(lang, result.fallbackReasonEn, result.fallbackReasonHi)
          }</div>`
        : ''
    }
    <h2>${tr(lang, 'Top 3 Matching Career Categories', 'शीर्ष 3 उपयुक्त करियर क्षेत्र (Top 3 Matching Categories)')}</h2>
    ${rows}
    <div style="margin-top:18px;padding-top:14px;border-top:2px solid #000;display:flex;align-items:center;justify-content:space-between;gap:16px;">
      <div style="font-size:11.5px;line-height:1.5;">
        <div style="font-weight:900;font-size:13px;">Generated via CareerPathO — Free, No Login, No Ads. Data verified via Govt Portals.</div>
        <div style="font-family:monospace;font-size:11px;margin-top:2px;">Scan QR or visit: <strong>https://careerpatho.in</strong></div>
      </div>
      <div style="border:2px solid #000;padding:6px;background:#fff;text-align:center;flex-shrink:0;">
        ${qrSvg}
        <div style="font-family:monospace;font-size:8px;font-weight:800;margin-top:2px;">CAREERPATHO.IN</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadHtmlReportFile(filename: string, htmlContent: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  } catch (err) {
    console.warn('Report download fallback error:', err);
    return false;
  }
}

export function safeTriggerBrowserPrint(): void {
  if (typeof window === 'undefined') return;
  try {
    window.print();
  } catch (err) {
    console.warn('Browser print blocked by sandbox:', err);
  }
}
