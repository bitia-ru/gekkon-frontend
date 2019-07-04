import React     from 'react';
import PropTypes from 'prop-types';
import './RouteStatus.css';

const RouteStatus = ({
                         ascent, changeAscentResult,
                     }) => {
    let complete = (ascent && ascent.result !== 'unsuccessful');
    return (
        <div className={'route-status' + (complete ? ' route-status_complete' : '')}
             onClick={changeAscentResult ? changeAscentResult : null}>
            <div
                className={'route-status__type' + (complete ? (ascent.result === 'red_point' ? ' route-status__type_redpoint' : ' route-status__type_flash') : '')}>
            </div>
            {
                complete
                    ? (
                        ascent.result === 'red_point' ? 'Пролез' : 'Флешанул'
                    )
                    : 'Не пройдена'
            }
        </div>
    )
};

RouteStatus.propTypes = {
    ascent: PropTypes.object,
    changeAscentResult: PropTypes.func,
};

RouteStatus.defaultProps = {
    ascent: null,
    changeAscentResult: null,
};

export default RouteStatus;
