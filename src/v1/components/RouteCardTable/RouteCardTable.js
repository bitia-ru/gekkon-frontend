import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteCard from '../RouteCard/RouteCard';
import getArrayByIds from '../../utils/getArrayByIds';
import SectorContext from '../../contexts/SectorContext';
import CtrlPressedContext from '../../contexts/CtrlPressedContext';
import './RouteCardTable.css';

const RouteCardTable = ({
  user,
  addRoute,
  onRouteClick,
  routes,
  routeIds,
}) => (
  <SectorContext.Consumer>
    {
      ({ sector }) => (
        <div className="content__inner">
          <CtrlPressedContext.Consumer>
            {
              ({ ctrlPressed }) => (
                <>
                  {
                    (sector && user && ctrlPressed) && (
                      <div className="content__col-md-4 content__col-lg-3">
                        <div className="content__route-card">
                          <a
                            className="route-card route-card__edit"
                            role="link"
                            tabIndex={0}
                            style={{ outline: 'none' }}
                            onClick={addRoute}
                          >
                            <span className="route-card__edit-icon" />
                            <span className="route-card__edit-title">
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
                  className="content__col-md-4 content__col-lg-3"
                  role="button"
                  tabIndex={0}
                  style={{ outline: 'none' }}
                  onClick={() => onRouteClick(route.id) || null}
                >
                  <div className="content__route-card">
                    <RouteCard
                      route={route}
                    />
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

RouteCardTable.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  routeIds: (
    state.routesStore.filtrationResults[0]
      ? state.routesStore.filtrationResults[0].routeIds
      : []
  ),
});

export default withRouter(connect(mapStateToProps)(RouteCardTable));
