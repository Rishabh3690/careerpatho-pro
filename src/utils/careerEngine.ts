import {
  CareersDatabase,
  ChildCareer,
  Language,
  UserEligibilityProfile,
  AICareerMatchInput,
  AICareerMatchResult,
} from '../data/types';

// UPGRADE 2 (Bharat Optimization): 3-Way Language Helper (English | Hinglish | हिंदी)
// In Hinglish mode, technical terms stay in English while connectors are conversational Hindi in Roman script.
export function tr(lang: Language, en: string, hinglish: string, hi: string): string {
  if (lang === 'hi') return hi;
  if (lang === 'hinglish') return hinglish;
  return en;
}

function toConversationalHinglish(enText: string, field: string): string {
  if (!enText) return '';
  if (field === 'title' || field === 'label') {
    return enText;
  }
  if (field === 'tagline' || field === 'shortDesc') {
    return `${enText} — Iski fees, cutoff aur real in-hand salary dekhein.`;
  }
  if (field === 'overview') {
    return `${enText} Yeh career path India mein Government (UPSC/SSC/PSU) aur Top Corporate roles dono ke liye 100% eligible hai.`;
  }
  return enText;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function t(obj: any, field: string, lang: Language): string {
  if (!obj) return '';
  if (lang === 'hi') {
    const hindiKey = `${field}Hindi`;
    const val = obj[hindiKey];
    if (typeof val === 'string' && val.trim().length > 0) {
      return val;
    }
  }
  if (lang === 'hinglish') {
    const hinglishKey = `${field}Hinglish`;
    const val = obj[hinglishKey];
    if (typeof val === 'string' && val.trim().length > 0) {
      return val;
    }
    const baseEn = typeof obj[field] === 'string' ? obj[field] : '';
    return toConversationalHinglish(baseEn, field);
  }
  const defaultVal = obj[field];
  return typeof defaultVal === 'string' ? defaultVal : '';
}

// RESEARCH UPGRADE: Formal Corporate Designation Reframe
export function getFormalDesignation(career: ChildCareer, lang: Language): string {
  if (lang === 'hi' && career.formalDesignationHindi) {
    return career.formalDesignationHindi;
  }
  if (career.formalDesignation) {
    return career.formalDesignation;
  }
  const id = career.id.toLowerCase();
  if (id.includes('bca')) return 'BCA (Cloud & Full-Stack Software Engineer)';
  if (id.includes('b-des') || id.includes('bdes')) return 'B.Des (Product Systems Architect)';
  if (id.includes('btech-cse')) return 'B.Tech CSE (Distributed Systems & AI Architect)';
  return `${career.title} (Verified Corporate & Sarkari Track)`;
}

// RESEARCH UPGRADE: Drop Year Real Cost Calculator (Coaching + Living + Lost 1-Yr Salary)
export function calculateDropYearCost(
  coachingFeeLakhs: number = 1.5,
  expectedEntrySalaryLakhs: number = 6.0,
  livingAndMaterialsLakhs: number = 0.8
): {
  coachingFeeLakhs: number;
  lostSalaryLakhs: number;
  livingCostLakhs: number;
  totalLossLakhs: number;
  summaryEn: string;
  summaryHinglish: string;
  summaryHi: string;
} {
  const coaching = Math.max(0, Number(coachingFeeLakhs.toFixed(1)));
  const lostSal = Math.max(1, Number(expectedEntrySalaryLakhs.toFixed(1)));
  const living = Math.max(0, Number(livingAndMaterialsLakhs.toFixed(1)));
  const totalLoss = Number((coaching + lostSal + living).toFixed(1));

  return {
    coachingFeeLakhs: coaching,
    lostSalaryLakhs: lostSal,
    livingCostLakhs: living,
    totalLossLakhs: totalLoss,
    summaryEn: `Taking a 1-year drop costs ₹${coaching}L (Coaching) + ₹${living}L (Hostel/Tests) + ₹${lostSal}L (1 Year Lost Starting Salary) = ₹${totalLoss} Lakhs in real financial loss.`,
    summaryHinglish: `1-Year Drop lene ka asli kharcha: ₹${coaching}L (Coaching) + ₹${living}L (Hostel/Tests) + ₹${lostSal}L (1 Saal ki Lost Salary) = Total ₹${totalLoss} Lakhs ka सीधा नुकसान!`,
    summaryHi: `1 साल ड्रॉप (Drop Year) लेने का असली नुकसान: ₹${coaching} लाख (कोचिंग) + ₹${living} लाख (हॉस्टल/टेस्ट) + ₹${lostSal} लाख (1 साल की खोई हुई शुरुआती सैलरी) = कुल ₹${totalLoss} लाख का सीधा वित्तीय नुकसान!`,
  };
}

export function isHighDemand(demand?: string): boolean {
  if (!demand) return true;
  const d = demand.toLowerCase();
  return d.includes('high') || d.includes('explosive') || d.includes('उच्च') || d.includes('विस्फोटक');
}

export function computeCareerKPIs(career: ChildCareer): {
  demandLevel: 'Very High' | 'High' | 'Steady';
  averageGrowthYoY: string;
  aiResilienceScore: number;
} {
  const demandLevel: 'Very High' | 'High' | 'Steady' =
    career.demandLevel === 'Very High' || career.demandLevel === 'High'
      ? career.demandLevel
      : 'Very High';

  const averageGrowthYoY =
    career.averageGrowth ||
    (career.category === 'engineering' || career.category === 'science'
      ? '+32% YoY'
      : career.category === 'medical'
      ? '+26% YoY'
      : '+22% YoY');

  const aiResilienceScore =
    career.category === 'medical' || career.category === 'defense' || career.category === 'government'
      ? 95
      : career.category === 'engineering' || career.category === 'science' || career.category === 'law'
      ? 89
      : 84;

  return { demandLevel, averageGrowthYoY, aiResilienceScore };
}

export function fmtDate(iso: string | undefined): string {
  if (!iso) return '';
  try {
    const parts = String(iso).split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const yr = parts[0];
      const mo = months[parseInt(parts[1], 10) - 1] || parts[1];
      const da = parseInt(parts[2], 10);
      return `${da} ${mo} ${yr}`;
    }
  } catch {
    // fallback
  }
  return iso;
}

