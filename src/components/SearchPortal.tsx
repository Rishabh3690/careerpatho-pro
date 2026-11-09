import React, { useState, useEffect, useRef } from 'react';
import { CareersDatabase, Language, CareerSearchFilters } from '../data/types';
import { searchCareers, t } from '../utils/careerEngine';
import { Search, Filter, X } from 'lucide-react';

interface SearchPortalProps {
  data: CareersDatabase;
  lang: Language;
  filters: CareerSearchFilters;
  onFilterChange: (newFilters: CareerSearchFilters) => void;
  onSelectCareer: (careerId: string) => void;
  resultCount: number;
}

export const SearchPortal: React.FC<SearchPortalProps> = ({
  data,
  lang,
  filters,
  onFilterChange,
  onSelectCareer,
  resultCount,
}) => {
  const isHi = lang === 'hi';
  const [isFocused, setIsFocused] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = searchCareers(data, filters.query, lang);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement !== searchInputRef.current)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const streams = ['All', 'PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'Vocational'];

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 no-print">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="flex items-center w-full min-h-[54px] rounded-xl border shadow-sm px-4 gap-3 bg-[var(--surface)] border-[var(--border)] focus-within:border-[var(--accent)] transition-all">
          <Search className="w-5 h-5 text-[var(--text-dim)] shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            id="home-search"
            value={filters.query}
            onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={isHi ? 'करियर खोजें... (उदा. Software, Doctor, Pilot, Law)' : 'Search careers... (e.g., Software, Doctor, Pilot, Law)'}
            autoComplete="off"
            className="w-full bg-transparent text-[var(--text)] outline-none text-base placeholder:text-[var(--text-mute)]"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, query: '' })}
              className="p-1 rounded text-[var(--text-dim)] hover:text-[var(--text)]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shrink-0 transition-colors ${
              showAdvanced || filters.category !== 'All' || filters.stream !== 'All'
                ? 'bg-[var(--accent)] text-white border-transparent'
                : 'bg-[var(--surface-2)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{isHi ? 'फिल्टर' : 'Filters'}</span>
          </button>
        </div>

        {/* Dropdown Instant Suggestions */}
        {isFocused && filters.query.trim().length >= 2 && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 rounded-xl border shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto bg-[var(--surface)] border-[var(--border)]">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--text-dim)]">
                {isHi ? 'कोई परिणाम नहीं। दूसरी स्पेलिंग आज़माएं।' : 'No results. Try a different spelling.'}
              </div>
            ) : (
              searchResults.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onMouseDown={() => {
                    if (item.type === 'Career') {
                      onSelectCareer(item.id);
                    } else {
                      window.location.hash = item.url;
                    }
                  }}
                  className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-[var(--surface-2)] border-[var(--border)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-[var(--text)]">{item.title}</div>
                      {item.tagline && <div className="text-xs text-[var(--text-dim)] line-clamp-1">{item.tagline}</div>}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text-dim)]">
                    {item.typeLabel}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="mt-3 p-4 rounded-xl border bg-[var(--surface)] border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-[var(--text-dim)]">
              {isHi ? 'स्ट्रीम (Stream)' : 'Stream'}
            </label>
            <select
              value={filters.stream}
              onChange={(e) => onFilterChange({ ...filters, stream: e.target.value })}
              className="w-full min-h-[38px] px-2.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
            >
              {streams.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? (isHi ? 'सभी स्ट्रीम्स (All Streams)' : 'All Streams') : s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[var(--text-dim)]">
              {isHi ? 'कैटेगरी (Category)' : 'Category'}
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="w-full min-h-[38px] px-2.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
            >
              <option value="All">{isHi ? 'सभी कैटेगरी (All Categories)' : 'All Categories'}</option>
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c, 'label', lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[var(--text-dim)]">
              {isHi ? 'सॉर्ट करें (Sort By)' : 'Sort By'}
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as CareerSearchFilters['sortBy'] })}
              className="w-full min-h-[38px] px-2.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
            >
              <option value="relevance">{isHi ? 'प्रासंगिकता (Relevance)' : 'Relevance'}</option>
              <option value="salary-high">{isHi ? 'उच्चतम वेतन (Highest Starting Salary)' : 'Highest Starting Salary'}</option>
              <option value="roi-high">{isHi ? 'सर्वोत्तम ROI (Highest ROI Ratio)' : 'Highest ROI'}</option>
              <option value="alphabetical">{isHi ? 'वर्णमाला (A-Z)' : 'Alphabetical (A-Z)'}</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Status Bar */}
      <div className="flex items-center justify-between text-xs mt-2 px-1 text-[var(--text-dim)]">
        <span>
          {isHi ? `${resultCount} करियर उपलब्ध` : `${resultCount} careers found`}
        </span>
        {(filters.query || filters.category !== 'All' || filters.stream !== 'All') && (
          <button
            type="button"
            onClick={() => onFilterChange({ query: '', category: 'All', stream: 'All', audience: 'All', minSalaryLakhs: 0, sortBy: 'relevance' })}
            className="text-[var(--accent)] hover:underline font-semibold"
          >
            {isHi ? 'सभी फिल्टर रीसेट करें' : 'Reset all filters'}
          </button>
        )}
      </div>
    </div>
  );
};
