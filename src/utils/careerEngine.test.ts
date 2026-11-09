import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_CAREERS_DATA } from '../data/careersAll';
import {
  computeSalaryTrajectory,
  parseNaturalCareerQuery,
  runSmartCareerMatcher,
  generateOfflineMentorResponse,
  scoreCareerFuzzyMatch,
  searchCareers,
  calculateDropYearCost,
  estimateSmartSalaryProjection,
  t,
  tr,
} from './careerEngine';

test('INITIAL_CAREERS_DATA has exactly 395 verified child careers across 10 categories including p-agri-sustainability', () => {
  const children = Object.values(INITIAL_CAREERS_DATA.children);
  const parents = Object.values(INITIAL_CAREERS_DATA.parents);
  assert.equal(children.length, 395, `Expected exactly 395 child careers, found ${children.length}`);
  assert.ok(parents.length >= 13, `Expected at least 13 parent pathway hubs, found ${parents.length}`);
  assert.ok(INITIAL_CAREERS_DATA.parents['p-agri-sustainability'], 'p-agri-sustainability parent hub must exist');
  assert.ok(INITIAL_CAREERS_DATA.parents['p-agri-sustainability'].children.length >= 22, 'p-agri-sustainability must have at least 22 careers');

  for (const child of children) {
    assert.ok(child.parentId, `Child ${child.id} is missing parentId`);
    const parent = INITIAL_CAREERS_DATA.parents[child.parentId];
    assert.ok(parent, `Child ${child.id} points to non-existent parent ${child.parentId}`);
    assert.ok(
      parent.children.includes(child.id),
      `Parent ${parent.id} does not include child ${child.id}`
    );
    assert.ok(child.jobRoles && child.jobRoles.length >= 2, `Child ${child.id} must have jobRoles`);
    assert.equal(child.sarkariEligible, true, `Child ${child.id} must have sarkariEligible=true`);
    assert.equal(
      child.sarkariEligibility,
      '[✅ Eligible for UPSC/SSC/Bank PO]',
      `Child ${child.id} must have sarkariEligibility`
    );
    assert.ok(child.formalDesignation && child.formalDesignation.length > 3, `Child ${child.id} must have formalDesignation`);
  }
});

test('Fuzzy search scoring finds B.Tech CSE for B.tech, btech, and B.Tech CSE queries', () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  assert.ok(cse);
  assert.ok(scoreCareerFuzzyMatch(cse, 'B.tech') >= 70);
  assert.ok(scoreCareerFuzzyMatch(cse, 'btech') >= 70);
  assert.ok(scoreCareerFuzzyMatch(cse, 'B.Tech CSE') >= 72);

  const results = searchCareers(INITIAL_CAREERS_DATA, 'btech cse', 'en');
  assert.ok(results.length > 0);
  assert.equal(results[0].id, 'btech-cse');
});

test('7-language helper t() and tr() support English, Hindi, Tamil, Telugu, Bengali, Marathi, and Gujarati', () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  assert.ok(t(cse, 'duration', 'ta').includes('ஆண்டுகள்'));
  assert.ok(t(cse, 'duration', 'te').includes('సంవత్సరాలు'));
  assert.ok(t(cse, 'duration', 'bn').includes('বছর'));
  assert.ok(t(cse, 'duration', 'mr').includes('वर्षे'));
  assert.ok(t(cse, 'duration', 'gu').includes('વર્ષ'));
  assert.equal(tr('ta', 'Generate Reality Card', 'रियलिटी कार्ड बनाएं'), 'ரியாலிட்டி கார்டு உருவாக்கு');
});

test('estimateSmartSalaryProjection computes tailored CTC vs Actual In-Hand across stream, city, and experience', () => {
  const fresherTech = estimateSmartSalaryProjection('pcm-tech', 'tier1-tech', 'fresher');
  const seniorTech = estimateSmartSalaryProjection('pcm-tech', 'tier1-tech', 'senior');
  assert.ok(fresherTech.grossCtcLpa > 8);
  assert.ok(fresherTech.actualMonthlyInHandInr > 40000);
  assert.ok(fresherTech.actualMonthlyInHandInr < fresherTech.grossMonthlyInr);
  assert.ok(seniorTech.actualMonthlyInHandInr > fresherTech.actualMonthlyInHandInr * 2);
});

