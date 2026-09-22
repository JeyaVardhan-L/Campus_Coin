# LedgerLab Product Roadmap

This roadmap documents the phased evolution of LedgerLab from its foundational MVP to a comprehensive interactive blockchain laboratory.

---

## Milestone 1: Foundation (MVP-01) — Current Release
**Focus**: Core cryptographic hashing, single block mechanics, chain linkage, and initial educational lessons.

- [x] Clean archival of legacy Campus Coin Java prototype (`legacy/`)
- [x] Modern browser-first TypeScript + React + Vite architecture
- [x] Standard SHA-256 implementation with synchronous rendering and Web Crypto compatibility
- [x] Interactive Hash Lab with 256-bit binary stream view and real-time avalanche visualizer
- [x] Interactive Block Lab with editable headers, hash verification, and difficulty mining
- [x] Interactive Blockchain Lab with 4 linked blocks, live tampering, and cascading invalidation
- [x] Education Engine with Lesson 01 (Hashes) and Lesson 02 (Chain Integrity)
- [x] Vitest unit test suite (20 tests covering crypto, blocks, chain, and education)
- [x] Playwright browser smoke test suite
- [x] Comprehensive documentation and MIT open-source licensing

---

## Milestone 2: Accounts, Wallets & Transactions (MVP-02)
**Focus**: Cryptographic identity, signing, and state transitions.

- [ ] Web Crypto ECDSA keypair generation (`secp256r1` / `P-256`)
- [ ] Address derivation from public keys
- [ ] Account-based ledger model with balance tracking and nonce counters
- [ ] Transaction creation, signing, and signature verification
- [ ] Nonce replay attack demonstration: attempting to submit the same signed transaction twice
- [ ] Guided lesson on digital signatures and transaction authorization

---

## Milestone 3: Mempool, Mining & Web Workers (MVP-03)
**Focus**: Background computation and block assembly.

- [ ] Web Worker mining thread to execute high-difficulty Proof-of-Work without freezing the UI
- [ ] Live mining metrics display: hash rate (kH/s, MH/s), total attempts, elapsed time
- [ ] Simulated mempool (pending transaction pool)
- [ ] Miner block selection and transaction fees
- [ ] Merkle tree calculation for block transactions with visual branch inspection

---

## Milestone 4: Simulated Network & Consensus (MVP-04)
**Focus**: Distributed systems without servers.

- [ ] Deterministic in-memory node network (Node A, Node B, Node C)
- [ ] Gossip protocol message propagation with configurable latency
- [ ] Competing blocks and chain forks
- [ ] Longest valid chain selection rule visualization
- [ ] Network partition simulation (splitting nodes into isolated groups)

---

## Milestone 5: The Attack Laboratory (MVP-05)
**Focus**: Security engineering through controlled exploitation.

- [ ] Double-spend experiment
- [ ] 51% mining attack simulator: observing what the majority miner can and cannot alter
- [ ] Selfish mining demonstration
- [ ] Eclipse attack simulation
- [ ] Interactive defense challenges for students
