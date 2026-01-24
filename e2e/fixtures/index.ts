import { test as baseTest } from "@playwright/test";
import { VINScannerPage } from "./VINScanner/VINScanner.fixture";
import { MinElementsPage } from "./VINScanner/MinElements.fixture";

export const test = baseTest.extend<{
  vinScannerPage: VINScannerPage;
  minElementsPage: MinElementsPage;
}>({
  vinScannerPage: async ({ page }, use) => {
    const vinScannerPage = new VINScannerPage(page);
    await use(vinScannerPage);
  },
  minElementsPage: async ({ page }, use) => {
    const minElementsPage = new MinElementsPage(page);
    await use(minElementsPage);
  },
});

export { expect } from "@playwright/test";
