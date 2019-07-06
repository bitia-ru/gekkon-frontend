import React     from 'react';
import PropTypes from "prop-types";
import './ViewModeSwitcher.css';

const tableIcon = "/public/img/view-mode-switcher-sprite/view-mode-switcher-sprite.svg#toggle-table";
const listIcon = "/public/img/view-mode-switcher-sprite/view-mode-switcher-sprite.svg#toggle-list";

const ViewModeSwitcher = ({
                              viewMode, onViewModeChange,
                          }) => (
    <div className="content__toggle">
        <button
            type="button"
            className={
                'view-mode-switcher' + (
                    viewMode === 'table'
                        ? ' view-mode-switcher_active'
                        : ''
                )
            }
            onClick={() => onViewModeChange('table')}>
            <svg>
                <use
                    xlinkHref={tableIcon}></use>
            </svg>
        </button>
        <button
            type="button"
            className={
                'view-mode-switcher' + (
                    viewMode === 'list'
                        ? ' view-mode-switcher_active'
                        : ''
                )
            }
            onClick={() => onViewModeChange('list')}>
            <svg>
                <use
                    xlinkHref={listIcon}></use>
            </svg>
        </button>
    </div>
);

ViewModeSwitcher.propTypes = {
    viewMode: PropTypes.string.isRequired,
    onViewModeChange: PropTypes.func.isRequired
};

export default ViewModeSwitcher;