export function filterEligibleSteps(
  childCareer: ChildCareer | null | undefined,
  eligibility: UserEligibilityProfile | null | undefined
): number[] {
  if (!childCareer || !childCareer.roadmap) return [];
  if (!eligibility) {
    return childCareer.roadmap.map((_, i) => i);
  }

  const validIndexes: number[] = [];
  const stream = eligibility.stream;
  const percentBucket = eligibility.percent;
  const cat = eligibility.category;

  let lowerPercent = 0;
  if (percentBucket === 'Below 50') lowerPercent = 0;
  else if (percentBucket === '50-60') lowerPercent = 50;
  else if (percentBucket === '60-75') lowerPercent = 60;
  else if (percentBucket === '75-90') lowerPercent = 75;
  else if (percentBucket === 'Above 90') lowerPercent = 90;

  childCareer.roadmap.forEach((step, index) => {
    let pass = true;
    const elig = step.eligibility;
    if (elig) {
      if (stream && Array.isArray(elig.streams) && elig.streams.length > 0) {
        if (!elig.streams.includes(stream)) pass = false;
      }
      if (elig.minPercent && lowerPercent < elig.minPercent) {
        pass = false;
      }
      if (cat && Array.isArray(elig.categories) && elig.categories.length > 0) {
        if (!elig.categories.includes(cat)) pass = false;
      }
    }
    if (pass) {
      validIndexes.push(index);
    }
  });

  return validIndexes;
}

export function calculateLoanEMI(principal: number, annualInterestRate: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualInterestRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}

