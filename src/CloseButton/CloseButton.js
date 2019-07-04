import React     from 'react';
import PropTypes from 'prop-types';
import './CloseButton.css';

const CloseButton = ({
                         onClick,
                     }) => (
    <button className="close" onClick={onClick}></button>
);

CloseButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default CloseButton;
