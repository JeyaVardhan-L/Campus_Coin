# LedgerLab Architecture

## System Overview

LedgerLab is designed as a **browser-first, client-side, zero-backend** application. It runs entirely inside the user's browser, enabling instant access, zero operating infrastructure costs, complete offline capability, and guaranteed cryptographic safety (simulated keys never leave the client).

```text
┌─────────────────────────────────────────────────────────────┐
│                      LedgerLab Web App                      │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React 18 + CSS Tokens)                 │
│  ├── HashLab        ├── BlockLab       ├── BlockchainLab   │
│  └── LessonRunner   └── UI Components                       │
├─────────────────────────────────────────────────────────────┤
│  Education Layer (Pure TypeScript)                          │
│  ├── Lesson Registry                                        │
│  ├── Step State Machine                                     │
│  └── Conceptual Challenges                                  │
├─────────────────────────────────────────────────────────────┤
│  Simulation Engine (Pure TypeScript)                        │
│  ├── Block Creation & Mining                                │
│  ├── Chain Linkage & Validation                             │
│  └── Tampering & Repair Mechanics                           │
├─────────────────────────────────────────────────────────────┤
│  Cryptographic Foundation                                   │
│  ├── FIPS 180-4 SHA-256 Engine                              │
│  ├── Web Crypto Subtle API                                  │
│  └── Avalanche Bitwise Distance Metric                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Zero Backend & Static Deployment
- **Why**: Eliminates server maintenance, hosting expenses, and latency.
- **Benefit**: Can be deployed to GitHub Pages, Cloudflare Pages, Vercel, or run completely offline from local storage.

### 2. Pure Synchronous Engine with Asynchronous Compatibility
- **Why**: When learners type into an input field, the calculated hash and downstream chain validation must update immediately on every keystroke without async flickering or promise delays.
- **Implementation**: A pure TypeScript implementation of standard SHA-256 provides synchronous, deterministic hashing for UI renders, while standard Web Crypto (`crypto.subtle.digest`) is preserved for asynchronous benchmarking.

### 3. Separation of Engine from React
- The simulation engine in `src/engine/` has zero dependencies on React, hooks, DOM elements, or UI state.
- It can be imported and executed in unit tests, command-line runners, or background Web Workers without modification.

### 4. Non-Blocking Mining
- Proof-of-Work mining loops can easily hang single-threaded JavaScript execution.
- LedgerLab implements iterative step-mining (`mineBlockStep`) to chunk work across frames, maintaining a smooth 60 FPS UI while mining.
- A dedicated Web Worker pipeline is slated for high-difficulty simulations in future milestones.

### 5. Monospace Technical Styling
- The design system prioritizes legibility of technical data:
  - Hashes and binary bitstreams use monospace typography (`JetBrains Mono`, `Consolas`).
  - Dark-first aesthetic minimizes visual fatigue during laboratory sessions.
  - No flashy crypto marketing elements (no candlestick charts, no rocket emojis, no speculative tokens).
