import React from 'react';
import SpotsCardViewLayout from './SpotsCardViewLayout';


class SpotsCardView extends React.PureComponent {
  render() {
    return (
      <SpotsCardViewLayout
        {...this.props.style ? { style: this.props.style } : {}}
        spots={this.props.spots}
        onSpotClicked={this.props.onSpotClicked}
      />
    );
  }
}

export default SpotsCardView;
