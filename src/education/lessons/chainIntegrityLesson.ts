import { Lesson } from '../types';

export const chainIntegrityLesson: Lesson = {
  id: '02-chain-integrity',
  number: '02',
  title: 'Block Linking & The Immutability Illusion',
  category: 'chain',
  estimatedMinutes: 8,
  objective:
    'Discover how blocks are linked together using parent hashes, and watch how altering historical data cascades invalidation down the entire chain.',
  background:
    'A blockchain is an append-only log of blocks where each block header includes the hash of the block before it. Blockchains are not magically immutable; rather, tampering is mathematically obvious and computationally expensive to conceal.',
  steps: [
    {
      id: 'step-1',
      title: 'Inspect the Genesis Block link',
      instruction:
        'Navigate to the Blockchain Lab and check Block #0 (Genesis). Look at its Previous Hash field.',
      explanation:
        'The Genesis block is the very first block in a blockchain. Because it has no predecessor, its previous hash is canonically set to all zeros (64 zeros in hex).',
      hint: 'Notice Block #1 Previous Hash exactly matches Block #0 Current Hash.',
    },
    {
      id: 'step-2',
      title: 'Deliberately tamper with Block #1',
      instruction:
        'In Block #1, change "Alice sent 15 tokens to Bob" to "Alice sent 1500 tokens to Mallory".',
      explanation:
        'The moment you edit the payload, Block #1 becomes invalid because its stored hash no longer matches its computed hash.',
      hint: 'Look at the status badge on Block #1: it immediately turns red.',
    },
    {
      id: 'step-3',
      title: 'Observe the cascading downstream invalidation',
      instruction:
        'Examine Blocks #2, #3, and #4 after tampering with Block #1.',
      explanation:
        'Because Block #2 still points to Block #1’s old hash, its cryptographic link is broken! Even though nobody touched Block #3 or #4, the entire sequence following the tampered block is rejected by the network.',
      hint: 'Notice the red broken link arrows pointing between subsequent blocks.',
    },
    {
      id: 'step-4',
      title: 'Attempt chain repair (Re-mining)',
      instruction:
        'Click the "Re-mine From Block #1" button to see what is required to make the chain valid again.',
      explanation:
        'To conceal the modification, you had to re-mine Block #1, then re-calculate and re-mine Block #2, Block #3, and Block #4. In a real network with competing miners, doing this faster than the honest network is practically impossible.',
      hint: 'In Bitcoin, this is why the "longest valid chain" rule protects transaction history.',
    },
  ],
  challenge: {
    id: 'challenge-2',
    title: 'The 51% Attack Rationale',
    description:
      'Why does rewriting 10-block-old transaction history require more than 50% of the entire network’s hash power?',
    hint: 'Think about who produces new blocks faster: one attacker re-mining historical blocks or thousands of honest nodes extending the tip.',
    solutionExplanation:
      'While the attacker works backward to re-mine Block #10 forward, the honest network continues mining new blocks #20, #21, #22... The attacker can only catch up and overtake the chain tip if their sustained mining rate exceeds that of the entire rest of the network combined (>50%).',
  },
};
