import { CareersDatabase, ParentCareer, ChildCareer } from './types';
import { CATEGORIES, COMING_SOON_LIST } from './categories';
import { engineeringParents, engineeringChildren } from './careersEngineering';
import { medicalParents, medicalChildren } from './careersMedical';
import { commerceLawParents, commerceLawChildren } from './careersCommerceLaw';
import { govtVocationalParents, govtVocationalChildren } from './careersGovtVocational';
import { artsScienceDesignParents, artsScienceDesignChildren } from './careersArtsScienceDesign';
import { moreDomainChildren } from './careersMoreDomains';
import { emerging2026Children } from './careersEmerging2026';
import { frontierPathsChildren } from './careersFrontierPaths';
import { enrichChildCareer, computeSarkariEligibilityDetails } from './careerEnrichment';

const additionalParents: Record<string, ParentCareer> = {
  'p-law': {
    id: 'p-law',
    isParent: true,
    title: 'Integrated Law, Judiciary & Corporate Legal Hub (BA/BBA LLB)',
    titleHindi: 'एकीकृत कानून, न्यायपालिका और कॉर्पोरेट लॉ हब (BA/BBA LLB)',
    icon: 'law',
    category: 'law',
    audience: ['Class 12 Any Stream', 'Graduates'],
    tagline: 'National Law Universities (CLAT), Judicial Services (PCS-J), Corporate M&A, IPR, and Tech Privacy Law.',
    taglineHindi: 'नेशनल लॉ यूनिवर्सिटी (CLAT), जज (PCS-J), कॉर्पोरेट लॉ, साइबर और पेटेंट कानून के प्रमुख रास्ते।',
    overview: 'Legal education in India spans 5-year integrated NLU degrees and 3-year graduate LLB tracks leading to Tier-1 corporate law firms, judicial benches, JAG defense commissions, and technology policy roles.',
    overviewHindi: 'भारत में 5-वर्षीय और 3-वर्षीय एलएलबी कोर्स छात्रों को कॉर्पोरेट लॉ फर्म, जज (PCS-J), सुप्रीम कोर्ट वकालत और टेक पॉलिसी में शीर्ष करियर प्रदान करते हैं।',
    children: [],
    lastVerified: '2026-10-25',
    sarkariEligible: true,
    sarkariEligibility: '[✅ Eligible for UPSC/SSC/Bank PO]',
  },
};

const rawParents: Record<string, ParentCareer> = {
  ...engineeringParents,
  ...medicalParents,
  ...commerceLawParents,
  ...govtVocationalParents,
  ...artsScienceDesignParents,
  ...additionalParents,
};

const rawChildren: Record<string, ChildCareer> = {
  ...engineeringChildren,
  ...medicalChildren,
  ...commerceLawChildren,
  ...govtVocationalChildren,
  ...artsScienceDesignChildren,
  ...moreDomainChildren,
  ...emerging2026Children,
  ...frontierPathsChildren,
};

// Map legacy or generic hub parentIds to canonical ParentCareer keys so every child belongs to exactly ONE parent path
const PARENT_ID_ALIAS_MAP: Record<string, string> = {
  'btech-hub': 'p-btech',
  'medical-hub': 'p-mbbs',
  'commerce-hub': 'p-bcom',
  'law-hub': 'p-law',
  'govt-hub': 'p-upsc',
  'vocational-hub': 'p-aviation-pilot',
  'p-design': 'design-hub',
};

const CATEGORY_DEFAULT_PARENT: Record<string, string> = {
  engineering: 'p-btech',
  medical: 'p-mbbs',
  commerce: 'p-bcom',
  law: 'p-law',
  government: 'p-upsc',
  design: 'design-hub',
  science: 'science-hub',
  arts: 'arts-hub',
  vocational: 'p-aviation-pilot',
};

