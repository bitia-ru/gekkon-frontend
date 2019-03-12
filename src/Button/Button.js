import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './Button.css';

export default class Button extends Component {
    render() {
        let styleClass = this.props.style === 'normal' ? '' : ' btn_enter';
        let sizeClass = this.props.size === 'small' ? ' btn__small' : (this.props.size === 'medium' ? ' btn__medium' : '');
        return <a onClick={this.props.onClick}
                  className={'btn' + styleClass + sizeClass}>{this.props.title}</a>;
    }
}

Button.propTypes = {
    title: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};
