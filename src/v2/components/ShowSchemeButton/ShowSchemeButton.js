import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RouteContext from '../../contexts/RouteContext';
import { StyleSheet, css } from '../../aphrodite';

const ShowSchemeButton = ({
  onClick,
  disabled,
  sectors,
}) => (
  <RouteContext.Consumer>
    {
      ({ route }) => {
        const sector = sectors[route.sector_id];
        const diagram = sector && sector.diagram && sector.diagram.url;
        return (
          <button
            type="button"
            className={css(styles.modalTrackShowMap)}
            onClick={disabled || diagram === null ? null : onClick}
            title={diagram === null ? 'Схема зала ещё не загружена' : ''}
            style={disabled || diagram === null ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
          >
            <svg>
              <use
                xlinkHref={
                  `${require('../../../../img/btn-handler/btn-handler-sprite.svg')}#icon-show-map`
                }
              />
            </svg>
          </button>
        );
      }
    }
  </RouteContext.Consumer>
);

const styles = StyleSheet.create({
  modalTrackShowMap: {
    width: '30px',
    height: '30px',
    position: 'absolute',
    left: '25px',
    top: '25px',
    cursor: 'pointer',
    padding: '0',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'opacity .3s ease-out',
    zIndex: '10',
    ':hover': {
      opacity: '.8',
    },
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#4F4F4F',
    },
  },
});

ShowSchemeButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  sectors: PropTypes.object.isRequired,
};

ShowSchemeButton.defaultProps = {
  disabled: false,
  onClick: null,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(ShowSchemeButton));
