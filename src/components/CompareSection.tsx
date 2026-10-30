import React, { useState, useEffect } from 'react';
import { CareersDatabase, Language } from '../data/types';
import {
  t,
  tr,
  loadPreference,
  savePreference,
  getFormalDesignation,
} from '../utils/careerEngine';
import { ArrowLeftRight, Printer, Share2, Check, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface CompareSectionProps {
  data: CareersDatabase;
  lang: Language;
  initialCareerId1?: string;
  initialCareerId2?: string;
  isFullPage?: boolean;
  onShowToast: (msg: string) => void;
}

// Helper to resolve shorthand career IDs in URLs like ?c1=btech-cse&c2=bca
export function resolveCareerAlias(data: CareersDatabase, rawId?: string): string {
  if (!rawId) return '';
  const clean = rawId.trim().toLowerCase();
  if (data.children[clean]) return clean;
  const aliases: Record<string, string> = {
    bca: 'bca-software',
    btech: 'btech-cse',
    cse: 'btech-cse',
    mbbs: 'mbbs-clinical',
    ca: 'ca-audit',
    cs: 'cs-corporate',
    mba: 'mba-marketing-pm',
    bcom: 'bcom-finance',
    llb: 'ba-llb-corp',
    law: 'ba-llb-corp',
    ias: 'upsc-ias',
    upsc: 'upsc-ias',
    bdes: 'b-des-product',
    pilot: 'pilot-cpl',
  };
  if (aliases[clean] && data.children[aliases[clean]]) {
    return aliases[clean];
  }
  const prefixMatch = Object.keys(data.children).find((k) => k.startsWith(clean));
  return prefixMatch || '';
}

export const CompareSection: React.FC<CompareSectionProps> = ({
  data,
  lang,
  initialCareerId1,
  initialCareerId2,
  isFullPage = false,
  onShowToast,
}) => {
  const isHi = lang === 'hi';
  const allChildren = Object.values(data.children || {});

  const sortedCareers = [...allChildren].sort((a, b) =>
    t(a, 'title', lang).localeCompare(t(b, 'title', lang))
  );

  const savedCompare = loadPreference<string[]>('careerpatho-compare', []);
  const resolvedInit1 = resolveCareerAlias(data, initialCareerId1);
  const resolvedInit2 = resolveCareerAlias(data, initialCareerId2);

  const [careerId1, setCareerId1] = useState<string>(
    resolvedInit1 ||
      (savedCompare[0] && data.children?.[savedCompare[0]]
        ? savedCompare[0]
        : 'btech-cse')
  );
  const [careerId2, setCareerId2] = useState<string>(
    resolvedInit2 ||
      (savedCompare[1] && data.children?.[savedCompare[1]]
        ? savedCompare[1]
        : 'bca-software')
  );
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (resolvedInit1) setCareerId1(resolvedInit1);
    if (resolvedInit2) setCareerId2(resolvedInit2);
  }, [resolvedInit1, resolvedInit2]);

  useEffect(() => {
    if (careerId1 && careerId2) {
      savePreference('careerpatho-compare', [careerId1, careerId2]);
    }
  }, [careerId1, careerId2]);

  if (sortedCareers.length < 2) {
    return null;
  }

  const c1 = data.children?.[careerId1] || sortedCareers[0];
  const c2 = data.children?.[careerId2] || sortedCareers[1];

  const handleSwap = () => {
    const temp = careerId1;
    setCareerId1(careerId2);
    setCareerId2(temp);
  };

  const handleSelect1 = (id: string) => {
    if (id === careerId2) {
      onShowToast(isHi ? 'दो अलग-अलग करियर चुनें' : 'Pick two different careers');
    }
    setCareerId1(id);
  };

  const handleSelect2 = (id: string) => {
    if (id === careerId1) {
      onShowToast(isHi ? 'दो अलग-अलग करियर चुनें' : 'Pick two different careers');
    }
    setCareerId2(id);
  };

  // UPGRADE 4: Stateless URL Comparison Sharing (#/compare?c1=btech-cse&c2=bca-software)
  const shareHash = `#/compare?c1=${encodeURIComponent(c1.id)}&c2=${encodeURIComponent(c2.id)}`;
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${shareHash}`
      : `https://careerpatho.in/${shareHash}`;

  const handleShareComparison = () => {
    if (typeof window !== 'undefined') {
      window.location.hash = shareHash;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        onShowToast(
          tr(
            lang,
            `Shareable Comparison Link copied! (${shareHash})`,
            `Comparison Link copy ho gaya! Parents ko WhatsApp par bhejein (${shareHash})`,
            `तुलना लिंक कॉपी हो गया! माता-पिता के साथ साझा करें (${shareHash})`
          )
        );
      });
    } else {
      onShowToast(`Share link ready: ${shareHash}`);
    }
  };

  const getFirstSalary = (c?: typeof c1) => {
    if (!c) return 'Not listed';
    if (c.salaryInr?.entry) return c.salaryInr.entry;
    if (c.roadmap) {
      for (const step of c.roadmap) {
        if (step.details?.salaryInr?.entry) return step.details.salaryInr.entry;
      }
    }
    return c.entrySalaryLakhs ? `₹${c.entrySalaryLakhs} LPA` : '₹6–12 LPA';
  };

  const getStrategicSafetyNet = (c?: typeof c1) => {
    if (!c?.roadmap) return isHi ? 'उपलब्ध' : 'Multi-Track Eligible';
    for (const step of c.roadmap) {
      if (step.planB && step.planB.length > 0) {
        return t(step.planB[0], 'reason', lang);
      }
    }
    return isHi
      ? 'CUET / राज्य विश्वविद्यालय व सरकारी परीक्षा पात्रता'
      : 'State/Central University + UPSC/SSC/Bank PO Eligibility';
  };

  const getCategoryLabel = (catId?: string) => {
    const found = data.categories.find((cat) => cat.id === catId);
    return found ? t(found, 'label', lang) : catId || '';
  };

  return (
    <section
      id="compare-careers-section"
      data-testid="compare-careers-section"
      className={`rounded-2xl border p-6 sm:p-7 mb-10 transition-colors bg-[var(--surface)] border-[var(--border2)] ${
        isFullPage ? 'shadow-2xl' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[var(--border)]">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text3)] mb-1">
            {tr(
              lang,
              'STATELESS SIDE-BY-SIDE COMPARISON • ZERO LOGIN • INSTANT PARENT SHARE LINK',
              'SIDE-BY-SIDE CAREER COMPARISON • PARENTS KE SAATH LINK SHARE KAREIN',
              'दो करियर की सीधी तुलना • बिना लॉगिन अभिभावकों के साथ साझा करें'
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]">
            {tr(
              lang,
              'Compare Careers Side-by-Side',
              'Compare 2 Careers Side-by-Side (Fees, Salary & Sarkari Scope)',
              'दो करियर विकल्पों की सीधी तुलना करें'
            )}
          </h2>
        </div>

        {/* Share Comparison Button */}
        <button
          type="button"
          data-testid="share-comparison-btn"
          onClick={handleShareComparison}
          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shrink-0 self-start sm:self-center"
        >
          {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>
            {copiedLink
              ? tr(lang, 'Comparison Link Copied!', 'Link Copy Ho Gaya!', 'लिंक कॉपी हो गया!')
              : tr(lang, 'Share Comparison Link', 'Share Comparison (Parents Link)', 'तुलना लिंक शेयर करें')}
          </span>
        </button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 no-print text-xs">
        <div>
          <label
            htmlFor="compare-sel-1"
            className="block font-mono font-bold uppercase text-[10px] tracking-wider mb-1.5 text-[var(--text-dim)]"
          >
            {isHi ? 'करियर विकल्प 1 चुनें' : 'Select Career 1'}
          </label>
          <select
            id="compare-sel-1"
            value={c1.id}
            onChange={(e) => handleSelect1(e.target.value)}
            className="w-full min-h-[48px] px-3.5 rounded-xl border bg-[var(--surface-2)] border-[var(--border2)] text-[var(--text)] outline-none font-bold text-xs sm:text-sm"
          >
            {sortedCareers.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {getFormalDesignation(ch, lang)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="compare-sel-2"
            className="block font-mono font-bold uppercase text-[10px] tracking-wider mb-1.5 text-[var(--text-dim)]"
          >
            {isHi ? 'करियर विकल्प 2 चुनें' : 'Select Career 2'}
          </label>
          <select
            id="compare-sel-2"
            value={c2.id}
            onChange={(e) => handleSelect2(e.target.value)}
            className="w-full min-h-[48px] px-3.5 rounded-xl border bg-[var(--surface-2)] border-[var(--border2)] text-[var(--text)] outline-none font-bold text-xs sm:text-sm"
          >
            {sortedCareers.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {getFormalDesignation(ch, lang)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shareable URL Preview Strip */}
      <div className="mb-4 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[var(--text2)] truncate">
          {isHi ? 'शेयर करने योग्य लिंक:' : 'Instant Parent Share URL:'}{' '}
          <strong className="text-[var(--text)]">{shareHash}</strong>
        </span>
        <div className="flex items-center gap-3">
          <a
            href={`#/career/${c1.id}`}
            className="underline font-bold text-[var(--text)] inline-flex items-center gap-0.5"
          >
            <span>{t(c1, 'title', lang).split(' ')[0]}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href={`#/career/${c2.id}`}
            className="underline font-bold text-[var(--text)] inline-flex items-center gap-0.5"
          >
            <span>{t(c2, 'title', lang).split(' ')[0]}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Comparison Table */}
      {c1 && c2 && (
        <div className="overflow-x-auto rounded-xl border border-[var(--border2)] mb-5">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border2)] bg-[var(--surface-2)] text-[var(--text-dim)] font-bold">
                <th className="p-3.5 w-1/4">{isHi ? 'मापदंड (Metric)' : 'Metric'}</th>
                <th className="p-3.5 w-3/8 text-[var(--text)] font-extrabold">
                  {getFormalDesignation(c1, lang)}
                </th>
                <th className="p-3.5 w-3/8 text-[var(--text)] font-extrabold">
                  {getFormalDesignation(c2, lang)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi ? 'सरकारी नौकरी पात्रता' : 'Sarkari Job Eligibility'}
                </td>
                <td className="p-3.5 font-mono font-bold">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>[✅ Eligible for UPSC / SSC / Bank PO]</span>
                  </span>
                </td>
                <td className="p-3.5 font-mono font-bold">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>[✅ Eligible for UPSC / SSC / Bank PO]</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi ? 'शुरुआती पैकेज (Entry CTC)' : 'Starting Salary (Entry)'}
                </td>
                <td className="p-3.5 font-bold font-mono-num">{getFirstSalary(c1)}</td>
                <td className="p-3.5 font-bold font-mono-num">{getFirstSalary(c2)}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi ? 'अनुमानित कुल फीस' : 'Est. Course Fee'}
                </td>
                <td className="p-3.5 font-mono">
                  {t(c1, 'cost', lang) || `₹${c1.avgCourseFeeLakhs || 4} Lakhs`}
                </td>
                <td className="p-3.5 font-mono">
                  {t(c2, 'cost', lang) || `₹${c2.avgCourseFeeLakhs || 3} Lakhs`}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi ? 'अवधि / चरण' : 'Duration / Steps'}
                </td>
                <td className="p-3.5">
                  {t(c1, 'duration', lang) || '3–4 Yrs'} ({c1.roadmap?.length || 0} {isHi ? 'चरण' : 'steps'})
                </td>
                <td className="p-3.5">
                  {t(c2, 'duration', lang) || '3–4 Yrs'} ({c2.roadmap?.length || 0} {isHi ? 'चरण' : 'steps'})
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi ? 'प्रवेश परीक्षाएं' : 'Entrance Exams'}
                </td>
                <td className="p-3.5">{c1.eligibility?.exams?.join(', ') || 'Merit / CUET'}</td>
                <td className="p-3.5">{c2.eligibility?.exams?.join(', ') || 'Merit / CUET'}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi ? 'पात्रता (12वीं)' : 'Stream & Eligibility'}
                </td>
                <td className="p-3.5">
                  {c1.eligibility?.streams?.join('/')} (Min {c1.eligibility?.minPercent}%)
                </td>
                <td className="p-3.5">
                  {c2.eligibility?.streams?.join('/')} (Min {c2.eligibility?.minPercent}%)
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi ? 'श्रेणी' : 'Domain Category'}
                </td>
                <td className="p-3.5">{getCategoryLabel(c1.category)}</td>
                <td className="p-3.5">{getCategoryLabel(c2.category)}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[var(--text-dim)]">
                  {isHi
                    ? 'रणनीतिक सुरक्षा कवच (Strategic Safety Net)'
                    : 'Strategic Safety Net (Multi-Track Insurance)'}
                </td>
                <td className="p-3.5 text-[var(--text-dim)]">{getStrategicSafetyNet(c1)}</td>
                <td className="p-3.5 text-[var(--text-dim)]">{getStrategicSafetyNet(c2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Actions (48px min height, 12px gap) */}
      <div className="flex flex-wrap gap-3 no-print">
        <button
          type="button"
          id="compare-swap-btn"
          onClick={handleSwap}
          className="min-h-[48px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>{isHi ? 'अदला-बदली करें (Swap)' : 'Swap Careers'}</span>
        </button>

        <button
          type="button"
          onClick={handleShareComparison}
          className="min-h-[48px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[var(--text)] text-xs font-bold bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{isHi ? 'तुलना लिंक कॉपी करें' : 'Copy Shareable URL'}</span>
        </button>

        <button
          type="button"
          id="compare-print-btn"
          onClick={() => {
            if (c1 && c2) {
              const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"/><title>${getFormalDesignation(c1, lang)} vs ${getFormalDesignation(c2, lang)} — CareerPathO</title><style>body{font-family:system-ui,sans-serif;padding:24px;color:#000;}table{width:100%;border-collapse:collapse;margin-top:16px;}th,td{border:1px solid #000;padding:10px;text-align:left;}th{background:#f0f0f0;}</style></head><body><h1>CareerPathO Side-by-Side Comparison</h1><p>Shareable Link: https://careerpatho.in/${shareHash}</p><table><thead><tr><th>Metric</th><th>${getFormalDesignation(c1, lang)}</th><th>${getFormalDesignation(c2, lang)}</th></tr></thead><tbody><tr><td>Sarkari Job Eligibility</td><td>✅ Eligible for UPSC / SSC / Bank PO</td><td>✅ Eligible for UPSC / SSC / Bank PO</td></tr><tr><td>Starting Salary</td><td>${getFirstSalary(c1)}</td><td>${getFirstSalary(c2)}</td></tr><tr><td>Exams</td><td>${c1.eligibility?.exams?.join(', ') || 'N/A'}</td><td>${c2.eligibility?.exams?.join(', ') || 'N/A'}</td></tr><tr><td>Strategic Safety Net</td><td>${getStrategicSafetyNet(c1)}</td><td>${getStrategicSafetyNet(c2)}</td></tr></tbody></table><p style="margin-top:16px;font-weight:bold;">Generated via CareerPathO — Free, No Login, No Ads. Data verified via Govt Portals.</p></body></html>`;
              try {
                const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Compare-${c1.id}-vs-${c2.id}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 3000);
              } catch {
                // ignore
              }
            }
            try {
              window.print();
            } catch {
              // ignore sandbox block
            }
            onShowToast(
              isHi
                ? 'तुलना तालिका डाउनलोड हो गई है!'
                : 'Comparison table downloaded & ready to print!'
            );
          }}
          className="min-h-[48px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{isHi ? 'प्रिंट / डाउनलोड करें' : 'Print / Download Comparison'}</span>
        </button>
      </div>
    </section>
  );
};
