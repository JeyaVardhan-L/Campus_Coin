import React, { useState } from 'react';
import { LESSON_CATALOG } from '../../education/registry';
import { Lesson, LessonStep } from '../../education/types';
import { LabTab } from '../../App';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Lightbulb,
  Award,
  ArrowUpRight,
} from 'lucide-react';

interface LessonRunnerProps {
  onNavigateTab: (tab: LabTab) => void;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({ onNavigateTab }) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSON_CATALOG[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const activeLesson: Lesson =
    LESSON_CATALOG.find((l) => l.id === activeLessonId) || LESSON_CATALOG[0];
  const currentStep: LessonStep = activeLesson.steps[currentStepIndex];

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentStepIndex(0);
    setShowHint(false);
    setShowSolution(false);
  };

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const isStepDone = (stepId: string) => !!completedSteps[stepId];

  const lessonCompletedCount = activeLesson.steps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((lessonCompletedCount / activeLesson.steps.length) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '24px' }}>
      {/* Sidebar: Lesson List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={18} className="text-cyan" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Curriculum Units</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {LESSON_CATALOG.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              const completedCount = lesson.steps.filter((s) => completedSteps[s.id]).length;
              const isFullyDone = completedCount === lesson.steps.length;

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    background: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-card)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-cyan)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Lesson {lesson.number} • {lesson.category}
                    </span>
                    {isFullyDone && <CheckCircle2 size={14} className="text-emerald" />}
                  </div>

                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    {lesson.title}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {completedCount}/{lesson.steps.length} steps completed
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Lab Links */}
        <div className="card" style={{ padding: '16px' }}>
          <span className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
            Jump to Sandbox
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => onNavigateTab('hash')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}
            >
              Open Hash Lab <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => onNavigateTab('block')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}
            >
              Open Block Lab <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => onNavigateTab('blockchain')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}
            >
              Open Blockchain Lab <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Lesson Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Lesson Header Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-cyan">Lesson {activeLesson.number}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Est. time: {activeLesson.estimatedMinutes} minutes
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeLesson.title}</h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {progressPercent}%
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {activeLesson.objective}
          </p>

          <div
            style={{
              marginTop: '14px',
              padding: '12px',
              background: 'rgba(6, 9, 15, 0.6)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              borderLeft: '2px solid var(--accent-cyan)',
            }}
          >
            {activeLesson.background}
          </div>
        </div>

        {/* Step-by-Step Interactive Guide */}
        <div className="card" style={{ border: '1px solid var(--border-medium)' }}>
          {/* Step tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {activeLesson.steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setShowHint(false);
                  }}
                  className={`btn ${currentStepIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Step {idx + 1}
                  {isStepDone(step.id) && <CheckCircle2 size={12} className="text-emerald" />}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                disabled={currentStepIndex === 0}
                onClick={() => {
                  setCurrentStepIndex((prev) => prev - 1);
                  setShowHint(false);
                }}
                className="btn btn-secondary"
                style={{ padding: '4px 8px' }}
                title="Previous step"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentStepIndex === activeLesson.steps.length - 1}
                onClick={() => {
                  setCurrentStepIndex((prev) => prev + 1);
                  setShowHint(false);
                }}
                className="btn btn-secondary"
                style={{ padding: '4px 8px' }}
                title="Next step"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Current Step Instruction */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span className="input-label" style={{ color: 'var(--accent-cyan)' }}>
                Step {currentStepIndex + 1} of {activeLesson.steps.length}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2px' }}>
                {currentStep.title}
              </h3>
            </div>

            <div
              style={{
                padding: '14px 16px',
                background: 'rgba(0, 240, 255, 0.05)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 500,
              }}
            >
              👉 <strong>Action:</strong> {currentStep.instruction}
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {currentStep.explanation}
            </div>

            {/* Hint Box */}
            {currentStep.hint && (
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '4px 10px', gap: '6px' }}
                >
                  <Lightbulb size={13} className="text-amber" />
                  {showHint ? 'Hide Hint' : 'Need a hint?'}
                </button>

                {showHint && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '10px 14px',
                      background: 'rgba(245, 158, 11, 0.06)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    💡 {currentStep.hint}
                  </div>
                )}
              </div>
            )}

            {/* Checkpoint Completed Button */}
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
              <button
                onClick={() => toggleStepCompleted(currentStep.id)}
                className={`btn ${isStepDone(currentStep.id) ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
              >
                <CheckCircle2 size={16} className={isStepDone(currentStep.id) ? 'text-cyan' : 'text-muted'} />
                {isStepDone(currentStep.id) ? 'Step Completed! Click to uncheck' : 'Mark Step as Completed'}
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Challenge Card */}
        <div className="card" style={{ background: 'rgba(15, 22, 35, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={20} className="text-amber" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Lesson Challenge</h3>
            <span className="badge badge-amber">Concept Test</span>
          </div>

          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {activeLesson.challenge.title}
          </h4>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {activeLesson.challenge.description}
          </p>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              <HelpCircle size={14} />
              {showSolution ? 'Hide Explanation' : 'Show Concept Solution'}
            </button>
          </div>

          {showSolution && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid var(--border-valid)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: 'var(--accent-emerald)' }}>Mechanism Explanation: </strong>
              {activeLesson.challenge.solutionExplanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
