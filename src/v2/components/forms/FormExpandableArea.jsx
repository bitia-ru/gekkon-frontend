import React from 'react';
import PropTypes from 'prop-types';

import FormExpandableAreaLayout from './FormExpandableAreaLayout/FormExpandableAreaLayout';


class FormExpandableArea extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: null,
    };
  }

  currentlyExpanded = () => (
    this.state.expanded === null ? this.props.initiallyExpanded : this.state.expanded
  );

  render() {
    return (
      <FormExpandableAreaLayout
        expanded={this.currentlyExpanded()}
        onClick={() => this.setState({ expanded: !this.currentlyExpanded() })}
      >
        {this.props.children}
      </FormExpandableAreaLayout>
    );
  }
}

FormExpandableArea.propTypes = {
  initiallyExpanded: PropTypes.bool,
};

FormExpandableArea.defaultProps = {
  initiallyExpanded: false,
};


export default FormExpandableArea;
