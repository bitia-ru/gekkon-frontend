import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';
import AvatarRound from '../AvatarRound/AvatarRound';
import Button from '../Button/Button';

export default class CommentForm extends Component {
    cancel = () => {
      const { removeQuoteComment, onContentChange } = this.props;
      removeQuoteComment();
      onContentChange('');
    };

    onKeyPress = (event) => {
      const { saveComment, quoteComment } = this.props;
      if (event.key === 'Enter' && event.ctrlKey) {
        saveComment(quoteComment ? quoteComment.id : null);
      }
    };

    render() {
      const {
        user,
        quoteComment,
        removeQuoteComment,
        goToProfile,
        setTextareaRef,
        content,
        onContentChange,
        saveComment,
      } = this.props;
      return (
      // Style is not defined
        <div className="comment-form">
          {/* End */}
          {
            quoteComment
              ? (
                <div className={css(styles.commentFormAnswer)}>
                  <div className={css(styles.commentFormAnswerContent)}>
                    <div className={css(styles.commentFormAnswerAuthor)}>
                      {quoteComment.author.name}
                    </div>
                    <div className={css(styles.commentFormAnswerText)}>
                      {quoteComment.content}
                    </div>
                  </div>
                  <button
                    className={css(styles.commentFormAnswerClose)}
                    type="button"
                    onClick={removeQuoteComment}
                  />
                </div>
              )
              : ''
                }
          <div className={css(styles.commentFormInnerWrap)}>
            <AvatarRound user={user} />
            {
              (user && !user.login && !user.name)
                ? (
                  <a
                    className={css(styles.commentFormInput, styles.commentFormLink)}
                    role="link"
                    tabIndex={0}
                    style={{ outline: 'none' }}
                    onClick={goToProfile}
                  >
                    Для комментирования задайте имя или логин
                  </a>
                )
                : (
                  <textarea
                    className={css(styles.commentFormInput)}
                    ref={ref => setTextareaRef(ref)}
                    disabled={!(user && (user.login || user.name))}
                    placeholder={
                      user
                        ? 'Комментировать...'
                        : 'Залогиньтесь, чтобы написать комментарий'
                                    }
                    value={content}
                    onChange={event => onContentChange(event.target.value)}
                    onKeyPress={this.onKeyPress}
                  />
                )
                    }
          </div>
          {
            content === ''
              ? ''
              : (
                <div className={css(styles.commentFormBtnWrap)}>
                  <Button
                    size="small"
                    style="transparent"
                    title="Отмена"
                    onClick={this.cancel}
                  />
                  <Button
                    size="small"
                    style="normal"
                    title="Отправить"
                    onClick={
                      () => saveComment(quoteComment ? quoteComment.id : null)
                    }
                  />
                </div>
              )
          }
        </div>
      );
    }
}

const styles = StyleSheet.create({
  commentFormAnswer: {
    display: 'flex',
    paddingLeft: '10px',
    position: 'relative',
    marginTop: '5px',
    marginBottom: '5px',
    paddingRight: '10px',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      left: 0,
      top: 0,
      height: '100%',
      width: '2px',
      backgroundColor: '#006CEB',
    },
  },
  commentFormAnswerContent: {
    maxWidth: '80%',
    overflow: 'hidden',
    maxHeight: '40px',
  },
  commentFormAnswerAuthor: {
    fontSize: '14px',
    color: '#1f1f1f',
    fontFamily: ['GilroyBold', 'sans-serif'],
    lineHeight: '1em',
    marginBottom: '5px',
  },
  commentFormAnswerText: {
    fontSize: '12px',
    color: '#828282',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    lineHeight: '1em',
  },
  commentFormAnswerClose: {
    width: '12px',
    height: '12px',
    padding: '3px',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Crect%20width%3D%222.40413%22%20height%3D%2221.6372%22%20transform%3D%22matrix%280.707111%20-0.707103%200.707111%200.707103%200.142578%201.8418%29%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3Crect%20width%3D%222.40413%22%20height%3D%2221.6372%22%20transform%3D%22matrix%280.707111%200.707103%20-0.707111%200.707103%2015.4419%200.140625%29%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    alignSelf: 'center',
    marginLeft: 'auto',
    cursor: 'pointer',
    transition: 'opacity .4s ease-out',
    ':hover': {
      opacity: '.6',
    },
  },
  commentFormInnerWrap: {
    padding: '12px 0',
    display: 'flex',
    '@media screen and (max-width: 1440px)': {
      padding: '8px 0',
      '> a': {
        alignSelf: 'center',
      },
    },
  },
  commentFormBtnWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '20px',
  },
  commentFormInput: {
    border: 0,
    marginLeft: '18px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    color: '#1f1f1f',
    fontSize: '16px',
    outline: 'none',
    width: '100%',
    resize: 'none',
    padding: '14px 0 0 0',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    '@media screen and (max-width: 1440px)': {
      paddingTop: '16px',
      fontSize: '14px',
    },
    '::placeholder': {
      fontFamily: ['GilroyRegular', 'sans-serif'],
      color: '#828282',
    },
  },

  // NOT_USED
  commentFormAvatar: {
    display: 'flex',
    justifyContent: 'center',
    flexShrink: '0',
    alignItems: 'center',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    overflow: 'hidden',
    backgroundColor: '#F3F3F3',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M22.9803%208.71906C22.9803%2013.1525%2019.3843%2016.7486%2014.9508%2016.7486C10.5172%2016.7486%206.9212%2013.1279%206.9212%208.71906C6.9212%204.31019%2010.5173%200.714111%2014.9508%200.714111C19.3842%200.714111%2022.9803%204.28559%2022.9803%208.71906ZM20.8621%208.71906C20.8621%205.4678%2018.202%202.80772%2014.9508%202.80772C11.6995%202.80772%209.03941%205.46775%209.03941%208.71901C9.03941%2011.9703%2011.6995%2014.6304%2014.9508%2014.6304C18.202%2014.6304%2020.8621%2011.9703%2020.8621%208.71906ZM28.9409%2029.2856H1.0591C0.467973%2029.2856%200%2028.8177%200%2028.2265C0%2022.66%204.53203%2018.1526%2010.0739%2018.1526H19.9261C25.4926%2018.1526%2030%2022.6846%2030%2028.2265C30%2028.8177%2029.532%2029.2856%2028.9409%2029.2856ZM19.9261%2020.2708H10.0739C6.0345%2020.2708%202.70933%2023.3004%202.19211%2027.1674H27.8079C27.2906%2023.2758%2023.9655%2020.2708%2019.9261%2020.2708Z%22%20fill%3D%22%23BDBDBD%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '22px 21px',
    backgroundPosition: 'center',
    '> img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  // END

  commentFormLink: {
    color: '#006CEB',
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
});

CommentForm.propTypes = {
  user: PropTypes.object,
  quoteComment: PropTypes.object,
  removeQuoteComment: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  saveComment: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  setTextareaRef: PropTypes.func.isRequired,
};

CommentForm.defaultProps = {
  quoteComment: null,
};
