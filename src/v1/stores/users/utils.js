import Axios from 'axios';
import * as R from 'ramda';
import bcrypt from 'bcryptjs';
import { ApiUrl } from '../../Environ';
import {
  loadUsersRequest,
  loadUsersFailed,
  loadUsersSuccess,
  loadUserSuccess,
  loadSortedUserIds,
  logOutUserSuccess,
  resetPasswordSuccess,
  sendResetPasswordMailSuccess,
  logInSuccess,
} from './actions';

export const loadUsers = () => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios.get(`${ApiUrl}/v1/users`, { withCredentials: true })
      .then((response) => {
        const sortedUserIds = R.map(u => u.id, R.sort(
          (u1, u2) => u2.statistics.numOfCreatedRoutes - u1.statistics.numOfCreatedRoutes,
          response.data.payload,
        ));
        dispatch(loadUsersSuccess(response.data.payload));
        dispatch(loadSortedUserIds(sortedUserIds));
      }).catch((error) => {
        dispatch(loadUsersFailed());
        // dispatch(pushError(error));
      });
  }
);

export const signIn = afterSignIn => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios.get(`${ApiUrl}/v1/users/self`, { withCredentials: true })
      .then((response) => {
        console.log(response.data.payload);
        dispatch(loadUserSuccess(response.data.payload));
        if (afterSignIn) {
          afterSignIn(response.data.payload);
        }
      }).catch(() => {
        dispatch(loadUsersFailed());
        dispatch(logOutUserSuccess());
      });
  }
);

export const logIn = (params, password, afterLogInSuccess, afterLogInFail, onFormError) => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios.get(`${ApiUrl}/v1/user_sessions/new`, { params, withCredentials: true })
      .then((response) => {
        const hash = bcrypt.hashSync(password, response.data);
        const paramsCopy = R.clone(params);
        paramsCopy.user_session.user.password_digest = hash;
        Axios.post(`${ApiUrl}/v1/user_sessions`, paramsCopy)
          .then(() => {
            dispatch(logInSuccess());
            afterLogInSuccess();
          }).catch((error) => {
            dispatch(loadUsersFailed());
            if (error.response && error.response.status === 400 && error.response.statusText === 'Bad Request') {
              onFormError(error.response.data);
            } else {
            //  dispatch(pushError(error));
            }
            afterLogInFail();
          });
      }).catch((error) => {
        dispatch(loadUsersFailed());
        const resp = error.response;
        if (resp && resp.status === 404 && resp.statusText === 'Not Found' && resp.data.model === 'User') {
          onFormError({ email: ['Пользователь не найден'] });
        } else {
        //  dispatch(pushError(error));
        }
        afterLogInFail();
      });
  }
);

export const activateEmail = (url, params, afterSuccess, afterFail) => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios.get(url, { params, withCredentials: true })
      .then((response) => {
        dispatch(loadUserSuccess(response.data.payload));
        afterSuccess();
      }).catch(() => {
        dispatch(loadUsersFailed());
        // dispatch(pushError(error));
        afterFail();
      });
  }
);

export const logOut = afterSuccess => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios({
      url: `${ApiUrl}/v1/user_sessions/actions/log_out`,
      method: 'patch',
      config: { withCredentials: true },
    })
      .then(() => {
        dispatch(logOutUserSuccess());
        if (afterSuccess) {
          afterSuccess();
        }
      }).catch(() => {
        dispatch(loadUsersFailed());
        // dispatch(pushError(error));
      });
  }
);

export const signUp = (params, afterSuccess, afterFail, onFormError) => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios({
      url: `${ApiUrl}/v1/users`,
      method: 'post',
      data: params,
      config: { withCredentials: true },
    })
      .then((response) => {
        dispatch(loadUserSuccess(response.data.payload));
        afterSuccess(response);
      }).catch((error) => {
        dispatch(loadUsersFailed());
        if (error.response && error.response.status === 400 && error.response.statusText === 'Bad Request') {
          onFormError(error);
        } else {
          // dispatch(pushError(error));
        }
        afterFail();
      });
  }
);

export const resetPassword = (params, afterSuccess, afterFail, afterAll) => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios({
      url: `${ApiUrl}/v1/users/reset_password`,
      method: 'patch',
      data: params,
      config: { withCredentials: true },
    })
      .then(() => {
        dispatch(resetPasswordSuccess());
        afterSuccess();
        afterAll();
      }).catch((error) => {
        dispatch(loadUsersFailed());
        const resp = error.response;
        if (resp && resp.status === 404 && resp.statusText === 'Not Found' && resp.data.model === 'User') {
          afterFail();
        } else {
          // dispatch(pushError(error));
        }
        afterAll();
      });
  }
);

export const updateUser = (url, data, afterSuccess, afterFail, afterAll) => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios({
      url,
      method: 'patch',
      data,
      config: { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true },
    })
      .then((response) => {
        dispatch(loadUserSuccess(response.data.payload));
        if (afterSuccess) {
          afterSuccess(response.data.payload);
        }
        afterAll();
      }).catch((error) => {
        dispatch(loadUsersFailed());
        if (error.response && error.response.status === 400 && error.response.statusText === 'Bad Request') {
          afterFail(error);
        } else {
          // dispatch(pushError(error));
        }
        afterAll();
      });
  }
);

export const removeVk = (url, afterAll) => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios({
      url,
      method: 'delete',
      config: { withCredentials: true },
    })
      .then((response) => {
        dispatch(loadUserSuccess(response.data.payload));
        afterAll();
      }).catch((error) => {
        dispatch(loadUsersFailed());
        // dispatch(pushError(error));
        afterAll();
      });
  }
);

export const sendResetPasswordMail = (params, afterAll) => (
  (dispatch) => {
    dispatch(loadUsersRequest());

    Axios.get(
      `${ApiUrl}/v1/users/send_reset_password_mail`,
      { params, withCredentials: true },
    )
      .then((response) => {
        dispatch(sendResetPasswordMailSuccess(response.data.payload));
        afterAll(
          'success',
          'Восстановление пароля',
          'На почту было отправлено сообщение для восстановления пароля',
        );
      }).catch((error) => {
        dispatch(loadUsersFailed());
        // dispatch(pushError(error));
        const resp = error.response;
        if (resp && resp.status === 404 && resp.statusText === 'Not Found' && resp.data.model === 'User') {
          afterAll('error', 'Ошибка', 'Пользователь не найден');
        } else if (resp && resp.status === 400 && resp.statusText === 'Bad Request' && resp.data.email) {
          afterAll(
            'warning',
            'Восстановление пароля',
            'Без почты невозможно восстановить пароль. Обратитесь к администратору.',
          );
        } else {
          afterAll(
            'warning',
            'Восстановление пароля',
            'Не удалось отправить на почту сообщение для восстановления пароля',
          );
        }
      });
  }
);