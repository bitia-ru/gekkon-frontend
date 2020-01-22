import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import { currentUser } from '../../redux/user_session/utils';
import List from '@/v1/components/List/List';
import Avatar from '@/v1/components/Avatar/Avatar';
import { GetUserName, USER_ITEMS_DATA, GUEST_ITEMS_DATA } from '@/v1/Constants/User';

import './UserIcon.css';
import { closeUserSession } from '../../utils/auth';


class UserIcon extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
    };
  }

  onItemSelect = (id) => {
    const { user } = this.props;

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
        closeUserSession();
      } else {
        this.props.history.push('#signin');
      }
    }

    if (id === 3) {
      document.cookie = "gekkon_creator_mode=1";
      document.location.reload(true);
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
  user: currentUser(state),
});

export default connect(mapStateToProps)(withRouter(UserIcon));
