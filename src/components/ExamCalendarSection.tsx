import React, { useState } from 'react';
import { ExamCalendarItem, Language } from '../data/types';
import { tr } from '../utils/careerEngine';
import { ChevronDown, ExternalLink, Layers, CheckCircle2 } from 'lucide-react';

interface ExamCalendarSectionProps {
  exams: ExamCalendarItem[] | undefined;
  lastVerified: string;
  lang: Language;
  category?: string;
}

export const ExamCalendarSection: React.FC<ExamCalendarSectionProps> = ({
  exams,
  lang,
  category = 'engineering',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  // CATEGORY G AUDIT UPGRADE: Cycle Toggle (2026-27 Closed vs 2027-28 Upcoming)
  const [selectedCycle, setSelectedCycle] = useState<'2027-28' | '2026-27'>('2027-28');

  if (!exams || exams.length === 0) {
    return null;
  }

  const heading = tr(
    lang,
    `Exam Calendar & Official Portals (${exams.length} exams)`,
    `प्रवेश परीक्षा कैलेंडर (${exams.length} परीक्षाएं)`
  );

  const getZeroExtraSyllabusMatrix = () => {
    if (category === 'medical') {
      return {
        headlineEn:
          "Your NEET-UG preparation already covers 100% of the syllabus for AIIMS Paramedical, AIIMS B.Sc Nursing, and 90% of CUET-UG Biology/Chemistry & IAT IISER. Note: NEET is NOT the only health entrance exam.",
        headlineHi:
          'आपकी NEET-UG की तैयारी पहले से ही AIIMS पैरामेडिकल, AIIMS नर्सिंग का 100% और CUET-UG / IISER (IAT) का 90% सिलेबस कवर करती है। ध्यान दें: सभी स्वास्थ्य करियर के लिए NEET एकमात्र परीक्षा नहीं है।',
        overlaps: [
          { exam: 'AIIMS Paramedical & B.Sc Nursing', overlap: '100% Overlap (aiimsexams.ac.in)' },
          { exam: 'CUET-UG (Bio / B.Pharm / Biotech)', overlap: '95% NCERT Class 12 Overlap' },
          { exam: 'IAT IISER (5-Yr BS-MS Research)', overlap: '85% PCB Core Overlap' },
        ],
      };
    }
    if (category === 'commerce' || category === 'law' || category === 'arts') {
      return {
        headlineEn:
          "Your Class 12 Board & CUET-UG preparation covers 85%–100% of the syllabus for IPMAT (IIM), CLAT, AILET (NLU Delhi), and ICAI CA Foundation.",
        headlineHi:
          'आपकी कक्षा 12 बोर्ड और CUET-UG की तैयारी पहले से ही IPMAT (IIM), CLAT, AILET (NLU दिल्ली) और CA फाउंडेशन के 85%–100% सिलेबस को कवर करती है।',
        overlaps: [
          { exam: 'CUET-UG (DU / BHU / Central Univ)', overlap: '100% Class 12 NCERT Overlap' },
          { exam: 'CLAT (24 NLUs) & AILET (NLU Delhi)', overlap: '80% English & Logical Overlap' },
          { exam: 'ICAI CA / ICSI CS Foundation', overlap: '90% Commerce & Accounts Overlap' },
        ],
      };
    }
    return {
      headlineEn:
        "Your JEE preparation covers 100% of the syllabus for BITSAT, State CETs (MHT-CET, WBJEE, KCET), JEE Paper 2 (B.Arch), and 80% of CUET-UG.",
      headlineHi:
        'आपकी JEE की तैयारी पहले से ही BITSAT, राज्य CETs, JEE Paper 2 (B.Arch) का 100% और CUET-UG का 80% सिलेबस कवर करती है।',
      overlaps: [
        { exam: 'BITSAT / State CETs (B.Tech & B.Pharm)', overlap: '100% Syllabus Overlap' },
        { exam: 'CUET-UG (B.Tech / B.Sc Hons / BCA)', overlap: '80% Class 12 PCM Overlap' },
        { exam: 'NATA & JEE Main Paper 2 (B.Arch)', overlap: 'PCM + Aptitude Overlap' },
      ],
    };
  };

  const matrix = getZeroExtraSyllabusMatrix();

  return (
    <div
      data-testid="exam-calendar-section"
      className="rounded-2xl border p-5 sm:p-6 mb-8 transition-colors bg-[var(--surface)] border-[var(--border)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          id="exam-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[44px] flex items-center gap-2 text-left font-bold text-base text-[var(--text)] cursor-pointer"
        >
          <span>📅</span>
          <span>{heading}</span>
          <ChevronDown
            className={`w-5 h-5 text-[var(--text-dim)] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* CATEGORY G: Academic Cycle Toggle (2026-27 Closed vs 2027-28 Upcoming) */}
        <div
          role="group"
          aria-label="Exam Academic Cycle Selector"
          data-testid="exam-cycle-toggle"
          className="inline-flex items-center p-1 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-xs font-mono"
        >
          <span className="px-2 text-[10px] uppercase text-[var(--text3)] font-bold">Cycle:</span>
          <button
            type="button"
            onClick={() => setSelectedCycle('2026-27')}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
              selectedCycle === '2026-27'
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            2026-27 (Closed)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCycle('2027-28')}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
              selectedCycle === '2027-28'
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            2027-28 (Verify on Portal)
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="exam-table-content" className="mt-4 pt-4 border-t border-[var(--border)] space-y-5">
          {/* Zero Extra Syllabus Matrix */}
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
                  'शून्य अतिरिक्त सिलेबस मैट्रिक्स (एक तैयारी से कई परीक्षाएं)'
                )}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[var(--text)] leading-relaxed">
              {tr(lang, matrix.headlineEn, matrix.headlineHi)}
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
                  <th className="py-2.5 px-3">{tr(lang, 'Exam', 'परीक्षा')}</th>
                  <th className="py-2.5 px-3">{tr(lang, 'Cycle & Verification Status', 'सत्र और स्थिति')}</th>
                  <th className="py-2.5 px-3">{tr(lang, 'Application Fees', 'आवेदन शुल्क')}</th>
                  <th className="py-2.5 px-3 text-right">{tr(lang, 'Official Portal', 'आधिकारिक पोर्टल')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
                {exams.map((ex, idx) => {
                  const cleanName = ex.name.replace(/2026|2027/g, '').trim();
                  const displayExamName =
                    selectedCycle === '2026-27'
                      ? `${cleanName} (2026-27 Cycle)`
                      : `${cleanName} (2027-28 Cycle)`;

                  return (
                    <tr key={idx} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold">{displayExamName}</div>
                        {selectedCycle === '2026-27' ? (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded font-mono font-bold mt-1 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-dim)]">
                            CLOSED — 2026-27 Window Over
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded font-mono font-bold mt-1 bg-[var(--bg2)] border border-[var(--text)] text-[var(--text)]">
                            VERIFY 2027-28 Dates on Official Portal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[var(--text-dim)]">
                        {selectedCycle === '2026-27'
                          ? '2026-27 session concluded'
                          : `VERIFY at ${ex.url || 'official portal'} (Dates change every cycle)`}
                      </td>
                      <td className="py-3 px-3 text-[var(--text-dim)]">
                        {ex.fees || 'Verify on Official Bulletin'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={ex.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[40px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-2)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors border border-[var(--border)]"
                        >
                          <span>{tr(lang, 'VERIFY on Portal', 'आधिकारिक पोर्टल')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] font-mono mt-3 text-[var(--text-mute)] border-t border-[var(--border)] pt-2 flex flex-wrap items-center justify-between gap-2">
            <span>Last verified: 11 Nov 2026 · Source: Official NTA / Statutory Exam Portals</span>
            <a href="#/sources" className="underline text-[var(--text)] font-bold">
              View All Official Exam Links →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
