import React, { useState, useMemo } from 'react';
import { Block } from '../../engine/types';
import {
  createDefaultChain,
  validateChain,
  tamperBlockData,
  tamperBlockNonce,
  repairChainFrom,
} from '../../engine/blockchain';
import { mineBlockSync, computeBlockHash } from '../../engine/block';
import {
  Link2,
  Unlink,
  RotateCcw,
  Wrench,
  Plus,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

export const BlockchainLab: React.FC = () => {
  const [chain, setChain] = useState<Block[]>(() => createDefaultChain(4, 2));
  const [isRepairing, setIsRepairing] = useState<boolean>(false);

  // Validate entire chain state against expected consensus difficulty (2)
  const validation = useMemo(() => validateChain(chain, 2), [chain]);

  // Handle data editing on any block
  const handleDataChange = (index: number, newData: string) => {
    setChain((prev) => tamperBlockData(prev, index, newData));
  };

  // Handle nonce editing on any block
  const handleNonceChange = (index: number, newNonce: number) => {
    setChain((prev) => tamperBlockNonce(prev, index, newNonce));
  };

  // Re-mine a single block
  const handleMineBlock = (index: number) => {
    setChain((prev) => {
      const target = prev[index];
      const previousHash = index === 0 ? target.previousHash : prev[index - 1].hash;
      const mined = mineBlockSync({
        ...target,
        previousHash,
      });
      const updated = [...prev];
      updated[index] = mined;
      return updated;
    });
  };

  // Repair chain from the first broken block forward
  const handleRepairChain = () => {
    if (validation.firstInvalidIndex === null) return;
    setIsRepairing(true);
    setTimeout(() => {
      setChain((prev) => repairChainFrom(prev, validation.firstInvalidIndex!));
      setIsRepairing(false);
    }, 150);
  };

  // Reset chain back to valid initial state
  const handleReset = () => {
    setChain(createDefaultChain(4, 2));
  };

  // Append a newly mined block
  const handleAddBlock = () => {
    setChain((prev) => {
      const last = prev[prev.length - 1];
      const newBlock = mineBlockSync({
        index: prev.length,
        previousHash: last.hash,
        timestamp: last.timestamp + 60000,
        data: `Block #${prev.length}: Transaction payload created in laboratory`,
        nonce: 0,
        difficulty: 2,
      });
      return [...prev, newBlock];
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Chain Status & Global Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 20px',
          background: validation.isValid
            ? 'rgba(16, 185, 129, 0.05)'
            : 'rgba(244, 63, 94, 0.06)',
          border: `1px solid ${validation.isValid ? 'var(--border-valid)' : 'var(--border-invalid)'}`,
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: validation.isValid
                ? 'var(--accent-emerald-glow)'
                : 'var(--accent-rose-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: validation.isValid ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            }}
          >
            {validation.isValid ? <CheckCircle2 size={24} /> : <AlertOctagon size={24} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                {validation.isValid
                  ? 'Chain Integrity: Valid'
                  : 'Chain Integrity: Broken (Tampered)'}
              </span>
              <span
                className={`badge ${validation.isValid ? 'badge-emerald' : 'badge-rose'}`}
              >
                {validation.isValid
                  ? `${chain.length}/${chain.length} Blocks Verified`
                  : `Broken at Block #${validation.firstInvalidIndex}`}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}
            >
              {validation.summary}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!validation.isValid && (
            <button
              id="repair-chain-btn"
              onClick={handleRepairChain}
              disabled={isRepairing}
              className="btn btn-primary"
              style={{ fontSize: '0.8125rem' }}
              title="Recalculate and re-mine from the broken block to the tip of the chain"
            >
              <Wrench size={14} />
              {isRepairing
                ? 'Re-mining Chain...'
                : `Re-mine From Block #${validation.firstInvalidIndex}`}
            </button>
          )}

          <button
            id="add-block-btn"
            onClick={handleAddBlock}
            className="btn btn-secondary"
            style={{ fontSize: '0.8125rem' }}
          >
            <Plus size={14} /> Add Block
          </button>

          <button
            id="reset-chain-btn"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ fontSize: '0.8125rem' }}
            title="Reset chain to canonical 4-block state"
          >
            <RotateCcw size={14} /> Reset Chain
          </button>
        </div>
      </div>

      {/* Tampering Explanatory Callout */}
      {!validation.isValid && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
          }}
        >
          <ShieldAlert size={20} className="text-rose" style={{ flexShrink: 0 }} />
          <div>
            <strong>Cascading Invalidation in Action:</strong> Because Block #
            {validation.firstInvalidIndex}&apos;s data or nonce was altered, its hash
            changed. Every downstream block that linked to it now fails the previous hash
            check!
          </div>
        </div>
      )}

      {/* Educational Repair Context Callout */}
      {!validation.isValid && (
        <div
          id="repair-context-callout"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(0, 240, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          <Info
            size={18}
            className="text-cyan"
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>
              Educational Simulation Note on Chain Repair:
            </strong>{' '}
            This repair works rapidly because this laboratory gives you 100% of the
            simulated mining power and there are no competing honest nodes. In a
            distributed network, an attacker would need to rebuild modified history while
            competing against the honest network&apos;s accumulated proof-of-work.
          </div>
        </div>
      )}

      {/* Horizontal / Wrapped Blockchain Flow */}
      <div
        id="blockchain-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {chain.map((block, idx) => {
          const status = validation.blockStatuses[idx];
          const isCurrentValid = status ? status.isValid : true;
          const computed = computeBlockHash(block);
          const isGenesis = idx === 0;

          return (
            <div
              key={block.index}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div
                className={`card ${isCurrentValid ? 'card-valid' : 'card-invalid'}`}
                style={{
                  position: 'relative',
                  borderWidth: '2px',
                }}
              >
                {/* Block Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: isCurrentValid
                          ? 'var(--accent-cyan)'
                          : 'var(--accent-rose)',
                      }}
                    >
                      Block #{block.index} {isGenesis && '(Genesis)'}
                    </span>
                    <span
                      className={`badge ${isCurrentValid ? 'badge-emerald' : 'badge-rose'}`}
                    >
                      {isCurrentValid ? 'Intact' : 'Broken'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Nonce: {block.nonce}
                    </span>
                    <button
                      onClick={() => handleMineBlock(idx)}
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                      title="Mine this block individually"
                    >
                      Mine
                    </button>
                  </div>
                </div>

                {/* Block Internal Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Previous Hash Link */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        className="input-label"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        {status?.isLinkValid ? (
                          <Link2 size={12} className="text-emerald" />
                        ) : (
                          <Unlink size={12} className="text-rose" />
                        )}
                        Previous Hash
                      </span>
                      {!isGenesis && (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontFamily: 'var(--font-mono)',
                            color: status?.isLinkValid
                              ? 'var(--accent-emerald)'
                              : 'var(--accent-rose)',
                          }}
                        >
                          {status?.isLinkValid
                            ? '✓ Matches Parent Hash'
                            : '✗ Broken Link to Parent'}
                        </span>
                      )}
                    </div>
                    <div
                      className="code-box"
                      style={{
                        fontSize: '0.75rem',
                        padding: '6px 10px',
                        color: status?.isLinkValid
                          ? 'var(--text-secondary)'
                          : 'var(--accent-rose)',
                        background: 'rgba(6, 9, 15, 0.6)',
                      }}
                    >
                      {block.previousHash}
                    </div>
                  </div>

                  {/* Data Payload (Editable) */}
                  <div className="input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="input-label" htmlFor={`block-data-${idx}`}>
                        Data / Transactions (Edit to simulate tampering)
                      </label>
                      <span
                        style={{ fontSize: '0.6875rem', color: 'var(--accent-cyan)' }}
                      >
                        Editable
                      </span>
                    </div>
                    <textarea
                      id={`block-data-${idx}`}
                      value={block.data}
                      onChange={(e) => handleDataChange(idx, e.target.value)}
                      className="input-textarea"
                      rows={2}
                      style={{
                        fontSize: '0.8125rem',
                        borderColor: isCurrentValid
                          ? 'var(--border-subtle)'
                          : 'var(--accent-rose)',
                      }}
                    />
                  </div>

                  {/* Nonce input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label className="input-label" style={{ marginBottom: 0 }}>
                      Nonce:
                    </label>
                    <input
                      type="number"
                      value={block.nonce}
                      onChange={(e) =>
                        handleNonceChange(idx, parseInt(e.target.value) || 0)
                      }
                      className="input-text"
                      style={{
                        width: '120px',
                        padding: '4px 8px',
                        fontSize: '0.8125rem',
                      }}
                    />
                  </div>

                  {/* Hash Output */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <span className="input-label">Block Hash</span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          color: status?.isHashValid
                            ? 'var(--accent-emerald)'
                            : 'var(--accent-rose)',
                        }}
                      >
                        {status?.isHashValid
                          ? '✓ Hash matches payload'
                          : '✗ Hash altered'}
                      </span>
                    </div>
                    <div
                      className="code-box"
                      style={{
                        fontSize: '0.75rem',
                        padding: '6px 10px',
                        color: isCurrentValid
                          ? 'var(--accent-emerald)'
                          : 'var(--accent-rose)',
                        background: 'rgba(6, 9, 15, 0.95)',
                      }}
                    >
                      {block.hash}
                    </div>
                    {block.hash !== computed && (
                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent-rose)',
                        }}
                      >
                        Current computed: {computed}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Connector Link to Next Block */}
              {idx < chain.length - 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '4px 0',
                    color: validation.blockStatuses[idx + 1]?.isLinkValid
                      ? 'var(--accent-emerald)'
                      : 'var(--accent-rose)',
                  }}
                >
                  <ArrowRight
                    size={20}
                    style={{
                      transform: 'rotate(90deg)',
                      filter: validation.blockStatuses[idx + 1]?.isLinkValid
                        ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))'
                        : 'drop-shadow(0 0 4px rgba(244, 63, 94, 0.5))',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {validation.blockStatuses[idx + 1]?.isLinkValid
                      ? 'Cryptographic Hash Link Valid'
                      : 'Broken Cryptographic Link'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
