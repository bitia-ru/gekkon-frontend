import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import LikeButton from '@/v1/components/LikeButton/LikeButton';
import Button from '@/v1/components/Button/Button';
import CommentBlock from '@/v1/components/CommentBlock/CommentBlock';
import RouteStatus from '../RouteStatus/RouteStatus';
import CollapsableBlock from '@/v1/components/CollapsableBlock/CollapsableBlock';
import CommentForm from '@/v1/components/CommentForm/CommentForm';
import Counter from '@/v2/components/Counter/Counter';
import RouteDataTable from '@/v1/components/RouteDataTable/RouteDataTable';
import RouteEditor from '@/v1/components/RouteEditor/RouteEditor';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import { DEFAULT_COMMENTS_DISPLAYED } from '@/v1/Constants/Comments';
import SchemeModal from '@/v2/components/SchemeModal/SchemeModal';
import ShowSchemeButton from '@/v1/components/ShowSchemeButton/ShowSchemeButton';
import NoticeButton from '@/v1/components/NoticeButton/NoticeButton';
import NoticeForm from '@/v1/components/NoticeForm/NoticeForm';
import Tooltip from '@/v1/components/Tooltip/Tooltip';
import { avail, notAvail } from '@/v1/utils';
import TooltipPerson from '@/v1/components/TooltipPerson/TooltipPerson';
import { HIDE_DELAY } from '@/v1/Constants/TooltipPerson';
import numToStr from '@/v1/Constants/NumToStr';
import RouteContext from '@/v1/contexts/RouteContext';
import getArrayFromObject from '@/v1/utils/getArrayFromObject';
import {
  loadRoute as loadRouteAction,
  removeComment as removeCommentAction,
  addComment as addCommentAction,
  removeLike as removeLikeAction,
  addLike as addLikeAction,
  removeRoute as removeRouteAction,
  addAscent as addAscentAction,
  updateAscent as updateAscentAction,
  removeAscent as removeAscentAction,
} from '@/v2/redux/routes/actions';
import CtrlPressedContext from '@/v1/contexts/CtrlPressedContext';
import { StyleSheet, css } from '../../aphrodite';
import getFilters from '@/v1/utils/getFilters';
import { reloadRoutes as reloadRoutesAction } from '@/v1/utils/reloadRoutes';
import { default as reloadSectorAction } from '@/v1/utils/reloadSector';
import { reloadSpot as reloadSpotAction } from '@/v1/utils/reloadSpot';
import { setSelectedPage } from '@/v1/actions';
import { currentUser as currentUserObtainer } from '@/v2/redux/user_session/utils';
import withModals from '@/v2/modules/modalable';
import RouteAscents from '../../forms/RouteAscents/RouteAscents';
import showToastr from '@/v2/utils/showToastr';

class RoutesShowModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quoteComment: null,
      commentContent: '',
      numOfDisplayedComments: DEFAULT_COMMENTS_DISPLAYED,
      descriptionCollapsed: false,
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
    const { loadRoute } = this.props;
    loadRoute(this.getRouteId());
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  modals() {
    return {
      ascents: {
        hashRoute: true,
        body: <RouteAscents />,
      },
    };
  }

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  getSectorId = () => {
    const { match } = this.props;
    return (
      match.params.sector_id
        ? parseInt(match.params.sector_id, 10)
        : null
    );
  };

  getSpotId = () => {
    const { match } = this.props;
    return (
      match.params.id
        ? parseInt(match.params.id, 10)
        : null
    );
  };

  onKeyDown = (event) => {
    const { onClose } = this.props;
    if (event.key === 'Escape') {
      onClose();
    }

    if (event.key === 'ArrowRight') {
      this.props.history.push(
        R.replace(/\/routes\/[0-9]+/, `/routes/${this.getRouteId() + 1}`)(this.props.match.url),
      );
      const { loadRoute } = this.props;
      loadRoute(this.getRouteId() + 1);
    }

    if (event.key === 'ArrowLeft') {
      this.props.history.push(
        R.replace(/\/routes\/[0-9]+/, `/routes/${this.getRouteId() - 1}`)(this.props.match.url),
      );
      const { loadRoute } = this.props;
      loadRoute(this.getRouteId() - 1);
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

  showPreviousComments = (comments) => {
    this.setState(
      {
        descriptionCollapsed: true,
        numOfDisplayedComments: comments.length,
      },
    );
  };

  saveComment = (routeCommentId) => {
    const {
      routes,
      user,
      addComment,
    } = this.props;
    const { commentContent } = this.state;
    const route = routes[this.getRouteId()];
    const params = {
      route_comment: {
        route_id: route.id,
        author_id: user.id,
        content: commentContent,
      },
    };
    if (routeCommentId !== null) {
      params.route_comment.route_comment_id = routeCommentId;
    }
    const self = this;
    addComment(
      params,
      () => {
        self.removeQuoteComment();
        self.onCommentContentChange('');
      },
    );
  };

  pointers = () => {
    const { routes } = this.props;
    const route = routes[this.getRouteId()];
    const pointers = (route.mark && route.mark.pointers) ? route.mark.pointers : {
      x: [],
      y: [],
      angle: [],
    };
    const mapIndexed = R.addIndex(R.map);
    return mapIndexed((x, index) => ({
      x: parseFloat(x),
      y: parseFloat(pointers.y[index]),
      dx: 0,
      dy: 0,
      angle: parseInt(pointers.angle[index], 10),
    }), pointers.x);
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

  removeRoute = () => {
    const {
      removeRoute: removeRouteProp,
      routes,
      history,
      match,
      sectors,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const routeId = this.getRouteId();
    const sectorId = routes[routeId].sector_id;
    const spotId = sectors[sectorId].spot_id;
    if (window.confirm('Удалить трассу?')) {
      removeRouteProp(
        routeId,
        () => {
          if (R.contains('sectors', match.url)) {
            this.props.reloadSector(sectorId);
            this.props.reloadRoutes(spotId, sectorId);
            setSelectedPageProp(spotId, sectorId, 1);
          } else {
            this.props.reloadSpot(spotId);
            this.props.reloadRoutes(spotId, 0);
            setSelectedPageProp(spotId, 0, 1);
          }
          history.push(R.replace(/\/routes\/[0-9]*/, '', match.url));
        },
      );
    }
  };

  submitNoticeForm = (msg) => {
    const {
      user,
      selectedFilters,
    } = this.props;

    const routeId = this.getRouteId();
    const sectorId = this.getSectorId();
    const spotId = this.getSpotId();

    Sentry.withScope((scope) => {
      scope.setExtra('user_id', user.id);
      scope.setExtra('route_id', routeId);
      scope.setExtra(
        'filters',
        getFilters(selectedFilters, spotId, sectorId),
      );
      scope.setExtra('url', window.location.href);
      if (user.login) {
        scope.setExtra('user_login', user.login);
      } else if (user.email) {
        scope.setExtra('user_email', user.email);
      } else {
        scope.setExtra('user_phone', user.phone);
      }
      Sentry.captureException(msg);
      showToastr('Сообщение успешно отправлено', { type: 'success' });
    });

    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  getRouteNumber = (route) => {
    if (route.number) {
      return `№ ${route.number}`;
    }
    if (route.id) {
      return `# ${route.id}`;
    }
    return '';
  };

  removeComment = (routeId, comment) => {
    const { removeComment } = this.props;
    if (!window.confirm('Удалить комментарий?')) {
      return;
    }
    removeComment(comment.id);
  };

  onLikeChange = (routeId, afterChange) => {
    const {
      user,
      routes,
      removeLike,
      addLike,
    } = this.props;
    const route = routes[routeId];
    const like = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.likes));
    if (like) {
      removeLike(like.id, afterChange);
    } else {
      const params = { like: { user_id: user.id, route_id: routeId } };
      addLike(params, afterChange);
    }
  };

  changeAscentResult = () => this.props.history.push('#ascents');

  content = () => {
    const {
      onClose,
      routes,
      user,
      openEdit,
      goToProfile,
    } = this.props;
    const {
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
    const route = routes[this.getRouteId()];
    const showLoadPhotoMsg = (
      ((route && !route.photo) || !routeImageLoading) && user && this.canEditRoute(user, route)
    );
    const routeId = this.getRouteId();
    const likes = avail(route) && avail(route.likes) && getArrayFromObject(route.likes);
    const numOfLikes = (avail(likes) && likes.length);
    const like = (
      notAvail(user) || notAvail(likes)
        ? undefined
        : R.find(R.propEq('user_id', user.id))(likes)
    );
    const ascents = avail(route) && avail(route.ascents) && getArrayFromObject(route.ascents);
    const redpoints = avail(route) && avail(ascents) && R.filter(
      R.propEq('result', 'red_point'),
      ascents,
    );
    const numOfRedpoints = (avail(redpoints) && redpoints.length) || 0;
    const flashes = avail(route) && avail(ascents) && R.filter(
      R.propEq('result', 'flash'),
      ascents,
    );
    const numOfFlash = (avail(flashes) && flashes.length) || 0;

    const currentUserHasRedpoints = () => (
      user && R.find(R.propEq('user_id', user.id))(redpoints)
    );

    const currentUserHasFlashes = () => (
      user && R.find(R.propEq('user_id', user.id))(flashes)
    );

    return (
      <div className={css(styles.modalOverlayWrapper)}>
        <div className={css(styles.modal, styles.modalOverlayModal)}>
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
            (user !== undefined) && <div
              className={css(styles.modalBlockNotice)}
              onMouseEnter={() => this.setState({ showTooltip: true })}
              onMouseLeave={() => this.setState({ showTooltip: false })}
              onClick={event => event.stopPropagation()}
            >
              <NoticeButton onClick={this.showNoticeForm} />
              <div className={css(styles.modalBlockNoticeTooltip)}>
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
                  save={() => this.setState({ schemeModalVisible: false })}
                  close={() => this.setState({ schemeModalVisible: false })}
                />
              )
              : (
                <>
                  {
                    avail(route) && <>
                      <div
                        className={css(styles.modalTrackBlock)}
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
                        <div className={css(styles.modalTrack)}>
                          <ShowSchemeButton
                            disabled={!route.data || route.data.position === undefined}
                            onClick={() => this.setState({ schemeModalVisible: true })}
                          />
                          {
                            showLoadPhotoMsg && (
                              <div className={css(styles.modalTrackDescr)}>
                                <div className={css(styles.modalRoutePhotoPlaceholder)} />
                              </div>
                            )
                          }
                          {
                            route && route.photo
                              ? (
                                <RouteEditor
                                  routePhoto={route.photo.url}
                                  pointers={this.pointers()}
                                  editable={false}
                                  routeImageLoading={routeImageLoading}
                                  onImageLoad={() => this.setState({ routeImageLoading: false })}
                                />
                              )
                              : ''
                          }
                        </div>
                        <div
                          className={css(styles.modalTrackFooter)}
                        >
                          <div className={css(styles.modalTrackInformation)}>
                            <div
                              className={css(styles.modalTrackCount)}
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
                                  users={R.map(l => l.user, likes || [])}
                                />
                              }
                              <LikeButton
                                numOfLikes={numOfLikes}
                                isLiked={like !== undefined}
                                onChange={
                                  !user
                                    ? null
                                    : afterChange => this.onLikeChange(
                                      routeId, afterChange,
                                    )
                                }
                              />
                            </div>
                            <div
                              className={css(styles.modalTrackCount)}
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
                                  users={R.map(redpoint => redpoint.user, redpoints || [])}
                                />
                              }
                              <Counter
                                number={numOfRedpoints}
                                text="redpoints"
                                type={currentUserHasRedpoints() && 'redpoints'}
                              />
                            </div>
                            <div
                              className={css(styles.modalTrackCount)}
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
                                  users={R.map(flash => flash.user, flashes || [])}
                                />
                              }
                              <Counter
                                number={numOfFlash}
                                text="flash"
                                type={currentUserHasFlashes() && 'flashes'}
                              />
                            </div>
                          </div>
                          <CtrlPressedContext.Consumer>
                            {
                              ({ ctrlPressed }) => (
                                <>
                                  {
                                    (user && this.canEditRoute(user, route)) && (
                                      ctrlPressed
                                        ? (
                                          <Button
                                            size="small"
                                            style="normal"
                                            title="Удалить"
                                            onClick={this.removeRoute}
                                          />
                                        )
                                        : (
                                          <Button
                                            size="small"
                                            style="normal"
                                            title="Редактировать"
                                            onClick={() => openEdit(routeId)}
                                          />
                                        )
                                    )
                                  }
                                </>
                              )
                            }
                          </CtrlPressedContext.Consumer>
                        </div>
                      </div>
                      <div
                        className={css(styles.modalTrackInfo)}
                        onMouseOver={() => {
                          this.mouseOver = true;
                        }}
                        onMouseLeave={() => {
                          this.mouseOver = false;
                        }}
                      >
                        <div className={css(styles.modalTrackStatus)}>
                          {
                            user && (
                              <RouteStatus onClick={this.changeAscentResult} />
                            )
                          }
                        </div>
                        <div className={css(styles.modalTrackHeader)}>
                          <h1 className={css(styles.modalTitle)}>
                            {this.getRouteNumber(route)}
                            <span className={css(styles.modalTitlePlaceWrapper)}>
                              <span className={css(styles.modalTitlePlace)}>
                                {route.name ? `(“${route.name}”)` : ''}
                              </span>
                            </span>
                          </h1>
                          <RouteDataTable route={route} user={user} />
                        </div>
                        <div className={css(styles.modalItem, styles.modalDescrItem)}>
                          <CollapsableBlock
                            title="Описание"
                            isCollapsed={descriptionCollapsed}
                            onCollapseChange={this.onDescriptionCollapseChange}
                            text={route.description ? route.description : ''}
                          />
                        </div>
                        <div className={css(styles.modalItem)}>
                          <CommentBlock
                            startAnswer={this.startAnswer}
                            user={user}
                            removeComment={comment => this.removeComment(routeId, comment)}
                            allShown={
                              (route.comments || []).length === R.min(
                                numOfDisplayedComments,
                                (route.comments || []).length,
                              )
                            }
                            showPrevious={() => this.showPreviousComments(route.comments || [])}
                            onCollapseChange={this.onDescriptionCollapseChange}
                            comments={
                              R.slice(
                                (route.comments || []).length - R.min(
                                  numOfDisplayedComments,
                                  (route.comments || []).length,
                                ),
                                (route.comments || []).length,
                                route.comments || [],
                              )
                            }
                            objectListTitle="route_comments"
                          />
                        </div>
                        <div className={css(styles.modalEnterComment)}>
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
                  }
                </>
              )
          }
        </div>
      </div>
    );
  };

  render() {
    const {
      onClose, routes,
    } = this.props;
    const route = routes[this.getRouteId()];
    return (
      <RouteContext.Provider value={{ route }}>
        <div
          className={css(styles.modalOverlay)}
          onClick={() => {
            if (!this.mouseOver) {
              onClose();
            }
          }}
        >
          {this.content()}
        </div>
      </RouteContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'auto',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: '100',
  },
  modalOverlayWrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
    paddingLeft: '70px',
    paddingRight: '70px',
    width: '100%',
    maxWidth: '1464px',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100%',
    minWidth: '1100px',
  },
  modalOverlayModal: {
    '@media screen and (minWidth: 1920px)': {
      alignSelf: 'center',
    },
  },
  modal: {
    maxWidth: '1320px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    display: 'flex',
    position: 'relative',
    minHeight: '800px',
    minWidth: '960px',
    maxHeight: '1050px',
    height: '95vh',
    '@media screen and (maxWidth: 1600px)': {
      minHeight: '700px',
    },
    '@media screen and (maxWidth: 1440px)': {
      minHeight: '600px',
    },
  },
  modalTrackBlock: {
    maxWidth: '530px',
    flexBasis: '45%',
    width: '100%',
    backgroundColor: '#FAFAFA',
    display: 'flex',
    flexDirection: 'column',
  },
  modalTrackInfo: {
    paddingTop: '45px',
    width: '55%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    backgroundColor: '#ffffff',
    '@media screen and (maxWidth: 1440px)': {
      minWidth: '410px',
      paddingTop: '24px',
    },
  },
  modalTrackHeader: {
    paddingLeft: '45px',
    paddingRight: '45px',
    paddingBottom: '15px',
    width: '100%',
    boxSizing: 'border-box',
    '@media screen and (maxWidth: 1440px)': {
      paddingBottom: '6px',
      paddingLeft: '32px',
      paddingRight: '32px',
    },
  },
  modalTrackFooter: {
    padding: '33px 30px',
    alignSelf: 'flex-end',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '@media screen and (maxWidth: 1440px)': {
      padding: '16px 24px',
    },
  },
  modalTrackCount: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    ':not(:last-child)': {
      marginRight: '30px',
    },
  },
  modalTrack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F3F3',
    overflow: 'hidden',
    display: 'block',
    alignItems: 'center',
    position: 'relative',
  },
  modalTrackDescr: {
    position: 'absolute',
    content: '\'\'',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: '1',
  },
  modalRoutePhotoPlaceholder: {
    width: '118px',
    height: '118px',
    position: 'relative',
    backgroundImage: `url(${require('./photo-placeholder.svg')})`,
    backgroundSize: 'contain',
  },
  modalTrackStatus: {
    position: 'absolute',
    content: '\'\'',
    top: '42px',
    right: '-3px',
  },
  modalTrackInformation: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '15px',
    width: '254px',
    height: '28px',
  },
  modalItem: {
    paddingLeft: '45px',
    paddingRight: '45px',
    paddingTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    '@media screen and (maxWidth: 1440px)': {
      paddingLeft: '32px',
      paddingRight: '32px',
      paddingTop: '6px',
      paddingBottom: '6px',
    },
  },
  modalEnterComment: {
    padding: '12px 45px',
    boxSizing: 'border-box',
    width: '100%',
    position: 'relative',
    backgroundColor: '#ffffff',
    alignSelf: 'flex-end',
    '@media screen and (maxWidth: 1440px)': {
      padding: '3px 32px',
    },
    ':before': {
      position: 'absolute',
      content: '\'\'',
      left: '45px',
      right: '45px',
      height: '1px',
      top: '-1px',
      backgroundColor: '#CECECE',
      zIndex: '2',
    },
  },
  modalDescrItem: {
    flexShrink: '0',
    flexGrow: '0',
    paddingBottom: '15px',
    '@media screen and (maxWidth: 1440px)': {
      paddingBottom: '6px',
    },
  },
  modalTitle: {
    color: '#1f1f1f',
    fontSize: '30px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    marginTop: '0',
    marginBottom: '30px',
    paddingRight: '100px',
    '@media screen and (maxWidth: 1440px)': {
      display: 'block',
      paddingRight: '0',
      fontSize: '24px',
      marginBottom: '12px',
    },
  },
  modalTitlePlace: {
    color: '#797979',
    '@media screen and (maxWidth: 1440px)': {
      marginTop: '12px',
    },
  },
  modalTitlePlaceWrapper: {
    display: 'inline-block',
    marginLeft: '18px',
    '@media screen and (maxWidth: 1440px)': {
      display: 'block',
      marginTop: '10px',
      marginLeft: '0',
    },
  },
  modalBlockNotice: {
    position: 'absolute',
    content: '\'\'',
    right: '-40px',
    top: '32px',
    width: '17px',
    height: '17px',
    zIndex: '10',
  },
  modalBlockNoticeTooltip: {
    position: 'absolute',
    content: '\'\'',
    right: 'calc(100% + 12px)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
});


RoutesShowModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedFilters: state.selectedFilters,
  sectors: state.sectorsStore.sectors,
  routes: state.routesStoreV2.routes,
  user: currentUserObtainer(state),
});

const mapDispatchToProps = dispatch => ({
  reloadSpot: spotId => dispatch(reloadSpotAction(spotId)),
  reloadSector: sectorId => dispatch(reloadSectorAction(sectorId)),
  reloadRoutes: (spotId, sectorId) => dispatch(reloadRoutesAction(spotId, sectorId)),
  loadRoute: (id, afterLoad) => dispatch(loadRouteAction(id, afterLoad)),
  removeComment: id => dispatch(removeCommentAction(id)),
  addComment: (params, afterSuccess) => dispatch(addCommentAction(params, afterSuccess)),
  removeLike: (id, afterAll) => dispatch(removeLikeAction(id, afterAll)),
  addLike: (params, afterAll) => dispatch(addLikeAction(params, afterAll)),
  addAscent: params => dispatch(addAscentAction(params)),
  updateAscent: (id, params) => dispatch(updateAscentAction(id, params)),
  removeAscent: id => dispatch(removeAscentAction(id)),
  removeRoute: (id, afterSuccess) => dispatch(removeRouteAction(id, afterSuccess)),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withModals(RoutesShowModal)));
