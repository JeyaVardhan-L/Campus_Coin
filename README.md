# LedgerLab

> **An interactive laboratory for understanding blockchains.**

LedgerLab is an open-source, browser-based blockchain laboratory where you learn cryptography, transactions, consensus, and attacks by experimenting with a simulated network.

[![CI](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-20%20passed-emerald)]()
[![E2E](https://img.shields.io/badge/e2e-playwright%20verified-blue)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 1. What LedgerLab Is

LedgerLab is an interactive technical workbench for demystifying blockchains through hands-on experimentation.

Instead of reading abstract prose about cryptographic hashes and consensus, learners directly manipulate inputs, observe cryptographic outputs, inspect block headers, and **deliberately break simulated chains** to understand why blockchain protocols are constructed the way they are.

### What LedgerLab is NOT
- ❌ Not a real cryptocurrency or trading network
- ❌ Not a wallet for real digital assets
- ❌ Not a financial speculation tool or token exchange
- ❌ Not a production blockchain implementation

---

## 2. Why It Exists

Most resources explaining blockchains fall into two extremes:
1. **Speculative hype**: Trading jargon, market speculation, and price charts.
2. **Abstract academic theory**: Mathematical papers without intuitive, visual mental models.

LedgerLab exists to bridge this gap following a core learning philosophy:

```text
LEARN ➔ INTERACT ➔ BREAK ➔ OBSERVE ➔ UNDERSTAND ➔ EXPERIMENT
```

By allowing learners to edit historical blocks, tamper with transactions, watch downstream invalidation cascade through time, and re-mine chains, the underlying mechanisms become immediately clear.

---

## 3. What You Can Learn

- **Cryptographic Hashes**: How SHA-256 creates deterministic, one-way fingerprints of arbitrary data.
- **The Avalanche Effect**: Why flipping even 1 bit in an input flips approximately 50% of output bits.
- **Block Anatomy**: How index, timestamp, previous hash, payload data, and nonces are bound together.
- **Chain Immutability & Linkage**: Why historical blocks cannot be changed without invalidating every subsequent block.
- **Proof-of-Work Mining**: How difficulty targets force computational work to establish consensus.
- **Attack Mechanics**: How tampering is detected and why rewriting history requires overwhelming computational power.

---

## 4. Current Status: MVP-01 Foundation

| Feature Area | Status | Description |
| :--- | :--- | :--- |
| **Hash Lab** | `Implemented` | Real-time SHA-256 calculator, 256-bit binary stream, and live avalanche visualizer with Hamming distance metrics. |
| **Block Lab** | `Implemented` | Single block inspector, editable fields, live hash computation, validity status, and target difficulty mining. |
| **Blockchain Lab** | `Implemented` | 4-block linked chain with visual connectors, real-time cascading downstream invalidation, and chain repair re-mining. |
| **Education Engine** | `Implemented` | Guided curriculum runner with Lesson 01 (Hashes) and Lesson 02 (Chain Integrity) including challenges. |
| **Account & Wallet Lab** | `Planned` | Public/private keypairs, address derivation, and account state model. |
| **Transaction Lab** | `Planned` | Digital signatures, nonce verification, and mempool simulation. |
| **Web Worker Mining** | `Planned` | Background thread worker for high-difficulty Proof-of-Work simulations without main thread delay. |
| **Network & Attack Lab** | `Planned` | Multi-node gossip propagation, simulated latency, chain splits, and 51% attack demonstrations. |

---

## 5. Architecture

LedgerLab is engineered as a **browser-first, client-side, static application**:

```text
src/
├── crypto/          # Cryptographic primitives (SHA-256, avalanche calculator)
├── engine/          # Deterministic blockchain simulation engine (Block, Blockchain)
├── education/       # Curriculum schema, lesson catalog, step definitions
├── components/      # React UI modules (HashLab, BlockLab, BlockchainLab, LessonRunner)
└── styles/          # Dark laboratory design tokens and styling
```

### Architectural Guarantees
- **Zero Backend**: All calculations run locally in the browser using Web Crypto and standard TypeScript.
- **Zero Financial Data**: No price charts, market tickers, or trading mechanics.
- **Engine / UI Separation**: The simulation engine contains zero UI-specific code and is 100% testable in isolation.
- **Static Deployment**: Compiles directly to static HTML/CSS/JS for GitHub Pages or Cloudflare Pages.

---

## 6. Getting Started

### Prerequisites
- Node.js v18+ (Node 22 LTS recommended)
- npm v9+

### Installation
```bash
# Clone the repository
git clone https://github.com/JeyaVardhan-L/Campus_Coin.git
cd Campus_Coin

# Install dependencies
npm install
```

---

## 7. Development Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run unit test suite (Vitest)
npm test

# Run browser end-to-end smoke tests (Playwright)
npm run test:e2e

# Run TypeScript type check and production bundle build
npm run build

# Run ESLint validation
npm run lint

# Check code formatting (Prettier)
npm run format:check
```

---

## 8. Educational Safety Disclaimer

> [!CAUTION]
> **LedgerLab is strictly an educational simulation.**
> - It does not generate, store, transmit, or custody real cryptocurrencies.
> - Any cryptographic keys, signatures, addresses, or transactions generated inside LedgerLab are for laboratory demonstration only.
> - **Never** import keys generated in LedgerLab into production cryptocurrency wallets or mainnet networks.

---

## 9. Historical Origin: Legacy Campus Coin Prototype

LedgerLab is the direct reimagining and successor to **Campus Coin**, an early desktop prototype built in Java and Swing (`javax.swing`).

The original Java source code has been preserved in its entirety for historical reference in the [`legacy/campus-coin-java/`](./legacy/campus-coin-java/) directory. For an in-depth retrospective and analysis of the transition from Campus Coin to LedgerLab, see [`docs/legacy-campus-coin.md`](./docs/legacy-campus-coin.md).

---

## 10. Contributing

We welcome educational contributions, bug reports, and lesson proposals!
Please review the architecture guidelines before submitting pull requests:
1. All simulation domain logic belongs in `src/engine/` or `src/crypto/` with comprehensive unit tests.
2. The UI must maintain the restrained, dark laboratory visual identity.
3. No speculative financial language or crypto market features.

---

## 11. License

LedgerLab is licensed under the [MIT License](./LICENSE).
