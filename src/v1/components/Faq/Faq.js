import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import Cookies from 'js-cookie';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import Footer from '../Footer/Footer';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import StickyBar from '../StickyBar/StickyBar';
import { TITLE, TITLES, FAQ_DATA } from '../../Constants/Faq';
import { avail } from '../../utils';
import getState from '../../utils/getState';

class Faq extends React.PureComponent {
  componentDidMount() {
    const {
      history,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
  }

  changeNameFilter = () => {
  };

  content = () => {
    const { user } = this.props;
    const {
      signUpFormVisible,
      logInFormVisible,
      profileFormVisible,
      profileFormErrors,
      profileIsWaiting,
    } = this.state;
    return (
      <>
        {
          signUpFormVisible && (
            <SignUpForm
              closeForm={this.closeSignUpForm}
              enterWithVk={this.enterWithVk}
            />
          )
        }
        {
          logInFormVisible && (
            <LogInForm
              closeForm={this.closeLogInForm}
              enterWithVk={this.enterWithVk}
              resetPassword={this.resetPassword}
            />
          )
        }
        {
          (avail(user) && profileFormVisible) && (
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
          image={require('./images/faq.jpg')}
        />
        <InfoPageContent titles={TITLES} data={FAQ_DATA} />
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
    const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
    return (
      <div className={showModal ? null : 'page__scroll'}>
        <StickyBar loading={loading}>
          {this.content()}
        </StickyBar>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

export default withRouter(connect(mapStateToProps)(Faq));
