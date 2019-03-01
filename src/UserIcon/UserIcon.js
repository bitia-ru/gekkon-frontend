import React, {Component} from 'react';
import List               from '../List/List';
import Avatar             from '../Avatar/Avatar';
import PropTypes          from 'prop-types';
import './UserIcon.css';

import {UserItemsData, GuestItemsData} from "../data";

const USER = {login: UserItemsData[0].title, avatar: '/public/user-icon/avatar.jpg'};

export default class UserIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            menuItems: GuestItemsData,
            droppedDown: false
        }
    }

    onItemSelect = (id) => {
        if (id === 2) {
            this.state.user ? this.props.logOut() : this.props.logIn();
            this.setState({
                user: (this.state.user ? null : USER),
                menuItems: (this.state.user ? GuestItemsData : UserItemsData)
            });
        }
        this.setState({droppedDown: false})
    };

    onAvatarClick = () => {
        this.setState({droppedDown: !this.state.droppedDown})
    };

    render() {
        return <div className="user-icon" onBlur={() => this.setState({droppedDown: false})} tabIndex={0}>
            <Avatar onClick={this.onAvatarClick}
                    user={this.state.user}/>
            {this.state.droppedDown ?
                <div className="user-icon__user-menu user-icon__user-menu_active">
                    <List items={this.state.menuItems}
                          onClick={this.onItemSelect}
                          textFieldName='title'/>
                </div> : ''}
        </div>;
    }
}

UserIcon.propTypes = {
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired
};
