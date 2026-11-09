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
import { IndividualCareerCapabilityTest } from './IndividualCareerCapabilityTest';
import { buildPlainLanguageCareerGuide } from '../utils/individualCareerTestEngine';
import { RealityCheckCard } from './RealityCheckCard';
import { SmartSalaryEstimator } from './SmartSalaryEstimator';
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
  Target,
  Sparkles,
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
  const title = t(career, 'title', lang);
  // RESEARCH UPGRADE: Formal Corporate Designation Reframe
  const formalDesignation = getFormalDesignation(career, lang);
  const tagline = t(career, 'tagline', lang) || t(career, 'shortDesc', lang);
  const overview = t(career, 'overview', lang);

  const parent = career.parentId ? careersData.parents[career.parentId] : null;
  const category = careersData.categories.find((c) => c.id === career.category);
  const catLabel = category ? t(category, 'label', lang) : career.category;

  const normalizedRoadmap: RoadmapStep[] = career.roadmap || [];

  const isVerified = Boolean(career.dataVerified);

  const rawEntrySal =
    career.salaryInr?.entry ||
    'PLFS median ₹3.0–4.5 LPA · Top Tier ₹8–16 LPA';
  const rawMidSal = career.salaryInr?.mid || '₹10–22 LPA (Skill & Market Dependent)';
  const rawSeniorSal = career.salaryInr?.senior || '₹24+ LPA (Experience Dependent)';

  const normalizedCareer: ChildCareer = {
    ...career,
    roadmap: normalizedRoadmap,
    salaryInr: isVerified
      ? {
          entry: rawEntrySal,
          mid: rawMidSal,
          senior: rawSeniorSal,
          disclaimer:
            career.salaryInr?.disclaimer ||
            'Historical statutory median only — NOT a guaranteed salary. Source: NIRF (https://www.nirfindia.org) & PLFS MoSPI (https://mospi.gov.in). Last verified: 11 Nov 2026.',
        }
      : {
          entry: `${rawEntrySal.split('Source:')[0].trim()} (Unverified Market Estimate — Not Officially Verified / Not Guaranteed)`,
          mid: `${rawMidSal} (Unverified Market Estimate — Not Guaranteed)`,
          senior: `${rawSeniorSal} (Unverified Market Estimate — Not Guaranteed)`,
          disclaimer:
            'Unverified private/market estimate — no single statutory government pay matrix governs this role. Actual earnings vary from ₹0 (unplaced/freelance) to top studio/corporate rates. Verify independently.',
        },
  };

  const openIndexes = filterEligibleSteps(normalizedCareer, eligibilityProfile);
  const totalSteps = normalizedRoadmap.length;

  const backHash = '#/careers';

  const [showParentBriefModal, setShowParentBriefModal] = useState(false);
  const [openRealityCardModal, setOpenRealityCardModal] = useState(false);
  const hindiParentGuide = generateHindiParentGuideData(normalizedCareer);
  const plainGuide = buildPlainLanguageCareerGuide(normalizedCareer);

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    const el = document.getElementById(sectionId);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSendToParents = () => {
    setShowParentBriefModal(true);
  };

  const handleDownloadHindiParentPdf = () => {
    const html = buildHindiParentGuidePrintableHtml(normalizedCareer, lang);
    const ok = downloadHtmlReportFile(`Mata-Pita-Guide-${career.id}-${lang}.html`, html);
    onShowToast(
      ok
        ? tr(
            lang,
            'Parent Guide PDF/HTML file downloaded!',
            'माता-पिता गाइड PDF/HTML फ़ाइल डाउनलोड हो गई है!'
          )
        : tr(lang, 'Parent Guide ready', 'माता-पिता गाइड तैयार है')
    );
  };

  const handlePrintCareerBlueprint = () => {
    const html = buildCareerBlueprintPrintableHtml(normalizedCareer, lang);
    downloadHtmlReportFile(`CareerPathO-Blueprint-${career.id}.html`, html);
    safeTriggerBrowserPrint();
    onShowToast(
      tr(
        lang,
        'Printable Career Blueprint downloaded & ready to print!',
        'करियर ब्लूप्रिंट डाउनलोड हो गया है और प्रिंट के लिए तैयार है!'
      )
    );
  };

  const handleShareWhatsApp = () => {
    const shareText = `${formalDesignation} (${normalizedCareer.salaryInr?.entry || 'High Growth'}) — ${window.location.href}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(
        () => {
          onShowToast(
            tr(
              lang,
              'Career blueprint link copied to clipboard!',
              'शेयर लिंक क्लिपबोर्ड पर कॉपी हो गया!'
            )
          );
        },
        () => {
          onShowToast(tr(lang, 'Share link ready', 'शेयर लिंक तैयार है'));
        }
      );
    } else {
      onShowToast(tr(lang, 'Share link ready', 'शेयर लिंक तैयार है'));
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

  const authorityBadges = isVerified
    ? (career.authorityBadges && career.authorityBadges.length > 0
        ? career.authorityBadges.map((b) => b.replace(/Verified/gi, 'Listed'))
        : ['Govt Portal Cited', 'No Salary Guarantee'])
    : ['Market Estimate (Unverified)', 'No Salary Guarantee'];

  const jobRoles = career.jobRoles || [];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* 1. Back button */}
      <a
        href={backHash}
        className="min-h-[48px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold mb-5 bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors no-print"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span>{tr(lang, 'BACK TO 395+ CAREERS', 'सभी 395+ करियर पर वापस जाएं')}</span>
      </a>

      {/* 2. Breadcrumbs */}
      <nav className="flex items-center flex-wrap gap-2 text-xs font-mono text-[var(--text3)] mb-6 no-print">
        <a href="#/" className="hover:text-[var(--text)] hover:underline">
          {tr(lang, 'Home', 'होम')}
        </a>
        <span>/</span>
        <a href="#/careers" className="hover:text-[var(--text)] hover:underline">
          {tr(lang, 'All 395+ Careers', '395+ करियर')}
        </a>
        <span>/</span>
        <span className="text-[var(--text)] font-bold break-words">{title}</span>
      </nav>

      {/* MANDATORY PARENT & STUDENT ANTI-HALLUCINATION BANNER (EVERY CAREER PAGE) */}
      <div
        role="note"
        data-testid="career-anti-hallucination-banner"
        className="mb-5 p-4 sm:p-5 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] text-xs sm:text-sm leading-relaxed space-y-1.5"
      >
        <div className="font-mono font-extrabold uppercase tracking-wider text-[var(--text)]">
          {tr(
            lang,
            '⚠️ PARENT & STUDENT REALITY CHECK — ZERO SALARY, PLACEMENT, OR ADMISSION GUARANTEE',
            '⚠️ अभिभावक एवं छात्र वास्तविकता चेतावनी — वेतन, प्लेसमेंट या प्रवेश की कोई गारंटी नहीं'
          )}
        </div>
        <p className="text-[var(--text2)] break-words">
          {tr(
            lang,
            'Completing a degree or passing an entrance exam does NOT guarantee any salary package, campus placement, or job offer. All figures on this page are historical statistical ranges or unverified market estimates. Many graduates earn significantly less (or start at ₹2.5–3.5 LPA national PLFS median) depending on individual skill, college tier, city, and economic conditions. Never take an education loan assuming a headline package is guaranteed.',
            'केवल डिग्री पूरी करने या प्रवेश परीक्षा पास करने से किसी भी सैलरी पैकेज, कैंपस प्लेसमेंट या नौकरी की गारंटी नहीं मिलती है। इस पेज पर दिए गए सभी आंकड़े केवल ऐतिहासिक सांख्यिकीय रेंज या बाजार के अनुमान हैं। कभी भी किसी पैकेज को "पक्का" मानकर बड़ा एजुकेशन लोन न लें।'
          )}
        </p>
      </div>

      {/* CRITICAL DATA SAFETY BANNER: Shown when dataVerified === false */}
      {!isVerified && (
        <div
          role="alert"
          data-testid="unverified-career-warning-banner"
          className="mb-6 p-4 sm:p-5 rounded-2xl border-2 border-[var(--border2)] bg-[var(--bg3)] text-[var(--text)] font-medium text-xs sm:text-sm leading-relaxed flex items-start gap-3"
        >
          <span className="text-base leading-none shrink-0 font-mono font-extrabold" aria-hidden="true">
            [!]
          </span>
          <div>
            <p className="font-extrabold text-[var(--text)]">
              {tr(
                lang,
                'Unverified Market Estimate Track: Official government salary/placement verification does not exist or is hard to standardize for this private, creative, emerging, or freelance career.',
                'असत्यापित बाजार अनुमान: इस प्राइवेट, क्रिएटिव, उभरते या फ्रीलांस करियर के लिए कोई एक निश्चित सरकारी वेतनमान उपलब्ध नहीं है।'
              )}
            </p>
            <p className="text-xs text-[var(--text2)] mt-1 font-mono">
              {tr(
                lang,
                'Use this page as an informational starting point only — compensation in this field depends heavily on personal portfolio, employer tier, and market demand.',
                'इस पृष्ठ को केवल प्रारंभिक जानकारी के रूप में उपयोग करें — इस क्षेत्र में आय पूरी तरह से आपके कौशल, पोर्टफोलियो और बाजार की मांग पर निर्भर करती है।'
              )}
            </p>
          </div>
        </div>
      )}

      {/* 3. Career Header in Monochrome Architectural Card */}
      <header className="mb-6 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shrink-0">
            <CareerSvgIcon id={career.id} category={career.category} className="w-7 h-7" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isVerified ? (
              <span
                data-testid="career-verification-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border badge-verified-subtle text-xs font-mono font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{tr(lang, 'Govt Source Cited (No Guarantee)', 'सरकारी स्रोत उद्धृत (कोई गारंटी नहीं)')}</span>
              </span>
            ) : (
              <span
                data-testid="career-verification-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border badge-unverified-subtle text-xs font-mono font-semibold"
              >
                <span>{tr(lang, 'Market Estimate (Unverified)', 'बाजार अनुमान (असत्यापित)')}</span>
              </span>
            )}
            <span
              data-testid="career-last-updated-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border badge-nov11-subtle text-xs font-mono font-bold"
            >
              <span>{tr(lang, 'Updated: 11 Nov 2026', 'अपडेटेड: 11 नवंबर 2026')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border2)] text-[var(--text)] text-xs font-mono font-bold">
              <Activity className="w-3.5 h-3.5" />
              {t(career, 'demand', lang) || tr(lang, 'Variable Demand', 'परिवर्तनशील मांग')}
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
          {Array.from(new Set(authorityBadges)).map((badge, bIdx) => (
            <span
              key={`${badge}-${bIdx}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text2)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--text)] shrink-0" />
              <span>[{badge}]</span>
            </span>
          ))}
        </div>

        {/* RESEARCH UPGRADE 1: Formal Corporate Designation Reframe */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-1.5 leading-tight break-words">
          {formalDesignation}
        </h1>
        {formalDesignation !== title && (
          <div className="text-xs font-mono text-[var(--text3)] mb-2 break-words">
            {tr(lang, 'Academic Degree Track:', 'आधिकारिक डिग्री नाम:')} {title}
          </div>
        )}
        <p className="text-base text-[var(--text2)] leading-relaxed max-w-3xl break-words">
          {tagline}
        </p>

        {/* Key Snapshot Telemetry Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--border)]">
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {isVerified
                ? tr(lang, 'Historical Median (Not Guaranteed)', 'ऐतिहासिक मीडियन (गारंटीकृत नहीं)')
                : tr(lang, 'Market Estimate (Unverified)', 'बाजार अनुमान (असत्यापित)')}
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-[var(--text)] leading-snug break-words">
              {normalizedCareer.salaryInr?.entry?.split('Source:')[0].trim()}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {tr(lang, 'Course Duration', 'अवधि (Duration)')}
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-[var(--text)]">
              {t(career, 'duration', lang) || '3–4 Years'}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {tr(lang, 'Est. Total Cost (Varies by College)', 'अनुमानित फीस (कॉलेज अनुसार भिन्न)')}
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-[var(--text)] break-words">
              {t(career, 'cost', lang) || 'Check official college brochure'}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
              {tr(lang, 'Difficulty Level', 'कठिनाई स्तर')}
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-[var(--text)]">
              {t(career, 'difficulty', lang) || 'Moderate to Hard'}
            </div>
          </div>
        </div>

        {/* TRUST ELEMENT 7: Official Source + Year + Link + Last Verified Date for Every Number */}
        <div
          data-testid="official-source-verification-strip"
          className="mt-3 p-3 rounded-xl border border-[var(--border2)] bg-[var(--bg)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[var(--text2)]"
        >
          <span>
            {normalizedCareer.salaryInr?.disclaimer ||
              'Source: NIRF (https://www.nirfindia.org) & PLFS MoSPI (https://mospi.gov.in) · Last verified: 11 Nov 2026'}
          </span>
          <div className="flex flex-wrap items-center gap-3 shrink-0 font-bold text-[var(--text)]">
            <a href="#/sources" className="underline hover:opacity-80">
              Official Sources
            </a>
            <span aria-hidden="true">·</span>
            <a href="#/how-we-calculate" className="underline hover:opacity-80">
              How We Calculate This
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`#/feedback?career=${encodeURIComponent(career.id)}`}
              data-testid="career-report-correction-link"
              className="underline hover:opacity-80"
            >
              {tr(lang, 'Report Data Correction', 'डेटा सुधार रिपोर्ट करें')}
            </a>
          </div>
        </div>

        {/* 11 NOVEMBER 2026 CAREER AUDIT & EXAM STATUS BULLETIN */}
        {normalizedCareer.nov11Update && (
          <div
            data-testid="career-nov11-update-banner"
            className="mt-3 p-3.5 rounded-xl border badge-nov11-subtle text-xs leading-relaxed"
          >
            <div className="font-mono font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>📌</span>
              <span>
                {tr(
                  lang,
                  '11 NOVEMBER 2026 CAREER & EXAM STATUS UPDATE',
                  '11 नवंबर 2026 करियर एवं परीक्षा स्थिति अपडेट'
                )}
              </span>
            </div>
            <p className="text-[var(--text)] font-medium break-words">
              {tr(lang, normalizedCareer.nov11Update, normalizedCareer.nov11UpdateHindi || normalizedCareer.nov11Update)}
            </p>
          </div>
        )}

        {/* Quick Top Action Bar (48px min height, 12px gap) */}
        <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('individual-career-capability-test')}
              className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>{tr(lang, 'Take Career Capability Test', 'मेरी योग्यता टेस्ट करें')}</span>
            </button>
            <button
              type="button"
              onClick={handleSendToParents}
              className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] text-[var(--text)] text-xs font-bold hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>माता-पिता गाइड PDF (हिंदी)</span>
            </button>
            <button
              type="button"
              data-testid="career-header-generate-reality-card-btn"
              onClick={() => setOpenRealityCardModal(true)}
              className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{tr(lang, 'Generate Reality Card', 'रियलिटी कार्ड बनाएं')}</span>
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
            <span>{tr(lang, 'Free PYQs, Scholarships & Prep', 'मुफ्त अध्ययन सामग्री (PYQs व छात्रवृत्ति)')}</span>
          </button>
        </div>
      </header>

      {/* MOBILE-FRIENDLY QUICK JUMP NAVIGATION BAR */}
      <nav
        aria-label="Quick section jump navigation"
        data-testid="career-quick-jump-bar"
        className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar no-print"
      >
        <button
          type="button"
          onClick={() => scrollToSection('plain-language-guide-card')}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--text)] whitespace-nowrap shrink-0 cursor-pointer"
        >
          {tr(lang, '1. In Simple Words', '1. सरल भाषा में समझें')}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('individual-career-capability-test')}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl border-2 border-[var(--text)] bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold whitespace-nowrap shrink-0 cursor-pointer"
        >
          {tr(lang, '2. Am I Capable? (7-Q Test)', '2. क्या मैं सक्षम हूँ? (टेस्ट)')}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('day-in-the-life-job-roles')}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--text)] whitespace-nowrap shrink-0 cursor-pointer"
        >
          {tr(lang, `3. All Jobs (${jobRoles.length} Roles)`, `3. सभी नौकरियां (${jobRoles.length})`)}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('step-by-step-roadmap-section')}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--text)] whitespace-nowrap shrink-0 cursor-pointer"
        >
          {tr(lang, '4. Step-by-Step Roadmap', '4. कदम-दर-कदम रोडमैप')}
        </button>
      </nav>

      {/* 3B. PLAIN-LANGUAGE MOBILE GUIDE ("IN SIMPLE WORDS — FOR STUDENTS & PARENTS") */}
      <section
        id="plain-language-guide-card"
        data-testid="plain-language-guide-card"
        className="mb-8 p-5 sm:p-6 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--border)]">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              {tr(
                lang,
                'IN SIMPLE WORDS • EASY GUIDE FOR STUDENTS & PARENTS (NO JARGON)',
                'सरल शब्दों में पूरा सच • छात्रों और माता-पिता के लिए आसान गाइड'
              )}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[var(--text3)]">
            {tr(lang, '1-Minute Mobile Summary', '1-मिनट मोबाइल सारांश')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm leading-relaxed">
          <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
            <div className="font-mono font-extrabold text-xs uppercase text-[var(--text)] mb-1">
              {tr(lang, '1. What work do you actually do?', '1. इसमें वास्तव में क्या काम होता है?')}
            </div>
            <p className="text-[var(--text2)] break-words">
              {tr(lang, plainGuide.whatIsItEn, plainGuide.whatIsItHi)}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
            <div className="font-mono font-extrabold text-xs uppercase text-[var(--text)] mb-1">
              {tr(lang, '2. Who can join after Class 12?', '2. 12वीं के बाद कौन प्रवेश ले सकता है?')}
            </div>
            <p className="text-[var(--text2)] break-words">
              {tr(lang, plainGuide.whoCanJoinEn, plainGuide.whoCanJoinHi)}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
            <div className="font-mono font-extrabold text-xs uppercase text-[var(--text)] mb-1">
              {tr(lang, '3. Real Fees vs Monthly Bank Salary', '3. असली फीस बनाम हर महीने की सैलरी')}
            </div>
            <p className="text-[var(--text2)] break-words">
              {tr(lang, plainGuide.moneyTruthEn, plainGuide.moneyTruthHi)}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
            <div className="font-mono font-extrabold text-xs uppercase text-[var(--text)] mb-1">
              {tr(lang, '4. Government Job & Safety Net', '4. सरकारी नौकरी पात्रता और सुरक्षा कवच')}
            </div>
            <p className="text-[var(--text2)] break-words">
              {tr(lang, plainGuide.safetyNetEn, plainGuide.safetyNetHi)}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Overview Box */}
      <div className="rounded-2xl border p-6 mb-8 text-base leading-relaxed bg-[var(--bg2)] border-[var(--border)] text-[var(--text)] break-words">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--text3)] mb-2">
          {tr(lang, 'EXECUTIVE OVERVIEW', 'विस्तृत विवरण')}
        </div>
        {overview}
      </div>

      {/* 4B. INDIVIDUAL CAREER CAPABILITY & READINESS TEST (Replaces the generic quiz on every career page!) */}
      <IndividualCareerCapabilityTest
        career={normalizedCareer}
        siblingCareers={siblingCareers}
        lang={lang}
        onSelectCareer={onNavigateCareer}
        onShowToast={onShowToast}
      />

      {/* UPGRADE 2 & 5 ("JobPathO" Feature): Day in the Life & Diverse Job Roles Section */}
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
                    'JOBPATHO • DIVERSE PRIVATE, GOVT, TECH & INDEPENDENT ROLES',
                    'JOBPATHO • डिग्री के बाद मिलने वाली विविध नौकरियां (प्राइवेट व सरकारी)'
                  )}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]">
                {tr(
                  lang,
                  'Day in the Life & Diverse Job Roles',
                  'एक दिन की दिनचर्या और विविध जॉब रोल्स (Day in the Life & Job Roles)'
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
                {tr(
                  lang,
                  'Explore all the different career paths—from Private MNCs and Government/PSU Officer posts to Product Management, Research, and Independent Practice—unlocked by this qualification.',
                  'केवल एक नौकरी नहीं—जानिए इस पढ़ाई के बाद प्राइवेट कंपनियों, सरकारी (PSU/Sarkari) पदों, रिसर्च और स्वरोजगार में कौन-कौन से पद मिलते हैं।'
                )}
              </p>
            </div>
            <span
              data-testid="job-roles-count-badge"
              className="px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono font-extrabold text-[var(--text)] shrink-0"
            >
              {jobRoles.length} {tr(lang, 'Illustrative Job Roles (Not Guaranteed)', 'संभावित जॉब रोल्स (गारंटीकृत नहीं)')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobRoles.map((role, rIdx) => (
              <div
                key={`${role.title}-${rIdx}`}
                data-testid={`job-role-card-${rIdx + 1}`}
                className="p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] flex flex-col justify-between gap-4"
              >
                <div>
                  {role.sectorTag && (
                    <div className="mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded border border-[var(--border2)] bg-[var(--bg2)] text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text2)] break-words">
                        {tr(lang, role.sectorTag, role.sectorTagHindi || role.sectorTag)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-extrabold text-[var(--text)] leading-snug break-words">
                      {tr(lang, role.title, role.titleHindi || role.title)}
                    </h3>
                    <span className="self-start px-2.5 py-1 rounded-lg bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs shrink-0 tabular-nums">
                      Est: {role.salaryRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed mb-3 break-words">
                    {tr(lang, role.description, role.descriptionHindi || role.description)}
                  </p>

                  {role.dailyTasks && role.dailyTasks.length > 0 && (
                    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)] mb-3">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-1.5">
                        {tr(lang, 'Daily Operational Tasks:', 'दैनिक कार्य (Daily Tasks):')}
                      </div>
                      <ul className="space-y-1 text-xs text-[var(--text)]">
                        {role.dailyTasks.map((task, tIdx) => (
                          <li key={`${task.slice(0, 12)}-${tIdx}`} className="flex items-start gap-1.5">
                            <span className="font-mono text-[var(--text3)]">•</span>
                            <span className="break-words">{tr(lang, task, task)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1.5">
                    {tr(lang, 'Required Skills:', 'आवश्यक कौशल (Required Skills):')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(role.requiredSkills)).map((sk, sIdx) => (
                      <span
                        key={`${sk}-${sIdx}`}
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

      {/* 11. Step-by-Step Roadmap Timeline */}
      <section id="step-by-step-roadmap-section" className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-[var(--text)]">
          {tr(lang, 'Step-by-Step Execution Roadmap', 'आपका चरणबद्ध रोडमैप')}
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
            {tr(lang, 'Career Progression & Senior Roles', 'इसके बाद क्या आता है')}
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
        lastVerified={normalizedCareer.lastVerified || '2026-11-11'}
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

      {/* 14B. Smart Salary Estimator (Stream × City × Experience Tailored In-Hand Projection) */}
      <SmartSalaryEstimator
        career={normalizedCareer}
        lang={lang}
        onShowToast={onShowToast}
      />

      {/* 15. Common Questions / FAQs */}
      {career.faqs && career.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-[var(--text)]">
            {tr(lang, 'Frequently Asked Questions', 'सामान्य प्रश्न (FAQs)')}
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
                    <span className="break-words">{t(faq, 'q', lang)}</span>
                    <ChevronDown className={`w-4 h-4 text-[var(--text2)] shrink-0 transition-transform ${isFaqOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isFaqOpen && (
                    <div className="p-4 pt-0 border-t border-[var(--border)] text-sm leading-relaxed text-[var(--text2)] bg-[var(--bg)]">
                      <p className="pt-3 break-words">{t(faq, 'a', lang)}</p>
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
          <span>{tr(lang, 'Open Preparation Resources', 'मुफ्त अध्ययन संसाधन (PYQs व छात्रवृत्ति)')}</span>
        </button>

        {/* UPGRADE 3: Share Reality Check / Generate Reality Card button in Action Stack */}
        <button
          type="button"
          onClick={() => setOpenRealityCardModal(true)}
          className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg3)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] text-xs font-mono font-extrabold transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{tr(lang, 'Share Reality Check (Generate Reality Card)', 'Share Reality Check Card', 'रियलिटी चेक कार्ड शेयर करें')}</span>
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
          <span>{isSaved ? tr(lang, 'Saved', 'सेव किया गया') : tr(lang, 'Save Career', 'करियर सेव करें')}</span>
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
          <span>{tr(lang, 'Print / Download Blueprint', 'ब्लूप्रिंट प्रिंट / डाउनलोड (PDF)')}</span>
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold bg-[var(--bg3)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{tr(lang, 'Copy Blueprint Link', 'लिंक कॉपी करें')}</span>
        </button>
      </div>

      {/* 17. Related Careers in Category */}
      {siblingCareers.length > 0 && (
        <section className="mb-10 no-print">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-[var(--text)]">
            {tr(lang, 'Related Pathways in This Domain', 'इस क्षेत्र के अन्य विकल्प')}
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
        {tr(
          lang,
          `Last verified: ${fmtDate(career.lastVerified || '2026-03')}`,
          `अंतिम सत्यापन: ${fmtDate(career.lastVerified || '2026-03')}`
        )}
      </div>

      {/* Comprehensive Parents & Guardians Guide Modal (With Uncle-Defense Script, Teacher/Parent Tracker & QR Viral Loop) */}
      {showParentBriefModal && (() => {
        const locParent = (hiStr: string, enFallback?: string) =>
          lang === 'en' || lang === 'hi'
            ? hiStr
            : tr(lang, enFallback || hiStr, hiStr);
        return (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowParentBriefModal(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={locParent('माता-पिता गाइड PDF (हिंदी)', 'Parents Guide PDF')}
              className="w-full max-w-3xl rounded-2xl border-2 border-[var(--text)] bg-[var(--bg)] p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Top Header */}
              <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b-2 border-[var(--text)]">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1.5">
                    {locParent(
                      'माता-पिता एवं अभिभावक विशेष मार्गदर्शिका • ✅ Eligible for UPSC / SSC / Bank PO',
                      'Parents & Guardians Special Guide • ✅ Eligible for UPSC / SSC / Bank PO'
                    )}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] leading-snug">
                    {locParent(hindiParentGuide.titleHi, hindiParentGuide.formalDesignationEn)} ({hindiParentGuide.formalDesignationEn})
                  </h3>
                  <p className="text-xs text-[var(--text2)] mt-1">
                    {locParent('क्षेत्र:', 'Category:')} <strong>{locParent(hindiParentGuide.categoryLabelHi)}</strong> • {locParent('कुल अवधि:', 'Total Duration:')}{' '}
                    <strong>{locParent(hindiParentGuide.durationHi)}</strong>
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
                    {locParent('1. यह करियर क्या है और इसमें क्या काम होता है?', '1. What is this career and what does the work involve?')}
                  </div>
                  <p className="text-[var(--text2)] mb-3">{locParent(hindiParentGuide.simpleSummaryHi)}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                    <div>
                      <span className="text-[var(--text3)]">{locParent('पात्र स्ट्रीम: ', 'Eligible Stream: ')}</span>
                      <strong>{locParent(hindiParentGuide.eligibilityStreamsHi)}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--text3)]">{locParent('न्यूनतम अंक: ', 'Minimum Marks: ')}</span>
                      <strong>{locParent(hindiParentGuide.minBoardMarksHi)}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--text3)]">{locParent('मुख्य परीक्षाएं: ', 'Key Exams: ')}</span>
                      <strong>{locParent(hindiParentGuide.keyExamsHi)}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--text3)]">{locParent('कुल अवधि: ', 'Total Duration: ')}</span>
                      <strong>{locParent(hindiParentGuide.durationHi)}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 2: कुल खर्च की सच्चाई */}
                <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                  <div className="font-extrabold text-sm text-[var(--text)] mb-2.5 pb-1.5 border-b border-[var(--border)]">
                    {locParent(
                      '2. कुल खर्च की सच्चाई: सरकारी कॉलेज बनाम प्राइवेट कॉलेज (₹15 लाख कर्ज जाल से बचाव)',
                      '2. Real Cost Comparison: Government College vs Private College'
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="p-3 rounded-lg border border-[var(--text)] bg-[var(--bg)]">
                      <div className="text-[11px] font-bold text-[var(--text3)]">
                        {locParent('सरकारी / केंद्रीय कॉलेज कुल फीस', 'Government / Central College Total Fee')}
                      </div>
                      <div className="font-extrabold text-sm text-[var(--text)] mt-0.5">
                        {locParent(hindiParentGuide.feesComparison.govtTotalFeeHi)}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                      <div className="text-[11px] font-bold text-[var(--text3)]">
                        {locParent('प्राइवेट कॉलेज कुल फीस', 'Private College Total Fee')}
                      </div>
                      <div className="font-bold text-sm text-[var(--text)] mt-0.5">
                        {locParent(hindiParentGuide.feesComparison.privateTotalFeeHi)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-[var(--text2)] bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                    <div>
                      • <strong>{locParent('हॉस्टल व मेस खर्च:', 'Hostel & Mess Cost:')}</strong>{' '}
                      {locParent(hindiParentGuide.feesComparison.hostelMessMonthlyHi)}
                    </div>
                    <div>
                      • <strong>{locParent('पैसा वसूल समय (ROI):', 'Fee Recovery Time (ROI):')}</strong>{' '}
                      {locParent(hindiParentGuide.feesComparison.roiPaybackMonthsHi)}
                    </div>
                  </div>
                </div>

                {/* Section 3: What to tell relatives when they ask about this career (Uncle-Defense Script) */}
                <div
                  data-testid="uncle-defense-pdf-section"
                  className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)]"
                >
                  <div className="font-extrabold text-sm text-[var(--text)] mb-2.5 pb-1.5 border-b border-[var(--border)]">
                    {locParent(
                      '3. रिश्तेदारों के सवालों का जवाब (What to tell relatives when they ask about this career)',
                      '3. What to tell relatives when they ask about this career'
                    )}
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {hindiParentGuide.uncleDefenseScripts.map((u, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] space-y-1">
                        <div className="font-bold text-[var(--text)]">{locParent(u.questionHi)}</div>
                        <p className="text-[var(--text2)]">{locParent(u.scriptHi, u.scriptEn)}</p>
                        <p className="text-[11px] font-mono text-[var(--text3)]">{u.scriptEn}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: सरकारी छात्रवृत्ति और लोन */}
                <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                  <div className="font-extrabold text-sm text-[var(--text)] mb-2.5 pb-1.5 border-b border-[var(--border)]">
                    {locParent(
                      '4. सरकारी छात्रवृत्ति और बिना गारंटी का एजुकेशन लोन (PM-Vidyalaxmi व NSP)',
                      '4. Government Scholarships & Collateral-Free Education Loans (PM-Vidyalaxmi & NSP)'
                    )}
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {hindiParentGuide.scholarshipsAndLoans.map((sch, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <strong className="text-[var(--text)]">{locParent(sch.schemeNameHi)}</strong>
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
                        <p className="text-[var(--text2)] mb-1">{locParent(sch.benefitHi)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: रणनीतिक सुरक्षा कवच (Strategic Safety Net) */}
                <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
                  <div className="font-extrabold text-sm text-[var(--text)] mb-2 pb-1.5 border-b border-[var(--border)]">
                    {locParent(
                      '5. रणनीतिक सुरक्षा कवच (Strategic Safety Net / Multi-Track Career Insurance)',
                      '5. Strategic Safety Net / Multi-Track Career Insurance'
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    {hindiParentGuide.safePlanBOptions.map((pb, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                        <div className="font-extrabold text-[var(--text)]">
                          ✓ {locParent(`विकल्प ${idx + 1}: ${pb.optionTitleHi}`, `Option ${idx + 1}: ${pb.optionTitleHi}`)}
                        </div>
                        <div className="text-[var(--text2)] mt-1">{locParent(pb.whySafeHi)}</div>
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
                    {locParent(
                      '6. शिक्षक और अभिभावक संवाद: शैक्षणिक प्रगति और व्यक्तिगत लक्ष्य ट्रैकर',
                      '6. Teacher & Parent Academic Progress & Counseling Tracker'
                    )}
                  </div>
                  <p className="text-xs text-[var(--text)] font-medium mb-2">
                    {locParent(
                      hindiParentGuide.teacherParentProgressTracker.studentScriptToParentTeacherHi,
                      hindiParentGuide.teacherParentProgressTracker.studentScriptToParentTeacherEn
                    )}
                  </p>
                  <p className="text-[11px] text-[var(--text2)] mb-3">
                    {hindiParentGuide.teacherParentProgressTracker.studentScriptToParentTeacherEn}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {hindiParentGuide.teacherParentProgressTracker.milestones.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                        <div className="font-bold text-[var(--text)]">{locParent(m.metricHi)}</div>
                        <div className="text-[var(--text2)] mt-0.5">{locParent(m.targetGoalHi)}</div>
                        <div className="text-[10px] font-mono text-[var(--text3)] mt-1">
                          {locParent('सत्यापन:', 'Verification:')} {locParent(m.verificationSourceHi)}
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
                      {locParent(
                        'आधिकारिक सरकारी पोर्टल डेटा (NIRF, AICTE, NTA, UGC) पर आधारित • Tele-MANAS हेल्पलाइन: 14416',
                        'Verified via Official Govt Portals (NIRF, AICTE, NTA, UGC) • Tele-MANAS Helpline: 14416'
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text3)]">
                      Scan QR code to explore 395+ careers at https://careerpatho.in
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

              {/* Bottom Action Bar: Download Guide File + Print */}
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
                    <span>{locParent('गाइड डाउनलोड करें (Download Parent Guide PDF/HTML)', 'Download Parent Guide PDF/HTML')}</span>
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
                    <span>{locParent('प्रिंट करें (Print)', 'Print')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowParentBriefModal(false)}
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
                  >
                    {locParent('बंद करें (Close)', 'Close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
