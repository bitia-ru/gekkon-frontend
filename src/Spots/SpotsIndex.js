import React                              from 'react';
import MainPageHeader                     from "../MainPageHeader/MainPageHeader";
import MainPageContent                    from "../MainPageContent/MainPageContent";
import Footer                             from "../Footer/Footer";
import {saveUser, saveToken, removeToken} from "../actions";
import {connect}                          from "react-redux";
import {withRouter}                       from "react-router-dom";
import Axios                              from 'axios';
import Qs                                 from 'qs';
import ApiUrl                             from '../ApiUrl';
import Cookies                            from 'js-cookie';
import SignUpForm                         from '../SignUpForm/SignUpForm';
import LogInForm                          from '../LogInForm/LogInForm';
import ResetPasswordForm                  from '../ResetPasswordForm/ResetPasswordForm';
import Profile                            from '../Profile/Profile';
import Authorization                      from '../Authorization';
import {ToastContainer}                   from 'react-toastr';
import {TOKEN_COOKIES_LIFETIME_SHORT}     from "../Constants/Cookies";
import StickyBar                          from '../StickyBar/StickyBar';

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
            email: '',
            numOfActiveRequests: 0
        });
        this.numOfActiveRequests = 0;
    }

    componentDidMount() {
        let url = new URL(window.location.href);
        let code = url.searchParams.get("activate_mail_code");
        if (code !== null) {
            this.numOfActiveRequests++;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            Axios.get(`${ApiUrl}/v1/users/mail_activation/${code}`)
                .then(response => {
                    this.numOfActiveRequests--;
                    this.setState({numOfActiveRequests: this.numOfActiveRequests});
                    this.container.success('Успешно', 'Активация email', {closeButton: true});
                }).catch(error => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                this.container.warning('При активации произошла ошибка', 'Активация email', {closeButton: true});
            });
        }
        code = url.searchParams.get("reset_password_code");
        if (code !== null) {
            this.setState({resetPasswordFormVisible: true, email: url.searchParams.get("name")})
        }
        if (url.searchParams.get("error") !== null) {
            let errorMsg = url.searchParams.get("error_description");
            this.container.error(errorMsg, 'Ошибка', {closeButton: true});
        }
        if (Cookies.get('user_session_token') !== undefined) {
            let token = Cookies.get('user_session_token');
            this.props.saveToken(token);
            this.signIn(token);
        }

    }

    changeNameFilter = (searchString) => {
        console.log(searchString);
    };

    content = () => {
        return <React.Fragment>
            {this.state.signUpFormVisible ?
                <SignUpForm onFormSubmit={this.submitSignUpForm} closeForm={this.closeSignUpForm}
                            enterWithVk={this.enterWithVk}
                            isWaiting={this.state.signUpIsWaiting}
                            formErrors={this.state.signUpFormErrors}
                            resetErrors={this.signUpResetErrors}/> : ''}
            {this.state.resetPasswordFormVisible ?
                <ResetPasswordForm onFormSubmit={this.submitResetPasswordForm} closeForm={this.closeResetPasswordForm}
                                   isWaiting={this.state.resetPasswordIsWaiting}
                                   formErrors={this.state.resetPasswordFormErrors} email={this.state.email}
                                   resetErrors={this.resetPasswordResetErrors}/> : ''}
            {this.state.logInFormVisible ?
                <LogInForm onFormSubmit={this.submitLogInForm} closeForm={this.closeLogInForm}
                           enterWithVk={this.enterWithVk}
                           isWaiting={this.state.logInIsWaiting}
                           resetPassword={this.resetPassword}
                           formErrors={this.state.logInFormErrors}
                           resetErrors={this.logInResetErrors}/> : ''}
            {this.state.profileFormVisible ?
                <Profile user={this.props.user} onFormSubmit={this.submitProfileForm}
                         showToastr={this.showToastr}
                         enterWithVk={this.enterWithVk}
                         isWaiting={this.state.profileIsWaiting}
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
        </React.Fragment>
    };

    render() {
        return <React.Fragment>
            <div
                style={{overflow: ((this.state.signUpFormVisible || this.state.logInFormVisible || this.state.profileFormVisible) ? 'hidden' : '')}}>
                <StickyBar loading={this.state.numOfActiveRequests > 0} content={this.content()}/>
                <Footer user={this.props.user}
                        logIn={this.logIn}
                        signUp={this.signUp}
                        logOut={this.logOut}/>
            </div>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    user: state.user,
    token: state.token
});

const mapDispatchToProps = dispatch => ({
    saveUser: user => dispatch(saveUser(user)),
    saveToken: token => dispatch(saveToken(token)),
    removeToken: () => dispatch(removeToken())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
