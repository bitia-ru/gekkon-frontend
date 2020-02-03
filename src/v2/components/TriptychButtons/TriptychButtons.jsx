import React from 'react';
import * as R from 'ramda';
import theme from '../../theme';
import { StyleSheet, css } from '../../aphrodite';


const TryptichButtons = ({ buttons }) => (
  <div className={css(style.container)}>
    {
      R.addIndex(R.map)(
        (button, i) => (
          <div
            key={button.key || i}
            className={css(style.button, button.default && style.defaultButton)}
            onClick={() => { if (typeof button.onClick === 'function') button.onClick(); }}
          >
            <div>
              <div>{ button.icon && <img src={button.icon} /> }</div>
              <div>{button.name}</div>
            </div>
          </div>
        ),
      )(buttons)
    }
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'row',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '120px',
    backgroundColor: theme.controls.buttons.notDefault.background,
    color: theme.controls.buttons.notDefault.foreground,
    fontFamily: 'GilroyBold',
    '> div': {
      '> div': {
        textAlign: 'center',
      },
    },
    ':hover': {
      backgroundColor: theme.controls.buttons.notDefault.hovered.background,
      color: theme.controls.buttons.notDefault.hovered.foreground,
    },
    ':active': {
      backgroundColor: theme.controls.buttons.notDefault.pressed.background,
      color: theme.controls.buttons.notDefault.pressed.foreground,
    },
    cursor: 'pointer',
  },
  defaultButton: {
    height: '128px',
    paddingLeft: '10px',
    paddingRight: '10px',
    backgroundColor: theme.controls.buttons.default.background,
    color: theme.controls.buttons.default.foreground,
    boxShadow: '0px 6px 6px rgba(0, 34, 74, 0.12)',
    ':hover': {
      backgroundColor: theme.controls.buttons.default.hovered.background,
      color: theme.controls.buttons.default.hovered.foreground,
    },
    ':active': {
      backgroundColor: theme.controls.buttons.default.pressed.background,
      color: theme.controls.buttons.default.pressed.foreground,
    },
  },
});


export default TryptichButtons;
