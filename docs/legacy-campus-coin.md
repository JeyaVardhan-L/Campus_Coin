# Historical Retrospective: The Legacy Campus Coin Prototype

## Background

Before LedgerLab was conceived, this repository housed an early project called **Campus Coin** (also termed *G-Coin* or *G₹* in the codebase).

The project was developed in Java using standard desktop Swing components (`javax.swing`, Nimbus Look & Feel) and the Java Cryptography Architecture (`java.security`). It served as a proof-of-concept exploration of peer-to-peer digital cash on a university campus.

---

## Archaeological Analysis of the Original Codebase

The original prototype comprised six primary Java files:

### 1. `Block.java`
- Implemented basic block header fields: `timestamp`, `previousHash`, `nonce`, and an `ArrayList<Transaction>`.
- Calculated SHA-256 hashes by serializing fields into a single string.
- Included an iterative `mineBlock(int difficulty)` method that incremented the nonce until the hash began with a target number of leading zeros.

### 2. `Blockchain.java`
- Managed an `ArrayList<Block>` with an in-memory Genesis block.
- Maintained a list of `pendingTransactions` and provided a mining reward mechanism.
- Handled balance queries by iteratively scanning all historical transactions across the entire chain.
- Implemented `isChainValid()` to verify hash equality, previous hash links, and ECDSA transaction signatures.

### 3. `Transaction.java`
- Represented value transfers between a sender and receiver.
- Carried an ECDSA signature over the serialized transaction content and the sender's raw public key bytes.

### 4. `Wallet.java`
- Used `KeyPairGenerator.getInstance("EC")` to generate 256-bit elliptic curve key pairs (`secp256r1`).
- Derived addresses by taking the first 20 bytes of the public key's SHA-256 digest.
- Offered `sign()` and `verifySignature()` routines via `SHA256withECDSA`.

### 5. `CampusCoinUI.java`
- A Swing desktop application featuring tabs for Wallets, Sending Transactions, Mining, Blockchain Inspection, and "Live Stats".
- Contained a simulated market price ticker (`price = 50.0`) and price fluctuation timer, simulating speculative market movements.

### 6. `Main.java`
- A terminal-based CLI menu allowing users to create wallets, submit transactions, mine blocks, and inspect chain state from standard input.

---

## Why the Project Was Reimagined as LedgerLab

While the Campus Coin prototype demonstrated enthusiasm for blockchain mechanics, several fundamental limitations made it unsuitable as the basis for a modern educational tool:

1. **Desktop / JVM Friction**: Requiring a local Java Runtime Environment (JRE/JDK) and desktop windowing prevents instant browser access and mobile learning.
2. **Speculative Market Artifacts**: The fake price ticker and currency market simulation distracted from the fundamental engineering principles of consensus, immutability, and cryptography.
3. **Passive UI vs. Interactive Sandbox**: The Swing interface was designed as a static dashboard rather than an interactive laboratory where users can break things and watch the consequences.
4. **Architectural Coupling**: Blockchain logic, GUI event listeners, and terminal output were intertwined, making automated testing and headless execution difficult.

---

## What Was Preserved & How It Transformed

| Campus Coin (Java/Swing) | LedgerLab (TypeScript/React) | Notes |
| :--- | :--- | :--- |
| `campuscoin/Block.java` | `src/engine/block.ts` | Cleaned into pure functional domain model with testable verification and non-blocking mining. |
| `campuscoin/Blockchain.java` | `src/engine/blockchain.ts` | Strengthened with ancestor validity rules, cascading invalidation, and chain repair functions. |
| Single hash display | `src/components/labs/HashLab.tsx` | Expanded into a full laboratory with 256-bit binary streams and avalanche Hamming distance visualizers. |
| Static block table | `src/components/labs/BlockchainLab.tsx` | Transformed into an interactive visual chain where learners can tamper with any block and watch downstream links sever. |
| Text explanations | `src/components/education/LessonRunner.tsx` | Formalized into a structured, step-by-step curriculum with guided objectives and challenges. |
| Speculative price ticker | *Discarded* | Completely removed in accordance with LedgerLab's technical, non-speculative educational mission. |

---

## Preservation of Historical Artifacts

In accordance with good software archaeology practices, the entire historical Java codebase has been preserved in:

```text
legacy/campus-coin-java/
├── Block.java
├── Blockchain.java
├── CampusCoinUI.java
├── Main.java
├── Transaction.java
└── Wallet.java
```

It remains available as historical source material and a testament to the project's roots.
