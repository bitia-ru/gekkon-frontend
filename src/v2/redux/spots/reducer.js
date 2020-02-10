import * as R from 'ramda';
import { acts } from './actions';


const spotsReducer = (
  state = {},
  action,
) => {
  switch (action.type) {
  case acts.LOAD_SPOTS:
  case acts.LOAD_SPOTS_SUCCESS:
    if (action.spot) {
      return {
        ...state,
        [action.spot.id]: action.spot,
      };
    }
    return {
      ...state,
      ...R.reduce((l, s) => ({ ...l, [s.id]: s }), {})(action.spots),
    };
  default:
    return state;
  }
};

export default spotsReducer;