function resolveCanonicalParentId(child: ChildCareer): string {
  const rawPid = child.parentId || '';
  if (rawPid && rawParents[rawPid] && rawPid !== 'p-design') {
    return rawPid;
  }
  // Heuristic assignment within multi-parent categories for cleaner smaller pathways
  const id = child.id.toLowerCase();
  if (
    child.category === 'engineering' &&
    (id.includes('bca') ||
      id.includes('cloud') ||
      id.includes('web') ||
      id.includes('devops') ||
      id.includes('cyber') ||
      id.includes('game') ||
      id.includes('blockchain') ||
      id.includes('full-stack'))
  ) {
    return 'p-bca';
  }
  if (
    child.category === 'medical' &&
    (id.includes('pharm') || id.includes('drug') || id.includes('clinical-res'))
  ) {
    return 'p-pharmacy';
  }
  if (
    child.category === 'medical' &&
    (id.includes('nurs') ||
      id.includes('physio') ||
      id.includes('optom') ||
      id.includes('radiol') ||
      id.includes('lab-tech') ||
      id.includes('prosthetics') ||
      id.includes('allied'))
  ) {
    return 'p-nursing';
  }
  if (
    child.category === 'medical' &&
    (id.includes('bams') || id.includes('bhms') || id.includes('yoga') || id.includes('ayush'))
  ) {
    return 'p-ayush';
  }
  if (
    child.category === 'medical' &&
    (id.includes('bds') || id.includes('dental') || id.includes('vet'))
  ) {
    return 'p-bds';
  }
  if (
    child.category === 'commerce' &&
    (id.includes('cs-') || id.includes('company-sec') || id.includes('compliance'))
  ) {
    return 'p-cs';
  }
  if (
    child.category === 'commerce' &&
    (id.includes('mba') ||
      id.includes('bba') ||
      id.includes('supply') ||
      id.includes('product') ||
      id.includes('hotel') ||
      id.includes('fintech'))
  ) {
    return 'p-bba-mba';
  }
  if (
    child.category === 'commerce' &&
    (id.includes('ca-') ||
      id.includes('cma') ||
      id.includes('acca') ||
      id.includes('forensic') ||
      id.includes('actuar') ||
      id.includes('cfa'))
  ) {
    return 'p-ca';
  }
  if (
    child.category === 'government' &&
    (id.includes('defense') ||
      id.includes('nda') ||
      id.includes('navy') ||
      id.includes('airforce') ||
      id.includes('capf') ||
      id.includes('afcat') ||
      id.includes('cds'))
  ) {
    return 'p-defense';
  }
  if (rawPid && PARENT_ID_ALIAS_MAP[rawPid] && rawParents[PARENT_ID_ALIAS_MAP[rawPid]]) {
    return PARENT_ID_ALIAS_MAP[rawPid];
  }
  return CATEGORY_DEFAULT_PARENT[child.category] || 'p-btech';
}

// Automatically enrich every child career with skillRadar, suitability matrix, work-life balance, top colleges, Sarkari eligibility, and canonical parentId
const combinedChildren: Record<string, ChildCareer> = {};
Object.keys(rawChildren).forEach((id) => {
  const enriched = enrichChildCareer(rawChildren[id]);
  const canonicalParentId = resolveCanonicalParentId(enriched);
  combinedChildren[id] = {
    ...enriched,
    parentId: canonicalParentId,
  };
});

// Remove redundant 'p-design' parent since 'design-hub' is canonical for design
const activeRawParents = { ...rawParents };
delete activeRawParents['p-design'];

// Ensure every parent hub strictly contains the children assigned to its canonical parentId (zero cross-parent duplication)
const combinedParents: Record<string, ParentCareer> = {};
Object.keys(activeRawParents).forEach((parentId) => {
  const parent = activeRawParents[parentId];
  const childIds = new Set<string>();
  Object.values(combinedChildren).forEach((child) => {
    if (child.parentId === parentId) {
      childIds.add(child.id);
    }
  });
  const sarkariDetails = computeSarkariEligibilityDetails(parent.category);
  combinedParents[parentId] = {
    ...parent,
    children: Array.from(childIds),
    sarkariEligible: true,
    sarkariEligibility: parent.sarkariEligibility || '[✅ Eligible for UPSC/SSC/Bank PO]',
    sarkariEligibilityDetails: sarkariDetails,
    authorityBadges: parent.authorityBadges || ['NIRF Verified', 'AICTE / UGC Approved', 'Govt Portal Verified'],
  };
});

export const INITIAL_CAREERS_DATA: CareersDatabase = {
  categories: CATEGORIES,
  comingSoon: COMING_SOON_LIST,
  parents: combinedParents,
  children: combinedChildren,
};

export function getActiveCareersData(): CareersDatabase {
  if (typeof window !== 'undefined') {
    try {
      const localStr = localStorage.getItem('careerpatho-data');
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (parsed && (parsed.categories || parsed.parents || parsed.children)) {
          const mergedChildren: Record<string, ChildCareer> = { ...INITIAL_CAREERS_DATA.children };
          if (parsed.children) {
            Object.keys(parsed.children).forEach((k) => {
              const enriched = enrichChildCareer({ ...mergedChildren[k], ...parsed.children[k] });
              mergedChildren[k] = {
                ...enriched,
                parentId: resolveCanonicalParentId(enriched),
              };
            });
          }
          return {
            categories: parsed.categories || INITIAL_CAREERS_DATA.categories,
            comingSoon: parsed.comingSoon || INITIAL_CAREERS_DATA.comingSoon,
            parents: { ...INITIAL_CAREERS_DATA.parents, ...(parsed.parents || {}) },
            children: mergedChildren,
          };
        }
      }
    } catch (e) {
      console.warn('Could not read careerpatho-data from localStorage:', e);
    }
  }

  return INITIAL_CAREERS_DATA;
}
