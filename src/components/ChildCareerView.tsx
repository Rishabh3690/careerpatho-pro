import React, { useState } from 'react';
import { ChildCareer, CareersDatabase, Language, UserEligibilityProfile, RoadmapStep } from '../data/types';
import { t, tr, fmtDate, filterEligibleSteps, getFormalDesignation } from '../utils/careerEngine';
import { EligibilityChecker } from './EligibilityChecker';
import { CareerSuitabilitySection } from './CareerSuitabilitySection';
import { CollegeFinderSection } from './CollegeFinderSection';
import { SkillRadarSection } from './SkillRadarSection';
import { SalaryGrowthChart } from './SalaryGrowthChart';
import { RoadmapTimeline } from './RoadmapTimeline';
import { RoadmapProgressTracker } from './RoadmapProgressTracker';
import { CareerAptitudeQuiz } from './CareerAptitudeQuiz';
import { RealityCheckCard } from './RealityCheckCard';
import { ExamCalendarSection } from './ExamCalendarSection';
import { DonationBox } from './DonationBox';
import { CareerSvgIcon } from './CareerSvgIcon';
import {
  generateHindiParentGuideData,
  buildHindiParentGuidePrintableHtml,
  buildCareerBlueprintPrintableHtml,
  buildCareerPathoQrSvg,
  downloadHtmlReportFile,
  safeTriggerBrowserPrint,
} from '../utils/pdfAndPrintEngine';
import {
  ArrowLeft,
  BookOpen,
  Star,
  Share2,
  FileText,
  Printer,
  ChevronDown,
  TrendingUp,
  Activity,
  X,
  Download,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  GitCompare,
  CheckCircle2,
} from 'lucide-react';

interface ChildCareerViewProps {
  career: ChildCareer;
  careersData: CareersDatabase;
  lang: Language;
  eligibilityProfile: UserEligibilityProfile;
  onChangeEligibility: (p: UserEligibilityProfile) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onNavigateCareer: (id: string) => void;
  onOpenLearning: () => void;
  onOpenDonationModal: () => void;
  onShowToast: (msg: string) => void;
}

