import React, { useState, useEffect } from 'react';
import { ChildCareer, Language, LearningLink } from '../data/types';
import { fmtDate, t, generateOfflineMentorResponse, computeSalaryTrajectory } from '../utils/careerEngine';
import { X, ExternalLink, Terminal, Send, Calculator } from 'lucide-react';

interface LearningModalProps {
  career: ChildCareer;
  lang: Language;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

const DEFAULT_FREE_LEARNING: Record<string, LearningLink[]> = {
  pyqs: [
    { label: 'National Testing Agency (NTA) Official Past Papers & Mock Tests', url: 'https://nta.ac.in/Downloads', type: 'official' },
    { label: 'UPSC Official Previous Year Question Papers Archive', url: 'https://upsc.gov.in/examinations/previous-question-papers', type: 'official' },
  ],
  govtPlatforms: [
    { label: 'SWAYAM — Free Govt of India IIT/IIM Courses', url: 'https://swayam.gov.in', type: 'official' },
    { label: 'NPTEL — IIT Video Lectures & Certifications', url: 'https://nptel.ac.in', type: 'official' },
    { label: 'National Digital Library of India (NDLI — IIT Kharagpur)', url: 'https://ndl.iitkgp.ac.in', type: 'official' },
  ],
  youtube: [
    { label: 'NPTEL Official IIT Lectures Channel', url: 'https://www.youtube.com/@iit', type: 'free' },
    { label: 'Sansad TV — Policy, Economy & Science Discussions', url: 'https://www.youtube.com/@SansadTV', type: 'free' },
  ],
  notes: [
    { label: 'NCERT Official e-Pathshala Textbooks (Class 6–12 PDF)', url: 'https://epathshala.nic.in', type: 'official' },
    { label: 'e-PG Pathshala — UGC Postgraduate Study Modules', url: 'https://epgp.inflibnet.ac.in', type: 'official' },
  ],
  scholarships: [
    { label: 'National Scholarship Portal (NSP — Central & State Schemes)', url: 'https://scholarships.gov.in', type: 'official' },
    { label: 'PM Vidya Lakshmi Education Loan & Subsidy Portal', url: 'https://www.vidyalakshmi.co.in', type: 'official' },
  ],
  internships: [
    { label: 'AICTE National Internship Portal (Govt & Corporate)', url: 'https://internship.aicte-india.org', type: 'official' },
    { label: 'National Career Service (NCS — Ministry of Labour)', url: 'https://www.ncs.gov.in', type: 'official' },
  ],
  careerHelp: [
    { label: 'AISHE & NIRF Official Ministry of Education Rankings', url: 'https://www.nirfindia.org', type: 'official' },
  ],
  mentalHealth: [
    { label: 'Tele-MANAS (14416) — Free 24x7 Govt Mental Health Helpline (NIMHANS)', url: 'https://telemanas.mohfw.gov.in', type: 'official' },
  ],
};

export const LearningModal: React.FC<LearningModalProps> = ({
  career,
  lang,
  onClose,
  onShowToast,
}) => {
  const isHi = lang === 'hi';
  const raw = career.learning;
  const hasCustom =
    raw &&
    Object.values(raw).some((arr) => Array.isArray(arr) && arr.length > 0);
  const l = hasCustom ? raw! : DEFAULT_FREE_LEARNING;

  const tabDefs: Array<{ key: string; label: string; data: LearningLink[] }> = [
    { key: 'pyqs', label: 'PYQs', data: l.pyqs || [] },
    { key: 'govtPlatforms', label: 'Govt Portals', data: l.govtPlatforms || [] },
    { key: 'youtube', label: 'Video Lectures', data: l.youtube || [] },
    { key: 'notes', label: 'Study Notes', data: l.notes || [] },
    { key: 'scholarships', label: 'Scholarships', data: l.scholarships || [] },
    { key: 'internships', label: 'Internships', data: l.internships || [] },
    { key: 'careerHelp', label: 'Counselling', data: l.careerHelp || [] },
    { key: 'mentalHealth', label: 'Wellbeing', data: l.mentalHealth || [] },
  ];

  const visibleTabs = tabDefs.filter((tDef) => Array.isArray(tDef.data) && tDef.data.length > 0);
  const [activeTab, setActiveTab] = useState<string>(visibleTabs.length > 0 ? visibleTabs[0].key : 'pyqs');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const modalTitle = isHi
    ? `निःशुल्क तैयारी संसाधन: ${t(career, 'title', lang)}`
    : `Free Preparation Resources: ${t(career, 'title', lang)}`;

  const footerText = isHi
    ? `सभी लिंक ${fmtDate(career.lastVerified || '2026-03')} में सत्यापित · 100% निःशुल्क ओपन-एक्सेस संसाधन`
    : `All links verified ${fmtDate(career.lastVerified || '2026-03')} · 100% Free Open-Access Resources`;

  const activeLinks = visibleTabs.find((tDef) => tDef.key === activeTab)?.data || [];

  return (
    <div
      id="learning-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl max-h-[88vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl bg-[var(--bg)] border-[var(--border2)]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b flex items-center justify-between border-[var(--border)] bg-[var(--bg2)]">
          <h3 className="text-base font-bold text-[var(--text)] line-clamp-1">
            {modalTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex overflow-x-auto p-2 border-b gap-1.5 bg-[var(--bg2)] border-[var(--border)] text-xs scrollbar-none">
          {visibleTabs.map((tDef) => (
            <button
              key={tDef.key}
              type="button"
              id={`tab-btn-${tDef.key}`}
              onClick={() => setActiveTab(tDef.key)}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tDef.key
                  ? 'bg-[var(--text)] text-[var(--bg)]'
                  : 'text-[var(--text2)] hover:text-[var(--text)] bg-[var(--bg3)]'
              }`}
            >
              {tDef.label} ({tDef.data.length})
            </button>
          ))}

          {/* AI Mentor Tab — Labeled Coming Soon */}
          <button
            type="button"
            id="tab-btn-ai-mentor"
            onClick={() =>
              onShowToast(
                isHi
                  ? 'AI मेंटर और शंका समाधान जल्द आ रहा है!'
                  : 'AI Mentor & Doubt Solver is coming soon!'
              )
            }
            className="px-3 py-1.5 rounded-lg font-mono font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 text-[var(--text2)] bg-[var(--bg3)] border border-[var(--border2)] hover:border-[var(--text)]"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isHi ? 'AI मेंटर · जल्द आ रहा है' : 'AI Mentor · Coming Soon'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-3">
          {activeLinks.map((link, lIdx) => (
            <a
              key={lIdx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border flex items-center justify-between gap-3 font-semibold transition-colors bg-[var(--bg2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[var(--text)] shrink-0" />
                <span>{link.label || link.url}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--text2)] shrink-0" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t text-[11px] font-mono text-[var(--text3)] bg-[var(--bg2)] border-[var(--border)]">
          {footerText}
        </div>
      </div>
    </div>
  );
};
