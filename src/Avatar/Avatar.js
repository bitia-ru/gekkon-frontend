import React         from 'react';
import PropTypes     from "prop-types";
import {GetUserName} from '../Constants/User';
import './Avatar.css';

const Avatar = ({
                    user, onClick,
                }) => (
    <div className={'avatar' + (user ? ' avatar_login' : '')} onClick={onClick}>
        {
            (user && user.avatar)
                ? (
                    <img src={user.avatar.url} alt={GetUserName(user)}/>
                )
                : ''
        }
    </div>
);

Avatar.propTypes = {
    user: PropTypes.object,
    onClick: PropTypes.func.isRequired,
};

Avatar.defaultProps = {
    user: null,
};

export default Avatar;
