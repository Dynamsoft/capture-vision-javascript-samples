declare var cameraEnhancer: {
    getResolution: () => { width: number; height: number };
    getAvailableResolutions: () => Promise<{ width: number; height: number }[]>;
  };

