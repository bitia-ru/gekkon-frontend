import React, {Component} from 'react';
import {Link}             from 'react-router-dom';

export default class Root extends Component {

    render() {
        return <React.Fragment>
            <ul>
                <li><Link to='/routes'>/routes</Link></li>
            </ul>
        </React.Fragment>;
    }
}
