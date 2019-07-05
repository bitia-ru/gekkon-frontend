import React, {Component} from 'react';
import AvatarRound        from '../AvatarRound/AvatarRound';
import Button             from '../Button/Button';
import PropTypes          from 'prop-types';
import './CommentForm.css';

export default class CommentForm extends Component {

    cancel = () => {
        const {removeQuoteComment, onContentChange} = this.props;
        removeQuoteComment();
        onContentChange('');
    };

    onKeyPress = (event) => {
        const {saveComment, quoteComment} = this.props;
        if (event.key === 'Enter' && event.ctrlKey) {
            saveComment(quoteComment ? quoteComment.id : null)
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
        return <div className="comment-form">
            {
                quoteComment
                    ? (
                        <div className="comment-form__answer">
                            <div className="comment-form__answer-content">
                                <div className="comment-form__answer-author">
                                    {quoteComment.author.name}
                                </div>
                                <div className="comment-form__answer-text">
                                    {quoteComment.content}
                                </div>
                            </div>
                            <button className="comment-form__answer-close"
                                    onClick={removeQuoteComment}>
                            </button>
                        </div>
                    )
                    : ''
            }
            <div className="comment-form__inner-wrap">
                <AvatarRound user={user}/>
                {
                    (user && !user.login && !user.name)
                        ? (
                            <a className="comment-form__input comment-form__link"
                               onClick={goToProfile}>
                                Для комментирования задайте имя или логин
                            </a>
                        )
                        : (
                            <textarea className="comment-form__input"
                                      ref={(ref) => setTextareaRef(ref)}
                                      disabled={user && (user.login || user.name) ? false : true}
                                      placeholder={
                                          user
                                              ? 'Комментировать...'
                                              : 'Залогиньтесь, чтобы написать комментарий'
                                      }
                                      value={content}
                                      onChange={(event) => onContentChange(event.target.value)}
                                      onKeyPress={this.onKeyPress}/>
                        )
                }
            </div>
            {
                content === ''
                    ? ''
                    : (
                        <div className="comment-form__btn-wrap">
                            <Button size="small"
                                    style="transparent"
                                    title="Отмена"
                                    onClick={this.cancel}>
                            </Button>
                            <Button size="small"
                                    style="normal"
                                    title="Отправить"
                                    onClick={
                                        () => saveComment(quoteComment ? quoteComment.id : null)
                                    }>
                            </Button>
                        </div>
                    )
            }
        </div>;
    }
}

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
    user: null,
    quoteComment: null,
};
