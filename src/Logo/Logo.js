import React, {Component} from 'react';
import {Link}             from "react-router-dom";
import './Logo.css';

import logoImage from '../../img/logo-img/logo.svg';

export default class Logo extends Component {
    render() {
        return <div className="logo__container">
            <Link to="/" className="logo">
                <span className="logo__icon">
						<img src={logoImage} alt="Gekkon"/>
					</span>
            </Link>
        </div>;
    }
}
