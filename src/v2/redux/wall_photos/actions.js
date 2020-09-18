import Api from '../../utils/Api';
import toastHttpError from '@/v2/utils/toastHttpError';
import * as R from 'ramda';

export const acts = {
  LOAD_PHOTOS_REQUEST: 'LOAD_PHOTOS_REQUEST_V2',
  LOAD_PHOTOS_FAILED: 'LOAD_USER_FAILED_V2',
  LOAD_PHOTOS_SUCCESS: 'LOAD_PHOTOS_SUCCESS_V2',
  LOAD_PHOTO_SUCCESS: 'LOAD_PHOTO_SUCCESS_V2',
  REMOVE_PHOTO_SUCCESS: 'REMOVE_PHOTO_SUCCESS_V2',
  REMOVE_PHOTOS_SUCCESS: 'REMOVE_PHOTOS_SUCCESS_V2',
};

export const loadWallPhotos = sectorId => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_PHOTOS_REQUEST,
    });

    Api.get(
      `/v1/sectors/${sectorId}/wall_photos`,
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_PHOTOS_SUCCESS,
            wall_photos: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_PHOTOS_FAILED,
          });
          toastHttpError(error);
        },
      },
    );
  }
);

export const addWallPhoto = (params, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch({ type: acts.LOAD_PHOTOS_REQUEST });

    Api.post(
      '/v1/wall_photos',
      params,
      {
        method: 'post',
        type: 'form-multipart',
        success(payload) {
          dispatch({
            type: acts.LOAD_PHOTO_SUCCESS,
            wallPhoto: payload,
          });
          afterSuccess && afterSuccess(payload);
          afterAll && afterAll();
        },
        failed(error) {
          dispatch({ type: acts.LOAD_PHOTOS_FAILED });
          afterAll && afterAll();

          toastHttpError(error);
        },
      },
    );
  }
);

export const removeWallPhoto = (id, afterSuccess) => (
  (dispatch) => {
    dispatch({ type: acts.LOAD_PHOTOS_REQUEST });

    Api.post(
      `/v1/wall_photos/${id}`,
      null,
      {
        method: 'delete',
        success(payload) {
          dispatch({
            type: acts.REMOVE_PHOTO_SUCCESS,
            photoId: payload.id,
          });
          afterSuccess && afterSuccess(payload);
        },
        failed(error) {
          dispatch({ type: acts.LOAD_PHOTOS_FAILED });

          toastHttpError(error);
        },
      },
    );
  }
);

export const removeWallPhotos = (ids, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch({ type: acts.LOAD_PHOTOS_REQUEST });

    Api.post(
      '/v1/wall_photos',
      { wall_photo: R.map(id => ({ id }), ids) },
      {
        method: 'delete',
        success(payload) {
          dispatch({
            type: acts.REMOVE_PHOTOS_SUCCESS,
            photoIds: ids,
          });
          afterSuccess && afterSuccess(payload);
          afterAll && afterAll();
        },
        failed(error) {
          dispatch({ type: acts.LOAD_PHOTOS_FAILED });

          toastHttpError(error);
          afterAll && afterAll();
        },
      },
    );
  }
);
