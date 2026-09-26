import { Lesson } from '../types';

export const hashingLesson: Lesson = {
  id: '01-hashes-matter',
  number: '01',
  title: 'Why Hashes Matter & The Avalanche Effect',
  category: 'crypto',
  estimatedMinutes: 5,
  objective:
    'Understand how cryptographic hash functions map arbitrary inputs into fixed-length fingerprints, and why the avalanche effect makes them tamper-evident.',
  background:
    'A cryptographic hash function like SHA-256 takes input of any size and produces a fixed 256-bit output. Unlike ordinary checksums, a cryptographic hash is one-way (pre-image resistant) and unpredictable (avalanche effect).',
  steps: [
    {
      id: 'step-1',
      title: 'Enter arbitrary text in Hash Lab',
      instruction:
        'Navigate to the Hash Lab tab (or click "Open Hash Lab" on the left) and type any message or phrase into the input field.',
      explanation:
        'Notice how quickly the hash is computed. Whether your input is 1 letter or 10,000 words, SHA-256 always outputs exactly 64 hexadecimal characters (256 bits).',
      hint: 'Try words like "Hello, world!" or "Genesis block payload".',
    },
    {
      id: 'step-2',
      title: 'Change a single character',
      instruction:
        'In Hash Lab, modify just one letter or punctuation mark in the input data.',
      explanation:
        'Observe how completely the output changes. The new hash bears no visual or mathematical resemblance to the previous one.',
      hint: 'Change an uppercase letter to lowercase or append an exclamation mark.',
    },
    {
      id: 'step-3',
      title: 'Examine the 256-bit Avalanche Visualizer',
      instruction:
        'In Hash Lab, look at the difference matrix in the Avalanche Visualizer. Count how many of the 256 bits flipped.',
      explanation:
        'In a secure cryptographic hash function, changing just 1 bit in the input flips roughly 50% of the output bits (~128 bits). This ensures small tampering creates massive, unmistakable differences.',
      hint: 'Notice that identical inputs always yield the exact same hash (determinism).',
    },
  ],
  challenge: {
    id: 'challenge-1',
    title: 'The Pre-Image Resistance Challenge',
    description:
      'Can you manually guess an input text that produces a hash starting with "0000"? Why is this computationally difficult?',
    hint: 'Because the avalanche effect randomizes the output bits, the only known way to find a target hash is brute-force trial and error (mining!).',
    solutionExplanation:
      'With SHA-256, each hexadecimal character represents 4 bits. Finding 4 leading zeros requires an average of 16^4 = 65,536 trials. This mathematical property is the foundation of Proof-of-Work consensus.',
  },
};
