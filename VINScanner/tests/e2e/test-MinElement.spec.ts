import { test, expect } from '../fixtures';
import { MinElementPage } from '../pages/MinElementPage';

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
    expect(title).toBe("Dynamsoft Barcode Reader Sample - Hello World (Decode via Camera)");
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
    expect(resolutions).toEqual(availableResolutions);
  });

  test('should be able to select different resolutions', async ({ minElementPage }) => {
    expect(minElementPage.selectResolution)
    minElementPage.selectResolution();
    
  });
});
