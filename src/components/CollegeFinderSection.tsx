import React, { useState } from 'react';
import { ChildCareer, Language } from '../data/types';
import { tr } from '../utils/careerEngine';
import { Search, MapPin, Award, IndianRupee, GraduationCap, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CollegeFinderSectionProps {
  career: ChildCareer;
  lang: Language;
}

export const CollegeFinderSection: React.FC<CollegeFinderSectionProps> = ({
  career,
  lang,
}) => {
  const colleges = career.topColleges || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Govt' | 'Private'>('All');

  const filteredColleges = colleges.filter((col) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      col.name.toLowerCase().includes(q) ||
      col.location.toLowerCase().includes(q) ||
      col.examRequired.toLowerCase().includes(q);
    if (!matchQuery) return false;
    if (selectedType === 'Govt' && !col.type.includes('Govt')) return false;
    if (selectedType === 'Private' && !col.type.includes('Private')) return false;
    return true;
  });

  // UPGRADE 3: Government Fees vs. Private Fees Side-by-Side Comparison
  const govtFeeRange =
    career.category === 'medical'
      ? '₹6,800 – ₹1.2 Lakhs (Full 5.5 Yrs)'
      : career.category === 'engineering'
      ? '₹40,000 – ₹5.5 Lakhs (Full 4 Yrs)'
      : '₹15,000 – ₹1.2 Lakhs (Full Degree)';

  const privateFeeRange =
    career.category === 'medical'
      ? '₹55 Lakhs – ₹90 Lakhs (Debt Trap Alert)'
      : career.category === 'engineering'
      ? '₹15 Lakhs – ₹24 Lakhs (Debt Trap Alert)'
      : '₹8 Lakhs – ₹18 Lakhs (High Tuition)';

  return (
    <div className="rounded-2xl border p-6 sm:p-8 mb-10 bg-[var(--bg2)] border-[var(--border)] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--text3)] mb-1">
            {tr(
              lang,
              'INSTITUTIONAL BENCHMARKS • FEES & CUTOFFS CHANGE ANNUALLY (NOT GUARANTEED)',
              'GOVT vs PRIVATE COLLEGE FEES • VERIFY ON OFFICIAL BROCHURE',
              'शीर्ष कॉलेज, कटऑफ और फीस तुलना (प्रतिवर्ष परिवर्तनशील)'
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[var(--text)]" />
            <span>
              {tr(
                lang,
                'Premier Colleges, Cutoffs & Fee Debt-Trap Explorer',
                'Top Colleges, Cutoffs & Govt vs Private Fees Explorer',
                'प्रमुख कॉलेज, प्रवेश कटऑफ और कुल फीस अन्वेषक'
              )}
            </span>
          </h3>
        </div>

        {/* Filter Buttons (48px min height for mobile UX) */}
        <div className="flex items-center gap-2 no-print text-xs font-mono">
          {(['All', 'Govt', 'Private'] as const).map((typeKey) => (
            <button
              key={typeKey}
              type="button"
              onClick={() => setSelectedType(typeKey)}
              className={`min-h-[48px] px-3.5 py-2 rounded-xl border font-semibold transition-colors cursor-pointer ${
                selectedType === typeKey
                  ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                  : 'bg-[var(--bg3)] text-[var(--text2)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {typeKey === 'All'
                ? tr(lang, 'All', 'सभी')
                : typeKey === 'Govt'
                ? tr(lang, 'Govt / INI', 'सरकारी / INI')
                : tr(lang, 'Private / State', 'प्राइवेट / राज्य')}
            </button>
          ))}
        </div>
      </div>

      {/* UPGRADE 3: Side-by-Side Government Fees vs. Private Fees Comparison Banner */}
      <div
        data-testid="govt-vs-private-fee-comparison"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)]"
      >
        <div className="p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase">
              {tr(lang, '🏛️ GOVERNMENT / CENTRAL COLLEGE FEES', '🏛️ SARKARI / CENTRAL COLLEGE FEES', '🏛️ सरकारी / केंद्रीय कॉलेज फीस')}
            </span>
            <span className="text-[11px] font-mono font-bold text-[var(--text)]">HIGH ROI • ZERO DEBT</span>
          </div>
          <div className="text-lg sm:text-xl font-mono font-extrabold text-[var(--text)] mt-1">
            {govtFeeRange}
          </div>
          <p className="text-xs text-[var(--text2)] mt-1">
            {tr(
              lang,
              '100% fee recovery within 2–5 months of first salary. Full PM-Vidyalaxmi & NSP scholarship support.',
              'Pehli job ke 2–5 mahine ki salary mein poori fees vasool! Zero education loan stress.',
              'पहली नौकरी के 2–5 महीनों के वेतन में पूरी फीस वसूल। शून्य कर्ज का बोझ।'
            )}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-dashed border-[var(--border2)] bg-[var(--bg2)]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="px-2 py-0.5 rounded border border-[var(--border2)] bg-[var(--bg)] text-[var(--text2)] text-[10px] font-mono font-extrabold uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{tr(lang, 'PRIVATE COLLEGE FEES (₹15L DEBT TRAP)', 'PRIVATE COLLEGE FEES (₹15L LOAN TRAP)', 'प्राइवेट कॉलेज फीस (₹15 लाख कर्ज जाल)')}</span>
            </span>
            <span className="text-[11px] font-mono text-[var(--text3)]">EMI ₹18,000+/mo</span>
          </div>
          <div className="text-lg sm:text-xl font-mono font-extrabold text-[var(--text)] mt-1">
            {privateFeeRange}
          </div>
          <p className="text-xs text-[var(--text2)] mt-1">
            {tr(
              lang,
              'Taking a ₹15L+ loan for an unaccredited private college traps families in 10 years of EMI. Always verify NIRF & AICTE approval first.',
              'Bina NIRF/AICTE verify kiye ₹15 Lakh+ private college loan lena 10 saal ka EMI trap ban jata hai.',
              'बिना सोचे-समझे ₹15 लाख+ का प्राइवेट कॉलेज लोन लेने से परिवार 10 साल की EMI के जाल में फंस जाता है।'
            )}
          </p>
        </div>
      </div>

      {/* College Search Bar */}
      <div className="relative mb-5 no-print">
        <div className="flex items-center w-full min-h-[48px] rounded-xl border px-3.5 gap-2.5 bg-[var(--bg)] border-[var(--border2)] focus-within:border-[var(--text)]">
          <Search className="w-4 h-4 text-[var(--text2)] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tr(
              lang,
              'Search colleges by name, entrance exam, or city (e.g. IIT, AIIMS, Delhi)...',
              'कॉलेज, शहर या परीक्षा से खोजें (जैसे IIT, AIIMS, Delhi)...'
            )}
            className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text3)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[40px] px-2 text-xs text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Colleges List Grid */}
      {filteredColleges.length === 0 ? (
        <div className="p-8 text-center text-xs text-[var(--text2)] border border-dashed rounded-xl border-[var(--border)]">
          {tr(lang, 'No institutions matched your search query.', 'कोई कॉलेज नहीं मिला।')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs">
          {filteredColleges.map((col, idx) => {
            const isGovt = col.type.includes('Govt');
            const badges = col.badges && col.badges.length > 0
              ? col.badges.map((b) => b.replace(/Verified/gi, 'Listed'))
              : ['NIRF Listed', 'AICTE / UGC Track'];

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border flex flex-col justify-between transition-all bg-[var(--bg)] border-[var(--border)] hover:border-[var(--text)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-sm text-[var(--text)] leading-snug">
                      {col.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                        isGovt
                          ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                          : 'bg-[var(--bg2)] text-[var(--text2)] border-[var(--border2)]'
                      }`}
                    >
                      {col.type}
                    </span>
                  </div>

                  {/* TRUST UPGRADE: Sarkari Authority Badges ([NIRF Verified], [AICTE Approved], [UGC Recognized]) */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    {Array.from(new Set(badges)).map((b, bIdx) => (
                      <span
                        key={`${b}-${bIdx}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--border2)] bg-[var(--bg2)] text-[10px] font-mono font-bold text-[var(--text)]"
                      >
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span>[{b}]</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[var(--text2)] mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--text3)]" />
                      <span>{col.location}</span>
                    </span>
                    {col.nirfRankTier && (
                      <span className="flex items-center gap-1 font-mono font-semibold text-[var(--text)]">
                        <Award className="w-3 h-3" />
                        <span>{col.nirfRankTier}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-[var(--bg2)] border-[var(--border)] font-mono mb-3">
                    <div>
                      <span className="text-[10px] text-[var(--text3)] block font-sans">
                        {tr(lang, 'Entrance Exam', 'प्रवेश परीक्षा')}
                      </span>
                      <strong className="text-[11px] text-[var(--text)]">{col.examRequired}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text3)] block font-sans">
                        {tr(lang, 'Est. Cutoff', 'अनुमानित कटऑफ')}
                      </span>
                      <strong className="text-[11px] text-[var(--text)]">{col.estCutoff}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[var(--text)] font-mono font-bold tabular-nums">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{col.totalFee}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)]">
                    {tr(lang, 'EST. TOTAL FEE', 'कुल अनुमानित फीस')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Financial Reality Check Note */}
      <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs text-[var(--text2)] leading-relaxed">
        <strong className="text-[var(--text)] font-mono uppercase mr-1.5">
          {tr(lang, 'ROI & NON-GUARANTEE NOTICE:', 'ROI एवं गैर-गारंटी सूचना:')}
        </strong>
        {tr(
          lang,
          'All college fees, entrance cutoffs, and ROI figures shown above are historical estimates only and are NOT guaranteed. Studying at any college (including IITs, NITs, AIIMS, or NLUs) does NOT guarantee a specific salary package or 100% placement. Always verify current-year tuition and placement medians directly on the institution’s official brochure.',
          'ऊपर दिखाई गई सभी कॉलेज फीस, कटऑफ और ROI के आंकड़े केवल ऐतिहासिक अनुमान हैं और किसी भी पैकेज या 100% प्लेसमेंट की गारंटी नहीं देते हैं। किसी भी निर्णय से पहले संबंधित कॉलेज की आधिकारिक वेबसाइट पर वर्तमान वर्ष की फीस और प्लेसमेंट रिपोर्ट अवश्य जांचें।'
        )}
      </div>
    </div>
  );
};
