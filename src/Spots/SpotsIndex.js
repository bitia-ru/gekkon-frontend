import React             from 'react';
import MainPageHeader    from "../MainPageHeader/MainPageHeader";
import MainPageContent   from "../MainPageContent/MainPageContent";
import Footer            from "../Footer/Footer";
import {saveUser}        from "../actions";
import {connect}         from "react-redux";
import {withRouter}      from "react-router-dom";
import Axios             from 'axios';
import Qs                from 'qs';
import ApiUrl            from '../ApiUrl';
import Cookies           from 'js-cookie';
import SignUpForm        from '../SignUpForm/SignUpForm';
import LogInForm         from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile           from '../Profile/Profile';
import Authorization     from '../Authorization';
import {ToastContainer}  from 'react-toastr';

Axios.interceptors.request.use(config => {
    config.paramsSerializer = params => {
        return Qs.stringify(params, {arrayFormat: "brackets"});
    };
    return config;
});

class SpotsIndex extends Authorization {
    constructor(props) {
        super(props);

        this.state = Object.assign(this.state, {
            email: ''
        });
    }

    componentDidMount() {
        let url = new URL(window.location.href);
        let code = url.searchParams.get("activate_mail_code");
        if (code !== null) {
            Axios.get(`${ApiUrl}/v1/users/mail_activation/${code}`)
                .then(response => {
                    this.container.success('Успешно', 'Активация email', {closeButton: true});
                }).catch(error => {
                this.container.warning('При активации произошла ошибка', 'Активация email', {closeButton: true});
            });
        }
        code = url.searchParams.get("reset_password_code");
        if (code !== null) {
            this.setState({resetPasswordFormVisible: true, email: url.searchParams.get("name")})
        }
        if (Cookies.get('user_session_token') !== undefined) {
            let params = {user_session: {token: Cookies.get('user_session_token')}};
            Axios.post(`${ApiUrl}/v1/user_sessions/sign_in`, params, {headers: {'TOKEN': Cookies.get('user_session_token')}})
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
        let container;
        return <div
            style={{overflow: ((this.state.signUpFormVisible || this.state.logInFormVisible || this.state.profileFormVisible) ? 'hidden' : '')}}>
            {this.state.signUpFormVisible ?
                <SignUpForm onFormSubmit={this.submitSignUpForm} closeForm={this.closeSignUpForm}
                            formErrors={this.state.signUpFormErrors}
                            resetErrors={this.signUpResetErrors}/> : ''}
            {this.state.resetPasswordFormVisible ?
                <ResetPasswordForm onFormSubmit={this.submitResetPasswordForm} closeForm={this.closeResetPasswordForm}
                                   formErrors={this.state.resetPasswordFormErrors} email={this.state.email}
                                   resetErrors={this.resetPasswordResetErrors}/> : ''}
            {this.state.logInFormVisible ?
                <LogInForm onFormSubmit={this.submitLogInForm} closeForm={this.closeLogInForm}
                           resetPassword={this.resetPassword}
                           formErrors={this.state.logInFormErrors}
                           resetErrors={this.logInResetErrors}/> : ''}
            {this.state.profileFormVisible ?
                <Profile user={this.props.user} onFormSubmit={this.submitProfileForm}
                         closeForm={this.closeProfileForm} formErrors={this.state.profileFormErrors}
                         resetErrors={this.profileResetErrors}/> : ''}
            <ToastContainer
                ref={ref => this.container = ref}
                onClick={() => this.container.clear()}
                className="toast-top-right"
            />
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
