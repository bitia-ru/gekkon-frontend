import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import List from '../List/List';
import Avatar from '../Avatar/Avatar';
import { GetUserName, USER_ITEMS_DATA, GUEST_ITEMS_DATA } from '../Constants/User';
import './UserIcon.css';

export default class UserIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
    };
  }

    onItemSelect = (id) => {
      const {
        user, openProfile, signUp, logOut, logIn,
      } = this.props;
      this.setState({ droppedDown: false });
      if (id === 1) {
        user ? openProfile() : signUp();
      }
      if (id === 2) {
        user ? logOut() : logIn();
      }
    };

    onAvatarClick = () => {
      const { droppedDown } = this.state;
      this.setState({ droppedDown: !droppedDown });
    };

    render() {
      const { user } = this.props;
      const { droppedDown } = this.state;
      const title = user ? GetUserName(user, true) : '';
      return (
        <div
          className="user-icon"
          onBlur={() => this.setState({ droppedDown: false })}
          tabIndex={0}
        >
          <Avatar
            onClick={this.onAvatarClick}
            user={user}
          />
          {
            droppedDown
              ? (
                <div className="user-icon__user-menu user-icon__user-menu_active">
                  <List
                    items={
                      user === null
                        ? GUEST_ITEMS_DATA
                        : R.prepend({ title }, USER_ITEMS_DATA)
                    }
                    onClick={this.onItemSelect}
                    textFieldName="title"
                  />
                </div>
              )
              : ''
          }
        </div>
      );
    }
}

UserIcon.propTypes = {
  user: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
};

UserIcon.defaultProps = {
  user: null,
};
