import React from 'react';
import { Play, Compass, ArrowRight, ShieldCheck, Cpu, Link2, Award } from 'lucide-react';
import { LabTab } from '../../App';

interface OnboardingHeroProps {
  isGuidedMode: boolean;
  onStartGuided: () => void;
  onExploreSandboxes: () => void;
  onNavigateTab: (tab: LabTab) => void;
}

export const OnboardingHero: React.FC<OnboardingHeroProps> = ({
  isGuidedMode,
  onStartGuided,
  onExploreSandboxes,
  onNavigateTab,
}) => {
  return (
    <div
      id="onboarding-hero"
      className="card"
      style={{
        marginBottom: '24px',
        background:
          'linear-gradient(180deg, rgba(15, 22, 35, 0.98) 0%, rgba(8, 12, 20, 0.95) 100%)',
        border: '1px solid var(--border-accent)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Badges & Title */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '10px',
            }}
          >
            <span className="badge badge-cyan">
              <ShieldCheck size={12} /> Interactive Laboratory
            </span>
            <span className="badge badge-amber">Pure Computer Science</span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Zero Speculation • Zero Financial Tokens
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '8px',
            }}
          >
            LedgerLab <span style={{ color: 'var(--accent-cyan)' }}>Start Here</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: '780px',
              lineHeight: 1.6,
            }}
          >
            Learn how blockchains work by building them, breaking them, and discovering
            why mathematics makes history tamper-evident. Follow the guided experiment
            below or explore individual laboratories at your own pace.
          </p>
        </div>

        {/* 4-Step Learning Path */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            padding: '16px',
            background: 'rgba(6, 9, 15, 0.7)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            onClick={() => onNavigateTab('hash')}
            style={{
              cursor: 'pointer',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(15, 22, 35, 0.6)',
              border: '1px solid var(--border-subtle)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </span>
              STAGE 01
              <ShieldCheck size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
              Cryptographic Hashes
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Digital fingerprints & the avalanche effect
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('block')}
            style={{
              cursor: 'pointer',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(15, 22, 35, 0.6)',
              border: '1px solid var(--border-subtle)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </span>
              STAGE 02
              <Cpu size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
              Block Structure
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Packaging data & proof-of-work mining
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('blockchain')}
            style={{
              cursor: 'pointer',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(15, 22, 35, 0.6)',
              border: '1px solid var(--border-subtle)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </span>
              STAGE 03
              <Link2 size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
              The Blockchain
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Parent linkage & cascading invalidation
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('lessons')}
            style={{
              cursor: 'pointer',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(15, 22, 35, 0.6)',
              border: '1px solid var(--border-subtle)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                4
              </span>
              STAGE 04
              <Award size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
              Attack & Defense
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Why rewriting history requires work
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '4px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              id="start-guided-journey-btn"
              onClick={onStartGuided}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9375rem', fontWeight: 600 }}
            >
              <Play size={16} /> Start Guided Journey <ArrowRight size={14} />
            </button>
            <button
              id="explore-sandboxes-btn"
              onClick={onExploreSandboxes}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.875rem' }}
            >
              <Compass size={16} /> Explore Free Sandboxes
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>Current Mode:</span>
            <span
              className={`badge ${isGuidedMode ? 'badge-cyan' : 'badge-amber'}`}
              style={{ fontSize: '0.6875rem' }}
            >
              {isGuidedMode ? 'Guided Journey' : 'Free Sandbox'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
