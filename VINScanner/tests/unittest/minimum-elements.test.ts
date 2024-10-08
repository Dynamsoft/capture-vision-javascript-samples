import { test, expect } from '@playwright/test';


/*
1. Test whether the page title is valid
2. Test whether the main heading is correct
3. Test all scan type buttons exist and visible
4. Test whether the cameraView is initialized and working properly
5. Test if the result container is initialized and visible
*/

const URL = '/minimum-elements.html';

test.beforeEach(async ({ page }) => {
    await page.goto(URL);
});
  

test('should have correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBe("VIN Scanner - Minimum elements");
});

test('should have main heading', async ({ page }) => {
    const h1 = await page.locator('h1');
    expect(h1).not.toBeNull();
    await expect(h1).toHaveText('Scan VIN - Minimum elements');
});

test('should have scan title element', async ({ page }) => {
    const scanTitle = await page.locator('#scan-title');
    expect(scanTitle).not.toBeNull();
});

test('should have correct scan type buttons', async ({ page }) => {
    const scanBothBtn = await page.locator('#scan-both-btn');
    const scanTextBtn = await page.locator('#scan-text-btn');
    const scanBarcodeBtn = await page.locator('#scan-barcode-btn');
    
    await expect(scanBothBtn).toHaveText('Scan Text or Barcode');
    await expect(scanTextBtn).toHaveText('Scan Text Only');
    await expect(scanBarcodeBtn).toHaveText('Scan Barcode Only');
});

test('should have camera view container', async ({ page }) => {
    const cameraViewContainer = await page.locator('#camera-view-container');
    await expect(cameraViewContainer).toBeVisible();

    const boundingBox = await cameraViewContainer.boundingBox();

    const viewportSize = page.viewportSize();
    expect(boundingBox?.height).toBeCloseTo(viewportSize!.height * 0.4, -1);
});

test('should have result containers', async ({ page }) => {
    const resultImageContainer = await page.locator('#result-image-container');
    const resultsContainer = await page.locator('#results');
    expect(resultImageContainer).not.toBeNull();
    expect(resultsContainer).not.toBeNull();
});
