import React, {Component} from 'react';
import List               from '../List/List';
import Avatar             from '../Avatar/Avatar';
import PropTypes          from 'prop-types';
import * as R             from "ramda";
import './UserIcon.css';

import {UserItemsData, GuestItemsData} from "../data";

export default class UserIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            droppedDown: false
        }
    }

    onItemSelect = (id) => {
        this.setState({droppedDown: false});
        if (id === 1) {
            this.props.user ? () => {} : this.props.signUp();
        }
        if (id === 2) {
            this.props.user ? this.props.logOut() : this.props.logIn();
        }
    };

    onAvatarClick = () => {
        this.setState({droppedDown: !this.state.droppedDown})
    };

    render() {
        return <div className="user-icon" onBlur={() => this.setState({droppedDown: false})} tabIndex={0}>
            <Avatar onClick={this.onAvatarClick}
                    user={this.props.user}/>
            {this.state.droppedDown ?
                <div className="user-icon__user-menu user-icon__user-menu_active">
                    <List
                        items={this.props.user === null ? GuestItemsData : R.prepend({title: (this.props.user.name ? this.props.user.name : this.props.user.login)}, UserItemsData)}
                        onClick={this.onItemSelect}
                        textFieldName='title'/>
                </div> : ''}
        </div>;
    }
}

UserIcon.propTypes = {
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired
};
