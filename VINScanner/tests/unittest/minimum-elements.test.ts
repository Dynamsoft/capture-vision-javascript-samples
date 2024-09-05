import { test, expect } from '@playwright/test';
import path from 'path';

// const URL = `file:${path.join(__dirname, "../../minimum-elements.html")}`;
const HTML_FILE = path.join(__dirname, '../../minimum-elements.html');

test.beforeEach(async ({ page }) => {
    await page.goto(`file://${HTML_FILE}`);
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

test('should have correct scan type butotns', async ({ page }) => {
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



// test('should have SCAN_MODES array defined', async () => {
//     const scanModes = document.getElementById('scan-modes');
//     expect(window.SCAN_MODES).toEqual(['barcode', 'text', 'both']);
// });

// test('should have SCAN_TEMPLATES object defined', async () => {
//     expect(typeof dom.window.SCAN_TEMPLATES).toBe('object');
//     expect(dom.window.SCAN_TEMPLATES).toEqual({
//         barcode: 'ReadVINBarcode',
//         text: 'ReadVINText',
//         both: 'ReadVIN',
//     });
// });

// test('should have SCAN_MODE_TITLES object defined', async () => {
//     expect(typeof dom.window.SCAN_MODE_TITLES).toBe('object');
//     expect(dom.window.SCAN_MODE_TITLES).toEqual({
//         barcode: 'Scan by Barcode',
//         text: 'Scan by Text',
//         both: 'Scan Text or Barcode',
//     });
// });

// test('should have extractVinDetails function defined', async () => {
//     expect(typeof dom.window.extractVinDetails).toBe('function');
//     });

//     test('should have formatVin function defined', async () => {
//     expect(typeof dom.window.formatVin).toBe('function');
// });