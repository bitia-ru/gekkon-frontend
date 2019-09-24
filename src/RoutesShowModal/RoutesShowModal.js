import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import LikeButton from '../LikeButton/LikeButton';
import Button from '../Button/Button';
import CommentBlock from '../CommentBlock/CommentBlock';
import RouteStatus from '../RouteStatus/RouteStatus';
import CollapsableBlock from '../CollapsableBlock/CollapsableBlock';
import CommentForm from '../CommentForm/CommentForm';
import Counter from '../Counter/Counter';
import RouteDataTable from '../RouteDataTable/RouteDataTable';
import RouteEditor from '../RouteEditor/RouteEditor';
import CloseButton from '../CloseButton/CloseButton';
import { DEFAULT_COMMENTS_DISPLAYED } from '../Constants/Comments';
import StickyBar from '../StickyBar/StickyBar';
import SchemeModal from '../SchemeModal/SchemeModal';
import ShowSchemeButton from '../ShowSchemeButton/ShowSchemeButton';
import NoticeButton from '../NoticeButton/NoticeButton';
import NoticeForm from '../NoticeForm/NoticeForm';
import Tooltip from '../Tooltip/Tooltip';
import { avail } from '../Utils';
import TooltipPerson from '../TooltipPerson/TooltipPerson';
import { HIDE_DELAY } from '../Constants/TooltipPerson';
import numToStr from '../Constants/NumToStr';
import './RoutesShowModal.css';

