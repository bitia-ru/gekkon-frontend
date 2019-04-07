import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './Button.css';

export default class Button extends Component {
    render() {
        let styleClass = this.props.style === 'normal' ? '' : (this.props.style === 'gray' ? ' btn_gray' : ' btn_transparent');
        let sizeClass = this.props.size === 'small' ? ' btn__small' : (this.props.size === 'medium' ? ' btn__medium' : '');
        return <button type="button" onClick={this.props.onClick} disabled={this.props.disabled ? true : false}
                       style={this.props.disabled ? {cursor: 'not-allowed'} : (this.props.isWaiting ? {cursor: 'wait'} : {})}
                       className={'btn' + styleClass + sizeClass + (this.props.fullLength ? ' btn_full-length' : '') + (this.props.submit ? ' btn__submit' : '')}>{this.props.title}</button>;
    }
}

Button.propTypes = {
    title: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};
