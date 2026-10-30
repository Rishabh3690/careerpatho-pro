import React from 'react';
import { ChildCareer, Language } from '../data/types';
import { t, computeCareerKPIs, getFormalDesignation } from '../utils/careerEngine';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { CareerSvgIcon } from './CareerSvgIcon';

interface CareerCardProps {
  career: ChildCareer;
  lang: Language;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  lang,
  isSaved = false,
  onToggleSave,
  onSelect,
  onClick,
}) => {
  const isHi = lang === 'hi';
  // RESEARCH UPGRADE: Formal Corporate Designation Reframe on every card
  const formalTitle = getFormalDesignation(career, lang);
  const tagline = t(career, 'tagline', lang);
  const kpis = computeCareerKPIs(career);

  const firstStep = career.roadmap && career.roadmap[0];
  const entrySalaryRaw =
    career.salaryInr?.entry ||
    firstStep?.details?.salaryInr?.entry ||
    (career.entrySalaryLakhs ? `₹${career.entrySalaryLakhs} LPA` : '₹12 LPA');
  const entrySalary = entrySalaryRaw.split('(')[0].trim();

  const duration = firstStep?.duration || '3–4 Yrs';
  const streams = career.eligibility?.streams?.join('/') || 'Any';
  const topExam =
    firstStep?.details?.exams?.[0] ||
    (career.category === 'medical'
      ? 'NEET'
      : career.category === 'engineering'
      ? 'JEE / CET'
      : career.category === 'law'
      ? 'CLAT'
      : 'Merit / Entrance');

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(career.id);
    } else if (onClick) {
      onClick(career.id);
    } else {
      window.location.hash = `#/career/${career.id}`;
    }
  };

  const demandShort =
    kpis.demandLevel === 'Very High'
      ? isHi
        ? 'उच्च मांग'
        : 'High Demand'
      : kpis.demandLevel === 'High'
      ? isHi
        ? 'मजबूत मांग'
        : 'Strong Demand'
      : isHi
      ? 'स्थिर'
      : 'Steady';

  const sarkariBadge = career.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]';

  return (
    <article className="group relative rounded-xl border border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--text)] transition-all duration-150 p-3.5 flex flex-col justify-between hover:-translate-y-0.5">
      <div>
        {/* Compact Header Row: Icon + Accessible Title Button + Bookmark */}
        <div className="flex items-start justify-between gap-2.5 mb-2">
          <button
            type="button"
            onClick={handleCardClick}
            className="flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--bg3)] border border-[var(--border2)] flex items-center justify-center text-[var(--text)] group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition-colors shrink-0">
              <CareerSvgIcon id={career.id} category={career.category} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold tracking-tight text-[var(--text)] leading-snug line-clamp-1 group-hover:underline">
                {formalTitle}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-[var(--text3)]">
                <span className="uppercase">{streams}</span>
                <span aria-hidden="true">•</span>
                <span className="truncate">{topExam}</span>
              </div>
            </div>
          </button>

          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(career.id);
              }}
              aria-label={isSaved ? `Remove ${formalTitle} from saved` : `Save ${formalTitle}`}
              className={`min-h-[40px] min-w-[40px] rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                isSaved
                  ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                  : 'bg-transparent text-[var(--text3)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--text)]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* 1-Line Minimal Tagline */}
        <p
          onClick={handleCardClick}
          className="text-xs text-[var(--text2)] line-clamp-1 mb-2 leading-normal cursor-pointer"
        >
          {tagline}
        </p>

        {/* Clean Metadata Line + Sarkari Eligibility Indicator */}
        <div
          onClick={handleCardClick}
          className="flex items-center flex-wrap gap-1.5 mb-2.5 text-[10px] font-mono text-[var(--text2)] cursor-pointer"
        >
          <span className="font-bold text-[var(--text)]">{demandShort}</span>
          <span aria-hidden="true">•</span>
          <span className="tabular-nums">{kpis.averageGrowthYoY.split(' ')[0]} YoY</span>
          <span aria-hidden="true">•</span>
          <span className="text-[var(--text)] font-semibold" title={sarkariBadge}>
            {sarkariBadge}
          </span>
        </div>
      </div>

      {/* Squeezed 3-Col Inline Telemetry Bar */}
      <button
        type="button"
        onClick={handleCardClick}
        className="w-full pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2 text-[11px] font-mono cursor-pointer text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-extrabold text-[var(--text)] tabular-nums truncate">
            {entrySalary}
          </span>
          <span className="text-[var(--text3)]" aria-hidden="true">
            •
          </span>
          <span className="text-[var(--text2)] tabular-nums shrink-0">{duration}</span>
        </div>
        <span className="inline-flex items-center gap-0.5 font-bold text-[var(--text)] shrink-0 group-hover:translate-x-0.5 transition-transform">
          <span>{isHi ? 'देखें' : 'Path'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </button>
    </article>
  );
};
