export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  explanation: string;
  hint?: string;
  isCompleted?: boolean;
}

export interface LessonChallenge {
  id: string;
  title: string;
  description: string;
  hint?: string;
  solutionExplanation: string;
}

export interface Lesson {
  id: string;
  number: string;
  title: string;
  category: 'crypto' | 'blocks' | 'chain';
  estimatedMinutes: number;
  objective: string;
  background: string;
  steps: LessonStep[];
  challenge: LessonChallenge;
}
