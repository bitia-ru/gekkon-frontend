import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteCard from '../RouteCard/RouteCard';
import './RouteCardTable.css';

const RouteCardTable = ({
  user,
  sectorId,
  ctrlPressed,
  addRoute,
  ascents,
  onRouteClick,
  routes,
}) => (
  <div className="content__inner">
    {
      (sectorId !== 0 && user && ctrlPressed)
        ? (
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
        : ''
    }
    {
      R.map(
        route => (
          <RouteCard
            key={route.id}
            route={route}
            ascent={R.find(ascent => ascent.route_id === route.id, ascents)}
            onRouteClick={() => onRouteClick(route.id)}
          />
        ),
        routes,
      )
    }
  </div>
);

RouteCardTable.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  ctrlPressed: PropTypes.bool.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

RouteCardTable.defaultProps = {
  user: null,
};

export default RouteCardTable;
