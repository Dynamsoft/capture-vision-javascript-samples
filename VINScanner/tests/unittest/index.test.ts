import { test, expect } from '@playwright/test';
import { join } from 'path';

test.describe('VINScanner', () => {
  test('should load the VINScanner page', async ({ page }) => {
    // Load the HTML file
    await page.goto(`file:${join(__dirname, '../../index.html')}`);

    // Check if the page title is correct
    await expect(page).toHaveTitle('VIN Scanner');

    // Check if the main elements are present
    await expect(page.locator('#video')).toBeVisible();
    await expect(page.locator('#canvas')).toBeVisible();
    await expect(page.locator('#result')).toBeVisible();
    await expect(page.locator('#start-button')).toBeVisible();
  });

  test('should start scanning when the start button is clicked', async ({ page }) => {
    await page.goto(`file:${join(__dirname, '../../index.html')}`);

    // Click the start button
    await page.click('#start-button');

    // Check if the video element is now playing
    const isPlaying = await page.evaluate(() => {
      const video = document.querySelector('#video') as HTMLVideoElement;
      return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    });

    expect(isPlaying).toBeTruthy();
  });

  // Add more tests as needed for other functionalities
});
