import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteCard from '../RouteCard/RouteCard';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import SectorContext from '@/v1/contexts/SectorContext';
import CtrlPressedContext from '@/v1/contexts/CtrlPressedContext';
import { StyleSheet, css } from '../../aphrodite';
import { default as reloadRoutesAction } from '@/v2/utils/reloadRoutes';

class RouteCardTable extends React.PureComponent {
  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  componentDidMount() {
    this.props.reloadRoutes(this.getSpotId(), this.getSectorId());
  }

  render() {
    const {
      user,
      addRoute,
      onRouteClick,
      routes,
      routeIds,
    } = this.props;

    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => (
            <div
              className={css(styles.contentInner)}
              onClick={
                (e) => {
                  e.stopPropagation();
                }
              }
            >
              <CtrlPressedContext.Consumer>
                {
                  ({ ctrlPressed }) => (
                    <>
                      {
                        (sector && user && ctrlPressed) && (
                          <div className={css(styles.contentColMd4, styles.contentColLg3)}>
                            <div className={css(styles.contentRouteCard)}>
                              <a
                                className={css(styles.routeCard, styles.routeCardEdit)}
                                role="link"
                                tabIndex={0}
                                style={{ outline: 'none' }}
                                onClick={addRoute}
                              >
                                <span className={css(styles.routeCardEditIcon)} />
                                <span className={css(styles.routeCardEditTitle)}>
                                  Добавить новую трассу
                                </span>
                              </a>
                            </div>
                          </div>
                        )
                      }
                    </>
                  )
                }
              </CtrlPressedContext.Consumer>
              {
                R.map(
                  route => (
                    <div
                      key={route.id}
                      className={css(styles.contentColMd4, styles.contentColLg3)}
                      role="button"
                      tabIndex={0}
                      style={{ outline: 'none' }}
                      onClick={() => onRouteClick(route.id) || null}
                    >
                      <div className={css(styles.contentRouteCard)}>
                        <RouteCard route={route} />
                      </div>
                    </div>
                  ),
                  getArrayByIds(routeIds, routes),
                )
              }
            </div>
          )
        }
      </SectorContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  contentInner: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '-15px',
    marginRight: '-15px',
  },
  contentColMd4: {
    width: 'calc(33.33% - 30px)',
    marginLeft: '15px',
    marginRight: '15px',
    display: 'flex',
  },
  contentColLg3: {
    '@media screen and (min-width: 1200px)': {
      width: 'calc(25% - 30px)',
      marginLeft: '15px',
      marginRight: '15px',
      display: 'flex',
    },
  },
  contentRouteCard: {
    marginBottom: '30px',
    display: 'flex',
    width: '100%',
  },
  routeCard: {
    width: '100%',
    height: '100%',
    minHeight: '350px',
    padding: '24px',
    paddingBottom: '22px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    transition: 'box-shadow .4s ease-out',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    ':hover': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12)',
    },
    ':focus': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12), 0px 0px 0px 2px rgba(0, 108, 235, 0.7)',
    },
  },
  routeCardEdit: {
    boxShadow: 'none',
    backgroundColor: '#FDFDFD',
    border: '4px dashed #D1D5E2',
    opacity: '.7',
    transition: 'opacity .4s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    ':hover': {
      boxShadow: 'none',
      opacity: '1',
    },
  },
  routeCardEditIcon: {
    display: 'block',
    width: '118px',
    height: '118px',
    borderRadius: '50%',
    border: '4px solid #D1D5E2',
    position: 'relative',
    ':before': {
      content: '\'\'',
      position: 'absolute',
      width: '50px',
      height: '4px',
      backgroundColor: '#D1D5E2',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
    ':after': {
      content: '\'\'',
      position: 'absolute',
      width: '50px',
      height: '4px',
      backgroundColor: '#D1D5E2',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%) rotate(90deg)',
    },
  },
  routeCardEditTitle: {
    fontFamily: ['GilroyBold', 'sans-serif'],
    fontSize: '20px',
    color: '#D1D5E2',
    marginTop: '25px',
  },
});


RouteCardTable.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStoreV2.routes,
  routeIds: (
    state.routesStoreV2.filtrationResults[0]
      ? state.routesStoreV2.filtrationResults[0].routeIds
      : []
  ),
  user: state.usersStore.users[state.usersStore.currentUserId],
});

const mapDispatchToProps = dispatch => ({
  reloadRoutes: (spotId, sectorId) => dispatch(reloadRoutesAction(spotId, sectorId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteCardTable));
