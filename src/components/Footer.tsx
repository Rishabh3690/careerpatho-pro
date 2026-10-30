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
    'CareerPathO — Free career guidance for Indian students. No ads. No login. No paywall.',
    'CareerPathO — Indian students ke liye 100% Free career guidance. No ads. No login. Zero sales calls.',
    'CareerPathO — भारतीय छात्रों के लिए निःशुल्क करियर मार्गदर्शन। कोई विज्ञापन नहीं। कोई लॉगिन नहीं। कोई शुल्क नहीं।'
  );
  const copyright = isHi
    ? '© 2026 CareerPathO. एक छात्र द्वारा निर्मित।'
    : '© 2026 CareerPathO. Built by a student.';

  return (
    <footer className="w-full border-t mt-auto py-10 transition-colors bg-[var(--surface)] border-[var(--border)] no-print">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-5 text-sm text-[var(--text-dim)]">
        {/* TRUST UPGRADE 1: Footer Trust Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[var(--text)]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Free. No Login. Zero Phone Numbers. Zero Sales Calls.</span>
          </div>
          <span className="text-[11px] font-mono text-[var(--text2)]">
            [🏛️ NIRF Verified] • [✅ AICTE Approved] • [🎓 UGC Recognized]
          </span>
        </div>

        <p className="font-medium text-[var(--text)]">{mainCopy}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold">
          <a href="#/talent-quiz" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'अपनी प्रतिभा से करियर खोजें (Talent Matcher)' : '10-Question Aptitude Matcher'}
          </a>
          <a href="#/compare?c1=btech-cse&c2=bca-software" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'करियर की तुलना करें (Compare)' : 'Compare Careers'}
          </a>
          <a href="#/supporters" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'इस प्रोजेक्ट को सपोर्ट करें' : 'Support this project'}
          </a>
          <a href="#/coming-soon" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'जल्द आ रहा है' : 'Coming Soon'}
          </a>
          <a href="#/feedback" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'फीचर अनुरोध और फीडबैक' : 'Priority Feature Requests'}
          </a>
          <a href="#/about" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'हमारे बारे में (About)' : 'About'}
          </a>
          <a href="#/privacy" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'गोपनीयता नीति (Privacy)' : 'Privacy Policy'}
          </a>
          <a href="#/terms" className="hover:text-[var(--text)] transition-colors">
            {isHi ? 'सेवा की शर्तें (Terms)' : 'Terms of Service'}
          </a>
        </div>

        {/* TRUST UPGRADE 1.5: Mandatory Legal Disclaimer */}
        <div
          data-testid="footer-legal-disclaimer"
          className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text2)] leading-relaxed"
        >
          <strong className="text-[var(--text)] font-mono uppercase mr-1.5">
            {isHi ? 'आधिकारिक अस्वीकरण (Legal Disclaimer):' : 'OFFICIAL DISCLAIMER:'}
          </strong>
          Data aggregated from official Govt portals (NIRF, AICTE, NTA). We do not accept commissions from colleges. Verify all data before admission.
        </div>

        <p className="text-xs text-[var(--text-mute)] pt-2 border-t border-[var(--border)]/60">
          {copyright}
        </p>
      </div>
    </footer>
  );
};
