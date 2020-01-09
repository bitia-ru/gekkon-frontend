import React from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from '@/v2/aphrodite';


const Logo = () => (
  <div className={css(styles.container)}>
    <Link to="/" className={css(styles.link)}>
      <span className={css(styles.iconContainer)}>
        <img src={require('./images/logo-75x75.png')} alt="RC" />
      </span>
    </Link>
  </div>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '75px',
    height: '75px',

    '@media screen and (max-width: 1440px)': {
      width: '65px',
      height: '65px',
    },
  },

  link: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0D0D0D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'box-shadow .4s ease-out',

    ':focus': {
      boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)',
    },
  },

  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',

    '> img': {
      width: '80%',
      height: '80%',
    },
  },
});

export default Logo;
