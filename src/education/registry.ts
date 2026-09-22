import { Lesson } from './types';
import { hashingLesson } from './lessons/hashingLesson';
import { chainIntegrityLesson } from './lessons/chainIntegrityLesson';

export const LESSON_CATALOG: Lesson[] = [hashingLesson, chainIntegrityLesson];

export function getAllLessons(): Lesson[] {
  return LESSON_CATALOG;
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSON_CATALOG.find((l) => l.id === id);
}
