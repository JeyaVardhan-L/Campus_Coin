import { Block, BlockStatusInChain, ChainValidationResult } from './types';
import { computeBlockHash, mineBlockSync } from './block';

export const GENESIS_PREVIOUS_HASH = '0'.repeat(64);

/**
 * Creates a default canonical, valid simulated blockchain.
 */
export function createDefaultChain(length = 4, difficulty = 2): Block[] {
  const chain: Block[] = [];
  const sampleMessages = [
    'Genesis Block: LedgerLab educational simulation initialized.',
    'Alice sent 15 tokens to Bob (Campus Book Exchange)',
    'Bob sent 5 tokens to Charlie (Laboratory Coffee)',
    'Charlie sent 2 tokens to Dave (Library Printing Service)',
    'Dave sent 1 token to Alice (Study Note Bounty)',
  ];

  let previousHash = GENESIS_PREVIOUS_HASH;
  const baseTimestamp = 1700000000000;

  for (let i = 0; i < length; i++) {
    const data = sampleMessages[i] || `Block ${i} simulated payload`;
    const timestamp = baseTimestamp + i * 60000;

    const block = mineBlockSync({
      index: i,
      previousHash,
      timestamp,
      data,
      nonce: 0,
      difficulty,
    });

    chain.push(block);
    previousHash = block.hash;
  }

  return chain;
}

/**
 * Validates a blockchain in its entirety.
 * Ensures:
 * 1. Genesis previousHash matches GENESIS_PREVIOUS_HASH
 * 2. Each block's internal hash matches computeBlockHash(block)
 * 3. Each block's hash satisfies the difficulty target
 * 4. Each block (after Genesis) points exactly to the previous block's current hash
 */
export function validateChain(chain: Block[]): ChainValidationResult {
  if (chain.length === 0) {
    return {
      isValid: true,
      firstInvalidIndex: null,
      blockStatuses: [],
      summary: 'Chain is empty.',
    };
  }

  const statuses: BlockStatusInChain[] = [];
  let firstInvalidIndex: number | null = null;

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const computedHash = computeBlockHash(block);
    const isHashValid = block.hash === computedHash;

    const targetPrefix = '0'.repeat(Math.max(0, block.difficulty));
    const isDifficultyValid =
      targetPrefix.length === 0 || computedHash.startsWith(targetPrefix);

    let isLinkValid = true;
    let reason: string | undefined;

    if (i === 0) {
      if (block.previousHash !== GENESIS_PREVIOUS_HASH) {
        isLinkValid = false;
        reason = `Genesis block previousHash must be ${GENESIS_PREVIOUS_HASH}`;
      }
    } else {
      const prevBlock = chain[i - 1];
      const prevStatus = statuses[i - 1];

      if (block.previousHash !== prevBlock.hash) {
        isLinkValid = false;
        reason = `Block #${i} previousHash does not match Block #${i - 1}'s current hash.`;
      } else if (!prevStatus.isValid) {
        isLinkValid = false;
        reason = `Predecessor Block #${i - 1} is invalid; chain linkage is broken.`;
      }
    }

    if (!isHashValid) {
      reason = reason
        ? `${reason}; Hash altered.`
        : 'Block hash does not match computed data hash.';
    } else if (!isDifficultyValid) {
      reason = reason
        ? `${reason}; Difficulty unmet.`
        : `Does not meet difficulty target of ${block.difficulty}.`;
    }

    const isValid = isHashValid && isLinkValid && isDifficultyValid;

    if (!isValid && firstInvalidIndex === null) {
      firstInvalidIndex = i;
    }

    statuses.push({
      index: i,
      isValid,
      isHashValid,
      isLinkValid,
      isDifficultyValid,
      computedHash,
      reason,
    });
  }

  const isValid = firstInvalidIndex === null;
  const summary = isValid
    ? `Chain is valid (${chain.length} blocks perfectly linked).`
    : `Chain broken at Block #${firstInvalidIndex}: ${statuses[firstInvalidIndex!].reason}`;

  return {
    isValid,
    firstInvalidIndex,
    blockStatuses: statuses,
    summary,
  };
}

/**
 * Modifies the data of a specific block in the chain to simulate tampering.
 * Note: Stored block.hash is deliberately preserved initially so the user
 * sees both the hash mismatch and the downstream linkage failure.
 */
export function tamperBlockData(chain: Block[], index: number, newData: string): Block[] {
  return chain.map((block, i) => {
    if (i === index) {
      return {
        ...block,
        data: newData,
      };
    }
    return block;
  });
}

/**
 * Modifies the nonce of a specific block to simulate nonce tampering.
 */
export function tamperBlockNonce(
  chain: Block[],
  index: number,
  newNonce: number,
): Block[] {
  return chain.map((block, i) => {
    if (i === index) {
      return {
        ...block,
        nonce: newNonce,
      };
    }
    return block;
  });
}

/**
 * Recalculates and re-mines the chain starting from a given index to
 * demonstrate the computational cost of repairing a tampered chain.
 */
export function repairChainFrom(chain: Block[], fromIndex: number): Block[] {
  const newChain = [...chain];

  for (let i = fromIndex; i < newChain.length; i++) {
    const current = newChain[i];
    const previousHash = i === 0 ? GENESIS_PREVIOUS_HASH : newChain[i - 1].hash;

    const repaired = mineBlockSync({
      ...current,
      previousHash,
      nonce: 0,
    });

    newChain[i] = repaired;
  }

  return newChain;
}
