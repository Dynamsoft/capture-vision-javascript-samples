import { Page, Locator } from "@playwright/test";

// TODO: Update the URL when we upload the page to live server.

const URL = '/VINScanner/index.html';

export class VinScannerPage {
  private page: Page;
  private headerLabel: Locator;
  private settingsModal: Locator;
  private startButton: Locator;
  private scanBarcodeButton: Locator;
  private scanTextButton: Locator;
  private scanBothButton: Locator;
  private dialogCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerLabel = this.page.locator(".scan-mode");
    this.settingsModal = this.page.locator(".settings-modal-content");
    this.startButton = this.page.locator(".start-btn");
    
    this.scanBarcodeButton = this.page.locator("#scan-barcode-btn");
    this.scanTextButton = this.page.locator("#scan-text-btn");
    this.scanBothButton = this.page.locator("#scan-both-btn");
    this.dialogCloseButton = this.page.locator("i.dls-license-icon-close");
  }

  async grantCameraPermission() {
    await this.page.addScriptTag({
      content: `
        navigator.mediaDevices.getUserMedia = async () => {
          return {
            getVideoTracks: () => [{
              applyConstraints: () => {},
              stop: () => {},
            }],
            getAudioTracks: () => [],
          };
        };
      `,
    });

    await this.page.setExtraHTTPHeaders({
      "sec-ch-ua": '"Chromium";v="91", " Not;A Brand";v="99"'
    });
  }

  /**
   * Close the license related dialog if it shows.
   */
  async closeDialogIfPresent() {

    this.dialogCloseButton.waitFor({ state: "visible", timeout: 5000 });
    await this.dialogCloseButton.click();    
    
  }

  async navigateTo() {
    await this.grantCameraPermission();
    await this.page.goto(URL);
    await this.closeDialogIfPresent();
  }

  async getTitle() {
    return await this.page.title();
  }

  async getSelectedButton() {
    return await this.page.locator("button.scan-option-btn.selected");
  }

  async getHeaderLabel(expectedText?: string) {
    await this.page.waitForTimeout(3000);
    
    // If expectedText is provided, wait for it to appear
    if (expectedText) {
      await this.headerLabel.waitFor({ state: 'visible', timeout: 5000});
      await this.page.waitForFunction((expectedText) => { 
        this.headerLabel.textContent().then.toString().match(expectedText);
      },
      expectedText);
    }
  
    return await this.headerLabel.textContent();
  }

  async waitForSettingsModal() {
    await this.settingsModal.waitFor({ state: "visible" });
  }

  async clickStartButton() {
    await this.startButton.click();
    
    // Ensuring the page is loaded after clicked on the Start button
    await this.page.waitForLoadState('networkidle', {timeout: 30000});
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickScanBarcodeButton() {
    await this.scanBarcodeButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickScanTextButton() {
    await this.scanTextButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickScanBothButton() {
    await this.scanBothButton.click();
    await this.page.waitForTimeout(2000);
  }
  
}
