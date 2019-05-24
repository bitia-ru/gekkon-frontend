import React, {Component}        from 'react';
import AvatarRound               from '../AvatarRound/AvatarRound';
import PropTypes                 from 'prop-types';
import moment                    from 'moment';
import {COMMENT_DATETIME_FORMAT} from '../Constants/Date';
import {TimeFromNow}             from '../Constants/DateTimeFormatter';
import './Comment.css';

export default class Comment extends Component {
    render() {
        let created_at = new Date(this.props.comment.created_at);
        return <div className="comment">
            <AvatarRound user={this.props.comment.author}/>
            <div className="comment__content">
                <a className="comment__name">{this.props.comment.author.name ? this.props.comment.author.name : this.props.comment.author.login}</a>
                <div className="comment__text">{this.props.comment.content}</div>
                <div className="comment__footer">
                    <div className="comment__date" title={moment(created_at).format(COMMENT_DATETIME_FORMAT)}>
                        {TimeFromNow(moment(created_at))}
                    </div>
                    {(this.props.user && (this.props.user.name || this.props.user.login)) ?
                        <React.Fragment><a className="comment__answer"
                                           onClick={() => this.props.startAnswer(this.props.comment)}>Ответить</a>&nbsp;
                        </React.Fragment> : ''}
                    {(this.props.user && (this.props.user.id === this.props.comment.author_id || this.props.user.role === 'admin')) ?
                        <a className="comment__answer"
                           onClick={() => this.props.removeComment(this.props.comment)}>Удалить</a> : ''}
                </div>

            </div>
        </div>;
    }
}

Comment.propTypes = {
    startAnswer: PropTypes.func.isRequired,
    removeComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired
};
