import { test as baseTest } from '@playwright/test';
import { HelloWorldPage } from './pages/helloWorldPage';

type MyFixtures = {
  helloWorldPage: HelloWorldPage;
};

export const test = baseTest.extend<MyFixtures>({
  helloWorldPage: async ({ page }, use) => {
    const helloWorldPage = new HelloWorldPage(page);
    await use(helloWorldPage);
  },
});

export { expect } from '@playwright/test';
