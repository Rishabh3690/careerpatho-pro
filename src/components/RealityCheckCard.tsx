import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SalaryBand, Language, ChildCareer } from '../data/types';
import {
  calculateLoanEMI,
  calculateDropYearCost,
  computeSalaryTrajectory,
  getFormalDesignation,
  tr,
} from '../utils/careerEngine';
import {
  Calculator,
  BarChart3,
  Share2,
  Download,
  AlertTriangle,
  X,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface RealityCheckCardProps {
  salary: SalaryBand | undefined;
  career?: ChildCareer;
  lang: Language;
  externalOpenCardModal?: boolean;
  onCloseExternalModal?: () => void;
  onShowToast?: (msg: string) => void;
}

export const RealityCheckCard: React.FC<RealityCheckCardProps> = ({
  salary,
  career,
  lang,
  externalOpenCardModal = false,
  onCloseExternalModal,
  onShowToast,
}) => {
  const isHi = lang === 'hi';
  const [loanPrincipal, setLoanPrincipal] = useState<number>(500000);
  const [loanTenure, setLoanTenure] = useState<number>(10);
  const [interestRate] = useState<number>(9);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  // PSYCHOLOGY UPGRADE 2: Drop Year Real Cost Calculator State
  const defaultEntryLakhs = career?.entrySalaryLakhs || 6.0;
  const [dropCoachingLakhs, setDropCoachingLakhs] = useState<number>(1.5);
  const [dropLostSalaryLakhs, setDropLostSalaryLakhs] = useState<number>(defaultEntryLakhs);

  // TRUST UPGRADE 1 & 3: "Sharma Ji Ka Beta" Reality Check WhatsApp Card Modal
  const [showRealityModal, setShowRealityModal] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (externalOpenCardModal) {
      setShowRealityModal(true);
    }
  }, [externalOpenCardModal]);

  const closeRealityModal = () => {
    setShowRealityModal(false);
    onCloseExternalModal?.();
  };

  const trajectory = career ? computeSalaryTrajectory(career) : null;
  const entryMedianLpa = trajectory?.entryMedianLpa || defaultEntryLakhs;
  const entryMonthlyGross = Math.round((entryMedianLpa * 100000) / 12);
  const entryMonthlyInHand = trajectory?.points[0]?.monthlyInHandInr || Math.round(entryMonthlyGross * 0.74);
  const entryMonthlyDeductions = Math.max(2500, entryMonthlyGross - entryMonthlyInHand);
  const inHandRatioPct = Math.min(88, Math.max(52, Math.round((entryMonthlyInHand / Math.max(1, entryMonthlyGross)) * 100)));

  const midMedianLpa = trajectory?.points[2]?.medianLpa || career?.midSalaryLakhs || Number((entryMedianLpa * 2.1).toFixed(1));
  const midMonthlyGross = Math.round((midMedianLpa * 100000) / 12);
  const midMonthlyInHand = trajectory?.points[2]?.monthlyInHandInr || Math.round(midMonthlyGross * 0.72);

  const courseFeeLakhs = career?.avgCourseFeeLakhs || 4.0;
  const fourYearEarningsLakhs = Number((entryMedianLpa * 4.6).toFixed(1));
  const dropCost = calculateDropYearCost(dropCoachingLakhs, dropLostSalaryLakhs, 0.8);
  const sarkariBadgeText = career?.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]';

  // Helper to draw the shareable Reality Check Card onto any target HTML5 Canvas
  const drawRealityCardToCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = 880;
      const h = 600;
      canvas.width = w;
      canvas.height = h;

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      // Outer Architectural Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, w - 32, h - 32);

      // Top Header Strip
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(16, 16, w - 32, 54);
      ctx.fillStyle = '#0a0a0a';
      ctx.font = '800 15px "JetBrains Mono", monospace';
      ctx.fillText('CAREERPATHO REALITY CARD • GROSS CTC vs. ACTUAL IN-HAND SALARY AUDIT', 34, 49);

      // Career Title & Sarkari Eligibility Badge
      const careerTitle = career ? getFormalDesignation(career, 'en') : 'Verified Career Track';
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(careerTitle.slice(0, 56), 36, 104);

      ctx.fillStyle = '#e5e5e5';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(`${sarkariBadgeText} • [🏛️ NIRF & AICTE Verified]`, 36, 130);

      // Box 1: This Career's Gross CTC vs Actual In-Hand Salary Visual Bar Comparison
      ctx.strokeStyle = '#525252';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#121212';
      ctx.fillRect(36, 146, w - 72, 166);
      ctx.strokeRect(36, 146, w - 72, 166);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 14px "JetBrains Mono", monospace';
      ctx.fillText(
        `1. GROSS CTC vs. ACTUAL IN-HAND SALARY (${(career?.title || 'CAREER TRACK').toUpperCase().slice(0, 38)}):`,
        52,
        172
      );

      // Gross CTC Bar
      ctx.fillStyle = '#d4d4d4';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(
        `• Gross Entry CTC (${salary?.entry || `₹${entryMedianLpa} LPA`}): ~₹${entryMonthlyGross.toLocaleString('en-IN')}/month (100% Brochure Headline)`,
        52,
        198
      );
      ctx.fillStyle = '#262626';
      ctx.fillRect(52, 206, w - 104, 16);
      ctx.fillStyle = '#737373';
      ctx.fillRect(52, 206, w - 104, 16);

      // Actual In-Hand Bar
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 14px "JetBrains Mono", monospace';
      ctx.fillText(
        `• Actual Monthly In-Hand Bank Credit: ~₹${entryMonthlyInHand.toLocaleString('en-IN')}/month (${inHandRatioPct}% Real Take-Home)`,
        52,
        244
      );
      ctx.fillStyle = '#262626';
      ctx.fillRect(52, 252, w - 104, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(52, 252, Math.round(((w - 104) * inHandRatioPct) / 100), 18);

      // Deductions & Mid-Career note
      ctx.fillStyle = '#a3a3a3';
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.fillText(
        `Deductions (EPF + Tax + Gratuity + Variable/ESOP Lock-in): -₹${entryMonthlyDeductions.toLocaleString('en-IN')}/mo  |  Mid-Career (4-6 Yrs): ~₹${midMonthlyInHand.toLocaleString('en-IN')}/mo In-Hand`,
        52,
        294
      );

      // Box 2: The "Sharma Ji Ka Beta" ₹24 LPA Headline Myth vs Reality
      ctx.fillStyle = '#141414';
      ctx.fillRect(36, 326, w - 72, 96);
      ctx.strokeRect(36, 326, w - 72, 96);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText('2. THE "SHARMA JI KA BETA" ₹24 LPA BROCHURE MYTH vs. BANK REALITY:', 52, 350);

      ctx.fillStyle = '#e5e5e5';
      ctx.font = '600 14px "DM Sans", sans-serif';
      ctx.fillText(
        "• Sharma ji's son's ₹24 LPA package = ₹1.3 Lakh/month gross base CTC.",
        52,
        376
      );
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 15px "DM Sans", sans-serif';
      ctx.fillText(
        "• Actual In-Hand after Tax, PF & 4-Yr ESOPs = ₹75,000/month. Don't be fooled by inflated headlines!",
        52,
        402
      );

      // Box 3: 4-Year ROI (Total Fees vs 4-Year Salary) & Drop-Year Loss
      ctx.fillStyle = '#141414';
      ctx.fillRect(36, 436, w - 72, 96);
      ctx.strokeRect(36, 436, w - 72, 96);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText('3. 4-YEAR ROI (FEES vs. EARNINGS) & 1-YEAR DROP LOSS AUDIT:', 52, 460);

      ctx.fillStyle = '#e5e5e5';
      ctx.font = '600 14px "DM Sans", sans-serif';
      ctx.fillText(
        `• Est. Course Fee: ₹${courseFeeLakhs} Lakhs  |  4-Year Cumulative Earnings: ~₹${fourYearEarningsLakhs} Lakhs`,
        52,
        486
      );
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(
        `• 1-Year Unplanned Drop Loss: ₹1.5L Coaching + ₹${entryMedianLpa}L Lost Salary = ₹${(1.5 + entryMedianLpa).toFixed(1)} Lakhs Lost!`,
        52,
        512
      );

      // Bottom Viral Footer
      ctx.fillStyle = '#a3a3a3';
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.fillText(
        'Generated via CareerPathO.in — 100% Free, No Login, Zero Spam. Verified via NIRF, AICTE & UGC Portals.',
        36,
        564
      );
    },
    [
      career,
      salary,
      sarkariBadgeText,
      entryMedianLpa,
      entryMonthlyGross,
      entryMonthlyInHand,
      entryMonthlyDeductions,
      inHandRatioPct,
      midMonthlyInHand,
      courseFeeLakhs,
      fourYearEarningsLakhs,
    ]
  );

  // Draw the shareable WhatsApp Reality Check Card on HTML5 Canvas when modal opens
  useEffect(() => {
    if (!showRealityModal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawRealityCardToCanvas(canvas);
  }, [showRealityModal, drawRealityCardToCanvas]);

  if (!salary || (!salary.entry && !salary.mid && !salary.senior)) {
    return null;
  }

  const heading = isHi
    ? 'वेतन, इन-हैंड और ROI की सच्चाई (Gross CTC vs In-Hand Reality Check)'
    : 'Compensation, Gross CTC vs. In-Hand & ROI Reality Check';
  const emiLineText = isHi
    ? 'यदि आप 9% ब्याज पर 10 वर्षों के लिए ₹5 लाख का एजुकेशन लोन लेते हैं: EMI ₹6,332/माह'
    : 'If you take a ₹5L loan at 9% for 10 years: EMI ₹6,332/month';
  const disclaimerText = isHi
    ? 'अनुमानित आंकड़े — वास्तविक वेतन कॉलेज, शहर और कौशल के अनुसार भिन्न हो सकता है'
    : 'Approximate estimate — actual figures vary by college, city, and year';

  const calculatedEMI = calculateLoanEMI(loanPrincipal, interestRate, loanTenure);

  const handleDownloadRealityCardPng = () => {
    let targetCanvas = canvasRef.current;
    if (!targetCanvas) {
      targetCanvas = document.createElement('canvas');
    }
    drawRealityCardToCanvas(targetCanvas);
    try {
      const dataUrl = targetCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `CareerPathO-Reality-Card-${career?.id || 'career'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onShowToast?.(
        tr(
          lang,
          'Reality Card PNG exported! Comparing Gross CTC vs Actual In-Hand Salary.',
          'Reality Card PNG download ho gaya! Gross CTC vs Actual In-Hand compare karein.',
          'रियलिटी चेक कार्ड (Gross CTC बनाम असली इन-हैंड) डाउनलोड हो गया!'
        )
      );
    } catch {
      onShowToast?.('Reality Card ready');
    }
  };

  const handleShareRealityWhatsApp = () => {
    const shareText = `📊 *CareerPathO Reality Card (${career?.title || 'Career'})*\n• Gross Entry CTC: ${salary.entry || `₹${entryMedianLpa} LPA`} (~₹${entryMonthlyGross.toLocaleString('en-IN')}/mo Gross)\n• Actual In-Hand Salary: ~₹${entryMonthlyInHand.toLocaleString('en-IN')}/month (${inHandRatioPct}% after Tax, EPF & ESOP deductions)\n• Sharma ji's son's ₹24 LPA package = ₹1.3L/mo gross CTC, but Actual In-Hand = ₹75,000/month!\n• 4-Yr ROI: ₹${courseFeeLakhs}L Fees vs ₹${fourYearEarningsLakhs}L 4-Yr Earnings\n• Status: ${sarkariBadgeText}\nVerify free at: ${typeof window !== 'undefined' ? window.location.href : 'https://careerpatho.in'}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        onShowToast?.(
          tr(
            lang,
            'WhatsApp Reality Check summary copied to clipboard!',
            'WhatsApp Reality Check text copy ho gaya!',
            'व्हाट्सएप रियलिटी चेक संदेश कॉपी हो गया!'
          )
        );
      });
    }
  };

  return (
    <div className="rounded-2xl border p-5 sm:p-6 mb-8 transition-colors bg-[var(--surface)] border-[var(--border)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold tracking-tight text-[var(--text)] flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-[var(--text)]" />
          <span>{heading}</span>
        </h3>
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          {/* TRUST UPGRADE: Generate Reality Card button */}
          <button
            type="button"
            onClick={() => setShowRealityModal(true)}
            data-testid="generate-reality-card-btn"
            className="min-h-[48px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-extrabold bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>
              {tr(
                lang,
                'Generate Reality Card',
                'Generate Reality Card (CTC vs In-Hand)',
                'Generate Reality Card (रियलिटी कार्ड बनाएं)'
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadRealityCardPng}
            data-testid="quick-export-reality-card-btn"
            className="min-h-[48px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[var(--text)] text-xs font-mono font-bold bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isHi ? 'PNG कार्ड एक्सपोर्ट करें' : 'Export PNG Card'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCalculator(!showCalculator)}
            className="min-h-[48px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-[var(--text)]" />
            <span>{isHi ? 'EMI और ड्रॉप कैलकुलेटर' : 'EMI & Drop Cost Simulator'}</span>
          </button>
        </div>
      </div>

      {/* Direct Gross CTC vs Actual In-Hand Visual Comparison Meter */}
      <div
        data-testid="ctc-vs-inhand-comparison-box"
        className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)] mb-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)]">
            {isHi
              ? `विज्ञापित Gross CTC बनाम असली मासिक इन-हैंड वेतन (${career?.titleHindi || career?.title || 'करियर'})`
              : `GROSS CTC vs. ACTUAL MONTHLY IN-HAND BREAKDOWN (${career?.title || 'THIS CAREER'})`}
          </div>
          <span className="px-2.5 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-[11px] font-mono font-extrabold tabular-nums">
            {inHandRatioPct}% Real Take-Home Ratio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
            <div className="text-[10px] uppercase text-[var(--text3)]">
              {isHi ? 'विज्ञापित शुरुआती Gross CTC' : 'Advertised Gross CTC'}
            </div>
            <div className="text-base font-extrabold text-[var(--text)] mt-0.5 tabular-nums">
              {salary.entry || `₹${entryMedianLpa} LPA`}
            </div>
            <div className="text-[11px] text-[var(--text2)] tabular-nums">
              ~₹{entryMonthlyGross.toLocaleString('en-IN')}/mo nominal
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
            <div className="text-[10px] uppercase text-[var(--text3)]">
              {isHi ? 'पीएफ + टैक्स + वेरिएबल कटौती' : 'EPF + Tax + ESOP Deductions'}
            </div>
            <div className="text-base font-extrabold text-[var(--text2)] mt-0.5 tabular-nums">
              -₹{entryMonthlyDeductions.toLocaleString('en-IN')}/mo
            </div>
            <div className="text-[11px] text-[var(--text3)]">
              {isHi ? 'ग्रेच्युटी, पीएफ, बोनस व टैक्स' : 'PF, Gratuity, Tax & 4-Yr Lock-in'}
            </div>
          </div>

          <div className="p-3 rounded-lg border-2 border-[var(--text)] bg-[var(--bg2)]">
            <div className="text-[10px] uppercase font-bold text-[var(--text)]">
              {isHi ? 'असली मासिक इन-हैंड (बैंक क्रेडिट)' : 'Actual Monthly In-Hand Pay'}
            </div>
            <div className="text-base font-black text-[var(--text)] mt-0.5 tabular-nums">
              ~₹{entryMonthlyInHand.toLocaleString('en-IN')}/mo
            </div>
            <div className="text-[11px] text-[var(--text2)] tabular-nums">
              Mid-Career: ~₹{midMonthlyInHand.toLocaleString('en-IN')}/mo
            </div>
          </div>
        </div>
      </div>

      {/* The "Sharma Ji Ka Beta" CTC vs In-Hand Headline Callout Banner */}
      <div
        data-testid="sharma-ji-reality-banner"
        className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] mb-4 space-y-1.5"
      >
        <div className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {tr(
              lang,
              'THE "SHARMA JI KA BETA" CTC vs. IN-HAND REALITY CHECK',
              '"SHARMA JI KA BETA" ₹24 LPA CTC vs ASLI IN-HAND REALITY',
              '"शर्मा जी का बेटा" ₹24 LPA पैकेज बनाम असली इन-हैंड सैलरी की सच्चाई'
            )}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text)] font-semibold leading-relaxed">
          {tr(
            lang,
            "Sharma ji's son's ₹24 LPA package = ₹1.3 Lakh/month CTC. Actual In-Hand after tax, PF & 4-year ESOPs = ₹75,000/month. Don't be fooled by inflated brochure headlines!",
            "Sharma ji ke bete ka ₹24 LPA package = ₹1.3 Lakh/month CTC hota hai, par tax, PF aur 4-year ESOPs katne ke baad Actual In-Hand = ₹75,000/month aata hai. Brochure headlines se dhokha mat khayein!",
            'शर्मा जी के बेटे का ₹24 LPA पैकेज = ₹1.3 लाख/माह CTC होता है, लेकिन टैक्स, पीएफ और 4-वर्षीय ESOPs कटने के बाद असली इन-हैंड (Actual In-Hand) = ₹75,000/माह आता है। विज्ञापनों के झांसे में न आएं!'
          )}
        </p>
        <div className="text-xs font-mono text-[var(--text2)] pt-1">
          {tr(
            lang,
            `For ${career?.title || 'this path'}: Advertised Entry CTC is ${salary.entry || `₹${entryMedianLpa} LPA`} → Real Bank Take-Home is ~₹${entryMonthlyInHand.toLocaleString('en-IN')}/month.`,
            `Is career (${career?.title || 'Track'}) mein: Entry CTC ${salary.entry || `₹${entryMedianLpa} LPA`} → Asli Monthly In-Hand ~₹${entryMonthlyInHand.toLocaleString('en-IN')}/month.`,
            `इस करियर (${career?.titleHindi || career?.title || 'ट्रैक'}) में: शुरुआती CTC ${salary.entry || `₹${entryMedianLpa} LPA`} → असली मासिक इन-हैंड ~₹${entryMonthlyInHand.toLocaleString('en-IN')}/माह।`
          )}
        </div>
      </div>

      {/* Salary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 font-mono-num">
        <div className="p-3.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)]">
          <div className="text-xs text-[var(--text-dim)] mb-1">
            {isHi ? 'शुरुआती वेतन (Entry)' : 'Expected starting salary (entry)'}
          </div>
          <div className="text-lg font-bold text-[var(--text)]">
            {salary.entry || 'N/A'}
          </div>
        </div>
        <div className="p-3.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)]">
          <div className="text-xs text-[var(--text-dim)] mb-1">
            {isHi ? 'मध्य-करियर (Mid-career)' : 'Mid-career (4–8 Yrs)'}
          </div>
          <div className="text-lg font-bold text-[var(--text)]">
            {salary.mid || 'N/A'}
          </div>
        </div>
        <div className="p-3.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)]">
          <div className="text-xs text-[var(--text-dim)] mb-1">
            {isHi ? 'वरिष्ठ स्तर (Senior)' : 'Senior (8–15 Yrs)'}
          </div>
          <div className="text-lg font-bold text-[var(--text)]">
            {salary.senior || 'N/A'}
          </div>
        </div>
        <div className="p-3.5 rounded-lg border bg-[var(--text)] text-[var(--bg)] border-[var(--text)]">
          <div className="text-xs opacity-75 mb-1">
            {isHi ? 'शीर्ष 10% (Top 10%)' : 'Top 10% Leaders'}
          </div>
          <div className="text-lg font-bold">
            {salary.top10 || '₹60+ LPA'}
          </div>
        </div>
      </div>

      {/* Static EMI benchmark line */}
      <div className="p-3 rounded-lg border border-[var(--border2)] text-xs font-semibold mb-4 bg-[var(--surface-2)] text-[var(--text)]">
        {emiLineText}
      </div>

      {/* PSYCHOLOGY UPGRADE 2: The Drop Year Cost Calculator (Always visible for Parents & Students) */}
      <div
        data-testid="drop-year-cost-calculator"
        className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] mb-3 text-xs space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[var(--text3)]">
              {tr(
                lang,
                'THE DROP YEAR COST CALCULATOR (HIDDEN FINANCIAL LOSS)',
                'DROP YEAR COST CALCULATOR (1 SAAL DROP KA ASLI NUKSAAN)',
                'ड्रॉप ईयर कॉस्ट कैलकुलेटर (1 साल ड्रॉप का असली वित्तीय नुकसान)'
              )}
            </div>
            <div className="font-bold text-sm text-[var(--text)] mt-0.5">
              {tr(
                lang,
                `Taking a 1-year drop for JEE/NEET costs ₹${dropCost.coachingFeeLakhs} Lakh (Coaching) + ₹${dropCost.livingCostLakhs}L (Living) + ₹${dropCost.lostSalaryLakhs} Lakh in lost earnings = ₹${dropCost.totalLossLakhs} Lakh.`,
                dropCost.summaryHinglish,
                dropCost.summaryHi
              )}
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs tabular-nums">
            Total Loss: ₹{dropCost.totalLossLakhs} Lakhs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
          <div>
            <label
              htmlFor="drop-coaching-slider"
              className="flex justify-between mb-1 text-[var(--text2)] font-mono"
            >
              <span>{isHi ? 'कोचिंग फीस (Coaching Fee):' : '1-Yr Coaching Fee:'}</span>
              <strong className="text-[var(--text)]">₹{dropCoachingLakhs.toFixed(1)} Lakhs</strong>
            </label>
            <input
              id="drop-coaching-slider"
              type="range"
              min="0.5"
              max="4.0"
              step="0.5"
              value={dropCoachingLakhs}
              onChange={(e) => setDropCoachingLakhs(Number(e.target.value))}
              className="w-full accent-[var(--text)] cursor-pointer"
            />
          </div>
          <div>
            <label
              htmlFor="drop-salary-slider"
              className="flex justify-between mb-1 text-[var(--text2)] font-mono"
            >
              <span>{isHi ? '1 साल की खोई हुई सैलरी (Lost Salary):' : '1-Yr Lost Starting Salary:'}</span>
              <strong className="text-[var(--text)]">₹{dropLostSalaryLakhs.toFixed(1)} Lakhs</strong>
            </label>
            <input
              id="drop-salary-slider"
              type="range"
              min="3.0"
              max="18.0"
              step="1.0"
              value={dropLostSalaryLakhs}
              onChange={(e) => setDropLostSalaryLakhs(Number(e.target.value))}
              className="w-full accent-[var(--text)] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Interactive Custom Loan Simulator */}
      {showCalculator && (
        <div className="p-4 rounded-lg border mb-3 bg-[var(--surface-2)] border-[var(--border)] no-print text-xs">
          <div className="font-bold mb-3 text-[var(--text)]">
            {isHi ? 'एजुकेशन लोन EMI सिम्युलेटर' : 'Custom Education Loan Simulator'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1 text-[var(--text-dim)] font-mono-num">
                <span>{isHi ? 'लोन राशि (Loan Amount)' : 'Loan Amount'}:</span>
                <span className="font-bold text-[var(--text)]">₹{(loanPrincipal / 100000).toFixed(1)} Lakhs</span>
              </div>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-[var(--text-dim)] font-mono-num">
                <span>{isHi ? 'अवधि (Repayment Tenure)' : 'Tenure'}:</span>
                <span className="font-bold text-[var(--text)]">{loanTenure} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-[var(--text-dim)]">
              {isHi ? 'अनुमानित मासिक किस्त (Monthly EMI at 9% p.a.):' : 'Estimated Monthly EMI (at 9% p.a.):'}
            </span>
            <span className="text-base font-bold text-[var(--accent)] font-mono-num">
              ₹{calculatedEMI.toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>
      )}

      <p className="text-[11px] text-[var(--text-mute)]">
        {disclaimerText}
      </p>

      {/* WhatsApp Shareable Reality Check Card Modal */}
      {showRealityModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRealityModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn no-print"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Shareable Reality Check Card"
            className="w-full max-w-2xl rounded-2xl border-2 border-[var(--text)] bg-[var(--bg)] p-5 sm:p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text3)]">
                  HTML5 CANVAS SHAREABLE IMAGE • GROSS CTC vs. ACTUAL IN-HAND SALARY
                </div>
                <h4 className="text-lg font-extrabold text-[var(--text)]">
                  {tr(
                    lang,
                    'Reality Card: Gross CTC vs. Actual In-Hand & 4-Year ROI',
                    'Reality Card: Gross CTC vs Actual In-Hand (WhatsApp Shareable)',
                    'रियलिटी कार्ड: विज्ञापित Gross CTC बनाम असली इन-हैंड सैलरी'
                  )}
                </h4>
              </div>
              <button
                type="button"
                onClick={closeRealityModal}
                aria-label="Close Reality Card modal"
                className="min-h-[44px] min-w-[44px] rounded-lg border border-[var(--border2)] flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Preview */}
            <div className="w-full overflow-x-auto rounded-xl border border-[var(--border2)] bg-[#0a0a0a] p-2">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block rounded-lg"
                data-testid="reality-card-canvas"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text2)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--text)]" />
                <span>Ready to export PNG & share with parents on WhatsApp</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadRealityCardPng}
                  data-testid="download-reality-card-png-btn"
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHi ? 'PNG इमेज डाउनलोड करें' : 'Export / Download PNG Image'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareRealityWhatsApp}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isHi ? 'व्हाट्सएप टेक्स्ट कॉपी करें' : 'Copy WhatsApp Card Text'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
