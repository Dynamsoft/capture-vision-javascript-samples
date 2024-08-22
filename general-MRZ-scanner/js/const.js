// Define some global variables that will be used
let cameraList = [];
let cameraView = null;
let cameraEnhancer = null;
let cvRouter = null;
let pInit = null; // Promise of init
let isSoundOn = true;
let timer = null;

const SCAN_MODES = ["id", "passport", "both"];
const SCAN_TEMPLATES = {
  id: "ReadId",
  passport: "ReadPassport",
  both: "ReadPassportAndId",
};
let currentMode = SCAN_MODES[2]; // Set scan mode as "Scan Both" by default

// Aspect Ratio of MRZ Guide Box
const MRZ_GUIDEBOX_ASPECT_RATIO = 6.73;

// Get the UI element
const homePage = document.querySelector(".home-page");

const cameraViewContainer = document.querySelector(".camera-view-container");

const cameraListContainer = document.querySelector(".camera-list");
const cameraSelector = document.querySelector(".camera-selector");

const scannerContainer = document.querySelector(".scanner-container");

const mrzGuideFrame = document.querySelector(".mrz-frame");

const resultContainer = document.querySelector(".result-container");
const parsedResultArea = document.querySelector(".parsed-result-area");

const startScaningBtn = document.querySelector(".start-btn");

const scanModeContainer = document.querySelector(".scan-mode-container");
const scanBothBtn = document.querySelector("#scan-both-btn");

const resultRestartBtn = document.querySelector(".result-restart");
const restartVideoBtn = document.querySelector(".btn-restart-video");

const playSoundBtn = document.querySelector(".music");
const closeSoundBtn = document.querySelector(".no-music");
const down = document.querySelector(".down");
const up = document.querySelector(".up");
