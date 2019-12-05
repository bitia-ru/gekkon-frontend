import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { notAvail, avail } from '../Utils';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteContext from '../contexts/RouteContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import './RouteStatus.css';

const RouteStatus = ({
  changeAscentResult, user,
}) => (
  <RouteContext.Consumer>
    {
      ({ route }) => {
        const ascents = avail(route.ascents) && getArrayFromObject(route.ascents);
        const ascent = (
          notAvail(user.id) || notAvail(ascents)
            ? null
            : (R.find(R.propEq('user_id', user.id))(ascents))
        );
        const complete = (ascent && ascent.result !== 'unsuccessful');
        let statusClass = '';
        if (complete && ascent.result === 'red_point') {
          statusClass = ' route-status__type_redpoint';
        } else if (complete && ascent.result === 'flash') {
          statusClass = ' route-status__type_flash';
        }
        return (
          <div
            className={`route-status${complete ? ' route-status_complete' : ''}`}
            role="button"
            tabIndex={0}
            style={{ outline: 'none' }}
            onClick={changeAscentResult || null}
          >
            <div
              className={`route-status__type${statusClass}`}
            />
            {
              complete
                ? (
                  ascent.result === 'red_point' ? 'Пролез' : 'Флешанул'
                )
                : 'Не пройдена'
            }
          </div>
        );
      }
    }
  </RouteContext.Consumer>
);

RouteStatus.propTypes = {
  changeAscentResult: PropTypes.func,
};

RouteStatus.defaultProps = {
  changeAscentResult: null,
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteStatus));
