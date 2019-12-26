import React from 'react';
import PropTypes from 'prop-types';
import { GetUserName } from '../../Constants/User';

import './Avatar.css';


const Avatar = ({
  url, username, onClick,
}) => (
  <div
    className={`avatar${url ? ' avatar_login' : ''}`}
    role="button"
    onClick={onClick}
  >
    {url && <img src={url} alt={GetUserName(username)} />}
  </div>
);

Avatar.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Avatar;