// UPGRADE 2 (Fuzzy Search Scoring Algorithm):
// Normalizes dots, hyphens, and spaces (so "B.tech", "btech", "B.Tech CSE" match seamlessly)
// and scores: Exact match (100) > Starts with (85) > All tokens match (70) > Includes (55) > Fuzzy subsequence (35).
export function normalizeSearchToken(str: string): string {
  return String(str || '')
    .toLowerCase()
    .replace(/[.\-_/(),&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function compactSearchToken(str: string): string {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F]/g, '');
}

export function scoreFuzzyTextMatch(query: string, candidateFields: string[]): number {
  const qNorm = normalizeSearchToken(query);
  const qCompact = compactSearchToken(query);
  if (!qCompact) return 0;

  const qTokens = qNorm.split(' ').filter(Boolean);
  let bestScore = 0;

  for (const rawField of candidateFields) {
    if (!rawField) continue;
    const fNorm = normalizeSearchToken(rawField);
    const fCompact = compactSearchToken(rawField);
    if (!fCompact) continue;

    // 1. Exact Match
    if (fCompact === qCompact || fNorm === qNorm) {
      bestScore = Math.max(bestScore, 100);
      continue;
    }

    // 2. Starts With Match (e.g. "b.tech" or "btech" matching "B.Tech Computer Science...")
    if (fCompact.startsWith(qCompact) || fNorm.startsWith(qNorm)) {
      bestScore = Math.max(bestScore, 85);
      continue;
    }

    // 3. Multi-token match (e.g. "b.tech cse" -> both "btech" and "cse" appear in candidate)
    if (qTokens.length > 1) {
      const allTokensFound = qTokens.every((tok) => {
        const tokCompact = compactSearchToken(tok);
        return tokCompact && (fCompact.includes(tokCompact) || fNorm.includes(tok));
      });
      if (allTokensFound) {
        bestScore = Math.max(bestScore, 75);
        continue;
      }
    }

    // 4. Includes Match
    if (fCompact.includes(qCompact) || fNorm.includes(qNorm)) {
      bestScore = Math.max(bestScore, 55);
      continue;
    }
  }

  // 5. Cross-field token match (e.g. "btech" in title + "cse" in id)
  if (bestScore < 70 && qTokens.length > 1) {
    const joinedCompact = candidateFields.map(compactSearchToken).join(' ');
    const allAcrossFields = qTokens.every((tok) => {
      const tc = compactSearchToken(tok);
      return tc && joinedCompact.includes(tc);
    });
    if (allAcrossFields) {
      bestScore = Math.max(bestScore, 72);
    }
  }

  return bestScore;
}

export function scoreCareerFuzzyMatch(career: ChildCareer, query: string): number {
  const fields: string[] = [
    career.id,
    career.title,
    career.titleHindi,
    career.formalDesignation || '',
    career.tagline,
    career.taglineHindi,
    ...(career.tags || []),
    ...(career.eligibility?.exams || []),
  ];
  return scoreFuzzyTextMatch(query, fields);
}

export function searchCareers(
  data: CareersDatabase,
  query: string,
  lang: Language
): Array<{
  type: 'Career' | 'Category';
  typeLabel: string;
  id: string;
  title: string;
  icon: string;
  url: string;
  tagline?: string;
  score: number;
}> {
  const q = String(query).trim();
  if (q.length < 2) return [];

  const results: Array<{
    type: 'Career' | 'Category';
    typeLabel: string;
    id: string;
    title: string;
    icon: string;
    url: string;
    tagline?: string;
    score: number;
  }> = [];

  // Search children with fuzzy scoring
  if (data.children) {
    Object.values(data.children).forEach((ch) => {
      const score = scoreCareerFuzzyMatch(ch, q);
      if (score > 0) {
        results.push({
          type: 'Career',
          typeLabel: lang === 'hi' ? 'करियर' : 'Career',
          id: ch.id,
          title: getFormalDesignation(ch, lang),
          icon: ch.icon || '🎯',
          url: `#/career/${ch.id}`,
          tagline: t(ch, 'tagline', lang),
          score,
        });
      }
    });
  }

  // Search parents
  if (data.parents) {
    Object.values(data.parents).forEach((p) => {
      const score = scoreFuzzyTextMatch(q, [p.id, p.title, p.titleHindi, p.tagline]);
      if (score > 0) {
        results.push({
          type: 'Career',
          typeLabel: lang === 'hi' ? 'मुख्य ट्रैक' : 'Career Hub',
          id: p.id,
          title: t(p, 'title', lang),
          icon: p.icon || '🏛️',
          url: `#/career/${p.id}`,
          tagline: t(p, 'tagline', lang),
          score: score - 2,
        });
      }
    });
  }

  // Search categories
  if (data.categories) {
    data.categories.forEach((cat) => {
      const score = scoreFuzzyTextMatch(q, [cat.id, cat.label, cat.labelHindi]);
      if (score > 0) {
        results.push({
          type: 'Category',
          typeLabel: lang === 'hi' ? 'श्रेणी' : 'Category',
          id: cat.id,
          title: t(cat, 'label', lang),
          icon: '📂',
          url: `#/category/${cat.id}`,
          score: score - 5,
        });
      }
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

// 100% Free, zero-cost deterministic Smart Career Matcher & ROI Optimizer
export function runSmartCareerMatcher(
  data: CareersDatabase,
  input: AICareerMatchInput
): AICareerMatchResult[] {
  const allChildren = Object.values(data.children || {});
  const results: AICareerMatchResult[] = [];

  const stream = input.stream;
  const talents = input.talents;
  const budget = input.budgetMaxLakhs || 10;
  const style = input.workStyle;

  allChildren.forEach((child) => {
    let score = 55;
    const reasonsEn: string[] = [];
    const reasonsHi: string[] = [];

    const id = child.id.toLowerCase();
    const cat = child.category;

    if (talents.includes('coding')) {
      if (cat === 'engineering' || id.includes('cse') || id.includes('ai') || id.includes('software')) {
        score += 25;
        reasonsEn.push('High alignment with your computational and coding interest');
        reasonsHi.push('आपकी कोडिंग और टेक्नोलॉजी रुचि के साथ सीधा मेल');
      }
    }
    if (talents.includes('healthcare')) {
      if (cat === 'medical' || id.includes('mbbs') || id.includes('pharma') || id.includes('nursing')) {
        score += 25;
        reasonsEn.push('Direct match with your healthcare and patient service strength');
        reasonsHi.push('स्वास्थ्य सेवा और मेडिकल साइंस में आपकी रुचि के अनुकूल');
      }
    }
    if (talents.includes('finance')) {
      if (cat === 'commerce' || id.includes('ca') || id.includes('finance') || id.includes('mba')) {
        score += 25;
        reasonsEn.push('Strong match for financial modeling and business acumen');
        reasonsHi.push('फाइनेंस, बिजनेस और कॉमर्स में आपकी पकड़ के अनुकूल');
      }
    }
    if (talents.includes('law-governance')) {
      if (cat === 'law' || cat === 'government' || id.includes('ias') || id.includes('law')) {
        score += 25;
        reasonsEn.push('Aligns with public administration and constitutional advocacy');
        reasonsHi.push('लोक प्रशासन, कानून और सरकारी नेतृत्व के अनुकूल');
      }
    }
    if (talents.includes('design')) {
      if (cat === 'design' || id.includes('des') || id.includes('ux')) {
        score += 25;
        reasonsEn.push('Strong match for visual creativity and human-centered design');
        reasonsHi.push('आपकी क्रिएटिव और UI/UX डिजाइन क्षमता के अनुकूल');
      }
    }
    if (talents.includes('aviation')) {
      if (id.includes('pilot') || id.includes('navy') || id.includes('defense')) {
        score += 25;
        reasonsEn.push('Fits your interest in aviation, navigation, and defense');
        reasonsHi.push('एविएशन, मर्चेंट नेवी और रक्षा सेवा में रुचि के अनुकूल');
      }
    }

    const eligStreams = child.eligibility?.streams || [];
    if (eligStreams.length > 0) {
      if (eligStreams.includes(stream) || eligStreams.includes('Any')) {
        score += 15;
      } else {
        score -= 20;
      }
    }

    if (style === 'public-service' && (child.category === 'government' || child.category === 'law')) {
      score += 12;
      reasonsEn.push('Offers authoritative public service and job security');
      reasonsHi.push('उच्च सरकारी पद और स्थायी नौकरी की सुरक्षा');
    } else if (style === 'corporate' && (child.category === 'engineering' || child.category === 'commerce')) {
      score += 12;
      reasonsEn.push('High-growth corporate trajectory and fast promotion cycles');
      reasonsHi.push('तेज़ कॉर्पोरेट ग्रोथ और उच्च शुरुआती पैकेज');
    } else if (style === 'creative-remote' && child.category === 'design') {
      score += 12;
      reasonsEn.push('High remote-work flexibility and freelance potential');
      reasonsHi.push('रिमोट वर्क और ग्लोबल फ्रीलांसिंग की सुविधा');
    }

    const courseFee = child.avgCourseFeeLakhs || 4;
    const startingSalary = child.entrySalaryLakhs || 6;
    const roiScore = Math.min(10, Math.max(1, Math.round((startingSalary / Math.max(courseFee, 1)) * 4.5)));

    if (budget < courseFee) {
      score -= 10;
      reasonsEn.push(`Course budget (₹${courseFee}L) may require PM-Vidyalaxmi education loan`);
      reasonsHi.push(`फीस (₹${courseFee}L) के लिए पीएम-विद्यालक्ष्मी एजुकेशन लोन उपयोगी रहेगा`);
    } else {
      score += 8;
      reasonsEn.push(`Fits comfortably within your specified budget (₹${courseFee}L est.)`);
      reasonsHi.push(`आपके निर्धारित बजट (₹${courseFee}L) के भीतर उत्कृष्ट विकल्प`);
    }

    if (child.demandLevel === 'Very High') {
      score += 5;
    }

    const paybackMonths = Math.max(2, Math.round((courseFee / startingSalary) * 12));
    const finalScore = Math.min(99, Math.max(45, score));

    const eligibleSteps = filterEligibleSteps(child, {
      stream,
      percent: input.boardPercentBucket || '60-75',
      category: 'General',
      state: 'Delhi',
    });

    results.push({
      career: child,
      matchScore: finalScore,
      roiScore,
      paybackMonths,
      matchReasons: reasonsEn.length > 0 ? reasonsEn.slice(0, 3) : ['Strong foundational alignment with your academic profile'],
      matchReasonsHindi: reasonsHi.length > 0 ? reasonsHi.slice(0, 3) : ['आपकी शैक्षणिक प्रोफ़ाइल के साथ मजबूत मेल'],
      eligibleStepsCount: eligibleSteps.length,
      totalStepsCount: child.roadmap?.length || 0,
    });
  });

  return results.sort((a, b) => b.matchScore - a.matchScore || b.roiScore - a.roiScore);
}

export interface SalaryGrowthPoint {
  stage: string;
  stageHi: string;
  years: string;
  yearsHi: string;
  conservativeLpa: number;
  medianLpa: number;
  topTierLpa: number;
  monthlyInHandInr: number;
}

export function computeSalaryTrajectory(career: ChildCareer): {
  points: SalaryGrowthPoint[];
  fiveYearCagrPercent: number;
  tenYearMultiple: number;
  entryMedianLpa: number;
  peakTopTierLpa: number;
} {
  const parseNums = (str: string | undefined, fallback: number): number[] => {
    if (!str) return [fallback];
    const matches = str.match(/\d+(?:\.\d+)?/g);
    if (!matches || matches.length === 0) return [fallback];
    const nums = matches.map(Number).filter((n) => !Number.isNaN(n) && n > 0 && n < 500);
    return nums.length > 0 ? nums : [fallback];
  };

  const entryNums = parseNums(career.salaryInr?.entry, career.entrySalaryLakhs || 7);
  const midNums = parseNums(career.salaryInr?.mid, career.midSalaryLakhs || 18);
  const seniorNums = parseNums(career.salaryInr?.senior, 38);

  const entryBase = career.entrySalaryLakhs || (entryNums.length > 1 ? (entryNums[0] + entryNums[1]) / 2 : entryNums[0]);
  const midBase = career.midSalaryLakhs || (midNums.length > 1 ? (midNums[0] + midNums[1]) / 2 : Math.max(entryBase * 2.1, midNums[0]));
  const seniorBase = seniorNums.length > 1 ? (seniorNums[0] + seniorNums[1]) / 2 : Math.max(midBase * 1.9, seniorNums[0]);

  const growthMatch = (career.averageGrowth || '+24%').match(/(\d+)/);
  const rawGrowthRate = growthMatch ? Math.min(48, Math.max(12, parseInt(growthMatch[1], 10))) : 24;
  const growthMultiplier = 1 + (rawGrowthRate - 20) * 0.008;

  const round1 = (n: number) => Math.round(n * 10) / 10;

  const calcMonthlyInHand = (lpa: number): number => {
    const grossAnnual = lpa * 100000;
    const effectiveRatio = lpa <= 7 ? 0.88 : lpa <= 15 ? 0.81 : lpa <= 30 ? 0.74 : 0.68;
    return Math.round((grossAnnual * effectiveRatio) / 12);
  };

  const y0Median = round1(Math.max(3.5, entryBase));
  const y2Median = round1(y0Median * 1.42 * growthMultiplier);
  const y5Median = round1(Math.max(y2Median * 1.38, midBase));
  const y8Median = round1(Math.max(y5Median * 1.55, seniorBase * 0.88));
  const y12Median = round1(Math.max(y8Median * 1.48, seniorBase * 1.25));

  const stages: Array<{
    stage: string;
    stageHi: string;
    years: string;
    yearsHi: string;
    med: number;
  }> = [
    { stage: 'Entry', stageHi: 'शुरुआती', years: '0–1 Yr', yearsHi: '0–1 वर्ष', med: y0Median },
    { stage: 'Junior', stageHi: 'जूनियर', years: '2–3 Yrs', yearsHi: '2–3 वर्ष', med: y2Median },
    { stage: 'Mid-Level', stageHi: 'मिड-लेवल', years: '4–6 Yrs', yearsHi: '4–6 वर्ष', med: y5Median },
    { stage: 'Senior', stageHi: 'सीनियर', years: '7–10 Yrs', yearsHi: '7–10 वर्ष', med: y8Median },
    { stage: 'Principal / Apex', stageHi: 'शीर्ष स्तर', years: '12+ Yrs', yearsHi: '12+ वर्ष', med: y12Median },
  ];

  const points: SalaryGrowthPoint[] = stages.map((st, idx) => {
    const conservativeLpa = round1(st.med * (idx === 0 ? 0.72 : 0.68));
    const medianLpa = st.med;
    const topTierLpa = round1(st.med * (1.45 + idx * 0.12));
    return {
      stage: st.stage,
      stageHi: st.stageHi,
      years: st.years,
      yearsHi: st.yearsHi,
      conservativeLpa,
      medianLpa,
      topTierLpa,
      monthlyInHandInr: calcMonthlyInHand(medianLpa),
    };
  });

  const tenYearMultiple = round1(points[4].medianLpa / Math.max(1, points[0].medianLpa));

  return {
    points,
    fiveYearCagrPercent: rawGrowthRate,
    tenYearMultiple,
    entryMedianLpa: points[0].medianLpa,
    peakTopTierLpa: points[4].topTierLpa,
  };
}

export function parseNaturalCareerQuery(query: string): Partial<AICareerMatchInput> & { detectedKeywords: string[] } {
  const q = query.toLowerCase();
  const talents = new Set<string>();
  const detectedKeywords: string[] = [];

  if (/(code|coding|software|ai|computer|math|data|tech|game|hacker|cyber|chip|vlsi|robotics|कोडिंग|कंप्यूटर)/.test(q)) {
    talents.add('coding');
    detectedKeywords.push('Technology & Computing');
  }
  if (/(doctor|medical|mbbs|biology|hospital|patient|nurse|pharma|health|dentist|vet|डॉक्टर|मेडिकल)/.test(q)) {
    talents.add('healthcare');
    detectedKeywords.push('Healthcare & Life Sciences');
  }
  if (/(money|finance|business|ca|mba|stock|bank|commerce|startup|invest|cfo|बिजनेस|फाइनेंस)/.test(q)) {
    talents.add('finance');
    detectedKeywords.push('Finance & Business');
  }
  if (/(ias|upsc|govt|government|law|judge|advocate|police|ips|ssc|civil|policy|सरकारी|वकील)/.test(q)) {
    talents.add('law-governance');
    detectedKeywords.push('Public Service & Law');
  }
  if (/(design|ui|ux|art|creative|animation|architecture|film|media|fashion|डिजाइन)/.test(q)) {
    talents.add('design');
    detectedKeywords.push('Design & Creative');
  }
  if (/(pilot|flying|aviation|army|navy|airforce|nda|defense|ship|पायलट|सेना)/.test(q)) {
    talents.add('aviation');
    detectedKeywords.push('Aviation & Defense');
  }

  let stream: string | undefined;
  if (/\b(pcm|non-medical|jee|maths)\b/.test(q)) stream = 'PCM';
  else if (/\b(pcb|medical|neet|biology)\b/.test(q)) stream = 'PCB';
  else if (/\b(commerce|ca|accounts|bcom)\b/.test(q)) stream = 'Commerce';
  else if (/\b(arts|humanities|ba|history|upsc)\b/.test(q)) stream = 'Arts';

  let budgetMaxLakhs: number | undefined;
  if (/(low fee|low budget|free|poor|cheap|no money|scholarship|govt college|कम फीस)/.test(q)) {
    budgetMaxLakhs = 3;
    detectedKeywords.push('Low-Budget / High-ROI Priority');
  } else if (/(medium budget|under 8|under 10)/.test(q)) {
    budgetMaxLakhs = 8;
  }

  let workStyle: AICareerMatchInput['workStyle'] | undefined;
  if (/(remote|work from home|wfh|freelance|घर से)/.test(q)) {
    workStyle = 'creative-remote';
    detectedKeywords.push('Remote Flexibility');
  } else if (/(govt|government|security|stable|सरकारी)/.test(q)) {
    workStyle = 'public-service';
    detectedKeywords.push('Public Sector Stability');
  } else if (/(high salary|package|corporate|mnc|crore|ज्यादा सैलरी)/.test(q)) {
    workStyle = 'corporate';
    detectedKeywords.push('High Corporate Compensation');
  }

  return {
    talents: talents.size > 0 ? Array.from(talents) : undefined,
    stream,
    budgetMaxLakhs,
    workStyle,
    detectedKeywords,
  };
}

export function generateOfflineMentorResponse(
  career: ChildCareer,
  question: string,
  lang: Language
): string {
  const isHi = lang === 'hi';
  const q = question.toLowerCase();
  const traj = computeSalaryTrajectory(career);
  const title = t(career, 'title', lang);
  const fee = career.avgCourseFeeLakhs || 4;
  const exams = (career.eligibility?.exams || []).join(', ') || 'Merit / National Entrance';

  if (/(salary|in-hand|package|earn|money|ctc|tax|सैलरी|पैकेज)/.test(q)) {
    return isHi
      ? `${title} — वेतन और असली इन-हैंड विश्लेषण:\n• शुरुआती औसत CTC: ₹${traj.points[0].medianLpa} LPA (असली मासिक इन-हैंड: ~₹${traj.points[0].monthlyInHandInr.toLocaleString('en-IN')}/माह)\n• मिड-करियर (4–6 वर्ष): ₹${traj.points[2].medianLpa} LPA\n• सीनियर स्तर (10+ वर्ष): ₹${traj.points[4].medianLpa}–₹${traj.points[4].topTierLpa} LPA\n• कुल फीस (₹${fee}L) की रिकवरी: नौकरी लगने के लगभग ${Math.max(2, Math.round((fee / traj.points[0].medianLpa) * 12))} महीनों में।`
      : `${title} Compensation & In-Hand Breakdown:\n• Entry Median CTC: ₹${traj.points[0].medianLpa} LPA (~₹${traj.points[0].monthlyInHandInr.toLocaleString('en-IN')}/month net in-hand after PF & tax)\n• Mid-Career (4–6 Yrs): ₹${traj.points[2].medianLpa} LPA\n• Senior / Apex (12+ Yrs): ₹${traj.points[4].medianLpa}L–₹${traj.points[4].topTierLpa} LPA\n• Tuition Payback Window: ~${Math.max(2, Math.round((fee / traj.points[0].medianLpa) * 12))} months on average course cost of ₹${fee} Lakhs.`;
  }

  if (/(exam|cutoff|prepare|syllabus|pyq|coaching|self study|परीक्षा|तैयारी)/.test(q)) {
    return isHi
      ? `${title} प्रवेश परीक्षा रणनीति (${exams}):\n1. पिछले 10 वर्षों के आधिकारिक प्रश्नपत्र (PYQs - NTA/UPSC) को टाइमर के साथ हल करें।\n2. महंगी कोचिंग से पहले NCERT और मुफ्त सरकारी SWAYAM/NPTEL लेक्चर पूरा करें।\n3. हर मॉक टेस्ट के बाद 'Error Notebook' बनाएं।`
      : `${title} Entrance & Preparation Blueprint (${exams}):\n1. Master NCERT fundamentals + solve 10 years of official PYQs under timed conditions.\n2. Use free NPTEL/SWAYAM lectures before spending lakhs on private coaching.\n3. Maintain an Error Logbook for mock tests—improving accuracy by 15% typically jumps 1–2 college tiers.`;
  }

  if (/(scholarship|loan|fee|money|poor|budget|vidyalaxmi|pragati|छात्रवृत्ति|लोन)/.test(q)) {
    return isHi
      ? `${title} — सरकारी छात्रवृत्ति और बिना गारंटी लोन:\n• PM-Vidyalaxmi योजना: ₹7.5L तक 75% सरकारी गारंटी और 3% ब्याज सब्सिडी।\n• CSIS योजना: ₹4.5 लाख से कम पारिवारिक आय पर पढ़ाई के दौरान 100% ब्याज माफ।\n• AICTE प्रगति छात्रवृत्ति: बेटियों के लिए ₹50,000 प्रति वर्ष।`
      : `${title} — Govt Scholarships & Collateral-Free Loan Blueprint:\n• PM-Vidyalaxmi Scheme (pmvidyalaxmi.co.in): 100% collateral-free & guarantor-free loan with 75% Govt credit guarantee up to ₹7.5L and 3% interest subvention up to ₹10L (<₹8L family income).\n• CSIS 100% Interest Subsidy: Full interest waiver during college + 1 yr moratorium for family income under ₹4.5 LPA.\n• AICTE Pragati & NSP: ₹50,000/yr for girl students in technical degrees + Central Sector scholarship via scholarships.gov.in.`;
  }

  if (/(tier 3|private college|low rank|safety net|multi-track|टियर)/.test(q)) {
    return isHi
      ? `${title} के लिए मल्टी-ट्रैक करियर इंश्योरेंस (Strategic Safety Net):\n• कॉलेज के पहले वर्ष से ही प्रैक्टिकल प्रोजेक्ट्स और AICTE पोर्टल के माध्यम से इंटर्नशिप करें।\n• ऑफ-कैंपस हायरिंग या GATE/CAT/PG परीक्षा को लक्ष्य बनाएं। 3 साल के अनुभव के बाद आपका काम कॉलेज के नाम से ज्यादा मायने रखता है।`
      : `Multi-Track Career Insurance (Strategic Safety Net) for ${title}:\n• Build verifiable proof-of-work early: complete 3 real-world projects or internships via the AICTE portal by Year 3.\n• Target off-campus hiring, national hackathons/moots, or GATE/PG entrance for a Tier-1 finish. Within 3 years of work experience, demonstrable execution outweighs college branding.`;
  }

  return isHi
    ? `${title} — मुख्य सारांश:\n• पात्र स्ट्रीम: ${(career.eligibility?.streams || ['Any']).join(', ')} (न्यूनतम ${career.eligibility?.minPercent || 50}%)\n• मुख्य परीक्षाएं: ${exams}\n• 5-वर्षीय ग्रोथ: ${career.averageGrowth || '+24%'}\n• अगला कदम: रोडमैप के चरण 1 से शुरुआत करें और 'PYQs' व 'Govt Portals' टैब से मुफ्त अध्ययन सामग्री देखें।`
    : `Strategic Summary for ${title}:\n• Eligible Streams: ${(career.eligibility?.streams || ['Any']).join(', ')} (Min ${career.eligibility?.minPercent || 50}% in Boards)\n• Key Gateway Exams: ${exams}\n• 5-Year Sector Growth: ${career.averageGrowth || '+24%'}\n• Actionable Next Step: Start with Step 1 of the Execution Roadmap and practice official past papers from the PYQs tab.`;
}

export function loadPreference<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const val = localStorage.getItem(key);
    if (val === null) return defaultVal;
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as unknown as T;
    }
  } catch {
    return defaultVal;
  }
}

export function savePreference<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  } catch (err) {
    console.warn(`Storage write failed for key ${key}:`, err);
  }
}
