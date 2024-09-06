import { extractVinDetails, judgeCurResolution, resultToHTMLElement, showNotification } from "./util.js";

/** LICENSE ALERT - README
 * To use the library, you need to first specify a license key using the API "initLicense" as shown below.
 */
Dynamsoft.License.LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");
/**
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense/?product=cvs&utm_source=samples&package=js to get your own trial license good for 30 days.
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/label-recognition/programming/javascript/user-guide.html?ver=latest&utm_source=samples#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END
 */

// Dynamsoft Image Processing and Label Recognizer resource path optimized for VIN Scanning
Dynamsoft.Core.CoreModule.engineResourcePaths.dip =
  "https://cdn.jsdelivr.net/npm/dynamsoft-image-processing@2.2.30-iv-202407211855/dist";
Dynamsoft.Core.CoreModule.engineResourcePaths.dlr =
  "https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer@3.2.30-iv-202407182011/dist/";

// Optional. Used to load wasm resources in advance, reducing latency between video playing and barcode decoding.
Dynamsoft.Core.CoreModule.loadWasm(["DBR", "DLR", "DCP"]);

/**
 * Creates a CameraEnhancer instance as the image source
 */
async function initDCE() {
  cameraView = await Dynamsoft.DCE.CameraView.createInstance(cameraViewContainer);
  cameraEnhancer = await Dynamsoft.DCE.CameraEnhancer.createInstance(cameraView);

  // Get the camera information of the device and render the camera list
  cameraList = await cameraEnhancer.getAllCameras();
  for (let camera of cameraList) {
    for (let res of Object.keys(resolutions)) {
      const cameraItem = document.createElement("div");
      cameraItem.className = "camera-item";
      cameraItem.innerText = `${camera.label} (${res})`;
      cameraItem.deviceId = camera.deviceId;
      cameraItem.resolution = res;

      cameraItem.addEventListener("click", async (e) => {
        e.stopPropagation();
        for (let child of cameraListContainer.childNodes) {
          child.className = "camera-item";
        }
        cameraItem.className = "camera-item camera-selected";
        await cameraEnhancer.selectCamera(camera);
        await cameraEnhancer.setResolution({
          width: resolutions[res][0],
          height: resolutions[res][1],
        });

        const currentCamera = await cameraEnhancer.getSelectedCamera();
        const currentResolution = judgeCurResolution(await cameraEnhancer.getResolution());
        if (currentCamera.deviceId === camera.deviceId && currentResolution === res) {
          showNotification("Camera and resolution switched successfully!", "banner-success");
        } else if (judgeCurResolution(currentResolution) !== res) {
          showNotification(`Resolution switch failed! ${res} is not supported.`, "banner-default");

          // Update resolution to the current resolution that is supported
          for (let child of cameraListContainer.childNodes) {
            child.className = "camera-item";
            if (currentCamera.deviceId === child.deviceId && currentResolution === child.resolution) {
              child.className = "camera-item camera-selected";
            }
          }
        } else {
          showNotification(`Camera switch failed!`, "banner-error");
        }

        // Hide options after user clicks an option
        cameraSelector.click();
      });
      cameraListContainer.appendChild(cameraItem);
    }
  }
  cameraView.setVideoFit("cover");
  await cameraEnhancer.setResolution({ width: 1920, height: 1080 });
}

/**
 * Initialize CaptureVisionRouter, CameraEnhancer, and CameraView instance
 */
let init = (async function initCVR() {
  await initDCE();
  cvRouter = await Dynamsoft.CVR.CaptureVisionRouter.createInstance();
  await cvRouter.initSettings("./VIN_Template.json");
  cvRouter.setInput(cameraEnhancer);

  /* Filter out unchecked and duplicate results. */
  const filter = new Dynamsoft.Utility.MultiFrameResultCrossFilter();
  filter.enableResultCrossVerification("barcode", true); // Filter out unchecked barcodes.
  filter.enableResultDeduplication("barcode", true); // Filter out duplicate barcodes within 3 seconds.
  filter.enableResultCrossVerification("text_line", true); // Filter out unchecked text lines
  filter.enableResultDeduplication("text_line", true); // Filter out duplicate text lines within 3 seconds
  await cvRouter.addResultFilter(filter);

  /* Defines the result receiver for the solution.*/
  const resultReceiver = new Dynamsoft.CVR.CapturedResultReceiver();
  resultReceiver.onCapturedResultReceived = (result) => {
    const textLineResult = result.textLineResultItems;
    const barcodeResult = result.barcodeResultItems;
    const parsedResults = result.parsedResultItems;

    if (textLineResult?.length || barcodeResult?.length) {
      // Play sound feedback if enabled
      isSoundOn ? Dynamsoft.DCE.Feedback.beep() : null;

      // Reset results
      resultImageContainer.innerHTML = "";
      parsedResultMain.innerText = "";

      // Add result scan type to the output
      const resultType = textLineResult?.length ? "Text" : "Barcode";
      const resultTypeElement = resultToHTMLElement("Scanned by", resultType);
      parsedResultMain.appendChild(resultTypeElement);

      // Add VIN code to the output
      const vinElement = resultToHTMLElement(
        "VIN",
        resultType === "Text" ? textLineResult[0]?.text : barcodeResult[0]?.text
      );
      vinElement.classList.add("code");
      parsedResultMain.appendChild(vinElement);

      // If a parsed result is obtained, use it to render the result page
      if (parsedResults) {
        const parseResultInfo = extractVinDetails(parsedResults[0]);

        Object.entries(parseResultInfo).map(([field, value]) => {
          if (value) {
            const resultElement = resultToHTMLElement(field, value);
            parsedResultMain.appendChild(resultElement);
          }
        });
      } else {
        alert(`Failed to parse the content.`);
        parsedResultArea.style.justifyContent = "flex-start";
      }

      // Get scanned VIN Image and append to results container
      // Note: scanned image is received by setting `OutputOriginalImage: 1` in `VIN_Template.json`
      const imageData = result.items.find(
        (item) => item.type === Dynamsoft.Core.EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE
      )?.imageData;
      if (imageData) {
        // Get scanned VIN Image as a canvas
        const imageCanvas = imageData.toCanvas();

        // If scanOrientation is portrait, set the max height of the image canvas to 200px;
        if (scanOrientation === "portrait") {
          imageCanvas.style.width = "100%";
          imageCanvas.style.height = "200px";
        } else {
          imageCanvas.style.width = "100%";
          imageCanvas.style.height = "100%";
        }
        imageCanvas.style.objectFit = "contain";
        resultImageContainer.append(imageCanvas);
      }

      resultContainer.style.display = "flex";
      cameraListContainer.style.display = "none";
      scanModeContainer.style.display = "none";

      cvRouter.stopCapturing();
      cameraView.clearAllInnerDrawingItems();
    }
  };
  await cvRouter.addResultReceiver(resultReceiver);
})();

export { init };
