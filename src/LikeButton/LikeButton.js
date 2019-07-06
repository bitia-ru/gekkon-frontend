import React from 'react';
import PropTypes from 'prop-types';
import './LikeButton.css';

const LikeButton = ({
  isLiked, onChange, numOfLikes,
}) => (
  <button
    className={`like-button${isLiked ? ' like-button_active' : ''}`}
    type="button"
    onClick={onChange}
  >
    <span className="like-button__icon">
      <svg>
        <use xlinkHref="/public/img/like-sprite/like.svg#icon-like" />
      </svg>
    </span>
    <span className="like-button__count">{numOfLikes}</span>
  </button>
);

LikeButton.propTypes = {
  onChange: PropTypes.func,
  numOfLikes: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
};

LikeButton.defaultProps = {
  user: null,
};

export default LikeButton;
