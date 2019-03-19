import React, {Component} from 'react';
import PropTypes          from "prop-types";
import './Avatar.css';

export default class Avatar extends Component {
    render() {
        return <div className="avatar" onClick={this.props.onClick}>
            {(this.props.user && this.props.user.avatar) ?
                <img src={this.props.user.avatar.url} alt={this.props.user.login}/> :
                <svg>
                    <use
                        xlinkHref="/public/user-icon/avatar-none.svg#toggle-list"></use>
                </svg>}
        </div>;
    }
}

Avatar.propTypes = {
    onClick: PropTypes.func.isRequired
};
