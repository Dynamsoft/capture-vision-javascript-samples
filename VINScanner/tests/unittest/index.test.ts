import { test, expect } from '@playwright/test';

/*
1. Test whether the license is valid
2. Test whether the cameraEnhancer is initialized and working properly
3. Test whether the cameraView is initialized and working properly
4. Test whether the cvRouter is initialized and working properly
5. Test whether the result is initialized and working properly
*/

// const URL = 'http://localhost:5173/VINScanner';
const URL = 'https://192.168.1.178:5504/VINScanner/';

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

// test('Result can be populated correctly', async ({ page }) => {
//   //TODO: Parse a VIN to generate a result
  
//   // Check if result is displayed
//   // const resultText = await page.locator('.parsed-result-main');
//   // await expect(resultText).toContainText('');
//   // await page.click('.start-btn');
  
//   // // Simulate a VIN scan result
//   // await page.evaluate(() => {
//   //   window.dispatchEvent(new CustomEvent('cvRouterResultReady', { 
//   //     detail: { results: [{ text: 'WBAJB0C51JB084264' }] }
//   //   }));
//   // });
  
//   // // Check if copy result button is displayed and functional
//   // const copyButton = await page.locator('.copy-result-btn');
//   // await expect(copyButton).toBeVisible();
//   // await copyButton.click();
  
//   // // Check if save image button is displayed
//   // const saveButton = await page.locator('.save-image-btn');
//   // await expect(saveButton).toBeVisible();
// });