test('calculateDropYearCost computes total financial loss accurately', () => {
  const drop = calculateDropYearCost(1.5, 6.0, 0.8);
  assert.equal(drop.totalLossLakhs, 8.3);
  assert.ok(drop.summaryEn.includes('₹8.3 Lakhs'));
});

test('computeSalaryTrajectory produces 5 monotonically increasing career compensation stages', () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  assert.ok(cse, 'btech-cse should exist');
  const trajectory = computeSalaryTrajectory(cse);
  assert.equal(trajectory.points.length, 5);

  for (let i = 0; i < trajectory.points.length; i++) {
    const pt = trajectory.points[i];
    assert.ok(pt.conservativeLpa < pt.medianLpa, `Stage ${pt.stage}: conservative < median`);
    assert.ok(pt.medianLpa < pt.topTierLpa, `Stage ${pt.stage}: median < topTier`);
    assert.ok(pt.monthlyInHandInr > 15000, `Stage ${pt.stage}: monthlyInHandInr should be realistic`);
    if (i > 0) {
      assert.ok(
        pt.medianLpa > trajectory.points[i - 1].medianLpa,
        `Stage ${pt.stage} median (${pt.medianLpa}) should exceed previous stage (${trajectory.points[i - 1].medianLpa})`
      );
    }
  }
});

test('parseNaturalCareerQuery and runSmartCareerMatcher work deterministically with zero APIs', () => {
  const parsed = parseNaturalCareerQuery(
    'I love coding and math, PCM student with low budget under 3 lakhs wanting high salary'
  );
  assert.ok(parsed.talents?.includes('coding'));
  assert.equal(parsed.stream, 'PCM');
  assert.equal(parsed.budgetMaxLakhs, 3);
  assert.equal(parsed.workStyle, 'corporate');

  const matches = runSmartCareerMatcher(INITIAL_CAREERS_DATA, {
    talents: ['healthcare'],
    stream: 'PCB',
    boardPercentBucket: '75-90',
    budgetMaxLakhs: 10,
    workStyle: 'any',
  });
  assert.ok(matches.length > 10);
  assert.ok(matches[0].matchScore >= matches[1].matchScore);

  const mbbs = INITIAL_CAREERS_DATA.children['mbbs-clinical'];
  const mentorEn = generateOfflineMentorResponse(mbbs, 'What is the in-hand salary?', 'en');
  assert.ok(mentorEn.includes('LPA'));
});

test('sortCareerListItems sorts by Alphabetical, Salary High-to-Low, and Newly Added accurately', async () => {
  const { sortCareerListItems } = await import('./careerEngine');
  const sampleItems = [
    {
      id: 'c-zeta',
      title: 'Zeta Career',
      titleHindi: 'ज़ेटा करियर',
      oneLineDesc: 'Desc Z',
      oneLineDescHindi: 'विवरण Z',
      duration: '4 Years',
      salaryRange: 'PLFS median ₹3.0 LPA at entry.',
      sourceTag: 'Source: PLFS, 2025 · Last verified: Nov 2026',
      cost: '₹2L',
      category: 'Engineering & Tech' as const,
      rawCategory: 'engineering',
      streams: ['PCM'],
      dataVerified: true,
      icon: 'tech',
      entrySalaryLakhs: 3.0,
      addedOrder: 10,
    },
    {
      id: 'c-alpha',
      title: 'Alpha Career',
      titleHindi: 'अल्फा करियर',
      oneLineDesc: 'Desc A',
      oneLineDescHindi: 'विवरण A',
      duration: '5 Years',
      salaryRange: 'NIRF median ₹16-20 LPA.',
      sourceTag: 'Source: NIRF, 2025 · Last verified: Nov 2026',
      cost: '₹10L',
      category: 'Law & Government' as const,
      rawCategory: 'law',
      streams: ['Any stream'],
      dataVerified: true,
      icon: 'law',
      entrySalaryLakhs: 16.0,
      addedOrder: 50,
    },
    {
      id: 'c-beta',
      title: 'Beta Career',
      titleHindi: 'बीटा करियर',
      oneLineDesc: 'Desc B',
      oneLineDescHindi: 'विवरण B',
      duration: '4 Years',
      salaryRange: 'ICAI campus average ₹12.88 LPA.',
      sourceTag: 'Source: ICAI, 2025 · Last verified: Nov 2026',
      cost: '₹85k',
      category: 'Commerce & Business' as const,
      rawCategory: 'commerce',
      streams: ['Commerce'],
      dataVerified: true,
      icon: 'commerce',
      entrySalaryLakhs: 12.88,
      addedOrder: 250,
    },
  ];

  const alphaSorted = sortCareerListItems(sampleItems, 'alphabetical');
  assert.deepEqual(
    alphaSorted.map((i) => i.title),
    ['Alpha Career', 'Beta Career', 'Zeta Career']
  );

  const salarySorted = sortCareerListItems(sampleItems, 'salary-high');
  assert.deepEqual(
    salarySorted.map((i) => i.id),
    ['c-alpha', 'c-beta', 'c-zeta']
  );

  const newlySorted = sortCareerListItems(sampleItems, 'newly-added');
  assert.deepEqual(
    newlySorted.map((i) => i.id),
    ['c-beta', 'c-alpha', 'c-zeta']
  );
});

