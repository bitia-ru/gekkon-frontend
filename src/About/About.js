import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import Cookies from 'js-cookie';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import Footer from '../Footer/Footer';
import {
  decreaseNumOfActiveRequests,
  increaseNumOfActiveRequests, removeToken, saveToken,
  saveUser,
} from '../actions';
import Authorization from '../Authorization';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import StickyBar from '../StickyBar/StickyBar';
import { TITLE, TITLES, ABOUT_DATA } from '../Constants/About';
import aboutImage from '../../img/about-us-header-img/about-us.jpg';

class About extends Authorization {
  componentDidMount() {
    const {
      history,
      saveToken: saveTokenProp,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      saveTokenProp(token);
      this.signIn(token);
    }
  }

  changeNameFilter = () => {
  };

  openProfileForm = () => {
    this.props.history.push('/about#profile');
    this.setState({ profileFormVisible: true });
  };

  closeProfileForm = () => {
    this.props.history.push('/about');
    this.setState({ profileFormVisible: false });
  };

  content = () => {
    const { user, numOfActiveRequests } = this.props;
    const {
      signUpIsWaiting,
      signUpFormVisible,
      logInIsWaiting,
      logInFormVisible,
      profileFormVisible,
      signUpFormErrors,
      logInFormErrors,
      profileFormErrors,
      profileIsWaiting,
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
          (user && profileFormVisible)
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
        <InfoPageHeader
          changeNameFilter={this.changeNameFilter}
          user={user}
          openProfile={this.openProfileForm}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
          title={TITLE}
          image={aboutImage}
        />
        <InfoPageContent titles={TITLES} data={ABOUT_DATA} />
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
    const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
    return (
      <div style={{ overflow: (showModal ? 'hidden' : '') }}>
        <StickyBar loading={numOfActiveRequests > 0} content={this.content()} />
        <Footer
          user={user}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
        />
      </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(About));
