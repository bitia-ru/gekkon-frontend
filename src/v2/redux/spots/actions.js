import Api from '../../utils/Api';
import toastHttpError from '@/v2/utils/toastHttpError';

export const acts = {
  LOAD_SPECIFIC_SPOT_REQUEST: 'LOAD_SPECIFIC_SPOT_REQUEST_V2',
  LOAD_SPOTS_REQUEST: 'LOAD_SPOTS_REQUEST_V2',
  LOAD_SPOTS_FAILED: 'LOAD_USER_FAILED_V2',
  LOAD_SPOTS_SUCCESS: 'LOAD_SPOTS_SUCCESS_V2',
  LOAD_SPOTS: 'LOAD_SPOTS_V2',
};

export const loadSpot = spotId => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_SPECIFIC_USER_REQUEST,
      spotId,
    });

    Api.get(
      `/v1/spots/${spotId}`,
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_SPOTS_SUCCESS,
            spot: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_SPOTS_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const loadSpots = () => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_SPOTS_REQUEST,
    });

    Api.get(
      '/v1/spots',
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_SPOTS_SUCCESS,
            spots: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_SPOTS_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);
