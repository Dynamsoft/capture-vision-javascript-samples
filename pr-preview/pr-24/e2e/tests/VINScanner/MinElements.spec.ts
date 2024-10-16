import { test, expect } from "../../fixtures";

// available resolutions
const availableResolutions: { width: number; height: number }[] = [
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

test.describe.configure({ mode: "serial" });

test.describe("Minimum Element Page Tests", () => {
  test.beforeEach(async ({ minElementsPage }) => {
    await minElementsPage.navigateTo();
  });

  test("should display the correct title", async ({ minElementsPage }) => {
    const title = await minElementsPage.getTitle();
    expect(title).toBe("VIN Scanner - Minimum elements");
  });

  test("should have camera enhancer available", async ({ minElementsPage }) => {
    const hasEnhancer = await minElementsPage.hasCameraEnhancer();
    expect(hasEnhancer).toBeTruthy();
  });

  test("should get correct resolution", async ({ minElementsPage }) => {
    const resolution = await minElementsPage.getResolution();
    expect(availableResolutions).toContainEqual(resolution);
  });

  test("should get all available resolutions", async ({ minElementsPage }) => {
    const resolutions = await minElementsPage.getAllResolutions();
    if (resolutions !== null) {
      let isFound = availableResolutions.some((ai) =>
        resolutions.some((res) => res.width === ai.width && res.height === ai.height)
      );
      expect(isFound).toBeTruthy();
    } else {
      throw new Error("Failed to get resolutions");
    }
  });

  test("should be able to select different resolutions", async ({ minElementsPage }) => {
    expect(minElementsPage.selectResolution).toBeDefined();
    minElementsPage.selectResolution();
  });
});
