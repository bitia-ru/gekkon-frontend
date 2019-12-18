import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => (
  <div className="logo__container">
    <Link to="/" className="logo">
      <span className="logo__icon">
        <img src={require('./images/logo-75x75.png')} alt="Gekkon" />
      </span>
    </Link>
  </div>
);

export default Logo;
