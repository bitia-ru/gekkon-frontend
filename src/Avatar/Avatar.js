import React, {Component} from 'react';
import PropTypes          from "prop-types";
import {GetUserName}      from '../Constants/User';
import './Avatar.css';

export default class Avatar extends Component {
    render() {
        return <div className={'avatar' + (this.props.user ? ' avatar_login' : '')} onClick={this.props.onClick}>
            {
                (this.props.user && this.props.user.avatar)
                    ? (
                        <img src={this.props.user.avatar.url} alt={GetUserName(this.props.user)}/>
                    )
                    : ''
            }
        </div>;
    }
}

Avatar.propTypes = {
    onClick: PropTypes.func.isRequired
};
