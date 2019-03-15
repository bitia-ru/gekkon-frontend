import React, {Component} from 'react';
import './AvatarRound.css';

export default class AvatarRound extends Component {
    render() {
        return <a className="avatar-round">
            <img src="/public/user-icon/avatar.jpg" alt="Иванов Иван"/>
        </a>;
    }
}
