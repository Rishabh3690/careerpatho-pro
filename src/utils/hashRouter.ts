import { useState, useEffect, useCallback } from 'react';
import { CareersDatabase, ChildCareer, ParentCareer } from '../data/types';
import { resolveCareerAlias } from '../components/CompareSection';

export type RouteName =
  | 'home'
  | 'careers'
  | 'career'
  | 'compare'
  | 'category'
  | 'talentQuiz'
  | 'saved'
  | 'supporters'
  | 'sources'
  | 'howWeCalculate'
  | 'comingSoon'
  | 'feedback'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'notFound';

export interface ParsedHashRoute {
  name: RouteName;
  id?: string;
  c1?: string;
  c2?: string;
  rawHash: string;
}

export const CAREERPATHO_HASH_EVENT = 'careerpatho:hashchange';

const IN_PAGE_ANCHORS = new Set([
  'app',
  'careers-directory-section',
  'compare-careers-section',
  'starting-quiz-home-banner',
]);

/**
 * Normalizes any target route or hash into canonical `#/...` format.
 */
export function normalizeHashString(input: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed || trimmed === '#' || trimmed === '#/') {
    return '#/';
  }
  if (trimmed.startsWith('#/')) {
    return trimmed;
  }
  if (trimmed.startsWith('#')) {
    const withoutHash = trimmed.slice(1);
    if (IN_PAGE_ANCHORS.has(withoutHash)) {
      return '#/';
    }
    return `#/${withoutHash.replace(/^\/+/, '')}`;
  }
  if (trimmed.startsWith('/')) {
    return `#${trimmed}`;
  }
  return `#/${trimmed}`;
}

/**
 * Deterministic, stateless parser for `#/careers`, `#/career/:id`, `#/compare?c1=...&c2=...`, and all app routes.
 * Handles trailing slashes, URL encoding, query parameters, and in-page accessibility anchors.
 */
