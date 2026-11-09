import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_CAREERS_DATA } from '../data/careersAll';
import {
  buildIndividualCareerQuestions,
  evaluateCareerCapability,
  buildPlainLanguageCareerGuide,
} from './individualCareerTestEngine';

test('buildIndividualCareerQuestions generates 7 career-specific questions that differ per career', () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  const mbbs = INITIAL_CAREERS_DATA.children['mbbs-clinical'];
  const ca = INITIAL_CAREERS_DATA.children['ca-audit'];

  assert.ok(cse, 'btech-cse must exist');
  assert.ok(mbbs, 'mbbs-clinical must exist');
  assert.ok(ca, 'ca-audit must exist');

  const cseQuestions = buildIndividualCareerQuestions(cse);
  const mbbsQuestions = buildIndividualCareerQuestions(mbbs);
  const caQuestions = buildIndividualCareerQuestions(ca);

  assert.equal(cseQuestions.length, 7);
  assert.equal(mbbsQuestions.length, 7);
  assert.equal(caQuestions.length, 7);

  // Questions must be unique to each career
  assert.notEqual(cseQuestions[0].questionEn, mbbsQuestions[0].questionEn);
  assert.notEqual(cseQuestions[4].questionEn, mbbsQuestions[4].questionEn);
  assert.notEqual(mbbsQuestions[4].questionEn, caQuestions[4].questionEn);

  // B.Tech CSE scenario mentions code/bug/users
  assert.match(cseQuestions[4].questionEn, /code|bug|app/i);
  // MBBS scenario mentions patient/hospital
  assert.match(mbbsQuestions[4].questionEn, /patient|hospital/i);
  // CA scenario mentions balance sheet/audit
  assert.match(caQuestions[4].questionEn, /balance sheet|audit/i);
});

test('evaluateCareerCapability produces CAPABLE_STRONG, CAPABLE_CONDITIONAL, and RECONSIDER_ALTERNATIVE verdicts accurately', () => {
  const cse = INITIAL_CAREERS_DATA.children['btech-cse'];
  const questions = buildIndividualCareerQuestions(cse);

  // 1. All top options -> CAPABLE_STRONG
  const strongAnswers: Record<string, string> = {};
  for (const q of questions) {
    strongAnswers[q.id] = q.options[0].id;
  }
  const strongVerdict = evaluateCareerCapability(cse, strongAnswers);
  assert.equal(strongVerdict.verdictTier, 'CAPABLE_STRONG');
  assert.ok(strongVerdict.scorePct >= 90);
  assert.equal(strongVerdict.actionPlanEn.length, 3);

  // 2. Mixed middle options -> CAPABLE_CONDITIONAL
  const conditionalAnswers: Record<string, string> = {};
  questions.forEach((q, idx) => {
    conditionalAnswers[q.id] = idx % 2 === 0 ? q.options[1].id : q.options[0].id;
  });
  const conditionalVerdict = evaluateCareerCapability(cse, conditionalAnswers);
  assert.ok(
    conditionalVerdict.verdictTier === 'CAPABLE_STRONG' ||
      conditionalVerdict.verdictTier === 'CAPABLE_CONDITIONAL'
  );
  assert.ok(conditionalVerdict.scorePct >= 65);

  // 3. All lowest options -> RECONSIDER_ALTERNATIVE
  const lowAnswers: Record<string, string> = {};
  for (const q of questions) {
    lowAnswers[q.id] = q.options[q.options.length - 1].id;
  }
  const lowVerdict = evaluateCareerCapability(cse, lowAnswers);
  assert.equal(lowVerdict.verdictTier, 'RECONSIDER_ALTERNATIVE');
  assert.ok(lowVerdict.scorePct <= 45);
  assert.ok(lowVerdict.gapsToFixEn.length > 0);
});

test('all 395 careers have at least 6 diverse job roles and only strictly government-verifiable tracks carry dataVerified=true', () => {
  const allCareers = Object.values(INITIAL_CAREERS_DATA.children);
  assert.equal(allCareers.length, 395, `Expected 395 careers, got ${allCareers.length}`);

  const verifiedCount = allCareers.filter((c) => c.dataVerified === true).length;
  const unverifiedCount = allCareers.filter((c) => c.dataVerified === false).length;
  assert.equal(verifiedCount, 62);
  assert.equal(unverifiedCount, 333);

  for (const career of allCareers) {
    assert.equal(typeof career.dataVerified, 'boolean', `${career.id} should have boolean dataVerified`);
    assert.ok(
      career.salaryInr?.entry && !career.salaryInr.entry.includes('Not officially verified'),
      `${career.id} should have entry salary text`
    );
    assert.ok(
      career.sourceCitation &&
        (career.sourceCitation.includes('Source:') ||
          career.sourceCitation.includes('Unverified Market Estimate') ||
          career.sourceCitation.includes('Indicative Market Estimate')),
      `${career.id} should have sourceCitation`
    );
    assert.ok(
      career.jobRoles && career.jobRoles.length >= 6,
      `${career.id} should have at least 6 diverse job roles, got ${career.jobRoles?.length}`
    );

    const guide = buildPlainLanguageCareerGuide(career);
    assert.ok(guide.whatIsItEn.length > 20);
    assert.ok(guide.moneyTruthEn.length > 20);
  }
});

test('careers250.json is a valid CareerListItem[] array of 395 entries with honest verification flags (62 verified, 333 unverified)', async () => {
  const fs = await import('node:fs');
  const rawJson = fs.readFileSync('./src/data/careers250.json', 'utf8');
  const parsed = JSON.parse(rawJson);
  assert.ok(Array.isArray(parsed), 'careers250.json must be an Array for CareersListPage.tsx');
  assert.equal(parsed.length, 395, 'careers250.json must contain 395 items');
  const verifiedInJson = parsed.filter((item: { dataVerified: boolean }) => item.dataVerified === true).length;
  const unverifiedInJson = parsed.filter((item: { dataVerified: boolean }) => item.dataVerified === false).length;
  assert.equal(verifiedInJson, 62);
  assert.equal(unverifiedInJson, 333);
  for (const item of parsed) {
    assert.equal(typeof item.dataVerified, 'boolean');
    assert.ok(item.salaryRange && !item.salaryRange.includes('Not officially verified'));
    assert.ok(
      item.sourceTag &&
        (item.sourceTag.includes('Source:') ||
          item.sourceTag.includes('Unverified Market Estimate') ||
          item.sourceTag.includes('Indicative Market Estimate'))
    );
    assert.ok(Array.isArray(item.streams) && item.streams.length > 0);
  }
});

