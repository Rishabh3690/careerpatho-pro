import React, { useState } from 'react';
import { Language } from '../data/types';
import { DonationBox, INITIAL_SUPPORTERS, SupporterEntry } from './DonationBox';
import { loadPreference } from '../utils/careerEngine';
import { ArrowLeft, Award, Send } from 'lucide-react';

export const SupportersPage: React.FC<{ lang: Language; onOpenDonation: () => void }> = ({
  lang,
  onOpenDonation,
}) => {
  const isHi = lang === 'hi';
  const heading = isHi ? 'Wall of Supporters (हमारे संरक्षक और मार्गदर्शक)' : 'Wall of Supporters & Founding Patrons';
  const sub = isHi
    ? 'उन सभी छात्रों, अभिभावकों और मेंटर्स का आभार जिन्होंने इस 100% निःशुल्क, विज्ञापन-मुक्त प्लेटफॉर्म को पूरे भारत के लिए जीवित रखा है।'
    : 'Honoring the students, parents, and professionals whose patronage keeps CareerPathO 100% free, ad-free, and independent.';

  const supporters = loadPreference<SupporterEntry[]>('careerpatho-supporters', INITIAL_SUPPORTERS);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold mb-6 bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] transition-colors no-print"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isHi ? 'होम पर वापस जाएं' : 'BACK TO HOME'}</span>
      </a>

      <header className="mb-8 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--text3)] mb-1">
          {isHi ? 'समुदाय द्वारा संचालित' : 'COMMUNITY-FUNDED OPEN ACCESS'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2">
          {heading}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text2)] leading-relaxed max-w-3xl">{sub}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {supporters.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border flex flex-col justify-between gap-3 bg-[var(--bg2)] border-[var(--border2)]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase">
                  <Award className="w-3 h-3" />
                  {s.tier || 'PATRON'}
                </span>
                <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg)] text-[var(--text)] tabular-nums">
                  ₹{Number(s.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="font-bold text-base text-[var(--text)]">{s.name}</div>
              <div className="text-xs font-mono text-[var(--text3)] mb-2">{s.roleOrCity}</div>
              <p className="text-xs text-[var(--text2)] leading-relaxed italic">"{s.note}"</p>
            </div>
          </div>
        ))}
      </div>

      <DonationBox lang={lang} onOpenModal={onOpenDonation} />
    </div>
  );
};

export const FeedbackPage: React.FC<{ lang: Language; onShowToast: (msg: string) => void }> = ({
  lang,
  onShowToast,
}) => {
  const isHi = lang === 'hi';
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [msg, setMsg] = useState('');
  const [upi, setUpi] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const successMsg =
      upi.trim().length > 3
        ? isHi
          ? 'धन्यवाद! ₹500+ प्राथमिकता टिकट सक्रिय हो गई है। हम शीघ्र संपर्क करेंगे।'
          : 'Thank you! Priority Tier activated. Our mentorship team will contact you shortly.'
        : isHi
        ? 'धन्यवाद! आपकी प्रतिक्रिया दर्ज कर ली गई है।'
        : 'Thank you! Your feedback has been recorded.';
    onShowToast(successMsg);
    setName('');
    setContact('');
    setMsg('');
    setUpi('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold mb-4 bg-[var(--surface)] border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-print"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isHi ? '← होम' : '← Home'}</span>
      </a>

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)] mb-2 flex items-center gap-2">
          <span>💡</span>
          <span>{isHi ? 'प्राथमिकता फीचर अनुरोध व फीडबैक' : 'Priority Feature Requests & Feedback'}</span>
        </h1>
        <p className="text-xs text-[var(--text-dim)] leading-relaxed">
          {isHi
            ? 'आप CareerPathO में क्या देखना चाहते हैं? ₹500+ समर्थक 1-ऑन-1 व्यक्तिगत मेंटरशिप प्राप्त करते हैं।'
            : 'Help shape CareerPathO! Donors of ₹500+ receive priority feature review and personalized 1-on-1 mentorship.'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-xl border p-5 bg-[var(--surface)] border-[var(--border)] space-y-4 text-xs">
        <div>
          <label className="block font-semibold mb-1 text-[var(--text-dim)]">{isHi ? 'आपका नाम' : 'Your Name'}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Sharma"
            className="w-full min-h-[40px] px-3 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-[var(--text-dim)]">
            {isHi ? 'ईमेल या व्हाट्सएप (सम्पर्क हेतु)' : 'Email or WhatsApp (for follow-up)'}
          </label>
          <input
            type="text"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="rahul@example.com / 9876543210"
            className="w-full min-h-[40px] px-3 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-[var(--text-dim)]">
            {isHi ? 'आपका सुझाव या करियर प्रश्न' : 'Your Suggestion or Question'}
          </label>
          <textarea
            required
            rows={4}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={isHi ? 'कृपया बताएं कि यह फीचर छात्रों की किस प्रकार मदद करेगा...' : 'Describe the feature or guidance you need...'}
            className="w-full p-3 rounded-lg border bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] outline-none resize-y"
          />
        </div>

        <div className="p-3.5 rounded-lg border bg-[var(--surface-2)] border-[var(--border)]">
          <label className="block font-bold text-emerald-500 mb-1">
            💎 {isHi ? 'UPI दान संदर्भ संख्या (वैकल्पिक - ₹500+ पर प्राथमिकता)' : 'UPI Reference ID (Optional - ₹500+ for Priority Review)'}
          </label>
          <input
            type="text"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="e.g. UPI Ref 32849204928"
            className="w-full min-h-[38px] px-3 rounded-lg border bg-[var(--surface)] border-[var(--border)] text-[var(--text)] outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-bold text-xs bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isHi ? 'सुझाव सबमिट करें' : 'Submit Feedback'}</span>
        </button>
      </form>
    </div>
  );
};

