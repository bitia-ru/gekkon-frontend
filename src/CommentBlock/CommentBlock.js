import React, {Component} from 'react';
import Comment            from '../Comment/Comment';
import PropTypes          from 'prop-types';
import * as R             from "ramda";
import './CommentBlock.css';

export default class CommentBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            object_id: null,
            quote: null,
            scrollPosition: 0
        }
    }

    ending = () => {

        if (this.props.numOfComments % 10 === 1 && this.props.numOfComments % 100 !== 11) {
            return 'й'
        }
        if ((this.props.numOfComments % 10 >= 2 && this.props.numOfComments % 10 <= 4) && (this.props.numOfComments % 100 < 12 || this.props.numOfComments % 100 > 14)) {
            return 'я'
        }
        return 'ев'
    };

    onScroll = () => {
        if (this.state.scrollPosition < this.commentWindow.scrollTop) {
            this.props.onCollapseChange(true);
        }
        this.setState({scrollPosition: this.commentWindow.scrollTop})
    };

    render() {
        return <React.Fragment>
            <div className="comment-block">
                <div className="comment-block__header">
                    Коментарии
                </div>
                <div className="comment-block__count-comment">
                    {this.props.numOfComments} комментари{this.ending()}
                </div>
                {
                    this.props.allShown
                        ? ''
                        : (
                            <button className="comment-block__show-comments"
                                    onClick={this.props.showPrevious}>
                                Показать предыдущие комментарии
                            </button>
                        )
                }
                <div className="comment-block__list" ref={(ref) => this.commentWindow = ref} onScroll={this.onScroll}>
                    {R.map((comment) =>
                        <React.Fragment key={comment.id}>
                            <Comment startAnswer={this.props.startAnswer} removeComment={this.props.removeComment}
                                     user={this.props.user} comment={comment}/>
                            {R.map((innerComment) => <div key={innerComment.id} className="comment-block__inner">
                                <Comment startAnswer={this.props.startAnswer} removeComment={this.props.removeComment}
                                         user={this.props.user} comment={innerComment}/>
                            </div>, comment[this.props.objectListTitle])}</React.Fragment>, this.props.comments)}
                </div>
            </div>
        </React.Fragment>;
    }
}

CommentBlock.propTypes = {
    objectListTitle: PropTypes.string.isRequired,
    startAnswer: PropTypes.func.isRequired,
    removeComment: PropTypes.func.isRequired,
    comments: PropTypes.array.isRequired,
    showPrevious: PropTypes.func.isRequired,
    numOfComments: PropTypes.number.isRequired,
    allShown: PropTypes.bool.isRequired
};
