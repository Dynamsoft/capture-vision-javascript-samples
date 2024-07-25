import { Page } from '@playwright/test';

const URL = "https://demo.dynamsoft.com/Samples/DBR/JS/hello-world/hello-world.html";

export class HelloWorldPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToHome() {
    await this.page.goto(URL);
  }

  async getTitle() {
    return await this.page.title();
  }

  async hasCameraEnhancer() {
    const camExists = await this.page.waitForFunction(() => typeof cameraEnhancer !== "undefined", { timeout: 5000 });
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
        if (typeof cameraEnhancer !== "undefined" && typeof cameraEnhancer.getAvailableResolutions === "function") {
          const resolutions = await cameraEnhancer.getAvailableResolutions();
          return resolutions && resolutions.length > 0 ? resolutions : null;
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
}
