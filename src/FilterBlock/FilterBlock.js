import React, {Component} from 'react';
import ViewModeSwitcher   from '../ViewModeSwitcher/ViewModeSwitcher';
import ComboBox           from "../ComboBox/ComboBox";
import PropTypes          from 'prop-types';
import {CATEGORIES}       from '../Constants/Categories';
import {PERIOD_FILTERS}   from '../Constants/PeriodFilters';
import {RESULT_FILTERS}   from '../Constants/ResultFilters';
import * as R             from 'ramda';
import './FilterBlock.css';

import {CategoriesData} from "../data";

export default class FilterBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryId: 0,
            periodId: 0,
            resultFilters: []
        }
    }

    componentDidMount() {
        let resultFilters = R.map((e) => R.merge(e, {
            'selected': R.find((r) => r === e.value, this.props.result) !== undefined,
            'text': `${e.text}${R.find((r) => r === e.value, this.props.result) !== undefined ? ' ✓' : ''}`
        }), RESULT_FILTERS);
        this.setState({periodId: this.props.period, resultFilters: resultFilters});
    }

    onCategoryChange = (id) => {
        this.setState({categoryId: id});
        switch (id) {
            case 0:
                this.props.changeCategoryFilter(CATEGORIES[0], CATEGORIES[CATEGORIES.length - 1]);
                break;
            case 1:
                this.props.changeCategoryFilter(CATEGORIES[0], '6a+');
                break;
            case 2:
                this.props.changeCategoryFilter(CATEGORIES[0], '6c+');
                break;
            case 3:
                this.props.changeCategoryFilter('7a', CATEGORIES[CATEGORIES.length - 1]);
                break;
        }
    };

    onPeriodChange = (id) => {
        this.setState({periodId: id});
        this.props.changePeriodFilter(id);
    };

    onResultChange = (id) => {
        let resultFilters = R.clone(this.state.resultFilters);
        let index = R.findIndex((e) => e.id === id, resultFilters);
        if (resultFilters[index].selected) {
            resultFilters[index].text = R.slice(0, -2, resultFilters[index].text);
        } else {
            resultFilters[index].text = `${resultFilters[index].text} ✓`
        }
        resultFilters[index].selected = !resultFilters[index].selected;
        this.setState({resultFilters: resultFilters});
        this.props.changeResultFilter(R.map((e) => e.value, R.filter((e) => e.selected, resultFilters)));
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
            {this.props.user ? <div className="content__filter-item content__filter-item_result">
                <div>
                    <span className="filter-block__title">Пройденность</span>
                    <ComboBox tabIndex={3}
                              onChange={this.onResultChange}
                              multipleSelect={true}
                              currentValue={R.join(', ', R.map((e) => R.slice(0, -2, e.text), R.filter((e) => e.selected, this.state.resultFilters)))}
                              textFieldName='text'
                              items={this.state.resultFilters}/>
                </div>
            </div> : ''}
            <ViewModeSwitcher onViewModeChange={this.props.onViewModeChange}
                              viewMode={this.props.viewMode}/>
        </div>;
    }
}

FilterBlock.propTypes = {
    viewMode: PropTypes.string.isRequired,
    onViewModeChange: PropTypes.func.isRequired,
    period: PropTypes.number.isRequired,
    result: PropTypes.array.isRequired,
    changeCategoryFilter: PropTypes.func.isRequired,
    changePeriodFilter: PropTypes.func.isRequired,
    changeResultFilter: PropTypes.func.isRequired
};
