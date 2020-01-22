import MobileDetect from 'mobile-detect';
import * as R from 'ramda';

export const isNeeded = (exifAngle) => {
  if (!exifAngle) { return false; }
  const md = new MobileDetect(window.navigator.userAgent);
  if (md.os() !== 'iOS') {
    return true;
  }
  return false;
};

export const fixRoutePhotoUpdateParams = (exifAngle, photoParams) => {
  const newPhotoParams = R.clone(photoParams);
  newPhotoParams.rotate -= exifAngle;
  return newPhotoParams;
};
