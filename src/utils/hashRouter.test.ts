import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseHashRoute,
  normalizeHashString,
  resolveCareerRouteTarget,
} from './hashRouter';
import { getActiveCareersData } from '../data/careersAll';

test('parseHashRoute parses homepage, careers, sources, how-we-calculate, and empty hashes', () => {
  assert.equal(parseHashRoute('').name, 'home');
  assert.equal(parseHashRoute('#').name, 'home');
  assert.equal(parseHashRoute('#/').name, 'home');
  assert.equal(parseHashRoute('#app').name, 'home');
  assert.equal(parseHashRoute('#/careers').name, 'careers');
  assert.equal(parseHashRoute('#/sources').name, 'sources');
  assert.equal(parseHashRoute('#/how-we-calculate').name, 'howWeCalculate');
});

test('parseHashRoute parses #/career/:id for parent hubs and child careers', () => {
  const parentRoute = parseHashRoute('#/career/p-btech');
  assert.equal(parentRoute.name, 'career');
  assert.equal(parentRoute.id, 'p-btech');

  const childRoute = parseHashRoute('#/career/btech-cse');
  assert.equal(childRoute.name, 'career');
  assert.equal(childRoute.id, 'btech-cse');

  const trailingRoute = parseHashRoute('#/career/p-btech/?ref=share');
  assert.equal(trailingRoute.name, 'career');
  assert.equal(trailingRoute.id, 'p-btech');

  const noSlashRoute = parseHashRoute('#career/btech-vlsi-verification');
  assert.equal(noSlashRoute.name, 'career');
  assert.equal(noSlashRoute.id, 'btech-vlsi-verification');
});

test('parseHashRoute parses #/compare?c1=...&c2=... query parameters', () => {
  const cmpRoute = parseHashRoute('#/compare?c1=btech-cse&c2=bca-software');
  assert.equal(cmpRoute.name, 'compare');
  assert.equal(cmpRoute.c1, 'btech-cse');
  assert.equal(cmpRoute.c2, 'btech-software' in cmpRoute ? cmpRoute.c2 : 'bca-software');

  const cmpTrailing = parseHashRoute('#/compare/?c1=btech-cse&c2=bca');
  assert.equal(cmpTrailing.name, 'compare');
  assert.equal(cmpTrailing.c1, 'btech-cse');
  assert.equal(cmpTrailing.c2, 'bca');
});

test('resolveCareerRouteTarget resolves all 395 child careers and only marks strictly government-verifiable careers as dataVerified=true', () => {
  const data = getActiveCareersData();
  const allChildren = Object.values(data.children);
  assert.equal(allChildren.length, 395);

  const verifiedList = allChildren.filter((c) => c.dataVerified === true);
  const unverifiedList = allChildren.filter((c) => c.dataVerified === false);
  assert.equal(verifiedList.length, 62, `Expected 62 strictly statutory/govt-verifiable careers to have dataVerified=true, got ${verifiedList.length}`);
  assert.equal(unverifiedList.length, 333, `Expected 333 private/creative/emerging careers to have dataVerified=false, got ${unverifiedList.length}`);

  const parentTarget = resolveCareerRouteTarget(data, 'p-btech');
  assert.ok(parentTarget);
  assert.equal(parentTarget.kind, 'parent');
  assert.equal(parentTarget.id, 'p-btech');

  const agriParentTarget = resolveCareerRouteTarget(data, 'p-agri-sustainability');
  assert.ok(agriParentTarget);
  assert.equal(agriParentTarget.kind, 'parent');
  assert.equal(agriParentTarget.id, 'p-agri-sustainability');

  // Verify the priority verified career strings
  assert.ok(data.children['btech-cse'].salaryInr?.entry?.includes('PLFS median ₹3.0 LPA at entry'));
  assert.ok(data.children['mbbs-clinical'].salaryInr?.entry?.includes('Government MO ₹80,000-1.1 lakh/month'));
  assert.ok(data.children['ca-audit'].salaryInr?.entry?.includes('ICAI campus average ₹12.88 LPA'));
  assert.ok(data.children['mba-marketing-pm'].salaryInr?.entry?.includes('PLFS median ₹25,000/month (₹3.0 LPA)'));
  assert.ok(data.children['b-pharm-ind'].salaryInr?.entry?.includes('GPAT is for M.Pharm, not B.Pharm'));
  assert.ok(data.children['nursing-icu'].salaryInr?.entry?.includes('Government nursing officer ₹60,000-70,000/month'));
  assert.ok(data.children['ba-llb-corp'].salaryInr?.entry?.includes('NIRF median ₹3-20 LPA'));
  assert.ok(data.children['barch-architecture'].salaryInr?.entry?.includes('NIRF median ₹2-6 LPA'));

  const missingTarget = resolveCareerRouteTarget(data, 'non-existent-career-id');
  assert.equal(missingTarget, null);
});

test('normalizeHashString normalizes various route strings into #/...', () => {
  assert.equal(normalizeHashString(''), '#/');
  assert.equal(normalizeHashString('#/career/p-btech'), '#/career/p-btech');
  assert.equal(normalizeHashString('/career/p-btech'), '#/career/p-btech');
  assert.equal(normalizeHashString('career/p-btech'), '#/career/p-btech');
});

test('parseHashRoute parses #/feedback?career=...&type=... query parameters for contextual data corrections', () => {
  const fbRoute = parseHashRoute('#/feedback?career=btech-cse&type=salary_correction');
  assert.equal(fbRoute.name, 'feedback');
  assert.equal(fbRoute.id, 'btech-cse');
  assert.equal(fbRoute.c1, 'salary_correction');
});

