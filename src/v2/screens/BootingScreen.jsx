import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { StyleSheet, css } from '../aphrodite';
import { loadUserSession } from '../redux/user_session/actions';
import { signIn } from '@/v1/stores/users/utils';


class BootingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadUserSession();
    this.props.signIn();// TODO: Remove after successfully switch from v1
  }

  render() {
    return (
      <>Загрузка...</>
    );
  }
}

const style = StyleSheet.create({
});

const mapStateToProps = state => ({
  users: state.usersStoreV2.store,
});

const mapDispatchToProps = dispatch => ({
  loadUserSession: () => dispatch(loadUserSession()),
  signIn: afterSignIn => dispatch(signIn(afterSignIn)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BootingScreen));
