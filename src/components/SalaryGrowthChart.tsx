import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, Calculator } from 'lucide-react';
import { ChildCareer, Language } from '../data/types';
import { computeSalaryTrajectory, tr } from '../utils/careerEngine';

interface SalaryGrowthChartProps {
  career: ChildCareer;
  lang: Language;
}

type TrajectoryMode = 'all' | 'median' | 'topTier' | 'conservative';

// UPGRADE 1: Pure SVG & CSS 12-Year Salary Growth Chart (Zero heavy Canvas or Recharts dependencies)
export const SalaryGrowthChart: React.FC<SalaryGrowthChartProps> = ({ career, lang }) => {
  const [mode, setMode] = useState<TrajectoryMode>('all');
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(2); // Default Mid-Level (4-6 Yrs)

  const trajectory = computeSalaryTrajectory(career);
  const chartData = trajectory.points.map((pt) => ({
    ...pt,
    label: tr(lang, `${pt.stage} (${pt.years})`, `${pt.stageHi} (${pt.yearsHi})`),
    shortLabel:
      pt.stage === 'Principal / Apex'
        ? tr(lang, 'Apex (12y+)', 'शीर्ष (12y+)')
        : tr(lang, pt.stage, pt.stageHi),
  }));

  const activePoint = trajectory.points[selectedStageIdx] || trajectory.points[0];

  // Pure SVG Coordinate Math (ViewBox 540 x 220)
  const svgW = 540;
  const svgH = 220;
  const padL = 52;
  const padR = 24;
  const padT = 18;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxVal = Math.max(
    20,
    ...chartData.map((d) =>
      mode === 'conservative'
        ? d.conservativeLpa
        : mode === 'median'
        ? d.medianLpa
        : d.topTierLpa
    )
  );
  const yCeiling = Math.ceil(maxVal / 10) * 10;

  const getX = (idx: number) =>
    Number((padL + (idx / Math.max(1, chartData.length - 1)) * plotW).toFixed(1));
  const getY = (val: number) =>
    Number((padT + plotH - (Math.min(yCeiling, val) / yCeiling) * plotH).toFixed(1));

  const buildPath = (key: 'topTierLpa' | 'medianLpa' | 'conservativeLpa') =>
    chartData
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${getX(idx)},${getY(pt[key])}`)
      .join(' ');

  const buildArea = (key: 'topTierLpa' | 'medianLpa') => {
    const line = buildPath(key);
    const lastX = getX(chartData.length - 1);
    const firstX = getX(0);
    const baseY = padT + plotH;
    return `${line} L${lastX},${baseY} L${firstX},${baseY} Z`;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(yCeiling * r));

  return (
    <section
      aria-label={tr(lang, 'Salary Growth Potential Chart', 'वेतन वृद्धि क्षमता चार्ट')}
      className="mb-10 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-6 sm:p-7"
    >
      {/* Top Header & Trajectory Mode Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text3)] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--text)]" />
            <span>
              {tr(
                lang,
                '12-YEAR COMPENSATION TRAJECTORY • PURE SVG CHART',
                '12-वर्षीय वेतन वृद्धि प्रक्षेपवक्र'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]">
            {tr(
              lang,
              'Salary Growth Potential Over Time',
              'समय के साथ वेतन वृद्धि क्षमता (Salary Growth Potential)'
            )}
          </h2>
          <p className="text-xs text-[var(--text2)] mt-1">
            {tr(
              lang,
              'Projected annual compensation in ₹ Lakhs Per Annum (LPA) from Entry (0–1 Yr) to Principal / Apex (12+ Yrs).',
              'शुरुआती स्तर (0–1 वर्ष) से लेकर शीर्ष स्तर (12+ वर्ष) तक अनुमानित वार्षिक पैकेज (₹ LPA)।'
            )}
          </p>
        </div>

        {/* Interactive Trajectory Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg)] border border-[var(--border)] self-start shrink-0 overflow-x-auto max-w-full">
          {[
            { id: 'all', label: tr(lang, 'All Bands', 'सभी स्तर') },
            { id: 'topTier', label: tr(lang, 'Top-Decile', 'शीर्ष 10%') },
            { id: 'median', label: tr(lang, 'Median', 'औसत') },
            { id: 'conservative', label: tr(lang, 'Conservative', 'शुरुआती') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id as TrajectoryMode)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                mode === tab.id
                  ? 'bg-[var(--text)] text-[var(--bg)]'
                  : 'text-[var(--text2)] hover:text-[var(--text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Pure SVG Chart + Interactive Stage Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Columns: Pure SVG Area/Line Chart */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-4 text-[11px] font-mono">
              {(mode === 'all' || mode === 'topTier') && (
                <span className="inline-flex items-center gap-1.5 text-[var(--text)] font-bold">
                  <span className="w-3 h-0.5 bg-[var(--text)] inline-block" />
                  {tr(lang, 'Top-Decile (₹ LPA)', 'शीर्ष 10% (Top-Tier)')}
                </span>
              )}
              {(mode === 'all' || mode === 'median') && (
                <span className="inline-flex items-center gap-1.5 text-[var(--text2)] font-semibold">
                  <span className="w-3 h-0.5 border-b-2 border-dashed border-[var(--text2)] inline-block" />
                  {tr(lang, 'Median Market (₹ LPA)', 'औसत बाजार (Median)')}
                </span>
              )}
              {(mode === 'all' || mode === 'conservative') && (
                <span className="inline-flex items-center gap-1.5 text-[var(--text3)]">
                  <span className="w-2.5 h-2.5 rounded-xs border border-[var(--text3)] inline-block" />
                  {tr(lang, 'Conservative (₹ LPA)', 'न्यूनतम (Conservative)')}
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono font-bold text-[var(--text)] tabular-nums">
              {trajectory.tenYearMultiple}x {tr(lang, '10-Yr Growth Multiple', '10-वर्षीय वृद्धि')}
            </span>
          </div>

          <div className="w-full h-[230px]" data-testid="salary-growth-rechart">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full h-full overflow-visible"
              role="img"
              aria-label={`Salary trajectory chart for ${career.title}`}
            >
              {/* Horizontal Grid Lines & Y-Axis Labels */}
              {yTicks.map((tickVal) => {
                const y = getY(tickVal);
                return (
                  <g key={tickVal}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={svgW - padR}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity={0.14}
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padL - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[var(--text3)] text-[10px] font-mono"
                    >
                      ₹{tickVal}L
                    </text>
                  </g>
                );
              })}

              {/* Area Fills & Lines */}
              {(mode === 'all' || mode === 'topTier') && (
                <>
                  <path d={buildArea('topTierLpa')} fill="currentColor" fillOpacity={0.14} />
                  <path
                    d={buildPath('topTierLpa')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                </>
              )}

              {(mode === 'all' || mode === 'median') && (
                <>
                  <path d={buildArea('medianLpa')} fill="currentColor" fillOpacity={0.08} />
                  <path
                    d={buildPath('medianLpa')}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.75}
                    strokeWidth="2.2"
                    strokeDasharray={mode === 'all' ? '5 4' : undefined}
                  />
                </>
              )}

              {(mode === 'all' || mode === 'conservative') && (
                <path
                  d={buildPath('conservativeLpa')}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.45}
                  strokeWidth="1.8"
                  strokeDasharray="2 3"
                />
              )}

              {/* Interactive Stage Nodes & X-Axis Labels */}
              {chartData.map((pt, idx) => {
                const x = getX(idx);
                const yMed = getY(pt.medianLpa);
                const yTop = getY(pt.topTierLpa);
                const isSelected = idx === selectedStageIdx;
                return (
                  <g
                    key={pt.stage}
                    onClick={() => setSelectedStageIdx(idx)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <line
                        x1={x}
                        y1={padT}
                        x2={x}
                        y2={padT + plotH}
                        stroke="currentColor"
                        strokeOpacity={0.35}
                        strokeWidth="1.5"
                      />
                    )}
                    {(mode === 'all' || mode === 'topTier') && (
                      <circle
                        cx={x}
                        cy={yTop}
                        r={isSelected ? 6 : 4}
                        fill="currentColor"
                      />
                    )}
                    {(mode === 'all' || mode === 'median') && (
                      <circle
                        cx={x}
                        cy={yMed}
                        r={isSelected ? 5.5 : 3.5}
                        fill="currentColor"
                      />
                    )}
                    <text
                      x={x}
                      y={svgH - 10}
                      textAnchor="middle"
                      className={`text-[10px] font-mono ${
                        isSelected ? 'fill-[var(--text)] font-extrabold' : 'fill-[var(--text2)] font-semibold'
                      }`}
                    >
                      {pt.shortLabel}
                    </text>
                    <title>{`${pt.label}: Median ₹${pt.medianLpa} LPA | Top ₹${pt.topTierLpa} LPA`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Clickable Stage Selector Buttons below chart (48px min height) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-[var(--border)]">
            {trajectory.points.map((pt, idx) => {
              const isSelected = idx === selectedStageIdx;
              return (
                <button
                  key={pt.stage}
                  type="button"
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`min-h-[48px] p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                      : 'bg-[var(--bg2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--text2)]'
                  }`}
                >
                  <div className={`text-[10px] font-mono truncate ${isSelected ? 'opacity-80' : 'text-[var(--text3)]'}`}>
                    {tr(lang, pt.years, pt.yearsHi)}
                  </div>
                  <div className="text-xs font-mono font-bold tabular-nums mt-0.5">
                    ₹{pt.medianLpa}L
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 4 Columns: Interactive Stage In-Hand & Growth Breakdown */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)]">
                {tr(lang, 'SELECTED STAGE SNAPSHOT', 'चयनित चरण विश्लेषण')}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg2)] border border-[var(--border2)] text-[var(--text)]">
                {tr(lang, activePoint.years, activePoint.yearsHi)}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-[var(--text)] mb-1">
              {tr(lang, activePoint.stage, activePoint.stageHi)} {tr(lang, 'Compensation', 'वेतन स्तर')}
            </h3>
            <p className="text-xs text-[var(--text2)] mb-4">
              {tr(
                lang,
                'Click any stage button below the chart to inspect net monthly take-home pay.',
                'चार्ट के नीचे किसी भी चरण पर क्लिक करके असली मासिक इन-हैंड वेतन देखें।'
              )}
            </p>

            <div className="space-y-2.5 text-xs font-mono tabular-nums">
              <div className="p-3 rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-between">
                <span className="text-[var(--text2)]">{tr(lang, 'Median Annual CTC', 'औसत वार्षिक पैकेज')}</span>
                <span className="text-base font-extrabold text-[var(--text)]">₹{activePoint.medianLpa} LPA</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[var(--text2)]">
                  <Calculator className="w-3.5 h-3.5 text-[var(--text)]" />
                  <span>{tr(lang, 'Est. Monthly Take-Home', 'अनुमानित मासिक इन-हैंड')}</span>
                </div>
                <span className="text-sm font-bold text-[var(--text)]">
                  ₹{activePoint.monthlyInHandInr.toLocaleString('en-IN')}/mo
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-between">
                <span className="text-[var(--text3)]">{tr(lang, 'Top-Decile Ceiling', 'शीर्ष 10% (Top-Tier)')}</span>
                <span className="text-sm font-bold text-[var(--text)] flex items-center gap-0.5">
                  ₹{activePoint.topTierLpa} LPA
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border)] text-[11px] text-[var(--text3)] leading-relaxed">
            {career.salaryInr?.disclaimer
              ? tr(lang, career.salaryInr.disclaimer, career.salaryInr.disclaimer)
              : tr(
                  lang,
                  'Note: Monthly take-home accounts for standard PF & New Regime tax deductions. Tier-1 campus placements & strong portfolios command top-decile bands.',
                  'नोट: मासिक इन-हैंड में पीएफ (PF) और स्टैंडर्ड टैक्स कटौती शामिल है। टियर-1 कॉलेज और मजबूत स्किल पोर्टफोलियो वाले उम्मीदवार शीर्ष 10% पैकेज प्राप्त करते हैं।'
                )}
          </div>
        </div>
      </div>
    </section>
  );
};
