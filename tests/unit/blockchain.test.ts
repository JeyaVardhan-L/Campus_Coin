import { describe, it, expect } from 'vitest';
import {
  createDefaultChain,
  validateChain,
  tamperBlockData,
  tamperBlockNonce,
  repairChainFrom,
  GENESIS_PREVIOUS_HASH,
} from '../../src/engine/blockchain';

describe('Blockchain Engine: Linkage, Tampering & Invalidation', () => {
  it('creates a canonical valid chain with Genesis predecessor zeros', () => {
    const chain = createDefaultChain(4, 2);
    expect(chain).toHaveLength(4);
    expect(chain[0].previousHash).toBe(GENESIS_PREVIOUS_HASH);

    // Verify parent links
    for (let i = 1; i < chain.length; i++) {
      expect(chain[i].previousHash).toBe(chain[i - 1].hash);
    }

    const validation = validateChain(chain);
    expect(validation.isValid).toBe(true);
    expect(validation.firstInvalidIndex).toBeNull();
  });

  it('detects tampering in Block #1 and breaks the entire downstream chain', () => {
    const chain = createDefaultChain(4, 2);

    // Tamper with Block #1 data
    const tampered = tamperBlockData(chain, 1, 'Hacker transferred 10,000 tokens');
    const validation = validateChain(tampered);

    expect(validation.isValid).toBe(false);
    expect(validation.firstInvalidIndex).toBe(1);

    // Block #0 is still intact
    expect(validation.blockStatuses[0].isValid).toBe(true);

    // Block #1 is invalid due to altered hash
    expect(validation.blockStatuses[1].isValid).toBe(false);
    expect(validation.blockStatuses[1].isHashValid).toBe(false);

    // Blocks #2 and #3 are invalid because their previousHash links are broken
    expect(validation.blockStatuses[2].isValid).toBe(false);
    expect(validation.blockStatuses[2].isLinkValid).toBe(false);
    expect(validation.blockStatuses[3].isValid).toBe(false);
  });

  it('detects nonce tampering', () => {
    const chain = createDefaultChain(3, 2);
    const tampered = tamperBlockNonce(chain, 2, 999999);
    const validation = validateChain(tampered);

    expect(validation.isValid).toBe(false);
    expect(validation.firstInvalidIndex).toBe(2);
  });

  it('re-mines and repairs a broken chain from the point of tampering', () => {
    const chain = createDefaultChain(4, 2);
    const tampered = tamperBlockData(chain, 1, 'Revised ledger state');

    expect(validateChain(tampered).isValid).toBe(false);

    // Repairing re-mines Block #1, #2, #3
    const repaired = repairChainFrom(tampered, 1);
    const validation = validateChain(repaired);

    expect(validation.isValid).toBe(true);
    expect(validation.firstInvalidIndex).toBeNull();
    expect(repaired[1].data).toBe('Revised ledger state');
    expect(repaired[2].previousHash).toBe(repaired[1].hash);
  });
});
