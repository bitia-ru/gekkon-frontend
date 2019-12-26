import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { withRouter } from 'react-router-dom';
import List from '../List/List';
import Avatar from '../Avatar/Avatar';
import { userName, userAvatar } from '../../utils/user';
import { GetUserName, USER_ITEMS_DATA, GUEST_ITEMS_DATA } from '../../Constants/User';
import { logOut } from '../../utils/navigation';

import './UserIcon.css';


class UserIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
    };
  }

    onItemSelect = (id) => {
      const {
        user,
      } = this.props;

      this.setState({ droppedDown: false });

      if (id === 1) {
        if (user) {
          this.props.history.push('#profile');
        } else {
          this.props.history.push('#signup');
        }
      }

      if (id === 2) {
        if (user) {
          logOut();
        } else {
          this.props.history.push('#signin');
        }
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
            url={userAvatar(user)}
            username={user && userName(user)}
          />
          {
            droppedDown
              ? (
                <div className="user-icon__user-menu user-icon__user-menu_active">
                  <List
                    items={
                      !user
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
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(UserIcon));
