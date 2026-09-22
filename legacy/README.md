# Legacy Campus Coin Prototype (Java / Swing)

This directory contains the original historical source code of the **Campus Coin** prototype, created as an initial desktop exploration of blockchain and cryptocurrency concepts.

---

## Historical Context

- **Original Project Name**: Campus Coin (also referenced in the UI as *G-Coin* / *G₹*)
- **Implementation**: Java (JDK 8+) with a Swing desktop user interface (`javax.swing`, Nimbus Look & Feel)
- **Primary Components**:
  - `Block.java`: Basic block structure with SHA-256 hashing and iterative Proof-of-Work mining.
  - `Blockchain.java`: In-memory list of blocks, mining reward logic, and balance calculation.
  - `Transaction.java`: Simple transaction representation with ECDSA signature verification.
  - `Wallet.java`: EC key pair generation (`secp256r1`) and message signing.
  - `CampusCoinUI.java`: Swing GUI with wallet creation, transaction dispatch, mining triggers, and a simulated price ticker.
  - `Main.java`: Interactive CLI terminal menu.

---

## Status & Relationship to LedgerLab

1. **Not Active**: This Java/Swing code is **no longer the active implementation** and is not maintained.
2. **Successor**: **LedgerLab** is the modern browser-first, client-side TypeScript successor to Campus Coin.
3. **Reference Only**: This code is preserved strictly for **historical, archival, and reference purposes**.
4. **Security Notice**: This code was an educational demonstration prototype. It was not audited, lacks robust error handling and cryptographic security standards, and must **not** be used in production or with real assets.

---

For the modern interactive simulation laboratory, please refer to the root project documentation and the `src/` directory.
