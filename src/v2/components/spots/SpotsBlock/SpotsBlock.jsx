import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import SpotsBlockLayout from './SpotsBlockLayout';
import { loadSpots as loadSpotsAction } from '../../../redux/spots/actions';

const sortSpotsByActivity = (spot1, spot2) => {
  const activity1 = (
    spot1?.data?.statistics?.activity === undefined ? (
      spot1?.statistics?.activity
    ) : (
      spot1?.data?.statistics?.activity
    )
  );

  const activity2 = (
    spot2?.data?.statistics?.activity === undefined ? (
      spot2?.statistics?.activity
    ) : (
      spot2?.data.statistics?.activity
    )
  );

  if (activity1 === undefined) return +1;
  if (activity2 === undefined) return -1;

  return activity2 - activity1;
};

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

    const spots = R.values(this.props.spots);
    return (
      <SpotsBlockLayout
        spots={
          R.filter(
            spot => spot.data && spot.data.public,
          )(R.sort(sortSpotsByActivity, spots))
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
