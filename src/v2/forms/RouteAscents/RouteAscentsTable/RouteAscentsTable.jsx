import React from 'react';
import RouteAscentsTableLayout from './RouteAscentsTableLayout';


class RouteAscentsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dateChangingAscentId: null,
    };
  }

  render() {
    const { ascents, onRemoveAscent, onAscentDateChanged } = this.props;

    return (
      <RouteAscentsTableLayout
        onRemoveClicked={(ascentId) => { onRemoveAscent && onRemoveAscent(ascentId); }}
        onDateClicked={(ascentId) => { this.setState({ dateChangingAscentId: ascentId }); }}
        onDateSelected={
          (ascentId, newDate) => {
            onAscentDateChanged && onAscentDateChanged(ascentId, newDate);
            this.setState({ dateChangingAscentId: null });
          }
        }
        ascents={ascents}
        dateChangingAscentId={this.state.dateChangingAscentId}
      />
    );
  }
}

export default RouteAscentsTable;
