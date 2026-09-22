import { describe, it, expect } from 'vitest';
import { sha256Sync, hexToBinary } from '../../src/crypto/sha256';
import { calculateAvalanche } from '../../src/crypto/avalanche';

describe('Crypto Module: SHA-256 & Avalanche', () => {
  describe('sha256Sync', () => {
    it('produces standard 64-character hexadecimal hashes', () => {
      const hash = sha256Sync('LedgerLab');
      expect(hash).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
    });

    it('matches known NIST SHA-256 test vectors', () => {
      // Empty string
      expect(sha256Sync('')).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      );

      // "abc"
      expect(sha256Sync('abc')).toBe(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      );

      // 43-character standard sentence
      expect(sha256Sync('The quick brown fox jumps over the lazy dog')).toBe(
        'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
      );
    });

    it('is strictly deterministic: identical inputs yield identical outputs', () => {
      const input = 'Blockchain verification message 42';
      const hash1 = sha256Sync(input);
      const hash2 = sha256Sync(input);
      expect(hash1).toBe(hash2);
    });

    it('is sensitive to slight modifications', () => {
      const hash1 = sha256Sync('Hello World');
      const hash2 = sha256Sync('hello World');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('hexToBinary', () => {
    it('accurately converts hex characters to 4-bit binary strings', () => {
      expect(hexToBinary('0')).toBe('0000');
      expect(hexToBinary('f')).toBe('1111');
      expect(hexToBinary('a5')).toBe('10100101');
    });

    it('expands a 64-char hex hash into a 256-bit binary string', () => {
      const hash = sha256Sync('test');
      const binary = hexToBinary(hash);
      expect(binary).toHaveLength(256);
      expect(/^[01]{256}$/.test(binary)).toBe(true);
    });
  });

  describe('calculateAvalanche', () => {
    it('calculates Hamming distance and bit flips between two inputs', () => {
      const res = calculateAvalanche('Input 1', 'Input 2');
      expect(res.totalBits).toBe(256);
      expect(res.flippedBits).toBeGreaterThan(0);
      expect(res.flippedBits).toBeLessThanOrEqual(256);
      expect(res.flipPercentage).toBeGreaterThan(0);
      expect(res.flippedIndices.length).toBe(res.flippedBits);
    });

    it('shows high avalanche effect (>35% bit flip) on a single character change', () => {
      const res = calculateAvalanche('Transaction A -> B : 100', 'Transaction A -> B : 101');
      // Ideal hash flips ~50% (128 bits); standard cryptographic threshold is >35%
      expect(res.flipPercentage).toBeGreaterThan(35);
      expect(res.flippedBits).toBeGreaterThan(90);
    });

    it('returns zero flipped bits for identical inputs', () => {
      const res = calculateAvalanche('Same Input', 'Same Input');
      expect(res.flippedBits).toBe(0);
      expect(res.flipPercentage).toBe(0);
      expect(res.flippedIndices).toEqual([]);
    });
  });
});
