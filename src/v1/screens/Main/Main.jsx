import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import StickyBar from '../../components/StickyBar/StickyBar';
import Footer from '../../components/Footer/Footer';
import getState from '../../utils/getState';
import withModals from '../../modules/modalable';
import Profile from '../../components/Profile/Profile';
import LogInForm from '../../components/LogInForm/LogInForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';


class MainScreen extends React.PureComponent {
  modals() {
    return {
      profile: {
        controls: [],
        hashRoute: true,
        body: <Profile />,
      },
      signin: {
        controls: [],
        hashRoute: true,
        body: <LogInForm />,
      },
      signup: {
        controls: [],
        hashRoute: true,
        body: <SignUpForm />,
      },
      reset_password: {
        controls: [],
        hashRoute: true,
        body: <ResetPasswordForm />,
      },
    };
  }

  render() {
    const { children, header } = this.props;

    const showModal = false;
    const loading = false;

    return (
      <div className={showModal ? null : 'page__scroll'}>
        <StickyBar loading={loading}>
          <ToastContainer
            ref={(ref) => {
              this.container = ref;
            }}
            onClick={() => this.container.clear()}
            className="toast-top-right"
          />
          {header && header}
          {children && children}
        </StickyBar>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: getState(state),
});

export default withRouter(connect(mapStateToProps)(withModals(MainScreen)));
