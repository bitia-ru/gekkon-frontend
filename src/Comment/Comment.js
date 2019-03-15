import React, {Component} from 'react';
import AvatarRound        from '../AvatarRound/AvatarRound';
import PropTypes          from 'prop-types';
import {COMMENT_TIME_FORMAT, COMMENT_DATE_FORMAT} from '../Constants/Date'
import './Comment.css';

export default class Comment extends Component {
    render() {
        let created_at = new Date(this.props.comment.created_at);
        return <div className="comment">
            <AvatarRound/>
            <div className="comment__content">
                <a className="comment__name">{this.props.comment.author.name}</a>
                <div className="comment__text">{this.props.comment.content}</div>
                <div className="comment__footer">
                    <div className="comment__date">
                        {COMMENT_TIME_FORMAT.format(created_at)}&nbsp;&nbsp;{COMMENT_DATE_FORMAT.format(created_at)}
                    </div>
                    <a className="comment__answer" onClick={() => this.props.startAnswer(this.props.comment)}>Ответить</a>
                </div>

            </div>
        </div>;
    }
}

Comment.propTypes = {
    startAnswer: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired
};