import React, { Component } from 'react';
import PropTypes from 'prop-types';
import icons from '../../img/view-mode-switcher-sprite/view-mode-switcher-sprite.svg';
import './ModeButton.css';

const schemeIcon = `${icons}#toggle-track`;
const tableIcon = `${icons}#toggle-table`;
const listIcon = `${icons}#toggle-list`;

export default class ModeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  render() {
    const {
      onClick, mode, active, disabled, title,
    } = this.props;
    const { focused } = this.state;
    const icon = () => {
      switch (mode) {
      case 'scheme':
        return schemeIcon;
      case 'table':
        return tableIcon;
      case 'list':
        return listIcon;
      default:
        return null;
      }
    };
    return (<button
      type="button"
      className={
        `view-mode-switcher${
          active
            ? ' view-mode-switcher_active'
            : ''}`
      }
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      onMouseEnter={() => this.setState({ focused: true })}
      onMouseLeave={() => this.setState({ focused: false })}
      onFocus={() => this.setState({ focused: true })}
      onBlur={() => this.setState({ focused: false })}
      onClick={disabled ? null : onClick}
      title={title}
    >
      <svg style={(!disabled && focused) ? { fill: '#006CEB' } : {}}>
        <use
          xlinkHref={icon()}
        />
      </svg>
    </button>);
  }
}

ModeButton.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  mode: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

ModeButton.defaultProps = {
  title: '',
  active: false,
  disabled: false,
};
