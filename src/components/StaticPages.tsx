import React, { useState, useMemo } from 'react';
import { CareerListItem, Language } from '../data/types';
import careers250Json from '../data/careers250.json';
import { DonationBox, INITIAL_SUPPORTERS, SupporterEntry } from './DonationBox';
import { loadPreference, tr } from '../utils/careerEngine';
import {
  OFFICIAL_SOURCE_REGISTER,
  CATEGORY_DISTRIBUTION_373_REPORT,
  PHASE_2_DEFERRED_BACKLOG,
} from '../data/officialSourceRegister';
import { ASSESSMENT_METHODOLOGY_RUBRIC } from '../utils/careerAssessmentEngine';
import {
  BUILDER_DIRECT_EMAIL,
  GUARDIAN_LEGAL_EMAIL,
  FeedbackReportType,
  PRIMARY_THREE_FEEDBACK_OPTIONS,
  StoredFeedbackSubmission,
  FeedbackSyncResult,
  submitFeedbackToGoogleSheet,
  loadStoredSubmissions,
  buildAppsScriptPayload,
  buildDirectEmailLinks,
} from '../utils/feedbackSyncEngine';
import {
  ArrowLeft,
  Award,
  Send,
  ExternalLink,
  ShieldCheck,
  Calculator,
  BookOpen,
  Search,
  Layers,
  CheckCircle2,
  Mail,
} from 'lucide-react';

const ALL_DIRECTORY_CAREERS: CareerListItem[] = careers250Json as CareerListItem[];

export const SupportersPage: React.FC<{ lang: Language; onOpenDonation: () => void }> = ({
  lang,
  onOpenDonation,
}) => {
  const heading = tr(
    lang,
    'Community Contributors & Data Reviewers',
    'Community Contributors & Data Reviewers (हमारे मार्गदर्शक)'
  );
  const sub = tr(
    lang,
    'Honoring the students, parents, and educators who review official government data and help keep CareerPathO 100% free, ad-free, and independent.',
    'उन सभी छात्रों, अभिभावकों और शिक्षकों का आभार जो आधिकारिक सरकारी स्रोतों की समीक्षा करके इस 100% निःशुल्क, विज्ञापन-मुक्त प्लेटफॉर्म को सटीक रखने में मदद करते हैं।'
  );

  const supporters = loadPreference<SupporterEntry[]>('careerpatho-supporters', INITIAL_SUPPORTERS);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold mb-6 bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] transition-colors no-print"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{tr(lang, 'BACK TO HOME', 'होम पर वापस जाएं')}</span>
      </a>

      <header className="mb-8 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--text3)] mb-1">
          {tr(lang, 'INDEPENDENT OPEN-ACCESS RESOURCE', 'स्वतंत्र ओपन-एक्सेस संसाधन')}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2 break-words">
          {heading}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text2)] leading-relaxed max-w-3xl break-words">
          {sub}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {supporters.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border flex flex-col justify-between gap-3 bg-[var(--bg2)] border-[var(--border2)]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold uppercase">
                  <Award className="w-3 h-3" />
                  {s.tier || 'CONTRIBUTOR'}
                </span>
                <span className="font-mono font-bold text-xs text-[var(--text2)]">{s.date}</span>
              </div>
              <div className="font-bold text-base text-[var(--text)]">{s.name}</div>
              <div className="text-xs font-mono text-[var(--text3)] mb-2">{s.roleOrCity}</div>
              <p className="text-xs text-[var(--text2)] leading-relaxed italic">&ldquo;{s.note}&rdquo;</p>
            </div>
          </div>
        ))}
      </div>

      <DonationBox lang={lang} onOpenModal={onOpenDonation} />
    </div>
  );
};

