import React, { useState } from 'react';
import { UserEligibilityProfile, Language } from '../data/types';
import { tr } from '../utils/careerEngine';
import { ChevronDown, ChevronUp, CheckCircle2, SlidersHorizontal } from 'lucide-react';

interface EligibilityCheckerProps {
  lang: Language;
  profile: UserEligibilityProfile;
  onChangeProfile: (p: UserEligibilityProfile) => void;
  openCount: number;
  totalCount: number;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  lang,
  profile,
  onChangeProfile,
  openCount,
  totalCount,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const streams = ['PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'ITI/Diploma', 'Vocational'];
  const percentBuckets = ['Below 50', '50-60', '60-75', '75-90', 'Above 90'];
  const categories = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];

  const heading = tr(lang, 'Check your eligibility', 'अपनी पात्रता जांचें');
  const summaryLine = tr(
    lang,
    `${openCount} of ${totalCount} steps open for your selection`,
    `आपके चयन के लिए ${totalCount} में से ${openCount} कदम खुले हैं`
  );
  const disclaimer = tr(
    lang,
    'Based on published eligibility. Check the official bulletin before applying.',
    'प्रकाशित पात्रता के आधार पर। आवेदन से पहले आधिकारिक बुलेटिन जांचें।'
  );

  return (
    <div className="rounded-xl border p-4 mb-6 transition-colors bg-[var(--surface)] border-[var(--border)] no-print">
      <button
        type="button"
        id="elig-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-bold text-base text-[var(--text)] cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-[var(--text)]" />
          <span>{heading}</span>
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--text-dim)]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-dim)]" />}
      </button>

      {isOpen && (
        <div id="elig-form-container" className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[var(--text-dim)]">
                {tr(lang, 'Stream', 'स्ट्रीम (Stream)')}
              </label>
              <select
                id="elig-stream"
                value={profile.stream}
                onChange={(e) => onChangeProfile({ ...profile, stream: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border text-xs bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
              >
                {streams.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[var(--text-dim)]">
                {tr(lang, 'Board %', 'बोर्ड % (Board %)')}
              </label>
              <select
                id="elig-percent"
                value={profile.percent}
                onChange={(e) => onChangeProfile({ ...profile, percent: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border text-xs bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
              >
                {percentBuckets.map((p) => (
                  <option key={p} value={p}>{p}%</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[var(--text-dim)]">
                {tr(lang, 'Category', 'कैटेगरी (Category)')}
              </label>
              <select
                id="elig-cat"
                value={profile.category}
                onChange={(e) => onChangeProfile({ ...profile, category: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border text-xs bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[var(--text-dim)]">
                {tr(lang, 'State / UT', 'राज्य / केंद्र शासित प्रदेश')}
              </label>
              <select
                id="elig-state"
                value={profile.state}
                onChange={(e) => onChangeProfile({ ...profile, state: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border text-xs bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            id="elig-summary-line"
            className="mt-4 p-3 rounded-lg border border-[var(--border2)] text-xs font-bold flex items-center gap-2 bg-[var(--surface-2)] text-[var(--text)]"
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--text)] shrink-0" />
            <span>{summaryLine}</span>
          </div>

          <p className="text-[11px] mt-2 text-[var(--text-mute)]">
            {disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
