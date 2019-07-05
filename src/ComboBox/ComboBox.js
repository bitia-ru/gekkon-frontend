import React, {Component} from 'react';
import * as R             from 'ramda';
import PropTypes          from 'prop-types';
import List               from '../List/List';
import './ComboBox.css';

export default class ComboBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            droppedDown: false
        }
    }

    selectItem = (id) => {
        const {multipleSelect, onChange} = this.props;
        if (!multipleSelect) {
            this.setState({droppedDown: false});
        }
        onChange(id);
    };

    render() {
        const {
                  tabIndex, currentValue, currentId, items, textFieldName, style, size,
              } = this.props;
        const {droppedDown} = this.state;
        return <div className="combo-box__container" onBlur={() => this.setState({droppedDown: false})}
                    tabIndex={tabIndex}>
            <div
                className={'combo-box__select' + (droppedDown ? ' combo-box__select_active' : '') + (style === 'transparent' ? ' combo-box__select-transparent' : '') + (size === 'small' ? ' combo-box__select_small' : '')}
                onClick={() => this.setState({droppedDown: !droppedDown})}>
                {
                    currentValue !== null
                        ? currentValue
                        : (
                            R.find(R.propEq('id', currentId))(items)[textFieldName]
                        )
                }
            </div>
            {
                droppedDown
                    ? (
                        <div className="combo-box__dropdown">
                            <List items={items}
                                  onClick={this.selectItem}
                                  textFieldName={textFieldName}
                            />
                        </div>
                    )
                    : ''
            }
        </div>;
    }
}

ComboBox.propTypes = {
    multipleSelect: PropTypes.bool,
    currentValue: PropTypes.string,
    currentId: PropTypes.number,
    style: PropTypes.string,
    size: PropTypes.string,
    tabIndex: PropTypes.number,
    textFieldName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
};

ComboBox.defaultProps = {
    multipleSelect: false,
    currentValue: null,
    currentId: null,
    style: null,
    size: null,
    tabIndex: null,
};