export default class RoutesShowModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quoteComment: null,
      commentContent: '',
      numOfDisplayedComments: DEFAULT_COMMENTS_DISPLAYED,
      descriptionCollapsed: false,
      currentPointers: [],
      routeImageLoading: true,
      schemeModalVisible: false,
      showNoticeForm: false,
      showTooltip: false,
      showLikesTooltip: false,
      showRedpointsTooltip: false,
      showFlashesTooltip: false,
    };
    this.mouseOver = false;
  }

  componentDidMount() {
    this.loadPointers();
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event) => {
    const { onClose } = this.props;
    if (event.key === 'Escape') {
      onClose();
    }
  };

  startAnswer = (quoteComment) => {
    this.setState({ quoteComment });
    this.textareaRef.focus();
  };

  removeQuoteComment = () => {
    this.setState({ quoteComment: null });
  };

  onCommentContentChange = (content) => {
    this.setState({ commentContent: content });
  };

  onDescriptionCollapseChange = (isCollapsed) => {
    this.setState({ descriptionCollapsed: isCollapsed });
  };

  showPreviousComments = () => {
    const { comments } = this.props;
    this.setState(
      {
        descriptionCollapsed: true,
        numOfDisplayedComments: comments.length,
      },
    );
  };

  saveComment = (route_comment_id) => {
    const { route, user, saveComment } = this.props;
    const { commentContent } = this.state;
    const params = {
      route_comment: {
        route_id: route.id,
        author_id: user.id,
        content: commentContent,
      },
    };
    if (route_comment_id !== null) {
      params.route_comment.route_comment_id = route_comment_id;
    }
    const self = this;
    saveComment(params, () => {
      self.removeQuoteComment();
      self.onCommentContentChange('');
    });
  };

  loadPointers = () => {
    const { route } = this.props;
    let pointers = (route.mark && route.mark.pointers) ? route.mark.pointers : {
      x: [],
      y: [],
      angle: [],
    };
    const mapIndexed = R.addIndex(R.map);
    pointers = mapIndexed((x, index) => ({
      x: parseFloat(x),
      y: parseFloat(pointers.y[index]),
      dx: 0,
      dy: 0,
      angle: parseInt(pointers.angle[index], 10),
    }), pointers.x);
    this.setState({ currentPointers: pointers });
  };

  updatePointers = (pointers) => {
    this.setState({ currentPointers: pointers });
  };

  setTextareaRef = (ref) => {
    this.textareaRef = ref;
  };

  canEditRoute = (user, route) => {
    if (user.role === 'admin' || user.role === 'creator') return true;
    if (user.role === 'user' && route.author_id === user.id) return true;
    return false;
  };

  hideLikesTooltip = () => {
    this.likesTimerId = setTimeout(() => this.setState({ showLikesTooltip: false }), HIDE_DELAY);
  };

  hideRedpointsTooltip = () => {
    this.redpointsTimerId = setTimeout(
      () => this.setState({ showRedpointsTooltip: false }),
      HIDE_DELAY,
    );
  };

  hideFlashesTooltip = () => {
    this.flashesTimerId = setTimeout(
      () => this.setState({ showFlashesTooltip: false }),
      HIDE_DELAY,
    );
  };

  showNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: true });
  };

  cancelNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  submitNoticeForm = (msg) => {
    const { submitNoticeForm } = this.props;
    submitNoticeForm(msg);
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  content = () => {
    const {
      onClose,
      route,
      numOfLikes,
      likes,
      isLiked,
      likeBtnIsBusy,
      onLikeChange,
      user,
      numOfRedpoints,
      redpoints,
      numOfFlash,
      flashes,
      ctrlPressed,
      removeRoute,
      openEdit,
      ascent,
      changeAscentResult,
      removeComment,
      comments,
      numOfComments,
      goToProfile,
      diagram,
    } = this.props;
    const {
      currentPointers,
      descriptionCollapsed,
      numOfDisplayedComments,
      quoteComment,
      commentContent,
      routeImageLoading,
      schemeModalVisible,
      showLikesTooltip,
      showRedpointsTooltip,
      showFlashesTooltip,
      showNoticeForm,
      showTooltip,
    } = this.state;
    const showLoadPhotoMsg = (
      (!route.photo || !routeImageLoading) && user && this.canEditRoute(user, route)
    );
    return (
      <div className="modal-overlay__wrapper">
        <div className="modal modal-overlay__modal">
          <div className="modal-block__close">
            <CloseButton
              onClick={
                schemeModalVisible
                  ? () => this.setState({ schemeModalVisible: false })
                  : () => onClose()
              }
            />
          </div>
          {
            (user && avail(user.id)) && <div
              className="modal-block__notice"
              onMouseEnter={() => this.setState({ showTooltip: true })}
              onMouseLeave={() => this.setState({ showTooltip: false })}
              onClick={event => event.stopPropagation()}
            >
              <NoticeButton onClick={this.showNoticeForm} />
              <div className="modal-block__notice-tooltip">
                {showTooltip && <Tooltip text="Сообщить об ошибке" />}
              </div>
              {
                showNoticeForm && <NoticeForm
                  submit={this.submitNoticeForm}
                  cancel={this.cancelNoticeForm}
                />
              }
            </div>
          }
          {
            schemeModalVisible
              ? (
                <SchemeModal
                  currentRoute={route}
                  diagram={diagram}
                  save={() => this.setState({ schemeModalVisible: false })}
                  close={() => this.setState({ schemeModalVisible: false })}
                />
              )
              : (
                <>
                  <div
                    className="modal__track-block"
                    role="button"
                    tabIndex={0}
                    style={{ outline: 'none' }}
                    onMouseOver={() => {
                      this.mouseOver = true;
                    }}
                    onMouseLeave={() => {
                      this.mouseOver = false;
                    }}
                  >
                    <div className="modal__track">
                      <ShowSchemeButton
                        disabled={route.data.position === undefined}
                        onClick={() => this.setState({ schemeModalVisible: true })}
                      />
                      {
                        showLoadPhotoMsg && (
                          <div className="modal__track-descr">
                            <div className="modal__track-descr-picture" />
                            <div className="modal__track-descr-text">Загрузите фото трассы</div>
                          </div>
                        )
                      }
                      {
                        route.photo
                          ? (
                            <RouteEditor
                              route={route}
                              routePhoto={route.photo.url}
                              pointers={currentPointers}
                              editable={false}
                              updatePointers={this.updatePointers}
                              routeImageLoading={routeImageLoading}
                              onImageLoad={() => this.setState({ routeImageLoading: false })}
                            />
                          )
                          : ''
                      }
                    </div>
                    <div
                      className="modal__track-footer"
                    >
                      <div className="modal__track-information">
                        <div
                          className="modal__track-count"
                          onMouseEnter={() => this.setState({
                            showLikesTooltip: true,
                            showRedpointsTooltip: false,
                            showFlashesTooltip: false,
                          })}
                          onMouseLeave={this.hideLikesTooltip}
                        >
                          {
                            showLikesTooltip && <TooltipPerson
                              cancelHide={() => clearTimeout(this.likesTimerId)}
                              hide={this.hideLikesTooltip}
                              position="left"
                              title={numToStr(
                                numOfLikes,
                                [
                                  `Понравилось ${numOfLikes} человеку`,
                                  `Понравилось ${numOfLikes} людям`,
                                  `Понравилось ${numOfLikes} людям`,
                                ],
                              )}
                              users={R.map(like => like.user, likes)}
                            />
                          }
                          <LikeButton
                            numOfLikes={numOfLikes}
                            isLiked={isLiked}
                            busy={likeBtnIsBusy}
                            onChange={!user ? null : onLikeChange}
                          />
                        </div>
                        <div
                          className="modal__track-count"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => this.setState({
                            showLikesTooltip: false,
                            showRedpointsTooltip: true,
                            showFlashesTooltip: false,
                          })}
                          onMouseLeave={this.hideRedpointsTooltip}
                        >
                          {
                            showRedpointsTooltip && <TooltipPerson
                              cancelHide={() => clearTimeout(this.redpointsTimerId)}
                              hide={this.hideRedpointsTooltip}
                              title={numToStr(
                                numOfRedpoints,
                                [
                                  `Пролез ${numOfRedpoints} человек`,
                                  `Пролезли ${numOfRedpoints} человека`,
                                  `Пролезли ${numOfRedpoints} человек`,
                                ],
                              )}
                              users={R.map(redpoint => redpoint.user, redpoints)}
                            />
                          }
                          <Counter number={numOfRedpoints} text="redpoints" />
                        </div>
                        <div
                          className="modal__track-count"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => this.setState({
                            showLikesTooltip: false,
                            showRedpointsTooltip: false,
                            showFlashesTooltip: true,
                          })}
                          onMouseLeave={this.hideFlashesTooltip}
                        >
                          {
                            showFlashesTooltip && <TooltipPerson
                              cancelHide={() => clearTimeout(this.flashesTimerId)}
                              hide={this.hideFlashesTooltip}
                              title={numToStr(
                                numOfFlash,
                                [
                                  `Флешанул ${numOfFlash} человек`,
                                  `Флешанули ${numOfFlash} человека`,
                                  `Флешанули ${numOfFlash} человек`,
                                ],
                              )}
                              users={R.map(flash => flash.user, flashes)}
                            />
                          }
                          <Counter number={numOfFlash} text="flash" />
                        </div>
                      </div>
                      {
                        (user && this.canEditRoute(user, route)) && (
                          ctrlPressed
                            ? (
                              <Button
                                size="small"
                                style="normal"
                                title="Удалить"
                                onClick={removeRoute}
                              />
                            )
                            : (
                              <Button
                                size="small"
                                style="normal"
                                title="Редактировать"
                                onClick={openEdit}
                              />
                            )
                        )
                      }
                    </div>
                  </div>
                  <div
                    className="modal__track-info"
                    onMouseOver={() => {
                      this.mouseOver = true;
                    }}
                    onMouseLeave={() => {
                      this.mouseOver = false;
                    }}
                  >
                    <div className="modal__track-status">
                      {
                        user && (
                          <RouteStatus
                            ascent={ascent}
                            changeAscentResult={changeAscentResult}
                          />
                        )
                      }
                    </div>
                    <div className="modal__track-header">
                      <h1 className="modal__title">
                        {route.number ? `№ ${route.number}` : `# ${route.id}`}
                        <span className="modal__title-place-wrapper">
                          <span className="modal__title-place">
                            {route.name ? `(“${route.name}”)` : ''}
                          </span>
                        </span>
                      </h1>
                      <RouteDataTable route={route} user={user} />
                    </div>
                    <div className="modal__item modal__descr-item">
                      <CollapsableBlock
                        title="Описание"
                        isCollapsed={descriptionCollapsed}
                        onCollapseChange={this.onDescriptionCollapseChange}
                        text={route.description ? route.description : ''}
                      />
                    </div>
                    <div className="modal__item">
                      <CommentBlock
                        startAnswer={this.startAnswer}
                        user={user}
                        removeComment={removeComment}
                        allShown={
                          comments.length === R.min(
                            numOfDisplayedComments,
                            comments.length,
                          )
                        }
                        numOfComments={numOfComments}
                        showPrevious={this.showPreviousComments}
                        onCollapseChange={this.onDescriptionCollapseChange}
                        comments={
                          R.slice(
                            comments.length - R.min(numOfDisplayedComments, comments.length),
                            comments.length,
                            comments,
                          )
                        }
                        objectListTitle="route_comments"
                      />
                    </div>
                    <div className="modal__enter-comment">
                      <CommentForm
                        quoteComment={quoteComment}
                        setTextareaRef={this.setTextareaRef}
                        goToProfile={goToProfile}
                        user={user}
                        content={commentContent}
                        saveComment={this.saveComment}
                        onContentChange={this.onCommentContentChange}
                        removeQuoteComment={this.removeQuoteComment}
                      />
                    </div>
                  </div>
                </>
              )
          }
        </div>
      </div>
    );
  };

  showNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: true });
  };

  cancelNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  submitNoticeForm = (msg) => {
    const { submitNoticeForm } = this.props;
    submitNoticeForm(msg);
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  content = () => {
    const {
      onClose,
      route,
      numOfLikes,
      isLiked,
      likeBtnIsBusy,
      onLikeChange,
      user,
      numOfRedpoints,
      numOfFlash,
      ctrlPressed,
      removeRoute,
      openEdit,
      ascent,
      changeAscentResult,
      removeComment,
      comments,
      numOfComments,
      goToProfile,
      diagram,
    } = this.props;
    const {
      currentPointers,
      descriptionCollapsed,
      numOfDisplayedComments,
      quoteComment,
      commentContent,
      routeImageLoading,
      schemeModalVisible,
      showNoticeForm,
      showTooltip,
    } = this.state;
    const showLoadPhotoMsg = (
      (!route.photo || !routeImageLoading) && user && this.canEditRoute(user, route)
    );
    return (
      <div className="modal-overlay__wrapper">
        <div className="modal modal-overlay__modal">
          <div className="modal-block__close">
            <CloseButton
              onClick={
                schemeModalVisible
                  ? () => this.setState({ schemeModalVisible: false })
                  : () => onClose()
              }
            />
          </div>
          {
            (user && avail(user.id)) && <div
              className="modal-block__notice"
              onMouseEnter={() => this.setState({ showTooltip: true })}
              onMouseLeave={() => this.setState({ showTooltip: false })}
              onClick={event => event.stopPropagation()}
            >
              <NoticeButton onClick={this.showNoticeForm} />
              <div className="modal-block__notice-tooltip">
                {showTooltip && <Tooltip text="Сообщить об ошибке" />}
              </div>
              {
                showNoticeForm && <NoticeForm
                  submit={this.submitNoticeForm}
                  cancel={this.cancelNoticeForm}
                />
              }
            </div>
          }
          {
            schemeModalVisible
              ? (
                <SchemeModal
                  currentRoute={route}
                  diagram={diagram}
                  save={() => this.setState({ schemeModalVisible: false })}
                  close={() => this.setState({ schemeModalVisible: false })}
                />
              )
              : (
                <>
                  <div
                    className="modal__track-block"
                    role="button"
                    tabIndex={0}
                    style={{ outline: 'none' }}
                    onMouseOver={() => {
                      this.mouseOver = true;
                    }}
                    onMouseLeave={() => {
                      this.mouseOver = false;
                    }}
                  >
                    <div className="modal__track">
                      <ShowSchemeButton
                        disabled={route.data.position === undefined}
                        onClick={() => this.setState({ schemeModalVisible: true })}
                      />
                      {
                        showLoadPhotoMsg && (
                          <div className="modal__track-descr">
                            <div className="modal__track-descr-picture" />
                            <div className="modal__track-descr-text">Загрузите фото трассы</div>
                          </div>
                        )
                      }
                      {
                        route.photo
                          ? (
                            <RouteEditor
                              route={route}
                              routePhoto={route.photo.url}
                              pointers={currentPointers}
                              editable={false}
                              updatePointers={this.updatePointers}
                              routeImageLoading={routeImageLoading}
                              onImageLoad={() => this.setState({ routeImageLoading: false })}
                            />
                          )
                          : ''
                      }
                    </div>
                    <div
                      className="modal__track-footer"
                    >
                      <div className="modal__track-information">
                        <div className="modal__track-count">
                          <LikeButton
                            numOfLikes={numOfLikes}
                            isLiked={isLiked}
                            busy={likeBtnIsBusy}
                            onChange={!user ? null : onLikeChange}
                          />
                        </div>
                        <div className="modal__track-count">
                          <Counter number={numOfRedpoints} text="redpoints" />
                        </div>
                        <div className="modal__track-count">
                          <Counter number={numOfFlash} text="flash" />
                        </div>
                      </div>
                      {
                        (user && this.canEditRoute(user, route)) && (
                          ctrlPressed
                            ? (
                              <Button
                                size="small"
                                style="normal"
                                title="Удалить"
                                onClick={removeRoute}
                              />
                            )
                            : (
                              <Button
                                size="small"
                                style="normal"
                                title="Редактировать"
                                onClick={openEdit}
                              />
                            )
                        )
                      }
                    </div>
                  </div>
                  <div
                    className="modal__track-info"
                    onMouseOver={() => {
                      this.mouseOver = true;
                    }}
                    onMouseLeave={() => {
                      this.mouseOver = false;
                    }}
                  >
                    <div className="modal__track-status">
                      {
                        user && (
                          <RouteStatus
                            ascent={ascent}
                            changeAscentResult={changeAscentResult}
                          />
                        )
                      }
                    </div>
                    <div className="modal__track-header">
                      <h1 className="modal__title">
                        {route.number ? `№ ${route.number}` : `# ${route.id}`}
                        <span className="modal__title-place-wrapper">
                          <span className="modal__title-place">
                            {route.name ? `(“${route.name}”)` : ''}
                          </span>
                        </span>
                      </h1>
                      <RouteDataTable route={route} user={user} />
                    </div>
                    <div className="modal__item modal__descr-item">
                      <CollapsableBlock
                        title="Описание"
                        isCollapsed={descriptionCollapsed}
                        onCollapseChange={this.onDescriptionCollapseChange}
                        text={route.description ? route.description : ''}
                      />
                    </div>
                    <div className="modal__item">
                      <CommentBlock
                        startAnswer={this.startAnswer}
                        user={user}
                        removeComment={removeComment}
                        allShown={
                          comments.length === R.min(
                            numOfDisplayedComments,
                            comments.length,
                          )
                        }
                        numOfComments={numOfComments}
                        showPrevious={this.showPreviousComments}
                        onCollapseChange={this.onDescriptionCollapseChange}
                        comments={
                          R.slice(
                            comments.length - R.min(numOfDisplayedComments, comments.length),
                            comments.length,
                            comments,
                          )
                        }
                        objectListTitle="route_comments"
                      />
                    </div>
                    <div className="modal__enter-comment">
                      <CommentForm
                        quoteComment={quoteComment}
                        setTextareaRef={this.setTextareaRef}
                        goToProfile={goToProfile}
                        user={user}
                        content={commentContent}
                        saveComment={this.saveComment}
                        onContentChange={this.onCommentContentChange}
                        removeQuoteComment={this.removeQuoteComment}
                      />
                    </div>
                  </div>
                </>
              )
          }
        </div>
      </div>
    );
  };

  render() {
    const {
      onClose, numOfActiveRequests,
    } = this.props;
    return (
      <>
        <div
          className="modal-overlay"
          onClick={() => {
            if (!this.mouseOver) {
              onClose();
            }
          }}
        >
          <StickyBar
            loading={numOfActiveRequests > 0}
            content={this.content()}
            hideLoaded
          />
        </div>
      </>
    );
  }
}

RoutesShowModal.propTypes = {
  user: PropTypes.object,
  diagram: PropTypes.string,
  ascent: PropTypes.object,
  numOfRedpoints: PropTypes.number,
  redpoints: PropTypes.array,
  numOfFlash: PropTypes.number,
  flashes: PropTypes.array,
  numOfLikes: PropTypes.number,
  likes: PropTypes.array,
  route: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  ctrlPressed: PropTypes.bool.isRequired,
  removeRoute: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  numOfComments: PropTypes.number.isRequired,
  removeComment: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likeBtnIsBusy: PropTypes.bool.isRequired,
  onLikeChange: PropTypes.func.isRequired,
  changeAscentResult: PropTypes.func.isRequired,
  numOfActiveRequests: PropTypes.number.isRequired,
  submitNoticeForm: PropTypes.func.isRequired,
};

RoutesShowModal.defaultProps = {
  ascent: null,
  likes: [],
  redpoints: [],
  flashes: [],
};
