import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  QUIZ_DATA,
  CAREER_CATEGORIES_MAPPING,
  ASSESSMENT_METHODOLOGY_RUBRIC,
  calculateCareerAssessmentResult,
  getTheoreticalMaxForCategory,
  QuizAnswerValue,
} from './careerAssessmentEngine';

describe('25-Question Multi-Modal Career Assessment Engine & Calculator', () => {
  it('contains exactly 25 questions spanning all 5 mobile-friendly question types including sliders', () => {
    assert.equal(QUIZ_DATA.length, 25);
    assert.equal(Object.keys(CAREER_CATEGORIES_MAPPING).length, 6);
    assert.ok(ASSESSMENT_METHODOLOGY_RUBRIC.length >= 4);

    const typeCounts: Record<string, number> = {};
    for (const q of QUIZ_DATA) {
      typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
      assert.ok(q.questionEn.length > 15);
      assert.ok(q.questionHi.length > 10);
      assert.ok(q.questionWeight >= 1.0 && q.questionWeight <= 2.0);
      assert.ok(q.sourceIds.length >= 1);
    }

    assert.equal(typeCounts['single-choice'], 8);
    assert.equal(typeCounts['slider'], 6);
    assert.equal(typeCounts['likert-scale'], 5);
    assert.equal(typeCounts['multi-select'], 3);
    assert.equal(typeCounts['tradeoff-pair'], 3);
  });

  it('contains zero legacy Greek-letter scoring terminology in questions, rubrics, or category mappings', () => {
    const forbiddenPattern = new RegExp('sig' + 'ma', 'i');
    const serialized = JSON.stringify({
      QUIZ_DATA,
      CAREER_CATEGORIES_MAPPING,
      ASSESSMENT_METHODOLOGY_RUBRIC,
    });
    assert.equal(forbiddenPattern.test(serialized), false, 'Expected zero occurrences of legacy term');
  });

  it('identifies Engineering as #1 with High confidence for a coherent PCM/Tech 25-question profile', () => {
    const engineeringProfile: Record<number, QuizAnswerValue> = {
      1: 'q1-pcm',
      2: 'q2-code',
      3: 'q3-techlab',
      4: 'q4-jee',
      5: 'q5-uptime',
      6: 'q6-ai',
      7: 'q7-builder',
      8: 'q8-tech-arch',
      9: 7, // 7 hrs/day slider
      10: 10, // 10/10 math comfort slider
      11: 12, // 12 Lakhs budget slider
      12: 4, // 4 years duration slider
      13: 2, // independent systems focus slider
      14: 2, // digital/lab focus slider
      15: 1, // low clinical likert
      16: 2, // low govt likert
      17: 2, // low arts likert
      18: 2, // low commerce likert
      19: 5, // 5/5 computational & hardware likert
      20: ['q20-logic'],
      21: ['q21-software'],
      22: ['q22-global'],
      23: 3,
      24: 5, // private tech upside
      25: 5, // metro/global mobility
    };

    const res = calculateCareerAssessmentResult(engineeringProfile);
    assert.equal(res.answeredCount, 25);
    assert.equal(res.top3Categories[0].category, 'Engineering');
    assert.equal(res.isFallbackTriggered, false);
    assert.equal(res.confidenceLevel, 'High');
    assert.ok(res.top3Categories[0].alignmentBandLow < res.top3Categories[0].alignmentBandHigh);
    assert.match(res.top3Categories[0].alignmentBandLabelEn, /Alignment Band/);
    const forbiddenPattern = new RegExp('sig' + 'ma', 'i');
    assert.equal(forbiddenPattern.test(JSON.stringify(res)), false);
  });

  it('identifies Medical as #1 for a coherent PCB/Clinical 25-question profile', () => {
    const medicalProfile: Record<number, QuizAnswerValue> = {
      1: 'q1-pcb',
      2: 'q2-clinical',
      3: 'q3-hospital',
      4: 'q4-neet',
      5: 'q5-patient',
      6: 'q6-bio',
      7: 'q7-care',
      8: 'q8-healer',
      9: 9,
      10: 4,
      11: 8,
      12: 7,
      13: 9,
      14: 8,
      15: 5, // 5/5 clinical patient care
      16: 2,
      17: 1,
      18: 1,
      19: 1,
      20: ['q20-bio'],
      21: ['q21-recovery'],
      22: ['q22-recession', 'q22-practice'],
      23: 5, // long specialization
      24: 2,
      25: 2,
    };

    const res = calculateCareerAssessmentResult(medicalProfile);
    assert.equal(res.answeredCount, 25);
    assert.equal(res.top3Categories[0].category, 'Medical');
    assert.equal(res.isFallbackTriggered, false);
    assert.equal(res.validationWarnings.length, 0);
  });

  it('detects contradictory inputs (PCB/Medical track + low clinical/blood comfort on Q15)', () => {
    const contradictoryMedical: Record<number, QuizAnswerValue> = {
      1: 'q1-pcb',
      2: 'q2-clinical',
      3: 'q3-hospital',
      4: 'q4-neet',
      5: 'q5-patient',
      6: 'q6-bio',
      15: 1, // Contradiction: Strongly uncomfortable with clinical/blood settings!
    };

    const res = calculateCareerAssessmentResult(contradictoryMedical);
    assert.ok(
      res.validationWarnings.some((w) => w.code === 'CONTRADICTION_PCB_LOW_CLINICAL'),
      'Expected CONTRADICTION_PCB_LOW_CLINICAL warning'
    );
  });

  it('detects contradictory inputs (PCM/Engineering track + very low math comfort on Q10)', () => {
    const contradictoryEng: Record<number, QuizAnswerValue> = {
      1: 'q1-pcm',
      2: 'q2-code',
      3: 'q3-techlab',
      4: 'q4-jee',
      10: 2, // Contradiction: 2/10 math comfort
    };

    const res = calculateCareerAssessmentResult(contradictoryEng);
    assert.ok(
      res.validationWarnings.some((w) => w.code === 'CONTRADICTION_ENGINEERING_LOW_MATH'),
      'Expected CONTRADICTION_ENGINEERING_LOW_MATH warning'
    );
  });

  it('detects flat-lining when user gives identical ratings across all Likert and Tradeoff scales', () => {
    const flatlined: Record<number, QuizAnswerValue> = {
      1: 'q1-commerce',
      15: 3,
      16: 3,
      17: 3,
      18: 3,
      19: 3,
      23: 3,
      24: 3,
      25: 3,
    };

    const res = calculateCareerAssessmentResult(flatlined);
    assert.ok(
      res.validationWarnings.some((w) => w.code === 'WARNING_UNIFORM_SCALE_RESPONSES'),
      'Expected WARNING_UNIFORM_SCALE_RESPONSES notice'
    );
  });

  it('triggers exploratory fallback when fewer than 6 questions are answered or top categories tie', () => {
    const emptyRes = calculateCareerAssessmentResult({});
    assert.equal(emptyRes.isFallbackTriggered, true);
    assert.equal(emptyRes.confidenceScore, 0);

    const partialRes = calculateCareerAssessmentResult({
      1: 'q1-pcm',
      2: 'q2-clinical',
      3: 'q3-boardroom',
      4: 'q4-clat',
      5: 'q5-deadline',
    });
    assert.equal(partialRes.isFallbackTriggered, true);
    assert.ok(partialRes.validationWarnings.some((w) => w.code === 'INCOMPLETE_ASSESSMENT'));
  });

  it('computes positive theoretical max for all 6 broad categories', () => {
    for (const cat of ['Engineering', 'Medical', 'Commerce', 'Arts', 'Government', 'Vocational'] as const) {
      const maxPts = getTheoreticalMaxForCategory(cat);
      assert.ok(maxPts > 300, `Expected theoretical max > 300 for ${cat}, got ${maxPts}`);
    }
  });
});
