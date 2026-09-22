import { test, expect } from '@playwright/test';

test.describe('LedgerLab Browser Smoke Tests', () => {
  test('loads home view and executes core lab interactions', async ({ page }) => {
    // 1. Visit the app
    await page.goto('/');

    // Check title and branding
    await expect(page).toHaveTitle(/LedgerLab/);
    await expect(page.locator('header')).toContainText('LedgerLab');
    await expect(page.locator('header')).toContainText('An interactive laboratory for understanding blockchains.');

    // 2. Hash Lab verification
    const hashInput = page.locator('#hash-input');
    await expect(hashInput).toBeVisible();
    await hashInput.fill('LedgerLab Smoke Test Vector');

    const hashOutput = page.locator('#hash-output');
    await expect(hashOutput).toBeVisible();
    const hashText = await hashOutput.innerText();
    expect(hashText.trim()).toHaveLength(64);

    // Verify avalanche section is visible
    await expect(page.locator('#avalanche-stats')).toBeVisible();

    // 3. Block Lab navigation & interaction
    await page.click('#tab-block');
    await expect(page.locator('h3:has-text("Block #1")')).toBeVisible();

    const blockDataInput = page.locator('#block-data');
    await expect(blockDataInput).toBeVisible();
    await blockDataInput.fill('Tampered block payload in smoke test');

    // Should show invalid badge or hash mismatch
    await expect(page.locator('text=Hash Mismatch (Tampered)')).toBeVisible();

    // 4. Blockchain Lab navigation & cascading invalidation
    await page.click('#tab-blockchain');
    await expect(page.locator('#blockchain-container')).toBeVisible();

    // Initially valid
    await expect(page.locator('text=Chain Integrity: Valid')).toBeVisible();

    // Tamper with Block #1 data
    const chainBlock1Data = page.locator('#block-data-1');
    await chainBlock1Data.fill('Malicious transaction injection');

    // Verify chain integrity broken
    await expect(page.locator('text=Chain Integrity: Broken (Tampered)')).toBeVisible();
    await expect(page.locator('text=Cascading Invalidation in Action')).toBeVisible();

    // Reset chain
    await page.click('#reset-chain-btn');
    await expect(page.locator('text=Chain Integrity: Valid')).toBeVisible();

    // 5. Lessons Tab navigation
    await page.click('#tab-lessons');
    await expect(page.locator('h3:has-text("Curriculum Units")')).toBeVisible();
    await expect(
      page.locator('h2:has-text("Why Hashes Matter & The Avalanche Effect")'),
    ).toBeVisible();
  });
});
