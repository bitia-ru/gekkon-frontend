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
    let styleClass = '';
    if (style !== 'normal') {
        if (style === 'gray') {
            styleClass = ' btn_gray';
        } else {
            styleClass = ' btn_transparent';
        }
    }
    let sizeClass = '';
    if (size === 'small') {
        sizeClass = ' btn__small';
    } else if (size === 'medium') {
        sizeClass = ' btn__medium';
    }
    let fullLengthClass = fullLength ? ' btn_full-length' : '';
    let submitClass = submit ? ' btn__submit' : '';
    return (
        <button type="button"
                onClick={onClick}
                disabled={disabled ? true : false}
                style={disabled ? {cursor: 'not-allowed'} : (isWaiting ? {cursor: 'wait'} : {})}
                className={
                    'btn' + styleClass + sizeClass + fullLengthClass + submitClass
                }
        >
            {title}
        </button>
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
