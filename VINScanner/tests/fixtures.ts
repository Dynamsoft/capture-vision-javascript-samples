import { test as baseTest } from '@playwright/test';
import { MinElementPage } from './pages/MinElementPage';
import { VinScannerPage } from './pages/VinScannerPage';

type MyFixtures = {
  minElementPage: MinElementPage;
  vinScannerPage: VinScannerPage;
};

export const test = baseTest.extend<MyFixtures>({
  
  
  minElementPage: async ({ page }, use) => {
    const minElementPage = new MinElementPage(page);
    await use(minElementPage);
  },
  vinScannerPage: async ({ page }, use) => {
    const vinScannerPage = new VinScannerPage(page);
    await use(vinScannerPage);
  },
  
});

export { expect } from '@playwright/test';
