import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import { updateUsers as updateUsersAction } from '../../redux/users/actions';
import RouteAscentsLayout from './RouteAscentsLayout';


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
          initialWithFlash={true}
          blameCategory={false}
          ascents={[
            { success: false, id: 1000, accomplished_at: '2020-01-21' },
            { success: true, id: 1001, accomplished_at: '2020-01-22' },
          ]}
          details={{
            show: true,
          }}
          onAddAscents={
            (ascents, afterAscentsAdded) => {
              console.log(ascents);

              if (true) {
                afterAscentsAdded();
              }
            }
          }
          onRemoveAscent={ascentId => console.log(ascentId)}
          onAscentDateChanged={(ascentId, newDate) => console.log(ascentId, newDate)}
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteAscents));
