import React, {Component} from 'react';
import Comment            from '../Comment/Comment';
import PropTypes          from 'prop-types';
import * as R             from "ramda";
import './CommentBlock.css';

export default class CommentBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            scrollPosition: 0
        }
    }

    ending = () => {
        const {numOfComments} = this.props;
        if (numOfComments % 10 === 1 && numOfComments % 100 !== 11) {
            return 'й'
        }
        if (!(numOfComments % 10 >= 2 && numOfComments % 10 <= 4)) {
            return 'ев'
        }
        if (!(numOfComments % 100 < 12 || numOfComments % 100 > 14)) {
            return 'ев'
        }
        return 'я'
    };

    onScroll = () => {
        const {onCollapseChange} = this.props;
        const {scrollPosition} = this.state;
        if (scrollPosition < this.commentWindow.scrollTop) {
            onCollapseChange(true);
        }
        this.setState({scrollPosition: this.commentWindow.scrollTop})
    };

    render() {
        const {
                  user,
                  numOfComments,
                  allShown,
                  showPrevious,
                  startAnswer,
                  removeComment,
                  objectListTitle,
                  comments,
              } = this.props;
        return <React.Fragment>
            <div className="comment-block">
                <div className="comment-block__header">
                    Коментарии
                </div>
                <div className="comment-block__count-comment">
                    {numOfComments} комментари{this.ending()}
                </div>
                {
                    allShown
                        ? ''
                        : (
                            <button className="comment-block__show-comments"
                                    type="button"
                                    onClick={showPrevious}>
                                Показать предыдущие комментарии
                            </button>
                        )
                }
                <div
                    className="comment-block__list"
                    ref={(ref) => {
                        this.commentWindow = ref;
                    }}
                    onScroll={this.onScroll}
                >
                    {
                        R.map(
                            (comment) =>
                                <React.Fragment key={comment.id}>
                                    <Comment startAnswer={startAnswer}
                                             removeComment={removeComment}
                                             user={user}
                                             comment={comment}
                                    />
                                    {
                                        R.map(
                                            (innerComment) =>
                                                <div
                                                    key={innerComment.id}
                                                    className="comment-block__inner"
                                                >
                                                    <Comment startAnswer={startAnswer}
                                                             removeComment={removeComment}
                                                             user={user}
                                                             comment={innerComment}
                                                    />
                                                </div>,
                                            comment[objectListTitle]
                                        )
                                    }
                                </React.Fragment>,
                            comments
                        )
                    }
                </div>
            </div>
        </React.Fragment>;
    }
}

CommentBlock.propTypes = {
    user: PropTypes.object,
    onCollapseChange: PropTypes.func,
    objectListTitle: PropTypes.string.isRequired,
    startAnswer: PropTypes.func.isRequired,
    removeComment: PropTypes.func.isRequired,
    comments: PropTypes.array.isRequired,
    showPrevious: PropTypes.func.isRequired,
    numOfComments: PropTypes.number.isRequired,
    allShown: PropTypes.bool.isRequired,
};

CommentBlock.defaultProps = {
    user: null,
    onCollapseChange: null,
};
