import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Block, BlockHeader } from '../../engine/types';
import { computeBlockHash, validateBlock, mineBlockStep } from '../../engine/block';
import {
  Pickaxe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  XCircle,
} from 'lucide-react';
import { MissionPanel } from '../common/MissionPanel';

export interface BlockLabProps {
  onNavigateNext?: () => void;
  isGuidedMode?: boolean;
}

export const BlockLab: React.FC<BlockLabProps> = ({
  onNavigateNext,
  isGuidedMode = true,
}) => {
  const [index, setIndex] = useState<number>(1);
  const [timestamp, setTimestamp] = useState<number>(1700000000000);
  const [previousHash, setPreviousHash] = useState<string>(
    '0000a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef123456',
  );
  const [data, setData] = useState<string>(
    'Alice sent 25 tokens to Bob (Campus Cafeteria)',
  );
  const [nonce, setNonce] = useState<number>(42);
  const [difficulty, setDifficulty] = useState<number>(2);

  // Stored block hash (which can become desynchronized if user edits fields without mining)
  const [storedHash, setStoredHash] = useState<string>(() =>
    computeBlockHash({
      index: 1,
      timestamp: 1700000000000,
      previousHash: '0000a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef123456',
      data: 'Alice sent 25 tokens to Bob (Campus Cafeteria)',
      nonce: 42,
      difficulty: 2,
    }),
  );

  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningAttempts, setMiningAttempts] = useState<number>(0);

  // Stable refs for lifecycle management and preventing overlapping/orphaned intervals
  const miningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const stopMining = useCallback(() => {
    if (miningIntervalRef.current !== null) {
      clearInterval(miningIntervalRef.current);
      miningIntervalRef.current = null;
    }
    if (isMountedRef.current) {
      setIsMining(false);
    }
  }, []);

  // Ensure timer is cleanly terminated when component unmounts
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (miningIntervalRef.current !== null) {
        clearInterval(miningIntervalRef.current);
        miningIntervalRef.current = null;
      }
    };
  }, []);

  const currentHeader: BlockHeader = useMemo(
    () => ({
      index,
      timestamp,
      previousHash,
      data,
      nonce,
      difficulty,
    }),
    [index, timestamp, previousHash, data, nonce, difficulty],
  );

  // Real-time computed hash
  const computedHash = useMemo(() => computeBlockHash(currentHeader), [currentHeader]);

  // Current block validation
  const currentBlock: Block = useMemo(
    () => ({
      ...currentHeader,
      hash: storedHash,
    }),
    [currentHeader, storedHash],
  );

  const validation = useMemo(() => validateBlock(currentBlock), [currentBlock]);

  // Interactive step-based mining loop (lifecycle-safe, non-blocking)
  const handleMine = () => {
    // Clear any existing timer to prevent overlapping loops
    stopMining();

    setIsMining(true);
    setMiningAttempts(0);

    let currentNonce = 0;
    let totalAttempts = 0;

    miningIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;

      const result = mineBlockStep(
        { ...currentHeader, nonce: currentNonce },
        currentNonce,
        5000,
      );

      totalAttempts += result.attempts;

      if (!isMountedRef.current) return;
      setMiningAttempts(totalAttempts);
      setNonce(result.newNonce);

      if (result.mined) {
        stopMining();
        if (isMountedRef.current) {
          setNonce(result.newNonce);
          setStoredHash(result.currentHash);
        }
      } else {
        currentNonce = result.newNonce;
        // Safety bail-out after 1M iterations in educational demo
        if (totalAttempts > 1_000_000) {
          stopMining();
        }
      }
    }, 16);
  };

  const handleSyncHash = () => {
    setStoredHash(computedHash);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* In-Lab Mission Guidance */}
      {isGuidedMode && (
        <MissionPanel
          stageNumber="02"
          stageTitle="Block Structure & Proof-of-Work"
          mission="Understand how a block packages data, parent history, and proof-of-work mining into a verifiable cryptographic unit."
          tryThis={[
            'Observe the currently valid block (emerald green border and badge).',
            'Change the transaction text in "Block Payload / Transaction Data" (e.g., "Alice sent 500 tokens to Mallory").',
            'Notice that the block immediately becomes invalid (card turns red).',
            'Click the [ Mine Block ] button at the top right of the card.',
            'Watch the computer search through Nonce numbers until it finds a hash starting with the required zeros.',
          ]}
          observe="Changing the payload changes the computed block hash. Mining repeatedly varies the Nonce until the hash satisfies the difficulty target (leading zeros)."
          whyItMatters="A block cannot simply declare itself valid. Proof-of-Work requires computational effort (mining) to find a valid nonce, preventing spam and establishing consensus."
          nextText="See what happens when multiple mined blocks are linked sequentially into a blockchain."
          nextLabel="Continue to Blockchain Lab"
          onNext={onNavigateNext}
        />
      )}
      {/* Top Banner */}
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
          <span className="badge badge-cyan">Block Structure</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            A block binds data, metadata, previous hash, and a proof-of-work nonce into a
            cryptographic summary.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Difficulty:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`btn ${difficulty === d ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
              >
                {d} {d === 1 ? 'zero' : 'zeros'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Block Inspector Card */}
      <div className={`card ${validation.isValid ? 'card-valid' : 'card-invalid'}`}>
        {/* Block Header Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Block #{index}
            </h3>
            {validation.isValid ? (
              <span className="badge badge-emerald">
                <CheckCircle2 size={13} /> Valid Block
              </span>
            ) : (
              <span className="badge badge-rose">
                <AlertTriangle size={13} /> Invalid Block
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              id="mine-block-btn"
              onClick={handleMine}
              disabled={isMining}
              className="btn btn-primary"
              style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
            >
              {isMining ? (
                <>
                  <RefreshCw size={14} className="spin" /> Mining (
                  {miningAttempts.toLocaleString()} hashes)...
                </>
              ) : (
                <>
                  <Pickaxe size={14} /> Mine Block
                </>
              )}
            </button>
            {isMining && (
              <button
                id="cancel-mining-btn"
                onClick={stopMining}
                className="btn btn-danger"
                style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
                title="Stop mining search"
              >
                <XCircle size={14} /> Cancel Mining
              </button>
            )}
            <button
              onClick={handleSyncHash}
              disabled={isMining}
              className="btn btn-secondary"
              style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
              title="Set stored hash to current computed hash without finding proof of work"
            >
              Update Hash
            </button>
          </div>
        </div>

        {/* Block Form Fields */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div className="input-group">
            <label className="input-label" htmlFor="block-index">
              Block Index / Height
            </label>
            <input
              id="block-index"
              type="number"
              value={index}
              onChange={(e) => setIndex(parseInt(e.target.value) || 0)}
              className="input-text"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="block-timestamp">
              Timestamp (Unix ms)
            </label>
            <input
              id="block-timestamp"
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(parseInt(e.target.value) || 0)}
              className="input-text"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="block-nonce">
              Nonce (Number Used Once)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                id="block-nonce"
                type="number"
                value={nonce}
                onChange={(e) => setNonce(parseInt(e.target.value) || 0)}
                className="input-text"
              />
              <button
                onClick={() => setNonce((n) => n + 1)}
                className="btn btn-secondary"
                style={{ padding: '0 10px', fontSize: '0.875rem' }}
              >
                +1
              </button>
            </div>
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: '16px' }}>
          <label className="input-label" htmlFor="block-previous-hash">
            Previous Block Hash (Parent Link)
          </label>
          <input
            id="block-previous-hash"
            type="text"
            value={previousHash}
            onChange={(e) => setPreviousHash(e.target.value)}
            className="input-text"
          />
        </div>

        <div className="input-group" style={{ marginBottom: '20px' }}>
          <label className="input-label" htmlFor="block-data">
            Block Payload / Transaction Data (Editable)
          </label>
          <textarea
            id="block-data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input-textarea"
            rows={3}
            placeholder="Enter block transactions or payload..."
          />
        </div>

        {/* Cryptographic Hash Comparison & Proof of Work Target */}
        <div
          style={{
            padding: '16px',
            background: 'var(--bg-code)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span className="input-label" style={{ color: 'var(--text-secondary)' }}>
                Computed Hash (Real-time from inputs)
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Target prefix: {'0'.repeat(difficulty)}...
              </span>
            </div>
            <div
              id="block-computed-hash"
              className="code-box"
              style={{
                color: computedHash.startsWith('0'.repeat(difficulty))
                  ? 'var(--accent-emerald)'
                  : 'var(--text-primary)',
              }}
            >
              {computedHash}
            </div>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span className="input-label" style={{ color: 'var(--text-secondary)' }}>
                Recorded Stored Hash
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color:
                    storedHash === computedHash
                      ? 'var(--accent-emerald)'
                      : 'var(--accent-rose)',
                }}
              >
                {storedHash === computedHash
                  ? '✓ Matches Computed'
                  : '✗ Hash Mismatch (Tampered)'}
              </span>
            </div>
            <div
              id="block-stored-hash"
              className="code-box"
              style={{
                color:
                  storedHash === computedHash
                    ? 'var(--accent-emerald)'
                    : 'var(--accent-rose)',
              }}
            >
              {storedHash}
            </div>
          </div>

          {/* Educational Explanation Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background: validation.isValid
                ? 'rgba(16, 185, 129, 0.08)'
                : 'rgba(244, 63, 94, 0.08)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${validation.isValid ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Cpu
              size={16}
              style={{
                color: validation.isValid
                  ? 'var(--accent-emerald)'
                  : 'var(--accent-rose)',
              }}
            />
            <span>
              {validation.isValid ? (
                <>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    Block is valid:
                  </strong>{' '}
                  The stored hash matches the computed hash of the contents, and satisfies
                  the required difficulty ({difficulty} leading zeros).
                </>
              ) : (
                <>
                  <strong style={{ color: 'var(--accent-rose)' }}>
                    Block is invalid:
                  </strong>{' '}
                  {validation.error} Click <strong>Mine Block</strong> to search for a
                  nonce that satisfies the target difficulty.
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
