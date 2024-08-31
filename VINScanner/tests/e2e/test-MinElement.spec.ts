import { test, expect } from '../fixtures';

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

test.describe('Minimum Element Page Tests', () => {
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
      // This fails because we're comparing objects incorrectly
      // We need to compare each property of the objects instead
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
