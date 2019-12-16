import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainPageContent from '../MainPageContent/MainPageContent';
import Footer from '../Footer/Footer';
import { ApiUrl } from '../Environ';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import BaseComponent from '../BaseComponent';
import StickyBar from '../StickyBar/StickyBar';
import { avail } from '../Utils';
import { activateEmail } from '../../v1/stores/users/utils';
import getState from '../../v1/utils/getState';

class SpotsIndex extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      email: '',
    });
  }

  componentDidMount() {
    const {
      history,
      activateEmail: activateEmailProp,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    const url = new URL(window.location.href);
    let code = url.searchParams.get('activate_mail_code');
    if (code !== null) {
      const user_id = url.searchParams.get('user_id');
      activateEmailProp(
        `${ApiUrl}/v1/users/mail_activation/${code}`,
        { id: user_id },
        () => this.showToastr('success', 'Успешно', 'Активация email'),
        () => this.showToastr(
          'warning', 'Активация email', 'При активации произошла ошибка',
        ),
      );
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
  }

    changeNameFilter = () => {
    };

    content = () => {
      const { user } = this.props;
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
            (avail(user) && profileFormVisible)
              ? (
                <Profile
                  user={user}
                  onFormSubmit={this.submitProfileForm}
                  removeVk={this.removeVk}
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
            user={user}
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
      const { user, loading } = this.props;
      const {
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
      } = this.state;
      const showModal = (signUpFormVisible || logInFormVisible || profileFormVisible);
      return (
        <>
          <div className={showModal ? null : 'page__scroll'}>
            <StickyBar loading={loading}>
              {this.content()}
            </StickyBar>
            <Footer
              user={user}
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
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  activateEmail: (url, params, afterSuccess, afterFail) => dispatch(
    activateEmail(url, params, afterSuccess, afterFail),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
