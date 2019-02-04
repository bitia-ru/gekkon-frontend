import React  from 'react';
import * as R from 'ramda';

const Select = (props) => (
    <select onChange={props.onChange} value={(props.value || props.value === 0) ? props.value : -1}>
        {(props.value || props.value === 0) ? <React.Fragment>{props.canSelectEmpty ? <option value={-1}></option> : ''}</React.Fragment> :
            <option disabled={!props.canSelectEmpty} value={-1}></option>}
        {props.allText ? <option value={0}>{props.allText}</option> : ''}
        {R.map((item) => {
            return <option key={typeof(item) === 'object' ? item[props.valueName] : item}
                           value={typeof(item) === 'object' ? item[props.valueName] : item}>{typeof(item) === 'object' ? item[props.textName] : item}</option>
        }, props.items)}
    </select>
);
export default Select;
