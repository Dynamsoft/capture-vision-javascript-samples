import { test, expect } from "@playwright/test";

test("load local page", async ({ page }) => {
  await page.goto("/VINScanner/index.html");

  // Expects page to have a heading with the name of Installation.
  await expect(await page.title()).toContain("VIN Scanner");
});