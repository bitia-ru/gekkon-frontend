import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { CATEGORIES } from '../../Constants/Categories';
import './CategorySlider.css';

export default class CategorySlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };
  }

  componentDidMount() {
    this.wrapperRef.focus();
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

    onKeyDown = (event) => {
      const { category, changeCategory, hide } = this.props;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const index = R.findIndex(c => c === category)(CATEGORIES);
        if (index + 1 < CATEGORIES.length) {
          changeCategory(CATEGORIES[index + 1]);
        }
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const index = R.findIndex(c => c === category)(CATEGORIES);
        if (index > 0) {
          changeCategory(CATEGORIES[index - 1]);
        }
      }
      if (event.key === 'Enter') {
        hide();
      }
    };


    startChange = () => {
      this.setState({ editing: true });
    };

    change = (event) => {
      const { changeCategory } = this.props;
      const { editing } = this.state;
      if (editing) {
        const sliderBarRect = this.sliderBarRef.getBoundingClientRect();
        const dy = (event.nativeEvent.clientY - sliderBarRect.top) / sliderBarRect.height;
        let newPosition = (1 - dy) * 100;
        if (newPosition > 100) {
          newPosition = 100;
        }
        if (newPosition < 0) {
          newPosition = 0;
        }
        changeCategory(this.categoryFromPosition(newPosition));
      }
    };

    onMouseUp = (event) => {
      const { changeCategory } = this.props;
      const sliderBarRect = this.sliderBarRef.getBoundingClientRect();
      const dy = (event.nativeEvent.clientY - sliderBarRect.top) / sliderBarRect.height;
      let newPosition = (1 - dy) * 100;
      if (newPosition > 100) {
        newPosition = 100;
      }
      if (newPosition < 0) {
        newPosition = 0;
      }
      changeCategory(this.categoryFromPosition(newPosition));
      this.stopEditing();
    };

    stopEditing = () => {
      this.setState({ editing: false });
    };

    categoryFromPosition = (position) => {
      const categogyIndex = position / 100 * (CATEGORIES.length - 1);
      return CATEGORIES[parseInt(categogyIndex, 10)];
    };

    positionFromCategory = (category) => {
      const index = R.findIndex(c => c === category)(CATEGORIES);
      return 100 * index / (CATEGORIES.length - 1);
    };

    render() {
      const { hide, category } = this.props;
      return (
        <div
          className="category__slider category__slider_active"
          role="button"
          style={{ outline: 'none' }}
          ref={(ref) => {
            this.wrapperRef = ref;
          }}
          onBlur={() => hide()}
          tabIndex={0}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.stopEditing}
          onMouseMove={this.change}
        >
          <div className="category__slider-ruler">
            <div className="category__slider-ruler-item category__slider-ruler-item_first">
              {CATEGORIES[CATEGORIES.length - 1].toUpperCase()}
            </div>
            <div className="category__slider-ruler-item">
              {CATEGORIES[parseInt((CATEGORIES.length - 1) / 2, 10)].toUpperCase()}
            </div>
            <div className="category__slider-ruler-item category__slider-ruler-item_last">
              {CATEGORIES[0].toUpperCase()}
            </div>
          </div>
          <div
            className="category__slider-bar"
            ref={(ref) => {
              this.sliderBarRef = ref;
            }}
          >
            <div className="category__slider-bar-item category__slider-bar-item_first" />
            <div className="category__slider-bar-item category__slider-bar-item_middle" />
            <div className="category__slider-bar-item category__slider-bar-item_last" />
            <div
              className="category__slider-bar-handler"
              role="button"
              style={{ bottom: `calc(${this.positionFromCategory(category)}% - 4px` }}
              onMouseDown={this.startChange}
            />
          </div>
        </div>
      );
    }
}

CategorySlider.propTypes = {
  category: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};
