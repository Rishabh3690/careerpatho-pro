import React, { useState } from 'react';
import { ExamCalendarItem, Language } from '../data/types';
import { fmtDate, tr } from '../utils/careerEngine';
import { ChevronDown, ExternalLink, Layers, CheckCircle2 } from 'lucide-react';

interface ExamCalendarSectionProps {
  exams: ExamCalendarItem[] | undefined;
  lastVerified: string;
  lang: Language;
  category?: string;
}

export const ExamCalendarSection: React.FC<ExamCalendarSectionProps> = ({
  exams,
  lastVerified,
  lang,
  category = 'engineering',
}) => {
  const isHi = lang === 'hi';
  const [isOpen, setIsOpen] = useState(true);

  if (!exams || exams.length === 0) {
    return null;
  }

  const heading = isHi
    ? `प्रवेश परीक्षा कैलेंडर (${exams.length} परीक्षाएं)`
    : `Exam calendar (${exams.length} exams)`;
  const lastVerifiedText = isHi
    ? `अंतिम सत्यापन: ${fmtDate(lastVerified)}`
    : `Last verified: ${fmtDate(lastVerified)}`;

  const now = new Date();

  // PSYCHOLOGY UPGRADE 3: The "Zero Extra Syllabus" Overlap Matrix
  const getZeroExtraSyllabusMatrix = () => {
    if (category === 'medical') {
      return {
        headlineEn:
          'Your NEET-UG preparation already covers 100% of the syllabus for AIIMS Paramedical, AIIMS B.Sc Nursing, and 90% of CUET-UG Biology/Chemistry & IAT IISER. Don\'t let this preparation go to waste.',
        headlineHinglish:
          'Aapki NEET-UG ki taiyari AIIMS Paramedical, AIIMS Nursing ka 100% aur CUET-UG / IAT IISER ka 90% syllabus cover karti hai. Apni mehnat waste mat hone dein!',
        headlineHi:
          'आपकी NEET-UG की तैयारी पहले से ही AIIMS पैरामेडिकल, AIIMS नर्सिंग का 100% और CUET-UG / IISER (IAT) का 90% सिलेबस कवर करती है। अपनी इस मेहनत को व्यर्थ न जाने दें!',
        overlaps: [
          { exam: 'AIIMS Paramedical & Nursing', overlap: '100% Overlap (Zero Extra Syllabus)' },
          { exam: 'CUET-UG (Bio / Pharma / Biotech)', overlap: '95% NCERT Class 12 Overlap' },
          { exam: 'IAT IISER (5-Yr BS-MS Research)', overlap: '85% PCB Core Overlap' },
        ],
      };
    }
    if (category === 'commerce' || category === 'law' || category === 'arts') {
      return {
        headlineEn:
          'Your Class 12 Board & CUET-UG preparation already covers 85%–100% of the syllabus for IPMAT (IIM), CLAT, ICAI CA Foundation, and National University Entrances. Don\'t let this preparation go to waste.',
        headlineHinglish:
          'Aapki Class 12 Board aur CUET-UG ki taiyari IPMAT (IIM), CLAT, aur CA Foundation ka 85%–100% syllabus cover karti hai. Ek hi taiyari se 4 exams dein!',
        headlineHi:
          'आपकी कक्षा 12 बोर्ड और CUET-UG की तैयारी पहले से ही IPMAT (IIM), CLAT और CA फाउंडेशन के 85%–100% सिलेबस को कवर करती है। इस तैयारी को व्यर्थ न जाने दें!',
        overlaps: [
          { exam: 'CUET-UG (DU / BHU / Central Univ)', overlap: '100% Class 12 NCERT Overlap' },
          { exam: 'IPMAT (IIM Indore/Rohtak) & CLAT', overlap: '80% English & Quantitative Overlap' },
          { exam: 'ICAI CA / ICSI CS Foundation', overlap: '90% Commerce & Accounts Overlap' },
        ],
      };
    }
    return {
      headlineEn:
        'Your JEE preparation already covers 100% of the syllabus for BITSAT, VITEEE, and 80% of CUET-UG. Don\'t let this preparation go to waste.',
      headlineHinglish:
        'Aapki JEE preparation already BITSAT, VITEEE, State CETs ka 100% aur CUET-UG ka 80% syllabus cover karti hai. Is mehnat ko waste mat hone dein!',
      headlineHi:
        'आपकी JEE की तैयारी पहले से ही BITSAT, VITEEE, राज्य CETs का 100% और CUET-UG का 80% सिलेबस कवर करती है। अपनी इस तैयारी को व्यर्थ न जाने दें!',
      overlaps: [
        { exam: 'BITSAT / VITEEE / State CETs', overlap: '100% Syllabus Overlap (Zero Extra Study)' },
        { exam: 'CUET-UG (B.Tech / B.Sc Hons / BCA)', overlap: '80% Class 12 PCM Overlap' },
        { exam: 'IAT IISER / NEST (Pure Science)', overlap: '90% PCM Conceptual Overlap' },
      ],
    };
  };

  const matrix = getZeroExtraSyllabusMatrix();

  return (
    <div className="rounded-2xl border p-5 sm:p-6 mb-8 transition-colors bg-[var(--surface)] border-[var(--border)]">
      <button
        type="button"
        id="exam-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] flex items-center justify-between text-left font-bold text-base text-[var(--text)] cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>📅</span>
          <span>{heading}</span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[var(--text-dim)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div id="exam-table-content" className="mt-4 pt-4 border-t border-[var(--border)] space-y-5">
          {/* PSYCHOLOGY UPGRADE 3: The "Zero Extra Syllabus" Matrix */}
          <div
            data-testid="zero-extra-syllabus-matrix"
            className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)]">
              <Layers className="w-4 h-4 shrink-0" />
              <span>
                {tr(
                  lang,
                  'THE "ZERO EXTRA SYLLABUS" MULTI-TRACK MATRIX',
                  'ZERO EXTRA SYLLABUS MATRIX (1 TAIYARI = 4 EXAMS)',
                  'शून्य अतिरिक्त सिलेबस मैट्रिक्स (एक तैयारी से 4 परीक्षाएं)'
                )}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[var(--text)] leading-relaxed">
              {tr(lang, matrix.headlineEn, matrix.headlineHinglish, matrix.headlineHi)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              {matrix.overlaps.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-[var(--border2)] bg-[var(--bg)] flex flex-col justify-between"
                >
                  <div className="font-bold text-[var(--text)] mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.exam}</span>
                  </div>
                  <div className="text-[11px] text-[var(--text2)]">{item.overlap}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-mute)] uppercase text-[10px] tracking-wider bg-[var(--surface-2)]">
                  <th className="py-2.5 px-3">{isHi ? 'परीक्षा' : 'Exam'}</th>
                  <th className="py-2.5 px-3">{isHi ? 'पंजीकरण अवधि' : 'Registration Window'}</th>
                  <th className="py-2.5 px-3">{isHi ? 'आवेदन शुल्क' : 'Application Fees'}</th>
                  <th className="py-2.5 px-3 text-right">{isHi ? 'आधिकारिक पोर्टल' : 'Official Portal'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
                {exams.map((ex, idx) => {
                  let statusBadge = null;
                  if (ex.registerTo) {
                    const regDate = new Date(ex.registerTo);
                    if (!isNaN(regDate.getTime())) {
                      const diffDays = Math.ceil((regDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      if (diffDays < 0) {
                        statusBadge = (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded font-bold mt-1 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-dim)]">
                            {isHi ? 'अगले सत्र की जांच करें' : 'Last cycle — check for next'}
                          </span>
                        );
                      } else if (diffDays <= 7) {
                        statusBadge = (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded font-bold mt-1 bg-red-500 text-white animate-pulse">
                            {isHi ? 'अभी आवेदन करें' : 'Register now'}
                          </span>
                        );
                      }
                    }
                  }

                  const regText = ex.registerFrom && ex.registerTo ? `${ex.registerFrom} – ${ex.registerTo}` : ex.registerTo || ex.registerFrom || 'TBA';

                  return (
                    <tr key={idx} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold">{ex.name}</div>
                        {statusBadge}
                      </td>
                      <td className="py-3 px-3 font-mono-num text-[var(--text-dim)]">
                        {regText}
                      </td>
                      <td className="py-3 px-3 text-[var(--text-dim)]">
                        {ex.fees || 'Check Portal'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={ex.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[40px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-2)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors border border-[var(--border)]"
                        >
                          <span>{isHi ? 'पोर्टल' : 'Portal'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] mt-3 text-[var(--text-mute)] border-t border-[var(--border)] pt-2">
            {lastVerifiedText}
          </div>
        </div>
      )}
    </div>
  );
};
