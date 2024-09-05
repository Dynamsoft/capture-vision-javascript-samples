import { test, expect } from "./../fixtures";

test.describe("Verify the VIN Scanner Page title and veirfy user can select different settings", () => {
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


  test('should click "Scan Text and Barcode" button in the settings modal and validate the header label text', async ({ vinScannerPage }) => {
    await vinScannerPage.clickStartButton();
    await vinScannerPage.interactWithSettingsModal();
    await vinScannerPage.clickScanBothButton();
    const header = await vinScannerPage.getHeaderLabel();
    expect(header).toBe('Scan Text or Barcode'); 

  });

  test('should click "Scan by Barcode" button in the settings modal and validate the header label text', async ({ vinScannerPage }) => {
    await vinScannerPage.clickStartButton();
    await vinScannerPage.interactWithSettingsModal();
    await vinScannerPage.clickScanBarcodeButton();
    const header = await vinScannerPage.getHeaderLabel();
    expect(header).toBe('Scan by Barcode');

  });

  test('should click "Scan by Text" button in the settings modal and validate the header label text', async ({ vinScannerPage }) => {
    await vinScannerPage.clickStartButton();
    await vinScannerPage.interactWithSettingsModal();
    await vinScannerPage.clickScanTextButton();
    const header = await vinScannerPage.getHeaderLabel();
    expect(header).toBe('Scan by Text'); 

  });

});
