import React from 'react';
import { Language } from '../data/types';
import { tr } from '../utils/careerEngine';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isHi = lang === 'hi';
  const mainCopy = tr(
    lang,
    'CareerPathO — Free career guidance for Indian students (395+ careers across 10 parent sections). No ads. No login. No phone calls. No data collection.',
    'CareerPathO — भारतीय छात्रों के लिए निःशुल्क करियर मार्गदर्शन (10 मुख्य वर्गों में 395+ करियर)। कोई विज्ञापन नहीं। कोई लॉगिन नहीं। कोई फोन कॉल नहीं।'
  );

  return (
    <footer className="w-full border-t mt-auto py-10 transition-colors bg-[var(--surface)] border-[var(--border)] no-print">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-5 text-sm text-[var(--text-dim)]">
        {/* TRUST ELEMENT 6: Footer Trust Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[var(--text)]">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--accent-emerald)]" />
            <span className="break-words">Free · No login · No ads · 395+ careers · No phone calls</span>
          </div>
          <span className="text-[11px] font-mono badge-nov11-subtle px-2.5 py-0.5 rounded border font-bold">
            [Independent Student Resource • Not Govt Affiliated • Zero Salary Guarantee]
          </span>
        </div>

        <p className="font-medium text-[var(--text)]">{mainCopy}</p>

        {/* TRUST ELEMENT 5: Footer with 4 Mandatory Links (About · Sources · How We Calculate · Privacy) + Email + Last-Updated Date */}
        <div
          data-testid="footer-mandatory-trust-strip"
          className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold text-[var(--text)]"
        >
          <div className="flex flex-wrap items-center gap-3">
            <a href="#/about" className="underline hover:opacity-80">
              About
            </a>
            <span aria-hidden="true">·</span>
            <a href="#/sources" className="underline hover:opacity-80">
              Sources
            </a>
            <span aria-hidden="true">·</span>
            <a href="#/how-we-calculate" className="underline hover:opacity-80">
              How We Calculate
            </a>
            <span aria-hidden="true">·</span>
            <a href="#/privacy" className="underline hover:opacity-80">
              Privacy
            </a>
            <span aria-hidden="true">·</span>
            <a href="#/feedback" className="underline hover:opacity-80">
              Report Data Correction
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[var(--text2)]">
            <a href="mailto:virganox3690@gmail.com" className="underline text-[var(--text)]">
              virganox3690@gmail.com
            </a>
            <span aria-hidden="true">·</span>
            <a href="mailto:gauravsinghrenu@gmail.com" className="underline text-[var(--text)]">
              gauravsinghrenu@gmail.com
            </a>
            <span aria-hidden="true">·</span>
            <span data-testid="footer-last-updated" className="text-[var(--accent-emerald)] font-extrabold">
              Last updated: 11 Nov 2026
            </span>
          </div>
        </div>

        {/* Secondary Navigation Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold">
          <a href="#/careers" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'All 395+ Careers', 'सभी 395+ करियर देखें')}
          </a>
          <a href="#/talent-quiz" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, '25-Question Assessment Calculator', '25-प्रश्न करियर कैलकुलेटर')}
          </a>
          <a href="#/compare?c1=btech-cse&c2=bca-software" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'Compare Careers', 'करियर की तुलना करें (Compare)')}
          </a>
          <a href="#/about" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'About (Rishabh Singh, Age 15)', 'मेरे बारे में (ऋषभ सिंह, उम्र 15)')}
          </a>
          <a href="#/sources" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'Official Sources', 'आधिकारिक स्रोत (Sources)')}
          </a>
          <a href="#/how-we-calculate" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'How We Calculate This', 'गणना पद्धति (How We Calculate)')}
          </a>
          <a href="#/privacy" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'Privacy Policy', 'गोपनीयता नीति (Privacy)')}
          </a>
          <a href="#/terms" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'Terms of Service', 'सेवा की शर्तें (Terms)')}
          </a>
          <a href="#/feedback" className="hover:text-[var(--text)] transition-colors">
            {tr(lang, 'Feedback / Report Bug', 'सुझाव / त्रुटि रिपोर्ट करें')}
          </a>
        </div>

        {/* LEGAL REQUIREMENT 4: Mandatory Non-Affiliation & Defamation Defence Disclaimer */}
        <div
          data-testid="footer-legal-disclaimer"
          className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text2)] leading-relaxed"
        >
          <strong className="text-[var(--text)] font-mono uppercase mr-1.5">
            {isHi ? 'आधिकारिक अस्वीकरण (OFFICIAL DISCLAIMER):' : 'OFFICIAL DISCLAIMER:'}
          </strong>
          CareerPathO is an independent resource. Not affiliated with NIRF, AICTE, UGC, NTA, or Government of India. Data compiled from official government sources. Always verify on official website before deciding. No admission, placement, or salary guarantees.
        </div>

        <p className="text-xs text-[var(--text-mute)] pt-2 border-t border-[var(--border)]/60">
          © 2026 CareerPathO · Built by Rishabh Singh (15-year-old student, India — solo student project, not a team) · Domain & hosting legally operated under parent/guardian registration by his father, Gaurav Singh (gauravsinghrenu@gmail.com) per Indian Contract Act, 1872.
        </p>
      </div>
    </footer>
  );
};
