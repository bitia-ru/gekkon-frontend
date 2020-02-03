import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import RouteAscentsLayout from './RouteAscentsLayout';
import {
  updateAscent as updateAscentAction,
  addAscent as addAscentAction,
  removeAscent as removeAscentAction,
} from '@/v2/redux/routes/actions';

const ADD_ATTEMPT_TIMEOUT = 1000;

class RouteAscents extends Component {
  constructor(props) {
    super(props);

    this.noAscents = this.ascentsForLayout().length === 0;
    this.state = {
      detailsExpanded: !this.noAscents,
      attempts: { count: 0 },
    };
    this.timerId = null;
  }

  onAddButtonClicked = (buttonId) => {
    if (R.contains(buttonId, ['attempt', 'success'])) {
      const { attempts } = this.state;
      let count;
      if (R.contains(attempts.type, [buttonId, undefined])) {
        count = attempts.count + 1;
        this.setState({ attempts: { count, type: buttonId } });
      } else {
        count = 1;
        this.createAttempts(attempts.count, attempts.type);
      }
      clearTimeout(this.timerId);
      this.timerId = setTimeout(
        this.createAttempts,
        ADD_ATTEMPT_TIMEOUT,
        count,
        buttonId,
        true,
      );
      return;
    }
    const { user, addAscent } = this.props;
    const params = {
      ascent: {
        result: buttonId,
        user_id: user.id,
        route_id: this.getRouteId(),
      },
    };
    addAscent(params);
    this.afterRequestSend();
  };

  afterRequestSend = () => {
    const { history } = this.props;
    if (this.noAscents) {
      history.goBack();
    }
  };

  createAttempts = (count, type, onTimeout) => {
    const { user, addAscent } = this.props;
    const params = {
      ascent: {
        result: type === 'attempt' ? 'unsuccessful' : 'red_point',
        user_id: user.id,
        route_id: this.getRouteId(),
        count,
      },
    };
    addAscent(params);
    if (onTimeout) {
      this.setState({ attempts: { count: 0 } });
    } else {
      this.setState(
        { attempts: { count: 1, type: type === 'attempt' ? 'success' : 'attempt' } },
      );
    }
    this.afterRequestSend();
  };

  onAscentDateChanged = (id, date) => {
    const { updateAscent } = this.props;
    const params = { ascent: { accomplished_at: date } };
    updateAscent(id, params);
  };

  removeAscent = (id) => {
    const { removeAscent } = this.props;
    removeAscent(id);
  };

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  ascentsForLayout = () => {
    const { routes, user } = this.props;
    const route = routes[this.getRouteId()];
    return R.map(
      ascent => (
        R.merge(
          ascent,
          { success: R.contains(ascent.result, ['flash', 'red_point']) },
        )
      ),
      R.filter(R.propEq('user_id', user.id), R.values(route.ascents)),
    );
  };

  render() {
    const { detailsExpanded, attempts } = this.state;
    const ascents = this.ascentsForLayout();
    return (
      <Modal maxWidth="400px">
        <RouteAscentsLayout
          title="Добавление пролаза"
          initialWithFlash={true}
          blameCategory={false}
          ascents={ascents}
          onClick={this.onClick}
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
          onRemoveAscent={this.removeAscent}
          onAscentDateChanged={this.onAscentDateChanged}
        />
      </Modal>
    );
  }
}

RouteAscents.propTypes = {
  user: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  removeAscent: PropTypes.func.isRequired,
  addAscent: PropTypes.func.isRequired,
  updateAscent: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: currentUser(state),
  formErrors: {},
  routes: state.routesStoreV2.routes,
});

const mapDispatchToProps = dispatch => ({
  addAscent: params => dispatch(addAscentAction(params)),
  removeAscent: id => dispatch(removeAscentAction(id)),
  updateAscent: (id, params) => dispatch(updateAscentAction(id, params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteAscents));
