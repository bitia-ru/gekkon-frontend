import React, {Component} from 'react';
import ViewModeSwitcher   from '../ViewModeSwitcher/ViewModeSwitcher';
import ComboBox           from "../ComboBox/ComboBox";
import PropTypes          from 'prop-types';
import {CATEGORIES}       from '../Constants/Categories';
import {PERIOD_FILTERS}   from '../Constants/PeriodFilters';
import './FilterBlock.css';

import {CategoriesData} from "../data";

export default class FilterBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryId: 0,
            periodId: 0
        }
    }

    componentDidMount() {
        this.setState({periodId: this.props.period});
    }

    onCategoryChange = (id) => {
        this.setState({categoryId: id});
        switch (id) {
            case 0:
                this.props.changeCategoryFilter(CATEGORIES[0], CATEGORIES[CATEGORIES.length - 1]);
                break;
            case 1:
                this.props.changeCategoryFilter(CATEGORIES[0], CATEGORIES[31]);
                break;
            case 2:
                this.props.changeCategoryFilter(CATEGORIES[0], CATEGORIES[35]);
                break;
            case 3:
                this.props.changeCategoryFilter(CATEGORIES[36], CATEGORIES[CATEGORIES.length - 1]);
                break;
        }
    };

    onPeriodChange = (id) => {
        this.setState({periodId: id});
        this.props.changePeriodFilter(id);
    };

    render() {
        return <div className="content__filter">
            <div className="content__filter-item content__filter-item_category">
                <div>
                    <span className="filter-block__title">Категория</span>
                    <ComboBox tabIndex={1}
                              onChange={this.onCategoryChange}
                              currentId={this.state.categoryId}
                              textFieldName='title'
                              items={CategoriesData}/>
                </div>
            </div>
            <div className="content__filter-item content__filter-item_period">
                <div>
                    <span className="filter-block__title">Период</span>
                    <ComboBox tabIndex={2}
                              onChange={this.onPeriodChange}
                              currentId={this.state.periodId}
                              textFieldName='text'
                              items={PERIOD_FILTERS}/>
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
    period: PropTypes.number.isRequired,
    changeCategoryFilter: PropTypes.func.isRequired,
    changePeriodFilter: PropTypes.func.isRequired
};
