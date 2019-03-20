import React           from 'react';
import MainPageHeader  from "../MainPageHeader/MainPageHeader";
import MainPageContent from "../MainPageContent/MainPageContent";
import Footer          from "../Footer/Footer";
import {saveUser}      from "../actions";
import {connect}       from "react-redux";
import {withRouter}    from "react-router-dom";
import Axios           from 'axios';
import Qs              from 'qs';
import ApiUrl          from '../ApiUrl';
import Cookies         from 'js-cookie';
import SignUpForm      from '../SignUpForm/SignUpForm';
import LogInForm       from '../LogInForm/LogInForm';
import Profile         from '../Profile/Profile';
import Authorization   from '../Authorization';

Axios.interceptors.request.use(config => {
    config.paramsSerializer = params => {
        return Qs.stringify(params, {arrayFormat: "brackets"});
    };
    return config;
});

class SpotsIndex extends Authorization {

    componentDidMount() {
        if (Cookies.get('user_session_token') !== undefined) {
            let params = {user_session: {token: Cookies.get('user_session_token')}};
            Axios.post(`${ApiUrl}/v1/user_sessions/sign_in`, params)
                .then(response => {
                    this.props.saveUser(response.data.payload.user);
                }).catch(error => {
                Cookies.remove('user_session_token', {path: ''});
            });
        }
    }

    changeNameFilter = (searchString) => {
        console.log(searchString);
    };

    render() {
        return <div
            style={{overflow: ((this.state.signUpFormVisible || this.state.logInFormVisible || this.state.profileFormVisible) ? 'hidden' : '')}}>
            {this.state.signUpFormVisible ?
                <SignUpForm onFormSubmit={this.submitSignUpForm} closeForm={this.closeSignUpForm}/> : ''}
            {this.state.logInFormVisible ?
                <LogInForm onFormSubmit={this.submitLogInForm} closeForm={this.closeLogInForm}/> : ''}
            {this.state.profileFormVisible ?
                <Profile user={this.props.user} onFormSubmit={this.submitProfileForm}
                         closeForm={this.closeProfileForm}/> : ''}
            <MainPageHeader
                changeNameFilter={this.changeNameFilter}
                user={this.props.user}
                openProfile={this.openProfileForm}
                logIn={this.logIn}
                signUp={this.signUp}
                logOut={this.logOut}/>
            <MainPageContent/>
            <Footer user={this.props.user}
                    logIn={this.logIn}
                    signUp={this.signUp}
                    logOut={this.logOut}/>
        </div>
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    saveUser: user => dispatch(saveUser(user))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
