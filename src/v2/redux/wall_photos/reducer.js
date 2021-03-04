import * as R from 'ramda';
import { acts } from './actions';


const wallPhotosReducer = (
  state = {},
  action,
) => {
  switch (action.type) {
  case acts.LOAD_PHOTOS_SUCCESS:
    return {
      ...state,
      ...R.reduce((l, u) => ({ ...l, [u.id]: u }), {})(action.wall_photos),
    };
  case acts.LOAD_PHOTO_SUCCESS:
    return {
      ...state,
      [action.wallPhoto.id]: action.wallPhoto,
    };
  case acts.REMOVE_PHOTO_SUCCESS:
    return R.dissoc(action.photoId, state);
  case acts.REMOVE_PHOTOS_SUCCESS:
    return R.omit(action.photoIds, state);
  default:
    return state;
  }
};

export default wallPhotosReducer;
