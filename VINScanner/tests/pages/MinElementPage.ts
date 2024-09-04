import { Page, Locator } from '@playwright/test';

// TODO: Update the URL when we upload the page to live server.
// const URL = "https://demo.dynamsoft.com/Samples/DBR/JS/hello-world/hello-world.html";
// const URL = "http://localhost:5173/minimum-elements.html";
const URL = '/VINScanner/minimum-elements.html';

export class MinElementPage {
  private page: Page;
  private selResolution: Locator;
  private options: Locator[]; 

  constructor(page: Page) {
    this.page = page;    
  }

  async initialize() {
    this.selResolution = await this.page.locator('select.dce-sel-resolution');  
    this.options = await this.selResolution.locator('option').all();      
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

  async navigateTo() {
    await this.grantCameraPermission();
    await this.page.goto(URL);
    await this.initialize();
  }

  async getTitle() {
    return await this.page.title();
  }

  async hasCameraEnhancer() {
    const camExists = await this.page.waitForFunction(() => cameraEnhancer !== undefined, { timeout: 5000 });
    return camExists;
  }

  async getResolution() {
    await this.hasCameraEnhancer();
    const res = await this.page.evaluate(() => {
      return cameraEnhancer.getResolution();
    });
    return { width: res.width, height: res.height };
  }

  async getAllResolutions() {
    await this.hasCameraEnhancer();
    let availableResolutions: { width: number; height: number; }[] | null = null;
    const maxAttempts = 10;
    let attempts = 0;
    const delay = 500;

    while (attempts < maxAttempts && !availableResolutions) {
      availableResolutions = await this.page.evaluate(async () => {
        if (typeof cameraEnhancer !== 'undefined' && typeof cameraEnhancer.getAvailableResolutions === "function") {
          try {
            const resolutions = await cameraEnhancer.getAvailableResolutions();
            return resolutions && resolutions.length > 0 ? resolutions : null;
          } catch (error) {
            if (error instanceof OverconstrainedError) {
              console.error('OverconstrainedError: Source failed to restart');
              return null;
            }
            throw error;
          }
        }
        return null;
      });

      if (!availableResolutions) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      attempts++;
    }    
    return availableResolutions;
  }

  async getCurrentResolution() {
    return this.selResolution.getAttribute
  }
  async selectResolution() {

  }
}
