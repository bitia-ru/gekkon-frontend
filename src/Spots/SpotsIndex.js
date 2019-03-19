import React                    from 'react';
import MainPageHeader           from "../MainPageHeader/MainPageHeader";
import MainPageContent          from "../MainPageContent/MainPageContent";
import Footer                   from "../Footer/Footer";
import {saveUser}               from "../actions";
import {connect}                from "react-redux";
import {withRouter}             from "react-router-dom";
import {SALT_ROUNDS}            from "../Constants/Bcrypt";
import bcrypt                   from "bcryptjs";
import Axios                    from 'axios';
import Qs                       from 'qs';
import ApiUrl                   from '../ApiUrl';
import Cookies                  from 'js-cookie';
import {TOKEN_COOKIES_LIFETIME} from '../Constants/Cookies'

Axios.interceptors.request.use(config => {
    config.paramsSerializer = params => {
        return Qs.stringify(params, {arrayFormat: "brackets"});
    };
    return config;
});

class SpotsIndex extends React.Component {

    componentDidMount() {
        if (Cookies.get('user_session_token') !== undefined) {
            let params = {user_session: {token: Cookies.get('user_session_token')}};
            Axios.post(`${ApiUrl}/v1/user_sessions/sign_in`, params)
                .then(response => {
                    this.props.saveUser(response.data.payload.user);
                }).catch(error => {
                Cookies.remove('user_session_token', { path: '' });
            });
        }
    }

    logOut = () => {
        Cookies.remove('user_session_token', { path: '' });
        this.props.saveUser(null);
    };

    signUp = () => {
        let login = prompt('Введите login для регистрации', '');
        let password = prompt('Введите пароль для регистрации', '');
        let salt = bcrypt.genSaltSync(SALT_ROUNDS);
        let hash = bcrypt.hashSync(password, salt);
        let params = {user: {password_digest: hash, login: login, email: `${login}@mail.ru`}};
        Axios.post(`${ApiUrl}/v1/users`, params)
            .then(response => {
                this.logIn();
            }).catch(error => {
            alert(error);
        });
    };

    logIn = () => {
        let login = prompt('Введите login для входа', '');
        let password = prompt('Введите пароль для входа', '');
        let params = {user_session: {user: {login: login}}};
        Axios.get(`${ApiUrl}/v1/user_sessions/new`, {params: params})
            .then(response => {
                let hash = bcrypt.hashSync(password, response.data);
                let params = {user_session: {user: {password_digest: hash, login: login}}};
                Axios.post(`${ApiUrl}/v1/user_sessions`, params)
                    .then(response => {
                        Cookies.set('user_session_token', response.data.payload.token, {expires: TOKEN_COOKIES_LIFETIME});
                        this.props.saveUser(response.data.payload.user);
                    }).catch(error => {
                    alert(error);
                });
            }).catch(error => {
            alert(error)
        });
    };

    changeNameFilter = (searchString) => {
        console.log(searchString);
    };

    render() {
        return <React.Fragment>
            <MainPageHeader
                changeNameFilter={this.changeNameFilter}
                user={this.props.user}
                logIn={this.logIn}
                signUp={this.signUp}
                logOut={this.logOut}/>
            <MainPageContent/>
            <Footer user={this.props.user}
                    logIn={this.logIn}
                    logOut={this.logOut}/>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    saveUser: user => dispatch(saveUser(user))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
