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
  default:
    return state;
  }
};

export default wallPhotosReducer;
