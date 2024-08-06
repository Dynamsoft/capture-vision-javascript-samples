import { init } from "./init.js";
import { checkOrientation, getVisibleRegionOfVideo, showNotification } from "./util.js";

// Create event listener for each scan modes
SCAN_MODES.forEach((mode) =>
  document.querySelector(`#scan-${mode}-btn`).addEventListener("click", async () => {
    try {
      (async () => {
        homePage.style.display = "none";
        scannerContainer.style.display = "block";
        scanMode.innerText = SCAN_MODE_TITLES[mode];

        pInit = pInit || (await init);

        // Starts streaming the video
        if (cameraEnhancer.isOpen()) {
          await cvRouter.stopCapturing();
          await cameraView.clearAllInnerDrawingItems();
        } else {
          await cameraEnhancer.open();
        }

        const currentCamera = cameraEnhancer.getSelectedCamera();
        for (let child of cameraListContainer.childNodes) {
          if (currentCamera.deviceId === child.deviceId) {
            child.className = "camera-item camera-selected";
          }
        }
        cameraEnhancer.setScanRegion(region());

        await cvRouter.startCapturing(SCAN_TEMPLATES[mode]);
        // By default, cameraEnhancer captures grayscale images to optimize performance.
        // To capture RGB Images, we set the Pixel Format to EnumImagePixelFormat.IPF_ABGR_8888
        cameraEnhancer.setPixelFormat(Dynamsoft.Core.EnumImagePixelFormat.IPF_ABGR_8888);

        // Update button styles to show selected and close modal
        document.querySelectorAll(".settings-option-btn").forEach((button) => {
          button.classList.remove("selected");
        });
        document.querySelector(`#scan-${mode}-btn`).classList.add("selected");
        settingsModal.style.display = "none";
        showNotification(`Scan mode switched successfully`, "banner-success");

        currentMode = mode;
      })();
    } catch (ex) {
      let errMsg = ex.message || ex;
      console.error(errMsg);
      alert(errMsg);
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
  let region = {
    left: regionLeft(),
    right: 100 - regionLeft(),
    top: regionTop(),
    bottom: 100 - regionTop(),
    isMeasuredInPercentage: true,
  };
  return region;
};
// -----------Logic for calculating scan region ↑------------

const restartVideo = async () => {
  resultContainer.style.display = "none";
  await cvRouter.startCapturing(SCAN_TEMPLATES[currentMode]);
  // By default, cameraEnhancer captures grayscale images to optimize performance.
  // To capture RGB Images, we set the Pixel Format to EnumImagePixelFormat.IPF_ABGR_8888
  cameraEnhancer.setPixelFormat(Dynamsoft.Core.EnumImagePixelFormat.IPF_ABGR_8888);
};

window.addEventListener("click", () => {
  cameraListContainer.style.display = "none";
  up.style.display = "none";
  down.style.display = "inline-block";
});

// Recalculate the scan region when the window size changes
window.addEventListener("resize", () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    cameraEnhancer.setScanRegion(region());
  }, 500);
});

// Add click events to buttons
startScanningBtn.addEventListener("click", () => {
  // On start, start with Scan Both template
  scanBothBtn.click();
});
restartVideoBtn.addEventListener("click", restartVideo);
resultRestartBtn.addEventListener("click", restartVideo);

cameraSelector.addEventListener("click", (e) => {
  e.stopPropagation();
  const isShow = cameraListContainer.style.display === "block";
  cameraListContainer.style.display = isShow ? "none" : "block";
  up.style.display = !isShow ? "inline-block" : "none";
  down.style.display = isShow ? "inline-block" : "none";
});

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
      console.error(errMsg);
      alert(errMsg);
    });
});

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

// Toggle Settings Modal
scanModeContainer.addEventListener("click", () => (settingsModal.style.display = "flex"));
closeSettingsBtn.addEventListener("click", () => (settingsModal.style.display = "none"));
window.onclick = (event) => {
  if (event.target == settingsModal) settingsModal.style.display = "none";
};