export const ChildCareerView: React.FC<ChildCareerViewProps> = ({
  career,
  careersData,
  lang,
  eligibilityProfile,
  onChangeEligibility,
  isSaved,
  onToggleSave,
  onNavigateCareer,
  onOpenLearning,
  onOpenDonationModal,
  onShowToast,
}) => {
  const isHi = lang === 'hi';
  const title = t(career, 'title', lang);
  // RESEARCH UPGRADE: Formal Corporate Designation Reframe
  const formalDesignation = getFormalDesignation(career, lang);
  const tagline = t(career, 'tagline', lang) || t(career, 'shortDesc', lang);
  const overview = t(career, 'overview', lang);

  const parent = career.parentId ? careersData.parents[career.parentId] : null;
  const category = careersData.categories.find((c) => c.id === career.category);
  const catLabel = category ? t(category, 'label', lang) : career.category;

  const normalizedRoadmap: RoadmapStep[] = career.roadmap || [];

  const normalizedCareer: ChildCareer = {
    ...career,
    roadmap: normalizedRoadmap,
    salaryInr: career.salaryInr || {
      entry: career.entrySalaryLakhs ? `₹${career.entrySalaryLakhs} LPA` : '₹6–12 LPA',
      mid: career.midSalaryLakhs ? `₹${career.midSalaryLakhs} LPA` : '₹15–28 LPA',
      senior: '₹35–70+ LPA',
      disclaimer:
        lang === 'hi'
          ? 'अनुमानित आंकड़े — वास्तविक वेतन कॉलेज, शहर और कौशल के अनुसार भिन्न हो सकता है।'
          : 'Estimated compensation bands — actual figures depend on college tier, skills, and location.',
    },
  };

  const openIndexes = filterEligibleSteps(normalizedCareer, eligibilityProfile);
  const totalSteps = normalizedRoadmap.length;

  let backHash = '#/';
  if (parent) {
    backHash = `#/career/${parent.id}`;
  } else if (category) {
    backHash = `#/category/${category.id}`;
  }

  const [showParentBriefModal, setShowParentBriefModal] = useState(false);
  const [openRealityCardModal, setOpenRealityCardModal] = useState(false);
  const hindiParentGuide = generateHindiParentGuideData(normalizedCareer);

  const handleSendToParents = () => {
    setShowParentBriefModal(true);
  };

  const handleDownloadHindiParentPdf = () => {
    const html = buildHindiParentGuidePrintableHtml(normalizedCareer);
    const ok = downloadHtmlReportFile(`Mata-Pita-Guide-${career.id}-Hindi.html`, html);
    onShowToast(
      ok
        ? 'माता-पिता गाइड PDF/HTML फ़ाइल डाउनलोड हो गई है!'
        : 'माता-पिता गाइड तैयार है'
    );
  };

  const handlePrintCareerBlueprint = () => {
    const html = buildCareerBlueprintPrintableHtml(normalizedCareer, lang);
    downloadHtmlReportFile(`CareerPathO-Blueprint-${career.id}.html`, html);
    safeTriggerBrowserPrint();
    onShowToast(
      isHi
        ? 'करियर ब्लूप्रिंट डाउनलोड हो गया है और प्रिंट के लिए तैयार है!'
        : 'Printable Career Blueprint downloaded & ready to print!'
    );
  };

  const handleShareWhatsApp = () => {
    const shareText = `${formalDesignation} (${normalizedCareer.salaryInr?.entry || 'High Growth'}) — ${window.location.href}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(
        () => {
          onShowToast(
            isHi
              ? 'शेयर लिंक क्लिपबोर्ड पर कॉपी हो गया!'
              : 'Career blueprint link copied to clipboard!'
          );
        },
        () => {
          onShowToast(isHi ? 'शेयर लिंक तैयार है' : 'Share link ready');
        }
      );
    } else {
      onShowToast(isHi ? 'शेयर लिंक तैयार है' : 'Share link ready');
    }
  };

  // Sibling careers (either explicit or same category)
  const siblingIds =
    career.siblings && career.siblings.length > 0
      ? career.siblings
      : Object.values(careersData.children)
          .filter((c) => c.category === career.category && c.id !== career.id)
          .slice(0, 4)
          .map((c) => c.id);

  const siblingCareers = siblingIds.map((sId) => careersData.children[sId]).filter(Boolean);
  const defaultCompareTargetId = siblingCareers[0]?.id || (career.id === 'btech-cse' ? 'bca-software' : 'btech-cse');
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  const authorityBadges = career.authorityBadges && career.authorityBadges.length > 0
    ? career.authorityBadges
    : ['NIRF Verified', 'AICTE Approved', 'UGC Recognized'];

  const jobRoles = career.jobRoles || [];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* 1. Back button */}
      <a
        href={backHash}
        className="min-h-[48px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold mb-5 bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors no-print"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isHi ? 'वापस जाएं' : 'BACK TO DIRECTORY'}</span>
      </a>

      {/* 2. Breadcrumbs */}
      <nav className="flex items-center flex-wrap gap-2 text-xs font-mono text-[var(--text3)] mb-6 no-print">
        <a href="#/" className="hover:text-[var(--text)] hover:underline">
          {isHi ? 'होम' : 'Home'}
        </a>
        <span>/</span>
        {category && (
          <>
            <a href={`#/category/${category.id}`} className="hover:text-[var(--text)] hover:underline">
              {catLabel}
            </a>
            <span>/</span>
          </>
        )}
        {parent && (
          <>
            <a href={`#/career/${parent.id}`} className="hover:text-[var(--text)] hover:underline">
              {t(parent, 'title', lang)}
            </a>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--text)] font-bold truncate">{title}</span>
      </nav>

      {/* 3. Career Header in Monochrome Architectural Card */}
      <header className="mb-8 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shrink-0">
            <CareerSvgIcon id={career.id} category={career.category} className="w-7 h-7" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-bold">
              <Activity className="w-3.5 h-3.5" />
              {t(career, 'demand', lang) || (isHi ? 'उच्च मांग' : 'High Demand')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border2)] text-[var(--text)] text-xs font-mono font-bold tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              {career.averageGrowth || '+22% (5-Yr)'}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--text2)] text-xs font-mono">
              {catLabel}
            </span>
          </div>
        </div>

        {/* RESEARCH UPGRADE 1: Sarkari Eligibility Badge + Authority Badges */}
        <div
          data-testid="sarkari-authority-badges"
          className="flex flex-wrap items-center gap-2 mb-3"
        >
          <span
            data-testid="sarkari-eligibility-badge"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 border-[var(--text)] bg-[var(--bg)] text-xs font-mono font-extrabold text-[var(--text)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{career.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]'}</span>
          </span>
          {authorityBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text2)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--text)] shrink-0" />
              <span>[{badge}]</span>
            </span>
          ))}
        </div>

        {/* RESEARCH UPGRADE 1: Formal Corporate Designation Reframe */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-1.5 leading-tight">
          {formalDesignation}
        </h1>
        {formalDesignation !== title && (
          <div className="text-xs font-mono text-[var(--text3)] mb-2">
            {isHi ? 'आधिकारिक डिग्री नाम:' : 'Academic Degree Track:'} {title}
          </div>
        )}
        <p className="text-base text-[var(--text2)] leading-relaxed max-w-3xl">
          {tagline}
        </p>

        {/* Key Snapshot Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--border)]">
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {isHi ? 'शुरुआती पैकेज' : 'Entry Package'}
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text)] tabular-nums">
              {normalizedCareer.salaryInr?.entry}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {isHi ? 'अवधि' : 'Duration'}
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text)]">
              {t(career, 'duration', lang) || '3–4 Years'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {isHi ? 'अनुमानित फीस' : 'Est. Total Cost'}
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text)]">
              {t(career, 'cost', lang) || '₹50K – ₹8 Lakhs'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {isHi ? 'कठिनाई स्तर' : 'Difficulty'}
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text)]">
              {t(career, 'difficulty', lang) || 'Moderate to Hard'}
            </div>
          </div>
        </div>

        {/* Quick Top Action Bar (48px min height, 12px gap) */}
        <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSendToParents}
              className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>माता-पिता गाइड PDF (हिंदी)</span>
            </button>
            <button
              type="button"
              onClick={() => setOpenRealityCardModal(true)}
              data-testid="career-page-generate-reality-card-btn"
              className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-extrabold transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{tr(lang, 'Generate Reality Card', 'Generate Reality Card (CTC vs In-Hand)', 'Generate Reality Card (रियलिटी कार्ड बनाएं)')}</span>
            </button>
            <a
              href={`#/compare?c1=${encodeURIComponent(career.id)}&c2=${encodeURIComponent(defaultCompareTargetId)}`}
              className="min-h-[48px] inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              <span>{tr(lang, 'Compare Career', 'Compare Karein', 'तुलना करें')}</span>
            </a>
          </div>
          <button
            type="button"
            onClick={onOpenLearning}
            className="min-h-[48px] inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isHi ? 'मुफ्त अध्ययन सामग्री (PYQs व छात्रवृत्ति)' : 'Free PYQs, Scholarships & Prep'}</span>
          </button>
        </div>
      </header>

      {/* 4. Overview Box */}
      <div className="rounded-2xl border p-6 mb-6 text-base leading-relaxed bg-[var(--bg2)] border-[var(--border)] text-[var(--text)]">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--text3)] mb-2">
          {isHi ? 'विस्तृत विवरण' : 'EXECUTIVE OVERVIEW'}
        </div>
        {overview}
      </div>

      {/* 4B. Sarkari Eligibility Status Card (UPSC / SSC / Bank PO / PSU Verification) */}
      <div
        data-testid="sarkari-eligibility-status-card"
        className="rounded-2xl border-2 border-[var(--text)] p-5 mb-8 bg-[var(--bg2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold">
              {career.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]'}
            </span>
            <span className="text-xs font-mono text-[var(--text2)]">
              • {career.sarkariEligibilityDetails?.recognitionBody || 'UGC / AICTE / Govt Recognized'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
            {isHi
              ? career.sarkariEligibilityDetails?.notesHi ||
                'यह डिग्री UPSC सिविल सेवा (IAS/IPS), SSC CGL, बैंक PO (IBPS/SBI) और राज्य पीएससी परीक्षाओं के लिए 100% मान्य है।'
              : career.sarkariEligibilityDetails?.notesEn ||
                'Graduates of this pathway are 100% eligible for UPSC Civil Services (IAS/IPS/IFS), SSC CGL, IBPS/SBI/RBI Bank PO, Defense CDS, and State PSC Officer exams.'}
          </p>
          {career.sarkariEligibilityDetails?.eligibleExams && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {career.sarkariEligibilityDetails.eligibleExams.map((exName) => (
                <span
                  key={exName}
                  className="px-2 py-0.5 rounded border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-semibold text-[var(--text)]"
                >
                  ✓ {exName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* UPGRADE 2 & 5 ("JobPathO" Feature): Day in the Life & Job Roles Section */}
      {jobRoles.length > 0 && (
        <section
          id="day-in-the-life-job-roles"
          data-testid="job-roles-section"
          className="mb-10 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 mb-6 border-b border-[var(--border)]">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>
                  {tr(
                    lang,
                    'JOBPATHO • ACTUAL ROLES YOU GET AFTER GRADUATION',
                    'JOBPATHO • DEGREE KE BAAD MILNE WALI ASLI JOBS',
                    'JobPathO • डिग्री के बाद मिलने वाली वास्तविक नौकरियां'
                  )}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]">
                {tr(
                  lang,
                  'Day in the Life & Job Roles',
                  'Day in the Life & Job Roles (Asli Designation, Tasks & Salary)',
                  'एक दिन की दिनचर्या और प्रमुख जॉब रोल्स (Day in the Life & Job Roles)'
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
                {tr(
                  lang,
                  'See the exact corporate & government job titles, daily operational tasks, starting salaries, and required skills you unlock with this degree.',
                  'Sirf degree ka naam nahi—dekhein ki graduation ke baad aapko kaunsi exact job post milegi, roz kya kaam hota hai, aur starting salary kitni hogi.',
                  'केवल डिग्री का नाम नहीं—जानिए इस पढ़ाई के बाद आपको कौन-सा वास्तविक पद मिलेगा, वहां रोज़ क्या काम होता है, और शुरुआती वेतन कितना होता है।'
                )}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[var(--text)] shrink-0">
              {jobRoles.length} {isHi ? 'प्रमुख जॉब रोल्स' : 'Verified Job Roles'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobRoles.map((role, rIdx) => (
              <div
                key={rIdx}
                className="p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-extrabold text-[var(--text)] leading-snug">
                      {isHi && role.titleHindi ? role.titleHindi : role.title}
                    </h3>
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs shrink-0 tabular-nums">
                      {role.salaryRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed mb-3">
                    {isHi && role.descriptionHindi ? role.descriptionHindi : role.description}
                  </p>

                  {role.dailyTasks && role.dailyTasks.length > 0 && (
                    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)] mb-3">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-1.5">
                        {isHi ? 'दैनिक कार्य (Daily Tasks):' : 'Daily Operational Tasks:'}
                      </div>
                      <ul className="space-y-1 text-xs text-[var(--text)]">
                        {role.dailyTasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <span className="font-mono text-[var(--text3)]">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1.5">
                    {isHi ? 'आवश्यक कौशल (Required Skills):' : 'Required Skills:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-1 rounded-md border border-[var(--border2)] bg-[var(--bg2)] text-[11px] font-mono font-semibold text-[var(--text)]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Pure SVG 6-Axis Competency & Skill Radar Chart */}
      <SkillRadarSection career={normalizedCareer} lang={lang} />

      {/* 5B. Pure SVG Salary Growth Potential Mini-Chart */}
      <SalaryGrowthChart career={normalizedCareer} lang={lang} />

      {/* 6. Eligibility Filter */}
      <EligibilityChecker
        lang={lang}
        profile={eligibilityProfile}
        onChangeProfile={onChangeEligibility}
        openCount={openIndexes.length}
        totalCount={totalSteps}
      />

      {/* 7. Suitability Matrix & Work-Life Reality */}
      <CareerSuitabilitySection career={normalizedCareer} lang={lang} />

      {/* 8. College Seat, Sarkari Badges & Govt vs Private Fee Explorer */}
      <CollegeFinderSection career={normalizedCareer} lang={lang} />

      {/* 9. Student Roadmap Progress Tracker & Milestone Checklist */}
      <RoadmapProgressTracker career={normalizedCareer} lang={lang} />

      {/* 10. 10-Question Bilingual Sigma Career Aptitude Quiz */}
      <CareerAptitudeQuiz
        career={normalizedCareer}
        careersData={careersData}
        lang={lang}
        onSelectCareer={onNavigateCareer}
        onShowToast={onShowToast}
      />

      {/* 11. Step-by-Step Roadmap Timeline */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-[var(--text)]">
          {isHi ? 'आपका चरणबद्ध रोडमैप' : 'Step-by-Step Execution Roadmap'}
        </h2>
        <RoadmapTimeline
          steps={normalizedRoadmap}
          lang={lang}
          openIndexes={openIndexes}
          careersData={careersData}
          onNavigateCareer={onNavigateCareer}
        />
      </section>

      {/* 12. What comes after */}
      {career.afterRoadmap && career.afterRoadmap.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-[var(--text)]">
            {isHi ? 'इसके बाद क्या आता है' : 'Career Progression & Senior Roles'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {career.afterRoadmap.map((role, rIdx) => (
              <div key={rIdx} className="rounded-xl border p-5 bg-[var(--bg2)] border-[var(--border)]">
                <div className="font-bold text-base text-[var(--text)] mb-1">
                  {t(role, 'title', lang)}
                </div>
                <div className="text-xs text-[var(--text2)] mb-3 leading-relaxed">
                  {t(role, 'description', lang)}
                </div>
                <div className="text-xs font-mono font-bold text-[var(--text)] tabular-nums">
                  {role.salaryInr}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 13. Exam Calendar + Zero Extra Syllabus Matrix */}
      <ExamCalendarSection
        exams={career.exams}
        lastVerified={career.lastVerified || '2026-03'}
        lang={lang}
        category={career.category}
      />

      {/* 14. Reality Check Card + Drop Year Cost Calculator + Sharma Ji Ka Beta Reality Card */}
      <RealityCheckCard
        salary={normalizedCareer.salaryInr}
        career={normalizedCareer}
        lang={lang}
        externalOpenCardModal={openRealityCardModal}
        onCloseExternalModal={() => setOpenRealityCardModal(false)}
        onShowToast={onShowToast}
      />

      {/* 15. Common Questions / FAQs */}
      {career.faqs && career.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-[var(--text)]">
            {isHi ? 'सामान्य प्रश्न (FAQs)' : 'Frequently Asked Questions'}
          </h2>
          <div className="flex flex-col gap-3">
            {career.faqs.map((faq, fIdx) => {
              const isFaqOpen = !!openFaqs[fIdx];
              return (
                <div key={fIdx} className="rounded-xl border overflow-hidden bg-[var(--bg2)] border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaqs((prev) => ({ ...prev, [fIdx]: !prev[fIdx] }))}
                    className="min-h-[48px] w-full p-4 text-left font-bold text-sm flex items-center justify-between gap-3 hover:bg-[var(--bg3)] transition-colors text-[var(--text)] cursor-pointer"
                  >
                    <span>{t(faq, 'q', lang)}</span>
                    <ChevronDown className={`w-4 h-4 text-[var(--text2)] shrink-0 transition-transform ${isFaqOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isFaqOpen && (
                    <div className="p-4 pt-0 border-t border-[var(--border)] text-sm leading-relaxed text-[var(--text2)] bg-[var(--bg)]">
                      <p className="pt-3">{t(faq, 'a', lang)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 16. Monochrome Action Stack (48px min height, 12px gap) */}
      <div className="rounded-2xl border p-5 mb-10 flex flex-wrap gap-3 bg-[var(--bg2)] border-[var(--border2)] no-print">
        <button
          type="button"
          onClick={onOpenLearning}
          className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>{isHi ? 'मुफ्त अध्ययन संसाधन (PYQs व छात्रवृत्ति)' : 'Open Preparation Resources'}</span>
        </button>

        {/* UPGRADE 3: Share Reality Check / Generate Reality Card button in Action Stack */}
        <button
          type="button"
          onClick={() => setOpenRealityCardModal(true)}
          className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg3)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-extrabold transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{tr(lang, 'Generate Reality Card (CTC vs In-Hand)', 'Generate Reality Card', 'Generate Reality Card (रियलिटी कार्ड)')}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleSave(career.id)}
          className={`min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
            isSaved
              ? 'bg-[var(--text)] border-[var(--text)] text-[var(--bg)]'
              : 'bg-[var(--bg3)] border-[var(--border2)] text-[var(--text)] hover:border-[var(--text)]'
          }`}
        >
          <Star className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          <span>{isSaved ? (isHi ? 'सेव किया गया' : 'Saved') : isHi ? 'करियर सेव करें' : 'Save Career'}</span>
        </button>

        <button
          type="button"
          onClick={handleSendToParents}
          className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-extrabold bg-[var(--bg3)] border-[var(--text)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>माता-पिता गाइड PDF (हिंदी)</span>
        </button>

        <button
          type="button"
          onClick={handlePrintCareerBlueprint}
          className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold bg-[var(--bg3)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{isHi ? 'ब्लूप्रिंट प्रिंट / डाउनलोड (PDF)' : 'Print / Download Blueprint'}</span>
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold bg-[var(--bg3)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{isHi ? 'लिंक कॉपी करें' : 'Copy Blueprint Link'}</span>
        </button>
      </div>

      {/* 17. Related Careers in Category */}
      {siblingCareers.length > 0 && (
        <section className="mb-10 no-print">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-[var(--text)]">
            {isHi ? 'इस क्षेत्र के अन्य विकल्प' : 'Related Pathways in This Domain'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {siblingCareers.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => onNavigateCareer(sc.id)}
                className="min-h-[56px] p-4 rounded-xl border flex items-center justify-between gap-3 cursor-pointer hover:border-[var(--text)] hover:-translate-y-0.5 transition-all bg-[var(--bg2)] border-[var(--border)] text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg3)] border border-[var(--border2)] flex items-center justify-center shrink-0 text-[var(--text)]">
                    <CareerSvgIcon id={sc.id} category={sc.category} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[var(--text)] truncate">{getFormalDesignation(sc, lang)}</div>
                    <div className="text-xs text-[var(--text2)] line-clamp-1">
                      {t(sc, 'shortDesc', lang) || t(sc, 'tagline', lang)}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--text)] shrink-0">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 18. Donation Box */}
      <section className="mb-8">
        <DonationBox lang={lang} isChildPage onOpenModal={onOpenDonationModal} />
      </section>

      {/* 19. Last verified line */}
      <div className="pt-4 border-t border-[var(--border)] text-xs font-mono text-[var(--text3)]">
        {isHi
          ? `अंतिम सत्यापन: ${fmtDate(career.lastVerified || '2026-03')}`
          : `Last verified: ${fmtDate(career.lastVerified || '2026-03')}`}
      </div>

      {/* 100% Pure Hindi Comprehensive Parents & Guardians Guide Modal (With Uncle-Defense Script, Teacher/Parent Tracker & QR Viral Loop) */}
      {showParentBriefModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowParentBriefModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="माता-पिता गाइड PDF (हिंदी)"
            className="w-full max-w-3xl rounded-2xl border-2 border-[var(--text)] bg-[var(--bg)] p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Top Header */}
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b-2 border-[var(--text)]">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1.5">
                  माता-पिता एवं अभिभावक विशेष मार्गदर्शिका • ✅ Eligible for UPSC / SSC / Bank PO
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] leading-snug">
                  {hindiParentGuide.titleHi} ({hindiParentGuide.formalDesignationEn})
                </h3>
                <p className="text-xs text-[var(--text2)] mt-1">
                  क्षेत्र: <strong>{hindiParentGuide.categoryLabelHi}</strong> • कुल अवधि:{' '}
                  <strong>{hindiParentGuide.durationHi}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowParentBriefModal(false)}
                className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg border border-[var(--border2)] text-[var(--text2)] hover:text-[var(--text)] cursor-pointer shrink-0 flex items-center justify-center"
                aria-label="Close parent brief"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-[var(--text)]">
              {/* Section 1: सरल परिचय */}
              <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                <div className="font-extrabold text-sm text-[var(--text)] mb-2 pb-1.5 border-b border-[var(--border)]">
                  1. यह करियर क्या है और इसमें क्या काम होता है?
                </div>
                <p className="text-[var(--text2)] mb-3">{hindiParentGuide.simpleSummaryHi}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                  <div>
                    <span className="text-[var(--text3)]">पात्र स्ट्रीम: </span>
                    <strong>{hindiParentGuide.eligibilityStreamsHi}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text3)]">न्यूनतम अंक: </span>
                    <strong>{hindiParentGuide.minBoardMarksHi}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text3)]">मुख्य परीक्षाएं: </span>
                    <strong>{hindiParentGuide.keyExamsHi}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text3)]">कुल अवधि: </span>
                    <strong>{hindiParentGuide.durationHi}</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: कुल खर्च की सच्चाई */}
              <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                <div className="font-extrabold text-sm text-[var(--text)] mb-2.5 pb-1.5 border-b border-[var(--border)]">
                  2. कुल खर्च की सच्चाई: सरकारी कॉलेज बनाम प्राइवेट कॉलेज (₹15 लाख कर्ज जाल से बचाव)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg border border-[var(--text)] bg-[var(--bg)]">
                    <div className="text-[11px] font-bold text-[var(--text3)]">सरकारी / केंद्रीय कॉलेज कुल फीस</div>
                    <div className="font-extrabold text-sm text-[var(--text)] mt-0.5">
                      {hindiParentGuide.feesComparison.govtTotalFeeHi}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                    <div className="text-[11px] font-bold text-[var(--text3)]">प्राइवेट कॉलेज कुल फीस</div>
                    <div className="font-bold text-sm text-[var(--text)] mt-0.5">
                      {hindiParentGuide.feesComparison.privateTotalFeeHi}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-[var(--text2)] bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                  <div>
                    • <strong>हॉस्टल व मेस खर्च:</strong> {hindiParentGuide.feesComparison.hostelMessMonthlyHi}
                  </div>
                  <div>
                    • <strong>पैसा वसूल समय (ROI):</strong> {hindiParentGuide.feesComparison.roiPaybackMonthsHi}
                  </div>
                </div>
              </div>

              {/* Section 3: What to tell relatives when they ask about this career (Uncle-Defense Script) */}
              <div
                data-testid="uncle-defense-pdf-section"
                className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)]"
              >
                <div className="font-extrabold text-sm text-[var(--text)] mb-2.5 pb-1.5 border-b border-[var(--border)]">
                  3. What to tell relatives when they ask about this career (रिश्तेदारों के सवालों का जवाब)
                </div>
                <div className="space-y-2.5 text-xs">
                  {hindiParentGuide.uncleDefenseScripts.map((u, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] space-y-1">
                      <div className="font-bold text-[var(--text)]">{u.questionHi}</div>
                      <p className="text-[var(--text2)]">{u.scriptHi}</p>
                      <p className="text-[11px] font-mono text-[var(--text3)]">{u.scriptEn}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: सरकारी छात्रवृत्ति और लोन */}
              <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                <div className="font-extrabold text-sm text-[var(--text)] mb-2.5 pb-1.5 border-b border-[var(--border)]">
                  4. सरकारी छात्रवृत्ति और बिना गारंटी का एजुकेशन लोन (PM-Vidyalaxmi व NSP)
                </div>
                <div className="space-y-2.5 text-xs">
                  {hindiParentGuide.scholarshipsAndLoans.map((sch, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <strong className="text-[var(--text)]">{sch.schemeNameHi}</strong>
                        <a
                          href={sch.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] underline text-[var(--text)]"
                        >
                          <span>{sch.portalUrl.replace('https://', '')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[var(--text2)] mb-1">{sch.benefitHi}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: रणनीतिक सुरक्षा कवच (Strategic Safety Net) */}
              <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                <div className="font-extrabold text-sm text-[var(--text)] mb-2 pb-1.5 border-b border-[var(--border)]">
                  5. रणनीतिक सुरक्षा कवच (Strategic Safety Net / Multi-Track Career Insurance)
                </div>
                <div className="space-y-2 text-xs">
                  {hindiParentGuide.safePlanBOptions.map((pb, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                      <div className="font-extrabold text-[var(--text)]">
                        ✓ विकल्प {idx + 1}: {pb.optionTitleHi}
                      </div>
                      <div className="text-[var(--text2)] mt-1">{pb.whySafeHi}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Teacher & Parent Academic Progress & Counseling Tracker */}
              <div
                data-testid="teacher-parent-progress-section"
                className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]"
              >
                <div className="font-extrabold text-sm text-[var(--text)] mb-2 pb-1.5 border-b border-[var(--border)]">
                  6. शिक्षक और अभिभावक संवाद: शैक्षणिक प्रगति और व्यक्तिगत लक्ष्य ट्रैकर
                </div>
                <p className="text-xs text-[var(--text)] font-medium mb-2">
                  {hindiParentGuide.teacherParentProgressTracker.studentScriptToParentTeacherHi}
                </p>
                <p className="text-[11px] text-[var(--text2)] mb-3">
                  {hindiParentGuide.teacherParentProgressTracker.studentScriptToParentTeacherEn}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {hindiParentGuide.teacherParentProgressTracker.milestones.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                      <div className="font-bold text-[var(--text)]">{m.metricHi}</div>
                      <div className="text-[var(--text2)] mt-0.5">{m.targetGoalHi}</div>
                      <div className="text-[10px] font-mono text-[var(--text3)] mt-1">
                        सत्यापन: {m.verificationSourceHi}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPGRADE 5 (The Viral Loop): QR Code & Govt Portals Verification Footer */}
              <div className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="font-mono font-extrabold text-[var(--text)]">
                    Generated via CareerPathO — Free, No Login, No Ads. Data verified via Govt Portals.
                  </div>
                  <div className="text-[var(--text2)]">
                    आधिकारिक सरकारी पोर्टल डेटा (NIRF, AICTE, NTA, UGC) पर आधारित • Tele-MANAS हेल्पलाइन: 14416
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text3)]">
                    Scan QR code to explore 101+ careers at https://careerpatho.in
                  </div>
                </div>
                <div
                  className="p-2 rounded-lg bg-white text-black border-2 border-black shrink-0 text-center"
                  dangerouslySetInnerHTML={{
                    __html: `${buildCareerPathoQrSvg('https://careerpatho.in')}<div style="font-family:monospace;font-size:8px;font-weight:800;margin-top:2px;color:#000;">CAREERPATHO.IN</div>`,
                  }}
                />
              </div>
            </div>

            {/* Bottom Action Bar: Download Hindi Guide File + Print */}
            <div className="mt-6 pt-4 border-t-2 border-[var(--text)] flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-[var(--text3)]">
                CareerPathO.in • 100% Free & Verified
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadHindiParentPdf}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--text)] text-[var(--bg)] hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>गाइड डाउनलोड करें (Download Hindi PDF/HTML)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadHindiParentPdf();
                    safeTriggerBrowserPrint();
                  }}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-bold text-[var(--text)] hover:border-[var(--text)] cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>प्रिंट करें (Print)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowParentBriefModal(false)}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
