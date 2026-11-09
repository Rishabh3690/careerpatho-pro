import React from 'react';

interface CareerSvgIconProps {
  id?: string;
  category?: string;
  className?: string;
}

/**
 * Custom human-crafted monochrome architectural SVG icons tailored for Indian career domains.
 * Replaces generic emojis with precision vector line art.
 */
export const CareerSvgIcon: React.FC<CareerSvgIconProps> = ({
  id = '',
  category = '',
  className = 'w-6 h-6',
}) => {
  const key = id.toLowerCase();
  const cat = category.toLowerCase();

  // 1. Software / CSE / Coding / Full-Stack
  if (key.includes('cse') || key.includes('software') || key.includes('bca') || key.includes('web') || key.includes('cloud') || key.includes('devops')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="m7 8-2.5 2.5L7 13" />
        <path d="m17 8 2.5 2.5L17 13" />
        <path d="m13 7-2 6" />
      </svg>
    );
  }

  // 2. AI / Data Science / Machine Learning / Quantum
  if (key.includes('ai') || key.includes('data') || key.includes('ml') || key.includes('quantum') || key.includes('bioinfo')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <circle cx="5" cy="6" r="2" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="M6.7 7.3 9.8 10" />
        <path d="M17.3 7.3 14.2 10" />
        <path d="M6.7 16.7 9.8 14" />
        <path d="M17.3 16.7 14.2 14" />
        <path d="M12 3v6" />
        <path d="M12 15v6" />
      </svg>
    );
  }

  // 3. Cybersecurity / Ethical Hacking / Forensic
  if (key.includes('cyber') || key.includes('sec') || key.includes('forensic')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <rect x="9" y="10" width="6" height="5" rx="1" />
        <path d="M10 10V8a2 2 0 1 1 4 0v2" />
      </svg>
    );
  }

  // 4. Electronics / VLSI / Semiconductor / Electrical
  if (key.includes('ece') || key.includes('vlsi') || key.includes('ee') || key.includes('semi') || key.includes('iot')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      </svg>
    );
  }

  // 5. Aviation / Pilot / Aerospace / Space
  if (key.includes('pilot') || key.includes('aviation') || key.includes('aero') || key.includes('space') || key.includes('drone')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    );
  }

  // 6. Merchant Navy / Marine / Naval
  if (key.includes('navy') || key.includes('marine') || key.includes('ship')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="12" cy="5" r="3" />
        <path d="M12 22V8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        <path d="M9 11h6" />
      </svg>
    );
  }

  // 7. Medical / MBBS / Clinical / Surgery / Nursing / Vet / Physio
  if (key.includes('mbbs') || key.includes('bds') || key.includes('nursing') || key.includes('bams') || key.includes('physio') || key.includes('vet') || cat === 'medical') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    );
  }

  // 8. Pharmacy / Chemistry / Biotech / Science
  if (key.includes('pharm') || key.includes('biotech') || key.includes('chem') || key.includes('physics') || key.includes('science') || cat === 'science') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M10 2v7.31" />
        <path d="M14 9.3V1.99" />
        <path d="M8.5 2h7" />
        <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
        <path d="M5.52 16h12.96" />
      </svg>
    );
  }

  // 9. Finance / CA / CS / CMA / CFA / Investment / B.Com / MBA / Commerce
  if (
    key.includes('ca-') ||
    key.includes('cs-') ||
    key.includes('cma') ||
    key.includes('cfa') ||
    key.includes('bcom') ||
    key.includes('mba') ||
    key.includes('bba') ||
    key.includes('fin') ||
    key.includes('actuar') ||
    key.includes('econ') ||
    cat === 'commerce'
  ) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
        <path d="M15 9h4v4" />
      </svg>
    );
  }

  // 10. Law / Judiciary / Legal / CLAT
  if (key.includes('llb') || key.includes('law') || key.includes('judic') || key.includes('legal') || cat === 'law') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </svg>
    );
  }

  // 11. Design / Architecture / Fashion / UI-UX / Animation
  if (key.includes('des') || key.includes('arch') || key.includes('nift') || key.includes('fashion') || key.includes('anim') || key.includes('ux') || cat === 'design') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    );
  }

  // 12. Government / UPSC / IAS / PCS / Defense / SSC / Railways / RBI
  if (key.includes('upsc') || key.includes('ias') || key.includes('pcs') || key.includes('defense') || key.includes('ssc') || key.includes('rbi') || key.includes('rail') || cat === 'government') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M3 22h18" />
        <path d="M6 18v-7" />
        <path d="M10 18v-7" />
        <path d="M14 18v-7" />
        <path d="M18 18v-7" />
        <polygon points="12 2 20 7 4 7" />
        <path d="M4 18h16" />
      </svg>
    );
  }

  // 13. Arts / Humanities / Journalism / Psychology / Media / Policy
  if (key.includes('psych') || key.includes('media') || key.includes('journ') || key.includes('arts') || key.includes('polic') || key.includes('film') || cat === 'arts') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h6" />
        <path d="M8 11h8" />
      </svg>
    );
  }

  // 14. Agriculture / Food Tech / Forestry / Green Sustainability
  if (
    key.includes('agri') ||
    key.includes('horti') ||
    key.includes('forest') ||
    key.includes('fish') ||
    key.includes('dairy') ||
    key.includes('fssai') ||
    key.includes('nabard') ||
    key.includes('soil') ||
    key.includes('seed') ||
    key.includes('solar') ||
    key.includes('esg') ||
    cat === 'agriculture'
  ) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    );
  }

  // 15. Default Engineering / Mechanical / Civil / Vocational / Skilled Trade
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
};
