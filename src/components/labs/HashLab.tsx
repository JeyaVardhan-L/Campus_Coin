import React, { useState, useMemo } from 'react';
import { sha256Sync, hexToBinary } from '../../crypto/sha256';
import { calculateAvalanche, AvalancheResult } from '../../crypto/avalanche';
import { Copy, Check, Sparkles, ArrowRightLeft, Binary, ArrowRight } from 'lucide-react';
import { MissionPanel } from '../common/MissionPanel';

const PRESETS = [
  {
    label: 'Genesis Message',
    text: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks',
  },
  { label: 'LedgerLab Sample', text: 'Alice transfers 50 tokens to Bob' },
  { label: 'Single Letter A', text: 'A' },
  { label: 'Single Letter B', text: 'B' },
];

export interface HashLabProps {
  onNavigateNext?: () => void;
  isGuidedMode?: boolean;
}

export const HashLab: React.FC<HashLabProps> = ({
  onNavigateNext,
  isGuidedMode = true,
}) => {
  const [inputText, setInputText] = useState<string>('Hello, LedgerLab!');
  const [copied, setCopied] = useState(false);
  const [showAvalanche, setShowAvalanche] = useState(true);
  const [showBinaryStream, setShowBinaryStream] = useState(false);

  // Avalanche comparison input
  const [compareText, setCompareText] = useState<string>('Hello, LedgerLab.');

  // Real-time calculated SHA-256
  const hash = useMemo(() => sha256Sync(inputText), [inputText]);
  const binary = useMemo(() => hexToBinary(hash), [hash]);

  // Avalanche metrics
  const avalanche: AvalancheResult = useMemo(
    () => calculateAvalanche(inputText, compareText),
    [inputText, compareText],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mutateCompare = (type: 'flip' | 'space' | 'case') => {
    if (type === 'flip') {
      if (inputText.length > 0) {
        const lastChar = inputText[inputText.length - 1];
        const nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
        setCompareText(inputText.slice(0, -1) + nextChar);
      } else {
        setCompareText('!');
      }
    } else if (type === 'space') {
      setCompareText(inputText + ' ');
    } else if (type === 'case') {
      if (inputText.length > 0) {
        const first = inputText[0];
        const toggled =
          first === first.toUpperCase() ? first.toLowerCase() : first.toUpperCase();
        setCompareText(toggled + inputText.slice(1));
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* In-Lab Mission Guidance */}
      {isGuidedMode && (
        <MissionPanel
          id="mission-panel-hash"
          stageNumber="01"
          stageTitle="Cryptographic Hashes"
          mission="Discover why cryptographic hashes are the tamper-evident foundation of blockchain systems."
          tryThis={[
            'Type "Hello, world!" into the Input Data box below.',
            'Observe the 64-character hexadecimal hash generated instantly.',
            'Change just one character or punctuation mark (e.g., "!" to ".").',
            'Observe how completely the output hash scrambles (the Avalanche Effect).',
            'In the Avalanche Visualizer below, use "+Space" or "Flip 1 char" to see bit-level differences.',
          ]}
          observe="A tiny change in input produces a completely different 64-character fingerprint. The hash length never changes, regardless of input length."
          whyItMatters="Hashes act as permanent digital fingerprints. Because even a 1-bit modification alters the entire hash, any tampering with blockchain data is immediately detectable."
          nextText="See how this digital fingerprint is used to lock transactions into a single block."
          nextLabel="Continue to Block Lab"
          onNext={onNavigateNext}
        />
      )}
      {/* Top Banner / Philosophy */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
          background: 'rgba(0, 240, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-cyan">Cryptographic Standard</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Operating with standard SHA-256 (FIPS 180-4) — the cryptographic algorithm
            that powers Bitcoin and modern network security.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setInputText(p.text);
                setCompareText(p.text.slice(0, -1) + (p.text.endsWith('.') ? '!' : '.'));
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Single Hash Inspector */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <label className="input-label" htmlFor="hash-input">
            Input Data (Arbitrary Length)
          </label>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {inputText.length} characters ({new TextEncoder().encode(inputText).length}{' '}
            bytes)
          </span>
        </div>

        <textarea
          id="hash-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type any message, transaction, or block header to calculate its hash..."
          className="input-textarea"
          rows={3}
          style={{ resize: 'vertical', fontSize: '0.9375rem' }}
        />

        {/* SHA-256 Output */}
        <div style={{ marginTop: '18px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span className="input-label">
              SHA-256 Output (Fixed 256 bits / 64 hex characters)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowBinaryStream(!showBinaryStream)}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                title="Toggle binary stream view"
              >
                <Binary size={14} />
                {showBinaryStream ? 'Hide Binary' : 'View Binary Bits'}
              </button>
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                title="Copy hash to clipboard"
              >
                {copied ? (
                  <Check size={14} className="text-emerald" />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? 'Copied' : 'Copy Hash'}
              </button>
            </div>
          </div>

          <div
            id="hash-output"
            className="code-box"
            style={{
              fontSize: '1rem',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(6, 9, 15, 0.95)',
              border: '1px solid var(--border-accent)',
            }}
          >
            <span>{hash}</span>
          </div>

          {showBinaryStream && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                background: 'var(--bg-code)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                color: 'var(--accent-cyan)',
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                256-Bit Raw Stream:
              </div>
              {binary}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              marginTop: '10px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span>Length: 64 hex characters (256 bits)</span>
            <span title="Deterministic: Identical input text will always produce the exact same 64-character hash">
              Deterministic: Yes (Same input = same output)
            </span>
            <span title="Pre-image resistant: A one-way function where it is computationally infeasible to reverse-engineer the original text from the hash">
              Reversible: No (Pre-image resistant one-way hash)
            </span>
          </div>
        </div>
      </div>

      {/* Avalanche Effect Interactive Laboratory */}
      <div className="card" style={{ border: '1px solid var(--border-medium)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} className="text-amber" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                The Avalanche Effect
              </h3>
              <span className="badge badge-amber">Experiment</span>
            </div>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginTop: '4px',
              }}
            >
              In a secure cryptographic hash function, changing just 1 bit in the input
              flips approximately 50% of the output bits unpredictably.
            </p>
          </div>
          <button
            onClick={() => setShowAvalanche(!showAvalanche)}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <ArrowRightLeft size={14} />
            {showAvalanche ? 'Hide Details' : 'Show Visualizer'}
          </button>
        </div>

        {showAvalanche && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Comparative inputs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="input-label" style={{ color: 'var(--accent-cyan)' }}>
                  Input A (Original)
                </span>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="input-text"
                />
                <span
                  className="font-mono text-muted"
                  style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}
                >
                  Hash: {avalanche.hashA.slice(0, 24)}...
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span className="input-label" style={{ color: 'var(--accent-amber)' }}>
                    Input B (Modified)
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => mutateCompare('flip')}
                      className="btn btn-secondary"
                      style={{ padding: '2px 6px', fontSize: '0.6875rem' }}
                      title="Alter last character"
                    >
                      Flip 1 char
                    </button>
                    <button
                      onClick={() => mutateCompare('space')}
                      className="btn btn-secondary"
                      style={{ padding: '2px 6px', fontSize: '0.6875rem' }}
                      title="Append space"
                    >
                      +Space
                    </button>
                    <button
                      onClick={() => mutateCompare('case')}
                      className="btn btn-secondary"
                      style={{ padding: '2px 6px', fontSize: '0.6875rem' }}
                      title="Toggle case"
                    >
                      Case
                    </button>
                  </div>
                </div>
                <input
                  id="compare-input"
                  type="text"
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                  className="input-text"
                />
                <span
                  className="font-mono text-muted"
                  style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}
                >
                  Hash: {avalanche.hashB.slice(0, 24)}...
                </span>
              </div>
            </div>

            {/* Avalanche Metrics Banner */}
            <div
              id="avalanche-stats"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                padding: '16px',
                background: 'rgba(10, 14, 24, 0.7)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Flipped Bits
                </div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color:
                      avalanche.flippedBits > 100
                        ? 'var(--accent-emerald)'
                        : 'var(--accent-amber)',
                  }}
                >
                  {avalanche.flippedBits}{' '}
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      fontWeight: 400,
                    }}
                  >
                    / {avalanche.totalBits}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Bit Flip Ratio
                </div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  {avalanche.flipPercentage}%
                </div>
              </div>

              <div>
                <div
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  title="Hamming Distance: The total number of differing bit positions between the two hashes."
                >
                  Differing Bits (Hamming Distance)
                </div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {avalanche.flippedBits}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ideal Target
                </div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  ~50.0%
                </div>
              </div>
            </div>

            {/* 256-bit Visual Matrix */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span className="input-label">
                  256-Bit Difference Matrix (Each square is 1 output bit)
                </span>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        background: 'rgba(30, 44, 68, 0.8)',
                        display: 'inline-block',
                      }}
                    />
                    Unchanged bit
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        background: 'var(--accent-amber)',
                        boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)',
                        display: 'inline-block',
                      }}
                    />
                    Flipped bit ({avalanche.flippedBits})
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(32, 1fr)',
                  gap: '4px',
                  padding: '12px',
                  background: 'var(--bg-code)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {Array.from({ length: 256 }).map((_, bitIdx) => {
                  const isFlipped = avalanche.flippedIndices.includes(bitIdx);
                  return (
                    <div
                      key={bitIdx}
                      title={`Bit ${bitIdx}: Input A=${avalanche.binaryA[bitIdx]}, Input B=${avalanche.binaryB[bitIdx]} (${isFlipped ? 'FLIPPED' : 'IDENTICAL'})`}
                      style={{
                        height: '12px',
                        borderRadius: '2px',
                        backgroundColor: isFlipped
                          ? 'var(--accent-amber)'
                          : 'rgba(30, 44, 68, 0.7)',
                        boxShadow: isFlipped ? '0 0 4px rgba(245, 158, 11, 0.5)' : 'none',
                        transition: 'background-color 200ms ease',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Guided Progression Action */}
      {onNavigateNext && (
        <div
          className="card"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            background:
              'linear-gradient(90deg, rgba(0, 240, 255, 0.08) 0%, rgba(15, 22, 35, 0.9) 100%)',
            border: '1px solid var(--border-accent)',
            padding: '18px 24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">Checkpoint Reached</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}>
                You understand how cryptographic hashes and the avalanche effect work!
              </span>
            </div>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginTop: '4px',
              }}
            >
              Next step: See how transactions, timestamps, and proof-of-work are assembled
              into a single block.
            </p>
          </div>
          <button
            id="hash-next-btn"
            onClick={onNavigateNext}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600 }}
          >
            Next: Build a Block <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
