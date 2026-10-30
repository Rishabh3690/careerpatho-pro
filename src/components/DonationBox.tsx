import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../data/types';
import { loadPreference, savePreference } from '../utils/careerEngine';
import {
  Copy,
  Check,
  Sparkles,
  Users,
  Quote,
  QrCode,
  CheckCircle2,
} from 'lucide-react';

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

// Fake testimonials removed. Real ones will be added by users via localStorage.
export const INITIAL_SUPPORTERS: SupporterEntry[] = [];

// Official static QR code image placed in /public/GooglePay_QR.png
export const STATIC_UPI_QR_PATH = '/GooglePay_QR.png';
export const OFFICIAL_UPI_ID = 'gauravsinghrenu@oksbi';

export const DonationBox: React.FC<DonationBoxProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  // Live funding state fetched from /funding.json
  const [funding, setFunding] = useState({
    goal: 15000,
    filled: 5000,
    studentsHelped: 5000,
    studentsTarget: 15000,
  });

  useEffect(() => {
    fetch('/funding.json')
      .then((res) => res.json())
      .then((data) => setFunding(data))
      .catch((err) => console.log("Error loading funding data:", err));
  }, []);

  const GOAL_INR = funding.goal;
  const FILLED_INR = funding.filled;
  const STUDENTS_HELPED_CURRENT = funding.studentsHelped;
  const STUDENTS_HELPED_TARGET = funding.studentsTarget;

  const [selectedAmount, setSelectedAmount] = useState<number>(299);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Live Patron Badge Preview state
  const [patronName, setPatronName] = useState<string>('');
  const [patronCity, setPatronCity] = useState<string>('');
  const [patronNote, setPatronNote] = useState<string>('');
  const [pledgeSaved, setPledgeSaved] = useState<boolean>(false);

  const upiId = OFFICIAL_UPI_ID;

  const currentFillPct = Number(((FILLED_INR / GOAL_INR) * 100).toFixed(1));
  const projectedFillPct = Math.min(
    100,
    Number((((FILLED_INR + selectedAmount) / GOAL_INR) * 100).toFixed(1))
  );
  const addedPct = Math.max(1.5, projectedFillPct - currentFillPct);

  const badgeTierLabel = useMemo(() => {
    if (selectedAmount >= 1000) return isHi ? 'फाउंडिंग संरक्षक' : 'FOUNDING PATRON';
    if (selectedAmount >= 500) return isHi ? 'छात्र स्पॉन्सर' : 'STUDENT SPONSOR';
    if (selectedAmount >= 149) return isHi ? 'सर्वर संरक्षक' : 'SERVER PATRON';
    return isHi ? 'समर्थक बैज' : 'COMMUNITY SUPPORTER';
  }, [selectedAmount, isHi]);

  const handleCopyUpi = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(upiId).then(() => {
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2500);
      });
    } else {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleRecordSupporterPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patronName.trim()) return;
    const existing = loadPreference<SupporterEntry[]>('careerpatho-supporters', INITIAL_SUPPORTERS);
    const newEntry: SupporterEntry = {
      name: patronName.trim(),
      roleOrCity: patronCity.trim() || (isHi ? 'भारत' : 'Supporter · India'),
      amount: selectedAmount,
      note:
        patronNote.trim() ||
        (isHi
          ? 'भारतीय छात्रों के लिए निःशुल्क और निष्पक्ष करियर मार्गदर्शन का समर्थन।'
          : 'Keeping honest, commission-free career guidance alive for Indian students.'),
      tier: badgeTierLabel,
      date: 'Just Now',
    };
    savePreference('careerpatho-supporters', [newEntry, ...existing]);
    setPledgeSaved(true);
  };

  const amountPresets = [100, 299, 599, 1000];

  return (
    <div
      id="student-patronage-vault"
      className="rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] p-5 sm:p-7 transition-all no-print"
    >
      {/* 1. THE QUOTE */}
      <blockquote className="pb-5 mb-6 border-b border-[var(--border2)]">
        <div className="flex items-start gap-3">
          <Quote className="w-6 h-6 text-[var(--text)] shrink-0 mt-0.5" />
          <div>
            <p className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-[var(--text)] leading-snug text-balance">
              {isHi
                ? '“प्राइवेट काउंसलर ₹10,000 लेते हैं और स्पॉन्सर्ड कॉलेज बेचते हैं। हमने 100+ करियर रोडमैप ₹0 रखे हैं — ताकि किसी भी छात्र का भविष्य पैसों की कमी से न रुके।”'
                : '“Private counselors charge ₹10,000 and push sponsored colleges. We made 100+ verified career roadmaps ₹0 — help an independent student builder keep this server alive.”'}
            </p>
          </div>
        </div>
      </blockquote>

      {/* 2. THE GOAL & HIGH-CONTRAST CONTRIBUTION PROGRESS BAR */}
      <div className="p-4 sm:p-5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
          <div>
            <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[var(--text3)] mb-1">
              {isHi
                ? 'लाइव योगदान प्रगति · वास्तविक छात्र प्रभाव'
                : 'CONTRIBUTION PROGRESS · REAL-WORLD STUDENT IMPACT'}
            </div>
            <div className="flex items-baseline flex-wrap gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[var(--text)] tabular-nums">
                ₹{FILLED_INR.toLocaleString('en-IN')}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[var(--text2)] tabular-nums">
                / ₹{GOAL_INR.toLocaleString('en-IN')} INR {isHi ? 'लक्ष्य' : 'Goal'}
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase tabular-nums">
                {currentFillPct}% FILLED · ₹{(GOAL_INR - FILLED_INR).toLocaleString('en-IN')} NEEDED
              </span>
            </div>
          </div>

          {/* Real-World Impact Counter */}
          <div className="px-3.5 py-2 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] flex items-center gap-2.5 self-start sm:self-end">
            <Users className="w-4 h-4 text-[var(--text)] shrink-0" />
            <div className="font-mono">
              <div className="text-xs font-extrabold text-[var(--text)] tabular-nums">
                {STUDENTS_HELPED_CURRENT.toLocaleString('en-IN')} / {STUDENTS_HELPED_TARGET.toLocaleString('en-IN')}{' '}
                {isHi ? 'छात्रों की मदद हुई' : 'Students Helped'}
              </div>
              <div className="text-[10px] text-[var(--text2)] tabular-nums">
                {isHi
                  ? `+₹${selectedAmount} = +${selectedAmount} और छात्रों के लिए मुफ़्त रोडमैप`
                  : `Your ₹${selectedAmount} helps +${selectedAmount.toLocaleString('en-IN')} more students free`}
              </div>
            </div>
          </div>
        </div>

        {/* High-Contrast Segmented Contribution Progress Bar */}
        <div
          className="relative w-full h-5 rounded-lg overflow-hidden bg-[var(--bg3)] border-2 border-[var(--text)] p-0.5 flex items-center"
          role="progressbar"
          aria-valuenow={FILLED_INR}
          aria-valuemin={0}
          aria-valuemax={GOAL_INR}
          aria-label={`Contribution progress: ${FILLED_INR} of ${GOAL_INR} INR raised`}
        >
          <div
            className="h-full bg-[var(--text)] rounded-l-sm transition-all duration-500 shrink-0"
            style={{ width: `${Math.max(3, currentFillPct)}%` }}
            title={`Current: ₹${FILLED_INR}`}
          />
          <div
            className="h-full bg-[var(--text)] opacity-40 border-r-2 border-[var(--text)] transition-all duration-300 shrink-0"
            style={{ width: `${addedPct}%` }}
            title={`Your impact: +₹${selectedAmount}`}
          />
        </div>

        {/* Impact Scale Milestones under Bar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[var(--text2)]">
          <span className="font-bold text-[var(--text)]">
            ● {isHi ? `अभी: ₹${FILLED_INR}` : `NOW: ₹${FILLED_INR} Raised`}
          </span>
          <span>
            {isHi
              ? `आपका +₹${selectedAmount} इसे ₹${(FILLED_INR + selectedAmount).toLocaleString('en-IN')} तक पहुंचाएगा`
              : `With your +₹${selectedAmount} → ₹${(FILLED_INR + selectedAmount).toLocaleString('en-IN')}`}
          </span>
          <span className="font-bold text-[var(--text)]">
            {isHi ? `लक्ष्य: ₹${GOAL_INR}` : `GOAL: ₹${GOAL_INR}`}
          </span>
        </div>
      </div>

      {/* 3 & 4. COMPACT 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT: BADGE MAKER */}
        <form
          onSubmit={handleRecordSupporterPledge}
          className="lg:col-span-7 p-4 sm:p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isHi
                    ? 'अपना संरक्षक बैज (Patron Badge) कैसे बनाएं?'
                    : 'HOW TO MAKE & CLAIM YOUR PATRON BADGE'}
                </span>
              </div>
              <a
                href="#/supporters"
                className="text-[11px] font-mono font-bold text-[var(--text)] underline hover:opacity-80"
              >
                {isHi ? 'समर्थक वॉल देखें →' : 'Supporters Wall →'}
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
                <div className="font-extrabold text-[var(--text)] mb-0.5">
                  {isHi ? 'चरण 1: QR स्कैन या UPI' : 'STEP 1: SCAN QR OR UPI'}
                </div>
                <div className="text-[var(--text2)] leading-snug">
                  {isHi
                    ? 'दाईं ओर दिए गए QR कोड को स्कैन करें या UPI ID कॉपी करें।'
                    : 'Scan the fixed Google Pay QR on the right or copy the UPI ID.'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
                <div className="font-extrabold text-[var(--text)] mb-0.5">
                  {isHi ? 'चरण 2: बैज कस्टमाइज़' : 'STEP 2: CUSTOMIZE'}
                </div>
                <div className="text-[var(--text2)] leading-snug">
                  {isHi
                    ? 'नीचे अपना नाम, शहर/कॉलेज और संदेश टाइप करें।'
                    : 'Type your Name, City/College & short note below.'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
                <div className="font-extrabold text-[var(--text)] mb-0.5">
                  {isHi ? 'चरण 3: बैज पिन करें' : 'STEP 3: PIN BADGE'}
                </div>
                <div className="text-[var(--text2)] leading-snug">
                  {isHi
                    ? 'बटन दबाकर अपना बैज स्थायी रूप से Wall पर जोड़ें।'
                    : 'Click Claim Badge to pin it on the Supporters Wall.'}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text3)] uppercase mb-1.5">
                <span>
                  <QrCode className="w-3 h-3 inline mr-1" />
                  {isHi ? 'बैज टियर के लिए अपनी योगदान राशि चुनें (INR)' : 'SELECT PLEDGE AMOUNT FOR BADGE TIER'}
                </span>
                <span className="font-bold text-[var(--text)] tabular-nums">₹{selectedAmount} INR</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {amountPresets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-1.5 rounded-lg font-mono font-bold text-xs transition-colors cursor-pointer tabular-nums ${
                      selectedAmount === amt
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'bg-[var(--bg2)] text-[var(--text)] border border-[var(--border2)] hover:border-[var(--text)]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
                <input
                  type="number"
                  min={10}
                  max={50000}
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Math.max(10, Number(e.target.value) || 100))}
                  aria-label="Custom INR amount"
                  title="Custom INR amount"
                  className="px-1.5 py-1.5 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] font-mono font-bold text-xs text-center tabular-nums outline-none focus:border-[var(--text)]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[9px] font-mono font-extrabold uppercase">
                    {badgeTierLabel}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-[var(--text)] truncate">
                    {patronName.trim() || (isHi ? 'आपका नाम (Your Name)' : 'Your Name Here')}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text3)] truncate">
                    · {patronCity.trim() || (isHi ? 'आपका शहर / कॉलेज' : 'Your City / College')}
                  </span>
                </div>
                <p className="text-xs text-[var(--text2)] italic line-clamp-2">
                  “
                  {patronNote.trim() ||
                    (isHi
                      ? 'यह प्लेटफॉर्म हर भारतीय छात्र के लिए मुफ़्त और निष्पक्ष रहना चाहिए!'
                      : 'Helped fund free career blueprints for students across India.')}
                  ”
                </p>
              </div>
              <div className="text-right font-mono shrink-0">
                <div className="text-sm sm:text-base font-extrabold text-[var(--text)] tabular-nums">
                  ₹{selectedAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[9px] text-[var(--text3)] uppercase">
                  +{selectedAmount} {isHi ? 'छात्र' : 'STUDENTS'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={patronName}
                onChange={(e) => {
                  setPatronName(e.target.value);
                  setPledgeSaved(false);
                }}
                placeholder={isHi ? 'आपका नाम (जैसे: आदित्य वर्मा)' : 'Your Name (e.g. Aditya Verma)'}
                className="min-h-[36px] px-3 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] outline-none focus:border-[var(--text)]"
              />
              <input
                type="text"
                value={patronCity}
                onChange={(e) => {
                  setPatronCity(e.target.value);
                  setPledgeSaved(false);
                }}
                placeholder={isHi ? 'शहर या कॉलेज (जैसे: दिल्ली / NIT)' : 'City or College (e.g. Pune / IIT-B)'}
                className="min-h-[36px] px-3 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] outline-none focus:border-[var(--text)]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 text-xs">
              <input
                type="text"
                value={patronNote}
                onChange={(e) => {
                  setPatronNote(e.target.value);
                  setPledgeSaved(false);
                }}
                placeholder={
                  isHi
                    ? 'छात्रों के लिए 1-लाइन का संदेश...'
                    : '1-line message for your Patron Badge...'
                }
                className="flex-1 min-h-[36px] px-3 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] outline-none focus:border-[var(--text)]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-mono font-extrabold text-xs bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {pledgeSaved
                    ? isHi
                      ? 'बैज पिन हो गया!'
                      : 'Patron Badge Pinned!'
                    : isHi
                    ? 'मेरा बैज बनाएं →'
                    : 'Claim Patron Badge →'}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* RIGHT: STATIC QR CODE */}
        <div className="lg:col-span-5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] p-4 sm:p-5 flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-[var(--text2)] uppercase mb-2">
            <span className="font-bold text-[var(--text)]">
              <QrCode className="w-3.5 h-3.5 inline mr-1" />
              {isHi ? 'आधिकारिक Google Pay QR' : 'OFFICIAL GOOGLE PAY UPI QR'}
            </span>
            <span>GAURAV SINGH</span>
          </div>

          <div className="p-2 rounded-2xl bg-white border-2 border-black shadow-md my-1 flex flex-col items-center justify-center">
            <img
              src={STATIC_UPI_QR_PATH}
              alt="Scan to pay Gaurav Singh (gauravsinghrenu@oksbi) with any UPI app"
              data-testid="static-gpay-qr-img"
              className="w-56 sm:w-64 h-auto max-w-full rounded-xl block object-contain select-none"
            />
          </div>

          <div className="w-full mt-3 p-2.5 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] flex items-center justify-between gap-2">
            <div className="text-left pl-1 min-w-0">
              <div className="text-[9px] font-mono uppercase text-[var(--text3)]">OFFICIAL UPI ID</div>
              <div
                data-testid="official-upi-id-text"
                className="font-mono font-extrabold text-xs text-[var(--text)] truncate"
              >
                {upiId}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyUpi}
              data-testid="copy-upi-id-btn"
              className="px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? (isHi ? 'कॉपी!' : 'Copied!') : isHi ? 'कॉपी करें' : 'Copy UPI'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};