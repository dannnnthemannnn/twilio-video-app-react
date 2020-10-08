import { mobileModel } from "react-device-detect";

const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

const PIXEL_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 1280,
  height: 768,
  frameRate: 24,
};

export function getDefaultVideoConstraints() {
  if (mobileModel.includes('Pixel')) {
    return PIXEL_VIDEO_CONSTRAINTS;
  }

  return DEFAULT_VIDEO_CONSTRAINTS;
}