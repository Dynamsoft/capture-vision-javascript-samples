import { extractVinDetails, resultToHTMLElement, showNotification } from "./util.js";

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
    const cameraItem = document.createElement("div");
    cameraItem.className = "camera-item";
    cameraItem.innerText = camera.label;
    cameraItem.deviceId = camera.deviceId;

    cameraItem.addEventListener("click", (e) => {
      e.stopPropagation();
      for (let child of cameraListContainer.childNodes) {
        child.className = "camera-item";
      }
      cameraItem.className = "camera-item camera-selected";
      cameraEnhancer.selectCamera(camera);

      showNotification("Camera switched successfully!", "banner-success");
    });
    cameraListContainer.appendChild(cameraItem);
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
      settingsModal.style.display = "none";
      resultImageContainer.innerHTML = "";
      parsedResultMain.innerText = "";

      // Add result scan type to the output
      const resultType = textLineResult?.length ? "Text" : "Barcode";
      const resultTypeElement = resultToHTMLElement("Scanned by", resultType);
      parsedResultMain.appendChild(resultTypeElement);

      // If a parsed result is obtained, use it to render the result page
      if (parsedResults) {
        const parseResultInfo = extractVinDetails(parsedResults[0]);

        Object.entries(parseResultInfo).map(([field, value]) => {
          const resultElement = resultToHTMLElement(field, value);
          parsedResultMain.appendChild(resultElement);
        });
      } else {
        alert(`Failed to parse the content.`);
        parsedResultArea.style.justifyContent = "flex-start";
      }

      // Add VIN code to the output
      const vinElement = resultToHTMLElement(
        "VIN",
        resultType === "Text" ? textLineResult[0]?.text : barcodeResult[0]?.text
      );
      vinElement.classList.add("code");
      parsedResultMain.appendChild(vinElement);

      // Get scanned VIN Image and append to results container
      // Note: scanned image is received by setting `OutputOriginalImage: 1` in `VIN_Template.json`
      const imageData = result.items.find(
        (item) => item.type === Dynamsoft.Core.EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE
      )?.imageData;
      if (imageData) {
        const imageCanvas = imageData.toCanvas(); // Get scanned VIN Image as a canvas
        imageCanvas.style.width = "100%";
        imageCanvas.style.height = "100%";
        imageCanvas.style.objectFit = "contain";
        resultImageContainer.append(imageCanvas);
      }

      resultContainer.style.display = "flex";
      cameraListContainer.style.display = "none";
      cvRouter.stopCapturing();
      cameraView.clearAllInnerDrawingItems();
    }
  };
  await cvRouter.addResultReceiver(resultReceiver);
})();

export { init };
