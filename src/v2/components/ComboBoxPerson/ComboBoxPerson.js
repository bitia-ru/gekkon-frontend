import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Person from '../../../v1/components/Person/Person';
import { SEARCH_DELAY, GetUserName } from '../../../v1/Constants/User';
import { css } from '../../aphrodite';
import styles from './styles';

export default class ComboBoxPerson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
      users: null,
    };
    this.lastSearchText = '';
    this.mouseOver = false;
  }

    selectItem = (user) => {
      const { onSelect } = this.props;
      this.setState({ droppedDown: false });
      onSelect(R.clone(user));
    };

    onKeyPress = (event) => {
      if (event.key === 'Enter') {
        this.updateUserList(this.value);
      }
    };

    searchInput = (event) => {
      const { value } = event.target;
      this.value = value;
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => this.updateUserList(value), SEARCH_DELAY);
    };

    updateUserList = (value) => {
      const { users } = this.props;
      if (value === this.lastSearchText) {
        return;
      }
      this.setState({
        users: R.filter((user) => {
          const name = GetUserName(user);
          return (name !== null && name.match(value) !== null);
        }, users),
      });
      this.lastSearchText = value;
    };

    onBlur = () => {
      if (!this.mouseOver) {
        this.setState({ droppedDown: false });
      }
    };

    render() {
      const { selectedUser, users: usersProp } = this.props;
      const { users, droppedDown } = this.state;
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
          onMouseLeave={() => {
            this.mouseOver = false;
          }}
          onMouseOver={() => {
            this.mouseOver = true;
          }}
        >
          <button
            className={css(styles.comboBoxButton)}
            type="button"
            onClick={() => this.setState({ droppedDown: !droppedDown })}
          >
            {name === null ? 'Неизвестный накрутчик' : name}
          </button>
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
                      className={css(styles.comboBoxSearch)}
                      onChange={this.searchInput}
                      onKeyPress={this.onKeyPress}
                    />
                  </div>
                  <div className={css(styles.comboBoxDropdownWrapper)}>
                    {
                      R.map(
                        user => (
                          <li
                            key={user.id}
                            onClick={() => this.selectItem(user)}
                            className={css(styles.comboBoxDropdownItem)}
                          >
                            <Person user={user} />
                          </li>
                        ),
                        filteredUsers,
                      )
                    }
                  </div>
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
