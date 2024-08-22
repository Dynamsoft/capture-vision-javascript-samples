Find "TODO" keywords before publishing this solution to include the right links!

# About the solution

General MRZ Scanner enables camera to scan the MRZ code of ID-cards, passports, and visas. Currently, the General MRZ Scanner supports TD-1, TD-2, TD-3, MRV-A, and MRV-B standards. It will extract all data like first name, last name, document number, nationality, date of birth, expiration date and more from the MRZ string, and converts the encoded string into human-readable fields.

## Web demo

The web demo is available at [ TODO https://demo.dynamsoft.com/solutions/passport-scanner/index.html](https://demo.dynamsoft.com/solutions/passport-scanner/index.html) (nothing will be uploaded).

## Run this Solution

1. Clone the repo to a working directory

```sh
TODO
git clone https://github.com/Dynamsoft/passport-MRZ-scanner-javascript
```

2. CD to the folder and run an https server

```sh
TODO 
cd passport-MRZ-scanner-javascript
```

> Basic Requirements
>
>  * Internet connection  
>  * [A supported browser](#system-requirements)
>  * An accessible Camera

-----

## Request a Trial License

The key "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9" used in this solution (in the file `js/init.js`) serves as a test license valid for 24 hours, applicable to any newly authorized browser. To test the SDK further, you can request a 30-day free trial license via the <a href="https://www.dynamsoft.com/customer/license/trialLicense?product=cvs&utm_source=docs&package=js" target="_blank">Request a Trial License</a> link.

## Project Structure

```text
General MRZ Scanner
├── assets
│   ├── ...
│   ├── ...
│   └── ...
├── css
│   └── index.css
├── font
│   ├── ...
│   ├── ...
│   └── ...
├── js
│   ├── const.js
│   ├── index.js
│   ├── init.js
│   └── util.js
├── index.html
└── template.json
```

 * `/assets` : This directory contains all the static files such as images, icons, etc. that are used in the project.
 * `/css` : This directory contains the CSS file(s) used for styling the project.
 * `/font` : This directory contains the font files used in the project.
 * `/js` : This directory contains all the JavaScript files used in the project.
   * `const.js` : This file contains definitions of certain constants or variables used across the project.
   * `index.js`: This is the main JavaScript file where the core logic of the project is implemented.
   * `init.js` : This file is used for initialization purposes, such as initializing license, load resources, etc.
   * `util.js` : This file contains utility functions that are used across the project.
 * `index.html` : This is the main HTML file that represents the homepage of the project.
 * `template.json` : This file contains predefined templates used in the project.

## System Requirements

This project requires the following features to work:

- Secure context (HTTPS deployment)

  When deploying your application / website for production, make sure to serve it via a secure HTTPS connection. This is required for two reasons
  
  - Access to the camera video stream is only granted in a security context. Most browsers impose this restriction.
  > Some browsers like Chrome may grant the access for `http://127.0.0.1` and `http://localhost` or even for pages opened directly from the local disk (`file:///...`). This can be helpful for temporary development and test.
  
  - Dynamsoft License requires a secure context to work.

- `WebAssembly`, `Blob`, `URL`/`createObjectURL`, `Web Workers`

  The above four features are required for the SDK to work.

- `MediaDevices`/`getUserMedia`

  This API is required for in-browser video streaming.

- `getSettings`

  This API inspects the video input which is a `MediaStreamTrack` object about its constrainable properties.

The following table is a list of supported browsers based on the above requirements:

  | Browser Name |     Version      |
  | :----------: | :--------------: |
  |    Chrome    | v78+<sup>1</sup> |
  |   Firefox    | v63+<sup>1</sup> |
  |     Edge     |       v79+       |
  |    Safari    |       v14+       |

  <sup>1</sup> devices running iOS needs to be on iOS 14.3+ for camera video streaming to work in Chrome, Firefox or other Apps using webviews.

Apart from the browsers, the operating systems may impose some limitations of their own that could restrict the use of the SDK. Browser compatibility ultimately depends on whether the browser on that particular operating system supports the features listed above.