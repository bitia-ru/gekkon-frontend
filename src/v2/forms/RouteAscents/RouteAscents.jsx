import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import RouteAscentsLayout from './RouteAscentsLayout';
import { ApiUrl } from '@/v1/Environ';
import {
  updateAscent as updateAscentAction,
  addAscent as addAscentAction,
} from '@/v1/stores/routes/utils';

const SAVE_REQUEST_DELAY = 3000;

class RouteAscents extends Component {
  constructor(props) {
    super(props);

    const ascent = this.getAscent();
    this.state = {
      details: ascent,
      ascent,
    };
    this.timerId = null;
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.save();
    }
  }

  save = () => {
    const { updateAscent } = this.props;
    const { ascent } = this.state;
    const { id } = this.getAscent();
    updateAscent(`${ApiUrl}/v1/ascents/${id}`, { ascent });
  };

  onAscentDateChanged = (id, date) => {
    const { ascent } = this.state;
    const history = R.clone(ascent.history);
    history[id].accomplished_at = date.format('YYYY-MM-DD');
    this.updateStateAscent(this.sortAscents(history));
  };

  removeAscent = (id) => {
    const { ascent } = this.state;
    const history = R.remove(id, 1, ascent.history);
    this.updateStateAscent(history);
  };

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  getAscent = () => {
    const { routes, user } = this.props;
    const route = routes[this.getRouteId()];
    return R.find(R.propEq('user_id', user.id), R.values(route.ascents));
  };

  ascentsForLayout = () => {
    const { ascent } = this.state;
    const mapIndexed = R.addIndex(R.map);
    return mapIndexed(
      (a, index) => (
        {
          id: index,
          success: a.result === 'success',
          accomplished_at: a.accomplished_at,
        }
      ),
      (ascent && ascent.history) || [],
    );
  };

  getResult = (history) => {
    if (history === null || history.length === 0) {
      return 'unsuccessful';
    }
    if (history[0].result === 'success') {
      return 'flash';
    }
    if (R.find(R.propEq('result', 'success'), history)) {
      return 'red_point';
    }
    return 'unsuccessful';
  };

  sortAscents = history => (
    R.sort(
      (a, b) => (moment(
        a.accomplished_at,
        'YYYY-MM-DD',
      ) - moment(
        b.accomplished_at,
        'YYYY-MM-DD',
      )),
      history,
    )
  );

  prepareAscentsHistory = (ascents) => {
    const { ascent } = this.state;
    let date;
    if (ascent && ascent.history && ascent.history.length > 0) {
      date = R.last(ascent.history).accomplished_at;
    } else {
      date = moment().format('YYYY-MM-DD');
    }
    return R.flatten(R.map(
      a => (
        R.repeat(
          {
            result: a.result,
            accomplished_at: date,
          },
          a.count,
        )
      ),
      ascents,
    ));
  };

  updateStateAscent = (history) => {
    this.setState({
      ascent: {
        result: this.getResult(history),
        history: (history === null || history.length === 0) ? null : history,
      },
    });
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.save, SAVE_REQUEST_DELAY);
  };

  onAddAscents = (ascents, afterAscentsAdded) => {
    const { ascent } = this.state;
    if (ascent) {
      const history = R.concat(ascent.history || [], this.prepareAscentsHistory(ascents));
      this.updateStateAscent(history);
    } else {
      const { user, addAscent, history: historyProp } = this.props;
      let params;
      if (ascents.length > 1) {
        const lookup = {
          red_point: 'success',
          flash: 'success',
          unsuccessful: 'attempt',
        };
        const ascentsNew = R.map(
          a => (
            {
              result: lookup[a.result],
              count: a.count,
            }
          ),
          ascents,
        );
        const history = this.prepareAscentsHistory(ascentsNew);
        params = {
          ascent: {
            history,
            result: this.getResult(history),
            user_id: user.id,
            route_id: this.getRouteId(),
          },
        };
      } else {
        params = {
          ascent: {
            result: ascents[0].result,
            user_id: user.id,
            route_id: this.getRouteId(),
          },
        };
      }
      addAscent(params);
      historyProp.goBack();
    }

    if (afterAscentsAdded) {
      afterAscentsAdded();
    }
  };

  render() {
    const { details, ascent } = this.state;
    const ascentsHistory = this.ascentsForLayout();
    return (
      <Modal maxWidth="400px">
        <RouteAscentsLayout
          title="Добавление пролаза"
          initialWithFlash={!ascent}
          instantMode={ascent}
          blameCategory={false}
          ascents={ascentsHistory}
          onClick={this.onClick}
          details={{
            show: details,
          }}
          onAddAscents={this.onAddAscents}
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
  addAscent: PropTypes.func.isRequired,
  updateAscent: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: currentUser(state),
  formErrors: {},
  routes: state.routesStore.routes,
});

const mapDispatchToProps = dispatch => ({
  addAscent: params => dispatch(addAscentAction(params)),
  updateAscent: (url, params) => dispatch(updateAscentAction(url, params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteAscents));
