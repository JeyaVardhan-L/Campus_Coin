import { describe, it, expect } from 'vitest';
import { getAllLessons, getLessonById } from '../../src/education/registry';

describe('Education Engine: Curriculum & Challenges', () => {
  it('loads all registered lessons with complete schemas', () => {
    const lessons = getAllLessons();
    expect(lessons.length).toBeGreaterThanOrEqual(2);

    for (const lesson of lessons) {
      expect(lesson.id).toBeDefined();
      expect(lesson.title).toBeDefined();
      expect(lesson.steps.length).toBeGreaterThan(0);
      expect(lesson.challenge).toBeDefined();
      expect(lesson.challenge.solutionExplanation).toBeDefined();

      for (const step of lesson.steps) {
        expect(step.id).toBeDefined();
        expect(step.title).toBeDefined();
        expect(step.instruction).toBeDefined();
        expect(step.explanation).toBeDefined();
      }
    }
  });

  it('retrieves lessons by identifier', () => {
    const lesson1 = getLessonById('01-hashes-matter');
    expect(lesson1).toBeDefined();
    expect(lesson1?.number).toBe('01');

    const lesson2 = getLessonById('02-chain-integrity');
    expect(lesson2).toBeDefined();
    expect(lesson2?.number).toBe('02');

    const missing = getLessonById('non-existent');
    expect(missing).toBeUndefined();
  });
});
