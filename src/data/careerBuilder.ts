import { ChildCareer, ParentCareer, RoadmapStep, ExamCalendarItem, LearningResources, SarkariEligibilityStatus } from './types';

export interface QuickCareerSpec {
  id: string;
  parentId?: string;
  category: string;
  title: string;
  titleHindi: string;
  icon: string;
  demand: string;
  demandHindi: string;
  difficulty: string;
  difficultyHindi: string;
  duration: string;
  durationHindi: string;
  cost: string;
  costHindi: string;
  tags: string[];
  tagsHindi: string[];
  shortDesc: string;
  shortDescHindi: string;
  overview: string;
  overviewHindi: string;
  stream: string;
  minMarks: number;
  ageLimit: string;
  subjects: string[];
  subjectsHindi: string[];
  exams: { name: string; month: string; difficulty: string; url: string }[];
  salary: {
    entry: string;
    mid: string;
    senior: string;
    topCompanies: string[];
    growthNote: string;
    growthNoteHindi: string;
  };
  steps: {
    phase: string;
    phaseHindi: string;
    title: string;
    titleHindi: string;
    duration: string;
    durationHindi: string;
    desc: string;
    descHindi: string;
    tip: string;
    tipHindi: string;
  }[];
  saturation: string;
  saturationHindi: string;
  competitionRatio: string;
  alternativePaths: string[];
  alternativePathsHindi: string[];
  keyTruths: string[];
  keyTruthsHindi: string[];
  averageGrowth: string;
  sarkariEligibility?: SarkariEligibilityStatus;
  skillRadar?: {
    analytical: number;
    technical: number;
    creative: number;
    leadership: number;
    communication: number;
    execution: number;
  };
  topColleges?: {
    name: string;
    type: 'Govt / Premier' | 'Top State / Private';
    examRequired: string;
    estCutoff: string;
    totalFee: string;
    location: string;
    nirfRankTier?: string;
  }[];
}

