import React, {Component} from 'react';
import PropTypes          from "prop-types";
import './ViewModeSwitcher.css';

export default class ViewModeSwitcher extends Component {
    render() {
        return <div className="content__toggle">
            <button
                className={'view-mode-switcher' + (this.props.viewMode === 'table' ? ' view-mode-switcher_active' : '')}
                onClick={() => this.props.onViewModeChange('table')}>
                <svg>
                    <use
                        xlinkHref="/public/view-mode-switcher-sprite/view-mode-switcher-sprite.svg#toggle-table"></use>
                </svg>
            </button>
            <button
                className={'view-mode-switcher' + (this.props.viewMode === 'list' ? ' view-mode-switcher_active' : '')}
                onClick={() => this.props.onViewModeChange('list')}>
                <svg>
                    <use
                        xlinkHref="/public/view-mode-switcher-sprite/view-mode-switcher-sprite.svg#toggle-list"></use>
                </svg>
            </button>
        </div>;
    }
}

ViewModeSwitcher.propTypes = {
    viewMode: PropTypes.string.isRequired,
    onViewModeChange: PropTypes.func.isRequired
};
