import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import { updateUsers as updateUsersAction } from '../../redux/users/actions';
import {
  decreaseNumOfActiveRequests,
  increaseNumOfActiveRequests,
} from '@/v1/actions';
import RouteAscentsLayout from './RouteAscentsLayout';


class RouteAscents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsExpanded: true,
    };
  }

  render() {
    return (
      <Modal maxWidth="400px">
        <RouteAscentsLayout
          title="Добавление пролаза"
          blameCategory={false}
          ascents={[
            { success: false, id: 1000, accomplished_at: '21.01.2020' },
            { success: true, id: 1001, accomplished_at: '22.01.2020' },
          ]}
          details={{
            show: true,
            expanded: this.state.detailsExpanded,
            onExpand: () => {
              this.setState({ detailsExpanded: !this.state.detailsExpanded });
            },
          }}
          onAddButtonClicked={buttonId => console.log(buttonId)}
          onRemoveAscent={ascentId => console.log(ascentId)}
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
