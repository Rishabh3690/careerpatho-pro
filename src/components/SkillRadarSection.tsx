import React, { useState } from 'react';
import { ChildCareer, Language } from '../data/types';
import { tr } from '../utils/careerEngine';

interface SkillRadarSectionProps {
  career: ChildCareer;
  lang: Language;
}

// UPGRADE 1: Pure SVG & CSS 6-Axis Competency Radar Chart (No heavy Canvas or third-party chart libraries)
export const SkillRadarSection: React.FC<SkillRadarSectionProps> = ({ career, lang }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const radar = career.skillRadar || {
    analytical: 88,
    technical: 85,
    creative: 78,
    leadership: 82,
    communication: 86,
    execution: 90,
  };

  const data = [
    {
      subject: tr(lang, 'Analytical', 'तार्किक क्षमता (Analytical)'),
      shortLabel: 'Analytical',
      score: radar.analytical,
    },
    {
      subject: tr(lang, 'Technical', 'तकनीकी दक्षता (Technical)'),
      shortLabel: 'Technical',
      score: radar.technical,
    },
    {
      subject: tr(lang, 'Creative', 'रचनात्मकता (Creative)'),
      shortLabel: 'Creative',
      score: radar.creative,
    },
    {
      subject: tr(lang, 'Leadership', 'नेतृत्व क्षमता (Leadership)'),
      shortLabel: 'Leadership',
      score: radar.leadership,
    },
    {
      subject: tr(lang, 'Communication', 'संवाद कौशल (Communication)'),
      shortLabel: 'Comm.',
      score: radar.communication,
    },
    {
      subject: tr(lang, 'Execution', 'क्रियान्वयन (Execution)'),
      shortLabel: 'Execution',
      score: radar.execution,
    },
  ];

  const sortedSkills = [...data].sort((a, b) => b.score - a.score);
  const topTwo = sortedSkills.slice(0, 2);

  // Pure SVG Radar Geometry (cx=160, cy=155, maxRadius=105)
  const cx = 160;
  const cy = 155;
  const maxR = 100;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getPoint = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    return {
      x: Number((cx + maxR * ratio * Math.cos(angle)).toFixed(1)),
      y: Number((cy + maxR * ratio * Math.sin(angle)).toFixed(1)),
    };
  };

  const polygonPoints = data
    .map((item, idx) => {
      const pt = getPoint(idx, item.score / 100);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <section className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--text3)] mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--text)] inline-block" />
            {tr(
              lang,
              'COMPETENCY RADAR MATRIX • PURE SVG 6-AXIS TELEMETRY',
              '6-AXIS SKILL RADAR • PURE SVG ZERO-LAG TELEMETRY',
              'कौशल रडार मैट्रिक्स (6-अक्षीय विश्लेषण)'
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
            {tr(
              lang,
              'Core Competency & Skill Architecture',
              'Is Career Ke Liye Zaroori Skills & Competency Radar',
              'प्रमुख कौशल और दक्षता संरचना'
            )}
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg3)]">
          <span className="text-xs text-[var(--text3)]">
            {tr(lang, 'Dominant Signature:', 'प्रमुख शक्ति:')}
          </span>
          <span className="text-xs font-mono font-bold text-[var(--text)]">
            {topTwo.map((s) => s.shortLabel).join(' + ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* UPGRADE 1: Pure SVG Radar Visualization */}
        <div className="lg:col-span-6 h-[300px] sm:h-[330px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 flex flex-col items-center justify-center text-[var(--text)]">
          <svg
            viewBox="-20 0 360 310"
            className="w-full h-full max-w-[320px] max-h-[300px] overflow-visible"
            role="img"
            aria-label={`6-Axis Skill Radar Chart for ${career.title}`}
          >
            {/* Concentric Hexagonal Grid Rings */}
            {levels.map((lvl) => {
              const ringPts = data
                .map((_, idx) => {
                  const p = getPoint(idx, lvl);
                  return `${p.x},${p.y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={lvl}
                  points={ringPts}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.18}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis Spokes */}
            {data.map((item, idx) => {
              const end = getPoint(idx, 1.0);
              const labelPt = getPoint(idx, 1.24);
              return (
                <g key={item.shortLabel}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={end.x}
                    y2={end.y}
                    stroke="currentColor"
                    strokeOpacity={0.22}
                    strokeWidth="1"
                  />
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-[var(--text2)] text-[10px] font-mono font-bold"
                  >
                    {item.shortLabel} ({item.score})
                  </text>
                </g>
              );
            })}

            {/* Data Polygon */}
            <polygon
              points={polygonPoints}
              fill="currentColor"
              fillOpacity={0.18}
              stroke="currentColor"
              strokeWidth="2.4"
            />

            {/* Interactive Data Vertices */}
            {data.map((item, idx) => {
              const pt = getPoint(idx, item.score / 100);
              const isHovered = hoveredIdx === idx;
              return (
                <g
                  key={item.shortLabel}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="currentColor"
                  />
                  <title>{`${item.subject}: ${item.score}/100`}</title>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Pure CSS 6-Axis Tabular Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <p className="text-sm text-[var(--text2)] leading-relaxed mb-4">
            {tr(
              lang,
              'Quantified cognitive and operational demands required to reach top-decile performance in this career pathway.',
              'Is career mein Top 10% earners mein aane ke liye zaroori 6 core skills ka breakdown:',
              'इस करियर पथ में शीर्ष 10% पेशेवरों की श्रेणी में पहुंचने के लिए आवश्यक प्रमुख क्षमताओं का सटीक मानचित्रण।'
            )}
          </p>
          <div className="space-y-3.5">
            {data.map((item, idx) => (
              <div
                key={item.shortLabel}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--text)]">{item.subject}</span>
                  <span className="font-mono font-bold text-[var(--text)] tabular-nums">
                    {item.score}
                    <span className="text-[var(--text3)] font-normal">/100</span>
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--bg3)] overflow-hidden border border-[var(--border)]">
                  <div
                    className="h-full bg-[var(--text)] rounded-full transition-all duration-300"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
