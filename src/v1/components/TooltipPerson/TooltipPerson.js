import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { DISPLAYED_DEFAULT } from '../../Constants/TooltipPerson';
import './TooltipPerson.css';

export default class TooltipPerson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayFull: false,
    };
  }

  render() {
    const {
      title, position, users, hide, cancelHide,
    } = this.props;
    const { displayFull } = this.state;
    return (
      <>
        {
          users.length > 0 && <div
            className={`modal__track-count-tooltip modal__track-count-tooltip_${position}`}
            onMouseEnter={cancelHide}
            onMouseLeave={hide}
            style={{ zIndex: 1000, cursor: 'pointer', outline: 'none' }}
            onClick={() => this.setState({ displayFull: true })}
            role="button"
            tabIndex={0}
          >
            <div className="modal__track-count-tooltip-title">
              {title}
            </div>
            <div className={`modal__avatar-block${displayFull ? '-vertical' : ''}`}>
              {
                R.map(
                  user => (
                    <React.Fragment key={user.id}>
                      {
                        displayFull
                          ? (
                            <div className="modal__person-block" style={{ cursor: 'pointer' }}>
                              <div className="modal__avatar modal__avatar-person">
                                {
                                  user.avatar
                                    ? (
                                      <img
                                        src={user.avatar.url}
                                        alt={user.name ? user.name : user.login}
                                      />
                                    )
                                    : ''
                                }
                              </div>
                              <p className="modal__avatar-name">
                                {user.name ? user.name : user.login}
                              </p>
                            </div>
                          )
                          : (
                            <div
                              className="modal__avatar modal__avatar-person"
                              title={user.name ? user.name : user.login}
                            >
                              {
                                user.avatar
                                  ? (
                                    <img
                                      src={user.avatar.url}
                                      alt={user.name ? user.name : user.login}
                                    />
                                  )
                                  : ''
                              }
                            </div>
                          )
                      }
                    </React.Fragment>
                  ),
                  displayFull ? users : R.slice(0, DISPLAYED_DEFAULT, users),
                )
              }
              {
                (!displayFull && users.length > DISPLAYED_DEFAULT) && <div
                  className="modal__avatar"
                >
                  {`+${users.length - DISPLAYED_DEFAULT}`}
                </div>
              }
            </div>
          </div>
        }
      </>);
  }
}

TooltipPerson.propTypes = {
  users: PropTypes.array,
  position: PropTypes.string,
  title: PropTypes.string,
  hide: PropTypes.func.isRequired,
  cancelHide: PropTypes.func.isRequired,
};

TooltipPerson.defaultProps = {
  users: [],
  position: 'center',
  title: '',
};
