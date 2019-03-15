import React, {Component} from 'react';
import AvatarRound        from '../AvatarRound/AvatarRound';
import Button             from '../Button/Button';
import PropTypes          from 'prop-types';
import './CommentForm.css';

export default class CommentForm extends Component {

    cancel = () => {
        this.props.removeQuoteComment();
        this.props.onContentChange('');
    };

    onKeyPress = (event) => {
        if(event.key === 'Enter' && event.ctrlKey) {
            this.props.saveComment(this.props.quoteComment ? this.props.quoteComment.id : null)
        }
    };

    render() {
        return <div className="comment-form">
            {this.props.quoteComment ?
                <div className="comment-form__answer">
                    <div className="comment-form__answer-content">
                        <div className="comment-form__answer-author">{this.props.quoteComment.author.name}</div>
                        <div className="comment-form__answer-text">{this.props.quoteComment.content}</div>
                    </div>
                    <button className="comment-form__answer-close" onClick={this.props.removeQuoteComment}></button>
                </div> : ''}
            <div className="comment-form__inner-wrap">
                <AvatarRound/>
                <textarea className="comment-form__input" placeholder="Комментировать..." value={this.props.content}
                          onChange={(event) => this.props.onContentChange(event.target.value)} onKeyPress={this.onKeyPress}/>
            </div>
            {this.props.content === '' ? '' :
                <div className="comment-form__btn-wrap">
                    <Button size="small" style="transparent" title="Отмена"
                            onClick={this.cancel}></Button>
                    <Button size="small" style="normal" title="Отправить"
                            onClick={() => this.props.saveComment(this.props.quoteComment ? this.props.quoteComment.id : null)}></Button>
                </div>}
        </div>;
    }
}

CommentForm.propTypes = {
    content: PropTypes.string.isRequired,
    saveComment: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired
};
