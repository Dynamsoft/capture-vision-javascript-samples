import { init } from "./init.js";
import {
  checkOrientation,
  getVisibleRegionOfVideo,
  resetScanOrientation,
  shouldShowScanModeContainer,
  shouldShowScanOrientation,
  showNotification,
  toggleScanOrientation,
  judgeCurResolution,
} from "./util.js";

// Create event listener for each scan modes
SCAN_MODES.forEach((mode) =>
  document.querySelector(`#scan-${mode}-btn`).addEventListener("click", async () => {
    try {
      homePage.style.display = "none";
      scannerContainer.style.display = "block";

      pInit = pInit || (await init);

      // Starts streaming the video
      if (cameraEnhancer.isOpen()) {
        await cvRouter.stopCapturing();
        await cameraView.clearAllInnerDrawingItems();
      } else {
        await cameraEnhancer.open();
      }

      // Highlight the selected camera in the camera list container
      const currentCamera = cameraEnhancer.getSelectedCamera();

      const currentResolution = judgeCurResolution(cameraEnhancer.getResolution());
      cameraListContainer.childNodes.forEach((child) => {
        if (currentCamera.deviceId === child.deviceId && currentResolution === child.resolution) {
          child.className = "camera-item camera-selected";
        }
      });

      // Start capturing based on the selected scan mode template
      await cvRouter.startCapturing(SCAN_TEMPLATES[mode]);
      // By default, cameraEnhancer captures grayscale images to optimize performance.
      // To capture RGB Images, we set the Pixel Format to EnumImagePixelFormat.IPF_ABGR_8888
      cameraEnhancer.setPixelFormat(Dynamsoft.Core.EnumImagePixelFormat.IPF_ABGR_8888);

      // Update button styles to show selected scan mode
      document.querySelectorAll(".scan-option-btn").forEach((button) => {
        button.classList.remove("selected");
      });
      document.querySelector(`#scan-${mode}-btn`).classList.add("selected");
      showNotification(`Scan mode switched successfully`, "banner-success");

      // Update the current mode to the newly selected mode and set scan orientation based on current mode
      currentMode = mode;
      configureScanOrientation();
    } catch (ex) {
      let errMsg = ex.message || ex;
      console.error(`An error occurred: ${errMsg}`);
      alert(`An error occurred: ${errMsg}`);
    }
  })
);

// -----------Logic for calculating scan region ↓------------4
const regionEdgeLength = () => {
  if (!cameraEnhancer || !cameraEnhancer.isOpen()) return 0;
  const { width, height } = getVisibleRegionOfVideo();

  const regionEdgeLength = 0.4 * Math.min(width, height);
  return Math.round(regionEdgeLength);
};

const regionLeft = () => {
  if (!cameraEnhancer || !cameraEnhancer.isOpen()) return 0;
  const visibleRegionInPixels = getVisibleRegionOfVideo();
  const currentResolution = cameraEnhancer.getResolution();

  const vw =
    checkOrientation() === "portrait"
      ? Math.min(currentResolution.width, currentResolution.height)
      : Math.max(currentResolution.width, currentResolution.height);
  const visibleRegionWidth = visibleRegionInPixels.width;

  let left = 0.5 - regionEdgeLength() / vw / 2;
  if (document.body.clientWidth > document.body.clientHeight) {
    left = Math.round((left - (0.2 * visibleRegionWidth) / vw) * 100);
  } else {
    left = Math.round((left - (0.25 * visibleRegionWidth) / vw) * 100);
  }

  return left < 0 || left >= 50 ? 0 : left;
};

const regionTop = () => {
  if (!cameraEnhancer || !cameraEnhancer.isOpen()) return 0;
  const visibleRegionInPixels = getVisibleRegionOfVideo();
  const currentResolution = cameraEnhancer.getResolution();

  const vh =
    checkOrientation() === "portrait"
      ? Math.max(currentResolution.width, currentResolution.height)
      : Math.min(currentResolution.width, currentResolution.height);
  const visibleRegionHeight = visibleRegionInPixels.height;

  let top = 0.5 - regionEdgeLength() / vh / 2;
  if (document.body.clientWidth > document.body.clientHeight) {
    top = Math.round((top + (0.15 * visibleRegionHeight) / vh) * 100);
  } else {
    top = Math.round((top + (0.15 * visibleRegionHeight) / vh) * 100);
  }

  return top < 0 || top >= 45 ? 45 : top;
};

