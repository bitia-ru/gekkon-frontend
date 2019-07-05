import React                     from 'react';
import PropTypes                 from 'prop-types';
import Cookies                   from "js-cookie";
import Axios                     from "axios/index";
import {SALT_ROUNDS}             from "./Constants/Bcrypt";
import {Domain}                  from "./Constants/Cookies";
import ApiUrl                    from "./ApiUrl";
import bcrypt                    from "bcryptjs";
import * as R                    from "ramda";
import {CLIENT_ID, REDIRECT_URI} from "./Constants/Vk";
import {reEmail}                 from './Constants/Constraints';

export default class Authorization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            signUpFormVisible: false,
            logInFormVisible: false,
            profileFormVisible: window.location.hash === '#profile',
            resetPasswordFormVisible: false,
            signUpFormErrors: {},
            logInFormErrors: {},
            profileFormErrors: {},
            resetPasswordFormErrors: {},
            signUpIsWaiting: false,
            logInIsWaiting: false,
            resetPasswordIsWaiting: false,
            profileIsWaiting: false
        }
    }

    logOut = () => {
        const {
                  increaseNumOfActiveRequests,
                  token,
                  decreaseNumOfActiveRequests,
                  removeToken,
                  saveUser,
              } = this.props;
        increaseNumOfActiveRequests();
        Axios({
            url: `${ApiUrl}/v1/user_sessions/actions/log_out`,
            method: 'patch',
            data: {token: token},
            headers: {'TOKEN': token}
        })
            .then(() => {
                decreaseNumOfActiveRequests();
                removeToken();
                saveUser(null);
                if (this.afterLogOut) {
                    this.afterLogOut();
                }
            }).catch(error => {
            decreaseNumOfActiveRequests();
            this.displayError(error);
        });
    };

    signIn = (tokenNew, afterSignIn) => {
        const {
                  increaseNumOfActiveRequests,
                  token,
                  decreaseNumOfActiveRequests,
                  removeToken,
                  saveUser,
              } = this.props;
        increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/users/self`, {headers: {'TOKEN': (tokenNew ? tokenNew : token)}})
            .then(response => {
                decreaseNumOfActiveRequests();
                saveUser(response.data.payload);
                if (afterSignIn) {
                    afterSignIn(response.data.payload);
                }
            }).catch(() => {
            decreaseNumOfActiveRequests();
            Cookies.remove('user_session_token', {path: '', domain: Domain()});
            removeToken();
        });
    };

    signUp = () => {
        this.setState({signUpFormVisible: true});
    };

    signUpResetErrors = () => {
        this.setState({signUpFormErrors: {}});
    };

    logIn = () => {
        this.setState({logInFormVisible: true});
    };

    logInResetErrors = () => {
        this.setState({logInFormErrors: {}});
    };

    profileResetErrors = () => {
        this.setState({profileFormErrors: {}});
    };

    resetPasswordResetErrors = () => {
        this.setState({resetPasswordFormErrors: {}});
    };

    showToastr = (type, title, msg) => {
        switch (type) {
            case 'error':
                this.container.error(msg, title, {closeButton: true});
                break;
            case 'success':
                this.container.success(msg, title, {closeButton: true});
                break;
            case 'warning':
                this.container.warning(msg, title, {closeButton: true});
                break;
            default:
                break;
        }
    };

    displayError = (error) => {
        if (error.response.status === 404 && error.response.statusText === 'Not Found') {
            this.showToastr('error', 'Ошибка', error.response.data.message);
            return;
        }
        if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            this.showToastr('error', 'Ошибка', error.response.data);
            return;
        }
        this.showToastr('error', 'Ошибка', "Неожиданная ошибка");
    };

    submitSignUpForm = (type, data, password) => {
        const {
                  increaseNumOfActiveRequests,
                  decreaseNumOfActiveRequests,
                  saveToken,
                  saveUser,
              } = this.props;
        if (type === 'email') {
            this.setState({signUpIsWaiting: true});
            let salt = bcrypt.genSaltSync(SALT_ROUNDS);
            let hash = bcrypt.hashSync(password, salt);
            let params = {user: {password_digest: hash, email: data}};
            increaseNumOfActiveRequests();
            Axios.post(`${ApiUrl}/v1/users`, params)
                .then(response => {
                    decreaseNumOfActiveRequests();
                    this.closeSignUpForm();
                    saveUser(response.data.payload);
                    saveToken(response.data.payload.user_session.token);
                    this.setState({signUpIsWaiting: false});
                    this.showToastr(
                        'success',
                        'Вход выполнен',
                        'Вам на почту было отправлено письмо. Для окончания регистрации перейдите по ссылке в письме.'
                    );
                    if (this.afterSubmitSignUpForm) {
                        this.afterSubmitSignUpForm(response.data.payload.id);
                    }
                }).catch(error => {
                decreaseNumOfActiveRequests();
                if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
                    this.setState({signUpFormErrors: error.response.data});
                } else {
                    this.displayError(error)
                }
                this.setState({signUpIsWaiting: false});
            });
        }
    };

    submitLogInForm = (type, data, password, rememberMe) => {
        const {
                  increaseNumOfActiveRequests,
                  decreaseNumOfActiveRequests,
                  saveToken,
              } = this.props;
        if (type === 'email') {
            this.setState({logInIsWaiting: true});
            let params;
            if (R.test(reEmail, data)) {
                params = {user_session: {user: {email: data}}, rememberMe: rememberMe};
            } else {
                params = {user_session: {user: {login: data}}, rememberMe: rememberMe};
            }
            increaseNumOfActiveRequests();
            Axios.get(`${ApiUrl}/v1/user_sessions/new`, {params: params})
                .then(response => {
                    let hash = bcrypt.hashSync(password, response.data);
                    params.user_session.user.password_digest = hash;
                    Axios.post(`${ApiUrl}/v1/user_sessions`, params)
                        .then(resp => {
                            decreaseNumOfActiveRequests();
                            saveToken(resp.data.payload.token);
                            this.signIn(resp.data.payload.token, () => {
                                this.closeLogInForm();
                                if (this.afterSubmitLogInForm) {
                                    this.afterSubmitLogInForm(resp.data.payload.user_id);
                                }
                                this.setState({logInIsWaiting: false});
                            });
                        }).catch(error => {
                        decreaseNumOfActiveRequests();
                        if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
                            this.setState({logInFormErrors: error.response.data});
                        } else {
                            this.displayError(error)
                        }
                        this.setState({logInIsWaiting: false});
                    });
                }).catch(error => {
                decreaseNumOfActiveRequests();
                const resp = error.response;
                if (resp.status === 404 && resp.statusText === 'Not Found' && resp.data.model === 'User') {
                    this.setState({logInFormErrors: {email: ['Пользователь не найден']}});
                } else {
                    this.displayError(error)
                }
                this.setState({logInIsWaiting: false});
            });
        }
    };

    submitResetPasswordForm = (type, data, password) => {
        const {
                  increaseNumOfActiveRequests,
                  decreaseNumOfActiveRequests,
              } = this.props;
        if (type === 'email') {
            this.setState({resetPasswordIsWaiting: true});
            let url = new URL(window.location.href);
            let salt = bcrypt.genSaltSync(SALT_ROUNDS);
            let hash = bcrypt.hashSync(password, salt);
            let params;
            if (R.test(reEmail, data)) {
                params = {
                    user: {password_digest: hash, email: data},
                    token: url.searchParams.get("reset_password_code")
                };
            } else {
                params = {
                    user: {password_digest: hash, login: data},
                    token: url.searchParams.get("reset_password_code")
                };
            }
            increaseNumOfActiveRequests();
            Axios({url: `${ApiUrl}/v1/users/reset_password`, method: 'patch', data: params})
                .then(() => {
                    decreaseNumOfActiveRequests();
                    this.closeResetPasswordForm();
                    this.submitLogInForm('email', data, password);
                    this.setState({resetPasswordIsWaiting: false});
                }).catch(error => {
                decreaseNumOfActiveRequests();
                const resp = error.response;
                if (resp.status === 404 && resp.statusText === 'Not Found' && resp.data.model === 'User') {
                    this.showToastr(
                        'error',
                        'Ошибка',
                        'Срок действия ссылки для восстановления пароля истек или пользователь не найден'
                    );
                } else {
                    this.displayError(error)
                }
                this.setState({resetPasswordIsWaiting: false});
            });
        }
    };

    submitProfileForm = (data, afterSuccess) => {
        const {
                  user,
                  token,
                  saveUser,
                  increaseNumOfActiveRequests,
                  decreaseNumOfActiveRequests,
              } = this.props;
        this.setState({profileIsWaiting: true});
        if (data.password) {
            let salt = bcrypt.genSaltSync(SALT_ROUNDS);
            data.password_digest = bcrypt.hashSync(data.password, salt);
            delete data.password;
        }
        increaseNumOfActiveRequests();
        Axios({
            url: `${ApiUrl}/v1/users/${user.id}`,
            method: 'patch',
            data: data,
            headers: {'TOKEN': token},
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        })
            .then(response => {
                decreaseNumOfActiveRequests();
                saveUser(response.data.payload);
                this.setState({profileIsWaiting: false});
                if (afterSuccess) {
                    afterSuccess(response.data.payload);
                }
            }).catch(error => {
            decreaseNumOfActiveRequests();
            if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
                this.setState({profileFormErrors: error.response.data});
            } else {
                this.displayError(error)
            }
            this.setState({profileIsWaiting: false});
        });
    };

    closeSignUpForm = () => {
        this.setState({signUpFormVisible: false});
    };

    closeLogInForm = () => {
        this.setState({logInFormVisible: false});
    };

    closeResetPasswordForm = () => {
        this.setState({resetPasswordFormVisible: false});
    };

    enterWithVk = (type) => {
        const {token} = this.props;
        this.w = window.open(`https://oauth.vk.com/authorize?client_id=${CLIENT_ID}&scope=email%2Cphotos&redirect_uri=${REDIRECT_URI}&response_type=code&v=5.74&state=${JSON.stringify({
            method: type,
            token: (token ? token : '')
        })}`, "VK", "resizable,scrollbars,status");
        window.addEventListener("message", this.afterVkEnter);
    };

    afterVkEnter = (ev) => {
        const {saveToken} = this.props;
        if (ev.data.result !== 'success') {
            return;
        }
        ev.source.close();
        let token = Cookies.get('user_session_token');
        saveToken(token);
        this.signIn(token);
        this.setState({signUpFormVisible: false, logInFormVisible: false});
        window.removeEventListener("message", this.afterVkEnter);
    };

    removeVk = () => {
        const {
                  user,
                  token,
                  saveUser,
                  increaseNumOfActiveRequests,
                  decreaseNumOfActiveRequests,
              } = this.props;
        this.setState({profileIsWaiting: true});
        increaseNumOfActiveRequests();
        Axios({
            url: `${ApiUrl}/v1/users/${user.id}/integrations/vk`,
            method: 'delete',
            headers: {'TOKEN': token}
        })
            .then(response => {
                decreaseNumOfActiveRequests();
                saveUser(response.data.payload);
                this.setState({profileIsWaiting: false});
            }).catch(error => {
            decreaseNumOfActiveRequests();
            this.displayError(error);
            this.setState({profileIsWaiting: false});
        });
    };

    resetPassword = (type, data) => {
        const {
                  increaseNumOfActiveRequests,
                  decreaseNumOfActiveRequests,
              } = this.props;
        if (type === 'email') {
            let params;
            if (R.test(reEmail, data)) {
                params = {user: {email: data}};
            } else {
                params = {user: {login: data}};
            }
            increaseNumOfActiveRequests();
            Axios.get(`${ApiUrl}/v1/users/send_reset_password_mail`, {params: params})
                .then(() => {
                    decreaseNumOfActiveRequests();
                    this.showToastr(
                        'success',
                        'Восстановление пароля',
                        'На почту было отправлено сообщение для восстановления пароля'
                    );
                }).catch(error => {
                decreaseNumOfActiveRequests();
                const resp = error.response;
                if (resp.status === 404 && resp.statusText === 'Not Found' && resp.data.model === 'User') {
                    this.showToastr('error', 'Ошибка', 'Пользователь не найден');
                } else {
                    if (resp.status === 400 && resp.statusText === 'Bad Request' && resp.data.email) {
                        this.showToastr(
                            'warning',
                            'Восстановление пароля',
                            'Без почты невозможно восстановить пароль. Обратитесь к администратору.',
                        );
                    } else {
                        this.showToastr(
                            'warning',
                            'Восстановление пароля',
                            'Не удалось отправить на почту сообщение для восстановления пароля',
                        );
                    }
                }
            });
        }
    };
}

Authorization.propTypes = {
    user: PropTypes.object,
    token: PropTypes.string,
    saveUser: PropTypes.func,
    saveToken: PropTypes.func,
    removeToken: PropTypes.func,
    decreaseNumOfActiveRequests: PropTypes.func,
    increaseNumOfActiveRequests: PropTypes.func,
};

Authorization.defaultProps = {
    user: null,
    token: null,
    saveUser: null,
    saveToken: null,
    removeToken: null,
    decreaseNumOfActiveRequests: null,
    increaseNumOfActiveRequests: null,
};

