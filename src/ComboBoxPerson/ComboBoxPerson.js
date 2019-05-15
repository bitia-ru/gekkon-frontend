import React, {Component}          from 'react';
import PropTypes                   from 'prop-types';
import Person                      from '../Person/Person';
import * as R                      from 'ramda';
import {SEARCH_DELAY, GetUserName} from '../Constants/User';
import './ComboBoxPerson.css';

export default class ComboBoxPerson extends Component {
    constructor(props) {
        super(props);

        this.state = {
            droppedDown: false,
            users: null
        };
        this.lastSearchText = '';
        this.mouseOver = false;
    }

    selectItem = (user) => {
        this.setState({droppedDown: false});
        this.props.onSelect(R.clone(user));
    };

    onKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.updateUserList(this.value);
        }
    };

    searchInput = (event) => {
        let value = event.target.value;
        this.value = value;
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => this.updateUserList(value), SEARCH_DELAY);
    };

    updateUserList = (value) => {
        if (value === this.lastSearchText) {
            return
        }
        this.setState({
            users: R.filter((user) => {
                let name = GetUserName(user);
                return (name !== null && name.match(value) !== null)
            }, this.props.users)
        });
        this.lastSearchText = value;
    };

    onBlur = () => {
        if (!this.mouseOver) {
            this.setState({droppedDown: false})
        }
    };

    render() {
        let name = this.props.selectedUser ? GetUserName(this.props.selectedUser) : 'Неизвестный накрутчик';
        return <div className="combo-box__container"
                    onBlur={this.onBlur}
                    tabIndex={1}
                    onMouseLeave={() => this.mouseOver = false}
                    onMouseOver={() => this.mouseOver = true}>
            <button
                className="combo-box__select combo-box__select-transparent combo-box__select_small modal__link modal__link_edit"
                onClick={() => this.setState({droppedDown: !this.state.droppedDown})}>
                {name === null ? 'Неизвестный накрутчик' : name}
            </button>
            {this.state.droppedDown ?
                <div className="combo-box__dropdown modal__combo-box-drowdown combo-box__dropdown_active">
                    <div className="combo-box__search-wrapper">
                        <input type="text" placeholder="Поиск..." className="combo-box__search"
                               onChange={this.searchInput} onKeyPress={this.onKeyPress}/>
                    </div>
                    <div className="combo-box__dropdown-wrapper">
                        {R.map((user) => <li key={user.id} onClick={() => this.selectItem(user)}
                                             className="combo-box__dropdown-item combo-box__dropdown-item_padding-10">
                            <Person user={user}/>
                        </li>, (this.state.users === null ? R.filter((user) => GetUserName(user) !== null, this.props.users) : this.state.users))}
                    </div>
                </div> : ''}
        </div>;
    }
}

ComboBoxPerson.propTypes = {
    users: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
};
