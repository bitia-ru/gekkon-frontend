import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './SocialLinkButton.css';

export default class SocialLinkButton extends Component {
    render() {
        return <React.Fragment><a href={this.props.href ? this.props.href : null} onClick={this.props.onClick ? this.props.onClick : null} className={'social-links__link' + (this.props.dark ? ' social-links__link_dark' : '') + (this.props.active ? ' social-links__link_active' : '') + (this.props.withRemoveButton ? ' social-link__with_remove' : '') + (this.props.unactive ? ' social-link__with_remove_unactive' : '')}>
            <svg>
                <use xlinkHref={this.props.xlinkHref}></use>
            </svg>
        </a></React.Fragment>;
    }
}

SocialLinkButton.propTypes = {
    xlinkHref: PropTypes.string.isRequired
};
