import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { css } from '@/v2/aphrodite';
import PhotoGallery from '@/v2/components/PhotoGallery/PhotoGallery';
import Button from '@/v2/components/Button/Button';
import AvatarRound from '@/v2/components/AvatarRound/AvatarRound';
import { userBaseName } from '../../utils/users';
import InfoBlockCounter from '../InfoBlockCounter/InfoBlockCounter';
import { getSpotKind } from '@/v2/utils/spots';
import { currentUser } from '../../redux/user_session/utils';
import UserInfoForm from '../../forms/UserInfoForm/UserInfoForm';
import withModals from '@/v2/modules/modalable';
import showToastr from '@/v2/utils/showToastr';
import NoticeModeratorForm from '../../forms/NoticeModeratorForm/NoticeModeratorForm';
import styles from './styles';

class GymBasicInfoBlock extends Component {
  sendToSentry = (msgId, data, afterSuccess) => {
    Sentry.withScope((scope) => {
      scope.setExtra('user_data', data);
      scope.setExtra('msg_is', msgId);
      Sentry.captureException(msgId);
      showToastr('Сообщение успешно отправлено', { type: 'success' });
      afterSuccess && afterSuccess();
    });
  };

  sendPhotos = () => {
    const { user } = this.props;
    if (user) {
      this.sendToSentry('want_to_add_routes', { id: user.id });
    } else {
      this.props.history.push('#want_to_add_routes');
    }
  };

  wantToAddRoutes = () => {
    const { user } = this.props;
    if (user) {
      this.sendToSentry('send_photos', { id: user.id });
    } else {
      this.props.history.push('#send_photos');
    }
  };

  writeToModerator = () => {
    this.props.history.push('#notice_moderator');
  };

  modals() {
    return {
      want_to_add_routes: {
        hashRoute: true,
        body: (
          <UserInfoForm
            submit={
              (data) => {
                this.sendToSentry(
                  'want_to_add_routes',
                  data,
                  () => this.props.history.goBack(),
                );
              }
            }
          />
        ),
      },
      send_photos: {
        hashRoute: true,
        body: (
          <UserInfoForm
            submit={
              (data) => {
                this.sendToSentry(
                  'send_photos',
                  data,
                  () => this.props.history.goBack(),
                );
              }
            }
          />
        ),
      },
      notice_moderator: {
        hashRoute: true,
        body: (
          <NoticeModeratorForm
            cancel={this.props.history.goBack}
            submit={
              (data) => {
                this.sendToSentry(
                  'notice_moderator',
                  { ...data, id: this.props.user },
                  () => this.props.history.goBack(),
                );
              }
            }
          />
        ),
      },
    };
  }

  render() {
    const { history, spots, moderator, id } = this.props;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.leftBlock)}>
          <PhotoGallery
            photos={
              spots[id] && (
                R.concat(
                  [spots[id]?.photo],
                  R.map(
                    s => s.photo,
                    spots[id]?.sectors,
                  ),
                )
              )
            }
          />
        </div>
        <div className={css(styles.rightBlock)}>
          <div className={css(styles.topBlock)}>
            <div className={css(styles.kind)}>{getSpotKind(spots[id])}</div>
            <div className={css(styles.signUpContainer)}>
              <div className={css(styles.bell)}>
                <svg aria-hidden="true">
                  <use xlinkHref={`${require('./assets/bell.svg')}#bell`} />
                </svg>
              </div>
              <span className={css(styles.signUp)}>Подписаться</span>
            </div>
          </div>
          <div className={css(styles.gymName)}>
            {spots[id]?.name}
          </div>
          <div className={css(styles.btnContainer)}>
            <Button
              onClick={() => { history.push(`/spots/${id}/sectors/${spots[id].sectors[0].id}`); }}
              style="dark"
              fullLength
            >
              Трассы
              <div className={css(styles.arrow)}>
                <svg aria-hidden="true">
                  <use xlinkHref={`${require('./assets/arrow.svg')}#arrow`} />
                </svg>
              </div>
            </Button>
          </div>
          <div className={css(styles.bottomBlock)}>
            <div className={css(styles.gymInfoTopBlock)}>
              <div className={css(styles.moderatorBlock)}>
                <AvatarRound user={moderator} size="big" />
                <div className={css(styles.moderatorInfo)}>
                  <span className={css(styles.moderatorName)}>
                    {moderator && userBaseName(moderator)}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={this.writeToModerator}
                    className={css(styles.writeModeratorLink)}
                  >
                    Написать модератору
                  </span>
                </div>
              </div>
              {
                spots[id]?.infoData && (
                  <div className={css(styles.infoBlock)}>
                    <div>
                      <InfoBlockCounter
                        count={spots[id].infoData[0].count}
                        label={spots[id].infoData[0].label}
                      />
                    </div>
                    <div className={css(styles.routesInfo)}>
                      <InfoBlockCounter
                        count={spots[id].infoData[1].count}
                        label={spots[id].infoData[1].label}
                      />
                    </div>
                  </div>
                )
              }
            </div>
            <div className={css(styles.gymInfoBtnBlock)}>
              <div className={css(styles.btnWrapper)}>
                <Button onClick={this.sendPhotos} style="outlined" fullLength>
                  Прислать фотографии
                </Button>
              </div>
              <div className={css(styles.btnWrapper)}>
                <Button onClick={this.wantToAddRoutes} style="transparent" fullLength>
                  Хочу вносить трассы
                </Button>
              </div>
            </div>
            <div className={css(styles.gymInfoDescBlock)}>
              <div className={css(styles.gymInfoDescHeader)}>Описание</div>
              <div className={css(styles.gymInfoDescContent)}>{spots[id]?.description}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GymBasicInfoBlock.propTypes = {
  id: PropTypes.number,
  spots: PropTypes.object,
  user: PropTypes.object,
  moderator: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  spots: state.spotsStoreV2,
  moderator: state.usersStoreV2.store[2],
  user: currentUser(state),
});

export default withRouter(connect(mapStateToProps)(withModals(GymBasicInfoBlock)));
