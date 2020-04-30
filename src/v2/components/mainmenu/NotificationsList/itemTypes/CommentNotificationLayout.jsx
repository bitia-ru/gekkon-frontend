import React from 'react';
import { Link } from 'react-router-dom';
import moment from '../../../../moment';
import { StyleSheet, css } from '../../../../aphrodite';
import AvatarRound from '../../../AvatarRound/AvatarRound';
import { timeFromNow } from '@/v1/Constants/DateTimeFormatter';


const CommentNotificationLayout = ({ notification }) => (
  <>
    <div className={css(style.avatarWrapper)}><AvatarRound user={notification.author} /></div>
    <span className={css(style.username)}>
      <Link to={`/users/${notification.author_id}`}>{ notification.author.unified_name }</Link>
    </span>
    <span> прокомментировал трассу </span>
    <Link
      to={
        `/spots/${notification.route.sector.spot_id}/sectors`
        + `/${notification.route.sector_id}/routes/${notification.route_id}`
      }
    >
      { notification.route.unified_number }
    </Link>
    <span> на скалодроме </span>
    { notification.route.sector.spot.name }
    { ' ' }
    <span className={css(style.dateTime)}>{ timeFromNow(moment(notification.event_at)) }</span>
  </>
);

const style = StyleSheet.create({
  avatarWrapper: {
    display: 'inline-block',
    float: 'left',
    marginRight: '15px',
    marginTop: '6px',
    marginBottom: '-6px',
  },
  username: {
    fontFamily: ['GilroyBold', 'sans-serif'],
  },
  dateTime: {
    color: '#B4BABC',
    fontSize: '0.85em',
    whiteSpace: 'nowrap',
  },
});

export default CommentNotificationLayout;
