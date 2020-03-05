import React from 'react';
import { StyleSheet, css } from '../../../aphrodite';


const MainMenuNotificationButtonLayout = ({children, onRingerClick}) => (
  <div className={css(style.container)}>
    <div className={css(style.expandableContainer)}>
      <div className={css(style.ringerContainer)} onClick={onRingerClick}>
        <div>
          <img tabIndex={0} src={require('./assets/ringer.svg')} />
        </div>
      </div>
      <div className={css(style.childrenContainer)}>
        {children}
      </div>
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '75px',
  },
  expandableContainer: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: '100%',
    transition: 'width .3s ease-out',

    ':hover': {
      width: '200%',
    },
  },
  childrenContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  ringerContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',

    '> div': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80%',
      width: '50%',
      borderLeft: 'solid 1px #D8D8D8',

      '> img': {
        borderRadius: '50%',
        padding: 0,
        outline: 0,
        transition: 'padding .3s ease-out',

        ':hover': {
          cursor: 'pointer',
          backgroundColor: 'rgba(0,0,0,0.04)',
          padding: '15px',
        },
        ':active': {
          transition: 'padding .0s ease-out',
          padding: '5px',
        },
      },
    },
  },
});

// TODO: children should be the single element and should be not null.

export default MainMenuNotificationButtonLayout;
