import React from 'react';
import { CareersDatabase, Language } from '../data/types';
import { t } from '../utils/careerEngine';
import { ArrowLeft } from 'lucide-react';
import { CareerSvgIcon } from './CareerSvgIcon';
import { CareerCard } from './CareerCard';

interface CategoryViewProps {
  catId: string;
  careersData: CareersDatabase;
  lang: Language;
  savedCareers?: string[];
  onToggleSave?: (id: string) => void;
  onNavigateCareer: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  catId,
  careersData,
  lang,
  savedCareers = [],
  onToggleSave,
  onNavigateCareer,
  onShowToast,
}) => {
  const isHi = lang === 'hi';
  const category = careersData.categories.find((c) => c.id === catId);
  const catLabel = category ? t(category, 'label', lang) : catId;

  // All children in this category
  const categoryChildren = Object.values(careersData.children || {}).filter(
    (ch) => ch.category === catId
  );

  // Parent hubs in this category
  const categoryParents = Object.values(careersData.parents || {}).filter(
    (p) => p.category === catId
  );

  const [expandedHubs, setExpandedHubs] = React.useState<Record<string, boolean>>({});

  // Coming soon in this category
  const categoryComingSoon = (careersData.comingSoon || []).filter((cs) => cs.category === catId);

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
        <span className="text-[var(--text)] font-bold">{catLabel}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
        <div className="w-14 h-14 rounded-2xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center mb-4">
          <CareerSvgIcon id={catId} category={catId} className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2">
          {catLabel}
        </h1>
        <p className="text-base text-[var(--text2)] leading-relaxed max-w-3xl">
          {isHi
            ? `${catLabel} में ${categoryChildren.length} प्रमाणित करियर रोडमैप, ${categoryParents.length} मुख्य पाथवे हब में व्यवस्थित।`
            : `Explore ${categoryChildren.length} verified career roadmaps structured across ${categoryParents.length} core pathway hubs in ${catLabel}.`}
        </p>
      </header>

      {/* Category Pathways Grouped by Parent Hub */}
      <section className="mb-12 space-y-8">
        {categoryParents.length > 0 ? (
          categoryParents.map((parent) => {
            const subChildren = categoryChildren.filter((ch) => ch.parentId === parent.id);
            if (subChildren.length === 0) return null;
            const isExpanded = !!expandedHubs[parent.id] || subChildren.length <= 6;
            const visibleSub = isExpanded ? subChildren : subChildren.slice(0, 6);

            return (
              <div
                key={parent.id}
                className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[var(--border)]">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text3)]">
                      {isHi ? 'मुख्य डिग्री / डोमेन ट्रैक' : 'CORE DEGREE & DOMAIN TRACK'} · {subChildren.length}{' '}
                      {isHi ? 'विशेषज्ञताएं' : 'PATHS'}
                    </div>
                    <h2 className="text-xl font-extrabold text-[var(--text)] mt-0.5">
                      <a href={`#/career/${parent.id}`} className="hover:underline">
                        {t(parent, 'title', lang)}
                      </a>
                    </h2>
                    <p className="text-xs text-[var(--text2)] mt-0.5">{t(parent, 'tagline', lang)}</p>
                  </div>

                  {subChildren.length > 6 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedHubs((prev) => ({ ...prev, [parent.id]: !prev[parent.id] }))
                      }
                      className="px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] text-xs font-mono font-bold hover:border-[var(--text)] cursor-pointer self-start"
                    >
                      {isExpanded
                        ? isHi
                          ? 'संक्षिप्त करें (Show 6)'
                          : 'Show Compact (6)'
                        : isHi
                        ? `सभी ${subChildren.length} शाखाएं देखें`
                        : `Expand All ${subChildren.length} Paths`}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {visibleSub.map((ch) => (
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
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {categoryChildren.map((ch) => (
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
        )}
      </section>

      {/* Coming soon in this category */}
      {categoryComingSoon.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold tracking-tight mb-4 text-[var(--text)]">
            {isHi ? `जल्द आ रहे नए ट्रैक: ${catLabel}` : `Emerging Tracks in ${catLabel}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryComingSoon.map((item) => (
              <div
                key={item.id}
                onClick={() => onShowToast(isHi ? 'यह करियर जल्द आ रहा है।' : 'This career track is coming soon.')}
                className="p-4 rounded-xl border flex items-center justify-between gap-3 cursor-pointer opacity-80 hover:opacity-100 transition-opacity bg-[var(--bg2)] border-[var(--border)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg border border-[var(--border2)] bg-[var(--bg3)] flex items-center justify-center text-[var(--text)]">
                    <CareerSvgIcon id={item.id} category={item.category} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[var(--text)]">{t(item, 'title', lang)}</div>
                    <div className="text-[11px] font-mono text-[var(--text3)]">{catLabel}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded border border-[var(--border2)] bg-[var(--bg3)] text-[var(--text2)]">
                  {isHi ? 'जल्द आ रहा है' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
