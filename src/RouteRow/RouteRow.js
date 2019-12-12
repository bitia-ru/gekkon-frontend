import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GetUserName } from '../Constants/User';
import RouteColor from '../RouteColor/RouteColor';
import './RouteRow.css';

const RouteRow = ({ onRouteClick, route, user }) => {
  const isCurrentUserRoute = user && route.author_id === user.id;
  let name = route.author ? GetUserName(route.author) : null;
  name = name || 'Неизвестный накрутчик';
  if (!isCurrentUserRoute && name === 'Неизвестный накрутчик' && route.author_id !== null) {
    if (user && user.role === 'admin') {
      name = GetUserName(route.author, true);
    }
    if (user && user.role === 'creator') {
      name = `Пользователь #${route.author.id}`;
    }
  }
  return (<div className="table-card__card">
    <div
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer', outline: 'none' }}
      onClick={onRouteClick || null}
      className="table-card__link"
    />
    <div className="table-card__item table-card__number">
      {route.number ? `№${route.number}` : `#${route.id}`}
    </div>
    <div className="table-card__item table-card__name">{route.name}</div>
    <div className="table-card__item table-card__category">{route.category}</div>
    <div className="table-card__item table-card__marking">
      <RouteColor size="medium" route={route} fieldName="holds_color" />
    </div>
    <div className="table-card__item table-card__hooks">
      <RouteColor size="medium" route={route} fieldName="marks_color" />
    </div>
    <div className="table-card__item table-card__author">
      {isCurrentUserRoute ? 'Вы' : name}
    </div>
  </div>);
};

RouteRow.propTypes = {
  onRouteClick: PropTypes.func,
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteRow));
