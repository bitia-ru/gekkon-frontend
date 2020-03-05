import React from 'react';
import * as R from 'ramda';
import { StyleSheet, css } from '../../../aphrodite';
import { joinObjects } from '../../../utils/algorithms';
import NotificationsListItemLayout from './NotificationsListItemLayout';


const NotificationsListLayout = ({ notifications }) => (
  <div className={css(style.container)}>
    {
      joinObjects(
        R.map(
          notification => (
            <NotificationsListItemLayout
              key={notification.id}
              notification={notification}
              onMarkViewed={() => { console.log('viewed', notification.id); }}
              onRemoveClicked={() => { console.log('remove', notification.id); }}
            />
          ),
        )(notifications),
        <span />,
      )
    }
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    width: '650px',
    fontSize: '14px',
    margin: '-18px 0px',

    '> div': {
      paddingRight: '45px',
      position: 'relative',
    },
    '> span': {
      display: 'block',
      height: '1px',
      width: 'calc(100% - 50px)',
      backgroundColor: '#DFDFDF',
    },
    '& a': {
      textDecoration: 'none',
      color: '#006CEB',
    },
  },
});

export default NotificationsListLayout;
