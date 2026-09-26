# LedgerLab Glossary

A plain-English reference for core cryptographic and blockchain terminology used in LedgerLab.

---

### Cryptographic Hash (SHA-256)
A mathematical function that converts any piece of digital data into a fixed-length string of 64 hexadecimal characters (256 bits).
- **One-Way (Pre-image Resistance):** Given the data, calculating the hash is instantaneous. Given only the hash, mathematically reversing it back to the original data is computationally impossible.
- **Deterministic:** The exact same input will always produce the exact same hash, everywhere, every time.

---

### The Avalanche Effect
A property of secure cryptographic hash functions where changing even a single bit or punctuation mark in the input causes an unpredictable, dramatic change in approximately 50% of the output bits. This ensures that outputs cannot be correlated with inputs, making tampering instantly obvious.

---

### Block
A discrete data package containing a **Header** (metadata about the block) and a **Payload** (the recorded transaction data). In LedgerLab, each block contains:
- **Index:** The numerical height or sequential position of the block in the chain.
- **Timestamp:** The exact Unix time (in milliseconds) when the block was created or mined.
- **Data (Payload):** The transactions or messages stored in the block.
- **Previous Hash:** The cryptographic fingerprint of the parent block preceding it.
- **Nonce:** A counter changed repeatedly during mining.
- **Hash:** The cryptographic fingerprint of all header fields combined.

---

### Nonce ("Number used once")
An arbitrary 32-bit counter value in the block header. Because miners cannot change past history or legitimate transactions to satisfy the Proof-of-Work difficulty target, they increment this single number repeatedly until the block hash starts with the required number of leading zeros.

---

### Difficulty & Target Prefix
The mathematical rule governing how hard it is to mine a block.
- In Proof-of-Work, a valid block hash must be less than a certain threshold value, which in hex notation means starting with a specific number of leading zeros (`0`, `00`, `000`, etc.).
- Each additional leading zero increases the expected search time exponentially (by a factor of 16 in hexadecimal).

---

### Proof-of-Work (PoW) Mining
The process of repeatedly testing nonces to find a block hash that meets the network's difficulty target.
- Mining is intentionally computationally expensive to produce, but trivial for any other node on the network to verify (instant verification via a single SHA-256 computation).
- **Important Distinction:** Recalculating a hash simply updates the stored fingerprint to match current contents. Mining is what searches for a nonce that satisfies the difficulty target.

---

### Previous Hash (Parent Link)
The hash of the preceding block included directly inside the current block's header. Because the current block's hash depends on its header, and the header contains the previous block's hash, all blocks become cryptographically bound together in an unbreakable chronological chain.

---

### Genesis Block (Block #0)
The very first block created in a blockchain. Because it has no predecessor, its "Previous Hash" field is canonically filled with all zeros (`0000000000000000000000000000000000000000000000000000000000000000`).

---

### Cascading Invalidation
The domino effect caused when historical data is altered.
- Modifying data in Block #1 changes its hash.
- Block #2 still points to Block #1's old hash, breaking the cryptographic link between them.
- Because Block #2's link is severed, its own hash must change, breaking the link to Block #3, and so on.
- As a result, altering a single historical transaction invalidates every subsequent block in the entire chain.

---

### Re-mining & Tamper-Evidence
To make a tampered historical block appear valid again, an attacker must not only re-mine the modified block, but must sequentially re-mine every subsequent block in the chain.
- In LedgerLab, the simulator grants the learner 100% of the simulated mining power, so you can re-mine blocks easily.
- In a real distributed blockchain, an attacker would have to out-compute the combined computational power of the rest of the honest network (the "51% attack" threshold), making historical tampering practically impossible.
