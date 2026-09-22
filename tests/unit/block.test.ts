import { describe, it, expect } from 'vitest';
import {
  computeBlockHash,
  validateBlock,
  mineBlockSync,
  mineBlockStep,
} from '../../src/engine/block';
import { BlockHeader } from '../../src/engine/types';

describe('Block Engine: Hashing & Mining', () => {
  const sampleHeader: BlockHeader = {
    index: 1,
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: 1700000000000,
    data: 'Student A registered on campus ledger',
    nonce: 0,
    difficulty: 2,
  };

  it('computes a consistent block hash', () => {
    const hash1 = computeBlockHash(sampleHeader);
    const hash2 = computeBlockHash(sampleHeader);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('changes block hash when data or nonce changes', () => {
    const hashOrig = computeBlockHash(sampleHeader);
    const hashDataChanged = computeBlockHash({ ...sampleHeader, data: 'Altered data' });
    const hashNonceChanged = computeBlockHash({ ...sampleHeader, nonce: 1 });

    expect(hashDataChanged).not.toBe(hashOrig);
    expect(hashNonceChanged).not.toBe(hashOrig);
    expect(hashDataChanged).not.toBe(hashNonceChanged);
  });

  it('mines a block synchronously to satisfy target difficulty', () => {
    const mined = mineBlockSync(sampleHeader);
    expect(mined.hash.startsWith('00')).toBe(true);
    expect(mined.hash).toBe(computeBlockHash(mined));

    const validation = validateBlock(mined);
    expect(validation.isValid).toBe(true);
    expect(validation.isHashValid).toBe(true);
    expect(validation.isDifficultyValid).toBe(true);
  });

  it('validates a block and flags hash alteration', () => {
    const mined = mineBlockSync(sampleHeader);
    const tampered = { ...mined, data: 'Fraudulent transaction injection' };

    const validation = validateBlock(tampered);
    expect(validation.isValid).toBe(false);
    expect(validation.isHashValid).toBe(false);
    expect(validation.error).toBeDefined();
  });

  it('mines in discrete step chunks without blocking execution', () => {
    // Step size 100
    const step1 = mineBlockStep(sampleHeader, 0, 100);
    expect(step1.attempts).toBeLessThanOrEqual(100);
    expect(step1.newNonce).toBeGreaterThan(0);
  });
});
