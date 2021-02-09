import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Person from '../../../v1/components/Person/Person';
import { SEARCH_DELAY, GetUserName } from '../../../v1/Constants/User';
import { css } from '../../aphrodite';
import styles from './styles';

const mapIndexed = R.addIndex(R.map);

export default class ComboBoxPerson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
      users: null,
      selectedItemId: undefined,
    };
    this.lastSearchText = '';
    this.mouseOver = false;
    this.listRef = {};
  }

    selectItem = (user) => {
      const { onSelect } = this.props;
      this.setState({ droppedDown: false });
      onSelect(R.clone(user));
    };

    scrollToCurrentSelectedItem = () => {
      if (!this.state.selectedItemId) { return; }
      this.listRef[this.state.selectedItemId].scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    onKeyPress = (event) => {
      if (event.key === 'Enter') {
        this.updateUserList(this.value);
      }
      event.stopPropagation();
    };

    onKeyDown = (event) => {
      const { users: usersProp } = this.props;
      const { users, selectedItemId } = this.state;
      const filteredUsers = (
        users === null
          ? R.filter(user => GetUserName(user) !== null, usersProp)
          : users
      );

      if (event.key === 'Enter') {
        this.selectItem(R.find(R.propEq('id', selectedItemId))(filteredUsers));
      }

      const listLength = R.keys(filteredUsers).length;
      const selectedItem = R.findIndex(R.propEq('id', selectedItemId))(filteredUsers);
      const newSelectedItem = {
        ArrowUp: R.max(0, selectedItem - 1),
        ArrowDown: R.min(listLength - 1, selectedItem + 1),
      }[event.key];
      if (newSelectedItem === undefined) { return; }

      event.preventDefault();
      this.setState(
        state => {
          const index = state.selectedItemId !== undefined ? newSelectedItem : 0;
          return {
            selectedItemId: filteredUsers[index].id,
          }
        },
        this.scrollToCurrentSelectedItem,
      );
    };

    searchInput = (event) => {
      const { value } = event.target;
      this.value = value;
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => this.updateUserList(value), SEARCH_DELAY);
    };

    updateUserList = (value, afterUpdate) => {
      const { users } = this.props;
      if (value === this.lastSearchText) {
        afterUpdate();
        return;
      }
      this.setState({
        users: R.filter((user) => {
          const name = GetUserName(user);
          return (name !== null && name.toLowerCase().match(value.toLowerCase()) !== null);
        }, users),
      }, afterUpdate);
      this.lastSearchText = value;
    };

    onBlur = () => {
      if (!this.mouseOver) {
        this.setState({ droppedDown: false });
      }
    };

    dropDown = () => {
      const { selectedUser } = this.props;
      this.setState(
        {
          droppedDown: !this.state.droppedDown,
          selectedItemId: (
            selectedUser
              ? selectedUser.id
              : undefined
          ),
        },
        () => {
          if (this.state.droppedDown) {
            this.updateUserList('', this.scrollToCurrentSelectedItem);
          }
        },
      );
    };

    render() {
      const { selectedUser, users: usersProp } = this.props;
      const { users, droppedDown, selectedItemId } = this.state;
      const filteredUsers = (
        users === null
          ? R.filter(user => GetUserName(user) !== null, usersProp)
          : users
      );
      const name = selectedUser ? GetUserName(selectedUser) : 'Неизвестный накрутчик';
      return (
        <div
          className={css(styles.comboBoxContainer)}
          onBlur={this.onBlur}
          tabIndex={1}
          onClick={this.dropDown}
          onKeyDown={this.onKeyDown}
          onMouseLeave={() => {
            this.mouseOver = false;
          }}
          onMouseOver={() => {
            this.mouseOver = true;
          }}
        >
          <div
            className={css(styles.comboBoxButton)}
            type="button"
          >
            {name === null ? 'Неизвестный накрутчик' : name}
          </div>
          {
            droppedDown
              ? (
                <div
                  className={css(styles.comboBoxDropdown)}
                >
                  <div className={css(styles.comboBoxSearchWrapper)}>
                    <input
                      type="text"
                      placeholder="Поиск..."
                      autoFocus
                      className={css(styles.comboBoxSearch)}
                      onChange={this.searchInput}
                      onKeyPress={this.onKeyPress}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className={css(styles.comboBoxDropdownWrapper)}>
                    {
                      mapIndexed(
                        (user, index) => (
                          <li
                            key={`author-${user.id}`}
                            data-author={'author'}
                            onClick={() => this.selectItem(user)}
                            ref={(ref) => { this.listRef[user.id] = ref; }}
                            className={
                              css(
                                styles.comboBoxDropdownItem,
                                selectedItemId === user.id && styles.comboBoxDropdownItemSelected,
                              )
                            }
                          >
                            <Person user={user} />
                          </li>
                        ),
                        filteredUsers,
                      )
                    }
                  </div>
                  <button
                    type="button"
                    onClick={() => this.selectItem(null)}
                    className={css(styles.clearButton)}
                  >
                    Сбросить
                  </button>
                </div>
              )
              : ''
            }
          </div>
      );
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
