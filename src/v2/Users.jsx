import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SpotPoster from './components/SpotPoster/SpotPoster';
import { StyleSheet, css } from './aphrodite';
import MainScreen from './layouts/MainScreen/MainScreen';
import { loadSpecificUser } from './redux/users/actions';


const obtainUser = (userId, users, loadSpecificUser) => {
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

const Users = ({ match, users, loadSpecificUser }) => (
  <MainScreen
    header={
      <SpotPoster
        user={obtainUser(match.params.user_id, users, loadSpecificUser)}
      />
    }
  >
    <div className={css(style.content)} />
  </MainScreen>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    minHeight: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
