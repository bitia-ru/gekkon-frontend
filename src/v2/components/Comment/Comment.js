import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AvatarRound from '../AvatarRound/AvatarRound';
import { COMMENT_DATETIME_FORMAT } from '../../Constants/Date';
import { timeFromNow } from '../../Constants/DateTimeFormatter';
import { StyleSheet, css } from '../../aphrodite';

const Comment = ({
  user, comment, startAnswer, removeComment,
}) => {
  const created_at = new Date(comment.created_at);
  return (
    <div className={css(styles.comment)}>
      <AvatarRound user={comment.author} />
      <div className={css(styles.commentContent)}>
        <a
          role="link"
          tabIndex={0}
          style={{ outline: 'none' }}
          className={css(styles.commentName)}
        >
          {
            comment.author.name
              ? comment.author.name
              : comment.author.login
          }
        </a>
        <div className={css(styles.commentText)}>{comment.content}</div>
        <div className={css(styles.commentFooter)}>
          <div
            className={css(styles.commentDate)}
            title={moment(created_at).format(COMMENT_DATETIME_FORMAT)}
          >
            {timeFromNow(moment(created_at))}
          </div>
          {
            (user && (user.name || user.login))
              ? (
                <>
                  <a
                    role="link"
                    tabIndex={0}
                    style={{ outline: 'none' }}
                    className={css(styles.commentAnswer)}
                    onClick={() => startAnswer(comment)}
                  >
                    Ответить
                  </a>
                  &nbsp;
                </>
              )
              : ''
          }
          {
            (user && (user.id === comment.author_id || user.role === 'admin'))
              ? (
                <a
                  className={css(styles.commentAnswer)}
                  role="link"
                  tabIndex={0}
                  style={{ outline: 'none' }}
                  onClick={() => removeComment(comment)}
                >
                  Удалить
                </a>
              )
              : ''
          }
        </div>

      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  comment: {
    padding: '12px 0',
    display: 'flex',
    '@media screen and (max-width: 1440px)': {
      padding: '10px 0',
    },
  },
  commentContent: {
    paddingLeft: '18px',
    '@media screen and (max-width: 1440px)': {
      paddingLeft: '12px',
    },
  },
  commentName: {
    fontSize: '18px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    textDecoration: 'none',
    color: '#1f1f1f',
    marginBottom: '7px',
    display: 'block',
    '@media screen and (max-width: 1440px)': {
      fontSize: '16px',
      lineHeight: '20px',
      marginBottom: '4px',
    },
  },
  commentFooter: {
    display: 'flex',
    paddingTop: '8px',
  },
  commentDate: {
    paddingRight: '24px',
    fontSize: '16px',
    color: '#9F9F9F',
    '@media screen and (max-width: 1440px)': {
      fontSize: '12px',
      lineHeight: '12px',
    },
  },
  commentAnswer: {
    color: '#006CEB',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '8px',
    '@media screen and (max-width: 1440px)': {
      fontSize: '12px',
      lineHeight: '12px',
    },
    ':hover': {
      textDecoration: 'underline',
    },
  },
  commentText: {
    lineHeight: '1.3em',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
    },
  },
});

Comment.propTypes = {
  user: PropTypes.object,
  startAnswer: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
};

export default Comment;
