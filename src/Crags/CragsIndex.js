import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import Footer from '../Footer/Footer';
import { saveUser, changeTab } from '../actions';
import Authorization from '../Authorization';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import { avail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';

class CragsIndex extends Authorization {
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

    openProfileForm = () => {
      this.setState({ profileFormVisible: true });
    };

    closeProfileForm = () => {
      this.setState({ profileFormVisible: false });
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
            (avail(user.id) && profileFormVisible) && (
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
            user={userStateToUser(user)}
            openProfile={this.openProfileForm}
            logIn={this.logIn}
            signUp={this.signUp}
            logOut={this.logOut}
          />
          <Footer
            user={userStateToUser(user)}
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
  tab: state.tab,
});

const mapDispatchToProps = dispatch => ({
  saveUser: user => dispatch(saveUser(user)),
  changeTab: tab => dispatch(changeTab(tab)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CragsIndex));
