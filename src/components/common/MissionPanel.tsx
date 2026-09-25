import React, { useState } from 'react';
import {
  Target,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lightbulb,
  Eye,
} from 'lucide-react';

export interface MissionPanelProps {
  stageNumber: string | number;
  stageTitle: string;
  mission: string;
  tryThis: string[];
  observe: string;
  whyItMatters: string;
  nextText?: string;
  nextLabel?: string;
  onNext?: () => void;
  defaultExpanded?: boolean;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  stageNumber,
  stageTitle,
  mission,
  tryThis,
  observe,
  whyItMatters,
  nextText,
  nextLabel,
  onNext,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div
      className="card"
      style={{
        border: '1px solid var(--border-accent)',
        background:
          'linear-gradient(180deg, rgba(10, 16, 28, 0.95) 0%, rgba(6, 9, 15, 0.9) 100%)',
        padding: '16px 20px',
        position: 'relative',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.05)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(0, 240, 255, 0.1)',
              color: 'var(--accent-cyan)',
            }}
          >
            <Target size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.6875rem' }}>
                Stage {stageNumber}
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff' }}>
                {stageTitle} — Guided Mission
              </span>
            </div>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}
            >
              {mission}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="btn btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          title={isExpanded ? 'Collapse instructions' : 'Expand instructions'}
        >
          {isExpanded ? (
            <>
              Hide Guide <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show Guide <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Main Grid: Try This + Observe & Why */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Try This */}
            <div
              style={{
                padding: '14px',
                background: 'rgba(6, 9, 15, 0.6)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <Sparkles size={14} /> Try This
              </div>
              <ol
                style={{
                  paddingLeft: '18px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  lineHeight: 1.5,
                }}
              >
                {tryThis.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Observe & Why It Matters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  padding: '12px 14px',
                  background: 'rgba(245, 158, 11, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-amber)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  <Eye size={14} /> Observe
                </div>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {observe}
                </p>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  <Lightbulb size={14} /> Why It Matters
                </div>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {whyItMatters}
                </p>
              </div>
            </div>
          </div>

          {/* Next action bar */}
          {onNext && nextText && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '10px 14px',
                background: 'rgba(0, 240, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(0, 240, 255, 0.15)',
              }}
            >
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>Next Step:</strong>{' '}
                {nextText}
              </div>
              <button
                onClick={onNext}
                className="btn btn-primary"
                style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
              >
                {nextLabel || 'Continue'} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