test('Verified careers in INITIAL_CAREERS_DATA contain accurate PLFS/NIRF/NMC/ICAI ranges and Last verified: 11 Nov 2026 citations, and all 395 careers have 11 Nov 2026 bulletins', () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  const mbbs = INITIAL_CAREERS_DATA.children['mbbs-clinical'];
  const ca = INITIAL_CAREERS_DATA.children['ca-audit'];

  assert.ok(cse.salaryInr?.entry.includes('PLFS median ₹3.0 LPA'));
  assert.ok(cse.sourceCitation?.includes('Last verified: 11 Nov 2026'));
  assert.ok(mbbs.salaryInr?.entry.includes('₹80,000-1.1 lakh/month'));
  assert.ok(mbbs.sourceCitation?.includes('Last verified: 11 Nov 2026'));
  assert.ok(ca.salaryInr?.entry.includes('₹12.88 LPA'));
  assert.ok(ca.sourceCitation?.includes('Last verified: 11 Nov 2026'));

  for (const child of Object.values(INITIAL_CAREERS_DATA.children)) {
    assert.equal(child.lastVerified, '2026-11-11', `Child ${child.id} must have lastVerified === 2026-11-11`);
    assert.ok(
      child.nov11Update && child.nov11Update.includes('11 Nov 2026'),
      `Child ${child.id} must have a 11 Nov 2026 bulletin`
    );
  }
  for (const parent of Object.values(INITIAL_CAREERS_DATA.parents)) {
    assert.equal(parent.lastVerified, '2026-11-11', `Parent ${parent.id} must have lastVerified === 2026-11-11`);
  }
});

test('Phase 2: Regional localization adapts both headings and body paragraphs across all 7 languages (en, hi, ta, te, bn, mr, gu)', async () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  const regionalLangs = ['hi', 'ta', 'te', 'bn', 'mr', 'gu'] as const;

  for (const lang of regionalLangs) {
    const titleLoc = t(cse, 'title', lang);
    const overviewLoc = t(cse, 'overview', lang);
    assert.ok(titleLoc && titleLoc.length > 0, `Title should be non-empty for ${lang}`);
    assert.ok(overviewLoc && overviewLoc.length > 20, `Overview should be non-empty for ${lang}`);
    assert.notEqual(
      overviewLoc,
      cse.overview,
      `Overview body text in ${lang} must be localized and not raw English`
    );

    const sampleBody = tr(
      lang,
      'This career has strong demand and verified government college fees.',
      'इस करियर में अच्छी मांग है और सरकारी कॉलेज की फीस सत्यापित है।'
    );
    assert.notEqual(
      sampleBody,
      'This career has strong demand and verified government college fees.',
      `tr() body text in ${lang} must not fall back to raw English`
    );
  }

  const { PHASE_2_DEFERRED_BACKLOG } = await import('../data/officialSourceRegister');
  assert.ok(PHASE_2_DEFERRED_BACKLOG.length >= 5);
  for (const item of PHASE_2_DEFERRED_BACKLOG) {
    assert.ok(
      item.description.includes('RESOLVED IN PHASE 2'),
      `Backlog item ${item.id} should be marked RESOLVED IN PHASE 2`
    );
  }
});


