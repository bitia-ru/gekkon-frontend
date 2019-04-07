import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './StickyBar.css';

export default class StickyBar extends Component {
    render() {
        return <div className="sticky-bar">
            <div className="wrapper">
                {this.props.content}
            </div>

            <div className="sticky-bar__item">
                <div style={(this.props.loading ? {} : (this.props.hideLoaded ? {opacity: 0} : {}))} className={'sticky-bar__item-indicator' + (this.props.loading ? ' sticky-bar__item-indicator_active' : '')}></div>
            </div>
        </div>;
    }
}

StickyBar.propTypes = {
    loading: PropTypes.bool.isRequired
};
