import React     from 'react';
import PropTypes from 'prop-types';
import './ButtonHandler.css';

const ButtonHandler = ({
                           title, onClick, xlinkHref,
                       }) => (
    <div className="btn-handler__track-toggles-item">
        <button className="btn-handler"
                type="button"
                title={title}
                onClick={onClick}
        >
            <svg aria-hidden="true">
                <use xlinkHref={xlinkHref}></use>
            </svg>
        </button>
    </div>
);

ButtonHandler.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    xlinkHref: PropTypes.string.isRequired,
};

export default ButtonHandler;
