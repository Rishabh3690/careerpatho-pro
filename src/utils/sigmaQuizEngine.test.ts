import test from 'node:test';
import assert from 'node:assert/strict';
import {
  QUIZ_DATA,
  CAREER_CATEGORIES_MAPPING,
  calculateCareerMatch,
  BroadCareerCategory,
} from './sigmaQuizEngine';
import { getActiveCareersData } from '../data/careersAll';

test('QUIZ_DATA contains exactly 10 bilingual questions covering all 10 required traits', () => {
  assert.equal(QUIZ_DATA.length, 10);
  const expectedTraits = [
    'stream_background',
    'work_style',
    'math_logic',
    'people_interaction',
    'risk_appetite',
    'time_horizon',
    'budget_constraints',
    'subject_interest',
    'problem_solving_style',
    'ultimate_goal',
  ];

  QUIZ_DATA.forEach((q, idx) => {
    assert.equal(q.id, idx + 1);
    assert.equal(q.traitKey, expectedTraits[idx]);
    assert.ok(q.questionEn.length > 10, `Question ${q.id} English text must be non-empty`);
    assert.ok(q.questionHi.length > 10, `Question ${q.id} Hindi text must be non-empty`);
    assert.ok(q.options.length >= 4, `Question ${q.id} must have at least 4 options`);
    q.options.forEach((opt) => {
      assert.ok(opt.id.length > 0);
      assert.ok(opt.textEn.length > 5);
      assert.ok(opt.textHi.length > 5);
      assert.ok(Object.keys(opt.weights).length > 0);
    });
  });
});

test('CAREER_CATEGORIES_MAPPING covers all 6 broad categories with valid career IDs', () => {
  const db = getActiveCareersData();
  const categories: BroadCareerCategory[] = [
    'Engineering',
    'Medical',
    'Commerce',
    'Arts',
    'Government',
    'Vocational',
  ];

  for (const cat of categories) {
    const info = CAREER_CATEGORIES_MAPPING[cat];
    assert.ok(info, `Missing mapping for ${cat}`);
    assert.ok(info.titleEn.length > 0);
    assert.ok(info.titleHi.length > 0);
    assert.ok(info.featuredCareerIds.length >= 4);
    for (const cid of info.featuredCareerIds) {
      assert.ok(db.children[cid], `Featured career ID ${cid} in ${cat} must exist in CareersDatabase`);
    }
  }
});

test('calculateCareerMatch returns Engineering as #1 with High Confidence and estimates bestCareerMatch for a PCM Tech student', () => {
  const db = getActiveCareersData();
  const answers = {
    1: 'q1_pcm',
    2: 'q2_desk',
    3: 'q3_love_math',
    4: 'q4_introvert',
    5: 'q5_mnc_growth',
    6: 'q6_standard',
    7: 'q7_moderate_roi',
    8: 'q8_code_machines',
    9: 'q9_logical_system',
    10: 'q10_innovation',
  };

  const result = calculateCareerMatch(answers, db);
  assert.equal(result.answeredCount, 10);
  assert.equal(result.top3Categories.length, 3);
  assert.equal(result.top3Categories[0].category, 'Engineering');
  assert.equal(result.isFallbackTriggered, false);
  assert.ok(result.confidenceScore >= 75, `Expected high confidence >= 75, got ${result.confidenceScore}`);
  assert.ok(result.recommendedCareers.length > 0);
  assert.ok(result.bestCareerMatch, 'Expected bestCareerMatch to be populated');
  assert.equal(result.bestCareerMatch?.id, 'btech-cse');
  assert.ok((result.bestCareerMatchScore || 0) >= 80);
  assert.ok(result.bestCareerReasonEn?.includes('[✅ Eligible for UPSC/SSC/Bank PO]'));
});

test('calculateCareerMatch returns Medical as #1 with High Confidence for a PCB Healthcare student', () => {
  const db = getActiveCareersData();
  const answers = {
    1: 'q1_pcb',
    2: 'q2_lab',
    3: 'q3_basic_math',
    4: 'q4_helping',
    5: 'q5_mnc_growth',
    6: 'q6_long',
    7: 'q7_flexible',
    8: 'q8_human_body',
    9: 'q9_logical_system',
    10: 'q10_service',
  };

  const result = calculateCareerMatch(answers, db);
  assert.equal(result.top3Categories[0].category, 'Medical');
  assert.equal(result.isFallbackTriggered, false);
  assert.ok(result.confidenceScore >= 70);
  assert.equal(result.bestCareerMatch?.id, 'mbbs-clinical');
});

test('calculateCareerMatch triggers Fallback when top1 score is too close to top2 score', () => {
  const mixedAnswers = {
    1: 'q1_commerce',       // Commerce 30, Govt 12
    2: 'q2_field',          // Govt 26, Vocational 20
    3: 'q3_business_math',  // Commerce 26, Govt 14
    4: 'q4_public',         // Govt 28, Arts 18
    5: 'q5_startup_practice', // Commerce 24, Arts 22
    6: 'q6_medium',         // Commerce 22, Arts 22, Govt 22
    7: 'q7_ultra_low',      // Govt 22, Vocational 24, Commerce 18
    8: 'q8_law_polity',     // Govt 28, Arts 20
    9: 'q9_structured_rules', // Govt 24, Commerce 24
    10: 'q10_wealth',       // Commerce 26, Engineering 24
  };

  const result = calculateCareerMatch(mixedAnswers);
  assert.equal(result.isFallbackTriggered, true);
  assert.equal(result.confidenceLevel, 'Low-Fallback');
  assert.ok(result.fallbackReasonEn?.includes("We're not sure, let's look at all options"));
  assert.ok(result.fallbackReasonHi?.includes('हम पूरी तरह निश्चित नहीं हैं'));
});

test('calculateCareerMatch triggers Fallback when total points / answered questions are too low', () => {
  const partialAnswers = {
    1: 'q1_pcm',
    2: 'q2_desk',
  };
  const result = calculateCareerMatch(partialAnswers);
  assert.equal(result.answeredCount, 2);
  assert.equal(result.isFallbackTriggered, true);
  assert.ok(result.fallbackReasonEn?.includes("We're not sure, let's look at all options"));
});
