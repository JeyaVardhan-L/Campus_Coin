import { sha256Sync, hexToBinary } from './sha256';

export interface AvalancheResult {
  inputA: string;
  inputB: string;
  hashA: string;
  hashB: string;
  binaryA: string;
  binaryB: string;
  flippedBits: number;
  totalBits: number;
  flipPercentage: number;
  flippedIndices: number[];
}

/**
 * Calculates the cryptographic avalanche effect between two inputs.
 * Compares their SHA-256 hashes bit-by-bit to compute Hamming distance
 * and bit flip percentage.
 */
export function calculateAvalanche(inputA: string, inputB: string): AvalancheResult {
  const hashA = sha256Sync(inputA);
  const hashB = sha256Sync(inputB);

  const binaryA = hexToBinary(hashA);
  const binaryB = hexToBinary(hashB);

  const flippedIndices: number[] = [];
  let flippedBits = 0;
  const totalBits = 256;

  for (let i = 0; i < totalBits; i++) {
    if (binaryA[i] !== binaryB[i]) {
      flippedBits++;
      flippedIndices.push(i);
    }
  }

  const flipPercentage = parseFloat(((flippedBits / totalBits) * 100).toFixed(2));

  return {
    inputA,
    inputB,
    hashA,
    hashB,
    binaryA,
    binaryB,
    flippedBits,
    totalBits,
    flipPercentage,
    flippedIndices,
  };
}
