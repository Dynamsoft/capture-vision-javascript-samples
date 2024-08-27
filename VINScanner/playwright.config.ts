import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests" /* Configure projects for major browsers */,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--disable-web-security",
            "--enable-web-rtc",
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream",
          ],
        },
        contextOptions: {
          /* Camera permission */
          permissions: ["camera"],
          ignoreHTTPSErrors: true,
        },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
          firefoxUserPrefs: {
            "permissions.default.camera": 1, // Allow camera access automatically
            "media.navigator.streams.fake": true, // Use fake streams if needed
          },
        },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        launchOptions: {
          args: ["--disable-web-security", "--enable-web-rtc"],
        },
      },
    },
  ],
});
