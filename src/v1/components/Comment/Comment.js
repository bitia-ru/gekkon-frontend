import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AvatarRound from '../AvatarRound/AvatarRound';
import { COMMENT_DATETIME_FORMAT } from '../../Constants/Date';
import { timeFromNow } from '../../Constants/DateTimeFormatter';
import './Comment.css';
import { wrapWebLinksInText } from '@/v2/utils/text_processors';

const Comment = ({
  user, comment, startAnswer, removeComment,
}) => {
  const preparedCommentContent = wrapWebLinksInText(comment.content);
  const created_at = new Date(comment.created_at);
  return (
    <div className="comment">
      <AvatarRound user={comment.author} />
      <div className="comment__content">
        <a
          role="link"
          tabIndex={0}
          style={{ outline: 'none' }}
          className="comment__name"
        >
          {
            comment.author.name
              ? comment.author.name
              : comment.author.login
          }
        </a>
        <div className="comment__text">{preparedCommentContent}</div>
        <div className="comment__footer">
          <div
            className="comment__date"
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
                    className="comment__answer"
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
                  className="comment__answer"
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

Comment.propTypes = {
  user: PropTypes.object,
  startAnswer: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
};

export default Comment;
