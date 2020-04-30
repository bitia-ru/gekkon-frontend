import React from 'react';
import { StyleSheet, css } from '../../../aphrodite';
import CommentNotificationLayout from './itemTypes/CommentNotificationLayout';


const NotificationsListItemLayout = ({ notification, onMarkViewed, onRemoveClicked }) => (
  <div className={css(style.container)}>
    <div
      tabIndex={0}
      onClick={onMarkViewed && onMarkViewed}
      className={css(style.markViewedButtonWrapper, notification.viewed && style.viewed)}
    >
      <div />
    </div>
    {
      (() => {
        switch (notification.type) {
        case 'comment': return <CommentNotificationLayout notification={notification} />;
        default: return null;
        }
      })()
    }
    <div
      tabIndex={1}
      onClick={onRemoveClicked && onRemoveClicked}
      className={css(style.removeButtonWrapper)}
    >
      <img src={require('./assets/remove.svg')} />
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: '18px 25px',

    '> div:last-child': {
      float: 'right',
      display: 'none',
      position: 'absolute',
      marginRight: '10px',
      right: 0,
      top: 0,
      height: '100%',

      '> a': {
        display: 'block',
      },
    },

    ':hover': {
      backgroundColor: '#F6FBFF',

      '> div:last-child': {
        display: 'flex',
      },
    },
  },
  markViewedButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 'calc(6px + 5px * 2)',
    height: 'calc(6px + 5px * 2)',
    top: 'calc(50% - 6px - 2.5px)',
    left: 'calc(12.5px - 5px - 2.5px)',
    outline: 0,

    '> div': {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: '#006CEB',
      backgroundClip: 'content-box',
      transition: 'all .3s ease-out',
      border: 0,

      ':hover': {
        cursor: 'pointer',
        border: 'solid 5px rgba(0, 108, 235, 0.08)',
      },
      ':active': {
        border: 0,
        transition: 'all .0s ease-out',
      },
    },
  },
  viewed: {
    '> div': {
      backgroundColor: 'rgba(0, 108, 235, 0.05)',
      border: 'solid 3px rgba(0, 108, 235, 0.08)',
    },
  },
  removeButtonWrapper: {
    cursor: 'cursor',
    width: '46px',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 0,

    '> img': {
      flex: 0,
      borderRadius: '50%',
      padding: 0,
      outline: 0,
      transition: 'padding .3s ease-out',

      ':hover': {
        cursor: 'pointer',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        padding: '15px',
      },
      ':active': {
        transition: 'padding .0s ease-out',
        padding: '5px',
      },
    },
  },
});

// TODO: notification.type should be one of [ ... ]

export default NotificationsListItemLayout;
