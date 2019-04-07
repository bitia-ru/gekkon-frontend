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
        this.setState({droppedDown: false});
        this.props.onChange(id);
    };

    render() {
        return <div className="combo-box__container" onBlur={() => this.setState({droppedDown: false})}
                    tabIndex={this.props.tabIndex}>
            <div
                className={'combo-box__select' + (this.state.droppedDown ? ' combo-box__select_active' : '') + (this.props.style === 'transparent' ? ' combo-box__select-transparent' : '') + (this.props.size === 'small' ? ' combo-box__select_small' : '')}
                onClick={() => this.setState({droppedDown: !this.state.droppedDown})}>
                {(R.find(R.propEq('id', this.props.currentId))(this.props.items))[this.props.textFieldName]}
            </div>
            {this.state.droppedDown ?
                <div className="combo-box__dropdown"><List items={this.props.items} onClick={this.selectItem}
                                                           textFieldName={this.props.textFieldName}/>
                </div> : ''}
        </div>;
    }
}

ComboBox.propTypes = {
    textFieldName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    currentId: PropTypes.number.isRequired
};
