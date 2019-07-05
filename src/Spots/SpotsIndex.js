import React              from 'react';
import MainPageHeader     from "../MainPageHeader/MainPageHeader";
import MainPageContent    from "../MainPageContent/MainPageContent";
import Footer             from "../Footer/Footer";
import {
    saveUser,
    saveToken,
    removeToken,
    increaseNumOfActiveRequests,
    decreaseNumOfActiveRequests
}                         from "../actions";
import {connect}          from "react-redux";
import {withRouter, Link} from "react-router-dom";
import Axios              from 'axios';
import Qs                 from 'qs';
import ApiUrl             from '../ApiUrl';
import Cookies            from 'js-cookie';
import SignUpForm         from '../SignUpForm/SignUpForm';
import LogInForm          from '../LogInForm/LogInForm';
import ResetPasswordForm  from '../ResetPasswordForm/ResetPasswordForm';
import Profile            from '../Profile/Profile';
import Authorization      from '../Authorization';
import {ToastContainer}   from 'react-toastr';
import StickyBar          from '../StickyBar/StickyBar';

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
        const {
                  history,
                  increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
                  decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
                  saveUser: saveUserProp,
                  saveToken: saveTokenProp,
              } = this.props;
        history.listen((location, action) => {
            if (action === 'POP') {
                this.setState({profileFormVisible: (location.hash === '#profile')});
            }
        });
        let url = new URL(window.location.href);
        let code = url.searchParams.get("activate_mail_code");
        if (code !== null) {
            increaseNumOfActiveRequestsProp();
            let user_id = url.searchParams.get("user_id");
            Axios.get(`${ApiUrl}/v1/users/mail_activation/${code}`, {params: {id: user_id}})
                .then(response => {
                    decreaseNumOfActiveRequestsProp();
                    saveUserProp(response.data.payload);
                    this.showToastr('success', 'Успешно', 'Активация email');
                }).catch(error => {
                decreaseNumOfActiveRequestsProp();
                this.showToastr('warning', 'Активация email', 'При активации произошла ошибка');
            });
        }
        code = url.searchParams.get("reset_password_code");
        if (code !== null) {
            let email = url.searchParams.get("user_email");
            this.setState({resetPasswordFormVisible: true, email: email ? email : url.searchParams.get("user_login")})
        }
        if (Cookies.get('user_session_token') !== undefined) {
            let token = Cookies.get('user_session_token');
            saveTokenProp(token);
            this.signIn(token);
        }

    }

    changeNameFilter = (searchString) => {
        console.log(searchString);
    };

    openProfileForm = () => {
        const {history} = this.props;
        history.push('/#profile');
        this.setState({profileFormVisible: true});
    };

    closeProfileForm = () => {
        const {history} = this.props;
        history.push('/');
        this.setState({profileFormVisible: false});
    };

    content = () => {
        const {user, numOfActiveRequests} = this.props;
        const {
                  signUpFormVisible,
                  signUpIsWaiting,
                  signUpFormErrors,
                  resetPasswordFormVisible,
                  resetPasswordIsWaiting,
                  resetPasswordFormErrors,
                  email,
                  logInFormVisible,
                  logInIsWaiting,
                  logInFormErrors,
                  profileFormVisible,
                  profileIsWaiting,
                  profileFormErrors,
              } = this.state;
        return <React.Fragment>
            {
                signUpFormVisible
                    ? (
                        <SignUpForm onFormSubmit={this.submitSignUpForm}
                                    closeForm={this.closeSignUpForm}
                                    enterWithVk={this.enterWithVk}
                                    isWaiting={signUpIsWaiting}
                                    formErrors={signUpFormErrors}
                                    resetErrors={this.signUpResetErrors}
                        />
                    )
                    : ''
            }
            {
                resetPasswordFormVisible
                    ? (
                        <ResetPasswordForm onFormSubmit={this.submitResetPasswordForm}
                                           closeForm={this.closeResetPasswordForm}
                                           isWaiting={resetPasswordIsWaiting}
                                           formErrors={resetPasswordFormErrors}
                                           email={email}
                                           resetErrors={this.resetPasswordResetErrors}
                        />
                    )
                    : ''
            }
            {
                logInFormVisible
                    ? (
                        <LogInForm onFormSubmit={this.submitLogInForm}
                                   closeForm={this.closeLogInForm}
                                   enterWithVk={this.enterWithVk}
                                   isWaiting={logInIsWaiting}
                                   resetPassword={this.resetPassword}
                                   formErrors={logInFormErrors}
                                   resetErrors={this.logInResetErrors}
                        />
                    )
                    : ''
            }
            {
                (user && profileFormVisible)
                    ? (
                        <Profile user={user}
                                 onFormSubmit={this.submitProfileForm}
                                 removeVk={this.removeVk}
                                 numOfActiveRequests={numOfActiveRequests}
                                 showToastr={this.showToastr}
                                 enterWithVk={this.enterWithVk}
                                 isWaiting={profileIsWaiting}
                                 closeForm={this.closeProfileForm}
                                 formErrors={profileFormErrors}
                                 resetErrors={this.profileResetErrors}
                        />
                    )
                    : ''
            }
            <ToastContainer ref={ref => this.container = ref}
                            onClick={() => this.container.clear()}
                            className="toast-top-right"
            />
            <MainPageHeader
                changeNameFilter={this.changeNameFilter}
                user={user}
                openProfile={this.openProfileForm}
                logIn={this.logIn}
                signUp={this.signUp}
                logOut={this.logOut}/>
            <MainPageContent/>
        </React.Fragment>
    };

    render() {
        const {user, numOfActiveRequests} = this.props;
        const {
                  signUpFormVisible,
                  logInFormVisible,
                  profileFormVisible,
              } = this.state;
        return <React.Fragment>
            <div
                style={{overflow: ((signUpFormVisible || logInFormVisible || profileFormVisible) ? 'hidden' : '')}}>
                <StickyBar loading={numOfActiveRequests > 0} content={this.content()}/>
                <Footer user={user}
                        logIn={this.logIn}
                        signUp={this.signUp}
                        logOut={this.logOut}/>
            </div>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    user: state.user,
    token: state.token,
    numOfActiveRequests: state.numOfActiveRequests
});

const mapDispatchToProps = dispatch => ({
    saveUser: user => dispatch(saveUser(user)),
    saveToken: token => dispatch(saveToken(token)),
    removeToken: () => dispatch(removeToken()),
    increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
    decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
