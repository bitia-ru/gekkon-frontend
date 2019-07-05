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
        const {onSelect} = this.props;
        this.setState({droppedDown: false});
        onSelect(R.clone(user));
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
        const {users} = this.props;
        if (value === this.lastSearchText) {
            return
        }
        this.setState({
            users: R.filter((user) => {
                let name = GetUserName(user);
                return (name !== null && name.match(value) !== null)
            }, users)
        });
        this.lastSearchText = value;
    };

    onBlur = () => {
        if (!this.mouseOver) {
            this.setState({droppedDown: false})
        }
    };

    render() {
        const {selectedUser, users: usersProp} = this.props;
        const {users, droppedDown} = this.state;
        let name = selectedUser ? GetUserName(selectedUser) : 'Неизвестный накрутчик';
        return <div className="combo-box__container"
                    onBlur={this.onBlur}
                    tabIndex={1}
                    onMouseLeave={() => this.mouseOver = false}
                    onMouseOver={() => this.mouseOver = true}>
            <button
                className="combo-box__select combo-box__select-transparent combo-box__select_small modal__link modal__link_edit"
                onClick={() => this.setState({droppedDown: !droppedDown})}>
                {name === null ? 'Неизвестный накрутчик' : name}
            </button>
            {
                droppedDown
                    ? (
                        <div className="combo-box__dropdown modal__combo-box-drowdown combo-box__dropdown_active">
                            <div className="combo-box__search-wrapper">
                                <input type="text" placeholder="Поиск..." className="combo-box__search"
                                       onChange={this.searchInput} onKeyPress={this.onKeyPress}/>
                            </div>
                            <div className="combo-box__dropdown-wrapper">
                                {R.map((user) => <li key={user.id} onClick={() => this.selectItem(user)}
                                                     className="combo-box__dropdown-item combo-box__dropdown-item_padding-10">
                                    <Person user={user}/>
                                </li>, (users === null ? R.filter((user) => GetUserName(user) !== null, usersProp) : users))}
                            </div>
                        </div>
                    )
                    : ''
            }
        </div>;
    }
}

ComboBoxPerson.propTypes = {
    selectedUser: PropTypes.object,
    users: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

ComboBoxPerson.defaultProps = {
    selectedUser: null,
};
