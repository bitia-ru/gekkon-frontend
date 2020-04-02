import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Comment from '../Comment/Comment';
import RouteContext from '../../contexts/RouteContext';
import './CommentBlock.css';

export default class CommentBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollPosition: 0,
    };
  }

    ending = (numOfComments) => {
      if (numOfComments % 10 === 1 && numOfComments % 100 !== 11) {
        return 'й';
      }
      if (!(numOfComments % 10 >= 2 && numOfComments % 10 <= 4)) {
        return 'ев';
      }
      if (!(numOfComments % 100 < 12 || numOfComments % 100 > 14)) {
        return 'ев';
      }
      return 'я';
    };

    onScroll = () => {
      const { onCollapseChange } = this.props;
      const { scrollPosition } = this.state;
      if (scrollPosition < this.commentWindow.scrollTop) {
        onCollapseChange(true);
      }
      this.setState({ scrollPosition: this.commentWindow.scrollTop });
    };

    render() {
      const {
        user,
        allShown,
        showPrevious,
        startAnswer,
        removeComment,
        objectListTitle,
        comments,
        history,
      } = this.props;
      return (
        <RouteContext.Consumer>
          {
            ({ route }) => (
              <div className="comment-block">
                <div className="comment-block__header">
                  Коментарии
                </div>
                <div className="comment-block__count-comment">
                  { route.numOfComments }
                  {' '}
                  комментари
                  {this.ending(route.numOfComments)}
                </div>
                {
                  allShown
                    ? ''
                    : (
                      <button
                        className="comment-block__show-comments"
                        type="button"
                        onClick={showPrevious}
                      >
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
                      comment => (
                        <React.Fragment key={comment.id}>
                          <Comment
                            startAnswer={startAnswer}
                            removeComment={removeComment}
                            user={user}
                            comment={comment}
                            history={history}
                          />
                          {
                            R.map(
                              innerComment => (
                                <div
                                  key={innerComment.id}
                                  className="comment-block__inner"
                                >
                                  <Comment
                                    startAnswer={startAnswer}
                                    removeComment={removeComment}
                                    user={user}
                                    comment={innerComment}
                                  />
                                </div>
                              ),
                              comment[objectListTitle],
                            )
                          }
                        </React.Fragment>
                      ),
                      comments,
                    )
                  }
                </div>
              </div>
            )
          }
        </RouteContext.Consumer>
      );
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
  allShown: PropTypes.bool.isRequired,
};

CommentBlock.defaultProps = {
  onCollapseChange: null,
};
