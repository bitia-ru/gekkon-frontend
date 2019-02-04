import React          from 'react';
import CategoryFilter from './CategoryFilter';
import {CATEGORIES}   from '../Constants/Categories';
import * as R         from 'ramda';

class FromToCategoryFilter extends React.Component {

    onFromToCategoryChange = (event) => {
        let indexOfFrom = R.findIndex((c) => c === event.target.value)(CATEGORIES);
        let indexOfTo = R.findIndex((c) => c === this.props.categoryTo)(CATEGORIES);
        if (indexOfFrom <= indexOfTo) {
            this.props.onChange(event.target.value, null);
        } else {
            this.props.onChange(event.target.value, event.target.value);
        }
    };

    render() {
        return <React.Fragment>
            <span>c</span>
            <CategoryFilter onChange={this.onFromToCategoryChange}
                            category={this.props.categoryFrom} canSelectEmpty={false}/>
            <span>по</span>
            <CategoryFilter onChange={(event) => this.props.onChange(null, event.target.value)}
                            category={this.props.categoryTo}
                            categoryFrom={R.findIndex((c) => c === this.props.categoryFrom)(CATEGORIES)}
                            canSelectEmpty={false}/>
        </React.Fragment>
    }
}

export default FromToCategoryFilter;
