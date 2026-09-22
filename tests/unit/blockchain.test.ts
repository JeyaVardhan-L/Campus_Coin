import { describe, it, expect } from 'vitest';
import {
  createDefaultChain,
  validateChain,
  tamperBlockData,
  tamperBlockNonce,
  repairChainFrom,
  GENESIS_PREVIOUS_HASH,
} from '../../src/engine/blockchain';
import { computeBlockHash } from '../../src/engine/block';

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

  describe('Consensus Difficulty Enforcement', () => {
    it('passes validation when all blocks match the expected network consensus difficulty', () => {
      const chain = createDefaultChain(4, 2);
      const validation = validateChain(chain, 2);
      expect(validation.isValid).toBe(true);
      expect(validation.firstInvalidIndex).toBeNull();
    });

    it('rejects a block whose difficulty is manually lowered, even if its hash matches its own declared difficulty', () => {
      const chain = createDefaultChain(4, 2);

      // Maliciously lower Block #1 difficulty to 0
      const tamperedChain = [...chain];
      tamperedChain[1] = {
        ...tamperedChain[1],
        difficulty: 0,
      };

      const validation = validateChain(tamperedChain, 2);
      expect(validation.isValid).toBe(false);
      expect(validation.firstInvalidIndex).toBe(1);
      expect(validation.blockStatuses[1].reason).toContain('does not match network consensus difficulty');
    });

    it('rejects a modified block even after recalculating its hash at the lowered difficulty', () => {
      const chain = createDefaultChain(4, 2);

      // Lower Block #1 difficulty to 0 and recompute its hash so hash integrity would otherwise pass
      const tamperedChain = [...chain];
      const loweredBlock = {
        ...tamperedChain[1],
        difficulty: 0,
      };
      loweredBlock.hash = computeBlockHash(loweredBlock);
      tamperedChain[1] = loweredBlock;

      const validation = validateChain(tamperedChain, 2);
      expect(validation.isValid).toBe(false);
      expect(validation.firstInvalidIndex).toBe(1);
      expect(validation.blockStatuses[1].isDifficultyValid).toBe(false);
      expect(validation.blockStatuses[1].reason).toContain('network consensus difficulty');
    });

    it('preserves backward-compatible validation when expectedDifficulty is omitted', () => {
      const chain = createDefaultChain(4, 2);
      const validation = validateChain(chain);
      expect(validation.isValid).toBe(true);
    });
  });
});
