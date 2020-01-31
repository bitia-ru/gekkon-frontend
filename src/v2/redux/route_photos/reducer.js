import * as R from 'ramda';
import { acts } from './actions';


const routePhotosReducer = (
  state = {},
  action,
) => {
  switch (action.type) {
  case acts.LOAD_PHOTOS_SUCCESS:
    return {
      ...state,
      ...R.reduce((l, u) => ({ ...l, [u.id]: u }), {})(action.route_photos),
    };
  default:
    return state;
  }
};

export default routePhotosReducer;
