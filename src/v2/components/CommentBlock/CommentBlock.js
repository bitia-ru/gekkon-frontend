import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Comment from '../Comment/Comment';
import RouteContext from '@/v1/contexts/RouteContext';
import { StyleSheet, css } from '../../aphrodite';

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
      } = this.props;
      return (
        <RouteContext.Consumer>
          {
            ({ route }) => (
              <div className={css(styles.commentBlock)}>
                <div className={css(styles.commentBlockHeader)}>
                  Коментарии
                </div>
                <div className={css(styles.commentBlockCountComment)}>
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
                        className={css(styles.commentBlockShowComments)}
                        type="button"
                        onClick={showPrevious}
                      >
                        Показать предыдущие комментарии
                      </button>
                    )
                }
                <div
                  className={css(styles.commentBlockList)}
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
                          />
                          {
                            R.map(
                              innerComment => (
                                <div
                                  key={innerComment.id}
                                  className={css(styles.commentBlockInner)}
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

const styles = StyleSheet.create({
  commentBlock: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    maxHeight: '100%',
  },
  commentBlockHeader: {
    fontSize: '22px',
    color: '#1f1f1f',
    fontFamily: 'GilroyBold',
    lineHeight: '1.3em',
    marginBottom: '15px',
    '@media screen and (max-width: 1440px)': {
      fontSize: '18px',
      marginBottom: '10px',
    },
  },
  commentBlockCountComment: {
    fontFamily: ['GilroyBold', 'sans-serif'],
    fontSize: '18px',
    color: '#1f1f1f',
    marginBottom: '8px',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
      marginBottom: '4px',
    },
  },
  commentBlockList: {
    overflowY: 'auto',
    flexGrow: '1',
    paddingRight: '10px',
    maxHeight: '100%',
  },
  commentBlockShowComments: {
    backgroundColor: '#F3F3F3',
    color: '#6F6F6F',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    fontSize: '14px',
    border: '0',
    boxShadow: 'none',
    width: '100%',
    padding: '14px 20px',
    transition: 'boxShadow .4s ease-out',
    marginTop: '4px',
    marginBottom: '0',
    cursor: 'pointer',
    outline: 'none',
    flexShrink: '0',
    ':focus': {
      boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)',
    },
  },
  commentBlockInner: {
    marginLeft: '68px',
  },
});

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
