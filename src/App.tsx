import { useState } from 'react';
import { HashLab } from './components/labs/HashLab';
import { BlockLab } from './components/labs/BlockLab';
import { BlockchainLab } from './components/labs/BlockchainLab';
import { LessonRunner } from './components/education/LessonRunner';

export type LabTab = 'hash' | 'block' | 'blockchain' | 'lessons';

export default function App() {
  const [activeTab, setActiveTab] = useState<LabTab>('hash');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(8, 12, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
                fontWeight: 'bold',
                fontFamily: 'var(--font-mono)',
              }}
            >
              LL
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#fff',
                  }}
                >
                  LedgerLab
                </span>
                <span className="badge badge-cyan">v0.1.0-alpha</span>
                <span className="badge badge-amber">Interactive Simulation</span>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginTop: '1px',
                }}
              >
                An interactive laboratory for understanding blockchains.
              </p>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '8px' }}>
            {(['hash', 'block', 'blockchain', 'lessons'] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.8125rem',
                  padding: '6px 14px',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'blockchain' ? 'Blockchain Lab' : `${tab} Lab`}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '24px',
        }}
      >
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
            {activeTab === 'hash' && 'Cryptographic Hash Laboratory'}
            {activeTab === 'block' && 'Single Block Inspector & Mining'}
            {activeTab === 'blockchain' && 'Multi-Block Chain & Tamper Laboratory'}
            {activeTab === 'lessons' && 'Guided Curriculum & Challenges'}
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            {activeTab === 'hash' &&
              'Explore one-way SHA-256 hashing and the dramatic avalanche effect.'}
            {activeTab === 'block' &&
              'Inspect internal block headers, cryptographic linkage, and proof-of-work mining.'}
            {activeTab === 'blockchain' &&
              'Experiment with downstream chain invalidation when historical blocks are tampered with.'}
            {activeTab === 'lessons' &&
              'Step-by-step interactive exercises to test your understanding.'}
          </p>
        </div>

        {activeTab === 'hash' && <HashLab />}
        {activeTab === 'block' && <BlockLab />}
        {activeTab === 'blockchain' && <BlockchainLab />}
        {activeTab === 'lessons' && <LessonRunner onNavigateTab={setActiveTab} />}
      </main>

      {/* Educational Disclaimer Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(8, 12, 20, 0.9)',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <p>
          <strong style={{ color: 'var(--text-secondary)' }}>
            Educational Simulation Notice:
          </strong>{' '}
          LedgerLab is an educational laboratory for understanding blockchain mechanics.
          It does not manage, store, or transmit real cryptocurrency. Keys and data
          generated in LedgerLab are purely simulated.
        </p>
      </footer>
    </div>
  );
}
