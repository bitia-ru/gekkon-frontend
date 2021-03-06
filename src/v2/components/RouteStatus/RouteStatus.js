import React from 'react';
import PropTypes from 'prop-types';
import RouteContext from '@/v1/contexts/RouteContext';
import { StyleSheet, css } from '../../aphrodite';

const RouteStatus = ({ onClick }) => (
  <RouteContext.Consumer>
    {
      ({ route }) => {
        const { ascent_result: ascentResult } = route;
        const complete = (ascentResult && ascentResult !== 'unsuccessful');

        let statusClassRedpoint = false;
        let statusClassFlash = false;
        if (complete && ascentResult === 'red_point') {
          statusClassRedpoint = true;
        } else if (complete && ascentResult === 'flash') {
          statusClassFlash = true;
        }
        return (
          <div
            className={css(styles.routeStatus, complete ? styles.routeStatusComplete : '')}
            role="button"
            tabIndex={0}
            style={{ outline: 'none' }}
            onClick={onClick || null}
          >
            <div
              className={css(styles.routeStatusType,
                statusClassRedpoint ? styles.routeStatusTypeRedpoint : '',
                statusClassFlash ? styles.routeStatusTypeFlash : '')}
            />
            {
              complete
                ? (
                  ascentResult === 'red_point' ? 'Пролез' : 'Флешанул'
                )
                : 'Не пройдена'
            }
          </div>
        );
      }
    }
  </RouteContext.Consumer>
);

const styles = StyleSheet.create({
  routeStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    color: '#8A8A8A',
    fontSize: '14px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    padding: '6px 15px',
    boxSizing: 'border-box',
    lineHeight: '1.7em',
    cursor: 'pointer',
  },
  routeStatusType: {
    backgroundColor: '#ffffff',
    width: '17px',
    height: '17px',
    display: 'flex',
    borderRadius: '50%',
    marginRight: '8px',
  },
  routeStatusTypeFlash: {
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%225%22%20height%3D%229%22%20viewBox%3D%220%200%205%209%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M5%202.87357H2.85937L4.84376%200H2.34374L0%204.31035H1.84376L0%208.33333L5%202.87357Z%22%20fill%3D%22%23F5CA3D%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '7px 11px',
    backgroundPosition: 'center',
  },
  routeStatusTypeRedpoint: {
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Ccircle%20cx%3D%227.5%22%20cy%3D%227.5%22%20r%3D%227.5%22%20fill%3D%22%23FF3347%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '9px 9px',
    backgroundPosition: 'center',
  },
  routeStatusComplete: {
    backgroundColor: '#006CEB',
    color: '#ffffff',
  },
});

RouteStatus.propTypes = { onClick: PropTypes.func };

RouteStatus.defaultProps = { onClick: null };

export default RouteStatus;
