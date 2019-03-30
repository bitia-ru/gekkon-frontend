import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './LikeButton.css';

export default class LikeButton extends Component {
    render() {
        return <button className={'like-button' + (this.props.isLiked ? ' like-button_active' : '')}
                       onClick={this.props.onChange}>
									<span className="like-button__icon">
										<svg>
											<use xlinkHref="/public/img/like-sprite/like.svg#icon-like"></use>
										</svg>
									</span>
            <span className="like-button__count">{this.props.numOfLikes}</span>
        </button>;
    }
}

LikeButton.propTypes = {
    numOfLikes: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};
