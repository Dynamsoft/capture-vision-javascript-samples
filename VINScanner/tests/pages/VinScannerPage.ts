import { Page, Locator } from "@playwright/test";
import path = require("path");

// TODO: Update the URL when we upload the page to live server.
// const URL = "https://tst.dynamsoft.com/temp/vin-scan-dlr-dbr/index.html";
// const URL = 'https://192.168.0.18:5504/VINScanner/';
const URL = `file:${path.join(
  __dirname,
  "../../index.html"
)}`
export class VinScannerPage {
  private page: Page;
  private headerLabel: Locator;
  private settingsButton: Locator;
  private settingsModal: Locator;
  private startButton: Locator;
  private scanBarcodeButton: Locator;
  private scanTextButton: Locator;
  private scanBothButton: Locator;
  private dialogCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerLabel = this.page.locator(".scan-mode");
    this.settingsButton = this.page.locator(".settings-btn");
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
  }

  /**
   * Close the license related dialog if it shows.
   */
  async closeDialogIfPresent() {

    const isDialogCloseButtonVisible = await this.dialogCloseButton.isVisible();
    
    if (isDialogCloseButtonVisible) {
      await this.dialogCloseButton.click();
    }

  }

  async navigateTo() {
    await this.grantCameraPermission();
    await this.page.goto(URL);
    this.closeDialogIfPresent();
  }

  async getTitle() {
    return await this.page.title();
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

  async openSettingsModal() {
    await this.settingsButton.click();
  }

  async waitForSettingsModal() {
    await this.settingsModal.waitFor({ state: "visible" });
  }

  async clickStartButton() {
    await this.startButton.click();
  }

  async clickScanBarcodeButton() {
    await this.scanBarcodeButton.click();
  }

  async clickScanTextButton() {
    await this.scanTextButton.click();
  }

  async clickScanBothButton() {
    await this.scanBothButton.click();
  }

  async interactWithSettingsModal() {
    await this.openSettingsModal();
    await this.waitForSettingsModal();
    // Add interactions with the settings modal here
  }

  
}
