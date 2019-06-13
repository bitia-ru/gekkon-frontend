import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import * as R             from 'ramda';
import './List.css';

export default class List extends Component {

    render() {
        let mapIndexed = R.addIndex(R.map);
        return <ul className="list">
            {mapIndexed((item, index) => <li key={index} style={{listStyleType: 'none'}}
                                             className={item.separator ? 'list-item-decor' : 'list-item'}>
                {
                    item.separator
                        ? ''
                        : (
                            <div onClick={item.clickable ? (() => this.props.onClick(item.id)) : null}
                                 className={item.clickable ? 'list-link list-link-clickable' : 'list-link'}
                                 style={{cursor: item.clickable ? 'pointer' : ''}}>
                              {
                                  item.svgSrc
                                    ? (
                                      <span className="list-icon">
											<svg aria-hidden="true">
												<use xlinkHref={item.svgSrc}></use>
											</svg>
										</span>
                                        )
                                        : ''
                                }{item[this.props.textFieldName]}
                            </div>
                        )
                }
            </li>, this.props.items)}
        </ul>;
    }
}

List.propTypes = {
    textFieldName: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
};
