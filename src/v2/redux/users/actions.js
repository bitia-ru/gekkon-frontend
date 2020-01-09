import Api from '../../utils/Api';

export const acts = {
  LOAD_USERS_REQUEST: 'LOAD_USERS_REQUEST',
  LOAD_SPECIFIC_USER_REQUEST: 'LOAD_SPECIFIC_USER_REQUEST',
  LOAD_USERS_FAILED: 'LOAD_USER_FAILED',
  LOAD_USERS_SUCCESS: 'LOAD_USER_SUCCESS',
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
            type: acts.LOAD_USERS_SUCCESS,
            user: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_USERS_FAILED,
          });

          console.log(error);
        },
      },
    );
  }
);

export const loadUsers = () => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_USERS_REQUEST,
    });

    Api.get(
      '/v1/users',
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_USERS_SUCCESS,
            users: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_USERS_FAILED,
          });

          console.log(error);
        },
      },
    );
  }
);
