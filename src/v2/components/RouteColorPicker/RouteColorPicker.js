import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { getColorStyle } from '@/v1/Constants/Route';
import { css } from '../../aphrodite';
import styles from './styles';

const mapIndexed = R.addIndex(R.map);

export default class RouteColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
      selectedItem: undefined,
    };
    this.mouseOver = false;
    this.listRef = {};
  }

    selectItem = (routeMarkColor) => {
      const { onSelect } = this.props;
      this.setState({ droppedDown: false });
      onSelect(routeMarkColor);
    };

    onBlur = () => {
      if (!this.mouseOver) {
        this.setState({ droppedDown: false });
      }
    };

    removeColor = () => {
      const { onSelect } = this.props;
      onSelect(null);
    };

    scrollToCurrentSelectedItem = () => {
      const { selectedItem } = this.state;

      this.listRef[selectedItem || 0].scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    onKeyDown = (event) => {
      const { selectedItem } = this.state;
      const { routeMarkColors } = this.props;

      if (event.key === 'Enter') {
        this.selectItem(routeMarkColors[selectedItem]);
      }

      const listLength = R.keys(routeMarkColors).length;
      const newSelectedItem = {
        ArrowUp: R.max(0, selectedItem - 1),
        ArrowDown: R.min(listLength - 1, selectedItem + 1),
      }[event.key];
      if (newSelectedItem === undefined) { return; }

      event.preventDefault();
      this.setState(
        state => ({ selectedItem: state.selectedItem !== undefined ? newSelectedItem : 0 }),
        this.scrollToCurrentSelectedItem,
      );
    };

    dropDown = () => {
      const { route, fieldName, routeMarkColors, editable } = this.props;
      if (editable) {
        this.setState(
          {
            droppedDown: !this.state.droppedDown,
            selectedItem: (
              route[fieldName]
                ? R.findIndex(R.propEq('id', route[fieldName].id))(routeMarkColors)
                : undefined
            ),
          },
          () => {
            if (this.state.droppedDown) {
              this.scrollToCurrentSelectedItem();
            }
          },
        );
      }
    };

    render() {
      const { route, fieldName, routeMarkColors, editable } = this.props;
      const { droppedDown, selectedItem } = this.state;
      return (
        <div
          className={css(styles.markColorPickerWrap)}
          role="button"
          onClick={this.dropDown}
          onBlur={this.onBlur}
          tabIndex={1}
          onMouseLeave={() => {
            this.mouseOver = false;
          }}
          onMouseOver={() => {
            this.mouseOver = true;
          }}
          onKeyDown={this.onKeyDown}
        >
          <div className={css(styles.markColorPickerInfo)}>
            <div
              className={css(styles.markColorPickerColor)}
              style={getColorStyle(route[fieldName])}
            />
          </div>
          <div className={css(styles.markColorPickerName)}>
            {
              route[fieldName]
                ? route[fieldName].name
                : 'не задан'
            }
          </div>
          {
            editable && (
              <div
                className={
                  css(
                    styles.comboBoxDropdown,
                    styles.comboBoxDropdownActive,
                    !droppedDown && styles.comboBoxDropdownHidden,
                  )
                }
              >
                <div className={css(styles.comboBoxDropdownWrapper)}>
                  {
                    mapIndexed(
                      (routeMarkColor, index) => (
                        <li
                          key={routeMarkColor.id}
                          ref={(ref) => { this.listRef[index] = ref; }}
                          onClick={() => this.selectItem(routeMarkColor)}
                          className={
                            css(
                              styles.comboBoxDropdownItem,
                              styles.comboBoxDropdownItemPadding10,
                              index === selectedItem && styles.comboBoxDropdownItemSelected,
                            )
                          }
                        >
                          <div className={css(styles.markColorPickerItem)}>
                            <div
                              className={css(styles.markColorPickerColor)}
                              style={getColorStyle(routeMarkColor)}
                            />
                            <div className={css(styles.markColorPickerItemText)}>
                              {routeMarkColor.name}
                            </div>
                          </div>
                        </li>
                      ),
                      routeMarkColors,
                    )
                  }
                </div>
                <button
                  type="button"
                  onClick={this.removeColor}
                  className={css(styles.markColorPickerButton)}
                >
                  Сбросить цвет
                </button>
              </div>
            )
          }
        </div>
      );
    }
}

RouteColorPicker.propTypes = {
  onSelect: PropTypes.func,
  routeMarkColors: PropTypes.array,
  route: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  fieldName: PropTypes.string.isRequired,
};

RouteColorPicker.defaultProps = {
  onSelect: null,
  routeMarkColors: null,
};
