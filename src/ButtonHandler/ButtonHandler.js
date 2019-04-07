import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './ButtonHandler.css';

export default class ButtonHandler extends Component {
    render() {
        return <div className="btn-handler__track-toggles-item">
            <button className="btn-handler" title={this.props.title} onClick={this.props.onClick}>
                <svg aria-hidden="true">
                    <use xlinkHref={this.props.xlinkHref}></use>
                </svg>
            </button>
        </div>;
    }
}

ButtonHandler.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    xlinkHref: PropTypes.string.isRequired
};
