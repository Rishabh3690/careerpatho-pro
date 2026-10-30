import React, { useState } from 'react';
import { ParentCareer, CareersDatabase, Language } from '../data/types';
import { t, tr, fmtDate } from '../utils/careerEngine';
import { ArrowLeft, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';
import { CareerSvgIcon } from './CareerSvgIcon';
import { CareerCard } from './CareerCard';
import { RealityCheckCard } from './RealityCheckCard';

interface ParentCareerViewProps {
  parent: ParentCareer;
  careersData: CareersDatabase;
  lang: Language;
  savedCareers?: string[];
  onToggleSave?: (id: string) => void;
  onNavigateCareer: (id: string) => void;
}

export const ParentCareerView: React.FC<ParentCareerViewProps> = ({
  parent,
  careersData,
  lang,
  savedCareers = [],
  onToggleSave,
  onNavigateCareer,
}) => {
  const isHi = lang === 'hi';
  const title = t(parent, 'title', lang);
  const tagline = t(parent, 'tagline', lang) || t(parent, 'shortDesc', lang);
  const overview = t(parent, 'overview', lang);

  const category = careersData.categories.find((c) => c.id === parent.category);
  const catLabel = category ? t(category, 'label', lang) : parent.category;

  const childList = (parent.children || [])
    .map((cid) => careersData.children[cid])
    .filter(Boolean);

  const representativeChild = childList[0];
  const [openRealityModal, setOpenRealityModal] = useState(false);

  const sarkariBadgeText = parent.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]';
  const authorityBadges = parent.authorityBadges || ['NIRF Verified', 'AICTE / UGC Approved', 'Govt Portal Verified'];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold mb-5 bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors no-print"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isHi ? 'होम' : 'BACK TO HOME'}</span>
      </a>

      {/* Breadcrumb */}
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
        <span className="text-[var(--text)] font-bold truncate">{title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center">
            <CareerSvgIcon id={parent.id} category={parent.category} className="w-7 h-7" />
          </div>
          <button
            type="button"
            onClick={() => setOpenRealityModal(true)}
            data-testid="parent-career-generate-reality-card-btn"
            className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold hover:opacity-90 transition-opacity cursor-pointer no-print"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {tr(
                lang,
                'Generate Reality Card',
                'Generate Reality Card (CTC vs In-Hand)',
                'Generate Reality Card (रियलिटी कार्ड बनाएं)'
              )}
            </span>
          </button>
        </div>

        {/* Sarkari Eligibility Badge + Authority Badges */}
        <div
          data-testid="sarkari-authority-badges"
          className="flex flex-wrap items-center gap-2 mb-3"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 border-[var(--text)] bg-[var(--bg)] text-xs font-mono font-extrabold text-[var(--text)]">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{sarkariBadgeText}</span>
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

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2">
          {title}
        </h1>
        <p className="text-base text-[var(--text2)] leading-relaxed max-w-3xl">
          {tagline}
        </p>
      </header>

      {/* Overview box */}
      <div className="rounded-2xl border p-6 mb-10 text-base leading-relaxed bg-[var(--bg2)] border-[var(--border)] text-[var(--text)]">
        {overview}
      </div>

      {/* Grid of children cards */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
            {isHi ? 'विशेषज्ञता एवं करियर पथ' : 'Specialized Career Pathways'}
          </h2>
          <span className="text-xs font-mono text-[var(--text2)]">
            {childList.length} {isHi ? 'शाखाएं' : 'pathways'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {childList.map((ch) => (
            <CareerCard
              key={ch.id}
              career={ch}
              lang={lang}
              isSaved={savedCareers.includes(ch.id)}
              onToggleSave={onToggleSave}
              onClick={onNavigateCareer}
            />
          ))}
        </div>
      </section>

      {/* Reality Check Card on Parent Career Hub */}
      {representativeChild && (
        <RealityCheckCard
          salary={representativeChild.salaryInr || { entry: '₹6–15 LPA', mid: '₹16–32 LPA', senior: '₹35–70+ LPA' }}
          career={representativeChild}
          lang={lang}
          externalOpenCardModal={openRealityModal}
          onCloseExternalModal={() => setOpenRealityModal(false)}
        />
      )}

      <div className="pt-4 border-t border-[var(--border)] text-xs font-mono text-[var(--text3)]">
        {isHi
          ? `अंतिम सत्यापन: ${fmtDate(parent.lastVerified || '2026-03')}`
          : `Last verified: ${fmtDate(parent.lastVerified || '2026-03')}`}
      </div>
    </div>
  );
};
