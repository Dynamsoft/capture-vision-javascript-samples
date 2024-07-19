// helloWorldPage.ts
import { Page } from '@playwright/test';

// URL for the test site
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
    const res = await this.page.evaluate(() => {
      return cameraEnhancer.getResolution();
    });
    return { width: res.width, height: res.height };
  }

  async getAllResolutions() {

    // Initialize availableResolutions and start polling in a while loop
    let availableResolutions: { width: number; height: number;}[] | null = null;
    const maxAttempts = 10; // Maximum number of attempts
    let attempts = 0;
    const delay = 500; // Delay between attempts in milliseconds

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
