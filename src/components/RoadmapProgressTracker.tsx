import React, { useState, useEffect } from 'react';
import { ChildCareer, Language } from '../data/types';
import { t, loadPreference, savePreference } from '../utils/careerEngine';
import { CheckCircle, Circle, Award } from 'lucide-react';

interface RoadmapProgressTrackerProps {
  career: ChildCareer;
  lang: Language;
}

export const RoadmapProgressTracker: React.FC<RoadmapProgressTrackerProps> = ({
  career,
  lang,
}) => {
  const isHi = lang === 'hi';
  const steps = career.roadmap || [];
  const storageKey = `careerpatho-tracker-${career.id}`;

  const [completedSteps, setCompletedSteps] = useState<string[]>(() =>
    loadPreference<string[]>(storageKey, [])
  );

  useEffect(() => {
    savePreference(storageKey, completedSteps);
  }, [completedSteps, storageKey]);

  if (steps.length === 0) return null;

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const percentComplete = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="rounded-xl border p-5 mb-8 bg-[var(--surface)] border-[var(--border)] transition-colors no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{isHi ? 'आपकी तैयारी चेकलिस्ट व प्रगति' : 'My Roadmap Preparation Tracker'}</span>
          </h3>
          <p className="text-xs text-[var(--text-dim)]">
            {isHi
              ? 'प्रत्येक पूरे किए गए कदम को मार्क करें — आपकी प्रगति स्वतः आपके डिवाइस पर सुरक्षित रहती है।'
              : 'Check off milestones as you prepare. Progress is automatically saved on this device.'}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-num font-bold text-xs">
          <span className="text-[var(--text-dim)]">{completedSteps.length} of {steps.length} {isHi ? 'पूर्ण' : 'done'}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            {percentComplete}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--surface-2)] mb-4 border border-[var(--border)]">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Milestone Checkboxes */}
      <div className="space-y-2 text-xs">
        {steps.map((step, idx) => {
          const stepId = step.id || String(idx);
          const isDone = completedSteps.includes(stepId);
          return (
            <div
              key={stepId}
              onClick={() => toggleStep(stepId)}
              className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30 text-[var(--text)]'
                  : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[var(--text-mute)] shrink-0" />
                )}
                <span className={`font-semibold text-xs truncate ${isDone ? 'line-through text-emerald-500' : ''}`}>
                  {idx + 1}. {t(step, 'title', lang)}
                </span>
              </div>
              <span className="text-[11px] text-[var(--text-mute)] font-mono-num shrink-0">
                {step.duration || ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
