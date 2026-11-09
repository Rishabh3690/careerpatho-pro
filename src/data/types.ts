// LANGUAGE UPGRADE: 7 Indian Languages (English, Hindi + 5 Regional: Tamil, Telugu, Bengali, Marathi, Gujarati; Hinglish removed)
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu';
export type ThemeMode = 'dark' | 'light';

export interface CategoryItem {
  id: string;
  label: string;
  labelHindi: string;
  labelHinglish?: string;
  description?: string;
  descriptionHindi?: string;
}

export interface ComingSoonItem {
  id: string;
  title: string;
  titleHindi: string;
  titleHinglish?: string;
  icon: string;
  category: string;
}

export interface SalaryBand {
  entry: string;
  mid: string;
  senior: string;
  top10?: string;
  disclaimer?: string;
}

export interface PlanBLink {
  careerId: string;
  reason: string;
  reasonHindi: string;
}

export interface StepEligibility {
  streams: string[];
  minPercent: number;
  categories: string[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  titleHindi?: string;
  ageHint: string;
  duration: string;
  description: string;
  descriptionHindi?: string;
  eligibility?: StepEligibility;
  details: {
    what: string;
    whatHindi?: string;
    why: string;
    whyHindi?: string;
    how: string;
    howHindi?: string;
    exams: string[];
    skills: string[];
    salaryInr?: SalaryBand;
    costInr?: string;
    costInrHindi?: string;
  };
  planB?: PlanBLink[];
}

export interface AfterRoadmapRole {
  title: string;
  titleHindi?: string;
  description: string;
  descriptionHindi?: string;
  salaryInr: string;
}

// UPGRADE 2 & 5 ("JobPathO" Feature): Day in the Life & Job Roles schema
export interface JobRoleItem {
  title: string;
  titleHindi?: string;
  titleHinglish?: string;
  sectorTag?: string;
  sectorTagHindi?: string;
  description: string;
  descriptionHindi?: string;
  descriptionHinglish?: string;
  dailyTasks?: string[];
  salaryRange: string;
  requiredSkills: string[];
}

export interface FaqItem {
  q: string;
  qHindi?: string;
  a: string;
  aHindi?: string;
}

export interface ExamCalendarItem {
  name: string;
  registerFrom: string;
  registerTo: string;
  fees: string;
  url: string;
}

export interface LearningLink {
  label: string;
  url: string;
  type: 'official' | 'free' | 'paid';
}

export interface LearningResources {
  pyqs: LearningLink[];
  govtPlatforms: LearningLink[];
  youtube: LearningLink[];
  notes: LearningLink[];
  scholarships: LearningLink[];
  internships: LearningLink[];
  careerHelp: LearningLink[];
  mentalHealth: LearningLink[];
  aiDoubt?: {
    status: string;
    premium: boolean;
  };
}

export interface ParentCareer {
  id: string;
  isParent: true;
  title: string;
  titleHindi: string;
  icon: string;
  category: string;
  audience: string[];
  tagline: string;
  taglineHindi: string;
  overview: string;
  overviewHindi: string;
  children: string[];
  lastVerified: string;
}

export interface ChildCareer {
  id: string;
  isParent: false;
  parentId: string | null;
  title: string;
  titleHindi: string;
  icon: string;
  category: string;
  audience: string[];
  tagline: string;
  taglineHindi: string;
  shortDesc?: string;
  shortDescHindi?: string;
  demand?: string;
  demandHindi?: string;
  difficulty?: string;
  difficultyHindi?: string;
  duration?: string;
  durationHindi?: string;
  cost?: string;
  costHindi?: string;
  overview: string;
  overviewHindi: string;
  eligibility: {
    streams: string[];
    minPercent: number;
    exams: string[];
    categories: string[];
  };
  roadmap: RoadmapStep[];
  afterRoadmap: AfterRoadmapRole[];
  // UPGRADE 2 & 5: Day in the Life & Job Roles array
  jobRoles?: JobRoleItem[];
  // DATA SAFETY UPGRADE: Official verification status for all 250 careers
  dataVerified?: boolean;
  sourceCitation?: string;
  directoryCategory?:
    | 'Engineering & Tech'
    | 'Medical & Health'
    | 'Commerce & Business'
    | 'Arts & Design'
    | 'Law & Government'
    | 'Vocational & Trades'
    | 'Sports & Fitness'
    | 'Media & Entertainment'
    | 'Agriculture & Environment';
  formalDesignation?: string;
  formalDesignationHindi?: string;
  sarkariEligible?: boolean;
  sarkariEligibility?: string;
  authorityBadges?: string[];
  faqs: FaqItem[];
  exams: ExamCalendarItem[];
  learning: LearningResources;
  siblings: string[];
  lastVerified: string;
  nov11Update?: string;
  nov11UpdateHindi?: string;
  salaryInr?: SalaryBand;
  entrySalaryLakhs?: number;
  midSalaryLakhs?: number;
  avgCourseFeeLakhs?: number;
  demandLevel?: 'Very High' | 'High' | 'Steady';
  averageGrowth?: string;
  tags?: string[];
  prosAndCons?: {
    thriveIf: string[];
    reconsiderIf: string[];
    thriveIfHindi?: string[];
    reconsiderIfHindi?: string[];
  };
  workLifeBalance?: {
    weeklyHours: string;
    stressLevel: 'Moderate' | 'High' | 'Demanding' | 'Balanced';
    remoteFlexibility: 'High' | 'Hybrid' | 'On-Site';
    jobSecurityIndex: 'High' | 'Very High' | 'Moderate';
  };
  topColleges?: Array<{
    name: string;
    type: 'Govt / Premier' | 'Top State / Private';
    examRequired: string;
    estCutoff: string;
    totalFee: string;
    location: string;
    nirfRankTier?: string;
    officialUrl?: string;
    badges?: string[];
  }>;
  skillRadar?: {
    analytical: number;
    technical: number;
    creative: number;
    leadership: number;
    communication: number;
    execution: number;
  };
}

export type CareerSortOption = 'alphabetical' | 'salary-high' | 'newly-added';

export interface CareerListItem {
  id: string;
  title: string;
  titleHindi: string;
  oneLineDesc: string;
  oneLineDescHindi: string;
  duration: string;
  salaryRange: string;
  sourceTag: string;
  cost: string;
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
  rawCategory: string;
  streams: string[];
  dataVerified: boolean;
  icon: string;
  entrySalaryLakhs?: number;
  addedOrder?: number;
}

export interface CareersDatabase {
  categories: CategoryItem[];
  comingSoon: ComingSoonItem[];
  parents: Record<string, ParentCareer>;
  children: Record<string, ChildCareer>;
}

export interface UserEligibilityProfile {
  stream: string;
  percent: string;
  category: string;
  state: string;
}

export interface CareerSearchFilters {
  query: string;
  category: string;
  stream: string;
  audience: string;
  minSalaryLakhs: number;
  sortBy: 'relevance' | 'salary-high' | 'roi-high' | 'min-percent-low' | 'alphabetical' | 'newly-added';
  recentQueries?: string[];
}

export interface AICareerMatchInput {
  talents: string[];
  stream: string;
  boardPercentBucket: string;
  budgetMaxLakhs: number;
  workStyle: 'corporate' | 'public-service' | 'clinical-field' | 'creative-remote' | 'any';
}

export interface AICareerMatchResult {
  career: ChildCareer;
  matchScore: number; // 0 to 99
  roiScore: number; // 1 to 10
  paybackMonths: number;
  matchReasons: string[];
  matchReasonsHindi: string[];
  eligibleStepsCount: number;
  totalStepsCount: number;
}
