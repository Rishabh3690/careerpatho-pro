import React, { useState, useEffect, useMemo } from 'react';
import { CareerListItem, CareerSortOption, Language } from '../data/types';
import careers250Json from '../data/careers250.json';
import { CareerSvgIcon } from './CareerSvgIcon';
import { navigateToHash } from '../utils/hashRouter';
import { loadPreference, savePreference, sortCareerListItems, tr } from '../utils/careerEngine';
import { translateRegionalText } from '../utils/regionalLocalization';
import {
  Search,
  X,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  RotateCcw,
  ArrowUpDown,
  Bookmark,
  HelpCircle,
  Layers,
  Compass,
} from 'lucide-react';

export const DIRECTORY_CATEGORIES = [
  'Engineering & Tech',
  'Medical & Health',
  'Commerce & Business',
  'Arts & Design',
  'Law & Government',
  'Vocational & Trades',
  'Sports & Fitness',
  'Media & Entertainment',
  'Agriculture & Environment',
] as const;

export const STREAM_FILTERS = ['PCM', 'PCB', 'Commerce', 'Arts', 'Any stream'] as const;

interface ParentSectionGuideItem {
  parentId: string;
  categoryKey: string;
  directoryFilter: string;
  titleEn: string;
  titleHi: string;
  simpleMeaningEn: string;
  simpleMeaningHi: string;
  whoCanJoinEn: string;
  whoCanJoinHi: string;
  countLabel: string;
  isNewSection?: boolean;
}

