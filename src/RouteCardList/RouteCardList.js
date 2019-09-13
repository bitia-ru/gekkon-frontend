import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteRow from '../RouteRow/RouteRow';
import './RouteCardList.css';

const RouteCardList = ({
  user,
  sectorId,
  addRoute,
  onRouteClick,
  routes,
}) => (
  <div className="table-card">
    {
      (sectorId !== 0 && user) && (
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
        routes,
      )
    }
  </div>
);

RouteCardList.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardList;
