import React                    from 'react';
import Cookies                  from "js-cookie";
import Axios                    from "axios/index";
import {SALT_ROUNDS}            from "./Constants/Bcrypt";
import {TOKEN_COOKIES_LIFETIME} from "./Constants/Cookies";
import ApiUrl                   from "./ApiUrl";
import bcrypt                   from "bcryptjs";

export default class Authorization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            signUpFormVisible: false,
            logInFormVisible: false,
            profileFormVisible: false
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

    logIn = () => {
        this.setState({logInFormVisible: true});
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
                    this.submitLogInForm('email', data, password);
                }).catch(error => {
                alert(error);
            });
        }
    };

    submitLogInForm = (type, data, password) => {
        if (type === 'phone') {
            console.log("phone");
            console.log(data);
        }
        if (type === 'email') {
            let params;
            if (data.split('@').length === 2) {
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
                            Cookies.set('user_session_token', response.data.payload.token, {expires: TOKEN_COOKIES_LIFETIME});
                            this.props.saveUser(response.data.payload.user);
                            this.closeLogInForm();
                            if (this.afterSubmitLogInForm) {
                                this.afterSubmitLogInForm(response);
                            }
                        }).catch(error => {
                        alert(error);
                    });
                }).catch(error => {
                alert(error)
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
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        })
            .then(response => {
                this.props.saveUser(response.data.payload);
                this.closeProfileForm();
            }).catch(error => {
            alert(error);
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
}


