# Dynamsoft Capture Vision Samples for JavaScript

## Samples

| Sample Name   | Description                                                                          |
| ------------  | ------------------------------------------------------------------------------------ |
| `VIN Scanner` | Scan the VIN code from a barcode or a text line and extract the vehicle information. |

## Testing

Install dependencies

```
cd VINScanner

npm install
```

Execute playwright code coverage test by simply run

```
npm test
```

## License

You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense/?product=cvs&utm_source=github&package=js) link.

## Testing

This repository also includes end-to-end tests for each samples using [Playwright](https://playwright.dev/). The tests are organized per sample, and the setup supports cross-browser testing across Chromium, Firefox, and WebKit.

### Installation

``` bash
npm install
npx playwright install --with-deps # installs playwright browsers
```

### Running Tests

```bash
npx playwright test # or `npm test`
```

### View Test Reports

```bas
npx playwright show-report
```

### CI Integration

This repository is set up to run tests automatically on each commit via CI Github Actions. To learn more, visit https://playwright.dev/docs/ci-intro.

## Contact Us

[https://www.dynamsoft.com/company/contact/](https://www.dynamsoft.com/company/contact/?product=cvs&utm_source=github&package=js)
