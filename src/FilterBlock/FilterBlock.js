import React, {Component} from 'react';
import ViewModeSwitcher   from '../ViewModeSwitcher/ViewModeSwitcher';
import ComboBox           from "../ComboBox/ComboBox";
import PropTypes          from 'prop-types';
import {PERIOD_FILTERS}   from '../Constants/PeriodFilters';
import {CATEGORIES_ITEMS} from '../Constants/Categories'
import * as R             from 'ramda';
import './FilterBlock.css';

export default class FilterBlock extends Component {

    render() {
        return <div className="content__filter">
            <div className="content__filter-item content__filter-item_category">
                <div>
                    <span className="filter-block__title">Категория</span>
                    <ComboBox tabIndex={1}
                              onChange={this.props.onCategoryChange}
                              currentId={this.props.categoryId}
                              textFieldName='title'
                              items={CATEGORIES_ITEMS}/>
                </div>
            </div>
            <div className="content__filter-item content__filter-item_period">
                <div>
                    <span className="filter-block__title">Период</span>
                    <ComboBox tabIndex={2}
                              onChange={this.props.changePeriodFilter}
                              currentId={this.props.period}
                              textFieldName='text'
                              items={PERIOD_FILTERS}/>
                </div>
            </div>
            <div className="content__filter-item content__filter-item_result">
                <div>
                    <span className="filter-block__title">Фильтры</span>
                    <ComboBox tabIndex={3}
                              onChange={this.props.onFilterChange}
                              multipleSelect={true}
                              currentValue={R.join(', ', R.map((e) => R.slice(0, -2, e.text), R.filter((e) => e.selected, this.props.filters)))}
                              textFieldName='text'
                              items={this.props.filters}/>
                </div>
            </div>
            <ViewModeSwitcher onViewModeChange={this.props.onViewModeChange}
                              viewMode={this.props.viewMode}/>
        </div>;
    }
}

FilterBlock.propTypes = {
    viewMode: PropTypes.string.isRequired,
    onViewModeChange: PropTypes.func.isRequired,
    categoryId: PropTypes.number.isRequired,
    period: PropTypes.number.isRequired,
    filters: PropTypes.array.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    changePeriodFilter: PropTypes.func.isRequired,
    onCategoryChange: PropTypes.func.isRequired
};
