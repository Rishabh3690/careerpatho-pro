import React, { useState, useRef, useEffect } from 'react';
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
  const [loanPrincipal, setLoanPrincipal] = useState<number>(500000);
  const [loanTenure, setLoanTenure] = useState<number>(10);
  const [interestRate] = useState<number>(9);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  // PSYCHOLOGY UPGRADE 2: Drop Year Real Cost Calculator State
  const defaultEntryLakhs = career?.entrySalaryLakhs || 6.0;
  const [dropCoachingLakhs, setDropCoachingLakhs] = useState<number>(1.5);
  const [dropLostSalaryLakhs, setDropLostSalaryLakhs] = useState<number>(defaultEntryLakhs);

  // TRUST UPGRADE 1 & 3: "Sharma Ji Ka Beta" Reality Check WhatsApp Card Modal
  const [localRealityModal, setLocalRealityModal] = useState<boolean>(false);
  const showRealityModal = localRealityModal || Boolean(externalOpenCardModal);
  const setShowRealityModal = (val: boolean) => setLocalRealityModal(val);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const closeRealityModal = () => {
    setLocalRealityModal(false);
    onCloseExternalModal?.();
  };

  const trajectory = career ? computeSalaryTrajectory(career) : null;
  const entryMonthlyInHand = trajectory?.points[0]?.monthlyInHandInr || 52000;
  const entryMedianLpa = trajectory?.entryMedianLpa || defaultEntryLakhs;
  const courseFeeLakhs = career?.avgCourseFeeLakhs || 4.0;
  const fourYearEarningsLakhs = Number((entryMedianLpa * 4.6).toFixed(1));
  const dropCost = calculateDropYearCost(dropCoachingLakhs, dropLostSalaryLakhs, 0.8);

  // Draw the shareable WhatsApp Reality Check Card on HTML5 Canvas when modal opens
  useEffect(() => {
    if (!showRealityModal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 800;
    const h = 520;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    // Outer Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Top Header Strip
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 16, w - 32, 54);
    ctx.fillStyle = '#0a0a0a';
    ctx.font = '800 16px "JetBrains Mono", monospace';
    ctx.fillText('CAREERPATHO REALITY CHECK CARD • SHARMA JI KA BETA DEFENSE', 34, 49);

    // Career Title
    const careerTitle = career ? getFormalDesignation(career, 'en') : 'Career Track';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(careerTitle.slice(0, 48), 36, 108);

    ctx.fillStyle = '#b3b3b3';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('[⚠️ ZERO SALARY GUARANTEE • HISTORICAL / MARKET ESTIMATE ONLY]', 36, 134);

    // Box 1: The "Sharma Ji Ka Beta" ₹24 LPA Headline Myth vs Reality
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#141414';
    ctx.fillRect(36, 154, w - 72, 118);
    ctx.strokeRect(36, 154, w - 72, 118);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText('1. THE HEADLINE CTC MYTH vs. ACTUAL MONTHLY IN-HAND REALITY:', 52, 180);

    ctx.fillStyle = '#e5e5e5';
    ctx.font = '600 15px "DM Sans", sans-serif';
    ctx.fillText(
      "• Sharma ji's son's ₹24 LPA package = ₹1.3 Lakh/month gross CTC.",
      52,
      208
    );
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 16px "DM Sans", sans-serif';
    ctx.fillText(
      '• Actual In-Hand after tax, PF & 4-Yr ESOPs = ₹75,000/month. Don\'t be fooled by headlines!',
      52,
      234
    );
    ctx.fillStyle = '#a3a3a3';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    const shortSal = (salary?.entry?.split('(')[0]?.split('Source:')[0]?.trim() || `₹${entryMedianLpa} LPA`).slice(0, 36);
    ctx.fillText(
      `• This Career (${(career?.title || 'Track').slice(0, 28)}): ${shortSal} → In-Hand: ~₹${entryMonthlyInHand.toLocaleString('en-IN')}/mo`,
      52,
      258,
      w - 104
    );

    // Box 2: 4-Year ROI (Total Fees vs 4-Year Salary) & Drop-Year Loss
    ctx.fillStyle = '#141414';
    ctx.fillRect(36, 288, w - 72, 135);
    ctx.strokeRect(36, 288, w - 72, 135);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText('2. 4-YEAR ROI (FEES vs. EARNINGS) & DROP-YEAR LOSS AUDIT:', 52, 314);

    ctx.fillStyle = '#e5e5e5';
    ctx.font = '600 15px "DM Sans", sans-serif';
    ctx.fillText(
      `• Est. Course Fee: ₹${courseFeeLakhs} Lakhs  |  4-Year Cumulative Earnings: ~₹${fourYearEarningsLakhs} Lakhs`,
      52,
      342
    );
    ctx.fillText(
      `• 1-Year Unplanned Drop Loss: ₹1.5L Coaching + ₹${entryMedianLpa}L Lost Salary = ₹${(1.5 + entryMedianLpa).toFixed(1)} Lakhs Lost!`,
      52,
      370
    );
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(
      '• Verdict: High-ROI Track • Saves ₹10–15 Lakhs vs Private College Debt Trap',
      52,
      398
    );

    // Bottom Viral Footer
    ctx.fillStyle = '#a3a3a3';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText(
      'Generated via CareerPathO.in — 100% Free, No Login, Zero Spam. Data verified via Govt Portals.',
      36,
      468
    );
  }, [showRealityModal, career, salary, entryMedianLpa, entryMonthlyInHand, courseFeeLakhs, fourYearEarningsLakhs]);

  if (!salary || (!salary.entry && !salary.mid && !salary.senior)) {
    return null;
  }

  const heading = tr(
    lang,
    'Compensation, In-Hand & ROI Reality Check',
    'वेतन, इन-हैंड और ROI की सच्चाई (Reality Check)'
  );
  const emiLineText = tr(
    lang,
    'If you take a ₹5L loan at 9% for 10 years: EMI ₹6,332/month',
    'यदि आप 9% ब्याज पर 10 वर्षों के लिए ₹5 लाख का एजुकेशन लोन लेते हैं: EMI ₹6,332/माह'
  );
  const disclaimerText = tr(
    lang,
    'NON-GUARANTEE NOTICE: All salary, in-hand, and ROI figures are illustrative estimates only — NEVER guaranteed. Actual earnings depend on individual skill, college tier, city, and hiring market conditions, and can be significantly lower (or ₹0 if unplaced).',
    'गैर-गारंटी सूचना: सभी वेतन, इन-हैंड और ROI आंकड़े केवल उदाहरण और अनुमान हैं — किसी भी सैलरी की कोई गारंटी नहीं है। वास्तविक आय कौशल, कॉलेज और बाजार की स्थिति पर निर्भर करती है।'
  );

  const calculatedEMI = calculateLoanEMI(loanPrincipal, interestRate, loanTenure);

  const handleDownloadRealityCardPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `CareerPathO-Reality-Card-${career?.id || 'career'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onShowToast?.(
        tr(
          lang,
          'Reality Check PNG Card downloaded! Ready to share on WhatsApp.',
          'Reality Card PNG download ho gaya! Ab WhatsApp par relatives ko bhejein.',
          'रियलिटी चेक कार्ड डाउनलोड हो गया! अब व्हाट्सएप पर शेयर करें।'
        )
      );
    } catch {
      onShowToast?.('Reality Card ready');
    }
  };

  const handleShareRealityWhatsApp = () => {
    const shareText = `📊 *CareerPathO Reality Check (${career?.title || 'Career'})*\n• Sharma ji's son's ₹24 LPA package = ₹1.3L/mo gross CTC, but Actual In-Hand after tax & ESOPs = ₹75,000/month. Don't be fooled by headlines!\n• ${career?.title || 'This Career'} Starting CTC: ${salary.entry} (~₹${entryMonthlyInHand.toLocaleString('en-IN')}/mo In-Hand)\n• 4-Yr ROI: ₹${courseFeeLakhs}L Fees vs ₹${fourYearEarningsLakhs}L 4-Yr Earnings\n• 1-Yr Drop Loss: ₹${dropCost.totalLossLakhs} Lakhs\nVerify free at: ${typeof window !== 'undefined' ? window.location.href : 'https://careerpatho.in'}`;
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
          {/* TRUST UPGRADE: Generate Reality Card / Share Reality Check button */}
          <button
            type="button"
            onClick={() => setShowRealityModal(true)}
            data-testid="generate-reality-card-btn"
            className="min-h-[48px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-extrabold bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {tr(
                lang,
                'Generate Reality Card (Share Reality Check)',
                'Generate Reality Card (WhatsApp Share)',
                'रियलिटी कार्ड बनाएं (Share Reality Check)'
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowCalculator(!showCalculator)}
            className="min-h-[48px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-[var(--text)]" />
            <span>{tr(lang, 'EMI & Drop Cost Simulator', 'EMI और ड्रॉप कैलकुलेटर')}</span>
          </button>
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
            'Sharma ji\'s son\'s ₹24 LPA package = ₹1.3 Lakh/month CTC. Actual In-Hand after tax, PF & 4-year ESOPs = ₹75,000/month. Don\'t be fooled by inflated brochure headlines!',
            'Sharma ji ke bete ka ₹24 LPA package = ₹1.3 Lakh/month CTC hota hai, par tax, PF aur 4-year ESOPs katne ke baad Actual In-Hand = ₹75,000/month aata hai. Brochure headlines se dhokha mat khayein!',
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 font-mono-num items-stretch">
        <div className="p-3.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] flex flex-col justify-between">
          <div className="text-xs text-[var(--text-dim)] mb-1.5">
            {tr(lang, 'Est. Entry Range (Not Guaranteed)', 'अनुमानित शुरुआती रेंज (गारंटीकृत नहीं)')}
          </div>
          <div className="text-xs sm:text-sm font-bold text-[var(--text)] leading-snug break-words">
            {salary.entry?.split('Source:')[0]?.trim() || 'N/A'}
          </div>
        </div>
        <div className="p-3.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] flex flex-col justify-between">
          <div className="text-xs text-[var(--text-dim)] mb-1.5">
            {tr(lang, 'Est. Mid-Career (Not Guaranteed)', 'अनुमानित मध्य-करियर (गारंटीकृत नहीं)')}
          </div>
          <div className="text-xs sm:text-sm font-bold text-[var(--text)] leading-snug break-words">
            {salary.mid || 'N/A'}
          </div>
        </div>
        <div className="p-3.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] flex flex-col justify-between">
          <div className="text-xs text-[var(--text-dim)] mb-1.5">
            {tr(lang, 'Est. Senior Range (8–15 Yrs)', 'अनुमानित वरिष्ठ स्तर (8–15 वर्ष)')}
          </div>
          <div className="text-xs sm:text-sm font-bold text-[var(--text)] leading-snug break-words">
            {salary.senior || 'N/A'}
          </div>
        </div>
        <div className="p-3.5 rounded-lg border bg-[var(--text)] text-[var(--bg)] border-[var(--text)] flex flex-col justify-between">
          <div className="text-xs opacity-75 mb-1.5">
            {tr(lang, 'Rare Top 10% Outlier (Not Typical)', 'शीर्ष 10% अपवाद (सामान्य नहीं)')}
          </div>
          <div className="text-sm sm:text-base font-extrabold leading-snug break-words">
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
              <span>{tr(lang, '1-Yr Coaching Fee:', 'कोचिंग फीस (Coaching Fee):')}</span>
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
              <span>{tr(lang, '1-Yr Lost Starting Salary:', '1 साल की खोई हुई सैलरी (Lost Salary):')}</span>
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
            {tr(lang, 'Custom Education Loan Simulator', 'एजुकेशन लोन EMI सिम्युलेटर')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1 text-[var(--text-dim)] font-mono-num">
                <span>{tr(lang, 'Loan Amount', 'लोन राशि (Loan Amount)')}:</span>
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
                <span>{tr(lang, 'Tenure', 'अवधि (Repayment Tenure)')}:</span>
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
              {tr(lang, 'Estimated Monthly EMI (at 9% p.a.):', 'अनुमानित मासिक किस्त (Monthly EMI at 9% p.a.):')}
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
                  WHATSAPP SHAREABLE IMAGE • SHARMA JI KA BETA DEFENSE
                </div>
                <h4 className="text-lg font-extrabold text-[var(--text)]">
                  {tr(
                    lang,
                    'Inflated CTC vs. Actual In-Hand & 4-Year ROI Card',
                    'CTC vs In-Hand & ROI Reality Card (WhatsApp Shareable)',
                    'विज्ञापित CTC बनाम असली इन-हैंड और 4-वर्षीय ROI कार्ड'
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
                <span>Ready to send to parents & relatives on WhatsApp</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadRealityCardPng}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{tr(lang, 'Download PNG Image', 'PNG इमेज डाउनलोड करें')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareRealityWhatsApp}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{tr(lang, 'Copy WhatsApp Card Text', 'व्हाट्सएप टेक्स्ट कॉपी करें')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
