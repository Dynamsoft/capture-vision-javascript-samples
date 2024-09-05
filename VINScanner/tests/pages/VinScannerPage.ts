import { Page, Locator } from "@playwright/test";

// TODO: Update the URL when we upload the page to live server.

const URL = '/VINScanner/index.html';

export class VinScannerPage {
  private page: Page;
  private headerLabel: Locator;
  private settingsModal: Locator;
  private scanModeContainer: Locator;
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
    this.scanModeContainer = this.page.locator(".scan-mode-container");
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
    // await this.headerLabel.waitFor({ state: 'visible', timeout: 5000 });
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

  async waitForPageLoad() {
    await this.scanModeContainer.waitFor({ timeout: 10000 });
    await this.page.waitForFunction(() => {
      return (typeof cameraEnhancer !== undefined);
    }, { timeout: 10000 });
    
  }

  async clickStartButton() {
    await this.startButton.click();
    await this.waitForPageLoad();
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
