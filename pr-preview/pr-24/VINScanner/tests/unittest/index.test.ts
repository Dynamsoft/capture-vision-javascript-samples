import { test, expect } from '@playwright/test';

/*
1. Test whether the license is valid
2. Test whether the cameraEnhancer is initialized and working properly
3. Test whether the cameraView is initialized and working properly
4. Test whether the cvRouter is initialized and working properly
5. Test whether the result can be populated and copied //TODO
*/

const URL = '/VINScanner/index.html';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
});

test('License is valid', async ({ page }) => {
  // Check if license error is displayed
  const licenseError = await page.evaluate(() => {
    try {
      const intermediateResultManager = cvRouter.getIntermediateResultManager();
      // If we get here without an error, the license supports intermediate results
      return false;
    } catch (error) {
      // Check if the error message matches the expected one
      return error.message === "The current license does not support the use of intermediate results.";
    }
    // return cameraEnhancer === undefined;
  });
  
  expect(licenseError).toBeFalsy();
});

test('CameraEnhancer is initialized and working', async ({ page }) => {
  await page.click('.start-btn');
  
  // Check if camera view is displayed
  const cameraView = await page.locator('.dce-video-container');
  await expect(cameraView).toBeVisible();
  const hasCameraEnhancer = await page.evaluate(() => {
    return typeof cameraEnhancer !== undefined;
  });
  expect(hasCameraEnhancer).toBeTruthy();
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
