// LANGUAGE UPGRADE: 3-Way Language Toggle (English | Hinglish | हिंदी)
export type Language = 'en' | 'hinglish' | 'hi';
export type ThemeMode = 'dark' | 'light';

// SARKARI ELIGIBILITY SCHEMA UPGRADE
export type SarkariEligibilityStatus =
  | '[✅ Eligible for UPSC/SSC/Bank PO]'
  | 'Eligible for UPSC/SSC/Bank PO'
  | string;

export interface SarkariEligibilityDetails {
  status: SarkariEligibilityStatus;
  badgeText: string;
  isEligible: boolean;
  eligibleExams: string[];
  recognitionBody: string;
  notesEn: string;
  notesHi: string;
}

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
  sarkariEligible?: boolean;
  sarkariEligibility?: SarkariEligibilityStatus;
  sarkariEligibilityDetails?: SarkariEligibilityDetails;
  authorityBadges?: string[];
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
  // RESEARCH UPGRADE: Formal Corporate Designation & Sarkari Eligibility
  formalDesignation?: string;
  formalDesignationHindi?: string;
  sarkariEligible?: boolean;
  sarkariEligibility?: SarkariEligibilityStatus;
  sarkariEligibilityDetails?: SarkariEligibilityDetails;
  authorityBadges?: string[];
  faqs: FaqItem[];
  exams: ExamCalendarItem[];
  learning: LearningResources;
  siblings: string[];
  lastVerified: string;
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
  sortBy: 'relevance' | 'salary-high' | 'roi-high' | 'min-percent-low' | 'alphabetical';
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
