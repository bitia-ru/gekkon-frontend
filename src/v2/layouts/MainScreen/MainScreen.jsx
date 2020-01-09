import React from 'react';
import Footer from '@/Footer/Footer';
import { css, StyleSheet } from '@/v2/aphrodite';
import Logo from '@/v2/components/Logo/Logo';
import MainNav from '@/v2/components/MainNav/MainNav';


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
        {header && header}
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
