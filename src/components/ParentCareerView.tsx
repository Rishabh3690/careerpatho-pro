import React, { useState, useMemo } from 'react';
import { ParentCareer, CareersDatabase, Language } from '../data/types';
import { t, tr, fmtDate } from '../utils/careerEngine';
import { ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { CareerSvgIcon } from './CareerSvgIcon';
import { CareerCard } from './CareerCard';

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

  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const childList = useMemo(
    () =>
      (parent.children || [])
        .map((cid) => careersData.children[cid])
        .filter(Boolean),
    [parent.children, careersData.children]
  );

  const filteredChildren = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return childList;
    return childList.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        (ch.titleHindi || '').toLowerCase().includes(q) ||
        (ch.tagline || '').toLowerCase().includes(q) ||
        (ch.eligibility?.streams || []).join(' ').toLowerCase().includes(q)
    );
  }, [childList, query]);

  const visibleChildren = showAll || query.trim().length > 0 ? filteredChildren : filteredChildren.slice(0, 9);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <div className="flex flex-wrap items-center gap-2 mb-5 no-print">
        <a
          href="#/careers"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{tr(lang, 'BACK TO ALL PARENT SECTIONS', 'सभी मुख्य वर्गों पर वापस जाएं')}</span>
        </a>
        <a
          href="#/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors"
        >
          <span>{tr(lang, 'HOME', 'होम')}</span>
        </a>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-2 text-xs font-mono text-[var(--text3)] mb-6 no-print">
        <a href="#/" className="hover:text-[var(--text)] hover:underline">
          {tr(lang, 'Home', 'होम')}
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
      <header className="mb-6 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text)]">
            {tr(lang, 'PARENT CAREER HUB', 'मुख्य करियर हब')}
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[11px] font-mono text-[var(--text2)]">
            {childList.length} {tr(lang, 'Career Options Inside', 'करियर विकल्प उपलब्ध')}
          </span>
          <span className="px-2.5 py-1 rounded-lg border badge-nov11-subtle text-[11px] font-mono font-bold">
            {tr(lang, 'All Careers Updated: 11 Nov 2026', 'सभी करियर अपडेटेड: 11 नवंबर 2026')}
          </span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center mb-4">
          <CareerSvgIcon id={parent.id} category={parent.category} className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2 break-words">
          {title}
        </h1>
        <p className="text-base text-[var(--text2)] leading-relaxed max-w-3xl break-words">
          {tagline}
        </p>
      </header>

      {/* Plain-Language Beginner Explanation Box */}
      <div className="rounded-2xl border-2 border-[var(--border2)] p-5 sm:p-6 mb-8 bg-[var(--bg2)] text-sm leading-relaxed text-[var(--text)] space-y-3">
        <div className="flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-wider text-[var(--text)]">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>
            {isHi
              ? 'सरल भाषा में समझें (नए छात्रों और अभिभावकों के लिए)'
              : 'PLAIN-LANGUAGE GUIDE FOR STUDENTS & PARENTS (ZERO TECHNICAL JARGON)'}
          </span>
        </div>
        <p className="text-[var(--text2)] break-words">{overview}</p>
        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text2)]">
          <strong className="text-[var(--text)]">
            {isHi ? 'कैसे चुनें और ध्यान रखने योग्य सच: ' : 'How to read these cards & honest salary truth: '}
          </strong>
          {isHi
            ? 'नीचे किसी भी कार्ड पर क्लिक करने से आपको (1) 12वीं में कौन सा विषय चाहिए, (2) कुल कॉलेज फीस, (3) प्रवेश परीक्षा और (4) शुरुआती इन-हैंड सैलरी की पूरी जानकारी सरल शब्दों में मिलेगी। याद रखें: कोई भी डिग्री अपने आप नौकरी या वेतन की गारंटी नहीं देती।'
            : 'Click any career card below to see in simple words: (1) Required Class 12 subjects, (2) Total college fee, (3) Entrance exam name, and (4) Realistic monthly bank salary vs CTC. Remember: no college degree guarantees a fixed salary automatically.'}
        </div>
      </div>

      {/* Search & Easy Step-by-Step View inside Parent Hub */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              {tr(lang, 'Specialized Career Pathways in This Section', 'इस वर्ग के अंतर्गत करियर विकल्प')}
            </h2>
            <p className="text-xs font-mono text-[var(--text2)] mt-0.5">
              {isHi
                ? `कुल ${filteredChildren.length} में से ${visibleChildren.length} करियर दिख रहे हैं (ताकि आप आसानी से पढ़ सकें)`
                : `Showing ${visibleChildren.length} of ${filteredChildren.length} careers in this parent section`}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text3)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHi ? 'इस वर्ग में करियर खोजें...' : 'Filter careers in this section...'}
              className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--text)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleChildren.map((ch) => (
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

        {filteredChildren.length > 9 && !query.trim() && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="min-h-[46px] px-6 py-2.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] text-[var(--text)] text-xs font-mono font-extrabold hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
            >
              {showAll
                ? isHi
                  ? 'संक्षिप्त दृश्य दिखाएं (शुरुआती 9 करियर)'
                  : 'Show Compact Beginner View (Top 9 Careers)'
                : isHi
                ? `इस वर्ग के सभी ${filteredChildren.length} करियर दिखाएं →`
                : `Show All ${filteredChildren.length} Careers in This Parent Section →`}
            </button>
          </div>
        )}
      </section>

      <div className="pt-4 border-t border-[var(--border)] text-xs font-mono text-[var(--text3)]">
        {tr(
          lang,
          `Last verified: ${fmtDate(parent.lastVerified || '2026-11')} · Independent Student Guide (No Salary Guarantee)`,
          `अंतिम सत्यापन: ${fmtDate(parent.lastVerified || '2026-11')} · स्वतंत्र छात्र संसाधन (कोई वेतन गारंटी नहीं)`
        )}
      </div>
    </div>
  );
};