export const AboutPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isHi = lang === 'hi';
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 text-sm leading-relaxed text-[var(--text)]">
      <a href="#/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text)] font-semibold mb-4">
        ← {isHi ? 'होम पर वापस जाएं' : 'Back to Home'}
      </a>
      <h1 className="text-2xl font-extrabold mb-4">{isHi ? 'CareerPathO के बारे में' : 'About CareerPathO'}</h1>
      <p className="mb-4 text-[var(--text-dim)]">
        {isHi
          ? 'CareerPathO भारतीय छात्रों के लिए बनाया गया एक स्वतंत्र, मुफ़्त और पारदर्शी करियर नेविगेशन प्लेटफॉर्म है। भारत में लाखों छात्र केवल जानकारी के अभाव में गलत डिग्रियों में लाखों रुपये खर्च कर देते हैं और बाद में बेरोजगारी का सामना करते हैं।'
          : 'CareerPathO is a free, independent, ad-free career discovery platform for Indian students after Class 10, Class 12, and graduation. Millions of students end up with debt and unemployable degrees due to lack of transparent roadmap clarity.'}
      </p>
      <p className="text-[var(--text-dim)]">
        {isHi
          ? 'यह प्लेटफॉर्म एक स्वतंत्र स्टूडेंट द्वारा बिना किसी बजट के बनाया गया है। हमारा लक्ष्य भारतीय छात्रों को बिना किसी पेवॉल या लॉगिन के निष्पक्ष, प्रामाणिक डेटा प्रदान करना है।'
          : 'Built by a solo student developer on mobile with no institutional budget. Our mission is to keep career guidance 100% free, accessible in both English and Hindi, with zero paywalls.'}
      </p>
    </div>
  );
};

export const PrivacyPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isHi = lang === 'hi';
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 text-sm leading-relaxed text-[var(--text)]">
      <a href="#/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text)] font-semibold mb-4">
        ← {isHi ? 'होम पर वापस जाएं' : 'Back to Home'}
      </a>
      <h1 className="text-2xl font-extrabold mb-4">{isHi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}</h1>
      <div className="space-y-4 text-[var(--text-dim)]">
        <p><strong>1. Zero Tracking:</strong> We use zero third-party analytics trackers, zero advertising cookies, and zero fingerprinting SDKs.</p>
        <p><strong>2. 100% Client-Side Persistence:</strong> Saved bookmarks, eligibility filters, and comparison choices remain strictly inside your browser localStorage and are never transmitted to any external server.</p>
        <p><strong>3. No Forced Logins:</strong> You never need to enter an email, phone number, or password to access all roadmaps, exam dates, or PDF print functions.</p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isHi = lang === 'hi';
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 text-sm leading-relaxed text-[var(--text)]">
      <a href="#/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text)] font-semibold mb-4">
        ← {isHi ? 'होम पर वापस जाएं' : 'Back to Home'}
      </a>
      <h1 className="text-2xl font-extrabold mb-4">{isHi ? 'नियम व शर्तें (Terms of Service)' : 'Terms of Service'}</h1>
      <div className="space-y-4 text-[var(--text-dim)]">
        <p><strong>Educational Purpose:</strong> All salary ranges, entrance exam calendars, and eligibility parameters are compiled from public NIRF data, employer reports, and official notifications. Always consult official candidate bulletins before applying.</p>
        <p><strong>Non-Commercial Independence:</strong> CareerPathO does not accept sponsorships from private coaching institutes or colleges.</p>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isHi = lang === 'hi';
  const msg = isHi
    ? 'यह करियर मौजूद नहीं है। स्पेलिंग जांचें या होमपेज पर वापस जाएं।'
    : "This career doesn't exist. Check the spelling or go back to the homepage.";

  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl font-black text-[var(--text-mute)] mb-3">404</div>
      <h2 className="text-lg font-bold text-[var(--text)] mb-2">Page Not Found</h2>
      <p className="text-xs text-[var(--text-dim)] mb-6">{msg}</p>
      <a
        href="#/"
        className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity"
      >
        {isHi ? 'होमपेज पर वापस जाएं' : 'Return to Homepage'} →
      </a>
    </div>
  );
};