export function parseHashRoute(hash: string): ParsedHashRoute {
  const rawHash = (hash || '').trim();
  if (!rawHash || rawHash === '#' || rawHash === '#/') {
    return { name: 'home', rawHash: '#/' };
  }

  // Strip leading `#` and any leading slashes
  const withoutHash = rawHash.replace(/^#+/, '').trim();
  if (!withoutHash || IN_PAGE_ANCHORS.has(withoutHash)) {
    return { name: 'home', rawHash: rawHash || '#/' };
  }

  const clean = withoutHash.replace(/^\/+/, '').trim();
  if (!clean) {
    return { name: 'home', rawHash: '#/' };
  }

  // Split path and query string (`#/compare?c1=btech-cse&c2=bca-software`)
  const questionMarkIdx = clean.indexOf('?');
  const pathPart = questionMarkIdx >= 0 ? clean.slice(0, questionMarkIdx) : clean;
  const queryPart = questionMarkIdx >= 0 ? clean.slice(questionMarkIdx + 1) : '';

  // Split path segments and remove empty segments from trailing/double slashes
  const parts = pathPart
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (parts.length === 0 || parts[0] === 'home') {
    return { name: 'home', rawHash };
  }

  const rootSegment = parts[0].toLowerCase();

  // 0. Careers List Route: `#/careers`
  if (rootSegment === 'careers') {
    return { name: 'careers', rawHash };
  }

  // 1. Compare Route: `#/compare?c1=btech-cse&c2=bca-software` or `#/compare/btech-cse/bca-software`
  if (rootSegment === 'compare') {
    const params = new URLSearchParams(queryPart);
    const rawC1 = params.get('c1') || parts[1] || undefined;
    const rawC2 = params.get('c2') || parts[2] || undefined;
    return {
      name: 'compare',
      c1: rawC1 ? decodeURIComponent(rawC1).trim() : undefined,
      c2: rawC2 ? decodeURIComponent(rawC2).trim() : undefined,
      rawHash,
    };
  }

  // 2. Career Detail Route (Parent Hub or Child Career): `#/career/:id`
  if (rootSegment === 'career' && parts[1]) {
    const decodedId = decodeURIComponent(parts[1]).trim();
    return {
      name: 'career',
      id: decodedId,
      rawHash,
    };
  }

  // 3. Domain Category Route: `#/category/:id`
  if (rootSegment === 'category' && parts[1]) {
    const decodedCatId = decodeURIComponent(parts[1]).trim().toLowerCase();
    return {
      name: 'category',
      id: decodedCatId,
      rawHash,
    };
  }

  // 4. Static & Audit Trust Routes
  if (rootSegment === 'talent-quiz' || rootSegment === 'quiz') {
    return { name: 'talentQuiz', rawHash };
  }
  if (rootSegment === 'sources') {
    return { name: 'sources', rawHash };
  }
  if (rootSegment === 'how-we-calculate') {
    return { name: 'howWeCalculate', rawHash };
  }
  if (rootSegment === 'saved') {
    return { name: 'saved', rawHash };
  }
  if (rootSegment === 'supporters') {
    return { name: 'supporters', rawHash };
  }
  if (rootSegment === 'coming-soon') {
    return { name: 'comingSoon', rawHash };
  }
  if (rootSegment === 'feedback') {
    const params = new URLSearchParams(queryPart);
    const rawCareer = params.get('career') || parts[1] || undefined;
    const rawType = params.get('type') || undefined;
    return {
      name: 'feedback',
      id: rawCareer ? decodeURIComponent(rawCareer).trim() : undefined,
      c1: rawType ? decodeURIComponent(rawType).trim() : undefined,
      rawHash,
    };
  }
  if (rootSegment === 'about') {
    return { name: 'about', rawHash };
  }
  if (rootSegment === 'privacy') {
    return { name: 'privacy', rawHash };
  }
  if (rootSegment === 'terms') {
    return { name: 'terms', rawHash };
  }

  return { name: 'notFound', rawHash };
}

/**
 * Resolves a career route `:id` against both ParentCareer (`p-btech`) and ChildCareer (`btech-cse`),
 * with case-insensitive and alias fallback (`bca` -> `bca-software`).
 */
export function resolveCareerRouteTarget(
  data: CareersDatabase,
  rawId?: string
):
  | { kind: 'parent'; id: string; parent: ParentCareer }
  | { kind: 'child'; id: string; child: ChildCareer }
  | null {
  if (!rawId) return null;
  const cleanId = rawId.trim();
  const lowerId = cleanId.toLowerCase();

  // Direct or case-insensitive Parent Hub lookup (e.g., `p-btech`)
  if (data.parents[cleanId]) {
    return { kind: 'parent', id: cleanId, parent: data.parents[cleanId] };
  }
  if (data.parents[lowerId]) {
    return { kind: 'parent', id: lowerId, parent: data.parents[lowerId] };
  }

  // Direct or case-insensitive Child Career lookup (e.g., `btech-cse`)
  if (data.children[cleanId]) {
    return { kind: 'child', id: cleanId, child: data.children[cleanId] };
  }
  if (data.children[lowerId]) {
    return { kind: 'child', id: lowerId, child: data.children[lowerId] };
  }

  // Shorthand alias fallback (e.g., `bca` -> `bca-software`, `btech` -> `btech-cse`)
  const aliasedChildId = resolveCareerAlias(data, lowerId);
  if (aliasedChildId && data.children[aliasedChildId]) {
    return { kind: 'child', id: aliasedChildId, child: data.children[aliasedChildId] };
  }

  return null;
}

/**
 * Programmatically navigates to a hash route and immediately notifies all mounted `useHashRoute` and `HashRouter` listeners.
 */
export function navigateToHash(targetHash: string): void {
  if (typeof window === 'undefined') return;
  const normalized = normalizeHashString(targetHash);
  if (window.location.hash !== normalized) {
    window.location.hash = normalized;
  }
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  window.dispatchEvent(new CustomEvent<string>(CAREERPATHO_HASH_EVENT, { detail: normalized }));
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

/**
 * React hook that listens for the `hashchange` event using `window.addEventListener`
 * and guarantees a component re-render whenever the URL hash changes.
 */
export function useHashRoute(): {
  currentHash: string;
  route: ParsedHashRoute;
  navigate: (nextHash: string) => void;
} {
  const getEffectiveWindowRouteHash = (): string => {
    if (typeof window === 'undefined') return '#/';
    if (window.location.hash && window.location.hash !== '#') {
      return window.location.hash;
    }
    const pathname = window.location.pathname || '/';
    if (pathname !== '/' && pathname !== '/index.html') {
      return `#${pathname}`;
    }
    return '#/';
  };

  const [currentHash, setCurrentHash] = useState<string>(() => getEffectiveWindowRouteHash());

  const syncHashFromWindow = useCallback((overrideHash?: string) => {
    if (typeof window === 'undefined') return;
    const raw = typeof overrideHash === 'string' ? overrideHash : getEffectiveWindowRouteHash();
    const stripped = raw.replace(/^#+/, '');
    if (IN_PAGE_ANCHORS.has(stripped)) {
      return;
    }
    const nextHash = raw || '#/';
    setCurrentHash(nextHash);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => syncHashFromWindow(getEffectiveWindowRouteHash());
    const handlePopState = () => syncHashFromWindow(getEffectiveWindowRouteHash());
    const handleCustomHash = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      syncHashFromWindow(detail || getEffectiveWindowRouteHash());
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const hrefAttr = anchor.getAttribute('href') || '';
      if (!hrefAttr.startsWith('#/')) return;

      e.preventDefault();
      navigateToHash(hrefAttr);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener(CAREERPATHO_HASH_EVENT, handleCustomHash);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(CAREERPATHO_HASH_EVENT, handleCustomHash);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [syncHashFromWindow]);

  const route = parseHashRoute(currentHash);

  return {
    currentHash,
    route,
    navigate: navigateToHash,
  };
}
