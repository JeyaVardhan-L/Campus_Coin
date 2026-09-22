import { describe, it, expect } from 'vitest';
import { sha256Sync, hexToBinary } from '../../src/crypto/sha256';
import { calculateAvalanche } from '../../src/crypto/avalanche';
import { computeBlockHash, validateBlock, mineBlockSync } from '../../src/engine/block';
import { createDefaultChain, validateChain, tamperBlockData, repairChainFrom, GENESIS_PREVIOUS_HASH } from '../../src/engine/blockchain';

describe('Cryptographic Simulation Core', () => {
  it('computes NIST SHA-256 test vectors accurately', () => {
    // Empty string
    expect(sha256Sync('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

    // "abc"
    expect(sha256Sync('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

    // "The quick brown fox jumps over the lazy dog"
    expect(sha256Sync('The quick brown fox jumps over the lazy dog')).toBe(
      'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    );
  });

  it('converts hex to 256-bit binary representation', () => {
    const binary = hexToBinary('0f');
    expect(binary).toBe('00001111');
  });

  it('demonstrates avalanche effect on single character change', () => {
    const result = calculateAvalanche('LedgerLab 101', 'LedgerLab 102');
    expect(result.totalBits).toBe(256);
    expect(result.flippedBits).toBeGreaterThan(70); // Strong avalanche (typically ~128 bits)
    expect(result.flipPercentage).toBeGreaterThan(25);
  });

  it('validates a mined block and detects tampering', () => {
    const header = {
      index: 1,
      previousHash: '0000abcd1234',
      timestamp: 1700000000000,
      data: 'Alice sent 10 tokens to Bob',
      nonce: 0,
      difficulty: 2,
    };

    const mined = mineBlockSync(header);
    expect(mined.hash.startsWith('00')).toBe(true);
    expect(mined.hash).toBe(computeBlockHash(mined));

    const validation = validateBlock(mined);
    expect(validation.isValid).toBe(true);

    // Tamper with data
    const tampered = { ...mined, data: 'Alice sent 1000 tokens to Bob' };
    const tamperedValidation = validateBlock(tampered);
    expect(tamperedValidation.isValid).toBe(false);
    expect(tamperedValidation.isHashValid).toBe(false);
  });

  it('validates default blockchain and detects cascading downstream breakage', () => {
    const chain = createDefaultChain(4, 2);
    expect(chain.length).toBe(4);
    expect(chain[0].previousHash).toBe(GENESIS_PREVIOUS_HASH);

    // Initial chain is completely valid
    const initialValidation = validateChain(chain);
    expect(initialValidation.isValid).toBe(true);
    expect(initialValidation.firstInvalidIndex).toBeNull();

    // Tamper with block #1
    const tamperedChain = tamperBlockData(chain, 1, 'Mallory hijacked transactions');
    const tamperedValidation = validateChain(tamperedChain);

    expect(tamperedValidation.isValid).toBe(false);
    expect(tamperedValidation.firstInvalidIndex).toBe(1);
    expect(tamperedValidation.blockStatuses[1].isValid).toBe(false);

    // Repairing chain restores validity
    const repaired = repairChainFrom(tamperedChain, 1);
    const repairedValidation = validateChain(repaired);
    expect(repairedValidation.isValid).toBe(true);
  });
});
