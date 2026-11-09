import React, { useState, useMemo, useRef } from 'react';
import { ChildCareer, Language } from '../data/types';
import {
  estimateSmartSalaryProjection,
  SmartEstimatorStream,
  SmartEstimatorCity,
  SmartEstimatorExperience,
  tr,
} from '../utils/careerEngine';
import {
  Calculator,
  MapPin,
  Briefcase,
  GraduationCap,
  Download,
  TrendingUp,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface SmartSalaryEstimatorProps {
  career?: ChildCareer;
  lang: Language;
  onShowToast?: (msg: string) => void;
}

function inferDefaultStreamFromCareer(career?: ChildCareer): SmartEstimatorStream {
  if (!career) return 'pcm-tech';
  const cat = career.category.toLowerCase();
  if (cat === 'medical') return 'pcb-medical';
  if (cat === 'commerce') return 'commerce-fin';
  if (cat === 'law') return 'law-policy';
  if (cat === 'design' || cat === 'arts') return 'design-media';
  if (cat === 'government') return 'govt-defense';
  if (cat === 'vocational') return 'vocational-skill';
  return 'pcm-tech';
}

export const SmartSalaryEstimator: React.FC<SmartSalaryEstimatorProps> = ({
  career,
  lang,
  onShowToast,
}) => {
  const [stream, setStream] = useState<SmartEstimatorStream>(() =>
    inferDefaultStreamFromCareer(career)
  );
  const [city, setCity] = useState<SmartEstimatorCity>('tier1-tech');
  const [experience, setExperience] = useState<SmartEstimatorExperience>('fresher');
  const [useCustomBase, setUseCustomBase] = useState<boolean>(Boolean(career?.entrySalaryLakhs));
  const [customBaseLpa, setCustomBaseLpa] = useState<number>(career?.entrySalaryLakhs || 9.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const projection = useMemo(
    () =>
      estimateSmartSalaryProjection(
        stream,
        city,
        experience,
        useCustomBase ? customBaseLpa : undefined
      ),
    [stream, city, experience, useCustomBase, customBaseLpa]
  );

  const streamOptions: Array<{ id: SmartEstimatorStream; labelEn: string; labelHi: string }> = [
    { id: 'pcm-tech', labelEn: 'PCM • B.Tech / BCA / AI & Software', labelHi: 'PCM • बी.टेक / BCA / सॉफ्टवेयर' },
    { id: 'pcb-medical', labelEn: 'PCB • MBBS / BDS / Pharmacy / BioTech', labelHi: 'PCB • मेडिकल / फार्मेसी / बायोटेक' },
    { id: 'commerce-fin', labelEn: 'Commerce • CA / CFA / BBA / MBA Finance', labelHi: 'कॉमर्स • CA / CFA / MBA फाइनेंस' },
    { id: 'law-policy', labelEn: 'Law & Policy • BA LLB / Corporate Counsel', labelHi: 'कानून • BA LLB / कॉर्पोरेट लॉ' },
    { id: 'design-media', labelEn: 'Design & Media • B.Des / UX / Product', labelHi: 'डिज़ाइन और मीडिया • B.Des / UX' },
    { id: 'govt-defense', labelEn: 'Sarkari & Defense • UPSC / SSC / PSU / NDA', labelHi: 'सरकारी व रक्षा • UPSC / SSC / NDA' },
    { id: 'vocational-skill', labelEn: 'Vocational • Aviation / Merchant Navy / Culinary', labelHi: 'वोकेशनल • पायलट / मर्चेंट नेवी' },
  ];

  const cityOptions: Array<{ id: SmartEstimatorCity; labelEn: string; labelHi: string; tag: string }> = [
    {
      id: 'tier1-tech',
      labelEn: 'Bengaluru / Hyderabad (Tier-1 Tech)',
      labelHi: 'बेंगलुरु / हैदराबाद (Tier-1 Tech)',
      tag: '1.18x Pay • High Rent',
    },
    {
      id: 'tier1-metro',
      labelEn: 'Mumbai / Delhi NCR (Tier-1 Metro)',
      labelHi: 'मुंबई / दिल्ली NCR (Tier-1 Metro)',
      tag: '1.15x Pay • Max Rent',
    },
    {
      id: 'tier15-hub',
      labelEn: 'Pune / Chennai / Ahmedabad / Kolkata',
      labelHi: 'पुणे / चेन्नई / अहमदाबाद / कोलकाता',
      tag: '1.0x Pay • Balanced ROI',
    },
    {
      id: 'tier2-hometown',
      labelEn: 'Jaipur / Indore / Lucknow / Patna (Tier-2/3)',
      labelHi: 'जयपुर / इंदौर / लखनऊ / पटना (Tier-2/3)',
      tag: '0.84x Pay • Max Savings',
    },
  ];

  const expOptions: Array<{ id: SmartEstimatorExperience; labelEn: string; labelHi: string }> = [
    { id: 'fresher', labelEn: 'Fresher (0–1 Yr)', labelHi: 'फ्रेशर (0–1 वर्ष)' },
    { id: 'junior', labelEn: 'Junior (2–4 Yrs)', labelHi: 'जूनियर (2–4 वर्ष)' },
    { id: 'mid', labelEn: 'Mid-Senior (5–8 Yrs)', labelHi: 'मिड-सीनियर (5–8 वर्ष)' },
    { id: 'senior', labelEn: 'Principal / Lead (10+ Yrs)', labelHi: 'सीनियर लीड (10+ वर्ष)' },
  ];

  const inHandPct = Math.round(
    (projection.actualMonthlyInHandInr / Math.max(1, projection.grossMonthlyInr)) * 100
  );

  const handleExportEstimatorCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 800;
    const h = 460;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 16, w - 32, 52);
    ctx.fillStyle = '#0a0a0a';
    ctx.font = '800 15px "JetBrains Mono", monospace';
    ctx.fillText('CAREERPATHO SMART SALARY ESTIMATOR • GROSS CTC vs ACTUAL IN-HAND', 32, 48);

    const streamObj = streamOptions.find((s) => s.id === stream);
    const cityObj = cityOptions.find((c) => c.id === city);
    const expObj = expOptions.find((e) => e.id === experience);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      career ? `${career.title} (${expObj?.labelEn || ''})` : `${streamObj?.labelEn || ''} (${expObj?.labelEn || ''})`,
      34,
      104
    );

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText(`City Tier: ${cityObj?.labelEn || ''} • [✅ Eligible for UPSC/SSC/Bank PO]`, 34, 130);

    // Box 1: Gross CTC vs In-Hand
    ctx.fillStyle = '#141414';
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.fillRect(34, 150, w - 68, 120);
    ctx.strokeRect(34, 150, w - 68, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(
      `GROSS CTC: ₹${projection.grossCtcLpa} LPA (₹${projection.grossMonthlyInr.toLocaleString('en-IN')}/mo)  →  ACTUAL IN-HAND: ₹${projection.actualMonthlyInHandInr.toLocaleString('en-IN')}/month`,
      50,
      182
    );

    ctx.fillStyle = '#d4d4d4';
    ctx.font = '600 14px "DM Sans", sans-serif';
    ctx.fillText(
      `• Tax + PF Deduction: -₹${projection.monthlyTaxAndPfInr.toLocaleString('en-IN')}/mo  |  Locked Variable/ESOPs: -₹${projection.monthlyVariableAndEsopLockedInr.toLocaleString('en-IN')}/mo`,
      50,
      214
    );
    ctx.fillText(
      `• Real Take-Home Ratio: ${inHandPct}% of Headline CTC (${projection.sarkariEquivalentGrade})`,
      50,
      244
    );

    // Box 2: City Living Cost & Net Savings
    ctx.fillStyle = '#141414';
    ctx.fillRect(34, 286, w - 68, 108);
    ctx.strokeRect(34, 286, w - 68, 108);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText('CITY LIVING COST vs. NET INVESTABLE MONTHLY SAVINGS:', 50, 314);

    ctx.fillStyle = '#e5e5e5';
    ctx.font = '600 14px "DM Sans", sans-serif';
    ctx.fillText(
      `• Est. City Living & Rent: ₹${projection.estimatedCityLivingCostInr.toLocaleString('en-IN')}/mo  |  Net Monthly Savings: ₹${projection.monthlyInvestableSavingsInr.toLocaleString('en-IN')}/mo`,
      50,
      344
    );
    ctx.fillText(
      `• 4-Year Cumulative In-Hand Take-Home: ~₹${projection.fourYearCumulativeInHandLakhs} Lakhs`,
      50,
      372
    );

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillText(
      'Generated via CareerPathO.in — 100% Free, No Login, Zero Spam. Data verified via Govt Portals.',
      34,
      424
    );

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `CareerPathO-Smart-Salary-${stream}-${city}-${experience}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onShowToast?.(
        tr(
          lang,
          'Smart Salary Projection PNG downloaded!',
          'स्मार्ट सैलरी प्रोजेक्शन कार्ड डाउनलोड हो गया!'
        )
      );
    } catch {
      onShowToast?.('Salary Projection ready');
    }
  };

  return (
    <section
      data-testid="smart-salary-estimator"
      className="rounded-2xl border-2 border-[var(--text)] p-5 sm:p-7 mb-10 bg-[var(--bg2)] transition-colors"
    >
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>
              {tr(
                lang,
                'SMART SALARY ESTIMATOR • STREAM × CITY × EXPERIENCE',
                'स्मार्ट सैलरी एस्टिमेटर • स्ट्रीम × शहर × अनुभव'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]">
            {tr(
              lang,
              'Smart Salary Estimator (Tailored Gross CTC vs. Actual In-Hand)',
              'स्मार्ट वेतन और इन-हैंड अनुमानक (CTC बनाम वास्तविक इन-हैंड)'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] mt-1 max-w-3xl">
            {tr(
              lang,
              'Select your graduation stream, projected Indian city tier, and experience level to compute your exact monthly take-home pay after tax, PF, ESOP locks, and city rent.',
              'अपनी ग्रेजुएशन स्ट्रीम, शहर (Tier-1/2/3) और अनुभव स्तर चुनें—टैक्स, पीएफ और शहर के खर्च के बाद अपनी वास्तविक मासिक इन-हैंड सैलरी और बचत जानें।'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportEstimatorCard}
          data-testid="export-smart-salary-png-btn"
          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shrink-0 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>
            {tr(lang, 'Export Salary Card (PNG)', 'सैलरी कार्ड डाउनलोड करें (PNG)')}
          </span>
        </button>
      </div>

      {/* 3-Column Input Controls: Stream, City, Experience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* 1. Graduation Stream */}
        <div className="p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
          <label
            htmlFor="smart-estimator-stream"
            className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[var(--text3)] mb-2"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[var(--text)]" />
            <span>{tr(lang, '1. Graduation Stream', '1. ग्रेजुएशन स्ट्रीम')}</span>
          </label>
          <select
            id="smart-estimator-stream"
            data-testid="smart-estimator-stream-select"
            value={stream}
            onChange={(e) => {
              setStream(e.target.value as SmartEstimatorStream);
              setUseCustomBase(false);
            }}
            className="w-full min-h-[48px] px-3 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs sm:text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--text)]"
          >
            {streamOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {tr(lang, opt.labelEn, opt.labelHi)}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Projected City */}
        <div className="p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
          <label
            htmlFor="smart-estimator-city"
            className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[var(--text3)] mb-2"
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--text)]" />
            <span>{tr(lang, '2. Projected Work City', '2. कार्य शहर (City Tier)')}</span>
          </label>
          <select
            id="smart-estimator-city"
            data-testid="smart-estimator-city-select"
            value={city}
            onChange={(e) => setCity(e.target.value as SmartEstimatorCity)}
            className="w-full min-h-[48px] px-3 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs sm:text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--text)]"
          >
            {cityOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {tr(lang, opt.labelEn, opt.labelHi)} ({opt.tag})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Experience Level */}
        <div className="p-3.5 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
          <label className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[var(--text3)] mb-2">
            <Briefcase className="w-3.5 h-3.5 text-[var(--text)]" />
            <span>{tr(lang, '3. Experience Level', '3. अनुभव स्तर (Experience)')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {expOptions.map((opt) => {
              const active = experience === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  data-testid={`smart-exp-${opt.id}`}
                  onClick={() => setExperience(opt.id)}
                  className={`min-h-[44px] px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                      : 'bg-[var(--bg2)] text-[var(--text2)] border-[var(--border)] hover:text-[var(--text)]'
                  }`}
                >
                  {tr(lang, opt.labelEn, opt.labelHi)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optional Base CTC Fine-Tuning Slider */}
      <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <SlidersHorizontal className="w-4 h-4 text-[var(--text)] shrink-0" />
          <span className="font-bold text-[var(--text)]">
            {tr(
              lang,
              'Custom Entry Base CTC Slider (Optional Override):',
              'कस्टम शुरुआती पैकेज स्लाइडर (वैकल्पिक):'
            )}
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--bg2)] border border-[var(--border2)] font-extrabold text-[var(--text)]">
            ₹{customBaseLpa} LPA
          </span>
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <input
            type="range"
            min={3.5}
            max={30}
            step={0.5}
            value={customBaseLpa}
            onChange={(e) => {
              setUseCustomBase(true);
              setCustomBaseLpa(Number(e.target.value));
            }}
            aria-label="Custom Base CTC in LPA"
            className="w-full accent-[var(--text)] cursor-pointer"
          />
          {useCustomBase && (
            <button
              type="button"
              onClick={() => setUseCustomBase(false)}
              className="text-[11px] font-mono underline text-[var(--text2)] hover:text-[var(--text)] whitespace-nowrap cursor-pointer"
            >
              {tr(lang, 'Reset Default', 'रीसेट')}
            </button>
          )}
        </div>
      </div>

      {/* Output KPI Grid: Gross CTC vs Actual In-Hand vs City Net Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
            {tr(lang, 'Headline Gross CTC', 'कुल घोषित पैकेज (Gross CTC)')}
          </div>
          <div
            data-testid="smart-gross-ctc"
            className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--text)] tabular-nums"
          >
            ₹{projection.grossCtcLpa} LPA
          </div>
          <div className="text-xs font-mono text-[var(--text2)] mt-1 tabular-nums">
            ₹{projection.grossMonthlyInr.toLocaleString('en-IN')}/mo gross
          </div>
        </div>

        <div className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)]">
          <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[var(--text)] mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{tr(lang, 'Actual Monthly In-Hand', 'असली मासिक इन-हैंड (Take-Home)')}</span>
          </div>
          <div
            data-testid="smart-inhand-monthly"
            className="text-xl sm:text-2xl font-mono font-black text-[var(--text)] tabular-nums"
          >
            ₹{projection.actualMonthlyInHandInr.toLocaleString('en-IN')}/mo
          </div>
          <div className="text-xs font-mono text-[var(--text2)] mt-1">
            {inHandPct}% of Gross CTC ({projection.fixedPayPct}% Fixed)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
            {tr(lang, 'Monthly Net City Savings', 'खर्च के बाद मासिक शुद्ध बचत')}
          </div>
          <div
            data-testid="smart-net-savings"
            className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--text)] tabular-nums"
          >
            ₹{projection.monthlyInvestableSavingsInr.toLocaleString('en-IN')}/mo
          </div>
          <div className="text-xs font-mono text-[var(--text2)] mt-1 tabular-nums">
            After ~₹{projection.estimatedCityLivingCostInr.toLocaleString('en-IN')}/mo city rent/living
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)] mb-1">
            {tr(lang, '4-Year Cumulative In-Hand', '4-वर्षीय कुल इन-हैंड कमाई')}
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--text)] tabular-nums flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5" />
            <span>₹{projection.fourYearCumulativeInHandLakhs}L</span>
          </div>
          <div className="text-[11px] font-mono text-[var(--text2)] mt-1 truncate">
            {projection.sarkariEquivalentGrade}
          </div>
        </div>
      </div>

      {/* Visual Breakdown Strip */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
          <span className="font-bold text-[var(--text)]">
            {tr(
              lang,
              'Monthly CTC Deduction Breakdown (Why Gross ≠ In-Hand):',
              'मासिक कटौती विवरण (Gross पैकेज और In-Hand में अंतर क्यों होता है):'
            )}
          </span>
          <span className="text-[var(--text2)] tabular-nums">
            In-Hand: ₹{projection.actualMonthlyInHandInr.toLocaleString('en-IN')} | Tax+PF: -₹
            {projection.monthlyTaxAndPfInr.toLocaleString('en-IN')} | Locked Variable/ESOP: -₹
            {projection.monthlyVariableAndEsopLockedInr.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[var(--bg2)] border border-[var(--border2)] overflow-hidden flex">
          <div
            className="h-full bg-[var(--text)] transition-all duration-300"
            style={{ width: `${inHandPct}%` }}
            title={`Actual In-Hand (${inHandPct}%)`}
          />
        </div>
      </div>
    </section>
  );
};
