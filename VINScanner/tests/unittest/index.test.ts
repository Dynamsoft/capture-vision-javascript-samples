import { test, expect } from '@playwright/test';

/*
1. Test whether the license is valid
2. Test whether the cameraEnhancer is initialized and working properly
3. Test whether the cameraView is initialized and working properly
4. Test whether the cvRouter is initialized and working properly
*/


const URL = '/VINScanner/index.html';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
});

test('License is valid', async ({ page }) => {
  // Check if license error is displayed
  const licenseError = await page.evaluate(() => {
    return cameraEnhancer === undefined;
  });
  
  expect(licenseError).toBeFalsy();
});

test('CameraEnhancer is initialized and working', async ({ page }) => {
  await page.click('.start-btn');
  
  // Check if camera view is displayed
  const cameraView = await page.locator('.dce-video-container');
  await expect(cameraView).toBeVisible();
  
  // Check if camera is streaming
  const videoElement = await page.locator('.dce-video-container video');
  // Add a 2 seconds delay
  await page.waitForTimeout(2000);
  const isPlaying = await videoElement.evaluate((video: HTMLVideoElement) => !video.paused && !video.ended && video.readyState > 2);
  expect(isPlaying).toBeTruthy();
});

test('CameraView is initialized and working', async ({ page }) => {
  await page.click('.start-btn');
  
  // Check if scan region is displayed
  const scanRegion = await page.locator('.dce-scanarea');
  await expect(scanRegion).toBeVisible();
});

test('CVRouter is initialized and working', async ({ page }) => {
  const hasCVRouter = await page.evaluate(() => {
    return cvRouter !== undefined;
  });
  expect(hasCVRouter).toBeTruthy();

});
