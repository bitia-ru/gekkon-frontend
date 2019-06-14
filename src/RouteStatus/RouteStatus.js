import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './RouteStatus.css';

export default class RouteStatus extends Component {
    render() {
        let complete = (this.props.ascent && this.props.ascent.result !== 'unsuccessful');
        return <div className={'route-status' + (complete ? ' route-status_complete' : '')} onClick={this.props.changeAscentResult ? this.props.changeAscentResult : null}>
            <div
                className={'route-status__type' + (complete ? (this.props.ascent.result === 'red_point' ? ' route-status__type_redpoint' : ' route-status__type_flash') : '')}>
            </div>
            {
                complete
                    ? (
                      this.props.ascent.result === 'red_point' ? 'Пролез' : 'Флешанул'
                    )
                  : 'Не пройдена'
            }
        </div>;
    }
}

RouteStatus.propTypes = {
};
