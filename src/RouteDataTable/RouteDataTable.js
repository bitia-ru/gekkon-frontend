import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as R from 'ramda';
import { getCategoryColor } from '../Constants/Categories';
import { GetUserName } from '../Constants/User';
import { ROUTE_KINDS } from '../Constants/Route';
import RouteColorPicker from '../RouteColorPicker/RouteColorPicker';
import './RouteDataTable.css';

const RouteDataTable = ({
  user, route,
}) => {
  const isCurrentUserRoute = user && route.author_id === user.id;
  let name = route.author ? GetUserName(route.author) : null;
  name = name || 'Неизвестный накрутчик';
  if (!isCurrentUserRoute && name === 'Неизвестный накрутчик' && route.author_id !== null) {
    if (user.role === 'admin') {
      name = GetUserName(route.author, true);
    }
    if (user.role === 'creator') {
      name = `Пользователь #${route.author.id}`;
    }
  }
  return (
    <div className="route-data-table">
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Сложность:
        </div>
        <div className="route-data-table-item">
          <div className="route-data-table__category-track">{route.category}</div>
          <div
            className="route-data-table__category-track-color"
            style={{ backgroundColor: getCategoryColor(route.category) }}
          />
        </div>
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Цвет зацепов:
        </div>
        <div className="route-data-table-item">
          <RouteColorPicker editable={false} route={route} fieldName="holds_color" />
        </div>
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Цвет маркировки:
        </div>
        <div className="route-data-table-item">
          <RouteColorPicker editable={false} route={route} fieldName="marks_color" />
        </div>
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Народная категория:
        </div>
        <div className="route-data-table-item" />
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Тип:
        </div>
        <div className="route-data-table-item">
          {R.find(R.propEq('title', route.kind), ROUTE_KINDS).text}
        </div>
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Дата накрутки:
        </div>
        <div className="route-data-table-item">
          {
            route.installed_at
              ? (
                moment(route.installed_at).format('DD.MM.YYYY')
              )
              : ''
          }
        </div>
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Дата cкрутки:
        </div>
        <div className="route-data-table-item">
          {
            route.installed_until
              ? (
                moment(route.installed_until).format('DD.MM.YYYY')
              )
              : ''
          }
        </div>
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Накрутчик:
        </div>
        <div className="route-data-table-item">
          <a className="route-data-table__link">{isCurrentUserRoute ? 'Вы' : name}</a>
        </div>
      </div>
    </div>
  );
};

RouteDataTable.propTypes = {
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
};

export default RouteDataTable;
