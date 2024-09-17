import { test, expect } from '../fixtures';

// Adding userAgent to avoid firefox headless mode to block the script as it is being detected as bot.
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"; 


test.describe.configure({ mode: 'serial' });

test.describe("Verify the VIN Scanner Page title and veirfy user can select different settings", () => {
  test.use({userAgent});

  test.beforeEach(async ({ vinScannerPage }) => {
    
    // Mock the camera
    await vinScannerPage.grantCameraPermission();
    
    // Navigate to the VIN Scanner page
    await vinScannerPage.navigateTo();
  });

  test("should display the correct title", async ({ vinScannerPage }) => {
    // Validate the page title
    const title = await vinScannerPage.getTitle();
    await expect(title).toContain("VIN Scanner");

  });


  test('should click "Both" button on the page and validate the header label text', async ({ vinScannerPage }) => {
    await vinScannerPage.clickStartButton();

    await vinScannerPage.clickScanBothButton();
    const selectedBtn = await vinScannerPage.getSelectedButton();
    expect(selectedBtn).toHaveText('Both');

  });

  test('should click "Barcode" button on the page and validate the header label text', async ({ vinScannerPage }) => {
    await vinScannerPage.clickStartButton();
  
    await vinScannerPage.clickScanBarcodeButton();
    const selectedBtn = await vinScannerPage.getSelectedButton();
    expect(selectedBtn).toHaveText('Barcode');

  });

  test('should click "Text" button on the page and validate the header label text', async ({ vinScannerPage }) => {
    await vinScannerPage.clickStartButton();
    
    await vinScannerPage.clickScanTextButton();
    
    const selectedBtn = await vinScannerPage.getSelectedButton(); 
    expect(selectedBtn).toHaveText('Text');

  });

});