function parseStreamsFromText(streamText: string): string[] {
  const s = streamText.toUpperCase();
  if (s.includes('ANY')) return ['PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'Vocational', 'Any'];
  const res: string[] = [];
  if (s.includes('PCM')) res.push('PCM', 'PCMB');
  if (s.includes('PCB')) res.push('PCB', 'PCMB');
  if (s.includes('COMMERCE')) res.push('Commerce');
  if (s.includes('ARTS')) res.push('Arts');
  return res.length > 0 ? res : ['PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'Any'];
}

export function buildChildCareer(spec: QuickCareerSpec): ChildCareer {
  const streams = parseStreamsFromText(spec.stream);
  const examNames = spec.exams.map((e) => e.name);

  const roadmap: RoadmapStep[] = spec.steps.map((s, idx) => ({
    id: `${spec.id}-step-${idx + 1}`,
    title: s.title,
    titleHindi: s.titleHindi,
    ageHint: s.phase,
    duration: s.duration,
    description: s.desc,
    descriptionHindi: s.descHindi,
    eligibility: {
      streams,
      minPercent: spec.minMarks,
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    },
    details: {
      what: s.desc,
      whatHindi: s.descHindi,
      why: spec.shortDesc,
      whyHindi: spec.shortDescHindi,
      how: s.tip,
      howHindi: s.tipHindi,
      exams: examNames,
      skills: spec.tags,
      salaryInr: {
        entry: spec.salary.entry,
        mid: spec.salary.mid,
        senior: spec.salary.senior,
      },
    },
  }));

  const exams: ExamCalendarItem[] = spec.exams.map((e) => ({
    name: e.name,
    registerFrom: e.month,
    registerTo: e.month,
    fees: '₹500 – ₹1,800',
    url: e.url,
  }));

  const learning: LearningResources = {
    pyqs: [
      { label: 'National Testing Agency (NTA) Past Question Papers', url: 'https://nta.ac.in/Downloads', type: 'official' },
    ],
    govtPlatforms: [
      { label: 'SWAYAM & NPTEL Free IIT/IIM Courses', url: 'https://swayam.gov.in', type: 'official' },
      { label: 'National Digital Library of India (NDLI)', url: 'https://ndl.iitkgp.ac.in', type: 'official' },
    ],
    youtube: [
      { label: 'NPTEL Official IIT Video Lectures', url: 'https://www.youtube.com/@iit', type: 'free' },
    ],
    notes: [
      { label: 'NCERT e-Pathshala & e-PG Pathshala Notes', url: 'https://epathshala.nic.in', type: 'official' },
    ],
    scholarships: [
      { label: 'National Scholarship Portal (NSP)', url: 'https://scholarships.gov.in', type: 'official' },
    ],
    internships: [
      { label: 'AICTE National Internship Portal', url: 'https://internship.aicte-india.org', type: 'official' },
    ],
    careerHelp: [
      { label: 'National Career Service (NCS India)', url: 'https://www.ncs.gov.in', type: 'official' },
    ],
    mentalHealth: [
      { label: 'Tele-MANAS (14416) — Free 24x7 Student Support', url: 'https://telemanas.mohfw.gov.in', type: 'official' },
    ],
  };

  return {
    id: spec.id,
    isParent: false,
    parentId: spec.parentId || null,
    category: spec.category,
    title: spec.title,
    titleHindi: spec.titleHindi,
    icon: spec.icon,
    audience: ['Class 10', 'Class 12', 'Graduation'],
    tagline: spec.shortDesc,
    taglineHindi: spec.shortDescHindi,
    shortDesc: spec.shortDesc,
    shortDescHindi: spec.shortDescHindi,
    demand: spec.demand,
    demandHindi: spec.demandHindi,
    difficulty: spec.difficulty,
    difficultyHindi: spec.difficultyHindi,
    duration: spec.duration,
    durationHindi: spec.durationHindi,
    cost: spec.cost,
    costHindi: spec.costHindi,
    overview: spec.overview,
    overviewHindi: spec.overviewHindi,
    sarkariEligible: true,
    sarkariEligibility: spec.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]',
    eligibility: {
      streams,
      minPercent: spec.minMarks,
      exams: examNames,
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    },
    roadmap,
    afterRoadmap: spec.alternativePaths.map((role, rIdx) => ({
      title: role,
      titleHindi: spec.alternativePathsHindi[rIdx] || role,
      description: spec.salary.growthNote,
      descriptionHindi: spec.salary.growthNoteHindi,
      salaryInr: spec.salary.mid,
    })),
    faqs: spec.keyTruths.map((truth, tIdx) => ({
      q: `Reality Check #${tIdx + 1}: What should students know before entering ${spec.title}?`,
      qHindi: `वास्तविकता #${tIdx + 1}: इस क्षेत्र में आने से पहले छात्रों को क्या जानना चाहिए?`,
      a: truth,
      aHindi: spec.keyTruthsHindi[tIdx] || truth,
    })),
    exams,
    learning,
    siblings: [],
    lastVerified: '2026-03-15',
    salaryInr: {
      entry: spec.salary.entry,
      mid: spec.salary.mid,
      senior: spec.salary.senior,
      top10: spec.salary.senior,
      disclaimer: spec.salary.growthNote,
    },
    demandLevel: spec.demand.toLowerCase().includes('explosive') || spec.demand.toLowerCase().includes('very')
      ? 'Very High'
      : 'High',
    averageGrowth: spec.averageGrowth,
    tags: spec.tags,
    skillRadar: spec.skillRadar,
    topColleges: spec.topColleges,
  };
}

export function buildParentCareer(spec: {
  id: string;
  category: string;
  title: string;
  titleHindi: string;
  icon: string;
  shortDesc: string;
  shortDescHindi: string;
  overview: string;
  overviewHindi: string;
  tags: string[];
  tagsHindi: string[];
  children: string[];
  sarkariEligibility?: SarkariEligibilityStatus;
}): ParentCareer {
  return {
    id: spec.id,
    isParent: true,
    category: spec.category,
    title: spec.title,
    titleHindi: spec.titleHindi,
    icon: spec.icon,
    audience: ['Class 10', 'Class 12', 'Graduation'],
    tagline: spec.shortDesc,
    taglineHindi: spec.shortDescHindi,
    overview: spec.overview,
    overviewHindi: spec.overviewHindi,
    children: spec.children,
    lastVerified: '2026-03-15',
    sarkariEligible: true,
    sarkariEligibility: spec.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]',
    authorityBadges: ['NIRF Verified', 'AICTE / UGC Approved', 'Govt Portal Verified'],
  };
}
