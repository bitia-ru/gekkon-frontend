import React from 'react';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import Footer from '../../components/Footer/Footer';
import { css, StyleSheet } from '../../aphrodite';
import Logo from '../../components/Logo/Logo';
import MainNav from '../../components/MainNav/MainNav';
import withModals, { ModalContainerContext } from '../../modules/modalable';
import Profile from '../../forms/Profile/Profile';
import LogInForm from '../../forms/LogInForm/LogInForm';
import SignUpForm from '../../forms/SignUpForm/SignUpForm';
import ResetPasswordForm from '../../forms/ResetPasswordForm/ResetPasswordForm';
import TextHeader from './TextHeader';

import './scroll_workaround.css';
import LoadingIndicator from '@/v2/components/LoadingIndicator/LoadingIndicator';


class MainScreen extends React.PureComponent {
  modals() {
    return {
      profile: {
        hashRoute: true,
        body: <Profile />,
      },
      signin: {
        hashRoute: true,
        body: <LogInForm />,
      },
      signup: {
        hashRoute: true,
        body: <SignUpForm />,
      },
      reset_password: {
        hashRoute: true,
        body: <ResetPasswordForm />,
      },
    };
  }

  render() {
    const { children, header } = this.props;

    return (
      <ModalContainerContext.Consumer>
        {
          ({ isModalShown: isModalableWindowShown }) => {
            const isRoutedModalShown = !!R.find(urlRe => window.location.pathname.match(urlRe))([
              /\/spots\/[0-9]+\/routes\/[0-9]+(\/.*)?/,
              /\/spots\/[0-9]+\/sectors\/[0-9]+\/routes\/[0-9]+(\/.*)?/,
            ]);

            const isModalShown = isModalableWindowShown || isRoutedModalShown;

            return (
              <div
                className={
                  css(
                    style.container,
                    isModalShown ? style.unscrollable : style.scrollable,
                  )
                }
              >
                <div style={{ flex: 1 }}>
                  <LoadingIndicator isSticky={!isModalShown}>
                    <Logo />
                    <MainNav />
                    {
                      header && (
                        typeof header === 'string' || typeof header === 'number'
                          ? <TextHeader title={header} /> : header
                      )
                    }
                    {children && children}
                  </LoadingIndicator>
                </div>
                <div style={{ flex: 0 }}>
                  <Footer />
                </div>
              </div>
            );
          }
        }
      </ModalContainerContext.Consumer>
    );
  }
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    height: '100vh',
    overflowX: 'hidden',
  },
  scrollable: {
    overflowY: 'auto',
  },
  unscrollable: {
    overflowY: 'hidden',
  },
});

export default withRouter(withModals(MainScreen));
