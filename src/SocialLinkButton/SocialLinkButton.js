import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SocialLinkButton.css';

export default class SocialLinkButton extends Component {
  render() {
    const aClassNames = classNames({
      'social-links__link': true,
      'social-links__link_dark': this.props.dark,
      'social-links__link_active': this.props.active,
      'social-link__with_remove': this.props.withRemoveButton,
      'social-link__with_remove_unactive': this.props.unactive,
    });

    return (
      <React.Fragment>
        <a
          href={this.props.href}
          onClick={this.props.onClick}
          className={aClassNames}
        >
          <svg>
            <use xlinkHref={this.props.xlinkHref} />
          </svg>
        </a>
      </React.Fragment>
    );
  }
}

SocialLinkButton.propTypes = {
  href: PropTypes.string,
  dark: PropTypes.bool,
  active: PropTypes.bool,
  unactive: PropTypes.bool,
  onClick: PropTypes.func,
  withRemoveButton: PropTypes.bool,
  xlinkHref: PropTypes.string.isRequired,
};

SocialLinkButton.defaultProps = {
  href: null,
  dark: false,
  active: false,
  unactive: false,
  onClick: null,
  withRemoveButton: false,
};
