import React from 'react';
import SpotsMapViewLayout from './SpotsMapViewLayout';


class SpotsMapView extends React.PureComponent {
  render() {
    return (
      <SpotsMapViewLayout
        {...this.props.style ? { style: this.props.style } : {}}
        spots={this.props.spots}
        onSpotClicked={this.props.onSpotClicked}
      />
    );
  }
}

export default SpotsMapView;
