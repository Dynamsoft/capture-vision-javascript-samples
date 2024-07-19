import { test, expect } from "@playwright/test";
import { HelloWorldPage } from "../pages/HelloWorldPage";


// available resolutions
const availableResolutions:{width: number, height: number}[] = [
  { width: 160, height: 120 },
  { width: 320, height: 240 },
  { width: 480, height: 360 },
  { width: 640, height: 480 },
  { width: 800, height: 600 },
  { width: 960, height: 720 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3840, height: 2160 },
]

test.describe("Vanilla Hellow World Page", () => {
  // Start the browser for each test case
  test.beforeEach(async ({ page }) => {
    // Mock the camera
    await page.addScriptTag({
      content: `navigator.mediaDevices.getUserMedia({ video: true });`
    });
    
    // use HelloWorldPage class
    const helloWorldPage = new HelloWorldPage(page);

    // Navigate to the barcode scanning test site
    await helloWorldPage.navigateToHome();

    // Wait for the cameraEnhancer object to be defined
    await expect(await helloWorldPage.hasCameraEnhancer()).toBeTruthy();
  });

  // Test cases to verify the functionality of the page.
  test("should open the page and have correct title", async ({ page }) => {
    // Getting the HelloWorldPage instance and get the title.
    const helloWorldPage = new HelloWorldPage(page);
    await expect(await helloWorldPage.getTitle()).toBe(`Dynamsoft Barcode Reader Sample - Hello World (Decode via Camera)`);
  });

  test("should have value for the resolution selected", async ({ page }) => {
    // Getting the HelloWorldPage instance and get the current resolution.
    const helloWorldPage = new HelloWorldPage(page);
    const currentResolution = await helloWorldPage.getResolution();

    // DEBUG log
    console.log(
      `Current Resolution: ${currentResolution.height} x ${currentResolution.width} `
    );

    // Verify the current resolution exists in the available resolutions list.
    await expect(availableResolutions).toContainEqual(currentResolution);
  });

  // Test case to verify all available resolutions are supported by the currently selected camera.
  test("should have all available resolutions supported by the currently selected camera ", async ({ page }) => {
      // Getting the HelloWorldPage instance and get all available resolutions.
      const helloWorldPage = new HelloWorldPage(page);
      const allResolutions = await helloWorldPage.getAllResolutions();
    
      // DEBUG log
      console.log(`All Res: ${JSON.stringify(allResolutions)}`);     
      
      // Verify the returned resolutions are as expected
      expect(allResolutions).toEqual(availableResolutions);
    });
    
  
});



