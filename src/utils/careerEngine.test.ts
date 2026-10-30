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
  t,
} from './careerEngine';

test('INITIAL_CAREERS_DATA has 101+ verified child careers with jobRoles, Sarkari eligibility status & badge, and authority badges', () => {
  const children = Object.values(INITIAL_CAREERS_DATA.children);
  const parents = Object.values(INITIAL_CAREERS_DATA.parents);
  assert.ok(children.length >= 101, `Expected at least 101 child careers, found ${children.length}`);
  assert.ok(parents.length >= 12, `Expected at least 12 parent pathway hubs, found ${parents.length}`);

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
      `Child ${child.id} must have sarkariEligibility='[✅ Eligible for UPSC/SSC/Bank PO]'`
    );
    assert.ok(
      child.sarkariEligibilityDetails && child.sarkariEligibilityDetails.isEligible,
      `Child ${child.id} must have sarkariEligibilityDetails`
    );
    assert.ok(child.formalDesignation && child.formalDesignation.length > 3, `Child ${child.id} must have formalDesignation`);
  }

  for (const parent of parents) {
    assert.equal(parent.sarkariEligible, true, `Parent ${parent.id} must have sarkariEligible=true`);
    assert.equal(
      parent.sarkariEligibility,
      '[✅ Eligible for UPSC/SSC/Bank PO]',
      `Parent ${parent.id} must have sarkariEligibility='[✅ Eligible for UPSC/SSC/Bank PO]'`
    );
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

test('3-way language helper t() supports English, Hinglish, and Hindi', () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  const enTag = t(cse, 'tagline', 'en');
  const hinglishTag = t(cse, 'tagline', 'hinglish');
  const hiTag = t(cse, 'tagline', 'hi');

  assert.ok(enTag.length > 10);
  assert.ok(hinglishTag.includes('fees, cutoff aur real in-hand salary dekhein'));
  assert.ok(hiTag.length > 5);
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
