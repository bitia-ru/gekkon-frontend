import React                                                       from 'react';
import Cookies                                                     from "js-cookie";
import Axios                                                       from "axios/index";
import {SALT_ROUNDS}                                               from "./Constants/Bcrypt";
import {TOKEN_COOKIES_LIFETIME_SHORT, TOKEN_COOKIES_LIFETIME_LONG} from "./Constants/Cookies";
import ApiUrl                                                      from "./ApiUrl";
import bcrypt                                                      from "bcryptjs";
import * as R                                                      from "ramda";

export default class Authorization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            signUpFormVisible: false,
            logInFormVisible: false,
            profileFormVisible: false,
            resetPasswordFormVisible: false,
            signUpFormErrors: {},
            logInFormErrors: {},
            profileFormErrors: {},
            resetPasswordFormErrors: {}
        }
    }

    logOut = () => {
        Cookies.remove('user_session_token', {path: ''});
        this.props.saveUser(null);
        if (this.afterLogOut) {
            this.afterLogOut();
        }
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

    displayError = (error) => {
        if (error.response.status === 404 && error.response.statusText === 'Not Found') {
            this.container.error(error.response.data.message, 'Ошибка', {closeButton: true});
            return;
        }
        if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            this.container.error(error.response.data, 'Ошибка', {closeButton: true});
            return;
        }
        this.container.error("Неожиданная ошибка", 'Ошибка', {closeButton: true});
    };

    submitSignUpForm = (type, data, password) => {
        if (type === 'phone') {
            console.log("phone");
            console.log(data);
        }
        if (type === 'email') {
            let salt = bcrypt.genSaltSync(SALT_ROUNDS);
            let hash = bcrypt.hashSync(password, salt);
            let params = {user: {password_digest: hash, email: data}};
            Axios.post(`${ApiUrl}/v1/users`, params)
                .then(response => {
                    this.closeSignUpForm();
                    this.submitLogInForm('email', data, password, false);
                }).catch(error => {
                if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
                    this.setState({signUpFormErrors: error.response.data});
                } else {
                    this.displayError(error)
                }
            });
        }
    };

    submitLogInForm = (type, data, password, rememberMe) => {
        if (type === 'phone') {
            console.log("phone");
            console.log(data);
        }
        if (type === 'email') {
            let re_email = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/;
            let params;
            if (R.test(re_email, data)) {
                params = {user_session: {user: {email: data}}};
            } else {
                params = {user_session: {user: {login: data}}};
            }
            Axios.get(`${ApiUrl}/v1/user_sessions/new`, {params: params})
                .then(response => {
                    let hash = bcrypt.hashSync(password, response.data);
                    params.user_session.user.password_digest = hash;
                    Axios.post(`${ApiUrl}/v1/user_sessions`, params)
                        .then(response => {
                            let lifeTime = rememberMe ? TOKEN_COOKIES_LIFETIME_LONG : TOKEN_COOKIES_LIFETIME_SHORT;
                            Cookies.set('user_session_token', response.data.payload.token, {expires: lifeTime});
                            this.props.saveUser(response.data.payload.user);
                            this.closeLogInForm();
                            if (this.afterSubmitLogInForm) {
                                this.afterSubmitLogInForm(response);
                            }
                        }).catch(error => {
                        if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
                            this.setState({logInFormErrors: error.response.data});
                        } else {
                            this.displayError(error)
                        }
                    });
                }).catch(error => {
                if (error.response.status === 404 && error.response.statusText === 'Not Found' && error.response.data.model === 'User') {
                    this.setState({logInFormErrors: {email: ['Пользователь не найден']}});
                } else {
                    this.displayError(error)
                }
            });
        }
    };

    submitResetPasswordForm = (type, data, password) => {
        if (type === 'phone') {
            console.log("phone");
            console.log(data);
        }
        if (type === 'email') {
            let url = new URL(window.location.href);
            let salt = bcrypt.genSaltSync(SALT_ROUNDS);
            let hash = bcrypt.hashSync(password, salt);
            let re_email = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/;
            let params;
            if (R.test(re_email, data)) {
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
            Axios({url: `${ApiUrl}/v1/users/reset_password`, method: 'patch', data: params})
                .then(response => {
                    this.closeResetPasswordForm();
                    this.submitLogInForm('email', data, password);
                }).catch(error => {
                if (error.response.status === 404 && error.response.statusText === 'Not Found' && error.response.data.model === 'User') {
                    this.container.error('Срок действия ссылки для восстановления пароля истек или пользователь не найден', 'Ошибка', {closeButton: true});
                } else {
                    this.displayError(error)
                }
            });
        }
    };

    submitProfileForm = (data) => {
        if (data.password) {
            let salt = bcrypt.genSaltSync(SALT_ROUNDS);
            data.password_digest = bcrypt.hashSync(data.password, salt);
            delete data.password;
        }
        Axios({
            url: `${ApiUrl}/v1/users/${this.props.user.id}`,
            method: 'patch',
            data: data,
            headers: {'TOKEN': Cookies.get('user_session_token')},
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        })
            .then(response => {
                this.props.saveUser(response.data.payload);
                this.closeProfileForm();
            }).catch(error => {
            if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
                this.setState({profileFormErrors: error.response.data});
            } else {
                this.displayError(error)
            }
        });
    };

    openProfileForm = () => {
        this.setState({profileFormVisible: true});
    };

    closeSignUpForm = () => {
        this.setState({signUpFormVisible: false});
    };

    closeLogInForm = () => {
        this.setState({logInFormVisible: false});
    };

    closeProfileForm = () => {
        this.setState({profileFormVisible: false});
    };

    closeResetPasswordForm = () => {
        this.setState({resetPasswordFormVisible: false});
    };

    resetPassword = (type, data) => {
        if (type === 'phone') {
            console.log("phone");
            console.log(data);
        }
        if (type === 'email') {
            let re_email = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/;
            let params;
            if (R.test(re_email, data)) {
                params = {user: {email: data}};
            } else {
                params = {user: {login: data}};
            }
            Axios.get(`${ApiUrl}/v1/users/send_reset_password_mail`, {params: params})
                .then(response => {
                    this.container.success('На почту было отправлено сообщение для восстановления пароля', 'Восстановление пароля', {closeButton: true});
                }).catch(error => {
                if (error.response.status === 404 && error.response.statusText === 'Not Found' && error.response.data.model === 'User') {
                    this.container.error('Пользователь не найден', 'Ошибка', {closeButton: true});
                } else {
                    if (error.response.status === 400 && error.response.statusText === 'Bad Request' && error.response.data.email) {
                        this.container.warning('Без почты невозможно восстановить пароль. Обратитесь к администратору.', 'Восстановление пароля', {closeButton: true});
                    } else {
                        this.container.warning('Не удалось отправить на почту сообщение для восстановления пароля', 'Восстановление пароля', {closeButton: true});
                    }
                }
            });
        }
    };
}


