import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { notAvail, avail } from '@/v1/utils';
import RouteContext from '@/v1/contexts/RouteContext';
import getArrayFromObject from '@/v1/utils/getArrayFromObject';

import './RouteStatus.css';


const RouteStatus = ({
  changeAscentResult,
  onEditAdvancedClicked,
  user,
}) => (
  <RouteContext.Consumer>
    {
      ({ route }) => {
        const ascents = avail(route.ascents) && getArrayFromObject(route.ascents);
        const ascent = (
          notAvail(user) || notAvail(ascents)
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
            <div className={`route-status__type${statusClass}`} />
            {
              complete
                ? (
                  ascent.result === 'red_point' ? 'Пролез' : 'Флешанул'
                )
                : 'Не пройдена'
            }
            <div
              className="route-status__pencil"
              onClick={(event) => {
                event.stopPropagation();
                if (onEditAdvancedClicked) {
                  onEditAdvancedClicked();
                }
              }}
            >
              ☰
            </div>
          </div>
        );
      }
    }
  </RouteContext.Consumer>
);

RouteStatus.propTypes = {
  changeAscentResult: PropTypes.func,
  onEditAdvancedClicked: PropTypes.func,
};

RouteStatus.defaultProps = {
  changeAscentResult: null,
  onEditAdvancedClicked: null,
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteStatus));
