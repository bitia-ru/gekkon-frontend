import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import Qs from 'qs';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastr';
import * as R from 'ramda';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainPageContent from '../MainPageContent/MainPageContent';
import Footer from '../Footer/Footer';
import {
  saveUser,
  saveToken,
  removeToken,
  increaseNumOfActiveRequests,
  decreaseNumOfActiveRequests,
} from '../actions';
import { ApiUrl } from '../Environ';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import Authorization from '../Authorization';
import StickyBar from '../StickyBar/StickyBar';
import { avail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';

Axios.interceptors.request.use((config) => {
  const configCopy = R.clone(config);
  configCopy.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });
  return configCopy;
});

class SpotsIndex extends Authorization {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      email: '',
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
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    const url = new URL(window.location.href);
    let code = url.searchParams.get('activate_mail_code');
    if (code !== null) {
      increaseNumOfActiveRequestsProp();
      const user_id = url.searchParams.get('user_id');
      Axios.get(`${ApiUrl}/v1/users/mail_activation/${code}`, { params: { id: user_id }, withCredentials: true })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          saveUserProp(response.data.payload);
          this.showToastr('success', 'Успешно', 'Активация email');
        }).catch(() => {
          decreaseNumOfActiveRequestsProp();
          this.showToastr('warning', 'Активация email', 'При активации произошла ошибка');
        });
    }
    code = url.searchParams.get('reset_password_code');
    if (code !== null) {
      const email = url.searchParams.get('user_email');
      this.setState(
        {
          resetPasswordFormVisible: true,
          email: email || url.searchParams.get('user_login'),
        },
      );
    }
    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      saveTokenProp(token);
      this.signIn(token);
    } else {
      saveUserProp({ id: null });
    }
  }

    changeNameFilter = () => {
    };

    openProfileForm = () => {
      const { history } = this.props;
      history.push('/#profile');
      this.setState({ profileFormVisible: true });
    };

    closeProfileForm = () => {
      const { history } = this.props;
      history.push('/');
      this.setState({ profileFormVisible: false });
    };

    content = () => {
      const { user, numOfActiveRequests } = this.props;
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
      return (
        <>
          {
            signUpFormVisible
              ? (
                <SignUpForm
                  onFormSubmit={this.submitSignUpForm}
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
                <ResetPasswordForm
                  onFormSubmit={this.submitResetPasswordForm}
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
                <LogInForm
                  onFormSubmit={this.submitLogInForm}
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
            (avail(user.id) && profileFormVisible)
              ? (
                <Profile
                  user={user}
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
          <ToastContainer
            ref={(ref) => {
              this.container = ref;
            }}
            onClick={() => this.container.clear()}
            className="toast-top-right"
          />
          <MainPageHeader
            changeNameFilter={this.changeNameFilter}
            user={userStateToUser(user)}
            openProfile={this.openProfileForm}
            logIn={this.logIn}
            signUp={this.signUp}
            logOut={this.logOut}
          />
          <MainPageContent />
        </>
      );
    };

    render() {
      const { user, numOfActiveRequests } = this.props;
      const {
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
      } = this.state;
      const showModal = (signUpFormVisible || logInFormVisible || profileFormVisible);
      return (
        <>
          <div className={showModal ? null : 'page__scroll'}>
            <StickyBar loading={numOfActiveRequests > 0} content={this.content()} />
            <Footer
              user={userStateToUser(user)}
              logIn={this.logIn}
              signUp={this.signUp}
              logOut={this.logOut}
            />
          </div>
        </>
      );
    }
}

const mapStateToProps = state => ({
  user: state.user,
  token: state.token,
  numOfActiveRequests: state.numOfActiveRequests,
});

const mapDispatchToProps = dispatch => ({
  saveUser: user => dispatch(saveUser(user)),
  saveToken: token => dispatch(saveToken(token)),
  removeToken: () => dispatch(removeToken()),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