export const FeedbackPage: React.FC<{
  lang: Language;
  onShowToast: (msg: string) => void;
  initialCareerId?: string;
  initialReportType?: string;
}> = ({ lang, onShowToast, initialCareerId, initialReportType }) => {
  const isHi = lang === 'hi';

  const initialOption: 'bug_or_misinfo' | 'suggestion' | 'anything_else' =
    initialReportType === 'suggestion'
      ? 'suggestion'
      : initialReportType === 'anything_else'
      ? 'anything_else'
      : 'bug_or_misinfo';

  const [reportType, setReportType] = useState<'bug_or_misinfo' | 'suggestion' | 'anything_else'>(
    initialOption
  );
  const [selectedCareerId, setSelectedCareerId] = useState<string>(initialCareerId || '');
  const [msg, setMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<FeedbackSyncResult | null>(null);
  const [submissions, setSubmissions] = useState<StoredFeedbackSubmission[]>(() =>
    loadStoredSubmissions()
  );

  const selectedCareerObj = useMemo(
    () => ALL_DIRECTORY_CAREERS.find((c) => c.id === selectedCareerId) || null,
    [selectedCareerId]
  );

  const activeOptionMeta =
    PRIMARY_THREE_FEEDBACK_OPTIONS.find((opt) => opt.id === reportType) ||
    PRIMARY_THREE_FEEDBACK_OPTIONS[0];

  const liveEmailLinks = useMemo(() => {
    const draftInput = {
      reportType: reportType as FeedbackReportType,
      careerId: selectedCareerId || undefined,
      careerTitle: selectedCareerObj?.title || undefined,
      proposedCorrection: msg || '(Your message here)',
    };
    const draftPayload = buildAppsScriptPayload(draftInput);
    return buildDirectEmailLinks(draftInput, draftPayload);
  }, [reportType, selectedCareerId, selectedCareerObj, msg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await submitFeedbackToGoogleSheet({
        reportType: reportType as FeedbackReportType,
        careerId: selectedCareerId || undefined,
        careerTitle: selectedCareerObj?.title || undefined,
        proposedCorrection: msg.trim(),
      });

      setLastSyncResult(result);
      setSubmissions(loadStoredSubmissions());

      onShowToast(
        tr(
          lang,
          'Thank you! Your message has been sent straight to our Google Sheet.',
          'धन्यवाद! आपका संदेश सीधे हमारे Google Sheet में भेज दिया गया है।'
        )
      );

      setMsg('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="feedback-page"
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 text-[var(--text)] overflow-x-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <a
          href={selectedCareerId ? `#/career/${selectedCareerId}` : '#/'}
          className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold bg-[var(--bg2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {selectedCareerId
              ? tr(lang, `Back to ${selectedCareerObj?.title || 'Career'}`, 'करियर पेज पर वापस जाएं')
              : tr(lang, '← Back to Home', '← होम पर वापस जाएं')}
          </span>
        </a>

        <span className="text-[11px] font-mono text-[var(--text2)] break-all">
          {tr(lang, 'Direct Email:', 'सीधा ईमेल:')}{' '}
          <a href={`mailto:${BUILDER_DIRECT_EMAIL}`} className="underline font-bold text-[var(--text)]">
            {BUILDER_DIRECT_EMAIL}
          </a>
        </span>
      </div>

      {/* Header */}
      <header className="mb-6 p-5 sm:p-7 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-[11px] font-mono font-extrabold uppercase">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tr(
              lang,
              'QUICK 1-STEP FEEDBACK · ZERO LOGIN · NO PHONE NUMBER',
              'त्वरित 1-स्टेप फीडबैक · कोई लॉगिन नहीं · कोई फोन नंबर नहीं'
            )}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] break-words">
          {tr(lang, 'Send Feedback in Seconds', 'सेकंडों में अपना संदेश या सुधार भेजें')}
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
          {tr(
            lang,
            'Pick 1 of the 3 options below, type your message in the box, and hit Submit. Your message goes directly to our live Google Sheet.',
            'नीचे दिए गए 3 विकल्पों में से कोई 1 चुनें, बॉक्स में अपना संदेश लिखें और सबमिट दबाएं। आपका संदेश सीधे हमारे Google Sheet में पहुँच जाता है।'
          )}
        </p>
      </header>

      {/* Post-Submission Confirmation Banner */}
      {lastSyncResult && (
        <div
          data-testid="feedback-sync-result-banner"
          className="mb-6 p-5 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <CheckCircle2 className="w-5 h-5 text-[var(--text)] shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <div className="font-mono font-extrabold text-xs sm:text-sm text-[var(--text)] break-words">
                  {tr(
                    lang,
                    'Thank you! Your message has been sent straight to our Google Sheet.',
                    'धन्यवाद! आपका संदेश सीधे हमारे Google Sheet में दर्ज हो गया है।'
                  )}
                </div>
                <p className="text-xs text-[var(--text2)] break-words">
                  {tr(
                    lang,
                    'Rishabh reviews every message personally. If you also want to email a screenshot or PDF, click the button on the right.',
                    'ऋषभ हर संदेश को स्वयं पढ़ते हैं। यदि आप कोई स्क्रीनशॉट या PDF ईमेल करना चाहते हैं, तो दाईं ओर बटन दबाएं।'
                  )}
                </p>
              </div>
            </div>

            <a
              href={lastSyncResult.gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="send-via-gmail-btn"
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold inline-flex items-center gap-1.5 hover:opacity-90 shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{tr(lang, 'Also Send via Gmail', 'Gmail से भी भेजें')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Simplified 3-Option + 1-Textbox Form */}
      <form
        onSubmit={handleSubmit}
        data-testid="data-correction-form"
        className="rounded-2xl border-2 border-[var(--border2)] p-5 sm:p-7 bg-[var(--bg2)] space-y-5 text-xs sm:text-sm"
      >
        {/* Optional Career Context Pill if user clicked "Fix Data" on a career card */}
        {selectedCareerObj && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono">
            <span>
              {isHi ? 'चयनित करियर: ' : 'Attached Career: '}
              <strong className="text-[var(--text)]">{selectedCareerObj.title}</strong> ({selectedCareerObj.id})
            </span>
            <button
              type="button"
              onClick={() => setSelectedCareerId('')}
              className="underline text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
            >
              {isHi ? 'हटाएं (Clear)' : 'Clear'}
            </button>
          </div>
        )}

        {/* ONLY 3 OPTIONS */}
        <div>
          <label className="block font-mono font-extrabold text-xs uppercase text-[var(--text)] mb-2.5">
            {tr(lang, 'Choose 1 Option:', 'कोई 1 विकल्प चुनें:')}
          </label>
          <div
            role="radiogroup"
            aria-label="Feedback Category Options"
            data-testid="feedback-three-options-group"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
          >
            {PRIMARY_THREE_FEEDBACK_OPTIONS.map((opt) => {
              const active = reportType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  data-testid={`report-type-${opt.id}`}
                  onClick={() => setReportType(opt.id)}
                  className={`min-h-[52px] p-3.5 rounded-xl border-2 text-left font-mono text-xs font-extrabold transition-colors cursor-pointer break-words ${
                    active
                      ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                      : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border2)] hover:border-[var(--text)]'
                  }`}
                >
                  {isHi ? opt.labelHi : opt.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* ONLY 1 TEXT BOX */}
        <div>
          <label
            htmlFor="feedback-msg"
            className="block font-mono font-extrabold text-xs uppercase text-[var(--text)] mb-2"
          >
            {tr(lang, 'Your Message *', 'आपका संदेश *')}
          </label>
          <textarea
            id="feedback-msg"
            data-testid="feedback-message-textarea"
            required
            rows={5}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={isHi ? activeOptionMeta.placeholderHi : activeOptionMeta.placeholderEn}
            className="w-full p-4 rounded-xl border-2 border-[var(--border2)] focus:border-[var(--text)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text3)] outline-none resize-y text-sm leading-relaxed"
          />
        </div>

        {/* Submit Button + Direct Email Option */}
        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="feedback-submit-sheet-btn"
            className="flex-1 min-h-[50px] px-6 py-3 rounded-xl font-mono font-extrabold text-xs sm:text-sm bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>
              {isSubmitting
                ? tr(lang, 'Sending...', 'भेजा जा रहा है...')
                : tr(lang, 'Send Message Now →', 'संदेश सबमिट करें →')}
            </span>
          </button>

          <a
            href={liveEmailLinks.gmailComposeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="feedback-direct-gmail-link"
            className="min-h-[50px] px-4 py-3 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] font-mono font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>{tr(lang, 'Or Send via Gmail', 'या Gmail से भेजें')}</span>
          </a>
        </div>
      </form>

      {/* Recently Submitted Feedback on This Device */}
      {submissions.length > 0 && (
        <section
          data-testid="feedback-submissions-history"
          className="mt-8 p-5 sm:p-6 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-[var(--text)]">
              {tr(
                lang,
                `Your Recently Sent Messages (${submissions.length})`,
                `आपके द्वारा भेजे गए संदेश (${submissions.length})`
              )}
            </h2>
          </div>

          <div className="space-y-3">
            {submissions.slice(0, 5).map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-[var(--text)] text-[var(--bg)]">
                      {tr(lang, 'SENT ✓', 'भेज दिया गया ✓')}
                    </span>
                    <span className="font-mono font-bold text-xs text-[var(--text)] break-words">
                      {sub.payload.category}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text3)]">
                      {new Date(sub.createdAtIso).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text2)] whitespace-pre-line break-words">
                    {sub.payload.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

/**
 * TRUST ELEMENT 1: About Page (Rishabh Singh, Age 15 — Solo Student Builder, Father/Guardian: Gaurav Singh)
 * Written in a warm, witty, genuinely human 15-year-old student voice.
 */
export const AboutPage: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div
      data-testid="about-page"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 text-sm leading-relaxed text-[var(--text)]"
    >
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs font-mono font-semibold mb-6"
      >
        ← {tr(lang, 'Back to Home', 'होम पर वापस जाएं')}
      </a>

      <div className="p-6 sm:p-8 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold uppercase">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="break-words">
            {tr(
              lang,
              'BUILT BY ONE 15-YEAR-OLD · ZERO COACHING CALL CENTERS · ZERO SHARMAJI PRESSURE',
              '15-वर्षीय छात्र का स्वतंत्र प्रोजेक्ट · कोई कोचिंग कॉल सेंटर नहीं · कोई विज्ञापन नहीं'
            )}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight break-words">
          {tr(
            lang,
            "Hi, I'm Rishabh Singh (Age 15). No, There Is No 'Corporate Team' Here — It's Literally Just Me.",
            'नमस्ते, मैं ऋषभ सिंह (Rishabh Singh, उम्र 15) हूँ — यहाँ कोई बड़ी कंपनी या टीम नहीं, बस मैं अकेला हूँ!',
            undefined,
            {
              ta: 'வணக்கம், நான் ரிஷப் சிங் (Rishabh Singh, வயது 15) — இது எந்த கார்ப்பரேட் குழுவும் அல்ல, நான் மட்டுமே உருவாக்கியது!',
              te: 'హాయ్, నేను రిషబ్ సింగ్ (Rishabh Singh, వయస్సు 15) — ఇక్కడ ఏ కార్పొரேట్ టీమ్ లేదు, నేనొక్కడినే నిర్మించాను!',
              bn: 'হাই, আমি ঋষভ সিং (Rishabh Singh, বয়স ১৫) — এখানে কোনো কর্পোরেট টিম নেই, শুধু আমি একাই!',
              mr: 'हाय, मी ऋषभ सिंग (Rishabh Singh, वय १५) — इथे कोणतीही कॉर्पोरेट टीम नाही, हे मी एकट्यानेच बनवले आहे!',
              gu: 'હાય, હું ઋષભ સિંહ (Rishabh Singh, ઉંમર ૧૫) છું — અહીં કોઈ કોર્પોરેટ ટીम નથી, बस હું একलो જ છું!',
            }
          )}
        </h1>

        <p className="text-[var(--text2)] text-base leading-relaxed break-words">
          {tr(
            lang,
            'I’m Rishabh Singh, a 15-year-old student in India, and my father’s name is Gaurav Singh. I’m at that magical age where every family wedding turns into a rapid-fire interview about "12th ke baad kya karoge?" — while every website on the internet demands your phone number just to show you a syllabus PDF. There is no venture capital, no sales floor, and no coaching sponsorship behind CareerPathO. It’s just me, a laptop, way too many government PDFs, and 395+ verified career pathways so students and parents can get the actual truth in peace.',
            'मेरा नाम ऋषभ सिंह (Rishabh Singh) है, मेरी उम्र 15 साल है, और मेरे पिता का नाम गौरव सिंह (Gaurav Singh) है। मैं उस उम्र में हूँ जहाँ हर पारिवारिक समारोह में मिठाई मिलने से पहले यह सवाल मिलता है— "बेटा, आगे क्या सोचा है?" और इंटरनेट पर किसी भी करियर वेबसाइट पर क्लिक करो, तो वो सिलेबस दिखाने से पहले फोन नंबर मांग लेते हैं। इसलिए मैंने अकेले यह वेबसाइट बनाई है—बिना किसी कोचिंग स्पॉन्सर या कॉल सेंटर के—ताकि छात्र और माता-पिता 395+ सत्यापित करियर का असली सच शांति से देख सकें।',
            undefined,
            {
              ta: 'வணக்கம், என் பெயர் ரிஷப் சிங் (Rishabh Singh, வயது 15). என் தந்தையின் பெயர் கௌரவ் சிங் (Gaurav Singh). இது எந்த பயிற்சி நிறுவனமும் அல்ல — 14-18 வயது மாணவர்களுக்காக 395+ சரிபார்க்கப்பட்ட தொழில் வழிகளுடன் நான் தனியாக உருவாக்கிய இலவச வழிகாட்டி.',
              te: 'నమస్కారం, నా పేరు రిషబ్ సింగ్ (Rishabh Singh, వయస్సు 15). నా తండ్రి పేరు గౌరవ్ సింగ్ (Gaurav Singh). ఇది ఏ కోచింగ్ కంపెనీ కాదు — 395+ ధృవీకరించబడిన కెరీర్ మార్గాలతో విద్యార్థుల కోసం నేను ఒంటరిగా రూపొందించిన ఉచిత వేదిక.',
              bn: 'নমস্কার, আমার নাম ঋষভ সিং (Rishabh Singh, বয়স ১৫) এবং আমার বাবার নাম গৌরব সিং (Gaurav Singh)। এর পেছনে কোনো কোচিং কোম্পানি বা কল সেন্টার নেই—৩৭৩+ যাচাইকৃত ক্যারিয়ার পথসহ ছাত্রছাত্রীদের জন্য এটি আমার একার তৈরি একটি উন্মুক্ত প্ল্যাটফর্ম।',
              mr: 'नमस्कार, माझे नाव ऋषभ सिंग (Rishabh Singh, वय १५) आहे आणि माझ्या वडिलांचे नाव गौरव सिंग (Gaurav Singh) आहे. यामागे कोणतीही कोचिंग कंपनी किंवा कॉल सेंटर नाही — ३७३+ सत्यापित करिअर पर्यायांसह विद्यार्थी आणि पालकांसाठी मी एकट्याने हे मोफत पोर्टल तयार केले आहे.',
              gu: 'નમસ્તે, મારું નામ ઋષભ સિંહ (Rishabh Singh, ઉંમર ૧૫) છે અને મારા પિતાનું નામ ગૌરવ સિંહ (Gaurav Singh) છે. આની પાછળ કોઈ કોચિંગ કંપની કે કોલ સેન્ટર નથી — ૩૭૩+ ચકાસાયેલ કારકિર્દી વિકલ્પો સાથે વિદ્યાર્થીઓ માટે મેં એકલાએ આ મફત પ્લેટફોર્મ બનાવ્યું છે.',
            }
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
            <h2 className="font-extrabold text-base mb-1.5">
              {tr(
                lang,
                'Why I Built This (Spoiler: Coaching Calls Scared Me)',
                'मैंने यह क्यों बनाया? (क्योंकि सेल्स कॉल्स से मैं भी परेशान था!)'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
              {tr(
                lang,
                'Have you ever typed your phone number on an education website to check "B.Tech average salary"? Within 14 seconds, seven different telecallers ring your phone during dinner promising a "guaranteed ₹50 LPA package" if you buy their crash course. Even worse, they quote the top 0.01% IIT international package as if every college graduate gets it on Day 1. On CareerPathO, we show the real MoSPI PLFS national median (₹3.0 LPA) right alongside top-college NIRF medians — with zero login walls and zero spam calls.',
                'क्या आपने कभी किसी एजुकेशन वेबसाइट पर अपना फोन नंबर डाला है? 14 सेकंड के अंदर डिनर के बीच में 7 अलग-अलग कोचिंग के फोन आ जाते हैं जो "50 लाख का पक्का पैकेज" दिलाने का वादा करते हैं! और सबसे बड़ी गड़बड़ी यह कि वे किसी एक टॉप IIT के पैकेज को पूरे देश का "औसत वेतन" बता देते हैं। CareerPathO पर हम सरकार के असली आंकड़े (PLFS राष्ट्रीय औसत ₹3.0 LPA बनाम टॉप कॉलेज NIRF डेटा) बिना किसी लॉगिन या स्पैम कॉल के दिखाते हैं।'
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)]">
            <h2 className="font-extrabold text-base mb-1.5">
              {tr(
                lang,
                'Why My Dad (Gaurav Singh) Is on the Legal Paperwork',
                'कानूनी कागज़ात पर मेरे पापा (गौरव सिंह) का नाम क्यों है?'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
              {tr(
                lang,
                'Turns out the Indian Contract Act, 1872 says a 15-year-old can write TypeScript and read 42 government reports, but cannot legally sign a domain or hosting contract! So the domain and servers are legally registered and operated under my father and legal guardian’s name, Gaurav Singh (who also serves as Chief Chai Sponsor & Strictest Beta Tester). We take zero college commissions, run zero ads, and collect zero personal data.',
                'भारतीय अनुबंध अधिनियम (Indian Contract Act, 1872) के अनुसार 15 साल का छात्र कोडिंग तो कर सकता है और 42 सरकारी रिपोर्ट भी पढ़ सकता है, लेकिन डोमेन और सर्वर का कानूनी अनुबंध साइन नहीं कर सकता! इसलिए यह वेबसाइट मेरे पिता और कानूनी अभिभावक श्री गौरव सिंह (Gaurav Singh) के नाम पर पंजीकृत और संचालित है। हम किसी कॉलेज से कोई कमीशन नहीं लेते, कोई विज्ञापन नहीं चलाते और कोई डेटा इकट्ठा नहीं करते।'
              )}
            </p>
          </div>
        </div>

        {/* Mandatory Anti-Hallucination & Legal Protection Notice on About Page */}
        <div
          data-testid="about-legal-protection-box"
          className="p-4 sm:p-5 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] space-y-2 text-xs sm:text-sm"
        >
          <div className="font-mono font-extrabold uppercase tracking-wider text-[var(--text)]">
            {tr(
              lang,
              '⚠️ IMPORTANT REALITY CHECK FOR PARENTS & STUDENTS (ZERO SALARY OR JOB GUARANTEE)',
              '⚠️ माता-पिता और छात्रों के लिए महत्वपूर्ण कानूनी सूचना (वेतन या नौकरी की कोई गारंटी नहीं)'
            )}
          </div>
          <p className="text-[var(--text2)] leading-relaxed break-words">
            {tr(
              lang,
              'Please read this carefully before making any academic or financial decision: CareerPathO is a 100% free, non-commercial informational project built by a 15-year-old student. Neither Rishabh Singh nor his father/legal guardian Gaurav Singh is a licensed financial advisor, certified career counselor, legal practitioner, or government admission authority. NO salary figure, in-hand calculation, ROI estimate, exam cutoff, or career roadmap on this website is guaranteed. Completing a degree (even from an IIT, NIT, AIIMS, IIM, or NLU) does NOT guarantee a job or a specific salary package. Many graduates earn significantly less or remain unplaced depending on skill, effort, college tier, and macroeconomic conditions. Never take an education loan or pay private college fees assuming any salary shown on this website is promised or guaranteed.',
              'कृपया कोई भी शैक्षणिक या वित्तीय निर्णय लेने से पहले इसे ध्यान से पढ़ें: CareerPathO एक 15-वर्षीय छात्र द्वारा बनाया गया 100% निःशुल्क, गैर-व्यावसायिक सूचनात्मक प्रोजेक्ट है। न तो ऋषभ सिंह और न ही उनके पिता/कानूनी अभिभावक श्री गौरव सिंह कोई लाइसेंस प्राप्त वित्तीय सलाहकार, प्रमाणित करियर काउंसलर या सरकारी प्रवेश अधिकारी हैं। इस वेबसाइट पर दिखाया गया कोई भी वेतन (Salary), इन-हैंड गणना, ROI अनुमान या कटऑफ "पक्का" या "गारंटीकृत" नहीं है। किसी भी सैलरी को गारंटी मानकर कभी भी एजुकेशन लोन या महंगी प्राइवेट कॉलेज फीस का निर्णय न लें।'
            )}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs font-mono space-y-1.5 break-words">
          <div>
            <strong>{tr(lang, 'Builder / Student Founder:', 'निर्माता / छात्र संस्थापक:')}</strong>{' '}
            Rishabh Singh (Age 15, student in India — solo builder, not a team)
          </div>
          <div>
            <strong>
              {tr(
                lang,
                'Father / Legal Guardian (Domain & Hosting Registrant):',
                'पिता / कानूनी अभिभावक (डोमेन एवं होस्टिंग पंजीकरण):'
              )}
            </strong>{' '}
            Gaurav Singh
          </div>
          <div>
            <strong>
              {tr(lang, 'Contact Email (For Data Corrections Only):', 'संपर्क ईमेल (केवल डेटा सुधार हेतु):')}
            </strong>{' '}
            <a href={`mailto:${BUILDER_DIRECT_EMAIL}`} className="underline font-bold break-all">
              {BUILDER_DIRECT_EMAIL}
            </a>{' '}
            ·{' '}
            <a href={`mailto:${GUARDIAN_LEGAL_EMAIL}`} className="underline font-bold break-all">
              {GUARDIAN_LEGAL_EMAIL}
            </a>{' '}
            ·{' '}
            <a href="#/feedback" className="underline font-extrabold">
              {tr(lang, 'Submit Data Correction or Feedback →', 'डेटा सुधार या फीडबैक भेजें →')}
            </a>
          </div>
          <div>
            <strong>{tr(lang, 'Official Data Citations:', 'आधिकारिक सरकारी स्रोत:')}</strong> 42
            Statutory Authorities (NIRF, PLFS MoSPI, AICTE, UGC, NTA, ICAI, NMC, INC, PCI, CoA,
            ICAR, DGT, SAI, etc. — Cited for informational reference only; non-affiliated)
          </div>
          <div>
            <strong>{tr(lang, 'Last Audited & Updated:', 'अंतिम सत्यापन एवं अपडेट:')}</strong> 3
            November 2026 (Nov 2026)
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * TRUST ELEMENT 2: Official Sources Page (#/sources) — Substantially Expanded 42-Source Register
 */
export const SourcesPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  const domainCategories = useMemo(() => {
    const set = new Set<string>();
    OFFICIAL_SOURCE_REGISTER.forEach((s) => set.add(s.domainCategory));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredSources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return OFFICIAL_SOURCE_REGISTER.filter((s) => {
      if (selectedDomain !== 'All' && s.domainCategory !== selectedDomain) return false;
      if (!q) return true;
      return (
        s.organization.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.domainCategory.toLowerCase().includes(q) ||
        s.supportedClaims.some((c) => c.toLowerCase().includes(q)) ||
        s.supportedQuizQuestions.some((qq) => `q${qq}`.includes(q) || String(qq).includes(q))
      );
    });
  }, [searchTerm, selectedDomain]);

  return (
    <div
      data-testid="sources-page"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 text-sm leading-relaxed text-[var(--text)] overflow-x-hidden"
    >
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs font-mono font-semibold mb-6"
      >
        ← {tr(lang, 'Back to Home', 'होम पर वापस जाएं')}
      </a>

      <header className="mb-6 p-5 sm:p-8 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-3">
        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold uppercase">
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="break-words">
            {tr(
              lang,
              `${OFFICIAL_SOURCE_REGISTER.length} OFFICIAL GOVERNMENT & STATUTORY SOURCES · LAST VERIFIED: 3 NOV 2026`,
              `42 आधिकारिक सरकारी एवं वैधानिक स्रोत · अंतिम सत्यापन: नवंबर 2026`
            )}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight break-words">
          {tr(
            lang,
            'Official Data Sources & Statutory Verification Register (42 Authoritative Portals)',
            'आधिकारिक डेटा स्रोत रजिस्टर (NIRF, PLFS, NTA, AICTE, NMC, ICAR, DGT एवं 42 वैधानिक निकाय)'
          )}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text2)] max-w-3xl break-words">
          {tr(
            lang,
            'We do not rely on private coaching blogs or unverified media claims. Every verified salary median, fee band, exam rule, and 25-question calculator weight across all 395+ careers traces directly to the 42 official statutory authorities documented below.',
            'हम किसी भी प्राइवेट ब्लॉग या कोचिंग के दावों को प्रमाण के रूप में उपयोग नहीं करते हैं। हमारे 395+ करियर और 25-प्रश्नों के कैलकुलेटर का हर आंकड़ा नीचे दिए गए 42 आधिकारिक सरकारी पोर्टल, प्रकाशन तिथि और समर्थित दावों से जुड़ा है।'
          )}
        </p>

        {/* Search & Domain Filter Bar */}
        <div className="pt-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={tr(
                lang,
                'Filter 42 official sources by body, exam, or claim (e.g., NIRF, PLFS, NMC, ICAR)...',
                'स्रोत खोजें (जैसे NIRF, PLFS, NMC, ICAR, DRDO)...'
              )}
              className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs sm:text-sm text-[var(--text)] outline-none"
            />
          </div>
          <select
            aria-label="Filter sources by domain category"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="min-h-[42px] px-3 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-bold text-[var(--text)]"
          >
            {domainCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All'
                  ? tr(lang, `All Domains (${OFFICIAL_SOURCE_REGISTER.length})`, 'सभी श्रेणियां (42)')
                  : cat}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="space-y-3" data-testid="official-sources-list">
        {filteredSources.map((src, idx) => (
          <div
            key={src.id}
            data-testid={`source-card-${src.id}`}
            className="p-4 sm:p-5 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] flex flex-col lg:flex-row lg:items-start justify-between gap-4 min-w-0"
          >
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold">
                  #{idx + 1} · {src.id.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-[var(--border2)] bg-[var(--bg)] text-[11px] font-bold text-[var(--text2)]">
                  {src.domainCategory}
                </span>
                <span className="text-[11px] font-mono text-[var(--text3)]">
                  Published: {src.publicationDate} · Accessed: {src.accessDate}
                </span>
              </div>

              <div className="font-extrabold text-base text-[var(--text)] break-words">
                {tr(lang, src.organization, src.organizationHi)}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[var(--text2)] break-words">
                {tr(lang, src.title, src.titleHi)}
              </div>

              <ul className="list-disc pl-5 text-xs text-[var(--text2)] space-y-1 break-words">
                {src.supportedClaims.map((claim, cIdx) => (
                  <li key={cIdx}>{claim}</li>
                ))}
              </ul>

              {src.supportedQuizQuestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--text3)]">
                    {tr(lang, 'Supports Assessment / Quiz Rules:', 'समर्थित कैलकुलेटर/क्विज़ नियम:')}
                  </span>
                  {src.supportedQuizQuestions.map((qLabel, qIdx) => (
                    <span
                      key={qIdx}
                      className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] font-mono text-[var(--text2)] break-words"
                    >
                      Q{qLabel}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[11px] font-mono text-[var(--text3)] break-all">
                Source: {src.organization.split('(')[0].trim()}, {src.publicationDate}, {src.url} ·
                Last verified: Nov 2026 (11 Nov 2026)
              </div>
            </div>

            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold inline-flex items-center gap-1.5 shrink-0 self-start"
            >
              <span>{tr(lang, 'Visit Official Site', 'आधिकारिक पोर्टल खोलें')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * TRUST ELEMENT 3: How We Calculate This Page (#/how-we-calculate)
 */
export const HowWeCalculatePage: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div
      data-testid="how-we-calculate-page"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 text-sm leading-relaxed text-[var(--text)] overflow-x-hidden"
    >
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs font-mono font-semibold mb-6"
      >
        ← {tr(lang, 'Back to Home', 'होम पर वापस जाएं')}
      </a>

      <div className="p-5 sm:p-8 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-6">
        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold uppercase">
          <Calculator className="w-4 h-4 shrink-0" />
          <span>
            {tr(
              lang,
              'METHODOLOGY, 25-QUESTION CALCULATOR RUBRIC & 373-CAREER AUDIT · LAST VERIFIED: 3 NOV 2026',
              'कार्यप्रणाली, 25-प्रश्न कैलकुलेटर रुब्रिक और 373 करियर वितरण · नवंबर 2026'
            )}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight break-words">
          {tr(
            lang,
            'How We Calculate Salaries, In-Hand Pay & 25-Question Career Alignment Bands',
            'हम वेतन, फीस, इन-हैंड सैलरी और 25-प्रश्न करियर अनुकूलता की गणना कैसे करते हैं?'
          )}
        </h1>

        <section className="p-4 sm:p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] space-y-2">
          <h2 className="text-lg font-extrabold break-words">
            {tr(
              lang,
              '1. Why We Separate National Median (PLFS) vs. Top-Institution Median (NIRF)',
              '1. राष्ट्रीय औसत (PLFS) बनाम शीर्ष-संस्थान औसत (NIRF) को अलग क्यों रखा गया है?'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
            {tr(
              lang,
              'Most websites quote top IIT or top NLU packages (₹15–25 LPA) as if every student with that degree earns it. That misleads families into taking large education loans. On CareerPathO, we separate two distinct numbers:',
              'अधिकांश वेबसाइटें शीर्ष IIT या शीर्ष NLU के पैकेज (₹15–25 LPA) को इस तरह दिखाती हैं मानो उस डिग्री के हर छात्र को वही वेतन मिलता हो। इससे परिवार भारी शिक्षा ऋण के जाल में फंस जाते हैं। CareerPathO पर हम दोनों आंकड़ों को स्पष्ट रूप से अलग रखते हैं:'
            )}
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-[var(--text2)] space-y-1 break-words">
            <li>
              {tr(
                lang,
                'National Graduate Baseline (PLFS, MoSPI — https://mospi.gov.in): For general B.Tech, BBA, and B.Com graduates across India, the median starting salary is ₹25,000/month (₹3.0 LPA).',
                'राष्ट्रीय स्नातक आधार रेखा (PLFS, MoSPI — https://mospi.gov.in): सामान्य B.Tech, BBA और B.Com स्नातकों का राष्ट्रीय शुरुआती मीडियन वेतन ₹25,000/माह (₹3.0 LPA) है।'
              )}
            </li>
            <li>
              {tr(
                lang,
                'Top-Institution Median (NIRF — https://www.nirfindia.org): Reported only by top-ranked institutions in their mandatory NIRF filings (e.g., ₹13–23 LPA for top IITs/NITs in B.Tech; ₹16–20 LPA for top NLUs in BA LL.B vs ₹3–6 LPA at other law colleges).',
                'शीर्ष संस्थान मीडियन (NIRF — https://www.nirfindia.org): केवल शीर्ष रैंक वाले संस्थानों की आधिकारिक NIRF रिपोर्ट में दर्ज वेतन (जैसे शीर्ष IIT/NIT में ₹13–23 LPA; शीर्ष NLU में ₹16–20 LPA बनाम सामान्य कॉलेजों में ₹3–6 LPA)।'
              )}
            </li>
            <li>
              {tr(
                lang,
                'Government vs. Private Splits: For Healthcare (MBBS, B.Sc Nursing), we explicitly split 7th CPC Government pay (e.g., Govt Medical Officer ₹80k–1.1L/mo; Govt Nursing Officer ₹60k–70k/mo) from private hospital fresher pay (MBBS ₹40k–75k/mo; Nursing ₹25k–45k/mo).',
                'सरकारी बनाम प्राइवेट अंतर: स्वास्थ्य सेवा (MBBS, नर्सिंग) में हम 7th CPC सरकारी वेतन (सरकारी मेडिकल ऑफिसर ₹80k–1.1L/माह; नर्सिंग ऑफिसर ₹60k–70k/माह) और प्राइवेट अस्पताल फ्रेशर वेतन को अलग-अलग दिखाते हैं।'
              )}
            </li>
          </ul>
        </section>

        {/* Section 2: 25-Question Multi-Modal Calculator Rubric */}
        <section
          data-testid="calculator-rubric-documentation"
          className="p-4 sm:p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] space-y-3"
        >
          <h2 className="text-lg font-extrabold flex items-center gap-2 break-words">
            <Layers className="w-5 h-5 shrink-0" />
            <span>
              {tr(
                lang,
                '2. 25-Question Multi-Modal Career Assessment Calculator Rubric',
                '2. 25-प्रश्न बहु-आयामी करियर कैलकुलेटर रुब्रिक (5 उत्तर प्रारूप और विरोधाभास नियम)'
              )}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
            {tr(
              lang,
              'Our 25-question calculator evaluates 5 distinct mobile-friendly answer formats (8 Single-Choice, 6 Sliders, 5 Likert Scales, 3 Multi-Select, and 3 Tradeoff Continuum items) and reports Alignment Score Bands rather than false single-point precision:',
              'हमारा 25-प्रश्नों का कैलकुलेटर 5 उत्तर प्रारूपों (8 एकल-विकल्प, 6 स्लाइडर, 5 लिकर्ट पैमाने, 3 बहु-चयन, और 3 ट्रेड-ऑफ) का उपयोग करता है और परिणाम को एकल संख्या के बजाय अनुकूलता रेंज (Alignment Band) के रूप में प्रस्तुत करता है:'
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ASSESSMENT_METHODOLOGY_RUBRIC.map((sec) => (
              <div
                key={sec.id}
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg2)] space-y-1.5 min-w-0"
              >
                <div className="font-bold text-xs sm:text-sm text-[var(--text)] break-words">
                  {tr(lang, sec.titleEn, sec.titleHi)}
                </div>
                <code className="block text-[11px] font-mono p-2 rounded bg-[var(--bg)] border border-[var(--border)] break-all">
                  {sec.formulaEn}
                </code>
                <p className="text-xs text-[var(--text2)] leading-relaxed break-words">
                  {tr(lang, sec.descriptionEn, sec.descriptionHi)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: 373-Career Category Distribution Table (250 + 123 = 373) */}
        <section
          data-testid="category-distribution-373-section"
          className="p-4 sm:p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] space-y-3"
        >
          <h2 className="text-lg font-extrabold break-words">
            {tr(
              lang,
              '3. 373-Career Directory Category Distribution (250 Baseline + 123 New Entries = 373 Total)',
              '3. 373 करियर डायरेक्टरी श्रेणी वितरण (250 पूर्व करियर + 123 नए सत्यापित करियर = 373 कुल)'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
            {tr(
              lang,
              'To balance previously underrepresented vocational, sports science, environmental, allied health, and media pathways, we added exactly 123 substantive career entries to bring the directory from 250 to 373 careers:',
              'कम प्रतिनिधित्व वाली श्रेणियों (व्यावसायिक ट्रेड, खेल विज्ञान, कृषि व पर्यावरण, एलाइड हेल्थ, मीडिया और डिज़ाइन) को संतुलित करने के लिए हमने ठीक 123 नए पूर्ण-विस्तृत करियर जोड़े हैं:'
            )}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border2)] font-mono uppercase text-[11px] text-[var(--text3)]">
                  <th className="py-2 pr-3">{tr(lang, 'Directory Category', 'श्रेणी (Category)')}</th>
                  <th className="py-2 px-2">{tr(lang, 'Previous (250)', 'पूर्व (250)')}</th>
                  <th className="py-2 px-2">{tr(lang, 'Added (+123)', 'नए जोड़े (+123)')}</th>
                  <th className="py-2 px-2">{tr(lang, 'New Total (373)', 'कुल (373)')}</th>
                  <th className="py-2 pl-3">{tr(lang, 'Balancing Rationale', 'संतुलन का कारण')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {CATEGORY_DISTRIBUTION_373_REPORT.map((row) => (
                  <tr key={row.category}>
                    <td className="py-2.5 pr-3 font-bold text-[var(--text)]">{row.category}</td>
                    <td className="py-2.5 px-2 font-mono">{row.previousCount250}</td>
                    <td className="py-2.5 px-2 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      +{row.addedCount123}
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold">
                      {row.newTotal373} ({row.sharePercent}%)
                    </td>
                    <td className="py-2.5 pl-3 text-[var(--text2)]">
                      {row.representativeNewCareers.slice(0, 3).join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="p-4 sm:p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] space-y-2">
          <h2 className="text-lg font-extrabold break-words">
            {tr(
              lang,
              '4. How the "CTC vs. Actual Monthly In-Hand" Reality Card Works',
              '4. "CTC बनाम वास्तविक मासिक इन-हैंड वेतन" की गणना कैसे होती है?'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed break-words">
            {tr(
              lang,
              'Headline "Cost to Company" (CTC) often includes 4-year stock grants (ESOPs), one-time joining bonuses, performance variables, and employer EPF contributions. Our estimator calculates realistic monthly take-home pay by deducting Employer & Employee EPF (~12% of basic), New Regime Income Tax + Professional Tax (₹200/mo), and deferred variable/ESOP components so parents can plan household budgets accurately.',
              'कंपनियों के कुल पैकेज (CTC) में अक्सर 4-वर्षीय स्टॉक ग्रांट (ESOP), वन-टाइम जॉइनिंग बोनस और नियोक्ता EPF शामिल होता है। हमारा कैलकुलेटर बेसिक वेतन से नियोक्ता और कर्मचारी EPF (~12%), न्यू रिजीम आयकर + प्रोफेशनल टैक्स (₹200/माह) और वेरिएबल हिस्से को घटाकर वास्तविक मासिक इन-हैंड सैलरी दिखाता है।'
            )}
          </p>
        </section>

        {/* Section 5: Phase 2 Completed Localization & QA Audit Log */}
        <section
          data-testid="phase-2-backlog-section"
          className="p-4 sm:p-5 rounded-xl border border-[var(--border2)] bg-[var(--bg)] space-y-2"
        >
          <h2 className="text-lg font-extrabold break-words">
            {tr(
              lang,
              '5. Phase 2 Regional Localization & Site-Wide QA Resolution Log',
              '5. चरण 2 (Phase 2) क्षेत्रीय अनुवाद और साइट-व्यापी QA समाधान लॉग'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text2)] break-words">
            {tr(
              lang,
              'All Phase 2 regional localization and heading/body alignment items across Tamil, Telugu, Bengali, Marathi, Gujarati, Hindi, and English have been verified and resolved:',
              'तमिल, तेलुगु, बंगाली, मराठी, गुजराती, हिंदी और अंग्रेजी में सभी Phase 2 क्षेत्रीय अनुवाद और शीर्षक/बॉडी सामंजस्य आइटम पूरे और सत्यापित किए जा चुके हैं:'
            )}
          </p>
          <div className="space-y-2 pt-1">
            {PHASE_2_DEFERRED_BACKLOG.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)] text-xs space-y-1 break-words"
              >
                <div className="font-mono font-bold text-[var(--text)]">
                  [{item.id}] {item.type.toUpperCase()} ({item.severity}) — {item.location}
                </div>
                <div className="text-[var(--text2)]">{item.description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/**
 * TRUST ELEMENT 4: Privacy Policy Page (#/privacy) — DPDP Act 2023 Compliant
 */
export const PrivacyPage: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div
      data-testid="privacy-page"
      className="w-full max-w-3xl mx-auto px-4 py-8 text-sm leading-relaxed text-[var(--text)]"
    >
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs font-mono font-semibold mb-6"
      >
        ← {tr(lang, 'Back to Home', 'होम पर वापस जाएं')}
      </a>

      <div className="p-6 sm:p-8 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold break-words">
          {tr(
            lang,
            'Privacy Policy (DPDP Act 2023 & IT Rules 2021)',
            'गोपनीयता नीति (Privacy Policy — DPDP Act 2023)',
            undefined,
            {
              ta: 'தனியுரிமைக் கொள்கை (Privacy Policy — DPDP Act 2023)',
              te: 'గోప్యతా విధానం (Privacy Policy — DPDP Act 2023)',
              bn: 'গোপনীয়তা নীতি (Privacy Policy — DPDP Act 2023)',
              mr: 'गोपनीयता धोरण (Privacy Policy — DPDP Act 2023)',
              gu: 'ગોપનીયતા નીતિ (Privacy Policy — DPDP Act 2023)',
            }
          )}
        </h1>

        <div
          data-testid="privacy-no-data-statement"
          className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] font-mono font-bold text-xs sm:text-sm break-words"
        >
          We collect no data. Vercel logs IPs for security only. No cookies. No analytics.
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-[var(--text2)] break-words">
          <p>
            <strong>
              {tr(
                lang,
                '1. Zero Google Analytics & Zero Tracking of Minors (DPDP Act 2023 Section 9(3)):',
                '1. शून्य गूगल एनालिटिक्स और नाबालिगों की शून्य ट्रैकिंग (DPDP अधिनियम 2023 धारा 9(3)):'
              )}
            </strong>{' '}
            {tr(
              lang,
              'Because our primary users are Indian students aged 14–18, CareerPathO runs zero Google Analytics scripts, zero behavioral trackers, zero advertising pixels, and zero cookies.',
              'चूंकि हमारे मुख्य उपयोगकर्ता 14–18 वर्ष के भारतीय छात्र हैं, इसलिए CareerPathO पर कोई Google Analytics, कोई व्यवहार ट्रैकिंग, कोई विज्ञापन पिक्सेल या कोई कुकी नहीं चलती है।'
            )}
          </p>
          <p>
            <strong>
              {tr(
                lang,
                '2. Client-Side Search Only (No Search Queries in URLs):',
                '2. केवल क्लाइंट-साइड सर्च (URL में कोई सर्च क्वेरी नहीं):'
              )}
            </strong>{' '}
            {tr(
              lang,
              'All career search filtering across 395+ careers runs 100% locally in your browser memory via JavaScript. Search queries are never placed into URL query parameters, ensuring server logs never capture what a student searches for.',
              'सभी 395+ करियर की खोज आपके ब्राउज़र मेमोरी में स्थानीय रूप से चलती है। सर्च शब्द कभी भी URL में नहीं भेजे जाते।'
            )}
          </p>
          <p>
            <strong>
              {tr(
                lang,
                '3. No Accounts, No Phone Numbers, No WhatsApp:',
                '3. कोई अकाउंट नहीं, कोई फोन नंबर नहीं, कोई व्हाट्सएप नहीं:'
              )}
            </strong>{' '}
            {tr(
              lang,
              'We never ask for your phone number, WhatsApp number, login credentials, or payment information. Saved bookmarks and theme preferences stay strictly inside your device’s local browser storage (localStorage).',
              'हम कभी भी आपका फोन नंबर, व्हाट्सएप नंबर या लॉगिन नहीं मांगते हैं। सेव किए गए करियर और प्रेफरेंस केवल आपके डिवाइस के localStorage में रहते हैं।'
            )}
          </p>
          <p>
            <strong>
              {tr(lang, '4. Parent/Guardian Legal Governance:', '4. पिता/अभिभावक कानूनी पंजीकरण:')}
            </strong>{' '}
            {tr(
              lang,
              'Built by Rishabh Singh (age 15) and legally operated under parent/guardian registration by his father, Gaurav Singh (gauravsinghrenu@gmail.com). Our static hosting provider (Vercel) processes transient IP requests strictly for DDoS and network security protection.',
              'ऋषभ सिंह (उम्र 15) द्वारा निर्मित और उनके पिता श्री गौरव सिंह (gauravsinghrenu@gmail.com) के अभिभावक पंजीकरण के तहत संचालित।'
            )}
          </p>
          <p>
            <strong>
              {tr(
                lang,
                '5. Voluntary Feedback & Data Correction Submissions:',
                '5. स्वैच्छिक फीडबैक और डेटा सुधार सबमिशन:'
              )}
            </strong>{' '}
            {tr(
              lang,
              'If you voluntarily submit a data correction or bug report on the #/feedback page, only the text fields you explicitly submit (plus basic browser viewport/URL context for debugging) are sent to our review sheet. Submitting name or email is 100% optional, and we never request phone numbers.',
              'यदि आप #/feedback पेज पर स्वेच्छा से कोई डेटा सुधार या सुझाव भेजते हैं, तो केवल आपके द्वारा लिखा गया संदेश समीक्षा शीट में जाता है। नाम या ईमेल देना पूरी तरह वैकल्पिक है, और हम कभी भी फोन नंबर नहीं मांगते।'
            )}
          </p>
          <p>
            <strong>
              {tr(
                lang,
                '6. Legal Safe-Harbor & Grievance Redressal (DPDP Act 2023 & IT Act 2000):',
                '6. कानूनी सुरक्षा और शिकायत निवारण (DPDP अधिनियम 2023 एवं IT अधिनियम 2000):'
              )}
            </strong>{' '}
            {tr(
              lang,
              'Because CareerPathO does not maintain user accounts, commercial databases, or monetized personal data processing, there is no personal profile stored on our servers. For any privacy inquiry or removal of a voluntary feedback note, email virganox3690@gmail.com or gauravsinghrenu@gmail.com.',
              'चूंकि CareerPathO कोई यूजर अकाउंट या व्यक्तिगत डेटाबेस नहीं रखता है, इसलिए हमारे सर्वर पर कोई व्यक्तिगत प्रोफाइल संग्रहीत नहीं होती है। किसी भी गोपनीयता प्रश्न के लिए virganox3690@gmail.com या gauravsinghrenu@gmail.com पर ईमेल करें।'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div
      data-testid="terms-page"
      className="w-full max-w-4xl mx-auto px-4 py-8 text-sm leading-relaxed text-[var(--text)]"
    >
      <a
        href="#/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg2)] text-xs font-mono font-semibold mb-6"
      >
        ← {tr(lang, 'Back to Home', 'होम पर वापस जाएं')}
      </a>
      <div className="p-6 sm:p-8 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold uppercase">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            {tr(
              lang,
              'BINDING LEGAL DISCLAIMER, TERMS OF USE & LIMITATION OF LIABILITY',
              'बाध्यकारी कानूनी अस्वीकरण, उपयोग की शर्तें और दायित्व की सीमा'
            )}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold break-words">
          {tr(
            lang,
            'Terms of Service, Non-Reliance Notice & Complete Limitation of Liability',
            'नियम व शर्तें, गैर-गारंटी सूचना एवं पूर्ण कानूनी अस्वीकरण (Terms of Service)'
          )}
        </h1>

        <div className="p-4 rounded-xl border-2 border-[var(--text)] bg-[var(--bg)] text-xs sm:text-sm font-mono font-bold text-[var(--text)] leading-relaxed break-words">
          {tr(
            lang,
            'CRITICAL NOTICE TO PARENTS, GUARDIANS & STUDENTS: By accessing or using CareerPathO, you expressly acknowledge and agree that this website is a 100% free, non-commercial educational hobby project created by a minor student (Rishabh Singh, age 15) under parent/guardian registration (Gaurav Singh). NO salary figure, placement rate, college fee, cutoff, or quiz result on this platform is guaranteed or contractually binding.',
            'अभिभावकों और छात्रों के लिए महत्वपूर्ण कानूनी सूचना: CareerPathO का उपयोग करके आप स्पष्ट रूप से स्वीकार करते हैं कि यह एक 15-वर्षीय छात्र (ऋषभ सिंह) द्वारा अभिभावक पंजीकरण (श्री गौरव सिंह) के तहत बनाया गया 100% निःशुल्क, गैर-व्यावसायिक शैक्षिक प्रोजेक्ट है। इस प्लेटफॉर्म पर दिखाया गया कोई भी वेतन (Salary), प्लेसमेंट, कॉलेज फीस, कटऑफ या क्विज़ परिणाम गारंटीकृत नहीं है।'
          )}
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-[var(--text2)] break-words">
          <p>
            <strong className="text-[var(--text)]">
              {tr(
                lang,
                '1. Non-Affiliation & Independent Student Project Status:',
                '1. गैर-संबद्धता और स्वतंत्र छात्र प्रोजेक्ट स्थिति:'
              )}
            </strong>{' '}
            {tr(
              lang,
              'CareerPathO is an independent informational directory built by Rishabh Singh (age 15) and legally registered under his father and natural guardian Gaurav Singh. It is NOT affiliated with, endorsed by, or operated by NIRF, MoSPI (PLFS), AICTE, UGC, NTA, UPSC, SSC, ICAI, NMC, INC, PCI, CoA, ICAR, DGT, or any Ministry or Department of the Government of India or any State Government.',
              'CareerPathO ऋषभ सिंह (उम्र 15) द्वारा निर्मित और उनके पिता श्री गौरव सिंह के कानूनी अभिभावक पंजीकरण के तहत संचालित एक स्वतंत्र सूचनात्मक पोर्टल है। यह NIRF, MoSPI, AICTE, UGC, NTA, UPSC, SSC, ICAI, NMC या भारत सरकार के किसी भी मंत्रालय से संबद्ध या मान्यता प्राप्त नहीं है।'
            )}
          </p>

          <p>
            <strong className="text-[var(--text)]">
              {tr(
                lang,
                '2. Zero Salary, Placement, or Admission Guarantee (Anti-Hallucination Clause):',
                '2. वेतन, प्लेसमेंट या प्रवेश की शून्य गारंटी (Anti-Hallucination खंड):'
              )}
            </strong>{' '}
            {tr(
              lang,
              'All salary ranges (including entry, mid-career, senior, top-10%, and monthly in-hand estimates), ROI payback timelines, and job roles displayed on CareerPathO are historical statistical aggregates or unverified market estimates provided strictly for general awareness. Earning a degree, diploma, or certification does NOT guarantee employment or any minimum salary. Actual compensation can be ₹0 (unemployed/unplaced) or substantially lower than historical medians depending on individual skill, academic performance, institution tier, location, and macroeconomic hiring cycles.',
              'CareerPathO पर दिखाए गए सभी वेतन आंकड़े (शुरुआती, मध्य-करियर, सीनियर और मासिक इन-हैंड अनुमान), ROI समय-सीमा और जॉब रोल्स केवल सामान्य जागरूकता के लिए ऐतिहासिक सांख्यिकीय अनुमान हैं। कोई भी डिग्री या कोर्स करने से नौकरी या किसी निश्चित वेतन की गारंटी नहीं मिलती है। वास्तविक आय कौशल, कॉलेज और बाजार की स्थिति के आधार पर बहुत कम या शून्य (बेरोजगार होने पर) भी हो सकती है।'
            )}
          </p>

          <p>
            <strong className="text-[var(--text)]">
              {tr(
                lang,
                '3. Not Professional, Financial, Psychological, Medical, or Legal Advice:',
                '3. कोई पेशेवर, वित्तीय, मनोवैज्ञानिक या कानूनी सलाह नहीं:'
              )}
            </strong>{' '}
            {tr(
              lang,
              'Nothing on CareerPathO — including the 25-question Career Assessment Calculator, the 7-question Individual Career Capability Test, the Hindi Parents Guide PDF, the Education Loan EMI Simulator, or the Drop-Year Cost Calculator — constitutes certified career counseling, psychological/clinical diagnosis, financial/loan advice, or legal advice. Parents and students must not take education loans, drop academic years, or pay college tuition in reliance on any figure or score shown on this website.',
              'CareerPathO पर उपलब्ध कोई भी सामग्री — जिसमें 25-प्रश्नों का करियर कैलकुलेटर, 7-प्रश्नों का क्षमता टेस्ट, माता-पिता गाइड PDF, या एजुकेशन लोन EMI कैलकुलेटर शामिल है — प्रमाणित करियर काउंसलिंग, मनोवैज्ञानिक निदान, वित्तीय सलाह या कानूनी सलाह नहीं है। अभिभावकों और छात्रों को इस वेबसाइट के किसी भी आंकड़े के आधार पर एजुकेशन लोन या कॉलेज फीस का वित्तीय निर्णय नहीं लेना चाहिए।'
            )}
          </p>

          <p>
            <strong className="text-[var(--text)]">
              {tr(
                lang,
                '4. Mandatory Independent Verification on Official Portals:',
                '4. आधिकारिक सरकारी पोर्टल पर स्वतंत्र सत्यापन अनिवार्य:'
              )}
            </strong>{' '}
            {tr(
              lang,
              'While 51 statutory pathways cite official reports (such as NIRF, PLFS MoSPI, or 7th CPC pay matrices) and 322 private/creative/emerging pathways display unverified market estimates, government notifications, exam syllabi, eligibility criteria, reservation rules, and college fee structures change frequently without notice. Users are solely responsible for verifying all rules directly from the official statutory gazette or examination authority website before acting.',
              'सरकारी नियम, परीक्षा सिलेबस, पात्रता मानदंड और कॉलेज की फीस बिना किसी पूर्व सूचना के बदलती रहती हैं। किसी भी फॉर्म को भरने या प्रवेश लेने से पहले संबंधित आधिकारिक सरकारी वेबसाइट या विवरणिका (Brochure) से स्वयं सत्यापन करना उपयोगकर्ता की पूर्ण जिम्मेदारी है।'
            )}
          </p>

          <p>
            <strong className="text-[var(--text)]">
              {tr(
                lang,
                '5. "AS-IS" Provision & Complete Limitation of Liability (Indian Contract Act 1872 & Consumer Protection Act 2019):',
                '5. "जैसा है (AS-IS)" प्रावधान और पूर्ण दायित्व मुक्ति (भारतीय अनुबंध अधिनियम 1872):'
              )}
            </strong>{' '}
            {tr(
              lang,
              'Because CareerPathO is provided 100% free of charge without any monetary consideration, subscription fee, or commercial contract, users are not "consumers" for paid services under the Consumer Protection Act, 2019. The platform is provided strictly on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Under no circumstances shall Rishabh Singh (minor builder), Gaurav Singh (parent/legal guardian), or contributors be liable for any direct, indirect, incidental, consequential, financial, academic, or emotional loss or damages arising from the use of, or reliance upon, any information on this website.',
              'चूंकि CareerPathO बिना किसी शुल्क, सदस्यता फीस या व्यावसायिक अनुबंध के 100% निःशुल्क प्रदान किया जाता है, इसलिए यह वेबसाइट पूरी तरह से "जैसी है (AS IS)" के आधार पर बिना किसी वारंटी के उपलब्ध है। किसी भी परिस्थिति में ऋषभ सिंह (नाबालिग छात्र निर्माता), श्री गौरव सिंह (पिता/कानूनी अभिभावक) या योगदानकर्ता इस वेबसाइट की किसी भी जानकारी के उपयोग से होने वाले किसी भी प्रत्यक्ष, अप्रत्यक्ष, वित्तीय या शैक्षणिक नुकसान के लिए उत्तरदायी नहीं होंगे।'
            )}
          </p>

          <p>
            <strong className="text-[var(--text)]">
              {tr(
                lang,
                '6. Voluntary Donations & Non-Refundable Community Support:',
                '6. स्वैच्छिक सहयोग एवं गैर-वापसी योग्य समर्थन:'
              )}
            </strong>{' '}
            {tr(
              lang,
              'Any voluntary UPI/community support contribution is an optional gift toward server and domain maintenance, does not unlock any paid service or advisory contract, and creates no fiduciary or commercial obligation.',
              'कोई भी स्वैच्छिक सहयोग केवल सर्वर और डोमेन रखरखाव के लिए एक वैकल्पिक उपहार है और इससे कोई व्यावसायिक अनुबंध या कानूनी दायित्व उत्पन्न नहीं होता है।'
            )}
          </p>

          <p>
            <strong className="text-[var(--text)]">
              {tr(
                lang,
                '7. Governing Law, Jurisdiction & Correction Procedure:',
                '7. लागू कानून, न्यायक्षेत्र और सुधार प्रक्रिया:'
              )}
            </strong>{' '}
            {tr(
              lang,
              'These Terms are governed by the laws of India. If you believe any statistic, link, or text on CareerPathO is inaccurate or outdated, your sole and exclusive remedy is to submit a correction notice via #/feedback or email virganox3690@gmail.com / gauravsinghrenu@gmail.com so it can be updated or removed promptly, or to discontinue using the website.',
              'ये शर्तें भारत के कानूनों द्वारा शासित हैं। यदि आपको लगता है कि वेबसाइट पर कोई भी आंकड़ा या जानकारी पुरानी या अशुद्ध है, तो आपका एकमात्र उपाय #/feedback पेज या ईमेल (virganox3690@gmail.com / gauravsinghrenu@gmail.com) के माध्यम से सुधार भेजना है, या वेबसाइट का उपयोग बंद करना है।'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div
      data-testid="career-not-found-404"
      className="w-full max-w-lg mx-auto px-4 py-16 text-center"
    >
      <div className="p-8 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] space-y-4">
        <div className="text-5xl font-black font-mono text-[var(--text)]">404</div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)]">
          Yeh career nahi mila. All careers dekho →
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text2)]">
          {tr(
            lang,
            'The career path you requested could not be found. Browse our complete directory of 395+ careers below.',
            'आपका खोजा गया करियर पथ नहीं मिला। नीचे हमारी 395+ करियर की संपूर्ण डायरेक्टरी देखें।'
          )}
        </p>
        <div className="pt-2">
          <a
            href="#/careers"
            data-testid="not-found-all-careers-link"
            className="min-h-[48px] inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs sm:text-sm font-mono font-extrabold bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            Yeh career nahi mila. All careers dekho →
          </a>
        </div>
      </div>
    </div>
  );
};