export const PARENT_SECTION_BEGINNER_GUIDE: ParentSectionGuideItem[] = [
  {
    parentId: 'p-agri-sustainability',
    categoryKey: 'agriculture',
    directoryFilter: 'Agriculture & Environment',
    titleEn: '1. Agriculture, Food Tech, Forestry & Green Energy (NEW Parent Section)',
    titleHi: '1. कृषि, फूड टेक, वानिकी और हरित ऊर्जा (नया मुख्य वर्ग)',
    simpleMeaningEn:
      'ICAR Farming Science, NABARD/IBPS Bank Agriculture Officer, FSSAI Food Safety Officer, Dairy (Amul/NDDB), Fisheries, Forestry & Solar Sustainability.',
    simpleMeaningHi:
      'ICAR कृषि विज्ञान, NABARD/IBPS बैंक कृषि अधिकारी, FSSAI खाद्य सुरक्षा, डेयरी, मत्स्य, वानिकी और सौर ऊर्जा में 22 करियर।',
    whoCanJoinEn: 'Class 12 Biology (PCB), Maths (PCM), Agriculture, or Any Stream for Rural/Drone tracks',
    whoCanJoinHi: '12वीं बायोलॉजी (PCB), गणित (PCM), कृषि या किसी भी स्ट्रीम के छात्र',
    countLabel: '22+ Careers',
    isNewSection: true,
  },
  {
    parentId: 'p-btech',
    categoryKey: 'engineering',
    directoryFilter: 'Engineering & Tech',
    titleEn: '2. Engineering, Computers & Software (B.Tech / BCA / IT)',
    titleHi: '2. इंजीनियरिंग, कंप्यूटर और सॉफ्टवेयर (B.Tech / BCA / IT)',
    simpleMeaningEn:
      'Making software apps, websites, AI tools, electronics chips, civil bridges, mechanical machines, and railway/defense engineering.',
    simpleMeaningHi:
      'सॉफ्टवेयर, वेबसाइट, AI, इलेक्ट्रॉनिक्स चिप्स, सिविल निर्माण और मैकेनिकल मशीनें बनाने का क्षेत्र।',
    whoCanJoinEn: 'Mostly Class 12 Maths + Physics (PCM); BCA is open to Commerce/Arts in many colleges',
    whoCanJoinHi: 'मुख्यतः 12वीं गणित + विज्ञान (PCM); BCA कई कॉलेजों में कॉमर्स/आर्ट्स के लिए भी खुला है',
    countLabel: '75+ Careers',
  },
  {
    parentId: 'p-mbbs',
    categoryKey: 'medical',
    directoryFilter: 'Medical & Health',
    titleEn: '3. Medical, Doctor, Nursing, Pharmacy & Hospital Care',
    titleHi: '3. मेडिकल, डॉक्टर, नर्सिंग, फार्मेसी और अस्पताल सेवा',
    simpleMeaningEn:
      'Becoming a Doctor (MBBS/BDS/AYUSH), Hospital Nurse, Pharmacist (Medicines), Physiotherapist, or Lab/X-Ray Technician.',
    simpleMeaningHi:
      'डॉक्टर (MBBS/BDS/आयुष), नर्सिंग ऑफिसर, फार्मासिस्ट (दवाइयां), फिजियोथेरेपिस्ट और लैब टेक्नीशियन।',
    whoCanJoinEn: 'Class 12 Biology + Physics + Chemistry (PCB)',
    whoCanJoinHi: '12वीं जीव विज्ञान (Biology - PCB) के छात्र',
    countLabel: '55+ Careers',
  },
  {
    parentId: 'p-bcom',
    categoryKey: 'commerce',
    directoryFilter: 'Commerce & Business',
    titleEn: '4. Commerce, Banking, CA, Accounting & Business (MBA/BBA)',
    titleHi: '4. कॉमर्स, बैंकिंग, CA, अकाउंटिंग और बिज़नेस (MBA/BBA)',
    simpleMeaningEn:
      'Managing company money, taxes, audit (CA/CS/CMA), bank jobs, stock/finance analysis, and business management.',
    simpleMeaningHi:
      'कंपनी के खाते, टैक्स, ऑडिट (CA/CS/CMA), बैंक अधिकारी, फाइनेंस और बिज़नेस मैनेजमेंट।',
    whoCanJoinEn: 'Class 12 Commerce or Any Stream (Science/Arts students can also join BBA/B.Com/CA)',
    whoCanJoinHi: '12वीं कॉमर्स या कोई भी स्ट्रीम (साइंस/आर्ट्स के छात्र भी कर सकते हैं)',
    countLabel: '60+ Careers',
  },
  {
    parentId: 'p-upsc',
    categoryKey: 'government',
    directoryFilter: 'Law & Government',
    titleEn: '5. Government Jobs, UPSC, SSC, Railways & Defense (Army/Navy/Air Force)',
    titleHi: '5. सरकारी नौकरी, UPSC, SSC, रेलवे और सेना (Army/Navy/Air Force)',
    simpleMeaningEn:
      'Central & State Government officer exams (IAS/IPS, SSC CGL, Bank PO, Railway NTPC) and Armed Forces (NDA/CDS/CAPF).',
    simpleMeaningHi:
      'केंद्र व राज्य सरकार के अधिकारी (IAS/IPS, SSC, बैंक PO, रेलवे) और भारतीय सेना (NDA/CDS)।',
    whoCanJoinEn: 'Any Stream after Class 12 (NDA/SSC CHSL) or after Graduation (UPSC/SSC CGL/Bank PO)',
    whoCanJoinHi: '12वीं या स्नातक (Graduation) पास किसी भी विषय के छात्र',
    countLabel: '45+ Careers',
  },
  {
    parentId: 'p-law',
    categoryKey: 'law',
    directoryFilter: 'Law & Government',
    titleEn: '6. Law, Courts, Judge (Judiciary) & Company Legal Advisor',
    titleHi: '6. कानून (Law), वकालत, जज (Judiciary) और कॉर्पोरेट लीगल',
    simpleMeaningEn:
      'Becoming an Advocate in High Court/Supreme Court, clearing state Judge exams (PCS-J), or advising companies on contracts.',
    simpleMeaningHi:
      'कोर्ट में वकील बनना, जज परीक्षा (PCS-J) पास करना या कंपनियों में कानूनी सलाहकार बनना।',
    whoCanJoinEn: 'Any Stream after Class 12 (5-Year BA LLB via CLAT) or after Graduation (3-Year LLB)',
    whoCanJoinHi: '12वीं पास कोई भी स्ट्रीम (5-वर्षीय LLB) या ग्रेजुएशन के बाद (3-वर्षीय LLB)',
    countLabel: '20+ Careers',
  },
  {
    parentId: 'p-aviation-pilot',
    categoryKey: 'vocational',
    directoryFilter: 'Vocational & Trades',
    titleEn: '7. Practical Skill Trades, Aviation Pilot, Merchant Navy & Culinary',
    titleHi: '7. कौशल आधारित करियर (Vocational), पायलट, मर्चेंट नेवी और होटल',
    simpleMeaningEn:
      'Hands-on technical & skill careers: Commercial Pilot, Aircraft Maintenance, Merchant Navy, CTTC/CIPET Diploma, EV/Solar & Chef.',
    simpleMeaningHi:
      'प्रैक्टिकल स्किल करियर: पायलट, मर्चेंट नेवी, डिप्लोमा इंजीनियरिंग (CTTC/CIPET), होटल शेफ व तकनीकी ट्रेड।',
    whoCanJoinEn: 'Class 10 / Class 12 (PCM for Pilot/Merchant Navy; Any Stream for Hospitality & Skill Trades)',
    whoCanJoinHi: '10वीं / 12वीं पास (पायलट/मर्चेंट नेवी के लिए PCM; अन्य के लिए कोई भी स्ट्रीम)',
    countLabel: '40+ Careers',
  },
  {
    parentId: 'design-hub',
    categoryKey: 'design',
    directoryFilter: 'Arts & Design',
    titleEn: '8. Design, Architecture, UI/UX, Fashion (NID / NIFT) & Animation',
    titleHi: '8. डिज़ाइन, आर्किटेक्चर, फैशन (NID / NIFT) और एनिमेशन',
    simpleMeaningEn:
      'Designing mobile apps (UI/UX), buildings (Architecture), industrial products, clothing (NIFT), and 3D animation.',
    simpleMeaningHi:
      'मोबाइल ऐप डिजाइन (UI/UX), भवन निर्माण (Architecture), फैशन (NIFT) और 3D एनिमेशन।',
    whoCanJoinEn: 'Any Stream for Design (NID/UCEED/NIFT); PCM required for B.Arch Architecture',
    whoCanJoinHi: 'डिज़ाइन के लिए कोई भी स्ट्रीम; आर्किटेक्चर (B.Arch) के लिए गणित (PCM) अनिवार्य',
    countLabel: '25+ Careers',
  },
  {
    parentId: 'science-hub',
    categoryKey: 'science',
    directoryFilter: 'Engineering & Tech',
    titleEn: '9. Pure Science, ISRO/DRDO Research, Biotech & Statistics',
    titleHi: '9. विज्ञान अनुसंधान (ISRO/DRDO), बायोटेक, गणित और सांख्यिकी',
    simpleMeaningEn:
      'Scientific research at IISER/IISc/NISER, forensic science, biotechnology, microbiology, food labs, and data statistics.',
    simpleMeaningHi:
      'वैज्ञानिक अनुसंधान (IISER/IISc), फॉरेंसिक साइंस, बायोटेक्नोलॉजी, माइक्रोबायोलॉजी और सांख्यिकी।',
    whoCanJoinEn: 'Class 12 Science (PCM / PCB / PCMB)',
    whoCanJoinHi: '12वीं विज्ञान (PCM / PCB / PCMB) के छात्र',
    countLabel: '25+ Careers',
  },
  {
    parentId: 'arts-hub',
    categoryKey: 'arts',
    directoryFilter: 'Arts & Design',
    titleEn: '10. Arts, Psychology, Teaching, Journalism, Media & Sports',
    titleHi: '10. आर्ट्स, मनोविज्ञान (Psychology), शिक्षण, पत्रकारिता और खेल',
    simpleMeaningEn:
      'School/College Teaching (B.Ed/UGC NET), Clinical Psychology, Journalism, Public Policy, Foreign Languages, and Sports.',
    simpleMeaningHi:
      'शिक्षक (B.Ed/प्रोफेसर), मनोविज्ञान (Psychology), पत्रकारिता, विदेशी भाषाएं और खेल विज्ञान।',
    whoCanJoinEn: 'Open to All Streams (Arts, Commerce, and Science students)',
    whoCanJoinHi: 'सभी स्ट्रीम (आर्ट्स, कॉमर्स और साइंस) के छात्रों के लिए खुला',
    countLabel: '28+ Careers',
  },
];

