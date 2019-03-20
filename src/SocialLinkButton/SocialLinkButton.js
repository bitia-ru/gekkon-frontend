import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './SocialLinkButton.css';

export default class SocialLinkButton extends Component {
    render() {
        return <a href={this.props.href}
                  className={'social-links__link' + (this.props.dark ? ' social-links__link_dark' : '') + (this.props.withRemoveButton ? ' social-link__with_remove' : '') + (this.props.unactive ? ' social-link__with_remove_unactive' : '')}>
            <svg>
                <use xlinkHref={this.props.xlinkHref}></use>
            </svg>
        </a>;
    }
}

SocialLinkButton.propTypes = {
    href: PropTypes.string.isRequired,
    xlinkHref: PropTypes.string.isRequired
};
