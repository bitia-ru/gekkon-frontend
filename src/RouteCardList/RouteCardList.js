import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteRow from '../RouteRow/RouteRow';
import getArrayByIds from '../../v1/utils/getArrayByIds';
import SectorContext from '../contexts/SectorContext';
import './RouteCardList.css';

const RouteCardList = ({
  user,
  addRoute,
  onRouteClick,
  routes,
  routeIds,
}) => (
  <SectorContext.Consumer>
    {
      ({ sector }) => (
        <div className="table-card">
          {
            (sector && user) && (
              <button
                className="table-card__add"
                type="button"
                onClick={addRoute}
                title="Добавить трассу"
              />
            )
          }
          <div className="table-card__header">
            <div className="table-card__header-item table-card__number">Номер</div>
            <div className="table-card__header-item table-card__name">Название трассы</div>
            <div className="table-card__header-item table-card__category">Категория</div>
            <div className="table-card__header-item table-card__marking">Зацепы</div>
            <div className="table-card__header-item table-card__hooks">Маркеры</div>
            <div className="table-card__header-item table-card__author">Накрутчик</div>
          </div>
          {
            R.map(
              route => (
                <RouteRow
                  key={route.id}
                  route={route}
                  user={user}
                  onRouteClick={() => onRouteClick(route.id)}
                />
              ),
              getArrayByIds(routeIds, routes),
            )
          }
        </div>
      )
    }
  </SectorContext.Consumer>
);

RouteCardList.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routes,
  routeIds: state.routeIds,
});

export default withRouter(connect(mapStateToProps)(RouteCardList));
