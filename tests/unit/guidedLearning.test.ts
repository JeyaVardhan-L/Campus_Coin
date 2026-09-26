import { describe, it, expect } from 'vitest';
import { getAllLessons } from '../../src/education/registry';

describe('Guided Learning Journey Curriculum & Stages', () => {
  it('provides a structured progression across all core blockchain concepts', () => {
    const lessons = getAllLessons();
    expect(lessons.length).toBeGreaterThanOrEqual(2);

    // Stage 01: Hashes & Avalanche
    const hashLesson = lessons.find((l) => l.id === '01-hashes-matter');
    expect(hashLesson).toBeDefined();
    expect(hashLesson?.title).toContain('Hashes Matter');
    expect(hashLesson?.steps.length).toBeGreaterThanOrEqual(3);

    // Verify hashing steps reference the interactive Hash Lab
    const stepInstructions = hashLesson?.steps.map((s) => s.instruction).join(' ');
    expect(stepInstructions).toContain('Hash Lab');

    // Stage 03/04: Chain Integrity & Cascading Invalidation
    const chainLesson = lessons.find((l) => l.id === '02-chain-integrity');
    expect(chainLesson).toBeDefined();
    expect(chainLesson?.title).toContain('Block Linking');
    expect(chainLesson?.steps.length).toBeGreaterThanOrEqual(3);

    // Verify chain steps reference the interactive Blockchain Lab
    const chainStepInstructions = chainLesson?.steps.map((s) => s.instruction).join(' ');
    expect(chainStepInstructions).toContain('Blockchain Lab');
  });

  it('guarantees each lesson has an educational conceptual challenge with solution explanation', () => {
    const lessons = getAllLessons();
    for (const lesson of lessons) {
      expect(lesson.challenge).toBeDefined();
      expect(lesson.challenge.title.length).toBeGreaterThan(5);
      expect(lesson.challenge.description.length).toBeGreaterThan(15);
      expect(lesson.challenge.solutionExplanation.length).toBeGreaterThan(15);
    }
  });
});
