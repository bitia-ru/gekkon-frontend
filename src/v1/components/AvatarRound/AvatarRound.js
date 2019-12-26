import React from 'react';
import PropTypes from 'prop-types';

import './AvatarRound.css';


const AvatarRound = ({
  url,
  username,
}) => (
  <a className={`avatar-round${url ? ' avatar-round_login' : ''}`}>
    {url && <img src={url} alt={username} />}
  </a>
);

AvatarRound.propTypes = {
};

export default AvatarRound;
