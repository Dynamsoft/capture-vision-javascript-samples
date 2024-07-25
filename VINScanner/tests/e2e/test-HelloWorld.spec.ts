import { test, expect } from './../fixtures';

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
];

test.describe('Hello World Page Tests', () => {
  test.beforeEach(async ({ helloWorldPage }) => {
    await helloWorldPage.navigateToHome();
  });

  test('should display the correct title', async ({ helloWorldPage }) => {
    const title = await helloWorldPage.getTitle();
    expect(title).toBe("Dynamsoft Barcode Reader Sample - Hello World (Decode via Camera)");
  });

  test('should have camera enhancer available', async ({ helloWorldPage }) => {
    const hasEnhancer = await helloWorldPage.hasCameraEnhancer();
    expect(hasEnhancer).toBeTruthy();
  });

  test('should get correct resolution', async ({ helloWorldPage }) => {
    const resolution = await helloWorldPage.getResolution();
    expect(availableResolutions).toContainEqual(resolution);
  });

  test('should get all available resolutions', async ({ helloWorldPage }) => {
    const resolutions = await helloWorldPage.getAllResolutions();
    expect(availableResolutions).toEqual(resolutions);
  });
});
