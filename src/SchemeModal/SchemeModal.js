import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Scheme from '../Scheme/Scheme';
import CloseButton from '../CloseButton/CloseButton';
import BackButton from '../BackButton/BackButton';
import './SchemeModal.css';

export default class SchemeModal extends Component {
  constructor(props) {
    super(props);

    const { currentRoute } = this.props;
    this.state = {
      currentRoute: R.clone(currentRoute),
    };
  }

  onMouseDown = (event) => {
    if (event.nativeEvent.which === 1) {
      const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
      const { currentRoute } = this.state;
      currentRoute.data.position = {
        left: (event.pageX - schemeContainerRect.x) / schemeContainerRect.width * 100,
        top: (event.pageY - schemeContainerRect.y) / schemeContainerRect.height * 100,
      };
      this.setState({ currentRoute });
    }
  };

  close = () => {
    const { close, currentRoute: currentRouteProp } = this.props;
    this.setState({ currentRoute: currentRouteProp });
    close();
  };

  render() {
    const {
      save,
      diagram,
      editable,
    } = this.props;
    const { currentRoute } = this.state;
    return (
      <>
        <div className="modal__back">
          <BackButton onClick={() => save(currentRoute.data.position)} />
        </div>
        <div
          role="button"
          tabIndex={0}
          style={{ outline: 'none' }}
          className="modal__hall-scheme"
          ref={(ref) => {
            this.schemeContainerRef = ref;
          }}
          onMouseDown={editable ? this.onMouseDown : null}
        >
          <Scheme
            routes={[currentRoute]}
            showCards={false}
            diagram={diagram}
          />
        </div>
      </>
    );
  }
}

SchemeModal.propTypes = {
  diagram: PropTypes.string,
  editable: PropTypes.bool,
  currentRoute: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};
