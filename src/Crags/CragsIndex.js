import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import Footer from '../Footer/Footer';
import { changeTab } from '../actions';
import BaseComponent from '../BaseComponent';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import { avail } from '../Utils';
import { logOutUser } from '../../v1/stores/users/actions';
import { signIn } from '../../v1/stores/users/utils';

class CragsIndex extends BaseComponent {
  componentDidMount() {
    window.history.back();
  }

  componentWillUnmount() {
    const { changeTab: changeTabProp } = this.props;
    alert('Раздел находится в разработке');
    changeTabProp(1);
  }

    changeNameFilter = () => {
    };

    render() {
      const { user } = this.props;
      const {
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
        signUpFormErrors,
        logInFormErrors,
        profileFormErrors,
      } = this.state;
      const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
      return (
        <div className={showModal ? null : 'page__scroll'}>
          {
            signUpFormVisible
              ? (
                <SignUpForm
                  onFormSubmit={this.submitSignUpForm}
                  closeForm={this.closeSignUpForm}
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
                  resetPassword={this.resetPassword}
                  formErrors={logInFormErrors}
                  resetErrors={this.logInResetErrors}
                />
              ) : ''
          }
          {
            (avail(user) && profileFormVisible) && (
              <Profile
                user={user}
                onFormSubmit={this.submitProfileForm}
                closeForm={this.closeProfileForm}
                formErrors={profileFormErrors}
                resetErrors={this.profileResetErrors}
              />
            )
          }
          <MainPageHeader
            changeNameFilter={this.changeNameFilter}
            user={user}
            openProfile={this.openProfileForm}
            logIn={this.logIn}
            signUp={this.signUp}
            logOut={this.logOut}
          />
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
  user: state.usersStore.users[state.usersStore.currentUserId],
  tab: state.tab,
});

const mapDispatchToProps = dispatch => ({
  signIn: (afterSignIn) => dispatch(signIn(afterSignIn)),
  logOutUser: () => dispatch(logOutUser()),
  changeTab: tab => dispatch(changeTab(tab)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CragsIndex));