const PAGE_SIZE = 20;

const INITIAL_CAREERS_250: CareerListItem[] = (careers250Json as CareerListItem[]).map(
  (item, idx) => ({
    ...item,
    addedOrder: typeof item.addedOrder === 'number' ? item.addedOrder : idx + 1,
  })
);

interface CareersListPageProps {
  lang: Language;
  initialCategory?: string;
  savedCareers: string[];
  onToggleSave: (id: string) => void;
  savedOnly?: boolean;
}

export const CareersListPage: React.FC<CareersListPageProps> = ({
  lang,
  initialCategory,
  savedCareers,
  onToggleSave,
  savedOnly = false,
}) => {
  const isHi = lang === 'hi';
  const [careers] = useState<CareerListItem[]>(INITIAL_CAREERS_250);
  const isLoading = false;

  // Beginner-friendly UI controls so no user is overwhelmed by 395+ cards
  const [showParentSectionsGuide, setShowParentSectionsGuide] = useState<boolean>(!savedOnly);
  const [showPlainWordMeanings, setShowPlainWordMeanings] = useState<boolean>(false);

  // Client-side only search, filter & sort state (?q= in URL is strictly banned)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortBy, setSortBy] = useState<CareerSortOption>('alphabetical');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Last 3 user search queries stored in localStorage
  const [recentQueries, setRecentQueries] = useState<string[]>(() =>
    loadPreference<string[]>('careerpatho-recent-queries', ['B.Tech CSE', 'MBBS', 'B.Sc Agriculture']).slice(0, 3)
  );

  const commitRecentQuery = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed.length < 2) return;
    setRecentQueries((prev) => {
      const next = [
        trimmed,
        ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, 3);
      savePreference('careerpatho-recent-queries', next);
      return next;
    });
  };

  // Client-side filtering + sorting (updates live, never writes ?q= to URL)
  const filteredCareers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const qClean = q.replace(/[^a-z0-9\s]/g, '');

    const matching = careers.filter((item) => {
      if (savedOnly && !savedCareers.includes(item.id)) {
        return false;
      }
      if (verificationFilter === 'verified' && !item.dataVerified) {
        return false;
      }
      if (verificationFilter === 'unverified' && item.dataVerified) {
        return false;
      }
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedStream !== 'All') {
        if (selectedStream === 'Any stream') {
          if (
            !item.streams.includes('Any stream') &&
            !item.streams.includes('Any Stream')
          ) {
            return false;
          }
        } else {
          if (
            !item.streams.includes(selectedStream) &&
            !item.streams.includes('Any stream') &&
            !item.streams.includes('Any Stream')
          ) {
            return false;
          }
        }
      }
      if (!q) return true;

      const haystack = `${item.id} ${item.title} ${item.titleHindi} ${item.oneLineDesc} ${item.category} ${item.streams.join(' ')}`.toLowerCase();
      const haystackClean = haystack.replace(/[^a-z0-9\s]/g, '');
      return haystack.includes(q) || (qClean.length > 0 && haystackClean.includes(qClean));
    });

    return sortCareerListItems(matching, sortBy);
  }, [careers, searchQuery, selectedCategory, selectedStream, verificationFilter, sortBy, savedOnly, savedCareers]);

  // Infinite scroll trigger at 80% viewport height (in addition to explicit "Load more" button)
  useEffect(() => {
    const handleScroll = () => {
      if (visibleCount >= filteredCareers.length) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (fullHeight > 0 && (scrollTop + viewportHeight) / fullHeight >= 0.8) {
        setVisibleCount((prev) => Math.min(filteredCareers.length, prev + PAGE_SIZE));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredCareers.length]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStream('All');
    setVerificationFilter('all');
    setSortBy('alphabetical');
    setVisibleCount(PAGE_SIZE);
  };

  const totalCount = careers.length || 395;
  const visibleSlice = filteredCareers.slice(0, visibleCount);

  return (
    <div
      data-testid="careers-list-page"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 overflow-x-hidden"
    >
      {/* Top Header, Sort By Dropdown & Live Total Count Display: "395 careers · X results" */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 mb-5 border-b border-[var(--border)]">
        <div className="min-w-0">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text3)] mb-1 break-words">
            {savedOnly
              ? tr(lang, 'SAVED CAREER BLUEPRINTS', 'सेव किए गए करियर ब्लूप्रिंट')
              : tr(
                  lang,
                  'ALL-INDIA CAREER DIRECTORY (395+ CAREERS · 10 PARENT SECTIONS)',
                  'अखिल भारतीय करियर निर्देशिका (10 मुख्य वर्गों में 395+ करियर)'
                )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] break-words">
            {savedOnly
              ? tr(lang, `Saved Careers (${savedCareers.length})`, `सेव किए गए करियर (${savedCareers.length})`)
              : tr(lang, 'Explore All 395+ Careers Easily', 'सभी 395+ करियर सरल भाषा में समझें और खोजें')}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Sort By Dropdown: Alphabetical, Salary High-to-Low, Newly Added */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border2)] bg-[var(--bg2)]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text2)] shrink-0" />
            <label
              htmlFor="careers-sort-select"
              className="text-xs font-mono font-bold text-[var(--text2)] whitespace-nowrap"
            >
              {tr(lang, 'Sort by:', 'क्रम से लगाएं:')}
            </label>
            <select
              id="careers-sort-select"
              aria-label="Sort by"
              data-testid="careers-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as CareerSortOption)}
              className="min-h-[34px] bg-transparent font-mono font-extrabold text-xs text-[var(--text)] outline-none cursor-pointer"
            >
              <option value="alphabetical" className="bg-[var(--bg)] text-[var(--text)]">
                {tr(lang, 'Alphabetical', 'वर्णमाला क्रम (A–Z)')}
              </option>
              <option value="salary-high" className="bg-[var(--bg)] text-[var(--text)]">
                {tr(lang, 'Salary High-to-Low', 'वेतन: अधिक से कम')}
              </option>
              <option value="newly-added" className="bg-[var(--bg)] text-[var(--text)]">
                {tr(lang, 'Newly Added', 'नए जोड़े गए (Newly Added)')}
              </option>
            </select>
          </div>

          <div
            data-testid="careers-total-count-display"
            className="px-3.5 py-2 rounded-xl border-2 border-[var(--text)] bg-[var(--bg2)] font-mono font-extrabold text-xs sm:text-sm text-[var(--text)] tabular-nums"
          >
            {totalCount} careers · {filteredCareers.length} results
          </div>
        </div>
      </div>

      {/* Anti-Hallucination & Zero Salary Guarantee Banner for Parents & Students */}
      <div
        data-testid="careers-anti-hallucination-banner"
        className="mb-5 p-4 rounded-2xl border-2 border-[var(--text)] bg-[var(--bg2)] text-xs leading-relaxed text-[var(--text)]"
      >
        <div className="font-mono font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {tr(
              lang,
              'REALITY CHECK FOR PARENTS & STUDENTS — ZERO SALARY OR PLACEMENT GUARANTEE:',
              'माता-पिता और छात्रों के लिए जरूरी सच — किसी भी वेतन या नौकरी की कोई गारंटी नहीं है:'
            )}
          </span>
        </div>
        <p className="text-[var(--text2)] break-words">
          {tr(
            lang,
            'No degree, exam, or college guarantees a job or starting salary. According to the Government of India MoSPI PLFS survey, the national median starting salary for general graduates is ₹3.0 LPA (₹25,000/month), and many graduates start at ₹0 if unplaced. Only statutory/government-regulated tracks cite official government portals; private, creative, freelance, and emerging roles are labeled "Market Estimate (Unverified)". Never take heavy education loans assuming a headline salary is guaranteed.',
            'कोई भी डिग्री, परीक्षा या कॉलेज किसी निश्चित नौकरी या वेतन की गारंटी नहीं देता है। भारत सरकार के MoSPI PLFS सर्वेक्षण के अनुसार सामान्य स्नातकों का राष्ट्रीय शुरुआती मीडियन वेतन ₹3.0 LPA (₹25,000/माह) है, और बिना कौशल के कई छात्र बेरोजगार (₹0) भी रहते हैं। जहां आधिकारिक सरकारी डेटा नहीं है, वहां स्पष्ट रूप से "Market Estimate (Unverified)" लिखा गया है। किसी भी संभावित वेतन को पक्का मानकर भारी एजुकेशन लोन न लें।'
          )}
        </p>
      </div>

      {/* NON-OVERWHELMING BEGINNER GUIDE FOR NON-TECHNICAL USERS & PARENTS */}
      {!savedOnly && (
        <section
          data-testid="beginner-easy-start-guide"
          className="mb-6 p-4 sm:p-5 rounded-2xl border-2 border-[var(--border2)] bg-[var(--bg2)] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-extrabold uppercase tracking-wider text-[var(--text)] mb-1">
                <Compass className="w-4 h-4 shrink-0" />
                <span>
                  {isHi
                    ? 'नए उपयोगकर्ताओं के लिए आसान गाइड (बिना किसी तकनीकी शब्द के)'
                    : 'NEW HERE? HOW TO USE THIS PAGE WITHOUT FEELING OVERWHELMED'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                {isHi
                  ? '395+ करियर एक साथ देखकर घबराएं नहीं! हमने सभी करियर को 10 आसान मुख्य वर्गों (Parent Sections) में बांटा है। नीचे किसी भी मुख्य वर्ग को चुनें या अपनी 12वीं की स्ट्रीम दबाएं।'
                  : 'Do not feel overwhelmed by 395+ careers! We organized everything into 10 simple Parent Sections below so anyone (even with zero technical background) can understand where to start.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                data-testid="toggle-plain-words-btn"
                onClick={() => setShowPlainWordMeanings((prev) => !prev)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[var(--border2)] bg-[var(--bg)] text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {showPlainWordMeanings
                    ? isHi
                      ? 'शब्दों के अर्थ छुपाएं'
                      : 'Hide Word Meanings'
                    : isHi
                    ? 'सरल शब्दकोश (LPA, CTC, PCM का मतलब?)'
                    : 'What do LPA, CTC, PCM mean?'}
                </span>
              </button>

              <button
                type="button"
                data-testid="toggle-parent-sections-btn"
                onClick={() => setShowParentSectionsGuide((prev) => !prev)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-mono font-extrabold inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {showParentSectionsGuide
                    ? isHi
                      ? '10 मुख्य वर्ग छुपाएं'
                      : 'Hide 10 Parent Sections'
                    : isHi
                    ? '10 मुख्य वर्ग दिखाएं (Show 10 Parent Sections)'
                    : 'Browse by 10 Parent Sections'}
                </span>
              </button>
            </div>
          </div>

          {/* Expandable Plain-Language Word Meaning Box (Jargon Buster for Non-Technical Parents/Students) */}
          {showPlainWordMeanings && (
            <div
              data-testid="plain-word-meanings-box"
              className="p-4 rounded-xl border border-[var(--border2)] bg-[var(--bg)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs"
            >
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
                <div className="font-mono font-extrabold text-[var(--text)] mb-1">
                  1. What is LPA? (लाख प्रति वर्ष)
                </div>
                <p className="text-[var(--text2)]">
                  <strong>LPA = Lakhs Per Annum</strong> (yearly salary before deductions). Example: <strong>₹3.6 LPA</strong> means about <strong>₹26,000–₹28,000 per month</strong> in hand.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
                <div className="font-mono font-extrabold text-[var(--text)] mb-1">
                  2. What is PCM / PCB? (12वीं के विषय)
                </div>
                <p className="text-[var(--text2)]">
                  <strong>PCM</strong> = Physics, Chemistry, Maths (Engineering/Pilot track). <strong>PCB</strong> = Physics, Chemistry, Biology (Doctor/Nursing/Agri track).
                </p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
                <div className="font-mono font-extrabold text-[var(--text)] mb-1">
                  3. Govt Source vs Market Estimate
                </div>
                <p className="text-[var(--text2)]">
                  <strong>Govt Source Cited</strong> means official govt exam/pay rules exist. <strong>Market Estimate (Unverified)</strong> means private jobs where pay varies widely.
                </p>
              </div>
            </div>
          )}

          {/* 10 Easy Parent Career Sections Grid (Including the NEW Agriculture, Food Tech & Green Sustainability Parent Section) */}
          {showParentSectionsGuide && (
            <div
              data-testid="ten-parent-sections-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 pt-1"
            >
              {PARENT_SECTION_BEGINNER_GUIDE.map((sec) => (
                <div
                  key={sec.parentId}
                  data-testid={`parent-section-card-${sec.parentId}`}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-colors ${
                    sec.isNewSection
                      ? 'border-2 border-[var(--text)] bg-[var(--bg)]'
                      : 'border-[var(--border2)] bg-[var(--bg)] hover:border-[var(--text)]'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-[var(--text)]">
                        {isHi ? sec.titleHi : sec.titleEn}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {sec.isNewSection && (
                          <span className="px-2 py-0.5 rounded bg-[var(--text)] text-[var(--bg)] text-[10px] font-mono font-extrabold">
                            {isHi ? 'नया वर्ग (22 करियर)' : 'NEW SECTION (22 CAREERS)'}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--bg2)] text-[10px] font-mono text-[var(--text2)]">
                          {sec.countLabel}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text2)] leading-relaxed mb-2">
                      {isHi ? sec.simpleMeaningHi : sec.simpleMeaningEn}
                    </p>
                    <div className="text-[11px] font-mono text-[var(--text3)]">
                      <strong className="text-[var(--text)]">
                        {isHi ? 'कौन कर सकता है: ' : 'Who can join: '}
                      </strong>
                      {isHi ? sec.whoCanJoinHi : sec.whoCanJoinEn}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
                    <a
                      href={`#/career/${sec.parentId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToHash(`#/career/${sec.parentId}`);
                      }}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-[11px] font-mono font-extrabold inline-flex items-center gap-1 hover:opacity-90"
                    >
                      <span>{isHi ? 'इस मुख्य वर्ग को खोलें →' : 'Open Parent Hub →'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(sec.directoryFilter);
                        const searchEl = document.getElementById('careers-search-input');
                        if (searchEl && typeof searchEl.scrollIntoView === 'function') {
                          searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[11px] font-mono font-bold text-[var(--text)] hover:border-[var(--text)] cursor-pointer"
                    >
                      {isHi ? 'नीचे लिस्ट में फ़िल्टर करें' : 'Filter List Below'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Last 3 Recent Search Queries Chips (stored in localStorage) */}
      {recentQueries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono">
          <span className="text-[var(--text3)] text-[11px]">
            {tr(lang, 'Recent searches:', 'हाल की खोजें:')}
          </span>
          {recentQueries.map((rq, rqIdx) => (
            <button
              key={`${rq}-${rqIdx}`}
              type="button"
              onClick={() => setSearchQuery(rq)}
              className="px-2.5 py-1 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--text)] text-[11px] font-semibold cursor-pointer"
            >
              {rq}
            </button>
          ))}
        </div>
      )}

      {/* 1. Search Bar at the Top — Client-Side Only (No ?q= in URL) */}
      <div className="relative mb-4">
        <label htmlFor="careers-search-input" className="sr-only">
          Career search karo
        </label>
        <Search className="w-5 h-5 text-[var(--text3)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="careers-search-input"
          data-testid="careers-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={() => commitRecentQuery(searchQuery)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitRecentQuery(searchQuery);
          }}
          placeholder="Type any word in simple language... (e.g., Doctor, Agriculture, Railway, Bank, Computer, Pilot)"
          className="w-full min-h-[50px] pl-12 pr-11 py-3 rounded-2xl border-2 border-[var(--border2)] focus:border-[var(--text)] bg-[var(--bg2)] text-sm sm:text-base font-medium text-[var(--text)] placeholder:text-[var(--text3)] outline-none transition-colors"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            aria-label="Clear search query"
            onClick={() => setSearchQuery('')}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[var(--text2)] hover:text-[var(--text)] absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Category Filters — Horizontal Scroll Chips Below Search */}
      <div
        role="group"
        aria-label="Category filters"
        data-testid="category-filter-chips"
        className="flex items-center gap-2 overflow-x-auto pb-2 mb-2.5 no-scrollbar"
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            selectedCategory === 'All'
              ? 'bg-[var(--text)] text-[var(--bg)]'
              : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
          }`}
        >
          {tr(lang, 'All Categories', 'सभी श्रेणियां')}
        </button>
        {DIRECTORY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(isActive ? 'All' : cat)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[var(--text)] text-[var(--bg)]'
                  : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {tr(lang, cat, cat)}
            </button>
          );
        })}
      </div>

      {/* 3. Stream Filter — Second Row of Chips: PCM, PCB, Commerce, Arts, Any stream */}
      <div
        role="group"
        aria-label="Stream filters"
        data-testid="stream-filter-chips"
        className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[var(--border)] no-scrollbar"
      >
        <span className="text-[11px] font-mono font-bold uppercase text-[var(--text3)] shrink-0 mr-1">
          {isHi ? '12वीं विषय (Stream):' : '12th Subjects (Stream):'}
        </span>
        <button
          type="button"
          onClick={() => setSelectedStream('All')}
          className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            selectedStream === 'All'
              ? 'bg-[var(--text)] text-[var(--bg)]'
              : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
          }`}
        >
          All
        </button>
        {STREAM_FILTERS.map((stream) => {
          const isActive = selectedStream === stream;
          return (
            <button
              key={stream}
              type="button"
              onClick={() => setSelectedStream(isActive ? 'All' : stream)}
              className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[var(--text)] text-[var(--bg)]'
                  : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {stream}
            </button>
          );
        })}

        <span className="text-[var(--border2)] mx-1" aria-hidden="true">|</span>

        {/* 1-Tap Honest Verification Filter */}
        <button
          type="button"
          data-testid="filter-verification-all"
          onClick={() => setVerificationFilter('all')}
          className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            verificationFilter === 'all'
              ? 'bg-[var(--text)] text-[var(--bg)]'
              : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:text-[var(--text)]'
          }`}
        >
          {isHi ? 'सभी डेटा (395)' : 'All Data (395)'}
        </button>
        <button
          type="button"
          data-testid="filter-verification-govt"
          onClick={() => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified')}
          className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5 border ${
            verificationFilter === 'verified'
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
              : 'badge-verified-subtle'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{isHi ? 'सरकारी स्रोत उद्धृत (62)' : 'Govt Source Cited (62)'}</span>
        </button>
        <button
          type="button"
          data-testid="filter-verification-market"
          onClick={() => setVerificationFilter(verificationFilter === 'unverified' ? 'all' : 'unverified')}
          className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5 border ${
            verificationFilter === 'unverified'
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
              : 'badge-unverified-subtle'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{isHi ? 'बाज़ार अनुमान (333)' : 'Market Estimates (333)'}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] animate-pulse"
            />
          ))}
        </div>
      ) : filteredCareers.length === 0 ? (
        /* 6. Empty State */
        <div
          data-testid="careers-empty-state"
          className="p-10 sm:p-14 text-center rounded-2xl border-2 border-[var(--border2)] bg-[var(--bg2)] space-y-4"
        >
          <p className="text-base sm:text-lg font-extrabold text-[var(--text)]">
            {savedOnly && savedCareers.length === 0
              ? tr(
                  lang,
                  'No saved careers yet. Browse all 395+ careers and tap the bookmark icon to save!',
                  'अभी कोई करियर सेव नहीं किया गया है। 395+ करियर देखें और सेव करें!'
                )
              : 'Koi career nahi mila. Try a different keyword, ya filters clear karo.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {savedOnly ? (
              <a
                href="#/careers"
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span>{tr(lang, 'Browse All 395+ Careers', 'सभी 395+ करियर देखें')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <button
                type="button"
                data-testid="clear-filters-btn"
                onClick={handleClearFilters}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{tr(lang, 'Clear filters', 'फिल्टर हटाएं')}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 4 & 5. Paginated Career Cards (20 at a time, compact max 3 lines on mobile, SVG icons only) */
        <div>
          <div
            data-testid="careers-card-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
          >
            {visibleSlice.map((item) => {
              const isSaved = savedCareers.includes(item.id);
              const titleText =
                lang === 'en'
                  ? item.title
                  : lang === 'hi'
                  ? item.titleHindi || item.title
                  : translateRegionalText(lang, item.title, item.titleHindi);
              const descText =
                lang === 'en'
                  ? item.oneLineDesc
                  : lang === 'hi'
                  ? item.oneLineDescHindi || item.oneLineDesc
                  : translateRegionalText(lang, item.oneLineDesc, item.oneLineDescHindi);

              return (
                <article
                  key={item.id}
                  data-testid={`career-list-card-${item.id}`}
                  className="p-4 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] hover:border-[var(--text)] transition-colors flex flex-col justify-between gap-3"
                >
                  <div>
                    {/* Row 1: SVG Icon + Full-Width Career Title */}
                    <div className="flex items-center gap-2.5 min-w-0 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--text)]">
                        <CareerSvgIcon id={item.id} category={item.rawCategory} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-extrabold text-sm sm:text-base text-[var(--text)] leading-snug line-clamp-1">
                          {titleText}
                        </h2>
                        <div className="text-[10px] font-mono text-[var(--text3)] truncate">
                          {item.category} · {item.streams.join(' / ')}
                        </div>
                      </div>
                    </div>

                    {/* Row 1B: Aligned Verification Pill + Audit Date Badge */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {item.dataVerified ? (
                        <span
                          title="Official Govt/Statutory Portal Cited — Not a Salary Guarantee"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border badge-verified-subtle text-[10px] font-mono font-bold"
                        >
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span>{tr(lang, 'Govt Source Cited', 'सरकारी स्रोत संदर्भित')}</span>
                        </span>
                      ) : (
                        <span
                          title="Market Estimate — No official government salary verification exists for this track"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border badge-unverified-subtle text-[10px] font-mono font-bold"
                        >
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{tr(lang, 'Market Estimate (Unverified)', 'बाज़ार अनुमान (असत्यापित)')}</span>
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded border badge-nov11-subtle text-[9px] font-mono font-bold shrink-0">
                        11 Nov 2026
                      </span>
                    </div>

                    {/* Row 2: One-line description (strictly clamped to 1 line on mobile) */}
                    <p className="text-xs text-[var(--text2)] line-clamp-1 mb-2">
                      {descText}
                    </p>

                    {/* Row 3: Duration + Salary Range with Source Tag + 11 Nov 2026 Audit Tag */}
                    <div className="text-[11px] font-mono space-y-1 pt-2 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between gap-2 text-[var(--text2)]">
                        <span>
                          {translateRegionalText(lang, 'Duration', 'अवधि')}:{' '}
                          <strong className="text-[var(--text)]">
                            {translateRegionalText(lang, item.duration, item.duration)}
                          </strong>
                        </span>
                        <span className="px-1.5 py-0.5 rounded border badge-nov11-subtle text-[9px] font-bold shrink-0">
                          11 Nov 2026
                        </span>
                      </div>
                      <div className="text-[var(--text)] font-bold line-clamp-1">
                        {tr(lang, 'Est. (Not Guaranteed): ', 'अनुमानित (गारंटी नहीं): ')}
                        {item.salaryRange}
                      </div>
                      <div className="text-[10px] text-[var(--text3)] truncate">
                        {item.sourceTag}
                      </div>
                    </div>
                  </div>

                  {/* Action Row: Bookmark + Report Correction + View button */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleSave(item.id)}
                        aria-label={isSaved ? 'Remove from saved' : 'Save career'}
                        className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                            : 'bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--text)] hover:text-[var(--text)]'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved ? tr(lang, 'Saved', 'सेव्ड') : tr(lang, 'Save', 'सेव')}</span>
                      </button>

                      <a
                        href={`#/feedback?career=${encodeURIComponent(item.id)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToHash(`#/feedback?career=${encodeURIComponent(item.id)}`);
                        }}
                        title={tr(lang, 'Report data correction for this career', 'डेटा सुधार रिपोर्ट करें')}
                        className="min-h-[40px] px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[11px] font-mono font-semibold text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text)] inline-flex items-center"
                      >
                        {tr(lang, 'Fix Data', 'सुधार')}
                      </a>
                    </div>

                    <a
                      href={`#/career/${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim().length >= 2) {
                          commitRecentQuery(searchQuery);
                        }
                        navigateToHash(`#/career/${item.id}`);
                      }}
                      className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                    >
                      <span>{tr(lang, 'View', 'देखें')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More Button (20 at a time) */}
          {visibleCount < filteredCareers.length && (
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                data-testid="load-more-careers-btn"
                onClick={() =>
                  setVisibleCount((prev) => Math.min(filteredCareers.length, prev + PAGE_SIZE))
                }
                className="min-h-[48px] px-6 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Load more ({Math.min(PAGE_SIZE, filteredCareers.length - visibleCount)} more of{' '}
                {filteredCareers.length - visibleCount} remaining)
              </button>
              <span className="text-[11px] font-mono text-[var(--text3)]">
                Showing {visibleSlice.length} of {filteredCareers.length} careers
              </span>
            </div>
          )}

          {/* Bottom Community Data Correction Callout */}
          <div className="mt-10 p-5 rounded-2xl border-2 border-[var(--border2)] bg-[var(--bg2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-mono font-extrabold text-xs sm:text-sm text-[var(--text)]">
                {tr(
                  lang,
                  'Spot an updated official government PDF, exam date, or salary figure?',
                  'क्या आपके पास नया आधिकारिक सरकारी PDF, परीक्षा तिथि या वेतन अपडेट है?'
                )}
              </div>
              <p className="text-xs text-[var(--text2)]">
                {tr(
                  lang,
                  'Send us the message via our 3-Option Feedback Page or email virganox3690@gmail.com.',
                  'हमारे 3-विकल्प फ़ीडबैक पेज से संदेश भेजें या virganox3690@gmail.com पर ईमेल करें।'
                )}
              </p>
            </div>
            <a
              href="#/feedback"
              onClick={(e) => {
                e.preventDefault();
                navigateToHash('#/feedback');
              }}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--text)] text-[var(--bg)] font-mono font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shrink-0 hover:opacity-90"
            >
              <span>{tr(lang, 'Open Feedback Page →', 'फ़ीडबैक पेज खोलें →')}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersListPage;
