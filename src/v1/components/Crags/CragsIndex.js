import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import Footer from '../Footer/Footer';
import { changeTab } from '../../actions';
import BaseComponent from '../BaseComponent';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import { avail } from '../../utils';

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
        profileFormErrors,
      } = this.state;
      const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
      return (
        <div className={showModal ? null : 'page__scroll'}>
          {
            signUpFormVisible
              ? (
                <SignUpForm
                  closeForm={this.closeSignUpForm}
                />
              )
              : ''
          }
          {
            logInFormVisible
              ? (
                <LogInForm
                  closeForm={this.closeLogInForm}
                  resetPassword={this.resetPassword}
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
  changeTab: tab => dispatch(changeTab(tab)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CragsIndex));
