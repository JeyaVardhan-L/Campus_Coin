# LedgerLab Education Model

## Pedagogical Principles

The education system in LedgerLab is designed around active learning rather than passive textbook reading.

Every concept is paired with an actionable experiment:
1. **Explain the objective**: Why does this concept matter?
2. **Provide immediate interaction**: The learner performs a concrete action.
3. **Show visual and mathematical feedback**: The system updates state in real time.
4. **Challenge the understanding**: A conceptual question or puzzle tests the learner's comprehension.

---

## Lesson Schema

Lessons are defined as pure TypeScript objects independent of UI components:

```typescript
interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  explanation: string;
  hint?: string;
  isCompleted?: boolean;
}

interface LessonChallenge {
  id: string;
  title: string;
  description: string;
  hint?: string;
  solutionExplanation: string;
}

interface Lesson {
  id: string;
  number: string;
  title: string;
  category: 'crypto' | 'blocks' | 'chain';
  estimatedMinutes: number;
  objective: string;
  background: string;
  steps: LessonStep[];
  challenge: LessonChallenge;
}
```

---

## Active Curriculum (MVP-01)

### Lesson 01: Why Hashes Matter & The Avalanche Effect
- **Focus**: Cryptographic one-way hashing and bit dispersion.
- **Key Takeaway**: A small 1-bit change in input causes a chaotic, unpredictable 50% change in output bits, rendering the output mathematically unguessable.

### Lesson 02: Block Linking & The Immutability Illusion
- **Focus**: Block structures, parent linkage, and cascading invalidation.
- **Key Takeaway**: Immutability is not an inherent property of digital storage; it is an economic and computational consequence of linked proof-of-work.

---

## Future Curriculum Modules

- **Unit 03: Wallets & Public-Key Cryptography**: Asymmetric key pairs, address derivation from public keys, and keeping private keys secure.
- **Unit 04: Transactions & Nonces**: Signing transactions, replay attacks, and why account nonces prevent re-execution of historical spending.
- **Unit 05: The Mempool & Transaction Ordering**: How unconfirmed transactions wait in memory pools, priority fees, and miner block construction.
- **Unit 06: Proof-of-Work Consensus**: Difficulty adjustment algorithms, target thresholds, and energy expenditure.
- **Unit 07: Attack Laboratory**: Double-spending, chain reorganization, network partitions, and 51% mining attacks.
