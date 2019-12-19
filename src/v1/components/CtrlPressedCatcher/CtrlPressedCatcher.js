import React, { Component } from 'react';
import CtrlPressedContext from '../../contexts/CtrlPressedContext';

class CtrlPressedCatcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ctrlPressed: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (event) => {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: true });
    }
  };

  onKeyUp = (event) => {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: false });
    }
  };

  render() {
    const { children } = this.props;
    const { ctrlPressed } = this.state;
    return (
      <CtrlPressedContext.Provider value={{ ctrlPressed }}>
        {children}
      </CtrlPressedContext.Provider>
    );
  }
}

export default CtrlPressedCatcher;
