import React     from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
                    disabled,
                    submit,
                    fullLength,
                    isWaiting,
                    title,
                    size,
                    style,
                    onClick,
                }) => {
    let styleClass = style === 'normal' ? '' : (style === 'gray' ? ' btn_gray' : ' btn_transparent');
    let sizeClass = size === 'small' ? ' btn__small' : (size === 'medium' ? ' btn__medium' : '');
    return (
        <button type="button" onClick={onClick} disabled={disabled ? true : false}
                style={disabled ? {cursor: 'not-allowed'} : (isWaiting ? {cursor: 'wait'} : {})}
                className={'btn' + styleClass + sizeClass + (fullLength ? ' btn_full-length' : '') + (submit ? ' btn__submit' : '')}>{title}</button>
    )
};

Button.propTypes = {
    disabled: PropTypes.bool,
    submit: PropTypes.bool,
    fullLength: PropTypes.bool,
    isWaiting: PropTypes.bool,
    title: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
    disabled: false,
    submit: false,
    fullLength: false,
    isWaiting: false,
};

export default Button;
