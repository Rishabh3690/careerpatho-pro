import React from 'react';
import { ChildCareer, Language } from '../data/types';
import { CheckCircle2, AlertTriangle, Clock, Activity, Laptop, ShieldCheck } from 'lucide-react';

interface CareerSuitabilitySectionProps {
  career: ChildCareer;
  lang: Language;
}

export const CareerSuitabilitySection: React.FC<CareerSuitabilitySectionProps> = ({
  career,
  lang,
}) => {
  const isHi = lang === 'hi';
  const prosCons = career.prosAndCons;
  const wlb = career.workLifeBalance;

  const thriveList = isHi && prosCons?.thriveIfHindi ? prosCons.thriveIfHindi : prosCons?.thriveIf || [];
  const reconsiderList = isHi && prosCons?.reconsiderIfHindi ? prosCons.reconsiderIfHindi : prosCons?.reconsiderIf || [];

  return (
    <div className="rounded-2xl border p-6 sm:p-8 mb-10 bg-[var(--bg2)] border-[var(--border)] transition-colors">
      <div className="text-xs font-mono uppercase tracking-widest text-[var(--text3)] mb-1">
        {isHi ? 'उपयुक्तता और कार्यशैली' : 'SUITABILITY & LIFESTYLE DIAGNOSTIC'}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] mb-1">
        {isHi ? 'क्या यह रास्ता आपके लिए सही है?' : 'Is This Path Built For You?'}
      </h3>
      <p className="text-sm text-[var(--text2)] mb-6">
        {isHi
          ? 'केवल वेतन देखकर नहीं, बल्कि अपनी प्राकृतिक कार्यशैली और मानसिक क्षमता के अनुसार निर्णय लें।'
          : 'Decide based on your natural cognitive style, stress tolerance, and day-to-day operational reality.'}
      </p>

      {/* Item 1: Who will thrive vs Who should reconsider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
        {/* Thrive card */}
        <div className="p-5 rounded-xl border border-[var(--text)] bg-[var(--bg)]">
          <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)] mb-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isHi ? 'आप सफल होंगे यदि (You Will Thrive If):' : 'You Will Thrive If:'}</span>
          </div>
          <ul className="space-y-2.5 text-[var(--text2)] text-xs sm:text-sm">
            {thriveList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-[var(--text)] font-mono font-bold mt-0.5">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reconsider card */}
        <div className="p-5 rounded-xl border border-dashed border-[var(--border2)] bg-[var(--bg)]">
          <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)] mb-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{isHi ? 'पुनर्विचार करें यदि (Reconsider If):' : 'Reconsider If:'}</span>
          </div>
          <ul className="space-y-2.5 text-[var(--text2)] text-xs sm:text-sm">
            {reconsiderList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-[var(--text3)] font-mono font-bold mt-0.5">−</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Item 2: Work-Life Reality & Lifestyle Profile */}
      {wlb && (
        <div className="pt-5 border-t border-[var(--border)]">
          <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--text3)] mb-3">
            {isHi ? 'दैनिक जीवन और कार्य-दबाव विश्लेषण (Work-Life Metrics)' : 'Daily Workload & Operational Metrics'}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl border bg-[var(--bg)] border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--text3)] mb-1 text-[11px] font-sans">
                <Clock className="w-3.5 h-3.5 text-[var(--text)]" />
                <span>{isHi ? 'साप्ताहिक घंटे' : 'Weekly Hours'}</span>
              </div>
              <strong className="text-[var(--text)] text-sm">{wlb.weeklyHours}</strong>
            </div>

            <div className="p-3.5 rounded-xl border bg-[var(--bg)] border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--text3)] mb-1 text-[11px] font-sans">
                <Activity className="w-3.5 h-3.5 text-[var(--text)]" />
                <span>{isHi ? 'तनाव स्तर' : 'Stress Quotient'}</span>
              </div>
              <strong className="text-[var(--text)] text-sm">{wlb.stressLevel}</strong>
            </div>

            <div className="p-3.5 rounded-xl border bg-[var(--bg)] border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--text3)] mb-1 text-[11px] font-sans">
                <Laptop className="w-3.5 h-3.5 text-[var(--text)]" />
                <span>{isHi ? 'रिमोट कार्य' : 'Remote Mode'}</span>
              </div>
              <strong className="text-[var(--text)] text-sm">{wlb.remoteFlexibility}</strong>
            </div>

            <div className="p-3.5 rounded-xl border bg-[var(--bg)] border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--text3)] mb-1 text-[11px] font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--text)]" />
                <span>{isHi ? 'जॉब सुरक्षा' : 'Job Security'}</span>
              </div>
              <strong className="text-[var(--text)] text-sm">{wlb.jobSecurityIndex}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
