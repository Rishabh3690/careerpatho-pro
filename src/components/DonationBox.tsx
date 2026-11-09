import React from 'react';
import { Language } from '../data/types';
import { ShieldCheck, ExternalLink, Calculator, BookOpen, Mail } from 'lucide-react';

interface DonationBoxProps {
  lang: Language;
  isChildPage?: boolean;
  onOpenModal?: () => void;
}

export interface SupporterEntry {
  name: string;
  roleOrCity: string;
  amount: number;
  note: string;
  tier: string;
  date: string;
}

export const INITIAL_SUPPORTERS: SupporterEntry[] = [
  {
    name: 'Vikramjit Singh',
    roleOrCity: 'B.Tech CSE · Chandigarh',
    amount: 0,
    note: 'Comparing the ₹3.0 LPA PLFS national median against total private tuition fees helped our family make an informed decision.',
    tier: 'Community Contributor',
    date: 'Nov 2026',
  },
  {
    name: 'Ananya Deshmukh',
    roleOrCity: 'Pune, Maharashtra',
    amount: 0,
    note: 'The official links to NIRF, NMC, and Indian Nursing Council portals saved us hours of confusion after Class 12 PCB.',
    tier: 'Data Reviewer',
    date: 'Nov 2026',
  },
  {
    name: 'Pooja Varma',
    roleOrCity: 'Jaipur, Rajasthan',
    amount: 0,
    note: 'Appreciating an independent 15-year-old student keeping career data 100% free with zero login and zero sales calls.',
    tier: 'Open-Access Reader',
    date: 'Nov 2026',
  },
];

/**
 * AUDIT UPGRADE (Category D, E & J):
 * Replaced personal UPI ID, QR code, and "0/15,000 students helped" counter with
 * a transparent Official Government Source Verification & Methodology Box.
 */
export const DonationBox: React.FC<DonationBoxProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  return (
    <div
      id="official-verification-vault"
      data-testid="official-verification-vault"
      className="rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] p-5 sm:p-7 transition-all no-print"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-[var(--border2)]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isHi
                ? '100% स्वतंत्र और निःशुल्क · कोई यूपीआई या भुगतान नहीं'
                : '100% FREE · NO PAYMENTS · NO UPI · NO PHONE CALLS'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--text)]">
            {isHi
              ? 'हर आंकड़ा आधिकारिक सरकारी पोर्टल से जुड़ा है (Last Verified: 11 Nov 2026)'
              : 'Every Number Links to an Official Government Portal (Last Verified: 11 Nov 2026)'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text2)] max-w-3xl leading-relaxed">
            {isHi
              ? 'CareerPathO एक 15-वर्षीय छात्र (ऋषभ सिंह, पिता एवं अभिभावक: गौरव सिंह) द्वारा बनाया गया स्वतंत्र संसाधन है। हम कोई दान, यूपीआई भुगतान, फोन नंबर या व्यक्तिगत डेटा एकत्र नहीं करते हैं। जहां आधिकारिक PLFS या NIRF डेटा उपलब्ध नहीं है, वहां स्पष्ट रूप से "Not officially verified" लिखा गया है।'
              : 'CareerPathO is built by a solo 15-year-old student (Rishabh Singh; parent/guardian registration: Gaurav Singh), not a coaching company. We never ask for money, UPI transfers, phone numbers, or logins. Where official PLFS or NIRF data does not exist, we state "Not officially verified" instead of guessing.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="#/sources"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isHi ? 'आधिकारिक स्रोत देखें (Sources)' : 'Official Sources'}</span>
          </a>
          <a
            href="#/how-we-calculate"
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--text)] text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isHi ? 'गणना पद्धति (How We Calculate)' : 'How We Calculate'}</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
          <div className="font-extrabold text-[var(--text)] mb-1">
            {isHi ? '1. राष्ट्रीय वेतन आधार (PLFS)' : '1. National Salary Baseline (PLFS)'}
          </div>
          <p className="text-[11px] text-[var(--text2)] leading-relaxed">
            {isHi
              ? 'MoSPI PLFS के अनुसार सामान्य स्नातक शुरुआती वेतन ₹3.0 LPA (₹25,000/माह) है। NIRF डेटा केवल शीर्ष संस्थानों का मध्यमान दिखाता है।'
              : 'MoSPI PLFS reports a ₹3.0 LPA (₹25,000/mo) national entry median. NIRF medians (₹13–23 LPA) apply to top-tier institutions only.'}
          </p>
          <a
            href="https://mospi.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text)] underline"
          >
            <span>mospi.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
          <div className="font-extrabold text-[var(--text)] mb-1">
            {isHi ? '2. संस्थान रैंकिंग व फीस (NIRF)' : '2. Institute Medians & Fees (NIRF)'}
          </div>
          <p className="text-[11px] text-[var(--text2)] leading-relaxed">
            {isHi
              ? 'कॉलेज फीस और शीर्ष संस्थानों के प्लेसमेंट आंकड़े शिक्षा मंत्रालय के NIRF और AICTE पोर्टल से लिए गए हैं।'
              : 'Institute fee bands and top-college placement medians are compiled from Ministry of Education NIRF & AICTE filings.'}
          </p>
          <a
            href="https://www.nirfindia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text)] underline"
          >
            <span>nirfindia.org</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
          <div className="font-extrabold text-[var(--text)] mb-1">
            {isHi ? '3. त्रुटि रिपोर्ट करें (डेटा सुधार व ईमेल)' : '3. Spot an Error? (Report & Email)'}
          </div>
          <p className="text-[11px] text-[var(--text2)] leading-relaxed">
            {isHi
              ? 'यदि आपको किसी आधिकारिक पीडीएफ या डेटा में अंतर दिखे, तो डेटा सुधार फॉर्म भरें या सीधे ईमेल भेजें।'
              : 'Found an updated official PDF or exam notice? Submit a data correction report or email us for verification.'}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href="#/feedback"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[var(--text)] underline"
            >
              <span>{isHi ? 'लाइव डेटा सुधार फॉर्म →' : 'Open Data Correction Form →'}</span>
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="mailto:virganox3690@gmail.com"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text)] underline"
            >
              <Mail className="w-3 h-3" />
              <span>virganox3690@gmail.com</span>
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="mailto:gauravsinghrenu@gmail.com"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text2)] underline"
            >
              <span>gauravsinghrenu@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
