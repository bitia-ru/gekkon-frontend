import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './RouteAscents.css';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import { updateUsers as updateUsersAction } from '../../redux/users/actions';
import {
  decreaseNumOfActiveRequests,
  increaseNumOfActiveRequests,
} from '@/v1/actions';
import RouteAscentsLayout from '../../layouts/RouteAscentsLayout';


class RouteAscents extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <Modal maxWidth="400px">
        <RouteAscentsLayout
          title="Добавление пролаза"
          blameCategory
        />
      </Modal>
    );
  }
}

RouteAscents.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: currentUser(state),
  formErrors: {},
});

const mapDispatchToProps = dispatch => ({
  updateUsers: users => dispatch(updateUsersAction(users)),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteAscents));
