import { sha256Sync } from '../crypto/sha256';
import { Block, BlockHeader, BlockValidation } from './types';

/**
 * Computes deterministic canonical SHA-256 hash for a block header.
 */
export function computeBlockHash(header: BlockHeader): string {
  const payload = `${header.index}|${header.previousHash}|${header.timestamp}|${header.data}|${header.nonce}|${header.difficulty}`;
  return sha256Sync(payload);
}

/**
 * Validates a single block in isolation.
 * Checks whether the stored hash matches the recalculation of its header,
 * and if it meets the declared difficulty prefix (if difficulty > 0).
 */
export function validateBlock(block: Block): BlockValidation {
  const computedHash = computeBlockHash(block);
  const isHashValid = block.hash === computedHash;

  const targetPrefix = '0'.repeat(Math.max(0, block.difficulty));
  const isDifficultyValid = targetPrefix.length === 0 || computedHash.startsWith(targetPrefix);

  const isValid = isHashValid && isDifficultyValid;
  let error: string | undefined;

  if (!isHashValid) {
    error = 'Block hash does not match computed payload hash.';
  } else if (!isDifficultyValid) {
    error = `Block hash does not satisfy target difficulty of ${block.difficulty} leading zeros.`;
  }

  return {
    isValid,
    isHashValid,
    isDifficultyValid,
    computedHash,
    error,
  };
}

/**
 * Synchronously mines a block by searching for a nonce satisfying the difficulty target.
 */
export function mineBlockSync(header: BlockHeader, maxAttempts = 1_000_000): Block {
  const target = '0'.repeat(Math.max(0, header.difficulty));
  let nonce = header.nonce;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const candidateHeader: BlockHeader = { ...header, nonce };
    const hash = computeBlockHash(candidateHeader);

    if (hash.startsWith(target)) {
      return {
        ...candidateHeader,
        hash,
      };
    }

    nonce++;
    attempts++;
  }

  throw new Error(`Failed to find proof of work within ${maxAttempts} attempts`);
}

/**
 * Performs a bounded step of mining attempts (useful for non-blocking UI loops).
 */
export function mineBlockStep(
  header: BlockHeader,
  startNonce: number,
  stepSize = 2500,
): { mined: boolean; newNonce: number; currentHash: string; attempts: number } {
  const target = '0'.repeat(Math.max(0, header.difficulty));
  let nonce = startNonce;
  let attempts = 0;

  while (attempts < stepSize) {
    const candidateHeader: BlockHeader = { ...header, nonce };
    const hash = computeBlockHash(candidateHeader);

    if (hash.startsWith(target)) {
      return {
        mined: true,
        newNonce: nonce,
        currentHash: hash,
        attempts: attempts + 1,
      };
    }

    nonce++;
    attempts++;
  }

  const lastHeader: BlockHeader = { ...header, nonce: nonce - 1 };
  return {
    mined: false,
    newNonce: nonce,
    currentHash: computeBlockHash(lastHeader),
    attempts,
  };
}
