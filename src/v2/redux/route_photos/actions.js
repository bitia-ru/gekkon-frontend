import Api from '../../utils/Api';

export const acts = {
  LOAD_PHOTOS_REQUEST: 'LOAD_PHOTOS_REQUEST_V2',
  LOAD_PHOTOS_FAILED: 'LOAD_USER_FAILED_V2',
  LOAD_PHOTOS_SUCCESS: 'LOAD_PHOTOS_SUCCESS_V2',
};

export const loadRoutePhotos = sectorId => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_PHOTOS_REQUEST,
    });

    Api.get(
      `/v1/sectors/${sectorId}/route_photos`,
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_PHOTOS_SUCCESS,
            route_photos: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_PHOTOS_FAILED,
          });

          console.log(error);
        },
      },
    );
  }
);
