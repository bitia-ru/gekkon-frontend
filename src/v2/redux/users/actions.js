import Api from '../../utils/Api';

export const acts = {
  LOAD_SPECIFIC_USER_REQUEST: 'LOAD_SPECIFIC_USER_REQUEST',
  LOAD_USER_FAILED: 'LOAD_USER_FAILED',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
};

export const loadSpecificUser = userId => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_SPECIFIC_USER_REQUEST,
      userId,
    });

    Api.get(
      `/v1/users/${userId}`,
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_USER_SUCCESS,
            user: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_USER_FAILED,
          });

          console.log(error);
        },
      },
    );
  }
);
