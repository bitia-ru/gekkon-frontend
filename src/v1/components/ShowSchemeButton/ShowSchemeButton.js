import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RouteContext from '../../contexts/RouteContext';
import './ShowSchemeButton.css';

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
            className="modal__track-show-map"
            onClick={disabled || diagram === null ? null : onClick}
            title={diagram === null ? 'Схема зала ещё не загружена' : ''}
            style={disabled || diagram === null ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
          >
            <svg>
              <use
                xlinkHref={
                  `${require('../../../../img/btn-handler/btn-handler-sprite.svg').default}#icon-show-map`
                }
              />
            </svg>
          </button>
        );
      }
    }
  </RouteContext.Consumer>
);

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