const region = () => {
  let region =
    scanOrientation === "landscape"
      ? {
          left: regionLeft(),
          right: 100 - regionLeft(),
          top: regionTop(),
          bottom: 100 - regionTop(),
          isMeasuredInPercentage: true,
        }
      : {
          left: regionTop() - 10,
          right: 100 - regionTop() + 10,
          top: Math.max(5, regionLeft()),
          bottom: 75 - regionLeft(),
          isMeasuredInPercentage: true,
        };
  return region;
};
// -----------Logic for calculating scan region ↑------------

window.addEventListener("click", () => {
  cameraListContainer.style.display = "none";
  up.style.display = "none";
  down.style.display = "inline-block";
});

// Recalculate the scan region when the window size changes
window.addEventListener("resize", () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    configureScanOrientation();
  }, 500);
});

// Add click events to buttons
startScanningBtn.addEventListener("click", () => {
  // On start, start with Scan Both template
  scanBothBtn.click();
});

// On click restart video button
const restartVideo = async () => {
  resultContainer.style.display = "none";
  document.querySelector(`#scan-${currentMode}-btn`).click();
};
restartVideoBtn.addEventListener("click", restartVideo);

// On click camera selector
cameraSelector.addEventListener("click", (e) => {
  e.stopPropagation();
  const isShow = cameraListContainer.style.display === "block";
  cameraListContainer.style.display = isShow ? "none" : "block";
  up.style.display = !isShow ? "inline-block" : "none";
  down.style.display = isShow ? "inline-block" : "none";
});

// On click sound button
playSoundBtn.addEventListener("click", () => {
  playSoundBtn.style.display = "none";
  closeSoundBtn.style.display = "block";
  isSoundOn = false;
  showNotification("Sound feedback off", "banner-default");
});
closeSoundBtn.addEventListener("click", () => {
  playSoundBtn.style.display = "block";
  closeSoundBtn.style.display = "none";
  showNotification("Sound feedback on", "banner-default");
  isSoundOn = true;
});

// On click copy button
copyResultBtn.addEventListener("click", () => {
  const resultText = parsedResultMain.innerText;

  navigator.clipboard
    .writeText(resultText)
    .then(() => {
      showNotification("Result copied succesfully!", "banner-success");
      console.log("Result copied successfully!");
    })
    .catch((ex) => {
      let errMsg = ex.message || ex;
      console.error(`An error occured: ${errMsg}`);
      alert(`An error occured: ${errMsg}`);
    });
});

// On click save image button
saveImageBtn.addEventListener("click", () => {
  const imageCanvas = resultImageContainer.querySelector("canvas");
  imageCanvas.toBlob((blob) => {
    const url = window.URL.createObjectURL(blob);
    const download = document.createElement("a");
    download.download = Date.now().toString();
    download.href = url;
    download.click();
    download.remove();
    showNotification("Image saved successfully!", "banner-success");
  }, "image/png");
});

/**
 * Sets up the scan orientation button visibility and resets the camera region
 * based on the current scan mode and device orientation
 */
function configureScanOrientation() {
  shouldShowScanModeContainer();
  if (shouldShowScanOrientation()) {
    scanOrientationBtn.style.display = "flex";
  } else {
    scanOrientationBtn.style.display = "none";
    resetScanOrientation(); // Reset scan orientation to landscape
  }
  cameraEnhancer.setScanRegion(region()); // Update cameraEnhancer scan region
  updateScanOrientationStyles(); // update scan orientation button styles
}

/**
 * Applies the UI styles for the scan orientation button and scan help message
 * based on the current scan orientation.
 */
function updateScanOrientationStyles() {
  if (scanOrientation === "portrait") {
    scanOrientationBtn.style.backgroundColor = "#fe8e14";
    scanOrientationIcon.style.filter = "invert(0)";
    scanHelpMsg.style.display = "none"; // Hide the scan help message in portrait orientation
  } else {
    scanOrientationBtn.style.backgroundColor = "rgb(34,34,34)";
    scanOrientationIcon.style.filter = "invert(1)";
    scanHelpMsg.style.display = "block"; // Show the scan help message in landscape orientation
  }
}

// On click scan orientation button
scanOrientationBtn.addEventListener("click", () => {
  // Only allow switch on portrait devices and scan mode is barcode
  if (shouldShowScanOrientation()) {
    toggleScanOrientation();
  } else {
    resetScanOrientation();
  }
  // Update camera region
  cameraEnhancer.setScanRegion(region());
  updateScanOrientationStyles();
});
