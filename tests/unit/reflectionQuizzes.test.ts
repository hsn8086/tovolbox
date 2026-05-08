import { describe, expect, it } from 'vitest';
import { REFLECTION_QUIZ_DISCLAIMER, reflectionQuizzes, scoreReflectionQuiz } from '@/lib/tools/reflectionQuizzes';

const expectedQuizIds = [
  'big-five-lite',
  'work-style',
  'digital-wellbeing',
  'communication-style',
  'conflict-style',
  'learning-style',
  'career-interest',
  'productivity-style',
  'decision-making-style',
  'sleep-habit',
];

const blockedTerms = /diagnosis|clinical disorder|medical|mental illness|disease|patient|symptom/i;

describe('reflection quizzes', () => {
  it('defines self-authored non-clinical quizzes with 5-10 questions each', () => {
    expect(reflectionQuizzes.map((quiz) => quiz.id)).toEqual(expectedQuizIds);

    for (const quiz of reflectionQuizzes) {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(5);
      expect(quiz.questions.length).toBeLessThanOrEqual(10);
      expect(`${quiz.title} ${quiz.description} ${quiz.questions.map((question) => question.text).join(' ')}`).not.toMatch(
        blockedTerms,
      );
    }
  });

  it('scores every quiz with totals, dimension bands, and a disclaimer', () => {
    for (const quiz of reflectionQuizzes) {
      const answers = Object.fromEntries(quiz.questions.map((question) => [question.id, 4]));
      const result = scoreReflectionQuiz(quiz.id, answers);

      expect(result.quizId).toBe(quiz.id);
      expect(result.score).toBeGreaterThan(0);
      expect(result.maxScore).toBe(quiz.questions.length * 5);
      expect(result.dimensions.length).toBe(new Set(quiz.questions.map((question) => question.dimension)).size);
      expect(result.disclaimer).toBe(REFLECTION_QUIZ_DISCLAIMER);
      expect(result.disclaimer).toContain('personal insight');
      expect(result.disclaimer).toContain('self-reflection');
      expect(result.disclaimer).toContain('not a medical diagnosis');
      expect(`${result.summary} ${result.dimensions.map((dimension) => dimension.summary).join(' ')}`).not.toMatch(blockedTerms);
    }
  });

  it('uses neutral defaults, clamps out-of-range values, and reverses marked questions', () => {
    const quiz = reflectionQuizzes.find((item) => item.id === 'digital-wellbeing');
    expect(quiz).toBeDefined();

    const defaultResult = scoreReflectionQuiz('digital-wellbeing', {});
    expect(defaultResult.score).toBe(quiz!.questions.length * 3);

    const clampedResult = scoreReflectionQuiz('digital-wellbeing', {
      'dw-intent': 10,
      'dw-autopilot': 5,
      'dw-notifications': Number.NaN,
      'dw-offline': -2,
      'dw-sleep': 4.6,
      'dw-refresh': 4.4,
      'dw-choice': 2,
      'dw-compare': 1,
    });

    expect(clampedResult.score).toBe(26);
  });
});
