import { test, expect } from '../fixtures';


// Adding userAgent to avoid firefox headless mode to block the script as it is being detected as bot.
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"; 

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

test.describe.configure({ mode: 'serial' });

test.describe('Minimum Element Page Tests', () => {
  test.use({userAgent});

  test.beforeEach(async ({ minElementPage }) => {
    await minElementPage.navigateTo();
  });

  test('should display the correct title', async ({ minElementPage }) => {
    const title = await minElementPage.getTitle();
    expect(title).toBe("VIN Scanner - Minimum elements");
  });

  test('should have camera enhancer available', async ({ minElementPage }) => {
    const hasEnhancer = await minElementPage.hasCameraEnhancer();
    expect(hasEnhancer).toBeTruthy();
  });

  test('should get correct resolution', async ({ minElementPage }) => {
    const resolution = await minElementPage.getResolution();
    expect(availableResolutions).toContainEqual(resolution);
  });

  test('should get all available resolutions', async ({ minElementPage }) => {
    const resolutions = await minElementPage.getAllResolutions();
    if (resolutions !== null) {

      let isFound = availableResolutions.some(ai => 
        resolutions.some(res => res.width === ai.width && res.height === ai.height)
      );
      expect(isFound).toBeTruthy();
    } else {
      throw new Error('Failed to get resolutions');
    }
  });

  test('should be able to select different resolutions', async ({ minElementPage }) => {
    expect(minElementPage.selectResolution).toBeDefined();
    minElementPage.selectResolution();
    
  });
});
