import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UserPoster from '../components/UserPoster/UserPoster';
import { StyleSheet, css } from '../aphrodite';
import MainScreen from '../layouts/MainScreen/MainScreen';
import { loadSpecificUser } from '../redux/users/actions';


class UserShow extends React.PureComponent {
  obtainUser = (userId, users, loadSpecificUser) => {
    if (!users[userId]) {
      loadSpecificUser(userId);

      return {
        base_name: `User #${userId}`,
      };
    }

    const user = users[userId];

    return {
      ...user,
      base_name: user.name ? user.name : (user.login ? user.login : `User #${user.id}`),
    };
  };

  obtainUserAscents = (userId) => {
    return [
      {
        date: new Date(),
        route_id: 1546,
        result: 'flash',
      },
      {
        date: new Date(),
        route_id: 1547,
        result: 'redpoint',
      },
    ];
  };

  render() {
    const { match, users, loadSpecificUser } = this.props;

    return (
      <MainScreen
        header={
          <UserPoster
            user={this.obtainUser(match.params.user_id, users, loadSpecificUser)}
          />
        }
      >
        <div className={css(style.content)} />
      </MainScreen>
    );
  }
}

const style = StyleSheet.create({
  content: {
    flex: 1,
  },
});

const mapStateToProps = state => ({
  users: state.usersStoreV2.store,
});

const mapDispatchToProps = dispatch => ({
  loadSpecificUser: userId => dispatch(loadSpecificUser(userId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserShow));
