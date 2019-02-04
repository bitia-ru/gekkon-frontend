import React        from 'react';
import Select       from './Select';
import {CATEGORIES} from '../Constants/Categories';
import * as R       from 'ramda';

const CategoryFilter = (props) => (
    <Select items={R.slice(props.categoryFrom ? props.categoryFrom : 0, Infinity, CATEGORIES)}
            onChange={props.onChange}
            canSelectEmpty={props.canSelectEmpty} value={props.category}/>
);
export default CategoryFilter;
