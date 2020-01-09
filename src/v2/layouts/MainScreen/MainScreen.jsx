import React from 'react';
import Footer from '@/Footer/Footer';
import { css, StyleSheet } from '../../aphrodite';
import Logo from '../../components/Logo/Logo';
import MainNav from '../../components/MainNav/MainNav';
import TextHeader from './TextHeader';

import './scroll_workaround.css';


class MainScreen extends React.PureComponent {
  render() {
    const { children, header } = this.props;

    const showModal = false;

    return (
      <div
        className={
          css(
            style.container,
            !showModal && style.scrollable,
          )
        }
      >
        <Logo />
        <MainNav
          logIn={() => {}}
          signUp={() => {}}
          openProfile={() => {}}
          logOut={() => {}}
          user={null}
        />
        {
          header && (
            typeof header === 'string' || typeof header === 'number'
              ? <TextHeader title={header} /> : header
          )
        }
        {children && children}
        <Footer
          user={null}
          logIn={() => {}}
          signUp={() => {}}
          logOut={() => {}}
        />
      </div>
    );
  }
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    minHeight: '100vh',
  },
  scrollable: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
});

export default MainScreen;
