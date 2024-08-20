// Define some global variables that will be used
let cameraList = [];
let cameraView = null;
let cvRouter = null;
let cameraEnhancer = null;
let pInit = null;
let isSoundOn = true;
let timer = null;

const SCAN_MODES = ["barcode", "text", "both"];
const SCAN_TEMPLATES = {
  barcode: "ReadVINBarcode",
  text: "ReadVINText",
  both: "ReadVIN",
};
const SCAN_MODE_TITLES = {
  barcode: "Scan by Barcode",
  text: "Scan by Text",
  both: "Scan Text or Barcode",
};
let currentMode = SCAN_MODES[2]; // Set scan mode as "Scan Both" by default

let scanOrientation = "landscape";

const resolutions = {
  "Full HD": [1920, 1080], // Full HD
  HD: [1280, 720], // HD
};

// Get the UI element
const homePage = document.querySelector(".home-page");

const cameraViewContainer = document.querySelector(".camera-view-container");

const scanBothBtn = document.querySelector("#scan-both-btn");

const cameraListContainer = document.querySelector(".camera-list");
const cameraSelector = document.querySelector(".camera-selector");

const scannerContainer = document.querySelector(".scanner-container");
const startScanningBtn = document.querySelector(".start-btn");

const scanHelpMsg = document.querySelector(".scan-help-msg");
const scanModeContainer = document.querySelector(".scan-mode-container");

const resultContainer = document.querySelector(".result-container");
const parsedResultArea = document.querySelector(".parsed-result-area");
const parsedResultMain = document.querySelector(".parsed-result-main");
const resultImageContainer = document.querySelector("#result-image-container");

const copyResultBtn = document.querySelector(".copy-result-btn");
const saveImageBtn = document.querySelector(".save-image-btn");

const restartVideoBtn = document.querySelector(".btn-restart-video");

const playSoundBtn = document.querySelector(".music");
const closeSoundBtn = document.querySelector(".no-music");
const down = document.querySelector(".down");
const up = document.querySelector(".up");

const notification = document.querySelector("#notification");

const scanOrientationBtn = document.querySelector(".scan-orientation-btn");
const scanOrientationIcon = document.querySelector(".scan-orientation-icon");
