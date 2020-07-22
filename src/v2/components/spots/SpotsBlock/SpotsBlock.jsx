import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import SpotsBlockLayout from './SpotsBlockLayout';
import { loadSpots as loadSpotsAction } from '../../../redux/spots/actions';


class SpotsBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: 'list',
    };
  }

  componentDidMount() {
    this.props.loadSpots();
  }

  render() {
    const self = this;

    return (
      <SpotsBlockLayout
        spots={
          R.filter(
            spot => spot.data && spot.data.public,
          )(Object.values(this.props.spots))
        }
        viewMode={{
          value: this.state.viewMode,
          onChange(viewMode) {
            self.setState({ viewMode });
          },
        }}
        onSpotClicked={
          (spot_id) => {
            this.props.history.push(
              `/spots/${spot_id}/sectors/${this.props.spots[spot_id].sectors[0].id}`,
            );
          }
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  spots: state.spotsStoreV2,
});

const mapDispatchToProps = dispatch => ({
  loadSpots: () => dispatch(loadSpotsAction()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsBlock));
