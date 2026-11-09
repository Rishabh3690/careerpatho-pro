import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CareersDatabase, Language } from '../data/types';
import { scoreCareerFuzzyMatch, t } from '../utils/careerEngine';
import { navigateToHash } from '../utils/hashRouter';
import { Search, X, ArrowRight, Compass, GitCompare, MessageSquare, ShieldCheck, AlertTriangle, CornerDownLeft } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CareersDatabase;
  lang: Language;
}

interface PaletteResultItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badgeText: string;
  badgeVariant: 'verified' | 'unverified' | 'nov11' | 'neutral';
  icon?: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  data,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const results: PaletteResultItem[] = useMemo(() => {
    const q = query.trim();
    if (!q) {
      const quickTools: PaletteResultItem[] = [
        {
          id: 'tool-explore',
          title: isHi ? 'सभी 395+ करियर खोजें (10 मुख्य वर्ग)' : 'Explore All 395+ Careers (10 Parent Sections)',
          subtitle: isHi ? 'सरकारी, इंजीनियरिंग, मेडिकल, कृषि, कॉमर्स और वोकेशनल' : 'Filter by Class 10/12 stream, fee, salary & Govt verification',
          href: '#/careers',
          badgeText: '11 Nov 2026',
          badgeVariant: 'nov11',
          icon: '🧭',
        },
        {
          id: 'tool-quiz',
          title: isHi ? '25-प्रश्न करियर मूल्यांकन क्विज़' : '25-Question Career Assessment Calculator',
          subtitle: isHi ? 'अपनी रुचि, बजट और स्ट्रीम के अनुसार सही करियर चुनें' : 'Find your best-fit career roadmap based on stream, budget & work style',
          href: '#/talent-quiz',
          badgeText: isHi ? 'निःशुल्क टूल' : 'Interactive Quiz',
          badgeVariant: 'neutral',
          icon: '🎯',
        },
        {
          id: 'tool-compare',
          title: isHi ? 'दो करियर की आमने-सामने तुलना करें' : 'Compare 2 Careers Side-by-Side',
          subtitle: isHi ? 'फीस, शुरुआती वेतन, परीक्षा और कार्य-जीवन संतुलन की तुलना' : 'Compare fees, realistic PLFS entry pay, exams & ROI',
          href: '#/compare?c1=btech-cse&c2=bca-software',
          badgeText: 'Compare',
          badgeVariant: 'neutral',
          icon: '⚖️',
        },
        {
          id: 'tool-agri',
          title: isHi ? 'कृषि, फूड-टेक और ग्रीन सस्टेनेबिलिटी (22+ करियर)' : 'Agriculture, Food Tech & Green Sustainability Hub (22+ Careers)',
          subtitle: isHi ? 'ICAR, NABARD ग्रेड-A, IBPS AFO, डेयरी और एग्री-बिजनेस' : 'ICAR B.Sc Agri, NABARD Grade-A, IBPS AFO, Dairy Tech & Carbon Markets',
          href: '#/career/p-agri-sustainability',
          badgeText: isHi ? 'नया मुख्य वर्ग' : '10th Parent Section',
          badgeVariant: 'verified',
          icon: '🌾',
        },
        {
          id: 'tool-feedback',
          title: isHi ? 'बग रिपोर्ट करें या सुझाव भेजें (3 विकल्प)' : 'Report a Bug, Career Misinfo, or Suggestion',
          subtitle: isHi ? 'सीधे ऋषभ की लाइव गूगल शीट से सिंक किया गया' : '3 simple options synced directly to our live Google Sheet',
          href: '#/feedback',
          badgeText: 'Live Sheet Sync',
          badgeVariant: 'neutral',
          icon: '📬',
        },
      ];

      const featuredIds = ['btech-cse', 'mbbs-clinical', 'ca-audit', 'ba-llb-corp', 'upsc-ias', 'agri-nabard-grade-a'];
      const featuredCareers: PaletteResultItem[] = featuredIds
        .map((cid) => data.children[cid])
        .filter(Boolean)
        .map((c) => ({
          id: c.id,
          title: t(c, 'title', lang),
          subtitle: `${c.salaryInr?.entry?.split('Source:')[0]?.trim() || '₹3–12 LPA'} · Updated 11 Nov 2026`,
          href: `#/career/${c.id}`,
          badgeText: c.dataVerified
            ? isHi
              ? 'सरकारी स्रोत'
              : 'Govt Source Cited'
            : isHi
            ? 'बाज़ार अनुमान'
            : 'Market Estimate',
          badgeVariant: c.dataVerified ? 'verified' : 'unverified',
          icon: c.icon || '📌',
        }));

      return [...quickTools, ...featuredCareers];
    }

    const scoredChildren = Object.values(data.children || {})
      .map((c) => ({
        career: c,
        score: scoreCareerFuzzyMatch(c, q),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ career }): PaletteResultItem => ({
        id: career.id,
        title: t(career, 'title', lang),
        subtitle: `${career.directoryCategory || career.category} · ${
          career.salaryInr?.entry?.split('Source:')[0]?.trim() || 'See realistic pay range'
        }`,
        href: `#/career/${career.id}`,
        badgeText: career.dataVerified
          ? isHi
            ? 'सरकारी स्रोत'
            : 'Govt Source Cited'
          : isHi
          ? 'बाज़ार अनुमान'
          : 'Market Estimate',
        badgeVariant: career.dataVerified ? 'verified' : 'unverified',
        icon: career.icon || '📘',
      }));

    return scoredChildren;
  }, [query, data, lang, isHi]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        navigateToHash(results[selectedIndex].href);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isHi ? 'त्वरित करियर खोज (Command Palette)' : 'Instant Career Command Palette'}
      data-testid="command-palette-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/75 backdrop-blur-sm animate-fadeIn no-print"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[var(--border2)] bg-[var(--surface)] text-[var(--text)] surface-ambient overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--bg2)]">
          <Search className="w-5 h-5 text-[var(--text2)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            data-testid="command-palette-input"
            placeholder={
              isHi
                ? '395+ करियर, परीक्षा (JEE, NEET, CLAT, ICAR, CA) या टूल खोजें...'
                : 'Search 395+ careers, exams (JEE, NEET, CLAT, ICAR, CA, UPSC) or tools...'
            }
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[var(--text)] placeholder:text-[var(--text3)] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="px-2 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono text-[var(--text2)] hover:text-[var(--text)] cursor-pointer shrink-0"
            >
              {isHi ? 'साफ़ करें' : 'Clear'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Command Palette"
            data-testid="command-palette-close"
            className="min-h-[36px] px-2.5 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-mono font-bold text-[var(--text2)] hover:text-[var(--text)] cursor-pointer shrink-0 flex items-center gap-1"
          >
            <span>ESC</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[65vh] overflow-y-auto divide-y divide-[var(--border)]">
          {results.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[var(--text)]">
                {isHi
                  ? `"${query}" के लिए कोई करियर नहीं मिला`
                  : `No career matched "${query}"`}
              </p>
              <p className="text-xs text-[var(--text2)]">
                {isHi
                  ? 'B.Tech, MBBS, CA, Law, Design, Nursing, Agriculture, या NDA खोजकर देखें।'
                  : 'Try searching B.Tech, MBBS, CA, Law, Design, Nursing, Agriculture, or NDA.'}
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToHash(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 transition-colors ${
                    isSelected ? 'bg-[var(--bg3)]' : 'hover:bg-[var(--bg2)]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">
                      {item.icon || '📘'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[var(--text)] truncate">
                          {item.title}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${
                            item.badgeVariant === 'verified'
                              ? 'badge-verified-subtle'
                              : item.badgeVariant === 'unverified'
                              ? 'badge-unverified-subtle'
                              : item.badgeVariant === 'nov11'
                              ? 'badge-nov11-subtle'
                              : 'border-[var(--border2)] bg-[var(--bg)] text-[var(--text2)]'
                          }`}
                        >
                          {item.badgeVariant === 'verified' && <ShieldCheck className="w-3 h-3 shrink-0" />}
                          {item.badgeVariant === 'unverified' && <AlertTriangle className="w-3 h-3 shrink-0" />}
                          {item.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text2)] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text3)] shrink-0">
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[var(--text)]" />}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg2)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[var(--text2)]">
          <div className="flex items-center gap-3">
            <span>↑↓ {isHi ? 'चुनें' : 'Navigate'}</span>
            <span>↵ {isHi ? 'खोलें' : 'Open'}</span>
            <span>ESC {isHi ? 'बंद करें' : 'Close'}</span>
          </div>
          <span className="badge-nov11-subtle px-2 py-0.5 rounded border font-bold">
            {isHi ? 'सभी 395+ करियर अपडेटेड: 11 नवंबर 2026' : 'All 395+ Careers Updated: 11 Nov 2026'}
          </span>
        </div>
      </div>
    </div>
  );
};
