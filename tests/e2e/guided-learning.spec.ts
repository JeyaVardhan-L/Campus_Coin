import { test, expect } from '@playwright/test';

test.describe('LedgerLab Guided Learning Journey', () => {
  test('guides a first-time learner from Onboarding through Hashes, Blocks, Blockchain to Challenge', async ({
    page,
  }) => {
    // 1. Initial Page Load & Onboarding Hero
    await page.goto('/');

    const onboardingHero = page.locator('#onboarding-hero');
    await expect(onboardingHero).toBeVisible();
    await expect(onboardingHero).toContainText('Start Here');
    await expect(onboardingHero).toContainText('Zero Speculation • Zero Financial Tokens');
    await expect(onboardingHero).toContainText('STAGE 01');
    await expect(onboardingHero).toContainText('STAGE 02');
    await expect(onboardingHero).toContainText('STAGE 03');
    await expect(onboardingHero).toContainText('STAGE 04');

    const startBtn = page.locator('#start-guided-journey-btn');
    const sandboxesBtn = page.locator('#explore-sandboxes-btn');
    await expect(startBtn).toBeVisible();
    await expect(sandboxesBtn).toBeVisible();

    // 2. Start Guided Journey -> Stage 01: Hash Lab
    await startBtn.click();

    // Verify Guided Mode is enabled
    const modeBtn = page.locator('#mode-toggle-btn');
    await expect(modeBtn).toContainText('Guided Journey');

    // Stage 01 Mission Panel should be present
    const hashMission = page.locator('#mission-panel-hash');
    await expect(hashMission).toBeVisible();
    await expect(hashMission).toContainText('Stage 01');
    await expect(hashMission).toContainText('Cryptographic Hashes — Guided Mission');
    await expect(hashMission).toContainText('Try This');
    await expect(hashMission).toContainText('Observe');
    await expect(hashMission).toContainText('Why It Matters');

    // Hash Lab Core Interactions
    const hashInput = page.locator('#hash-input');
    await hashInput.fill('Hello, world!');

    const hashOutput = page.locator('#hash-output');
    const initialHash = (await hashOutput.innerText()).trim();
    expect(initialHash).toHaveLength(64);

    // Minor edit demonstrates avalanche effect
    await hashInput.fill('Hello, world?');
    const alteredHash = (await hashOutput.innerText()).trim();
    expect(alteredHash).toHaveLength(64);
    expect(alteredHash).not.toEqual(initialHash);
    await expect(page.locator('#avalanche-stats')).toBeVisible();

    // 3. Stage 01 -> Stage 02: Block Lab
    const hashNextBtn = page.locator('#hash-next-btn');
    await expect(hashNextBtn).toBeVisible();
    await hashNextBtn.click();

    // Verify Block Lab is active
    await expect(page.locator('h3:has-text("Block #1")')).toBeVisible();
    const blockMission = page.locator('#mission-panel-block');
    await expect(blockMission).toBeVisible();
    await expect(blockMission).toContainText('Stage 02');
    await expect(blockMission).toContainText('Block Structure & Proof-of-Work');

    // Verify plain-English recalculate button exists
    const recalculateBtn = page.locator('#recalculate-hash-btn');
    await expect(recalculateBtn).toBeVisible();
    await expect(recalculateBtn).toContainText('Recalculate Hash');

    // Tamper with Block 1 data
    const blockData = page.locator('#block-data');
    await blockData.fill('Alice transferred 1000 tokens to Bob');
    await expect(page.locator('#block-card')).toContainText('Hash Mismatch (Tampered)');

    // Mine block to restore validity with proof-of-work
    const mineBtn = page.locator('#mine-block-btn');
    await expect(mineBtn).toBeVisible();
    await mineBtn.click();

    // Wait for mining to complete
    await expect(page.locator('#block-card')).toContainText('Valid Block', {
      timeout: 10000,
    });

    // 4. Stage 02 -> Stage 03: Blockchain Lab
    const blockNextBtn = page.locator('#block-next-btn');
    await expect(blockNextBtn).toBeVisible();
    await blockNextBtn.click();

    // Verify Blockchain Lab is active
    await expect(page.locator('#blockchain-container')).toBeVisible();
    const chainMission = page.locator('#mission-panel-blockchain');
    await expect(chainMission).toBeVisible();
    await expect(chainMission).toContainText('Stage 03');
    await expect(chainMission).toContainText('The Blockchain & Cascading Invalidation');

    // Verify initial chain integrity
    await expect(page.locator('text=Chain Integrity: Valid')).toBeVisible();

    // Tamper with historical Block #1
    const block1Input = page.locator('#block-data-1');
    await block1Input.fill('Altered past ledger entry');

    // Observe cascading invalidation
    await expect(page.locator('text=Chain Integrity: Broken (Tampered)')).toBeVisible();
    await expect(page.locator('text=Cascading Invalidation in Action')).toBeVisible();

    // Reset chain back to valid state
    const resetChainBtn = page.locator('#reset-chain-btn');
    await resetChainBtn.click();
    await expect(page.locator('text=Chain Integrity: Valid')).toBeVisible();

    // 5. Stage 03 -> Stage 04: Conceptual Challenge / Lessons
    const chainNextBtn = page.locator('#blockchain-next-btn');
    await expect(chainNextBtn).toBeVisible();
    await chainNextBtn.click();

    // Verify Lessons tab is active and graduation challenge is displayed
    await expect(page.locator('#graduation-challenge-card')).toBeVisible();
    await expect(page.locator('#graduation-challenge-card')).toContainText(
      'Learning Path Complete: Take the Conceptual Challenge',
    );

    // 6. Mode Switcher: Toggle between Guided Journey and Free Sandbox
    await modeBtn.click();
    await expect(modeBtn).toContainText('Free Sandbox');

    // Switch back to Hash Lab in Free Sandbox mode - mission panel should be hidden
    await page.click('#tab-hash');
    await expect(page.locator('#mission-panel-hash')).toHaveCount(0);

    // Switch mode back to Guided Journey - mission panel should reappear
    await modeBtn.click();
    await expect(modeBtn).toContainText('Guided Journey');
    await expect(page.locator('#mission-panel-hash')).toBeVisible();
  });
});
