# LedgerLab Simulation Model

## Overview

The LedgerLab simulation engine models the data structures and consensus rules of a blockchain ledger. This document details the mathematical and domain representations used in the current version (MVP-01) and outlines the roadmap for future ledger states.

---

## 1. Block Data Model

Each block is composed of a **BlockHeader** and an associated cryptographic **hash**:

```typescript
interface BlockHeader {
  index: number;         // Height in the chain (0 = Genesis)
  previousHash: string;  // 64-character hex hash of parent block
  timestamp: number;     // Unix epoch timestamp in milliseconds
  data: string;          // Transaction payload or arbitrary string
  nonce: number;         // Arbitrary counter varied to satisfy difficulty
  difficulty: number;    // Number of leading zero hex characters required
}

interface Block extends BlockHeader {
  hash: string;          // 64-character hex SHA-256 digest of the header
}
```

### Canonical Serialization
To ensure determinism across different runs and browsers, block headers are serialized into a canonical pipe-delimited string before hashing:

$$\text{Payload} = \text{index} \mid \text{previousHash} \mid \text{timestamp} \mid \text{data} \mid \text{nonce} \mid \text{difficulty}$$

$$\text{Hash} = \text{SHA-256}(\text{Payload})$$

---

## 2. Chain Validation Rules

For a chain of blocks $[B_0, B_1, \dots, B_n]$ to be considered valid by the network:

1. **Genesis Predecessor**:
   The Genesis block $B_0$ must have its `previousHash` set to the canonical string of 64 zeros:
   $$B_0.\text{previousHash} = \text{"0000}\dots\text{0000"}$$

2. **Hash Integrity**:
   For every block $B_i$, its stored `hash` must exactly match the recomputation of its header:
   $$B_i.\text{hash} = \text{computeBlockHash}(B_i)$$

3. **Difficulty Target**:
   For every block $B_i$, its hash must begin with at least $B_i.\text{difficulty}$ zero characters:
   $$B_i.\text{hash}.\text{startsWith}(\text{"0"} \times B_i.\text{difficulty}) = \text{true}$$

4. **Cryptographic Parent Linkage**:
   For every block $B_i$ ($i > 0$), its `previousHash` field must match the current hash of the preceding block:
   $$B_i.\text{previousHash} = B_{i-1}.\text{hash}$$

5. **Ancestor Validity**:
   A block can only be valid if its predecessor block is also valid. If block $B_k$ is corrupted or tampered with, every block $B_{k+1}, B_{k+2}, \dots, B_n$ is immediately rejected by consensus.

---

## 3. Tampering and Repair Mechanics

### Tampering
When an attacker modifies historical data in block $B_k$:
1. $B_k.\text{data}$ changes.
2. $B_k$'s computed hash $\text{hash}'$ no longer equals its recorded hash $\rightarrow B_k$ is invalid.
3. If the attacker updates $B_k$'s recorded hash to $\text{hash}'$, then $B_{k+1}.\text{previousHash} \neq \text{hash}' \rightarrow B_{k+1}$ is invalid.
4. The invalidation propagates to the tip of the chain.

### Repair (Re-Mining)
To make the chain appear valid again, an attacker must:
1. Re-calculate $B_k$'s hash.
2. Search for a new nonce $B_k.\text{nonce}$ satisfying the difficulty target.
3. Update $B_{k+1}.\text{previousHash} = B_k.\text{hash}$.
4. Re-mine $B_{k+1}$ to find a new valid nonce.
5. Repeat for all subsequent blocks up to the current tip.

This mechanical simulation demonstrates why Proof-of-Work protects history: the deeper a block is buried under subsequent blocks, the more cumulative energy and work are required to rewrite it.

---

## 4. Planned Extensions (Future Milestones)

- **Account-Based State**:
  $$\text{Account} = \{\text{address: string}, \text{balance: bigint}, \text{nonce: number}\}$$
  Integer-based denomination (1 token = 1,000,000 base units) to prevent floating-point rounding errors.
- **Merkle Trees**:
  Binary hash trees for transaction sets within blocks to demonstrate SPV proof concepts.
- **Digital Signatures**:
  ECDSA transaction signing (`secp256k1` or `secp256r1`) verifying sender authorization.
